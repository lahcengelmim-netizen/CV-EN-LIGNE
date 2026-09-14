import React, { useState, useEffect } from 'react';
import { Compass, Home, Lock } from 'lucide-react';

interface NotFoundPageProps {
  onGoHome: () => void;
  onUnlockAdmin?: () => void;
  isObfuscatedAdminRoute?: boolean;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onGoHome,
  onUnlockAdmin,
  isObfuscatedAdminRoute = false,
}) => {
  const [clickCount, setClickCount] = useState(0);

  // Hidden keyboard listener: Ctrl+Shift+A or Alt+A opens the admin challenge if on obfuscated route
  useEffect(() => {
    if (!onUnlockAdmin) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        onUnlockAdmin();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onUnlockAdmin]);

  const handleSecretTrigger = () => {
    if (!onUnlockAdmin) return;
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= 3) {
      setClickCount(0);
      onUnlockAdmin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6 relative select-none">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 max-w-md w-full text-center space-y-6">
        {/* 404 Icon & Badge */}
        <div className="inline-flex items-center justify-center p-4 bg-slate-800/80 rounded-3xl border border-slate-700/60 shadow-xl mb-2">
          <Compass className="w-12 h-12 text-slate-400 stroke-[1.5]" />
        </div>

        {/* 404 Heading with hidden multi-click trigger */}
        <div>
          <h1 
            onClick={handleSecretTrigger}
            className="text-7xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-slate-200 to-slate-500 tracking-tight cursor-default"
            title={isObfuscatedAdminRoute ? "404" : undefined}
          >
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-100 mt-2">
            Page Introuvable
          </h2>
          <p className="text-sm text-slate-400 mt-3 leading-relaxed">
            L'adresse demandée est incorrecte, n'existe pas ou a été déplacée vers un nouvel emplacement.
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onGoHome}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Retour à l'accueil</span>
          </button>

          {isObfuscatedAdminRoute && onUnlockAdmin && (
            <button
              onClick={onUnlockAdmin}
              className="px-3 py-3 text-slate-600 hover:text-slate-400 transition-colors rounded-xl text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer opacity-40 hover:opacity-100"
              title="Authentification requise"
            >
              <Lock className="w-3.5 h-3.5" />
              <span className="text-[11px]">Accès sécurisé</span>
            </button>
          )}
        </div>

        {/* Discreet Footer Note */}
        <div className="pt-12 text-[11px] text-slate-600">
          Code d'erreur : 404_HTTP_NOT_FOUND &bull; Route non indexée
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
