import React, { useState, useEffect, useRef } from 'react';
import { CVTemplateModern } from './CVTemplateModern';
import './CVPreview.css';

/**
 * PALETTE DE COULEURS PROFESSIONNELLES PRÉDÉFINIES
 */
export const PRESET_COLORS = [
  { id: 'royal', label: 'Bleu Royal', value: '#2563eb' },
  { id: 'navy', label: 'Bleu Marine', value: '#1e3a8a' },
  { id: 'black', label: 'Noir Élégant', value: '#0f172a' },
  { id: 'emerald', label: 'Vert Émeraude', value: '#047857' },
  { id: 'burgundy', label: 'Bordeaux', value: '#881337' },
  { id: 'charcoal', label: 'Gris Anthracite', value: '#334155' },
  { id: 'indigo', label: 'Indigo / Violet', value: '#4338ca' },
];

/**
 * OBJET STATIQUE DE SECOURS COMPLET (FULL FALLBACK DUMMY DATA)
 * Modèle standard et complet affiché dès l'ouverture et servant de fallback automatique.
 */
export const DEFAULT_CV = {
  fullName: 'Alexandre Martin',
  jobTitle: 'Chef de Projet Digital',
  email: 'alexandre.martin@email.com',
  phone: '+33 6 12 34 56 78',
  city: 'Paris, France',
  linkedin: 'linkedin.com/in/alexandremartin',
  summary:
    "Professionnel expérimenté avec 6 ans d'expertise dans la gestion de projets web et le management d'équipes agiles. Rigoureux, communicatif et orienté résultats, avec une solide culture technique et design.",
  experiences: [
    {
      id: 'exp-default-1',
      title: 'Chef de Projet Senior',
      company: 'Tech Solutions',
      period: '2021 - Présent',
      desc: "Pilotage d'équipes pluridisciplinaires de 8 personnes et gestion d'un budget annuel de 500k€.",
      tasks: [
        'Coordination des sprints Agile/Scrum et livraison continue de fonctionnalités SaaS',
        'Amélioration de la satisfaction client de 30% grâce à une refonte orientée UX',
      ],
    },
    {
      id: 'exp-default-2',
      title: 'Chef de Projet Junior',
      company: 'Web Agency',
      period: '2018 - 2021',
      desc: 'Conception de cahiers des charges fonctionnels et suivi opérationnel de production.',
      tasks: [
        'Gestion de la relation client et planification de plus de 20 projets web vitrines et e-commerce',
      ],
    },
  ],
  education: [
    {
      id: 'edu-default-1',
      degree: 'Master Management & Digital',
      school: 'Université Paris-Dauphine',
      period: '2016 - 2018',
      desc: 'Spécialisation transformation digitale des organisations et pilotage de la performance.',
    },
    {
      id: 'edu-default-2',
      degree: 'Licence Économie & Gestion',
      school: 'Université Paris 1 Panthéon-Sorbonne',
      period: '2013 - 2016',
      desc: 'Gestion de projet, analyse financière et statistiques appliquées.',
    },
  ],
  skills: ['Gestion de projet', 'Agile/Scrum', 'React', 'UI/UX Design', 'Jira / Trello', 'Analytics'],
  languages: [
    { language: 'Français', level: 'Natif' },
    { language: 'Anglais', level: 'Courant' },
    { language: 'Espagnol', level: 'Intermédiaire' },
  ],
};

/**
 * CVPreview.jsx - Aperçu A4 en Temps Réel avec Fusion Dynamique et Scaling Fidèle
 * - Partage le même composant de rendu que l'exportation PDF (CVTemplateModern)
 * - Rendu DOM direct (sans iframe) pour une synchronisation absolue avec html2canvas/html2pdf/print
 * - Fusion automatique des champs en temps réel sans jamais briser la mise en page
 */
export const CVPreview = ({
  formData = {},
  themeColor = '#1e3a8a',
  onColorChange,
  onDownloadPdf,
  isDownloading = false,
  t = (key, fallback) => fallback || key,
}) => {
  const containerRef = useRef(null);
  const [scale, setScale] = useState(0.55);
  const [userZoom, setUserZoom] = useState(null);

  // 1. Calcul dynamique du scale A4 adaptatif
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth > 0) {
        // La feuille fait 794px de large. On prévoit 24px de marge latérale
        const availableWidth = containerWidth - 24;
        const computedScale = Math.min(Math.max(availableWidth / 794, 0.38), 0.72);
        if (userZoom === null) {
          setScale(Number(computedScale.toFixed(3)));
        }
      }
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [userZoom]);

  const activeScale = userZoom !== null ? userZoom : scale;

  // 2. FUSION DYNAMIQUE DES DONNÉES (FULL FALLBACK MERGE)
  const displayData = {
    // Champs textuels simples
    fullName:
      formData.fullName && formData.fullName.trim() !== ''
        ? formData.fullName.trim()
        : [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim()
        ? [formData.firstName, formData.lastName].filter(Boolean).join(' ').trim()
        : DEFAULT_CV.fullName,

    jobTitle:
      formData.jobTitle && formData.jobTitle.trim() !== ''
        ? formData.jobTitle.trim()
        : formData.title && formData.title.trim() !== ''
        ? formData.title.trim()
        : DEFAULT_CV.jobTitle,

    email:
      formData.email && formData.email.trim() !== ''
        ? formData.email.trim()
        : DEFAULT_CV.email,

    phone:
      formData.phone && formData.phone.trim() !== ''
        ? formData.phone.trim()
        : DEFAULT_CV.phone,

    city:
      [formData.city, formData.country].filter(Boolean).join(', ').trim()
        ? [formData.city, formData.country].filter(Boolean).join(', ').trim()
        : formData.city && formData.city.trim() !== ''
        ? formData.city.trim()
        : DEFAULT_CV.city,

    linkedin:
      formData.linkedin && formData.linkedin.trim() !== ''
        ? formData.linkedin.trim()
        : DEFAULT_CV.linkedin,

    summary:
      formData.summary && formData.summary.trim() !== ''
        ? formData.summary.trim()
        : DEFAULT_CV.summary,

    sectionTitles: {
      contact: formData.sectionTitles?.contact || t('sections.contact', 'Coordonnées'),
      profile: formData.sectionTitles?.profile || t('sections.profile', 'Profil Professionnel'),
      experience: formData.sectionTitles?.experience || t('sections.experience', 'Expérience Professionnelle'),
      education: formData.sectionTitles?.education || t('sections.education', 'Formation & Diplômes'),
      skills: formData.sectionTitles?.skills || t('sections.skills', 'Compétences'),
      languages: formData.sectionTitles?.languages || t('sections.languages', 'Langues'),
    },

    // Tableaux dynamiques avec détection de contenu valide
    experiences: (() => {
      if (Array.isArray(formData.experiences) && formData.experiences.length > 0) {
        const hasValidExp = formData.experiences.some(
          (e) => (e.title && e.title.trim()) || (e.position && e.position.trim()) || (e.company && e.company.trim()) || (e.desc && e.desc.trim()) || (e.description && e.description.trim())
        );
        if (hasValidExp) return formData.experiences;
      }
      return DEFAULT_CV.experiences;
    })(),

    education: (() => {
      const userEduList = formData.education || formData.educations;
      if (Array.isArray(userEduList) && userEduList.length > 0) {
        const hasValidEdu = userEduList.some(
          (e) => (e.degree && e.degree.trim()) || (e.school && e.school.trim()) || (e.institution && e.institution.trim()) || (e.desc && e.desc.trim()) || (e.description && e.description.trim())
        );
        if (hasValidEdu) return userEduList;
      }
      return DEFAULT_CV.education;
    })(),

    skills: (() => {
      if (Array.isArray(formData.skills) && formData.skills.length > 0) {
        const validSkills = formData.skills.filter((s) => {
          if (typeof s === 'string') return s.trim() !== '';
          if (typeof s === 'object' && s !== null) return (s.name && s.name.trim() !== '') || (s.label && s.label.trim() !== '');
          return false;
        });
        if (validSkills.length > 0) return validSkills;
      }
      return DEFAULT_CV.skills;
    })(),

    languages: (() => {
      if (Array.isArray(formData.languages) && formData.languages.length > 0) {
        const validLangs = formData.languages.filter((l) => {
          if (typeof l === 'string') return l.trim() !== '';
          if (typeof l === 'object' && l !== null) return (l.language && l.language.trim() !== '') || (l.name && l.name.trim() !== '');
          return false;
        });
        if (validLangs.length > 0) return validLangs;
      }
      return DEFAULT_CV.languages;
    })(),
  };

  return (
    <div className="cv-preview-container">
      {/* =========================================================================
          1. BARRE D'OUTILS : COULEURS, ZOOM ET BOUTON EXPORT PDF
          ========================================================================= */}
      <div className="cv-preview-toolbar">
        {/* Sélecteur de couleur thématique */}
        <div className="cv-toolbar-section">
          <span className="cv-toolbar-label">{t('preview.themeColor', 'Couleur')} :</span>
          <div className="cv-color-palette">
            {PRESET_COLORS.map((color) => {
              const isSelected = themeColor.toLowerCase() === color.value.toLowerCase();
              return (
                <button
                  key={color.id}
                  type="button"
                  title={color.label}
                  onClick={() => onColorChange && onColorChange(color.value)}
                  className={`cv-color-swatch ${isSelected ? 'active' : ''}`}
                  style={{ backgroundColor: color.value }}
                  aria-label={color.label}
                />
              );
            })}

            {/* Pastille personnalisée */}
            <div className="cv-color-custom-wrapper" title={t('preview.customColor', 'Couleur personnalisée')}>
              <input
                type="color"
                value={themeColor}
                onChange={(e) => onColorChange && onColorChange(e.target.value)}
                className="cv-color-native-picker"
                aria-label="Palette de couleur personnalisée"
              />
            </div>
          </div>
        </div>

        {/* Contrôles de zoom et Bouton Téléchargement */}
        <div className="cv-toolbar-section">
          {/* Zoom controls */}
          <div className="cv-zoom-controls">
            <button
              type="button"
              onClick={() => setUserZoom((z) => Math.max(0.35, (z ?? scale) - 0.05))}
              className="cv-zoom-btn"
              title="Zoom arrière"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setUserZoom(null)}
              className="cv-zoom-reset"
              title="Ajuster automatiquement"
            >
              {Math.round(activeScale * 100)}%
            </button>
            <button
              type="button"
              onClick={() => setUserZoom((z) => Math.min(0.85, (z ?? scale) + 0.05))}
              className="cv-zoom-btn"
              title="Zoom avant"
            >
              +
            </button>
          </div>

          {/* Bouton Export PDF */}
          {onDownloadPdf && (
            <button
              type="button"
              onClick={onDownloadPdf}
              disabled={isDownloading}
              className="cv-export-btn"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>{isDownloading ? t('buttons.exporting', 'Export...') : t('buttons.downloadPdf', 'Télécharger PDF')}</span>
            </button>
          )}
        </div>
      </div>

      {/* =========================================================================
          2. CADRE GRIS D'APERÇU AVEC SCALING STRICT A4 (794px x 1123px)
          ========================================================================= */}
      <div ref={containerRef} className="cv-preview-gray-canvas">
        {/* Le conteneur redimensionné à l'échelle pour éviter tout débordement */}
        <div
          className="preview-scale-wrapper-outer"
          style={{
            width: `${794 * activeScale}px`,
            height: `${1123 * activeScale}px`,
            position: 'relative',
            margin: '0 auto',
          }}
        >
          <div
            className="preview-scale-wrapper"
            style={{
              width: '794px',
              height: '1123px',
              minHeight: '1123px',
              transform: `scale(${activeScale})`,
              transformOrigin: 'top left',
            }}
          >
            {/* COMPOSANT DE RENDU UNIQUE PARTAGÉ */}
            <CVTemplateModern
              data={displayData}
              themeColor={themeColor}
              id="cv-printable-document"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CVPreview;
