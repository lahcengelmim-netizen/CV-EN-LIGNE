import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Mail, Lock, User, Sparkles, Loader2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { activityTracker } from '../../lib/activityTracker';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
  lang?: LanguageCode;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  lang = 'fr'
}) => {
  const t = translations[lang] || translations.fr;
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (supabase) {
        if (isSignUp) {
          const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: { full_name: fullName }
            }
          });
          if (signUpError) throw signUpError;
          if (data.user) {
            activityTracker.updateUser({
              userId: data.user.id,
              userEmail: email,
              userName: fullName || email.split('@')[0],
              role: 'user'
            });
            activityTracker.logAction('signup', 'Nouvelle Inscription', `Création de compte réussie (${email})`);
            onSuccess(data.user);
            onClose();
          } else {
            setSuccessMsg('Compte créé ! Vérifiez vos emails si nécessaire.');
          }
        } else {
          const { data, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (signInError) throw signInError;
          if (data.user) {
            activityTracker.updateUser({
              userId: data.user.id,
              userEmail: email,
              userName: data.user.user_metadata?.full_name || email.split('@')[0],
              role: 'user'
            });
            activityTracker.logAction('login', 'Connexion Utilisateur', `Connexion réussie (${email})`);
            onSuccess(data.user);
            onClose();
          }
        }
      } else {
        // Fallback for offline / instant session
        const mockUser = {
          id: 'user_' + Math.random().toString(36).substring(2, 9),
          email,
          user_metadata: { full_name: fullName || email.split('@')[0] }
        };
        localStorage.setItem('cvenligne_current_user', JSON.stringify(mockUser));
        activityTracker.updateUser({
          userId: mockUser.id,
          userEmail: email,
          userName: fullName || email.split('@')[0],
          role: 'user'
        });
        activityTracker.logAction(
          isSignUp ? 'signup' : 'login',
          isSignUp ? 'Nouvelle Inscription' : 'Connexion Utilisateur',
          isSignUp ? `Inscription réussie (${email})` : `Connexion (${email})`
        );
        onSuccess(mockUser);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue lors de l\'authentification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-between mb-3">
            <div className="bg-white px-2.5 py-1 rounded-xl shadow-xs inline-flex items-center">
              <img
                src="/images/logo.jpg"
                alt="VITAREY"
                className="h-6 w-auto object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-bold uppercase rounded-full">
              {isSignUp ? 'Nouveau compte' : 'Espace Utilisateur'}
            </span>
          </div>
          <h3 className="text-xl font-black tracking-tight">
            {isSignUp ? 'Créer mon compte VITAREY' : 'Connexion à VITAREY'}
          </h3>
          <p className="text-xs text-blue-100 mt-1">
            {isSignUp
              ? 'Sauvegardez vos CVs et accédez-y depuis tous vos appareils'
              : 'Retrouvez vos CVs en cours et vos téléchargements'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Nom & Prénom
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Alexandre Dubois"
                    className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="votre.email@exemple.com"
                  className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
                {error}
              </div>
            )}

            {successMsg && (
              <div className="p-3 bg-emerald-50 text-emerald-700 text-xs rounded-xl border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isSignUp ? 'Créer mon compte' : 'Me connecter'}</span>
            </button>
          </form>

          {/* Switch signup/login */}
          <div className="text-center pt-2 border-t border-slate-200 text-xs text-slate-500">
            {isSignUp ? (
              <span>
                Vous avez déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(false)}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Se connecter
                </button>
              </span>
            ) : (
              <span>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => setIsSignUp(true)}
                  className="text-blue-600 hover:underline font-bold"
                >
                  Créer un compte
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
