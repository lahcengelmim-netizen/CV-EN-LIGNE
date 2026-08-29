import React, { useState, useEffect } from 'react';
import { CVTemplateModern } from './CVTemplateModern';
import { getTemplateById } from '../lib/templatesData';
import { X, Check, Sparkles, ArrowRight, ShieldCheck, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import './TemplatePreviewModal.css';

/**
 * Données réelles complètes par défaut pour l'aperçu A4
 * Garantit que TOUTES les sections (Profil, Expériences, Formations, Compétences, Langues)
 * sont remplies de façon riche, propre et sans aucune coupure.
 */
export const FULL_SAMPLE_CV = {
  fullName: 'Alexandre Martin',
  jobTitle: 'Chef de Projet Digital & Transformation Web',
  email: 'alexandre.martin@example.com',
  phone: '+33 6 12 34 56 78',
  city: 'Paris',
  country: 'France',
  summary:
    "Professionnel dynamique et rigoureux avec plus de 6 ans d'expérience dans la gestion de projets web et le pilotage d'équipes pluridisciplinaires. Expert en méthodologies Agile (Scrum/Kanban), optimisation des processus digitaux et conception d'expériences utilisateurs performantes et mesurables.",
  sectionTitles: {
    profile: 'Profil Professionnel',
    experience: 'Expériences Professionnelles',
    education: 'Formations & Diplômes',
    skills: 'Compétences Clés',
    languages: 'Langues & International'
  },
  experiences: [
    {
      id: 'exp-preview-1',
      position: 'Lead Chef de Projet Digital',
      company: 'Innovatech Solutions',
      city: 'Paris',
      startDate: '2021',
      endDate: 'Présent',
      current: true,
      description:
        "Direction opérationnelle et stratégique de refontes digitales complexes pour des clients grands comptes du secteur bancaire et e-commerce.",
      tasks: [
        "Pilotage d'une équipe de 8 développeurs et designers UI/UX selon le cadre Agile Scrum",
        "Amélioration de 35% de la vélocité des livraisons et réduction des retours d'anomalies de 40%",
        "Gestion d'un portefeuille budgétaire global de 650 k€ avec reporting direct au comité de direction"
      ]
    },
    {
      id: 'exp-preview-2',
      position: 'Chef de Projet Web & E-Commerce',
      company: 'Digital Horizon Agency',
      city: 'Lyon',
      startDate: '2018',
      endDate: '2021',
      current: false,
      description:
        "Gestion du cycle de vie complet de projets digitaux : cadrage des besoins, rédaction des cahiers des charges, coordination technique et recette.",
      tasks: [
        "Déploiement de 14 plateformes web et e-commerce générant plus de 2M€ de flux annuel",
        "Mise en place de tests d'utilisabilité et optimisation continue du tunnel de conversion (+22%)"
      ]
    }
  ],
  educations: [
    {
      id: 'edu-preview-1',
      degree: 'Master Expert en Management des Systèmes d’Information & Numérique',
      institution: 'École Supérieure du Digital',
      city: 'Paris',
      startDate: '2016',
      endDate: '2018',
      description: 'Mention Très Bien • Major de promotion en Spécialisation Conduite du Changement Agile'
    },
    {
      id: 'edu-preview-2',
      degree: 'Licence Professionnelle Métiers du Web & Multimédia',
      institution: 'Université de Technologie',
      city: 'Paris',
      startDate: '2013',
      endDate: '2016',
      description: 'Conception web, gestion de bases de données relationnelles et ergonomie des interfaces'
    }
  ],
  skills: [
    'Gestion de Projet Agile (Scrum / Kanban)',
    'Pilotage Budgétaire & Roadmap',
    'Conception UI/UX & Wireframing',
    'Jira, Confluence & Notion Pro',
    'Architecture Web (React, Node.js)',
    'Analyse de Données & Google Analytics',
    'Communication & Leadership d’équipe'
  ],
  languages: [
    { id: 'lang-preview-1', language: 'Français', level: 'Langue maternelle' },
    { id: 'lang-preview-2', language: 'Anglais', level: 'Courant / Bilingue (TOEIC 960)' },
    { id: 'lang-preview-3', language: 'Espagnol', level: 'Professionnel (Niveau B2)' }
  ]
};

const PRESET_MODAL_COLORS = [
  { name: 'Bleu Marine', hex: '#1e3a8a' },
  { name: 'Bleu Roi', hex: '#2563eb' },
  { name: 'Teal Émeraude', hex: '#0f766e' },
  { name: 'Charbon / Noir', hex: '#0f172a' },
  { name: 'Violet Moderne', hex: '#6b21a8' },
  { name: 'Bordeaux Exécutif', hex: '#881337' }
];

/**
 * TemplatePreviewModal.jsx
 * Modal d'aperçu A4 Grand Format :
 * 1. Dimensions : 88vh de hauteur, max-width 960px.
 * 2. Défilement propre et fluide (overflow-y: auto).
 * 3. Rendu A4 Strict (794px x 1123px) scalé à 0.75 - 0.85 sans distorsion ni coupure.
 * 4. Jeu de données 100% complet pour toutes les sections.
 * 5. Actions claires : En-tête avec nom & score ATS + Pied fixe avec "Utiliser ce modèle".
 */
export const TemplatePreviewModal = ({
  isOpen = true,
  onClose,
  templateId = 'modern',
  onSelectTemplate,
  initialColor
}) => {
  // Récupération des métadonnées du template
  const templateDef = getTemplateById(templateId);
  const [selectedColor, setSelectedColor] = useState(
    initialColor || templateDef?.defaultColor || '#1e3a8a'
  );
  const [scale, setScale] = useState(0.78);

  // Synchronisation de la couleur par défaut au changement de template
  useEffect(() => {
    if (initialColor) {
      setSelectedColor(initialColor);
    } else if (templateDef?.defaultColor) {
      setSelectedColor(templateDef.defaultColor);
    }
  }, [templateId, initialColor, templateDef]);

  // Fermeture sur touche Échap
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const templateName = templateDef?.name || 'Modèle Moderne';
  const templateBadge = templateDef?.badge || 'Certifié A4 & ATS';
  const atsScore = templateDef?.atsScore || 99;

  const handleSelect = () => {
    if (typeof onSelectTemplate === 'function') {
      onSelectTemplate(templateId, selectedColor);
    }
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="template-modal-overlay" onClick={onClose}>
      <div
        className="template-modal-window"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="template-preview-title"
      >
        {/* ===================================================================
            1. EN-TÊTE FIXE DU MODAL
            =================================================================== */}
        <div className="template-modal-header">
          <div className="template-modal-title-group">
            <h2 id="template-preview-title" className="template-modal-title">
              Aperçu Grand Format : {templateName}
            </h2>
            <span className="template-modal-badge">{templateBadge}</span>
            <span className="template-modal-ats">
              <ShieldCheck className="w-3.5 h-3.5" />
              Score ATS : {atsScore}%
            </span>
          </div>

          <button
            type="button"
            className="template-modal-close-btn"
            onClick={onClose}
            title="Fermer l'aperçu (Échap)"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ===================================================================
            2. BARRE D'OUTILS (SÉLECTION DE COULEURS & ZOOM)
            =================================================================== */}
        <div className="template-modal-controls-bar">
          <div className="template-modal-color-picker">
            <span className="template-modal-color-label">Couleur du thème :</span>
            <div className="template-modal-palette">
              {PRESET_MODAL_COLORS.map((c) => {
                const isActive = selectedColor.toLowerCase() === c.hex.toLowerCase();
                return (
                  <button
                    key={c.hex}
                    type="button"
                    className={`template-modal-swatch ${isActive ? 'active' : ''}`}
                    style={{ backgroundColor: c.hex }}
                    onClick={() => setSelectedColor(c.hex)}
                    title={c.name}
                  />
                );
              })}
            </div>
          </div>

          <div className="template-modal-zoom-group">
            <button
              type="button"
              className="template-modal-zoom-btn"
              onClick={() => setScale((prev) => Math.max(0.5, Number((prev - 0.05).toFixed(2))))}
              title="Réduire le zoom"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="template-modal-zoom-value">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              className="template-modal-zoom-btn"
              onClick={() => setScale((prev) => Math.min(1.1, Number((prev + 0.05).toFixed(2))))}
              title="Agrandir le zoom"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="template-modal-zoom-btn"
              onClick={() => setScale(0.78)}
              title="Réinitialiser le zoom (78%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* ===================================================================
            3. ZONE DE DÉFILEMENT CENTRÉE DU CV A4
            =================================================================== */}
        <div className="modal-cv-container">
          <div
            className="modal-cv-outer-wrapper"
            style={{
              width: `${794 * scale}px`,
              height: `${1123 * scale}px`
            }}
          >
            <div
              className="modal-cv-scaler"
              style={{
                transform: `scale(${scale})`
              }}
            >
              {/* Rendu strict A4 complet avec toutes les données */}
              <CVTemplateModern
                data={FULL_SAMPLE_CV}
                themeColor={selectedColor}
              />
            </div>
          </div>
        </div>

        {/* ===================================================================
            4. PIED FIXE DU MODAL AVEC BOUTONS D'ACTION
            =================================================================== */}
        <div className="template-modal-footer">
          <div className="template-modal-footer-hint">
            Ce modèle est 100% conforme au standard d'impression papier A4 (210 × 297 mm).
          </div>

          <div className="template-modal-footer-actions">
            <button
              type="button"
              className="template-modal-cancel-btn"
              onClick={onClose}
            >
              Annuler
            </button>
            <button
              type="button"
              className="template-modal-select-btn"
              onClick={handleSelect}
            >
              <span>Utiliser ce modèle</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplatePreviewModal;
