import React, { useState, useEffect, useRef } from 'react';
import { COVER_LETTER_TEMPLATES, interpolateCoverLetter } from '../utils/coverLetterTemplates';
import { exportCVToPDF } from '../lib/pdf';
import {
  FileText,
  Copy,
  Check,
  Download,
  Printer,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Building,
  User,
  Briefcase,
  Layers,
  Award,
  Calendar,
  Send
} from 'lucide-react';
import './CoverLetterBuilder.css';

/**
 * CoverLetterBuilder.jsx
 * Système de Lettre de Motivation par Modèles Statiques (100% sans IA)
 * - Rapide, fluide, sans latence ni coûts d'API
 * - Remplacement automatique des variables
 * - Édition libre en direct
 * - Aperçu A4 strict et Export PDF haute résolution
 */
export const CoverLetterBuilder = ({
  initialCandidate = {},
  onClose,
  lang = 'fr'
}) => {
  // 1. Modèle sélectionné
  const [selectedTemplateId, setSelectedTemplateId] = useState('candidature-spontanee');
  const activeTemplate =
    COVER_LETTER_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    COVER_LETTER_TEMPLATES[0];

  // 2. Variables du formulaire
  const [variables, setVariables] = useState({
    Nom: initialCandidate.fullName || initialCandidate.name || 'Alexandre Martin',
    Email: initialCandidate.email || 'alexandre.martin@example.com',
    Téléphone: initialCandidate.phone || '+33 6 12 34 56 78',
    Ville: initialCandidate.city || 'Paris, France',
    Entreprise: 'Tech Innovations SAS',
    Destinataire: 'Madame, Monsieur les Responsables du Recrutement',
    Poste: initialCandidate.jobTitle || 'Chef de Projet Digital',
    'Compétence Clé': 'le pilotage de projets agiles et la coordination technique',
    Raison: 'votre leadership sur le marché et votre culture de l’innovation',
    Date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });

  // 3. Texte éditable (Objet et Corps)
  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // 4. Scaling A4
  const [scale, setScale] = useState(0.65);
  const canvasContainerRef = useRef(null);

  // Mise à jour du texte généré lors du changement de modèle ou des variables de base
  useEffect(() => {
    const computedSubject = interpolateCoverLetter(activeTemplate.subject, variables);
    const computedBody = interpolateCoverLetter(activeTemplate.body, variables);
    setEditableSubject(computedSubject);
    setEditableBody(computedBody);
  }, [selectedTemplateId]);

  // Recalcul du scale selon la largeur disponible
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const availableWidth = entry.contentRect.width - 32;
        if (availableWidth > 0) {
          const autoScale = Math.min(1, Math.max(0.42, availableWidth / 794));
          setScale(Number(autoScale.toFixed(2)));
        }
      }
    });

    resizeObserver.observe(canvasContainerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  // Injection rapide d'une variable mise à jour
  const handleVariableChange = (key, value) => {
    const newVars = { ...variables, [key]: value };
    setVariables(newVars);

    // Mettre à jour automatiquement le texte avec les nouvelles variables
    const updatedSubject = interpolateCoverLetter(activeTemplate.subject, newVars);
    const updatedBody = interpolateCoverLetter(activeTemplate.body, newVars);
    setEditableSubject(updatedSubject);
    setEditableBody(updatedBody);
  };

  // Réinitialiser le texte aux valeurs calculées du modèle
  const handleResetToTemplate = () => {
    const computedSubject = interpolateCoverLetter(activeTemplate.subject, variables);
    const computedBody = interpolateCoverLetter(activeTemplate.body, variables);
    setEditableSubject(computedSubject);
    setEditableBody(computedBody);
  };

  // Copier le texte
  const handleCopyText = () => {
    const fullDoc = `Objet : ${editableSubject}\n\n${editableBody}`;
    navigator.clipboard.writeText(fullDoc);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Télécharger en PDF A4
  const handleDownloadPDF = async () => {
    try {
      setIsDownloading(true);
      const safeName = (variables.Nom || 'Lettre_Motivation').replace(/\s+/g, '_');
      const safePoste = (variables.Poste || 'Candidature').replace(/\s+/g, '_');
      const fileName = `Lettre_Motivation_${safeName}_${safePoste}.pdf`;

      const success = await exportCVToPDF({
        fileName,
        elementId: 'cover-letter-printable-doc'
      });

      if (!success) {
        window.print();
      }
    } catch (e) {
      console.error('Erreur export PDF:', e);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="cover-letter-builder-container">
      {/* 1. EN-TÊTE PRINCIPAL */}
      <div className="cl-header">
        <div className="cl-header-title">
          <div className="cl-icon-box">
            <FileText className="w-6 h-6" />
          </div>
          <div className="cl-header-text">
            <h1>Générateur de Lettre de Motivation par Modèles</h1>
            <p>
              Modèles professionnels pré-rédigés par secteur • Personnalisation instantanée sans IA
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="cl-btn-secondary"
            onClick={handleCopyText}
            title="Copier le texte"
          >
            {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{isCopied ? 'Texte copié !' : 'Copier'}</span>
          </button>
          <button
            type="button"
            className="cl-btn-primary"
            onClick={handleDownloadPDF}
            disabled={isDownloading}
            title="Télécharger le PDF A4"
          >
            <Download className="w-4 h-4" />
            <span>{isDownloading ? 'Génération...' : 'Télécharger PDF A4'}</span>
          </button>
        </div>
      </div>

      {/* 2. SÉLECTEUR DE MODÈLES / SECTEURS */}
      <div className="cl-template-selector-bar">
        {COVER_LETTER_TEMPLATES.map((tpl) => {
          const isActive = tpl.id === selectedTemplateId;
          return (
            <button
              key={tpl.id}
              type="button"
              className={`cl-template-pill ${isActive ? 'active' : ''}`}
              onClick={() => setSelectedTemplateId(tpl.id)}
            >
              <span>{tpl.title}</span>
              <span className="cl-pill-badge">{tpl.sector}</span>
            </button>
          );
        })}
      </div>

      {/* 3. GRILLE PRINCIPALE (FORMULAIRE À GAUCHE + APERÇU A4 À DROITE) */}
      <div className="cl-grid">
        {/* ===================================================================
            COLONNE GAUCHE : FORMULAIRE SIMPLIFIÉ ET ÉDITEUR LIBRE
            =================================================================== */}
        <div className="cl-form-card">
          <div className="cl-section-title">
            <User className="w-4 h-4 text-blue-600" />
            <span>1. Vos Coordonnées & Ciblage</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="cl-input-group">
              <label>Votre Nom Complet</label>
              <input
                type="text"
                value={variables.Nom}
                onChange={(e) => handleVariableChange('Nom', e.target.value)}
                placeholder="Ex: Alexandre Martin"
              />
            </div>
            <div className="cl-input-group">
              <label>Intitulé du Poste Visé</label>
              <input
                type="text"
                value={variables.Poste}
                onChange={(e) => handleVariableChange('Poste', e.target.value)}
                placeholder="Ex: Chef de Projet Digital"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="cl-input-group">
              <label>Nom de l'Entreprise Cible</label>
              <input
                type="text"
                value={variables.Entreprise}
                onChange={(e) => handleVariableChange('Entreprise', e.target.value)}
                placeholder="Ex: Entreprise XYZ"
              />
            </div>
            <div className="cl-input-group">
              <label>Destinataire (Civilité)</label>
              <input
                type="text"
                value={variables.Destinataire}
                onChange={(e) => handleVariableChange('Destinataire', e.target.value)}
                placeholder="Ex: Madame la Directrice des RH"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="cl-input-group">
              <label>Email</label>
              <input
                type="email"
                value={variables.Email}
                onChange={(e) => handleVariableChange('Email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="cl-input-group">
              <label>Téléphone</label>
              <input
                type="text"
                value={variables.Téléphone}
                onChange={(e) => handleVariableChange('Téléphone', e.target.value)}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
            <div className="cl-input-group">
              <label>Ville & Pays</label>
              <input
                type="text"
                value={variables.Ville}
                onChange={(e) => handleVariableChange('Ville', e.target.value)}
                placeholder="Paris, France"
              />
            </div>
          </div>

          <div className="cl-section-title pt-2">
            <Award className="w-4 h-4 text-purple-600" />
            <span>2. Atouts & Motivations Clés</span>
          </div>

          <div className="cl-input-group">
            <label>Votre Compétence / Atout Clé majeur</label>
            <input
              type="text"
              value={variables['Compétence Clé']}
              onChange={(e) => handleVariableChange('Compétence Clé', e.target.value)}
              placeholder="Ex: la gestion Agile Scrum et le leadership technique"
            />
          </div>

          <div className="cl-input-group">
            <label>Raison spécifique de postuler chez eux</label>
            <input
              type="text"
              value={variables.Raison}
              onChange={(e) => handleVariableChange('Raison', e.target.value)}
              placeholder="Ex: vos projets d’envergure et votre forte dynamique d’innovation"
            />
          </div>

          <div className="cl-section-title pt-2 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>3. Édition Libre du Texte</span>
            </div>
            <button
              type="button"
              className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 cursor-pointer"
              onClick={handleResetToTemplate}
              title="Réappliquer le modèle de base avec les champs actuels"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Réinitialiser</span>
            </button>
          </div>

          <div className="cl-input-group">
            <label>Objet de la lettre</label>
            <input
              type="text"
              value={editableSubject}
              onChange={(e) => setEditableSubject(e.target.value)}
              className="font-bold text-slate-900"
            />
          </div>

          <div className="cl-input-group">
            <label>Corps de la lettre (Modifiez n'importe quel paragraphe)</label>
            <textarea
              rows={12}
              value={editableBody}
              onChange={(e) => setEditableBody(e.target.value)}
              className="cl-textarea-editor"
            />
          </div>
        </div>

        {/* ===================================================================
            COLONNE DROITE : APERÇU A4 DIRECT ET FIDÈLE
            =================================================================== */}
        <div className="cl-preview-column">
          <div className="cl-preview-toolbar">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Aperçu A4 Réel</span>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                210 × 297 mm
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                onClick={() => setScale((s) => Math.max(0.4, Number((s - 0.05).toFixed(2))))}
                title="Zoom arrière"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 px-1">
                {Math.round(scale * 100)}%
              </span>
              <button
                type="button"
                className="p-1 hover:bg-slate-100 rounded text-slate-600 cursor-pointer"
                onClick={() => setScale((s) => Math.min(1.0, Number((s + 0.05).toFixed(2))))}
                title="Zoom avant"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Zone grisée A4 */}
          <div className="cl-preview-canvas" ref={canvasContainerRef}>
            <div
              className="cl-preview-scaler-outer"
              style={{
                width: `${794 * scale}px`,
                height: `${1123 * scale}px`
              }}
            >
              <div
                className="cl-preview-scaler"
                style={{
                  transform: `scale(${scale})`
                }}
              >
                {/* DOCUMENT A4 IMPRIMABLE */}
                <div id="cover-letter-printable-doc" className="cl-a4-document">
                  <div>
                    {/* En-tête expéditeur & destinataire */}
                    <div className="cl-doc-header">
                      <div className="cl-doc-sender">
                        <h2>{variables.Nom}</h2>
                        <p className="font-semibold text-blue-700">{variables.Poste}</p>
                        <p>{variables.Email}</p>
                        <p>{variables.Téléphone}</p>
                        <p>{variables.Ville}</p>
                      </div>

                      <div className="cl-doc-recipient">
                        <h3>{variables.Entreprise}</h3>
                        <p>{variables.Destinataire}</p>
                        <p>{variables.Ville}</p>
                      </div>
                    </div>

                    {/* Date */}
                    <div className="cl-doc-date">
                      {variables.Ville ? `${variables.Ville.split(',')[0]}, le ` : 'Le '}
                      {variables.Date}
                    </div>

                    {/* Objet */}
                    <div className="cl-doc-subject">
                      <strong>Objet :</strong> {editableSubject}
                    </div>

                    {/* Corps de la lettre */}
                    <div className="cl-doc-body">{editableBody}</div>
                  </div>

                  {/* Signature */}
                  <div className="cl-doc-signature">
                    <p>{variables.Nom}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoverLetterBuilder;
