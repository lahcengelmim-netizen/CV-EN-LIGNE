import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export interface LogoProps {
  /** Size preset for the logo image */
  size?: 'sm' | 'md' | 'lg';
  /** Color theme variant for background contrast */
  variant?: 'light' | 'dark' | 'auto';
  /** Show the official tagline below the brand mark */
  showTagline?: boolean;
  /** Custom click handler or navigation trigger */
  onClick?: () => void;
  /** Whether the logo links to '/' */
  linkToHome?: boolean;
  /** Additional container classes */
  className?: string;
  /** Additional image element classes */
  imageClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'auto',
  showTagline = false,
  onClick,
  linkToHome = true,
  className = '',
  imageClassName = '',
}) => {
  const [imageError, setImageError] = useState(false);

  // Responsive height presets strictly honoring h-10 to h-12 as specified
  const sizeClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-10 sm:h-12',
    lg: 'h-12 sm:h-14',
  }[size];

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    } else if (linkToHome) {
      if (typeof window !== 'undefined' && window.location.pathname !== '/') {
        window.history.pushState({}, '', '/');
      }
    }
  };

  const isDark = variant === 'dark';

  return (
    <div
      onClick={handleClick}
      className={`group inline-flex items-center gap-2 select-none cursor-pointer transition-transform duration-150 ${className}`}
      role="link"
      tabIndex={0}
      title="SIRATI-Ai - AI-Powered Career Intelligence"
    >
      {!imageError ? (
        <div className="relative flex items-center">
          <img
            src="/logo.png"
            alt="SIRATI-Ai - AI-Powered Career Intelligence"
            className={`${sizeClasses} w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02] ${imageClassName}`}
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        /* Dynamic SVG + Typographic Fallback preserving brand consistency */
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3B82F6] via-[#7C3AED] to-[#A855F7] shadow-sm text-white font-black text-lg tracking-tight">
            <span className="font-extrabold">S</span>
            <Sparkles className="w-3 h-3 absolute top-1 right-1 text-purple-200 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className={`text-xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#0A1128]'}`}>
                SIRATI
              </span>
              <span className="ml-1 text-xl font-black bg-gradient-to-r from-[#7C3AED] to-[#A855F7] bg-clip-text text-transparent">
                -Ai
              </span>
            </div>
            {showTagline && (
              <span className={`text-[10px] font-semibold tracking-wider uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                AI-Powered Career Intelligence
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Logo;
