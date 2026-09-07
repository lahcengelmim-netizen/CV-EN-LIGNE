import React, { useState } from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { generateCoverLetter } from '../../lib/gemini';
import {
  Sparkles,
  Loader2,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Building2,
  Briefcase,
  FileText,
  RotateCcw
} from 'lucide-react';

export interface StepCoverLetterProps {
  coverLetter?: string;
  jobTitle?: string;
  companyName?: string;
  userExperience?: string;
  skills?: string[];
  onChange: (coverLetter: string) => void;
  lang?: LanguageCode;
}

/**
 * StepCoverLetter Component
 * Étape ou module de rédaction de Lettre de Motivation assistée par Gemini AI
 */
export const StepCoverLetter: React.FC<StepCoverLetterProps> = ({
  coverLetter = '',
  jobTitle = '',
  companyName = '',
  userExperience = '',
  skills = [],
  onChange,
  lang = 'fr',
}) => {
  const t = translations[lang] || translations.fr;

  // Champs de configuration locaux
  const [currentJobTitle, setCurrentJobTitle] = useState(jobTitle);
  const [targetCompany, setTargetCompany] = useState(companyName);
  const [experienceDetails, setExperienceDetails] = useState(
    userExperience || (skills.length > 0 ? `Compétences : ${skills.join(', ')}` : '')
  );

  // États de l'assistant IA
  const [isGenerating, setIsGenerating] = useState(false);
  const [previousCoverLetter, setPreviousCoverLetter] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  /**
   * Déclenche la génération de la lettre avec Gemini AI
   */
  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    // Sauvegarde de l'état précédent pour la fonction Annuler
    if (coverLetter.trim()) {
      setPreviousCoverLetter(coverLetter);
    }

    const effectiveJob = currentJobTitle.trim() || jobTitle || 'Professionnel qualifié';
    const effectiveCompany = targetCompany.trim() || companyName || "l'entreprise ciblée";
    const effectiveExperience =
      experienceDetails.trim() ||
      userExperience ||
      (skills.length > 0 ? skills.join(', ') : 'Expérience et compétences solides');

    try {
      // Appel du helper Gemini exporté avec la signature positionnelle demandée
      const generatedText = await generateCoverLetter(
        effectiveJob,
        effectiveCompany,
        effectiveExperience,
        lang as 'fr' | 'ar' | 'en'
      );

      // Auto-remplissage du champ textarea
      onChange(generatedText);
      setSuccessMessage(
        lang === 'ar'
          ? 'تم توليد رسالة التحفيز بنجاح!'
          : lang === 'en'
          ? 'Cover Letter generated successfully!'
          : 'Lettre de motivation générée et insérée avec succès !'
      );
    } catch (err: any) {
      console.warn('⚠️ [StepCoverLetter] Erreur directe Gemini, tentative via route serveur...');

      try {
        const res = await fetch('/api/ai/generate-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: effectiveJob,
            companyName: effectiveCompany,
            experienceSummary: effectiveExperience,
            skills,
            lang,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.content) {
          onChange(data.data.content);
          setSuccessMessage('Lettre de motivation générée avec succès !');
          return;
        }
        throw new Error(data.details || data.error || 'Échec de la génération.');
      } catch (backendErr: any) {
        console.error('❌ [StepCoverLetter] Échec de la génération :', backendErr);
        setErrorMessage(
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
    if (previousCoverLetter !== null) {
      onChange(previousCoverLetter);
      setPreviousCoverLetter(null);
      setSuccessMessage(null);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* En-tête de la section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {lang === 'ar'
                ? 'خطاب التحفيز'
                : lang === 'en'
                ? 'Cover Letter'
                : 'Lettre de Motivation'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {lang === 'ar'
              ? 'قم بإنشاء خطاب تحفيزي احترافي ومخصص لمنصبك المستهدف باستخدام الذكاء الاصطناعي.'
              : lang === 'en'
              ? 'Create a customized, professional cover letter tailored to your target position with Gemini AI.'
              : "Rédigez une lettre de motivation captivante, personnalisée et ciblée pour l'entreprise visée grâce à Gemini."}
          </p>
        </div>

        {coverLetter && (
          <button
            type="button"
            onClick={handleCopy}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copier le texte</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Paramètres de contexte pour la personnalisation */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          Paramètres de personnalisation
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              Poste / Métier visé
            </label>
            <input
              type="text"
              value={currentJobTitle}
              onChange={(e) => setCurrentJobTitle(e.target.value)}
              placeholder="Ex : Développeur Full Stack, Chef de Projet..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              Entreprise ciblée
            </label>
            <input
              type="text"
              value={targetCompany}
              onChange={(e) => setTargetCompany(e.target.value)}
              placeholder="Ex : Google, Doctolib, Société Générale..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Compétences & Atouts clés à mettre en avant
          </label>
          <input
            type="text"
            value={experienceDetails}
            onChange={(e) => setExperienceDetails(e.target.value)}
            placeholder="Ex : React, TypeScript, gestion d'équipe, méthodologie Agile Scrum..."
            className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Zone d'édition du texte et bouton d'action IA */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {lang === 'ar'
              ? 'محتوى خطاب التحفيز'
              : lang === 'en'
              ? 'Cover Letter Content'
              : 'Corps de la lettre'}
          </label>

          {/* Bouton "✨ Generate with AI / Générer avec IA" */}
          <div className="flex items-center gap-2">
            {previousCoverLetter && (
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                title="Restaurer la version précédente"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Annuler</span>
              </button>
            )}

            <button
              type="button"
              id="btn-generate-cover-letter-step-ai"
              disabled={isGenerating}
              onClick={handleGenerateWithAI}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
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
                      ? '✨ توليد بالذكاء الاصطناعي'
                      : lang === 'en'
                      ? '✨ Generate with AI'
                      : '✨ Générer avec l\'IA'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Message de succès */}
        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
            {previousCoverLetter && (
              <button
                type="button"
                onClick={handleUndo}
                className="text-emerald-700 underline text-[11px] hover:text-emerald-900 cursor-pointer"
              >
                Rétablir l'ancienne version
              </button>
            )}
          </div>
        )}

        {/* Message d'erreur */}
        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Erreur de génération :</span>
              <p className="text-red-600 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        {/* Zone de saisie principale */}
        <div className="relative">
          <textarea
            id="step-cover-letter-textarea"
            rows={12}
            value={coverLetter}
            onChange={(e) => onChange(e.target.value)}
            placeholder={
              lang === 'en'
                ? "Write your cover letter here or click '✨ Generate with AI' above to create one automatically..."
                : "Rédigez votre lettre de motivation ici ou cliquez sur '✨ Générer avec l'IA' pour la créer automatiquement..."
            }
            className="w-full p-4 bg-white border border-slate-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden shadow-2xs transition-all"
          />

          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center gap-2.5 text-blue-700 font-semibold text-xs animate-in fade-in">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
              <span>Rédaction de votre lettre de motivation sur-mesure avec Gemini...</span>
            </div>
          )}
        </div>

        {/* Compteur et conseils */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Conseil : Relisez et ajustez les détails personnels pour maximiser l'impact de votre candidature.</span>
          <span className="font-mono text-[11px]">{coverLetter.length} caractères</span>
        </div>
      </div>
    </div>
  );
};
export default StepCoverLetter;
