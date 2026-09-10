import React, { useState, useEffect, useRef } from 'react';
import { CoverLetterData, CVData, LanguageCode, UserPassState } from '../../types';
import { COVER_LETTER_TEMPLATES, interpolateCoverLetter } from '../../lib/coverLetterTemplates';
import { exportCVToPDF } from '../../lib/pdf';
import { passService } from '../../lib/passService';
import { ENABLE_PAYMENTS } from '../../config/features';
import { PaymentModal } from '../payment/PaymentModal';
import { generateCoverLetter } from '../../lib/gemini';
import { storageService } from '../../lib/supabase';
import { A4FitWrapper } from '../A4FitWrapper';
import {
  FileText,
  Copy,
  Check,
  Download,
  Sparkles,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  User,
  Briefcase,
  Building2,
  Calendar,
  Loader2,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  Save,
  ArrowRight,
  Layers,
  Printer
} from 'lucide-react';
import '../CoverLetterBuilder.css';

interface CoverLetterStudioProps {
  user: any;
  cvList?: CVData[];
  lang?: LanguageCode;
  onSelectCV?: (cv: CVData) => void;
}

export const CoverLetterStudio: React.FC<CoverLetterStudioProps> = ({
  user,
  cvList = [],
  lang = 'fr',
}) => {
  // Saved cover letters state
  const [letters, setLetters] = useState<CoverLetterData[]>([]);
  const [isLoadingLetters, setIsLoadingLetters] = useState(true);
  const [activeLetterId, setActiveLetterId] = useState<string | null>(null);

  // Template selection
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('candidature-spontanee');
  const activeTemplate =
    COVER_LETTER_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
    COVER_LETTER_TEMPLATES[0];

  // Default candidate info based on logged-in user or first CV
  const latestCV = cvList.length > 0 ? cvList[0] : null;
  const defaultName =
    user?.user_metadata?.full_name ||
    (latestCV ? `${latestCV.personalInfo.firstName} ${latestCV.personalInfo.lastName}`.trim() : '') ||
    'Alexandre Martin';
  const defaultEmail = user?.email || latestCV?.personalInfo.email || 'candidat@email.com';
  const defaultPhone = latestCV?.personalInfo.phone || '+33 6 12 34 56 78';
  const defaultCity = latestCV?.personalInfo.city || 'Paris, France';
  const defaultPoste = latestCV?.personalInfo.title || 'Chef de Projet Digital';
  const defaultSkills = latestCV && latestCV.skills.length > 0
    ? latestCV.skills.map((s) => s.name).slice(0, 4).join(', ')
    : 'Gestion de projet, Leadership, Communication, Analyse stratégique';

  // Form variables
  const [variables, setVariables] = useState({
    Nom: defaultName,
    Email: defaultEmail,
    Téléphone: defaultPhone,
    Ville: defaultCity,
    Entreprise: 'Tech Innovations SAS',
    Destinataire: 'Madame, Monsieur les Responsables du Recrutement',
    Poste: defaultPoste,
    'Compétence Clé': defaultSkills,
    Raison: 'votre excellence technologique et vos valeurs d’innovation',
    Date: new Date().toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  });

  const [editableSubject, setEditableSubject] = useState('');
  const [editableBody, setEditableBody] = useState('');
  const [letterTitle, setLetterTitle] = useState('Nouvelle Lettre de motivation');
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgressText, setDownloadProgressText] = useState('');
  const [scale, setScale] = useState(0.85);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [passState, setPassState] = useState<UserPassState>(() => passService.getLocalPass());
  const [isSaved, setIsSaved] = useState(false);

  // Gemini AI state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [generationSuccess, setGenerationSuccess] = useState<string | null>(null);
  const [previousBody, setPreviousBody] = useState<string | null>(null);

  // Load existing letters on mount
  useEffect(() => {
    loadLetters();
  }, [user]);

  const loadLetters = async () => {
    setIsLoadingLetters(true);
    try {
      const data = await storageService.getCoverLetters(user?.id || 'guest');
      setLetters(data);
      if (data.length > 0 && !activeLetterId) {
        // Load first letter into editor
        loadLetterIntoEditor(data[0]);
      } else if (data.length === 0) {
        initNewLetter();
      }
    } catch (err) {
      console.error('Failed to load cover letters:', err);
    } finally {
      setIsLoadingLetters(false);
    }
  };

  const loadLetterIntoEditor = (letter: CoverLetterData) => {
    setActiveLetterId(letter.id);
    setLetterTitle(letter.title || 'Lettre sans titre');
    setVariables((prev) => ({
      ...prev,
      Poste: letter.jobTitle || prev.Poste,
      Entreprise: letter.companyName || prev.Entreprise,
      Destinataire: letter.recipientName || prev.Destinataire,
    }));
    setEditableSubject(`Candidature au poste de ${letter.jobTitle} - ${letter.companyName}`);
    setEditableBody(letter.content);
    setIsSaved(true);
  };

  const initNewLetter = () => {
    setActiveLetterId(null);
    setLetterTitle(`Lettre - ${variables.Poste || 'Candidature'}`);
    const s = interpolateCoverLetter(activeTemplate.subject, variables);
    const b = interpolateCoverLetter(activeTemplate.body, variables);
    setEditableSubject(s);
    setEditableBody(b);
    setIsSaved(false);
  };

  // Sync with template change if user changes template
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = COVER_LETTER_TEMPLATES.find((t) => t.id === templateId) || COVER_LETTER_TEMPLATES[0];
    const s = interpolateCoverLetter(tmpl.subject, variables);
    const b = interpolateCoverLetter(tmpl.body, variables);
    setEditableSubject(s);
    setEditableBody(b);
    setIsSaved(false);
  };

  // Sync variables changes into active template
  const handleVariableChange = (key: string, value: string) => {
    const updated = { ...variables, [key]: value };
    setVariables(updated);
    setIsSaved(false);
  };

  // Apply variables to subject and body
  const handleRegenerateFromTemplate = () => {
    const s = interpolateCoverLetter(activeTemplate.subject, variables);
    const b = interpolateCoverLetter(activeTemplate.body, variables);
    setEditableSubject(s);
    setEditableBody(b);
  };

  // Gemini AI Generation
  const handleGenerateWithAI = async () => {
    const targetJob = variables.Poste || 'Candidat';
    const targetCompany = variables.Entreprise || 'Entreprise';
    const userExperienceText = `Compétences et parcours : ${variables['Compétence Clé'] || ''}. Raison d'intérêt : ${variables.Raison || ''}`;

    setIsGenerating(true);
    setGenerationError(null);
    setGenerationSuccess(null);
    setPreviousBody(editableBody);

    try {
      // 1. Appel direct au helper Gemini
      const generatedText = await generateCoverLetter(
        targetJob,
        targetCompany,
        userExperienceText,
        lang === 'ar' ? 'ar' : lang === 'en' ? 'en' : 'fr'
      );

      if (generatedText && generatedText.trim().length > 50) {
        setEditableBody(generatedText.trim());
        setEditableSubject(`Candidature au poste de ${targetJob} - ${variables.Nom}`);
        setGenerationSuccess('Lettre rédigée sur mesure avec Gemini AI !');
        setIsSaved(false);
        return;
      }
      throw new Error('Réponse IA vide ou trop courte.');
    } catch (err: any) {
      console.warn('Fallback vers /api/ai/cover-letter...', err);
      try {
        const res = await fetch('/api/ai/cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: targetJob,
            companyName: targetCompany,
            skills: [variables['Compétence Clé']],
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
          setGenerationSuccess('Lettre rédigée sur mesure avec l\'IA !');
          setIsSaved(false);
          return;
        }
        throw new Error(data.details || data.error || 'Échec de la génération.');
      } catch (backendErr: any) {
        console.error('Erreur génération lettre:', backendErr);
        setGenerationError(
          backendErr.message || err.message || 'Une erreur est survenue lors de la communication avec l\'IA.'
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

  const handleSave = async () => {
    const letterToSave: CoverLetterData = {
      id: activeLetterId || 'letter_' + Math.random().toString(36).substring(2, 9) + Date.now(),
      userId: user?.id || 'guest',
      title: letterTitle || `Lettre - ${variables.Poste || 'Candidature'}`,
      jobTitle: variables.Poste || 'Poste',
      companyName: variables.Entreprise || 'Entreprise',
      recipientName: variables.Destinataire || 'Recruteur',
      content: editableBody,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await storageService.saveCoverLetter(letterToSave, user?.id || 'guest');
    setActiveLetterId(letterToSave.id);
    setIsSaved(true);
    loadLetters();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette lettre de motivation ?')) {
      await storageService.deleteCoverLetter(id, user?.id || 'guest');
      if (activeLetterId === id) {
        initNewLetter();
      }
      loadLetters();
    }
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
      const safeName = (variables.Nom || 'Candidat').trim().replace(/\s+/g, '_');
      const fileName = `VITAREY_Lettre_${safeName}.pdf`;

      const success = await exportCVToPDF({
        fileName,
        elementId: 'cover-letter-doc',
        onProgress: (status) => setDownloadProgressText(status)
      });

      if (!success) {
        console.warn('[CoverLetterStudio] Échec de la génération du PDF.');
      }
    } catch (err) {
      console.error('[CoverLetterStudio] Erreur export PDF:', err);
    } finally {
      setIsDownloading(false);
      setDownloadProgressText('');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-400/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            <span>Générateur Indépendant de Lettre de Motivation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Rédigez des lettres de motivation percutantes en quelques clics
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
            Créez des candidatures ciblées grâce à nos 6 modèles professionnels certifiés ou laissez notre assistant IA Gemini adapter votre discours aux attentes précises du recruteur.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={initNewLetter}
            className="px-5 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle Lettre</span>
          </button>
        </div>
      </div>

      {/* Saved letters list drawer / pill selector */}
      {letters.length > 0 && (
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              <Layers className="w-4 h-4 text-purple-600" />
              <span>Vos lettres sauvegardées ({letters.length})</span>
            </div>
            <span className="text-[11px] text-slate-400">Cliquez pour charger dans l'éditeur</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {letters.map((letItem) => {
              const isSelected = activeLetterId === letItem.id;
              return (
                <div
                  key={letItem.id}
                  onClick={() => loadLetterIntoEditor(letItem)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isSelected
                      ? 'border-purple-600 bg-purple-50/70 ring-2 ring-purple-600/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 truncate">
                      {letItem.title || 'Lettre sans titre'}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate mt-0.5">
                      {letItem.jobTitle} • {letItem.companyName}
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(letItem.id);
                    }}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer la lettre"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Workspace: 2-Column Split (Left: Settings & Inputs / Right: Live A4 Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Template choice + Form + AI Button + Live Text Editor */}
        <div className="lg:col-span-6 space-y-6">
          {/* Template Selection Chips */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>1. Modèle de lettre certifié</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COVER_LETTER_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplateId === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={`p-2.5 rounded-xl text-left transition-all border text-xs cursor-pointer ${
                      isSelected
                        ? 'border-purple-600 bg-purple-50 text-purple-900 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <div className="truncate font-semibold">{tmpl.title}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{tmpl.badge}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Variables & Targeting Details */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                <span>2. Paramètres du poste & Coordonnées</span>
              </label>
              {latestCV && (
                <button
                  type="button"
                  onClick={() => {
                    setVariables((prev) => ({
                      ...prev,
                      Nom: `${latestCV.personalInfo.firstName} ${latestCV.personalInfo.lastName}`.trim() || prev.Nom,
                      Email: latestCV.personalInfo.email || prev.Email,
                      Téléphone: latestCV.personalInfo.phone || prev.Téléphone,
                      Ville: latestCV.personalInfo.city || prev.Ville,
                      Poste: latestCV.personalInfo.title || prev.Poste,
                      'Compétence Clé': latestCV.skills.map((s) => s.name).slice(0, 4).join(', ') || prev['Compétence Clé']
                    }));
                  }}
                  className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold underline cursor-pointer"
                >
                  Importer depuis mon CV
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Poste ciblé</label>
                <input
                  type="text"
                  value={variables.Poste}
                  onChange={(e) => handleVariableChange('Poste', e.target.value)}
                  placeholder="Ex: Chef de Projet Digital"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Entreprise ciblée</label>
                <input
                  type="text"
                  value={variables.Entreprise}
                  onChange={(e) => handleVariableChange('Entreprise', e.target.value)}
                  placeholder="Ex: Tech Innovations SAS"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Destinataire / Salutation</label>
                <input
                  type="text"
                  value={variables.Destinataire}
                  onChange={(e) => handleVariableChange('Destinataire', e.target.value)}
                  placeholder="Ex: Madame, Monsieur les Responsables du Recrutement"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Vos compétences phares</label>
                <input
                  type="text"
                  value={variables['Compétence Clé']}
                  onChange={(e) => handleVariableChange('Compétence Clé', e.target.value)}
                  placeholder="Ex: React, TypeScript, Management Agile"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Votre Nom</label>
                <input
                  type="text"
                  value={variables.Nom}
                  onChange={(e) => handleVariableChange('Nom', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Téléphone</label>
                <input
                  type="text"
                  value={variables.Téléphone}
                  onChange={(e) => handleVariableChange('Téléphone', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Email</label>
                <input
                  type="text"
                  value={variables.Email}
                  onChange={(e) => handleVariableChange('Email', e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200"
                />
              </div>
            </div>
          </div>

          {/* AI Assistance Action Bar */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-5 rounded-2xl border border-purple-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">Assistant IA Gemini</h4>
                  <p className="text-[11px] text-slate-500">Rédigez une lettre sur mesure adaptée au poste et à l'entreprise</p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 disabled:opacity-60 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Rédaction en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Rédiger avec l'IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Notification Messages */}
            {generationSuccess && (
              <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{generationSuccess}</span>
                </div>
                {previousBody && (
                  <button
                    onClick={handleUndo}
                    className="flex items-center gap-1 text-emerald-700 hover:underline font-bold"
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Annuler</span>
                  </button>
                )}
              </div>
            )}

            {generationError && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{generationError}</span>
              </div>
            )}
          </div>

          {/* Editable Subject & Body Inputs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Edit className="w-3.5 h-3.5 text-blue-600" />
                <span>3. Texte de la lettre (Objet & Corps)</span>
              </label>
              <button
                type="button"
                onClick={handleRegenerateFromTemplate}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                title="Réinitialiser avec les variables du modèle"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Réinitialiser</span>
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Objet</label>
              <input
                type="text"
                value={editableSubject}
                onChange={(e) => {
                  setEditableSubject(e.target.value);
                  setIsSaved(false);
                }}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 font-medium focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Corps de la lettre</label>
              <textarea
                rows={12}
                value={editableBody}
                onChange={(e) => {
                  setEditableBody(e.target.value);
                  setIsSaved(false);
                }}
                className="w-full p-3 text-xs leading-relaxed rounded-xl border border-slate-200 font-sans focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600 resize-y"
                placeholder="Rédigez ou laissez l'IA composer votre texte..."
              />
            </div>

            {/* Bottom Actions Bar */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaved ? 'Enregistré' : 'Enregistrer'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copié !' : 'Copier'}</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDownloading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                <span>{isDownloading ? downloadProgressText || 'Génération...' : 'Télécharger PDF A4'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Real-Time A4 Letter Preview */}
        <div className="lg:col-span-6 space-y-4 sticky top-6">
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-2xl border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-800">Aperçu A4 Standard (210 × 297 mm)</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
                <button
                  onClick={() => setScale((s) => Math.max(0.6, s - 0.05))}
                  className="p-1 hover:bg-white rounded text-slate-600 transition-colors"
                  title="Zoom arrière"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-bold px-2 text-slate-600">{Math.round(scale * 100)}%</span>
                <button
                  onClick={() => setScale((s) => Math.min(1.1, s + 0.05))}
                  className="p-1 hover:bg-white rounded text-slate-600 transition-colors"
                  title="Zoom avant"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-2xs"
              >
                {isDownloading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Letter A4 Paper Canvas Container */}
          <div className="bg-slate-200/80 p-4 sm:p-6 rounded-3xl border border-slate-300 flex justify-center overflow-auto shadow-inner max-h-[780px]">
            <div
              style={{
                transform: `scale(${scale})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
                width: '794px',
                minHeight: '1123px',
              }}
              className="shrink-0"
            >
              {/* The Actual Rendered Letter Sheet with Guaranteed A4 Single-Page Scaling */}
              <A4FitWrapper
                id="cover-letter-doc"
                className="shadow-2xl font-sans"
                dataDependency={{ variables, editableSubject, editableBody }}
                warningMessage="Lettre de motivation volumineuse — pensez à raccourcir le texte"
              >
                <div
                  className="bg-white p-14 text-slate-800 flex flex-col justify-between leading-relaxed text-sm min-h-[1123px] box-border"
                  style={{
                    width: '100%',
                    minHeight: '1123px',
                    boxSizing: 'border-box',
                  }}
                >
                  <div>
                    {/* Top Header: Candidate details (Left) & Date (Right) */}
                    <div className="flex justify-between items-start border-b border-slate-200 pb-6 mb-8">
                      <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                          {variables.Nom}
                        </h2>
                        <p className="text-xs font-bold text-blue-600 mt-0.5">{variables.Poste}</p>
                        <div className="text-xs text-slate-500 mt-2 space-y-0.5">
                          <p>{variables.Email} • {variables.Téléphone}</p>
                          <p>{variables.Ville}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-xs text-slate-400">Fait à {variables.Ville.split(',')[0] || 'Paris'}, le</p>
                        <p className="text-xs font-bold text-slate-700">{variables.Date}</p>
                      </div>
                    </div>

                    {/* Recipient Box */}
                    <div className="mb-10 pl-6 border-l-2 border-blue-600">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">À l'attention de</p>
                      <p className="font-bold text-sm text-slate-900 mt-0.5">{variables.Destinataire}</p>
                      <p className="font-bold text-base text-blue-900">{variables.Entreprise}</p>
                      <p className="text-xs text-slate-500">{variables.Ville}</p>
                    </div>

                    {/* Object Line */}
                    <div className="mb-8 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <span className="font-bold text-slate-900 text-xs">Objet : </span>
                      <span className="font-semibold text-slate-700 text-xs">{editableSubject}</span>
                    </div>

                    {/* Letter Body Paragraphs */}
                    <div className="text-slate-800 text-[13.5px] leading-relaxed whitespace-pre-line space-y-4 font-normal">
                      {editableBody}
                    </div>
                  </div>

                  {/* Footer Signature */}
                  <div className="mt-12 pt-6 border-t border-slate-100 flex justify-between items-end">
                    <div className="text-[11px] text-slate-400">
                      Document officiel de candidature • Certifié VITAREY conforme aux normes de recrutement
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">{variables.Nom}</p>
                      <div className="w-24 h-0.5 bg-blue-600 mt-1 ml-auto" />
                    </div>
                  </div>
                </div>
              </A4FitWrapper>
            </div>
          </div>
        </div>
      </div>

      {/* Optional Payment Modal if Cover Letters are protected */}
      {showPaymentModal && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => {
            setShowPaymentModal(false);
            setPassState(passService.getLocalPass());
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setPassState(passService.getLocalPass());
          }}
          initialPlan="unlimited_pass"
          lang={lang}
        />
      )}
    </div>
  );
};
