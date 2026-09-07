import React, { useState } from 'react';
import { Experience, LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import {
  Briefcase,
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  Undo2,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';
import { AIEnhancerModal } from './AIEnhancerModal';
import { formatExperienceTasks } from '../../lib/gemini';

interface Props {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  lang?: LanguageCode;
}

export const StepExperience: React.FC<Props> = ({ experiences, onChange, lang = 'fr' }) => {
  const t = translations[lang] || translations.fr;
  const [activeExpForAI, setActiveExpForAI] = useState<Experience | null>(null);

  // États pour l'optimisation ATS par élément d'expérience
  const [optimizingId, setOptimizingId] = useState<string | null>(null);
  const [previousTasksMap, setPreviousTasksMap] = useState<Record<string, string[]>>({});
  const [adviceMap, setAdviceMap] = useState<Record<string, string>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string>>({});
  const [successMap, setSuccessMap] = useState<Record<string, boolean>>({});

  const handleAdd = () => {
    const newExp: Experience = {
      id: 'exp_' + Math.random().toString(36).substring(2, 9),
      position: '',
      company: '',
      city: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      tasks: [''],
    };
    onChange([...experiences, newExp]);
  };

  const handleRemove = (id: string) => {
    onChange(experiences.filter((e) => e.id !== id));
  };

  const handleUpdate = (id: string, updatedFields: Partial<Experience>) => {
    onChange(
      experiences.map((exp) => (exp.id === id ? { ...exp, ...updatedFields } : exp))
    );
  };

  const handleTaskChange = (expId: string, index: number, value: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const newTasks = [...exp.tasks];
    newTasks[index] = value;
    handleUpdate(expId, { tasks: newTasks });
  };

  const handleAddTask = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    handleUpdate(expId, { tasks: [...exp.tasks, ''] });
  };

  const handleRemoveTask = (expId: string, index: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const newTasks = exp.tasks.filter((_, i) => i !== index);
    handleUpdate(expId, { tasks: newTasks.length > 0 ? newTasks : [''] });
  };

  /**
   * Optimise directement les tâches en puces ATS pour une expérience donnée
   */
  const handleOptimizeDutiesATS = async (exp: Experience) => {
    if (!exp.position && !exp.company) {
      setErrorMap((prev) => ({
        ...prev,
        [exp.id]: 'Veuillez au minimum renseigner l\'intitulé du poste ou l\'entreprise pour guider l\'IA.',
      }));
      return;
    }

    setOptimizingId(exp.id);
    setErrorMap((prev) => ({ ...prev, [exp.id]: '' }));
    setSuccessMap((prev) => ({ ...prev, [exp.id]: false }));

    // Sauvegarde les tâches actuelles pour permettre l'annulation
    setPreviousTasksMap((prev) => ({ ...prev, [exp.id]: [...exp.tasks] }));

    try {
      // 1. Appel du helper formatExperienceTasks via Gemini SDK
      const result = await formatExperienceTasks({
        position: exp.position || 'Poste professionnel',
        company: exp.company || '',
        tasks: exp.tasks,
        description: exp.description || '',
        language: lang,
      });

      if (!result.improvedTasks || result.improvedTasks.length === 0) {
        throw new Error('Aucune tâche générée par Gemini.');
      }

      // Mise à jour de l'expérience avec les puces ATS générées
      handleUpdate(exp.id, {
        tasks: result.improvedTasks,
        description: exp.description || result.improvedDescription || '',
      });

      if (result.advice) {
        setAdviceMap((prev) => ({ ...prev, [exp.id]: result.advice! }));
      }
      setSuccessMap((prev) => ({ ...prev, [exp.id]: true }));
    } catch (err: any) {
      console.warn(`⚠️ [StepExperience] Erreur formatExperienceTasks pour ${exp.id}, tentative backend Express...`);

      // 2. Repli de secours via l'API Express
      try {
        const res = await fetch('/api/ai/enhance-experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: exp.position,
            company: exp.company,
            rawDescription: exp.description,
            tasks: exp.tasks,
            lang,
          }),
        });
        const data = await res.json();

        if (res.ok && data.success && data.data?.improvedTasks) {
          handleUpdate(exp.id, {
            tasks: data.data.improvedTasks,
            description: exp.description || data.data.improvedDescription || '',
          });
          if (data.data.advice) {
            setAdviceMap((prev) => ({ ...prev, [exp.id]: data.data.advice }));
          }
          setSuccessMap((prev) => ({ ...prev, [exp.id]: true }));
          return;
        }
        throw new Error(data.details || data.error || 'Échec de l\'optimisation ATS.');
      } catch (backendErr: any) {
        console.error('❌ [StepExperience] Échec de l\'optimisation ATS :', backendErr);
        setErrorMap((prev) => ({
          ...prev,
          [exp.id]:
            backendErr.message ||
            err.message ||
            'Une erreur est survenue lors de l\'optimisation des missions.',
        }));
      }
    } finally {
      setOptimizingId(null);
    }
  };

  const handleUndoTasks = (expId: string) => {
    const prev = previousTasksMap[expId];
    if (prev) {
      handleUpdate(expId, { tasks: prev });
      setPreviousTasksMap((m) => {
        const copy = { ...m };
        delete copy[expId];
        return copy;
      });
      setSuccessMap((s) => ({ ...s, [expId]: false }));
      setAdviceMap((a) => {
        const copy = { ...a };
        delete copy[expId];
        return copy;
      });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Expérience Professionnelle</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ajoutez vos postes passés et actuels. Optimisez vos missions au format ATS avec l'IA en un clic.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.expAdd}</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-semibold text-slate-700">Aucune expérience ajoutée</div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Même un stage, une alternance, un bénévolat ou un projet personnel valorise votre profil.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors"
          >
            Ajouter une première expérience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, idx) => {
            const isOptimizingThis = optimizingId === exp.id;
            const hasUndo = Boolean(previousTasksMap[exp.id]);
            const errorThis = errorMap[exp.id];
            const adviceThis = adviceMap[exp.id];
            const successThis = successMap[exp.id];

            return (
              <div
                key={exp.id}
                className="p-5 sm:p-6 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-5 transition-all relative"
              >
                {/* En-tête de carte avec numérotation et actions */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-800">
                      {exp.position || 'Poste sans titre'} {exp.company ? `— ${exp.company}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Bouton Modal IA détaillé */}
                    <button
                      type="button"
                      onClick={() => setActiveExpForAI(exp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span className="hidden sm:inline">Assistant IA complet</span>
                      <span className="sm:hidden">IA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer cette expérience"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grille de saisie */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.expPosition} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={exp.position}
                      onChange={(e) => handleUpdate(exp.id, { position: e.target.value })}
                      placeholder="Ex : Responsable Logistique, Développeur React..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.expCompany} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={exp.company}
                      onChange={(e) => handleUpdate(exp.id, { company: e.target.value })}
                      placeholder="Ex : Decathlon, Ubisoft, Cabinet Alpha..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.expCity}
                    </label>
                    <input
                      type="text"
                      value={exp.city}
                      onChange={(e) => handleUpdate(exp.id, { city: e.target.value })}
                      placeholder="Paris, Casablanca, Télétravail..."
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t.expStartDate}
                      </label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => handleUpdate(exp.id, { startDate: e.target.value })}
                        placeholder="Ex : 2021 ou 09/2021"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        {t.expEndDate}
                      </label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? 'Présent' : exp.endDate}
                        onChange={(e) => handleUpdate(exp.id, { endDate: e.target.value })}
                        placeholder="Ex : 2024 ou 06/2024"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Case Poste actuel */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current_${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => handleUpdate(exp.id, { current: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`current_${exp.id}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                    {t.expCurrent}
                  </label>
                </div>

                {/* Description générale */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.expDescription}
                  </label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => handleUpdate(exp.id, { description: e.target.value })}
                    placeholder="Décrivez brièvement le contexte ou l'enjeu principal du poste..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Section Tâches et Missions avec le bouton d'optimisation ATS */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t.expTasks} (Missions & réalisations concrètes)
                    </label>

                    {/* Bouton d'optimisation ATS des missions avec Gemini */}
                    <div className="flex items-center gap-2">
                      {hasUndo && (
                        <button
                          type="button"
                          onClick={() => handleUndoTasks(exp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                          title="Restaurer les puces précédentes"
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>Annuler</span>
                        </button>
                      )}

                      <button
                        type="button"
                        id={`btn-optimize-duties-ats-${exp.id}`}
                        disabled={isOptimizingThis}
                        onClick={() => handleOptimizeDutiesATS(exp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
                        title="Réécrire et formater automatiquement les missions en puces d'action ATS conformes"
                      >
                        {isOptimizingThis ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Optimisation ATS en cours...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                            <span>Optimiser en puces ATS avec l'IA</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Notification de succès */}
                  {successThis && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Missions reformulées en puces d'impact ATS avec succès !</span>
                      </div>
                      {hasUndo && (
                        <button
                          type="button"
                          onClick={() => handleUndoTasks(exp.id)}
                          className="text-emerald-700 underline text-[11px] hover:text-emerald-900"
                        >
                          Rétablir la version précédente
                        </button>
                      )}
                    </div>
                  )}

                  {/* Conseil entretien généré par Gemini */}
                  {adviceThis && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900 animate-in fade-in">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold">Conseil pour vos entretiens :</span>
                        <p className="text-amber-800 leading-relaxed">{adviceThis}</p>
                      </div>
                    </div>
                  )}

                  {/* Message d'erreur localisé */}
                  {errorThis && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorThis}</span>
                    </div>
                  )}

                  {/* Liste des champs d'édition de tâches */}
                  <div className="space-y-2">
                    {exp.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-center gap-2">
                        <span className="text-slate-400 font-bold">•</span>
                        <input
                          type="text"
                          value={task}
                          onChange={(e) => handleTaskChange(exp.id, taskIdx, e.target.value)}
                          placeholder="Ex : Concevoir et déployer une architecture d'API RESTful..."
                          className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveTask(exp.id, taskIdx)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                          title="Retirer cette puce"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => handleAddTask(exp.id)}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      Ajouter une mission manuellement
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal IA détaillée si l'utilisateur souhaite comparer avant d'appliquer */}
      {activeExpForAI && (
        <AIEnhancerModal
          isOpen={Boolean(activeExpForAI)}
          onClose={() => setActiveExpForAI(null)}
          position={activeExpForAI.position}
          company={activeExpForAI.company}
          originalDescription={activeExpForAI.description}
          originalTasks={activeExpForAI.tasks}
          lang={lang}
          onAccept={(desc, tasks) => {
            handleUpdate(activeExpForAI.id, {
              description: desc,
              tasks: tasks.length > 0 ? tasks : activeExpForAI.tasks,
            });
          }}
        />
      )}
    </div>
  );
};
