import React, { useState } from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { Sparkles, Loader2, Undo2, CheckCircle2, AlertCircle, Wand2 } from 'lucide-react';
import { enhanceProfileSummary } from '../../lib/gemini';

interface Props {
  summary: string;
  jobTitle?: string;
  skills?: string[];
  onChange: (summary: string) => void;
  lang?: LanguageCode;
}

export const StepProfile: React.FC<Props> = ({
  summary,
  jobTitle,
  skills,
  onChange,
  lang = 'fr',
}) => {
  const t = translations[lang] || translations.fr;
  const [loading, setLoading] = useState(false);
  const [previousSummary, setPreviousSummary] = useState<string | null>(null);
  const [highlightKeywords, setHighlightKeywords] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Appelle le service Gemini pour améliorer ou générer le résumé
   * et remplit automatiquement le textarea avec le contenu généré.
   */
  const handleEnhanceWithAI = async () => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    // Sauvegarde l'état précédent pour permettre l'annulation (Undo)
    if (summary.trim()) {
      setPreviousSummary(summary);
    }

    try {
      // 1. Appel direct via le service client Gemini (gemini-2.5-flash / gemini-3.6-flash)
      const result = await enhanceProfileSummary({
        jobTitle: jobTitle || '',
        skills: skills || [],
        currentSummary: summary,
        language: lang,
      });

      // Remplissage automatique direct du textarea
      onChange(result.improvedSummary);
      setHighlightKeywords(result.highlightKeywords || []);
      setSuccessMessage(
        summary.trim()
          ? 'Résumé enrichi et optimisé avec succès !'
          : 'Accroche professionnelle rédigée avec succès !'
      );
    } catch (err: any) {
      console.warn('⚠️ [StepProfile] Erreur directe Gemini, tentative via backend Express...');

      // 2. Repli de secours via l'API Express
      try {
        const res = await fetch('/api/ai/enhance-summary', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rawSummary: summary,
            jobTitle: jobTitle || '',
            skills: skills || [],
            lang,
          }),
        });
        const data = await res.json();
        if (res.ok && data.success && data.data?.improvedSummary) {
          onChange(data.data.improvedSummary);
          setHighlightKeywords(data.data.highlightKeywords || []);
          setSuccessMessage('Résumé enrichi et optimisé avec succès !');
          return;
        }
        throw new Error(data.details || data.error || 'Échec de la génération.');
      } catch (backendErr: any) {
        console.error('❌ [StepProfile] Échec de l\'optimisation :', backendErr);
        setError(
          backendErr.message ||
            err.message ||
            'Une erreur est survenue lors de la communication avec Gemini. Vérifiez votre clé API.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUndo = () => {
    if (previousSummary !== null) {
      onChange(previousSummary);
      setPreviousSummary(null);
      setSuccessMessage(null);
      setHighlightKeywords([]);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* En-tête de section */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Profil Professionnel</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Présentez votre parcours en 3 à 4 phrases d'impact résumant vos forces et vos objectifs.
        </p>
      </div>

      {/* Zone du Résumé avec bouton "Enhance with AI" dédié */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            {t.fieldSummary}
          </label>

          {/* Bouton "Enhance with AI" à côté du champ */}
          <div className="flex items-center gap-2">
            {previousSummary && (
              <button
                type="button"
                onClick={handleUndo}
                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                title="Restaurer votre texte précédent"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Annuler</span>
              </button>
            )}

            <button
              type="button"
              id="btn-enhance-profile-ai"
              disabled={loading}
              onClick={handleEnhanceWithAI}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Optimisation en cours...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  <span>
                    {summary.trim() ? 'Améliorer avec l\'IA (Auto-remplir)' : 'Générer avec l\'IA'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        <div className="relative">
          <textarea
            id="profile-summary-textarea"
            rows={6}
            value={summary}
            onChange={(e) => onChange(e.target.value)}
            placeholder={t.fieldSummaryPlaceholder || "Ex : Développeur Web passionné par les technologies modernes..."}
            className="w-full p-4 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden leading-relaxed shadow-2xs transition-all"
          />

          {loading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-2xs rounded-xl flex items-center justify-center gap-2 text-blue-700 font-semibold text-xs animate-in fade-in">
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
              <span>Génération du profil avec Gemini en cours...</span>
            </div>
          )}
        </div>

        {/* Compteur et conseils */}
        <div className="flex justify-between items-center text-xs text-slate-400">
          <span>Conseil : Mettez en avant vos compétences clés, votre valeur ajoutée et votre motivation.</span>
          <span className="font-mono text-[11px]">{summary.length} caractères</span>
        </div>

        {/* Message de succès et mots-clés valorisés */}
        {successMessage && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>

            {highlightKeywords.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-emerald-700 font-medium">Mots-clés valorisés :</span>
                {highlightKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md font-semibold text-[11px]"
                  >
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Affichage d'erreur éventuelle */}
        {error && (
          <div className="p-3.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-start gap-2 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Erreur lors de l'appel à Gemini</p>
              <p className="text-red-600 leading-relaxed">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
