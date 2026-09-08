import React, { useState } from 'react';
import { LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
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

export const StepCoverLetter: React.FC<StepCoverLetterProps> = ({
  coverLetter = '',
  jobTitle = '',
  companyName = '',
  userExperience = '',
  skills = [],
  onChange,
}) => {
  const { t, language } = useLanguage();

  // Local configuration
  const [currentJobTitle, setCurrentJobTitle] = useState(jobTitle);
  const [targetCompany, setTargetCompany] = useState(companyName);
  const [experienceDetails, setExperienceDetails] = useState(
    userExperience || (skills.length > 0 ? `Compétences : ${skills.join(', ')}` : '')
  );

  // Assistant states
  const [isGenerating, setIsGenerating] = useState(false);
  const [previousCoverLetter, setPreviousCoverLetter] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    setErrorMessage(null);
    setSuccessMessage(null);

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
      const generatedText = await generateCoverLetter(
        effectiveJob,
        effectiveCompany,
        effectiveExperience,
        language as 'fr' | 'ar' | 'en'
      );

      onChange(generatedText);
      setSuccessMessage(
        language === 'ar'
          ? 'تم توليد رسالة التحفيز بنجاح!'
          : language === 'en'
          ? 'Cover Letter generated successfully!'
          : 'Lettre de motivation générée et insérée avec succès !'
      );
    } catch (err: any) {
      console.warn('⚠️ [StepCoverLetter] Direct Gemini error, falling back to server route...');

      try {
        const res = await fetch('/api/ai/generate-cover-letter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            jobTitle: effectiveJob,
            companyName: effectiveCompany,
            experienceSummary: effectiveExperience,
            skills,
            lang: language,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.content) {
          onChange(data.data.content);
          setSuccessMessage(t('coverLetter.success', 'Lettre de motivation générée avec succès !'));
          return;
        }
        throw new Error(data.details || data.error || 'Échec de la génération.');
      } catch (backendErr: any) {
        console.error('❌ [StepCoverLetter] Generation failed:', backendErr);
        setErrorMessage(
          backendErr.message ||
            err.message ||
            'Une erreur est survenue lors de la communication avec Gemini.'
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-100 text-blue-700 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              {t('coverLetter.title', 'Lettre de Motivation')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t(
              'coverLetter.subtitle',
              "Rédigez une lettre de motivation captivante, personnalisée et ciblée pour l'entreprise visée grâce à Gemini."
            )}
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
                <span className="text-emerald-700">{t('common.copied', 'Copié !')}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t('common.copy', 'Copier le texte')}</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Configuration */}
      <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
          {t('coverLetter.settings', 'Paramètres de personnalisation')}
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 text-blue-600" />
              {t('coverLetter.jobTarget', 'Poste / Métier visé')}
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
              {t('coverLetter.companyTarget', 'Entreprise ciblée')}
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
            {t('coverLetter.keySkills', 'Compétences & Atouts clés à mettre en avant')}
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

      {/* Editor & AI trigger */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t('coverLetter.bodyTitle', 'Corps de la lettre')}
          </label>

          <div className="flex items-center gap-2">
            {previousCoverLetter && (
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer border border-slate-200"
                title="Restaurer la version précédente"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>{t('common.cancel', 'Annuler')}</span>
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
                  <span>{t('coverLetter.generating', 'Génération en cours...')}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>{t('coverLetter.generateAi', '✨ Générer avec l\'IA')}</span>
                </>
              )}
            </button>
          </div>
        </div>

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
                {t('common.undo', 'Rétablir l\'ancienne version')}
              </button>
            )}
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">{t('common.error', 'Erreur de génération :')}</span>
              <p className="text-red-600 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <div className="relative">
          <textarea
            id="step-cover-letter-textarea"
            rows={12}
            value={coverLetter}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t(
              'coverLetter.placeholder',
              "Rédigez votre lettre de motivation ici ou cliquez sur '✨ Générer avec l'IA' pour la créer automatiquement..."
            )}
            className="w-full p-4 bg-white border border-slate-300 rounded-xl text-sm leading-relaxed focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden shadow-2xs transition-all"
          />

          {isGenerating && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-2xs rounded-xl flex flex-col items-center justify-center gap-2.5 text-blue-700 font-semibold text-xs animate-in fade-in">
              <Loader2 className="w-7 h-7 animate-spin text-blue-600" />
              <span>{t('coverLetter.generatingWithGemini', 'Rédaction de votre lettre de motivation sur-mesure avec Gemini...')}</span>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>{t('coverLetter.advice', 'Conseil : Relisez et ajustez les détails personnels pour maximiser l\'impact de votre candidature.')}</span>
          <span className="font-mono text-[11px]">{coverLetter.length} {t('common.chars', 'caractères')}</span>
        </div>
      </div>
    </div>
  );
};

export default StepCoverLetter;
