import React, { useState } from 'react';
import Navbar from './components/Navbar';
import CVPreview, { PRESET_COLORS } from './components/CVPreview';
import { translations } from './utils/translations';
import { exportCVToPDF } from './lib/pdf';

/**
 * App.jsx - Application Principale CV-EN-LIGNE
 * 
 * INTÉGRATION STRICTE DES CONSIGNES :
 * 1. Séparation stricte : Traduction t() appliquée UNIQUEMENT à l'interface (Navbar, Boutons, Labels).
 * 2. Le CV reste 100% BRUT (RAW) sans aucun appel t() à l'intérieur.
 * 3. Aperçu au format A4 réel (Ratio 1 : 1.414 / 210mm x 297mm) avec ombre papier et fond contrasté.
 * 4. Gestion de la couleur personnalisée (themeColor) appliquée en temps réel sur le CV et conservée pour l'export PDF.
 */
export default function App() {
  // 1. Langue active de l'interface
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('cvenligne_lang') || 'fr';
  });

  // 2. Couleur du thème du CV (Bleu Marine par défaut)
  const [themeColor, setThemeColor] = useState('#1e3a8a');

  // 3. Indicateur de téléchargement PDF
  const [isDownloading, setIsDownloading] = useState(false);

  // 4. Fonction de traduction UNIQUEMENT pour l'interface UI
  const t = (path, fallback) => {
    const keys = path.split('.');
    let res = translations[currentLang] || translations.fr;
    for (const k of keys) {
      if (res && res[k] !== undefined) res = res[k];
      else return fallback || path;
    }
    return typeof res === 'string' ? res : (fallback || path);
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    localStorage.setItem('cvenligne_lang', langCode);
  };

  // 5. Données du CV saisies par l'utilisateur (RAW DATA)
  const [formData, setFormData] = useState({
    fullName: 'Alexandre Martin',
    jobTitle: 'Développeur Full-Stack Senior',
    email: 'alexandre.martin@example.com',
    phone: '+33 6 12 34 56 78',
    city: 'Paris',
    country: 'France',
    summary: 'Ingénieur logiciel passionné avec plus de 6 ans d\'expérience dans la conception d\'applications web scalables et réactives. Expert en architecture JavaScript moderne (React, Node.js) et intégration continue.',
    sectionTitles: {
      profile: 'Profil Professionnel',
      experience: 'Expériences Professionnelles',
      education: 'Formations & Diplômes',
      skills: 'Compétences Techniques',
      languages: 'Langues',
    },
    experiences: [
      {
        id: 'exp-1',
        position: 'Lead Tech Frontend',
        company: 'Innovatech Solutions',
        city: 'Paris',
        startDate: '2021',
        endDate: 'Présent',
        current: true,
        description: 'Direction technique d\'une équipe de 6 développeurs sur la refonte de la plateforme SaaS principale.',
        tasks: [
          'Amélioration des performances de chargement de 45% grâce au code splitting et cache HTTP',
          'Mise en place d\'un Design System complet en React et Tailwind CSS',
        ],
      },
      {
        id: 'exp-2',
        position: 'Développeur Full-Stack',
        company: 'Digital Factory',
        city: 'Lyon',
        startDate: '2018',
        endDate: '2021',
        current: false,
        description: 'Développement d\'APIs REST performantes en Node.js et création d\'interfaces web responsives.',
        tasks: [
          'Intégration de solutions de paiement Stripe et authentification OAuth',
        ],
      }
    ],
    educations: [
      {
        id: 'edu-1',
        degree: 'Master Expert en Informatique & Systèmes d\'Information',
        institution: 'École Supérieure du Numérique',
        city: 'Paris',
        startDate: '2016',
        endDate: '2018',
        description: 'Spécialisation Architecture Logicielle & Cloud Computing',
      }
    ],
    skills: [
      'React.js',
      'TypeScript',
      'Node.js / Express',
      'Tailwind CSS',
      'PostgreSQL',
      'Docker & CI/CD',
    ],
    languages: [
      { id: 'lang-1', language: 'Français', level: 'Langue maternelle' },
      { id: 'lang-2', language: 'Anglais', level: 'Courant / C1' },
      { id: 'lang-3', language: 'Espagnol', level: 'Intermédiaire / B1' },
    ]
  });

  // 6. Gestion du téléchargement du PDF au format A4 avec conservation des couleurs
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const name = formData.fullName?.trim() || 'Alexandre_Martin';
      const fileName = `${name.replace(/\s+/g, '_')}_CV.pdf`;
      const success = await exportCVToPDF({
        fileName,
        elementId: 'cv-printable-document',
      });
      if (!success) {
        window.print();
      }
    } catch (err) {
      console.error('Erreur lors du téléchargement du PDF:', err);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col">
      {/* Barre de navigation (Interface traduite) */}
      <Navbar
        currentLang={currentLang}
        onLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* Zone de travail principale - 2 Colonnes équilibrées */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 editor-layout">
        
        {/* =========================================================================
            COLONNE GAUCHE : Formulaire d'Édition (Labels traduits via t(), Inputs RAW)
            ========================================================================= */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 w-full">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900">
              {t('form.personalInfo', 'Informations personnelles')}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {t('form.personalInfoSubtitle', 'Remplissez vos coordonnées réelles')}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form.fullNameLabel', 'Nom complet')}
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form.jobTitleLabel', 'Poste recherché')}
              </label>
              <input
                type="text"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('form.emailLabel', 'Email')}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('form.phoneLabel', 'Téléphone')}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('form.summaryLabel', 'Profil / Résumé professionnel')}
              </label>
              <textarea
                rows={4}
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            COLONNE DROITE : Aperçu A4 Réel & Sélecteur de Couleur (CVPreview)
            ========================================================================= */}
        <section className="preview-column sticky top-20">
          <CVPreview
            formData={formData}
            themeColor={themeColor}
            onColorChange={setThemeColor}
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
            t={t}
          />
        </section>

      </main>
    </div>
  );
}
