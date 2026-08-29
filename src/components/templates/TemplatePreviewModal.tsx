import React, { useState, useEffect } from 'react';
import { TemplateId, LanguageCode } from '../../types';
import { TemplateDefinition, getTemplateById } from '../../lib/templatesData';
import { CVRenderer } from './CVRenderer';
import {
  X,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import '../TemplatePreviewModal.css';

interface TemplatePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  templateId: TemplateId;
  onSelectTemplate: (templateId: TemplateId, colorHex?: string) => void;
  lang?: LanguageCode;
}

const COLOR_PRESETS = [
  { name: 'Bleu Marine', hex: '#1e3a8a' },
  { name: 'Bleu Roi', hex: '#2563eb' },
  { name: 'Teal Émeraude', hex: '#0f766e' },
  { name: 'Charbon / Noir', hex: '#0f172a' },
  { name: 'Violet Moderne', hex: '#6b21a8' },
  { name: 'Bordeaux Exécutif', hex: '#881337' }
];

export const TemplatePreviewModal: React.FC<TemplatePreviewModalProps> = ({
  isOpen,
  onClose,
  templateId,
  onSelectTemplate,
  lang = 'fr'
}) => {
  const template: TemplateDefinition = getTemplateById(templateId);
  const [selectedColor, setSelectedColor] = useState<string>(template.defaultColor || '#1e3a8a');
  const [scale, setScale] = useState<number>(0.78);

  useEffect(() => {
    if (template?.defaultColor) {
      setSelectedColor(template.defaultColor);
    }
  }, [templateId, template]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  // Prepare custom sample CV clone with selected dynamic color & full raw data
  const dynamicSampleCV = {
    ...template.sampleCV,
    theme: {
      ...template.sampleCV.theme,
      primaryColor: selectedColor
    }
  };

  const handleSelect = () => {
    if (typeof onSelectTemplate === 'function') {
      onSelectTemplate(template.id, selectedColor);
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
        aria-labelledby="template-modal-title"
      >
        {/* En-tête fixe */}
        <div className="template-modal-header">
          <div className="template-modal-title-group">
            <h2 id="template-modal-title" className="template-modal-title">
              Aperçu Grand Format : {template.name}
            </h2>
            <span className="template-modal-badge">{template.badge}</span>
            <span className="template-modal-ats">
              <ShieldCheck className="w-3.5 h-3.5" />
              Score ATS : {template.atsScore}%
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

        {/* Barre de personnalisation des couleurs et zoom */}
        <div className="template-modal-controls-bar">
          <div className="template-modal-color-picker">
            <span className="template-modal-color-label">Couleur du modèle :</span>
            <div className="template-modal-palette">
              {COLOR_PRESETS.map((color) => {
                const isSelected = selectedColor.toLowerCase() === color.hex.toLowerCase();
                return (
                  <button
                    key={color.hex}
                    type="button"
                    onClick={() => setSelectedColor(color.hex)}
                    className={`template-modal-swatch ${isSelected ? 'active' : ''}`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          <div className="template-modal-zoom-group">
            <button
              type="button"
              className="template-modal-zoom-btn"
              onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.05).toFixed(2))))}
              title="Réduire"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="template-modal-zoom-value">{Math.round(scale * 100)}%</span>
            <button
              type="button"
              className="template-modal-zoom-btn"
              onClick={() => setScale((s) => Math.min(1.1, Number((s + 0.05).toFixed(2))))}
              title="Agrandir"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              className="template-modal-zoom-btn"
              onClick={() => setScale(0.78)}
              title="Réinitialiser (78%)"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Zone de défilement centrée pour le document A4 */}
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
              <CVRenderer
                data={dynamicSampleCV}
                showWatermark={false}
              />
            </div>
          </div>
        </div>

        {/* Pied fixe avec action de sélection */}
        <div className="template-modal-footer">
          <div className="template-modal-footer-hint">
            Format A4 Standard (210 × 297 mm) • Score ATS {template.atsScore}%
          </div>

          <div className="template-modal-footer-actions">
            <button
              type="button"
              className="template-modal-cancel-btn"
              onClick={onClose}
            >
              Explorer les autres
            </button>
            <button
              type="button"
              className="template-modal-select-btn"
              onClick={handleSelect}
            >
              <span>Utiliser ce modèle ({template.name})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
