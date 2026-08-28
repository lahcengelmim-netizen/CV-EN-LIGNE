import React, { useState, useEffect } from 'react';
import { CVData, LanguageCode, TemplateId, CVTheme } from '../../types';
import { translations } from '../../lib/translations';
import { storageService } from '../../lib/supabase';
import { exportCVToPDF, triggerNativePrint } from '../../lib/pdf';
import { CVRenderer } from '../templates/CVRenderer';
import { StepPersonalInfo } from './StepPersonalInfo';
import { StepProfile } from './StepProfile';
import { StepExperience } from './StepExperience';
import { StepEducation } from './StepEducation';
import { StepSkills } from './StepSkills';
import { StepLanguages } from './StepLanguages';
import { StepCertificationsProjects } from './StepCertificationsProjects';
import { StepTemplateCustomizer } from './StepTemplateCustomizer';
import { TemplateSwitcherModal } from './TemplateSwitcherModal';
import { getTemplateById } from '../../lib/templatesData';
import { PaymentModal } from '../payment/PaymentModal';
import { CoverLetterModal } from '../cover-letter/CoverLetterModal';
import {
  ArrowLeft,
  ArrowRight,
  Download,
  Printer,
  Sparkles,
  Lock,
  CheckCircle2,
  Eye,
  Edit,
  Save,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  FileText,
  ShieldCheck,
  Check,
  Layout,
  Maximize2,
  Palette
} from 'lucide-react';

interface CVBuilderProps {
  initialCv?: CVData;
  lang?: LanguageCode;
  onBackToDashboard?: () => void;
  onLanguageChange?: (lang: LanguageCode) => void;
}

const DEFAULT_CV: CVData = {
  id: 'cv_' + Math.random().toString(36).substring(2, 9),
  title: 'Mon CV Professionnel',
  templateId: 'modern',
  isPaid: false,
  language: 'fr',
  personalInfo: {
    firstName: 'Alexandre',
    lastName: 'Dubois',
    title: 'Développeur Full Stack Web & Mobile',
    email: 'alexandre.dubois@email.com',
    phone: '+33 6 45 78 92 10',
    city: 'Paris',
    country: 'France',
    linkedin: 'linkedin.com/in/alexandre-dubois',
    website: 'alexandredubois.dev',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80'
  },
  summary: 'Développeur passionné avec 4 années d\'expérience dans la conception d\'applications web performantes et intuitives. Spécialisé en React, TypeScript et Node.js, je m\'attache à livrer des solutions logicielles scalables et centrées sur l\'expérience utilisateur.',
  experiences: [
    {
      id: 'exp_1',
      position: 'Développeur React Senior',
      company: 'Tech Solutions Paris',
      city: 'Paris',
      startDate: '2022',
      endDate: '',
      current: true,
      description: 'Pilotage de la refonte de la plateforme e-commerce principale et encadrement technique d\'une équipe de 3 développeurs.',
      tasks: [
        'Amélioration des performances de chargement de 35% grâce à l\'optimisation du bundle',
        'Développement d\'une suite de composants réutilisables selon le Design System',
        'Mise en place de tests automatisés réduisant les anomalies de production de 25%'
      ]
    },
    {
      id: 'exp_2',
      position: 'Développeur Front-End',
      company: 'Digital Wave Agency',
      city: 'Lyon',
      startDate: '2020',
      endDate: '2022',
      current: false,
      description: 'Intégration d\'interfaces web responsives et dynamiques pour des clients grands comptes.',
      tasks: [
        'Création de plus de 15 sites web vitrines et portails clients en React & Tailwind',
        'Collaboration étroite avec l\'équipe UI/UX pour garantir l\'accessibilité'
      ]
    }
  ],
  educations: [
    {
      id: 'edu_1',
      degree: 'Master Expert en Informatique et Systèmes d\'Information',
      institution: 'École Supérieure du Numérique',
      city: 'Paris',
      startDate: '2018',
      endDate: '2020',
      current: false,
      description: 'Major de promotion, spécialité Ingénierie Logicielle'
    },
    {
      id: 'edu_2',
      degree: 'Licence Informatique Générale',
      institution: 'Université Sorbonne Paris Nord',
      city: 'Paris',
      startDate: '2015',
      endDate: '2018',
      current: false
    }
  ],
  skills: [
    { id: 'sk_1', name: 'React & React Native', level: 5 },
    { id: 'sk_2', name: 'TypeScript & JavaScript', level: 5 },
    { id: 'sk_3', name: 'Node.js & Express', level: 4 },
    { id: 'sk_4', name: 'Tailwind CSS', level: 5 },
    { id: 'sk_5', name: 'PostgreSQL & Supabase', level: 4 },
    { id: 'sk_6', name: 'Git, CI/CD & Docker', level: 4 }
  ],
  languages: [
    { id: 'lang_1', language: 'Français', level: 'Langue maternelle' },
    { id: 'lang_2', language: 'Anglais', level: 'Courant professionnel / C1' },
    { id: 'lang_3', language: 'Espagnol', level: 'Intermédiaire / B1' }
  ],
  certifications: [
    { id: 'cert_1', title: 'AWS Certified Cloud Practitioner', organization: 'Amazon Web Services', date: '2023' }
  ],
  projects: [
    { id: 'proj_1', title: 'Plateforme SaaS de Facturation', description: 'Application complète en micro-services utilisée par 500+ PME.' }
  ],
  theme: {
    primaryColor: '#2563eb',
    fontFamily: 'sans',
    spacing: 'normal',
    showPhoto: true
  }
};

export const CVBuilder: React.FC<CVBuilderProps> = ({
  initialCv,
  lang = 'fr',
  onBackToDashboard,
  onLanguageChange
}) => {
  const t = translations[lang] || translations.fr;
  const [cv, setCv] = useState<CVData>(initialCv || DEFAULT_CV);
  const [currentStep, setCurrentStep] = useState(1);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [zoomScale, setZoomScale] = useState(0.85);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date>(new Date());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showCoverLetterModal, setShowCoverLetterModal] = useState(false);
  const [showTemplateSwitcherModal, setShowTemplateSwitcherModal] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [exportProgressText, setExportProgressText] = useState('');

  const totalSteps = 8;
  const currentTemplateDef = getTemplateById(cv.templateId);

  // Auto-save debounced
  useEffect(() => {
    setIsSaving(true);
    const timer = setTimeout(async () => {
      await storageService.saveCV(cv);
      setIsSaving(false);
      setLastSaved(new Date());
    }, 600);
    return () => clearTimeout(timer);
  }, [cv]);

  const updateCv = (fields: Partial<CVData>) => {
    setCv((prev) => ({ ...prev, ...fields, updatedAt: new Date().toISOString() }));
  };

  const handleDownloadPDF = async () => {
    if (!cv.isPaid) {
      setShowPaymentModal(true);
      return;
    }

    setIsExportingPDF(true);
    const fileName = `CV_${cv.personalInfo.firstName}_${cv.personalInfo.lastName}.pdf`.replace(/\s+/g, '_');
    await exportCVToPDF({
      fileName,
      elementId: 'cv-printable-document',
      onProgress: (status) => setExportProgressText(status)
    });
    setIsExportingPDF(false);
  };

  const handlePaymentSuccess = () => {
    updateCv({ isPaid: true });
    setShowPaymentModal(false);
    // Directly trigger PDF export
    setTimeout(() => {
      handleDownloadPDF();
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Top Builder Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {onBackToDashboard && (
              <button
                onClick={onBackToDashboard}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Mes CVs</span>
              </button>
            )}

            <div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={cv.title}
                  onChange={(e) => updateCv({ title: e.target.value })}
                  className="font-bold text-sm text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 focus:outline-hidden px-1"
                />
                {cv.isPaid && (
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    HD Payé
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 px-1">
                <span>{isSaving ? 'Enregistrement automatique...' : `Enregistré à ${lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}</span>
              </div>
            </div>
          </div>

          {/* Action Bar Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Template Switcher Button */}
            <button
              onClick={() => setShowTemplateSwitcherModal(true)}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-200"
              title="Changer de modèle de CV"
            >
              <Layout className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Modèle : {currentTemplateDef.title}</span>
              <span className="sm:hidden">Modèle</span>
            </button>

            {/* Cover letter assistant modal */}
            <button
              onClick={() => setShowCoverLetterModal(true)}
              className="px-3 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 border border-purple-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span className="hidden md:inline">{t.navCoverLetters}</span>
              <span className="md:hidden">Lettre IA</span>
            </button>

            {/* Print button */}
            <button
              onClick={triggerNativePrint}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors hidden sm:flex items-center"
              title="Imprimer"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Download / Pay Button */}
            {cv.isPaid ? (
              <button
                disabled={isExportingPDF}
                onClick={handleDownloadPDF}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>{isExportingPDF ? exportProgressText || 'Export...' : t.btnDownloadPdf}</span>
              </button>
            ) : (
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-yellow-300" />
                <span>Débloquer & Télécharger ($1.99)</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Switcher Tab */}
        <div className="flex sm:hidden border-t border-slate-200 bg-slate-50">
          <button
            onClick={() => setMobileTab('form')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
              mobileTab === 'form' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'
            }`}
          >
            <Edit className="w-3.5 h-3.5" />
            Formulaire ({currentStep}/{totalSteps})
          </button>
          <button
            onClick={() => setMobileTab('preview')}
            className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 ${
              mobileTab === 'preview' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-500'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            Aperçu Direct
          </button>
        </div>
      </header>

      {/* Main Workspace Layout - 2 Colonnes équilibrées */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 editor-layout items-start">
        {/* Left Form Wizard */}
        <div className={`w-full space-y-6 ${mobileTab === 'preview' ? 'hidden sm:block' : 'block'}`}>
          {/* Step Progress Pills */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-700">
                Étape {currentStep} sur {totalSteps}
              </span>
              <span className="text-xs text-blue-600 font-bold">
                {Math.round((currentStep / totalSteps) * 100)}% complété
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Quick Step Jump Tabs */}
            <div className="flex items-center justify-between gap-1 mt-3 overflow-x-auto pb-1 text-[11px] font-semibold text-slate-500">
              {[
                { s: 1, label: 'Infos' },
                { s: 2, label: 'Profil' },
                { s: 3, label: 'Expérience' },
                { s: 4, label: 'Formation' },
                { s: 5, label: 'Compétences' },
                { s: 6, label: 'Langues' },
                { s: 7, label: 'Projets' },
                { s: 8, label: 'Modèle' }
              ].map((item) => (
                <button
                  key={item.s}
                  onClick={() => setCurrentStep(item.s)}
                  className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    currentStep === item.s
                      ? 'bg-blue-600 text-white font-bold'
                      : currentStep > item.s
                      ? 'bg-blue-50 text-blue-700'
                      : 'hover:bg-slate-100'
                  }`}
                >
                  {item.s}. {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form Step Body Card */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            {currentStep === 1 && (
              <StepPersonalInfo
                info={cv.personalInfo}
                onChange={(personalInfo) => updateCv({ personalInfo })}
                lang={lang}
              />
            )}

            {currentStep === 2 && (
              <StepProfile
                summary={cv.summary}
                jobTitle={cv.personalInfo.title}
                skills={cv.skills.map((s) => s.name)}
                onChange={(summary) => updateCv({ summary })}
                lang={lang}
              />
            )}

            {currentStep === 3 && (
              <StepExperience
                experiences={cv.experiences}
                onChange={(experiences) => updateCv({ experiences })}
                lang={lang}
              />
            )}

            {currentStep === 4 && (
              <StepEducation
                educations={cv.educations}
                onChange={(educations) => updateCv({ educations })}
                lang={lang}
              />
            )}

            {currentStep === 5 && (
              <StepSkills
                skills={cv.skills}
                jobTitle={cv.personalInfo.title}
                onChange={(skills) => updateCv({ skills })}
                lang={lang}
              />
            )}

            {currentStep === 6 && (
              <StepLanguages
                languages={cv.languages}
                onChange={(languages) => updateCv({ languages })}
                lang={lang}
              />
            )}

            {currentStep === 7 && (
              <StepCertificationsProjects
                certifications={cv.certifications}
                projects={cv.projects}
                onCertificationsChange={(certifications) => updateCv({ certifications })}
                onProjectsChange={(projects) => updateCv({ projects })}
                lang={lang}
              />
            )}

            {currentStep === 8 && (
              <StepTemplateCustomizer
                templateId={cv.templateId}
                theme={cv.theme}
                onTemplateChange={(templateId) => updateCv({ templateId })}
                onThemeChange={(theme) => updateCv({ theme })}
                lang={lang}
              />
            )}

            {/* Bottom Wizard Navigation Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-8">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t.btnBack}</span>
              </button>

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <span>{t.btnNext}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!cv.isPaid) {
                      setShowPaymentModal(true);
                    } else {
                      handleDownloadPDF();
                    }
                  }}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Download className="w-4 h-4" />
                  <span>{cv.isPaid ? 'Télécharger en PDF HD' : 'Finaliser & Télécharger (2 $)'}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Live Preview Sticky */}
        <div className={`preview-column ${mobileTab === 'form' ? 'hidden lg:block' : 'block'}`}>
          <div className="sticky top-20 space-y-3">
            {/* Enhanced Preview Toolbar */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="font-bold text-xs text-slate-800">Aperçu en direct (A4)</span>
                  <span className="text-[10px] text-slate-400">Rendu temps réel</span>
                </div>

                {/* Zoom Controls */}
                <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-xl border border-slate-200/60">
                  <button
                    onClick={() => setZoomScale((s) => Math.max(0.45, Number((s - 0.05).toFixed(2))))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Zoom arrière"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setZoomScale(0.85)}
                    className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-700 hover:text-blue-600 cursor-pointer"
                    title="Réinitialiser zoom"
                  >
                    {Math.round(zoomScale * 100)}%
                  </button>
                  <button
                    onClick={() => setZoomScale((s) => Math.min(1.2, Number((s + 0.05).toFixed(2))))}
                    className="p-1 text-slate-600 hover:text-slate-900 hover:bg-white rounded-lg transition-colors cursor-pointer"
                    title="Zoom avant"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Template Quick Switcher Banner */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3.5 h-3.5 rounded-full shadow-2xs border border-white"
                    style={{ backgroundColor: cv.theme.primaryColor }}
                  />
                  <span className="text-xs font-semibold text-slate-700 truncate max-w-[160px]">
                    {currentTemplateDef.name}
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold">
                    ATS {currentTemplateDef.atsScore}%
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setShowTemplateSwitcherModal(true)}
                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Layout className="w-3 h-3 text-blue-600" />
                  <span>Changer de modèle</span>
                </button>
              </div>
            </div>

            {/* Live Document Paper Container with Scrollable Container */}
            <div className="bg-slate-300/70 p-3 sm:p-5 rounded-3xl border border-slate-300 overflow-x-auto flex justify-center max-h-[calc(100vh-175px)] overflow-y-auto shadow-inner">
              <div className="shadow-2xl rounded-lg overflow-hidden bg-white max-w-full">
                <CVRenderer
                  data={cv}
                  showWatermark={!cv.isPaid}
                  scale={zoomScale}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Bar on Mobile */}
      <div className="lg:hidden fixed bottom-5 right-5 z-40">
        <button
          onClick={() => setMobileTab((prev) => (prev === 'form' ? 'preview' : 'form'))}
          className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-2xl flex items-center gap-2 border border-slate-700 active:scale-95 transition-all"
        >
          {mobileTab === 'form' ? (
            <>
              <Eye className="w-4 h-4 text-blue-400" />
              <span>Voir mon CV en direct</span>
            </>
          ) : (
            <>
              <Edit className="w-4 h-4 text-emerald-400" />
              <span>Continuer la saisie</span>
            </>
          )}
        </button>
      </div>

      {/* Template Switcher Modal */}
      {showTemplateSwitcherModal && (
        <TemplateSwitcherModal
          isOpen={showTemplateSwitcherModal}
          onClose={() => setShowTemplateSwitcherModal(false)}
          currentTemplateId={cv.templateId}
          onSelectTemplate={(templateId) => updateCv({ templateId })}
        />
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          cvData={cv}
          lang={lang}
          onSuccess={handlePaymentSuccess}
        />
      )}

      {/* Cover Letter Modal */}
      {showCoverLetterModal && (
        <CoverLetterModal
          isOpen={showCoverLetterModal}
          onClose={() => setShowCoverLetterModal(false)}
          cvData={cv}
          lang={lang}
        />
      )}
    </div>
  );
};
