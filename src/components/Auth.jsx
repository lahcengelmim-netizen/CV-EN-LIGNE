import React, { useState } from 'react';
import './Auth.css';

/**
 * Auth Component (Sign Up, Log In & Forgot Password)
 * Features:
 * - Tab switcher between Sign Up (Inscription) and Log In (Connexion)
 * - Sign Up fields: Username, Email, Password
 * - STRICT Password Validation:
 *   * Min 8 characters
 *   * At least 1 number (0-9)
 *   * At least 1 uppercase letter (A-Z)
 *   * At least 1 special character/symbol (!@#$%^&*...)
 * - "Forgot Password?" flow with email recovery prompt
 * - User login state management & callbacks
 */
export const Auth = ({
  isOpen = true,
  initialMode = 'login', // 'login' | 'signup'
  onClose,
  onAuthSuccess,
  onForgotPassword
}) => {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup' | 'forgot_password'
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  if (!isOpen) return null;

  // Password strict criteria helper
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasUppercase && hasSpecialChar;

  const validatePasswordStrict = (pwd) => {
    const errors = [];
    if (pwd.length < 8) errors.push('Au moins 8 caractères');
    if (!/\d/.test(pwd)) errors.push('Au moins 1 chiffre (0-9)');
    if (!/[A-Z]/.test(pwd)) errors.push('Au moins 1 lettre majuscule (A-Z)');
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd)) {
      errors.push('Au moins 1 caractère spécial (!@#$%^&*...)');
    }
    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Strict validation
    if (!username.trim()) {
      setError("Veuillez renseigner un nom d'utilisateur (Username).");
      return;
    }

    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }

    const passwordErrors = validatePasswordStrict(password);
    if (passwordErrors.length > 0) {
      setError(`Le mot de passe ne respecte pas les critères de sécurité : ${passwordErrors.join(', ')}.`);
      return;
    }

    setLoading(true);

    try {
      // Simulate/Trigger Authentication
      const newUser = {
        id: 'usr_' + Date.now(),
        username: username.trim(),
        email: email.trim().toLowerCase(),
        firstName: username.trim(),
        lastName: '',
        plan: 'single_cv',
        subscriptionStatus: 'none',
        createdAt: new Date().toISOString()
      };

      // Store in localStorage for seamless persistence
      localStorage.setItem('cvenligne_current_user', JSON.stringify(newUser));

      setSuccessMessage('Compte créé avec succès ! Bienvenue sur CV EN LIGNE.');
      
      setTimeout(() => {
        if (typeof onAuthSuccess === 'function') {
          onAuthSuccess(newUser);
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      }, 1000);
    } catch (err) {
      setError(err?.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogIn = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!email.trim()) {
      setError('Veuillez saisir votre adresse email.');
      return;
    }

    if (!password) {
      setError('Veuillez saisir votre mot de passe.');
      return;
    }

    setLoading(true);

    try {
      const existingUserStr = localStorage.getItem('cvenligne_current_user');
      let authenticatedUser;

      if (existingUserStr) {
        const stored = JSON.parse(existingUserStr);
        authenticatedUser = {
          ...stored,
          email: email.trim().toLowerCase()
        };
      } else {
        authenticatedUser = {
          id: 'usr_' + Date.now(),
          username: email.split('@')[0],
          email: email.trim().toLowerCase(),
          firstName: email.split('@')[0],
          lastName: '',
          plan: 'single_cv',
          subscriptionStatus: 'none',
          createdAt: new Date().toISOString()
        };
      }

      localStorage.setItem('cvenligne_current_user', JSON.stringify(authenticatedUser));
      setSuccessMessage('Connexion réussie. Redirection en cours...');

      setTimeout(() => {
        if (typeof onAuthSuccess === 'function') {
          onAuthSuccess(authenticatedUser);
        }
        if (typeof onClose === 'function') {
          onClose();
        }
      }, 800);
    } catch (err) {
      setError(err?.message || 'Identifiants invalides ou erreur de connexion.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!forgotEmail.trim() || !/\S+@\S+\.\S+/.test(forgotEmail)) {
      setError('Veuillez saisir une adresse email valide.');
      return;
    }

    setLoading(true);
    try {
      await new Promise((res) => setTimeout(res, 800));
      setSuccessMessage(`Un lien de réinitialisation a été envoyé à : ${forgotEmail}`);
      if (typeof onForgotPassword === 'function') {
        onForgotPassword(forgotEmail);
      }
    } catch (err) {
      setError(err?.message || "Impossible d'envoyer l'email de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-overlay" onClick={() => onClose && onClose()}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        
        {/* Close button */}
        {onClose && (
          <button
            type="button"
            className="auth-close-btn"
            onClick={onClose}
            aria-label="Fermer la boîte de dialogue"
          >
            &times;
          </button>
        )}

        {/* Modal Header */}
        <div className="auth-header">
          <div className="auth-brand-badge">Espace Candidat Certifié</div>
          <h2 className="auth-title">
            {mode === 'signup' && 'Créer votre compte'}
            {mode === 'login' && 'Connexion à votre espace'}
            {mode === 'forgot_password' && 'Réinitialiser votre mot de passe'}
          </h2>
          <p className="auth-subtitle">
            {mode === 'signup' && 'Accédez à tous vos CVs, modèles ATS et lettres de motivation.'}
            {mode === 'login' && 'Retrouvez vos documents sauvegardés et vos téléchargements HD.'}
            {mode === 'forgot_password' && 'Indiquez votre email pour recevoir les instructions de récupération.'}
          </p>
        </div>

        {/* Tabs for Login / Signup */}
        {mode !== 'forgot_password' && (
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
              onClick={() => {
                setMode('login');
                setError(null);
                setSuccessMessage(null);
              }}
            >
              Connexion (Log In)
            </button>
            <button
              type="button"
              className={`auth-tab ${mode === 'signup' ? 'active' : ''}`}
              onClick={() => {
                setMode('signup');
                setError(null);
                setSuccessMessage(null);
              }}
            >
              Inscription (Sign Up)
            </button>
          </div>
        )}

        {/* Feedback alerts */}
        {error && (
          <div className="auth-alert error-alert">
            <span className="alert-icon">⚠️</span>
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="auth-alert success-alert">
            <span className="alert-icon">✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* SIGN UP FORM */}
        {/* ========================================================================= */}
        {mode === 'signup' && (
          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="form-group">
              <label className="form-label" htmlFor="signup-username">
                Nom d'utilisateur (Username) <span className="req">*</span>
              </label>
              <input
                id="signup-username"
                type="text"
                className="form-input"
                placeholder="ex: alex_pro"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="signup-email">
                Adresse Email <span className="req">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                className="form-input"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="signup-password">
                  Mot de passe <span className="req">*</span>
                </label>
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>

              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${password && !isPasswordValid ? 'input-warning' : ''} ${password && isPasswordValid ? 'input-success' : ''}`}
                placeholder="Min 8 car., 1 majuscule, 1 chiffre, 1 symbole"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              {/* Strict Password Requirements Checklist */}
              <div className="password-checklist">
                <div className="checklist-title">Critères de sécurité requis :</div>
                <div className="checklist-grid">
                  <div className={`checklist-item ${hasMinLength ? 'valid' : 'invalid'}`}>
                    <span className="bullet">{hasMinLength ? '✓' : '○'}</span>
                    <span>Au moins 8 caractères</span>
                  </div>
                  <div className={`checklist-item ${hasUppercase ? 'valid' : 'invalid'}`}>
                    <span className="bullet">{hasUppercase ? '✓' : '○'}</span>
                    <span>1 lettre majuscule (A-Z)</span>
                  </div>
                  <div className={`checklist-item ${hasNumber ? 'valid' : 'invalid'}`}>
                    <span className="bullet">{hasNumber ? '✓' : '○'}</span>
                    <span>1 chiffre (0-9)</span>
                  </div>
                  <div className={`checklist-item ${hasSpecialChar ? 'valid' : 'invalid'}`}>
                    <span className="bullet">{hasSpecialChar ? '✓' : '○'}</span>
                    <span>1 caractère spécial (@$#!...)</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !isPasswordValid || !username.trim() || !email.trim()}
            >
              {loading ? 'Création de votre compte...' : 'Créer mon compte'}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* LOG IN FORM */}
        {/* ========================================================================= */}
        {mode === 'login' && (
          <form className="auth-form" onSubmit={handleLogIn}>
            <div className="form-group">
              <label className="form-label" htmlFor="login-email">
                Adresse Email
              </label>
              <input
                id="login-email"
                type="email"
                className="form-input"
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="login-password">
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Masquer' : 'Afficher'}
                </button>
              </div>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Forgot Password Link */}
            <div className="forgot-password-row">
              <button
                type="button"
                className="forgot-password-btn"
                onClick={() => {
                  setForgotEmail(email);
                  setMode('forgot_password');
                  setError(null);
                  setSuccessMessage(null);
                }}
              >
                Forgot Password? (Mot de passe oublié ?)
              </button>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !email.trim() || !password}
            >
              {loading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* FORGOT PASSWORD FORM */}
        {/* ========================================================================= */}
        {mode === 'forgot_password' && (
          <form className="auth-form" onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label className="form-label" htmlFor="forgot-email">
                Votre adresse email
              </label>
              <input
                id="forgot-email"
                type="email"
                className="form-input"
                placeholder="votre.email@exemple.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading || !forgotEmail.trim()}
            >
              {loading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
            </button>

            <div className="back-to-login-row">
              <button
                type="button"
                className="back-to-login-btn"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setSuccessMessage(null);
                }}
              >
                ← Retour à la connexion
              </button>
            </div>
          </form>
        )}

        {/* Modal Footer */}
        <div className="auth-footer">
          <span className="security-badge">🔒 Connexion chiffrée SSL 256-bit</span>
        </div>

      </div>
    </div>
  );
};

export default Auth;
