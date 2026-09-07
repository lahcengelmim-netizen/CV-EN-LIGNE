import React, { useState } from 'react';
import { Sparkles, Check, Edit3, RotateCcw, X, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { LanguageCode } from '../../types';

interface AIEnhancerModalProps {
  isOpen: boolean;
  onClose: () => void;
  position: string;
  company: string;
  originalDescription: string;
  originalTasks: string[];
  lang?: LanguageCode;
  onAccept: (enhancedDesc: string, enhancedTasks: string[]) => void;
}

export const AIEnhancerModal: React.FC<AIEnhancerModalProps> = ({
  isOpen,
  onClose,
  position,
  company,
  originalDescription,
  originalTasks,
  lang = 'fr',
  onAccept
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    improvedDescription: string;
    improvedTasks: string[];
    advice?: string;
  } | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');
  const [editedTasks, setEditedTasks] = useState<string[]>([]);

  // Trigger AI generation
  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/ai/enhance-experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          position,
          company,
          rawDescription: originalDescription,
          tasks: originalTasks,
          lang
        })
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        console.error('❌ [AIEnhancerModal] Erreur API:', data);
        const detailMsg = data.details ? `${data.error} (${data.details})` : (data.error || 'Erreur lors de l\'amélioration de l\'expérience');
        throw new Error(detailMsg);
      }

      setResult(data.data);
      setEditedDescription(data.data.improvedDescription || '');
      setEditedTasks(data.data.improvedTasks || []);
    } catch (err: any) {
      console.error('❌ [AIEnhancerModal] Exception capturée:', err);
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && !result && !loading) {
      handleGenerate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-base">Assistant IA — Optimisation d'expérience</h3>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
                Valorise vos informations sans jamais inventer de données
              </p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="text-sm font-semibold text-slate-700">L'IA analyse et reformule votre expérience...</div>
              <p className="text-xs text-slate-500 max-w-sm">Application de verbes d'action, structuration des responsabilités et mise en valeur professionnelle.</p>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
              <div className="font-semibold mb-1">Une erreur est survenue</div>
              <p className="text-xs">{error}</p>
              <button 
                onClick={handleGenerate} 
                className="mt-3 px-3 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700"
              >
                Réessayer
              </button>
            </div>
          )}

          {!loading && result && (
            <div className="space-y-5">
              {/* Context bar */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-xs flex justify-between items-center">
                <div>
                  <span className="text-slate-500 font-medium">Poste : </span>
                  <span className="font-bold text-slate-900">{position || 'Poste occupé'}</span>
                  {company && <span className="text-slate-600"> chez <strong className="text-slate-900">{company}</strong></span>}
                </div>
                <button 
                  onClick={handleGenerate}
                  className="text-blue-600 hover:text-blue-700 text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Nouvelle proposition
                </button>
              </div>

              {/* Side-by-side or stacked view */}
              <div className="space-y-4">
                {/* Original text reminder */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                  <div className="font-semibold text-slate-500 uppercase text-[10px] tracking-wider">
                    Texte original (votre saisie)
                  </div>
                  <p className="italic">« {originalDescription || originalTasks.join(' • ') || 'Aucune description saisie'} »</p>
                </div>

                {/* AI Proposed version */}
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase tracking-wider text-blue-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      Proposition professionnelle optimisée
                    </span>
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-xs text-blue-700 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      {isEditing ? 'Aperçu' : 'Personnaliser le texte'}
                    </button>
                  </div>

                  {!isEditing ? (
                    <div className="space-y-2.5 text-xs text-slate-800">
                      {editedDescription && (
                        <p className="leading-relaxed font-medium text-slate-900 bg-white p-3 rounded-lg border border-blue-100">
                          {editedDescription}
                        </p>
                      )}
                      {editedTasks && editedTasks.length > 0 && (
                        <div className="bg-white p-3 rounded-lg border border-blue-100 space-y-1.5">
                          <div className="font-bold text-slate-700 text-[11px]">Tâches valorisées :</div>
                          <ul className="space-y-1 text-slate-700">
                            {editedTasks.map((t, idx) => (
                              <li key={idx} className="flex items-start gap-1.5">
                                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Description principale :</label>
                        <textarea
                          rows={3}
                          value={editedDescription}
                          onChange={(e) => setEditedDescription(e.target.value)}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                      <div>
                        <label className="font-semibold text-slate-700 block mb-1">Tâches et responsabilités (une par ligne) :</label>
                        <textarea
                          rows={4}
                          value={editedTasks.join('\n')}
                          onChange={(e) => setEditedTasks(e.target.value.split('\n').filter(Boolean))}
                          className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                      </div>
                    </div>
                  )}

                  {result.advice && (
                    <div className="text-[11px] text-blue-700 bg-blue-100/60 p-2 rounded-lg">
                      💡 <strong>Conseil recruteur :</strong> {result.advice}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-300 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Conserver le texte original
          </button>

          <button
            disabled={loading || !result}
            onClick={() => {
              if (result) {
                onAccept(editedDescription, editedTasks);
                onClose();
              }
            }}
            className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            Accepter cette version
          </button>
        </div>
      </div>
    </div>
  );
};
