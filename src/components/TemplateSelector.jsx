import React, { useState } from 'react';
import { TEMPLATES_LIST } from '../lib/templatesData';
import { CVRenderer } from './templates/CVRenderer';
import { TemplatePreviewModal } from './TemplatePreviewModal';
import { Check, Maximize2, Sparkles } from 'lucide-react';
import './TemplateSelector.css';

/**
 * TemplateSelector.jsx
 * Composant de sélection de modèles de CV :
 * 1. Taille 100% FIXE et IMMOBILE au survol (aucun zoom/scale/déformation).
 * 2. Effet hover élégant : bordure bleue (#2563eb) et ombre douce.
 * 3. Cadre A4 strict (aspect-ratio: 1 / 1.414) avec overflow: hidden.
 * 4. Modal d'aperçu Grand Format haute résolution intégré.
 */
export const TemplateSelector = ({
  selectedTemplateId = 'modern',
  onSelectTemplate,
  onInspectTemplate,
  lang = 'fr'
}) => {
  const [activeId, setActiveId] = useState(selectedTemplateId);
  const [modalTemplateId, setModalTemplateId] = useState(null);

  const handleSelect = (id, color) => {
    setActiveId(id);
    if (typeof onSelectTemplate === 'function') {
      onSelectTemplate(id, color);
    }
  };

  const handleInspect = (id) => {
    if (typeof onInspectTemplate === 'function') {
      onInspectTemplate(id);
    } else {
      setModalTemplateId(id);
    }
  };

  return (
    <section className="template-selector-container" id="templates-section">
      {/* En-tête de section */}
      <div className="template-selector-header">
        <div className="template-badge-pill">
          <Sparkles className="w-3.5 h-3.5 inline text-blue-600" />
          <span>Modèles Certifiés ATS &amp; Format A4</span>
        </div>
        <h2 className="template-selector-title">Choisissez votre modèle de CV</h2>
        <p className="template-selector-subtitle">
          Sélectionnez un style adapté à votre profil professionnel. Tous nos modèles respectent le ratio A4 standard et restent parfaitement stables au survol.
        </p>
      </div>

      {/* Grille responsive de templates */}
      <div className="template-grid">
        {TEMPLATES_LIST.map((tpl) => {
          const isSelected = activeId === tpl.id;

          return (
            <div
              key={tpl.id}
              className={`template-card ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelect(tpl.id, tpl.defaultColor)}
            >
              {/* Badge d'état Sélectionné */}
              {isSelected && (
                <div className="selected-badge">
                  <Check className="badge-icon" />
                  <span>Sélectionné</span>
                </div>
              )}

              {/* Tag / Badge de catégorie */}
              {tpl.badge && !isSelected && (
                <div className="template-tag">{tpl.badge}</div>
              )}

              {/* Score ATS */}
              <div className="ats-score-tag">
                ATS {tpl.atsScore}%
              </div>

              {/* Cadre d'aperçu A4 STRICT (1 : 1.414) avec overflow: hidden */}
              <div className="preview-a4-frame">
                {/* Rendu du document A4 proportionnel */}
                <div className="scaled-cv-wrapper">
                  <CVRenderer
                    data={{
                      ...tpl.sampleCV,
                      templateId: tpl.id
                    }}
                    lang={lang}
                    showWatermark={false}
                  />
                </div>

                {/* Overlay d'action au survol (Hover uniquement sans scale) */}
                <div className="hover-overlay">
                  <div className="hover-btn-group">
                    <button
                      type="button"
                      className="inspect-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleInspect(tpl.id);
                      }}
                    >
                      <Maximize2 className="w-3.5 h-3.5 inline mr-1 text-blue-600" />
                      Aperçu Grand Format
                    </button>
                    <button
                      type="button"
                      className="action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(tpl.id, tpl.defaultColor);
                      }}
                    >
                      {isSelected ? '✓ Modèle Actuel' : 'Utiliser ce modèle'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Métadonnées & Informations du modèle */}
              <div className="template-card-footer">
                <div className="template-info">
                  <div className="template-header-row">
                    <h3 className="template-name">{tpl.name}</h3>
                    <div
                      className="template-color-dot"
                      style={{ backgroundColor: tpl.defaultColor }}
                      title="Couleur recommandée"
                    />
                  </div>
                  <p className="template-desc">{tpl.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal d'Aperçu Grand Format */}
      {modalTemplateId && (
        <TemplatePreviewModal
          isOpen={Boolean(modalTemplateId)}
          templateId={modalTemplateId}
          onClose={() => setModalTemplateId(null)}
          onSelectTemplate={(id, color) => {
            handleSelect(id, color);
            setModalTemplateId(null);
          }}
        />
      )}
    </section>
  );
};

export default TemplateSelector;
