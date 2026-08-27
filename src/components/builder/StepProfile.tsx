import React, { useState } from 'react';
import { LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { Sparkles, Loader2, Check, RefreshCw, Wand2 } from 'lucide-react';

interface Props {
  summary: string;
  jobTitle?: string;
  skills?: string[];
  onChange: (summary: string) => void;
  lang?: LanguageCode;
}

export const StepProfile: React.FC<Props> = ({ summary, jobTitle, skills, onChange, lang = 'fr' }) => {
  const t = translations[lang] || translations.fr;
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleAIOptimize = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/enhance-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawSummary: summary,
          jobTitle: jobTitle || '',
          skills: skills || [],
          lang
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Erreur lors de l\'optimisation');
      }

      setSuggestion(data.data.improvedSummary);
      setKeywords(data.data.highlightKeywords || []);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">2. Profil Professionnel</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Rédigez une courte présentation de 3 à 4 phrases résumant vos forces et votre objectif.
          </p>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handleAIOptimize}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs transition-all disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5 text-yellow-300" />
          )}
          <span>{summary ? 'Améliorer avec l\'IA' : 'Générer une accroche avec l\'IA'}</span>
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t.fieldSummary}
        </label>
        <textarea
          rows={6}
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.fieldSummaryPlaceholder}
          className="w-full p-3.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-hidden leading-relaxed"
        />
        <div className="flex justify-between text-xs text-slate-400">
          <span>Conseil : Mettez en avant vos compétences clés et votre motivation.</span>
          <span>{summary.length} caractères</span>
        </div>
      </div>

      {/* AI Suggestion Box */}
      {suggestion && (
        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 rounded-2xl border border-blue-200 space-y-3 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-blue-900 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Proposition optimisée par l'Assistant IA</span>
            </div>
            <button
              type="button"
              onClick={handleAIOptimize}
              className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Régénérer
            </button>
          </div>

          <p className="text-xs sm:text-sm text-slate-800 bg-white p-3.5 rounded-xl border border-blue-100 leading-relaxed font-medium">
            {suggestion}
          </p>

          {keywords.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-500 font-medium">Mots-clés valorisés :</span>
              {keywords.map((kw, i) => (
                <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-semibold text-[11px]">
                  {kw}
                </span>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setSuggestion(null)}
              className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg font-semibold"
            >
              Ignorer
            </button>
            <button
              type="button"
              onClick={() => {
                onChange(suggestion);
                setSuggestion(null);
              }}
              className="px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Remplacer par cette proposition
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
};
