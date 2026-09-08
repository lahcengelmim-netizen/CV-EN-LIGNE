import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './LanguageSelector.css';

export interface LanguageItem {
  code: 'fr' | 'en' | 'ar';
  name: string;
  short: string;
  flag: string;
  dir: 'ltr' | 'rtl';
}

export const AVAILABLE_LANGUAGES: LanguageItem[] = [
  { code: 'fr', name: 'Français', short: 'FR', flag: '🇫🇷', dir: 'ltr' },
  { code: 'en', name: 'English', short: 'EN', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ar', name: 'العربية', short: 'AR', flag: '🇸🇦', dir: 'rtl' },
];

export interface LanguageSelectorProps {
  currentLang?: string;
  onLanguageChange?: (langCode: string) => void;
  className?: string;
  showFullName?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLang: propCurrentLang,
  onLanguageChange,
  className = '',
  showFullName = true,
}) => {
  const { language, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use context language by default, or prop if provided
  const activeCode = propCurrentLang || language || 'fr';
  const activeLanguage =
    AVAILABLE_LANGUAGES.find((lang) => lang.code === activeCode) ||
    AVAILABLE_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelectLanguage = (lang: LanguageItem) => {
    changeLanguage(lang.code);

    if (onLanguageChange) {
      onLanguageChange(lang.code);
    }

    setIsOpen(false);
  };

  return (
    <div className={`lang-dropdown-wrapper ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`lang-dropdown-trigger ${isOpen ? 'open' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-label={`Current language: ${activeLanguage.name}. Click to change language`}
      >
        <span className="lang-trigger-flag" role="img" aria-hidden="true">
          {activeLanguage.flag}
        </span>
        <span className="lang-trigger-code font-bold">{activeLanguage.short}</span>
        {showFullName && (
          <span className="lang-trigger-name hidden md:inline">
            {activeLanguage.name}
          </span>
        )}
        <svg
          className="lang-trigger-arrow"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isOpen && (
        <div
          className="lang-dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          aria-label="Language options"
        >
          {AVAILABLE_LANGUAGES.map((lang) => {
            const isSelected = lang.code === activeCode;
            return (
              <button
                key={lang.code}
                type="button"
                role="menuitem"
                onClick={() => handleSelectLanguage(lang)}
                className={`lang-menu-item ${isSelected ? 'active' : ''}`}
                aria-current={isSelected ? 'true' : 'false'}
              >
                <div className="lang-menu-item-left">
                  <span className="lang-menu-flag" role="img" aria-hidden="true">
                    {lang.flag}
                  </span>
                  <div className="lang-menu-info">
                    <span className="lang-menu-name font-medium">{lang.name}</span>
                    <span className="lang-menu-code">{lang.short}</span>
                  </div>
                </div>

                {isSelected && (
                  <svg
                    className="lang-menu-check"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;
