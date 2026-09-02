import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, { updateDocumentDirection } from './lib/i18n';
import { CVData, LanguageCode, TemplateId } from './types';
import { storageService, supabase } from './lib/supabase';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { CVBuilder } from './components/builder/CVBuilder';
import { AuthModal } from './components/auth/AuthModal';
import { AdminPortal } from './components/admin/AdminPortal';
import { CareerBackground } from './components/layout/CareerBackground';
import { adminService } from './lib/adminService';
import { getTemplateById } from './lib/templatesData';

export const App: React.FC = () => {
  const { i18n: i18nInstance } = useTranslation();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard' | 'builder' | 'admin'>('landing');
  const [lang, setLang] = useState<LanguageCode>(() => {
    const validLangs: LanguageCode[] = ['en', 'fr', 'ar', 'es', 'de', 'it', 'pt', 'zh'];
    const saved = (typeof window !== 'undefined' ? localStorage.getItem('cvenligne_lang') : null) as LanguageCode;
    if (saved && validLangs.includes(saved)) {
      return saved;
    }
    const current = i18n.language ? (i18n.language.substring(0, 2) as LanguageCode) : 'en';
    return validLangs.includes(current) ? current : 'en';
  });

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLang(newLang);
    if (i18n && i18n.changeLanguage) {
      i18n.changeLanguage(newLang);
    }
    updateDocumentDirection(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('cvenligne_lang', newLang);
    }
  };

  useEffect(() => {
    updateDocumentDirection(lang);
  }, [lang]);

  const [user, setUser] = useState<any>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [cvList, setCvList] = useState<CVData[]>([]);
  const [activeCv, setActiveCv] = useState<CVData | null>(null);

  // Check URL pathname or hash for /admin on load
  useEffect(() => {
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path.includes('/admin') || hash === '#admin') {
      setCurrentView('admin');
    }
  }, []);

  // Initialize Auth & Load CVs
  useEffect(() => {
    // 1. Check current session
    if (supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          setUser(session.user);
        }
      });

      const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null);
      });

      return () => {
        authListener.subscription.unsubscribe();
      };
    } else {
      // Local storage fallback for session
      const savedUser = localStorage.getItem('cvenligne_current_user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          // ignore
        }
      }
    }
  }, []);

  // Load CV list
  const refreshCVList = async () => {
    const list = await storageService.getCVs();
    setCvList(list);
  };

  useEffect(() => {
    refreshCVList();
  }, [user]);

  // Handle new CV creation with full template layout & sample data
  const handleCreateNewCV = (templateId: TemplateId = 'stockholm-modern') => {
    const tmplDef = getTemplateById(templateId);
    const sample = tmplDef.sampleCV;
    const newCV: CVData = {
      ...sample,
      id: 'cv_' + Math.random().toString(36).substring(2, 9),
      userId: user?.id,
      title: `Mon CV (${tmplDef.name})`,
      templateId,
      isPaid: false,
      language: lang,
      personalInfo: {
        ...sample.personalInfo,
        email: user?.email || sample.personalInfo?.email || '',
      },
      experiences: sample.experiences ? JSON.parse(JSON.stringify(sample.experiences)) : [],
      educations: sample.educations ? JSON.parse(JSON.stringify(sample.educations)) : [],
      skills: sample.skills ? JSON.parse(JSON.stringify(sample.skills)) : [],
      languages: sample.languages ? JSON.parse(JSON.stringify(sample.languages)) : [],
      certifications: sample.certifications ? JSON.parse(JSON.stringify(sample.certifications)) : [],
      projects: sample.projects ? JSON.parse(JSON.stringify(sample.projects)) : [],
      theme: {
        primaryColor: tmplDef.defaultColor || sample.theme?.primaryColor || '#0f766e',
        fontFamily: sample.theme?.fontFamily || (templateId === 'classic' ? 'serif' : templateId === 'minimal' ? 'mono' : 'sans'),
        spacing: sample.theme?.spacing || 'normal',
        showPhoto: sample.theme?.showPhoto !== undefined ? sample.theme.showPhoto : (templateId !== 'classic' && templateId !== 'minimal')
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setActiveCv(newCV);
    setCurrentView('builder');
  };

  // Select existing CV to edit
  const handleSelectCV = (cv: CVData) => {
    setActiveCv(cv);
    setCurrentView('builder');
  };

  // Duplicate CV
  const handleDuplicateCV = async (cv: CVData) => {
    const duplicated: CVData = {
      ...cv,
      id: 'cv_' + Math.random().toString(36).substring(2, 9),
      title: `${cv.title} (Copie)`,
      isPaid: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await storageService.saveCV(duplicated);
    await refreshCVList();
  };

  // Delete CV
  const handleDeleteCV = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce CV ?')) {
      await storageService.deleteCV(id);
      await refreshCVList();
      if (activeCv?.id === id) {
        setActiveCv(null);
        setCurrentView('dashboard');
      }
    }
  };

  // Sign out
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('cvenligne_current_user');
    setUser(null);
    setCurrentView('landing');
  };

  // Direction RTL if Arabic
  const isRtl = lang === 'ar';

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50/70 text-slate-800 relative ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Background Graphic Identity */}
      <CareerBackground />

      {/* Top Navbar */}
      {currentView !== 'builder' && currentView !== 'admin' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          lang={lang}
          onLanguageChange={handleLanguageChange}
          user={user}
          onOpenAuth={() => setIsAuthModalOpen(true)}
          onSignOut={handleSignOut}
          onNewCV={() => handleCreateNewCV('stockholm-modern')}
        />
      )}

      {/* Main View Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingPage
            onStartCV={(tmpl) => handleCreateNewCV(tmpl || 'stockholm-modern')}
            lang={lang}
          />
        )}

        {currentView === 'dashboard' && (
          <Dashboard
            cvList={cvList}
            onSelectCV={handleSelectCV}
            onNewCV={() => handleCreateNewCV('stockholm-modern')}
            onDuplicateCV={handleDuplicateCV}
            onDeleteCV={handleDeleteCV}
            lang={lang}
            user={user}
          />
        )}

        {currentView === 'builder' && activeCv && (
          <CVBuilder
            initialCv={activeCv}
            lang={lang}
            onBackToDashboard={() => {
              refreshCVList();
              setCurrentView(user ? 'dashboard' : 'landing');
            }}
            onLanguageChange={handleLanguageChange}
          />
        )}

        {currentView === 'admin' && (
          <AdminPortal
            onBackToSite={() => setCurrentView('landing')}
            currentUser={user}
          />
        )}
      </main>

      {/* Footer */}
      {currentView !== 'builder' && currentView !== 'admin' && (
        <Footer lang={lang} onNavigate={(view) => setCurrentView(view)} />
      )}

      {/* Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onSuccess={(loggedInUser) => {
            setUser(loggedInUser);
            refreshCVList();
          }}
          lang={lang}
        />
      )}
    </div>
  );
};

export default App;
