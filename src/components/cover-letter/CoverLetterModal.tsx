import React, { useState, useEffect } from 'react';
import { CVData, LanguageCode, UserPassState } from '../../types';
import { COVER_LETTER_TEMPLATES, interpolateCoverLetter } from '../../lib/coverLetterTemplates';
import { exportCVToPDF } from '../../lib/pdf';
import { passService } from '../../lib/passService';
import { ENABLE_PAYMENTS } from '../../config/features';
import { PaymentModal } from '../payment/PaymentModal';
import { generateCoverLetter } from '../../lib/gemini';
import { A4FitWrapper } from '../A4FitWrapper';
import {
  FileText,
  Copy,
  Check,
  Download,
  X,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  User,
  Briefcase,
  Award,
  Lock,
  ShieldCheck,
  Loader2,
  Undo2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import '../CoverLetterBuilder.css';

interface CoverLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvData: CVData;
  lang?: LanguageCode;
}

export const CoverLetterModal: React.FC<CoverLetterModalProps> = ({
  isOpen,
  onClose,
  cvData,
  lang = 'fr'
}) => {
  const candidateName = `${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}`.trim() || 'Alexandre Martin';
  const candidateEmail = cvData.personalInfo.email || 'candidat@email.com';
  const candidatePhone = cvData.personalInfo.phone || '+33 6 12 34 56 78';
  const candidateCity = cvData.personalInfo.city || 'Paris, France';
  const candidateTitle = cvData.personalInfo.title || 'Chef de Projet Digital';

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('candidature-spontanee');
  const activeTemplate =
    COVER_LETTER_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    COVER_LETTER_TEMPLATES[0];

  const [variables, setVariables] = useState({
    Nom: candidateName,
    Email: candidateEmail,
    Téléphone: candidatePhone,
    Ville: candidateCity,
    Entreprise: 'Tech Innovations SAS',
    Destinataire: 'Madame, Monsieur les Responsables du Recrutement',
    Poste: candidateTitle,
    'Compétence Clé': cvData.skills.length > 0 ? cvData.skills.map((s) => s.name).slice(0, 3).join(', ') : 'la gestion de projets agiles et le management',
    Raison: 'votre dynamisme et votre excellence technologique',
    Date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });

  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgressText, setDownloadProgressText] = useState('');
  const [scale, setScale] = useState(0.7);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [passState, setPassState] = useState<UserPassState>(() => passService.getLocalPass());

  // États pour l'assistant IA Gemini
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);
  const [previousBody, setPreviousBody] = useState<string | null>(null);

  // Synchronisation lors du changement de modèle ou des variables
  useEffect(() => {
    const s = interpolateCoverLetter(activeTemplate.subject, variables);
    const b = interpolateCoverLetter(activeTemplate.body, variables);
    setEditableSubject(s);
    setEditableBody(b);
  }, [selectedTemplateId]);

  // Synchronisation initiale quand cvData change
  useEffect(() => {
    if (cvData) {
      setVariables((prev) => ({
        ...prev,
        Nom: `${cvData.personalInfo.firstName || ''} ${cvData.personalInfo.lastName || ''}`.trim() || prev.Nom,
        Email: cvData.personalInfo.email || prev.Email,
        Téléphone: cvData.personalInfo.phone || prev.Téléphone,
        Ville: cvData.personalInfo.city || prev.Ville,
        Poste: cvData.personalInfo.title || prev.Poste,
        'Compétence Clé': cvData.skills.length > 0 ? cvData.skills.map((s) => s.name).slice(0, 3).join(', ') : prev['Compétence Clé']
      }));
    }
    const currentPass = passService.getLocalPass();
    setPassState(currentPass);
  }, [cvData, isOpen]);

  if (!isOpen) return null;

  const handleVariableChange = (key: string, val: string) => {
    const newVars = { ...variables, [key]: val };
    setVariables(newVars);
    setEditableSubject(interpolateCoverLetter(activeTemplate.subject, newVars));
    setEditableBody(interpolateCoverLetter(activeTemplate.body, newVars));
  };

  const handleReset = () => {
    setEditableSubject(interpolateCoverLetter(activeTemplate.subject, variables));
    setEditableBody(interpolateCoverLetter(activeTemplate.body, variables));
  };

  /**
   * Génération de lettre de motivation personnalisée avec Gemini AI
   */
  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    setGenerationSuccess(null);

    // Sauvegarde pour permettre l'annulation
    if (editableBody.trim()) {
      setPreviousBody(editableBody);
    }

    const targetJob = variables.Poste || cvData.personalInfo.title || 'Professionnel';
    const targetCompany = variables.Entreprise || "l'entreprise";

    // Synthèse de l'expérience et des compétences du candidat
    const skillsList = cvData.skills.map((s) => s.name).slice(0, 6);
    const experiencesList = cvData.experience
      .slice(0, 3)
      .map(
        (e) =>
          `${e.position} chez ${e.company}${
            e.tasks?.length ? ` (Missions : ${e.tasks.slice(0, 2).join('; ')})` : ''
          }`
      );

    const userExperienceText = [
      cvData.summary ? `Profil : ${cvData.summary}` : '',
      skillsList.length > 0 ? `Compétences : ${skillsList.join(', ')}` : '',
      experiencesList.length > 0 ? `Parcours : ${experiencesList.join(' | ')}` : '',
      variables['Compétence Clé'] ? `Atout clé : ${variables['Compétence Clé']}` : '',
      variables.Raison ? `Motivation : ${variables.Raison}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      // 1. Appel du helper exporté generateCoverLetter(jobTitle, companyName, userExperience, lang)
      const generatedText = await generateCoverLetter(
        targetJob,
        targetCompany,
        userExperienceText,
        lang as 'fr' | 'ar' | 'en'
      );

      // Auto-remplissage du textarea avec la réponse générée
      setEditableBody(generatedText);
      setGenerationSuccess(
        lang === 'ar'
          ? 'تم إنشاء رسالة التحفيز بنجاح وتعبئتها!'
          : lang === 'en'
          ? 'Cover Letter generated and auto-filled successfully!'
          : 'Lettre de motivation rédigée et insérée avec succès !'
      );
    } catch (err: any) {
      console.warn('⚠️ [CoverLetterModal] Erreur directe Gemini, tentative via endpoint serveur...');

      // 2. Repli de secours via l'API Express
      try {
        const res = await fetch('/api/ai/generate-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fullName: variables.Nom,
            jobTitle: targetJob,
            companyName: targetCompany,
            skills: skillsList,
            experienceSummary: userExperienceText,
            lang,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.content) {
          setEditableBody(data.data.content);
          if (data.data.subject) {
            setEditableSubject(data.data.subject);
          }
          setGenerationSuccess('Lettre de motivation générée avec succès !');
          return;
        }
        throw new Error(data.details || data.error || 'Échec de la génération.');
      } catch (backendErr: any) {
        console.error('❌ [CoverLetterModal] Erreur de génération :', backendErr);
        setGenerationError(
          backendErr.message ||
            err.message ||
            'Une erreur est survenue lors de la communication avec Gemini. Vérifiez votre clé API.'
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUndo = () => {
    if (previousBody !== null) {
      setEditableBody(previousBody);
      setPreviousBody(null);
      setGenerationSuccess(null);
    }
  };

  const handleCopy = () => {
    const fullText = `Objet : ${editableSubject}\n\n${editableBody}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = async () => {
    const currentPass = passService.getLocalPass();
    if (ENABLE_PAYMENTS && !currentPass.unlockedCoverLetters) {
      setShowPaymentModal(true);
      return;
    }

    try {
      setIsDownloading(true);
      setDownloadProgressText('Génération du PDF...');
      const safeName = (variables.Nom || `${cvData.personalInfo.firstName || ''}_${cvData.personalInfo.lastName || ''}`).trim().replace(/\s+/g, '_') || 'Candidat';
      const fileName = `VITAREY_Lettre_${safeName}.pdf`;

      const success = await exportCVToPDF({
        fileName,
        elementId: 'cover-letter-modal-doc',
        onProgress: (status) => setDownloadProgressText(status)
      });

      if (!success) {
        console.warn('[CoverLetterModal] Échec de la génération du PDF.');
      }
    } catch (err) {
      console.error('[CoverLetterModal] Erreur export PDF:', err);
    } finally {
      setIsDownloading(false);
      setDownloadProgressText('');
    }
  };

  const isUnlocked = !ENABLE_PAYMENTS || passState.unlockedCoverLetters;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-6xl w-full h-[92vh] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* En-tête du modal */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-xl text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">Générateur de Lettre de Motivation</h3>
                {isUnlocked ? (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {!ENABLE_PAYMENTS ? 'Accès Gratuit Illimité' : 'Inclus dans votre Pass'}
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-[10px] font-bold rounded-full border border-amber-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pass Pro / Illimité
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300">
                Génération sur-mesure avec Gemini AI • Modèles professionnels • 100% Modifiable
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copié !' : 'Copier'}</span>
            </button>
            <button
              onClick={handleDownloadPDF}
              disabled={isDownloading}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                isUnlocked
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black'
              }`}
            >
              {isDownloading ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : isUnlocked ? (
                <Download className="w-3.5 h-3.5" />
              ) : (
                <Lock className="w-3.5 h-3.5 text-slate-950" />
              )}
              <span>{isDownloading ? downloadProgressText || 'Génération...' : isUnlocked ? 'Télécharger PDF' : 'Débloquer (Pass Pro $3.99)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Barre de sélection des modèles */}
        <div className="px-6 py-2.5 bg-slate-100 border-b border-slate-200 flex gap-2 overflow-x-auto shrink-0">
          {COVER_LETTER_TEMPLATES.map((tpl) => {
            const isActive = tpl.id === selectedTemplateId;
            return (
              <button
                key={tpl.id}
                onClick={() => setSelectedTemplateId(tpl.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{tpl.icon}</span>
                <span>{tpl.title}</span>
              </button>
            );
          })}
        </div>

        {/* Contenu principal : 2 colonnes */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-0 overflow-hidden">
          {/* Colonne gauche : Formulaire variables & Éditeur */}
          <div className="lg:col-span-5 border-r border-slate-200 p-5 overflow-y-auto space-y-5 bg-slate-50/50">
            {/* Formulaire des variables dynamiques */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  Variables de personnalisation
                </span>
                <button
                  onClick={handleReset}
                  className="text-[11px] text-slate-400 hover:text-slate-700 flex items-center gap-1 font-medium cursor-pointer"
                  title="Réinitialiser avec les variables par défaut"
                >
                  <RotateCcw className="w-3 h-3" />
                  Réinitialiser
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Entreprise cible
                  </label>
                  <input
                    type="text"
                    value={variables.Entreprise}
                    onChange={(e) => handleVariableChange('Entreprise', e.target.value)}
                    placeholder="Nom de l'entreprise"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Poste visé
                  </label>
                  <input
                    type="text"
                    value={variables.Poste}
                    onChange={(e) => handleVariableChange('Poste', e.target.value)}
                    placeholder="Titre du poste"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Destinataire
                </label>
                <input
                  type="text"
                  value={variables.Destinataire}
                  onChange={(e) => handleVariableChange('Destinataire', e.target.value)}
                  placeholder="ex: Responsable Recrutement"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Compétence Clé mise en avant
                </label>
                <input
                  type="text"
                  value={variables['Compétence Clé']}
                  onChange={(e) => handleVariableChange('Compétence Clé', e.target.value)}
                  placeholder="ex: React, Node.js et l'agilité"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Pourquoi cette entreprise ? (Raison)
                </label>
                <input
                  type="text"
                  value={variables.Raison}
                  onChange={(e) => handleVariableChange('Raison', e.target.value)}
                  placeholder="ex: votre leadership sur le cloud et vos valeurs"
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>
            </div>

            {/* Édition directe du texte */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Édition directe du contenu
              </span>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Objet du message
                </label>
                <input
                  type="text"
                  value={editableSubject}
                  onChange={(e) => setEditableSubject(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="block text-[11px] font-semibold text-slate-700 uppercase tracking-wider">
                    Corps du courrier
                  </label>

                  {/* Bouton ✨ Generate with AI / Générer avec IA */}
                  <div className="flex items-center gap-1.5">
                    {previousBody && (
                      <button
                        type="button"
                        onClick={handleUndo}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-lg transition-colors cursor-pointer border border-slate-200"
                        title="Annuler et restaurer la version précédente"
                      >
                        <Undo2 className="w-3 h-3" />
                        <span>Annuler</span>
                      </button>
                    )}

                    <button
                      type="button"
                      id="btn-generate-cover-letter-ai"
                      disabled={isGenerating}
                      onClick={handleGenerateWithAI}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
                      title="Générer une lettre de motivation sur-mesure avec Gemini AI"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                          <span>Génération en cours...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                          <span>
                            {lang === 'ar'
                              ? '✨ التوليد بالذكاء الاصطناعي'
                              : lang === 'en'
                              ? '✨ Generate with AI'
                              : '✨ Générer avec l\'IA'}
                          </span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Notification de succès */}
                {generationSuccess && (
                  <div className="mb-2 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{generationSuccess}</span>
                    </div>
                    {previousBody && (
                      <button
                        type="button"
                        onClick={handleUndo}
                        className="text-emerald-700 underline text-[11px] hover:text-emerald-900 cursor-pointer"
                      >
                        Rétablir
                      </button>
                    )}
                  </div>
                )}

                {/* Message d'erreur avec retour utilisateur */}
                {generationError && (
                  <div className="mb-2 p-2.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div className="space-y-0.5">
                      <span className="font-bold">Erreur de génération :</span>
                      <p className="text-red-600 leading-relaxed">{generationError}</p>
                    </div>
                  </div>
                )}

                <div className="relative">
                  <textarea
                    id="cover-letter-body-textarea"
                    rows={10}
                    value={editableBody}
                    onChange={(e) => setEditableBody(e.target.value)}
                    placeholder="Rédigez votre lettre de motivation ou cliquez sur 'Générer avec l'IA' pour une création automatique sur-mesure..."
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs leading-relaxed font-sans focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-hidden resize-none transition-all shadow-2xs"
                  />

                  {isGenerating && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center gap-2 text-blue-700 font-semibold text-xs animate-in fade-in">
                      <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                      <span>Rédaction de votre lettre avec Gemini en cours...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Colonne droite : Rendu A4 réel en direct */}
          <div className="lg:col-span-7 bg-slate-200/80 p-4 sm:p-6 flex flex-col items-center justify-start overflow-y-auto">
            {/* Contrôles de zoom */}
            <div className="mb-3 flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-xl border border-slate-300 shadow-2xs">
              <span className="text-xs font-bold text-slate-700 mr-2">Feuille A4 Réelle</span>
              <button
                onClick={() => setScale((s) => Math.max(0.5, Number((s - 0.05).toFixed(2))))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer"
                title="Zoom arrière"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-xs font-mono font-bold text-slate-700 px-1">
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={() => setScale((s) => Math.min(1.0, Number((s + 0.05).toFixed(2))))}
                className="p-1 text-slate-600 hover:text-slate-900 rounded hover:bg-slate-100 cursor-pointer"
                title="Zoom avant"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setScale(0.7)}
                className="text-[11px] text-blue-600 hover:underline font-semibold ml-2 cursor-pointer"
              >
                Ajuster
              </button>
            </div>

            {/* Document A4 Réel Scalé */}
            <div
              className="relative shadow-2xl rounded-lg bg-white overflow-hidden"
              style={{
                width: `${794 * scale}px`,
                height: `${1123 * scale}px`
              }}
            >
              <div
                style={{
                  width: '794px',
                  minHeight: '1123px',
                  transform: `scale(${scale})`,
                  transformOrigin: 'top left'
                }}
              >
                <A4FitWrapper
                  id="cover-letter-modal-doc"
                  className="cover-letter-a4-document"
                  dataDependency={{ variables, editableSubject, editableBody }}
                  warningMessage="Lettre de motivation volumineuse — pensez à raccourcir le texte"
                >
                  {/* Bandeau d'en-tête décoratif */}
                  <div className="cl-doc-topbar" />

                  <div className="cl-doc-content">
                    {/* Bloc Expéditeur (Candidat) */}
                    <div className="cl-doc-sender">
                      <h1 className="cl-doc-name">{variables.Nom}</h1>
                      <p className="cl-doc-candidate-title">{variables.Poste}</p>
                      <div className="cl-doc-contact-info">
                        <span>{variables.Email}</span> • <span>{variables.Téléphone}</span> •{' '}
                        <span>{variables.Ville}</span>
                      </div>
                    </div>

                    {/* Bloc Destinataire & Contenu */}
                    <div className="cl-doc-body-section">
                      {/* Destinataire */}
                      <div className="cl-doc-recipient">
                        <strong>À l'attention de :</strong>
                        <p>{variables.Destinataire}</p>
                        <p className="cl-doc-company-name">{variables.Entreprise}</p>
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
                </A4FitWrapper>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal if not unlocked - cleanly gated by ENABLE_PAYMENTS */}
      {ENABLE_PAYMENTS && showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          cvData={cvData}
          lang={lang}
          initialPlan="pro"
          onSuccess={() => {
            const updated = passService.getLocalPass();
            setPassState(updated);
            setShowPaymentModal(false);
          }}
        />
      )}
    </div>
  );
};
