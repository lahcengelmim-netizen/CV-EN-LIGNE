import React, { useState } from 'react';
import { Experience, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
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

export const StepExperience: React.FC<Props> = ({ experiences, onChange }) => {
  const { t, language } = useLanguage();
  const [activeExpForAI, setActiveExpForAI] = useState<Experience | null>(null);

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

  const handleOptimizeDutiesATS = async (exp: Experience) => {
    if (!exp.position && !exp.company) {
      setErrorMap((prev) => ({
        ...prev,
        [exp.id]: t('ai.missingExpContext', 'Veuillez au minimum renseigner l\'intitulé du poste ou l\'entreprise pour guider l\'IA.'),
      }));
      return;
    }

    setOptimizingId(exp.id);
    setErrorMap((prev) => ({ ...prev, [exp.id]: '' }));
    setSuccessMap((prev) => ({ ...prev, [exp.id]: false }));
    setPreviousTasksMap((prev) => ({ ...prev, [exp.id]: [...exp.tasks] }));

    try {
      const result = await formatExperienceTasks({
        position: exp.position,
        company: exp.company,
        tasks: exp.tasks,
        description: exp.description,
        language: language,
      });

      if (result.improvedTasks && result.improvedTasks.length > 0) {
        handleUpdate(exp.id, { tasks: result.improvedTasks });
      }
      if (result.advice) {
        setAdviceMap((prev) => ({ ...prev, [exp.id]: result.advice || '' }));
      }
      setSuccessMap((prev) => ({ ...prev, [exp.id]: true }));
    } catch (err: any) {
      console.warn('⚠️ [StepExperience] Fallback backend...');

      try {
        const res = await fetch('/api/ai/enhance-experience', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            position: exp.position,
            company: exp.company,
            tasks: exp.tasks,
            rawDescription: exp.description,
            lang: language,
          }),
        });
        const data = await res.json();
        const improvedTasks = data?.data?.improvedTasks || data?.data?.formattedTasks;
        if (res.ok && data.success && Array.isArray(improvedTasks)) {
          handleUpdate(exp.id, { tasks: improvedTasks });
          const advice = data.data.advice || data.data.interviewAdvice;
          if (advice) {
            setAdviceMap((prev) => ({ ...prev, [exp.id]: advice }));
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
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('form.experience.title', '3. Expériences Professionnelles')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('form.experience.subtitle', 'Ajoutez vos postes passés et actuels. Optimisez vos missions au format ATS avec l\'IA en un clic.')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('form.experience.add', 'Ajouter une expérience')}</span>
        </button>
      </div>

      {experiences.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
          <Briefcase className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-semibold text-slate-700">
            {t('form.experience.empty', 'Aucune expérience ajoutée')}
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {t('form.experience.emptyDesc', 'Même un stage, une alternance, un bénévolat ou un projet personnel valorise votre profil.')}
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {t('form.experience.addFirst', 'Ajouter une première expérience')}
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
                {/* Header card */}
                <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-slate-800">
                      {exp.position || t('form.experience.untitled', 'Poste sans titre')} {exp.company ? `— ${exp.company}` : ''}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveExpForAI(exp)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span className="hidden sm:inline">{t('ai.fullAssistant', 'Assistant IA complet')}</span>
                      <span className="sm:hidden">IA</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemove(exp.id)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title={t('form.experience.remove', 'Supprimer cette expérience')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Grid Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t('form.experience.position', 'Intitulé du poste')} <span className="text-red-500">*</span>
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
                      {t('form.experience.company', 'Entreprise / Organisation')} <span className="text-red-500">*</span>
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
                      {t('form.experience.city', 'Ville')}
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
                        {t('form.experience.startDate', 'Date de début')}
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
                        {t('form.experience.endDate', 'Date de fin')}
                      </label>
                      <input
                        type="text"
                        disabled={exp.current}
                        value={exp.current ? t('form.experience.present', 'Présent') : exp.endDate}
                        onChange={(e) => handleUpdate(exp.id, { endDate: e.target.value })}
                        placeholder="Ex : 2024 ou 06/2024"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:bg-slate-100 disabled:text-slate-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Current checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`current_${exp.id}`}
                    checked={exp.current}
                    onChange={(e) => handleUpdate(exp.id, { current: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor={`current_${exp.id}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                    {t('form.experience.current', 'J\'occupe actuellement ce poste')}
                  </label>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t('form.experience.description', 'Description générale du rôle')}
                  </label>
                  <textarea
                    rows={2}
                    value={exp.description}
                    onChange={(e) => handleUpdate(exp.id, { description: e.target.value })}
                    placeholder="Décrivez brièvement le contexte ou l'enjeu principal du poste..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Tasks & AI */}
                <div className="space-y-3 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                      {t('form.experience.tasks', 'Missions clés et réalisations mesurables')}
                    </label>

                    <div className="flex items-center gap-2">
                      {hasUndo && (
                        <button
                          type="button"
                          onClick={() => handleUndoTasks(exp.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition-colors cursor-pointer"
                          title={t('common.undo', 'Annuler')}
                        >
                          <Undo2 className="w-3.5 h-3.5" />
                          <span>{t('common.undo', 'Annuler')}</span>
                        </button>
                      )}

                      <button
                        type="button"
                        id={`btn-optimize-duties-ats-${exp.id}`}
                        disabled={isOptimizingThis}
                        onClick={() => handleOptimizeDutiesATS(exp)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-xs hover:shadow-md transition-all disabled:opacity-60 cursor-pointer"
                      >
                        {isOptimizingThis ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>{t('ai.optimizingAts', 'Optimisation ATS en cours...')}</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                            <span>{t('form.experience.aiEnhance', 'Optimiser avec l\'IA')}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {successThis && (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800 font-semibold animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{t('ai.tasksSuccess', 'Missions reformulées en puces d\'impact ATS avec succès !')}</span>
                      </div>
                      {hasUndo && (
                        <button
                          type="button"
                          onClick={() => handleUndoTasks(exp.id)}
                          className="text-emerald-700 underline text-[11px] hover:text-emerald-900 cursor-pointer"
                        >
                          {t('common.restore', 'Rétablir la version précédente')}
                        </button>
                      )}
                    </div>
                  )}

                  {adviceThis && (
                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-900 animate-in fade-in">
                      <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <span className="font-bold">{t('ai.interviewAdvice', 'Conseil pour vos entretiens :')}</span>
                        <p className="text-amber-800 leading-relaxed">{adviceThis}</p>
                      </div>
                    </div>
                  )}

                  {errorThis && (
                    <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200 flex items-center gap-2 animate-in fade-in">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                      <span>{errorThis}</span>
                    </div>
                  )}

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
                      {t('form.experience.addTask', 'Ajouter une puce')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeExpForAI && (
        <AIEnhancerModal
          isOpen={Boolean(activeExpForAI)}
          onClose={() => setActiveExpForAI(null)}
          position={activeExpForAI.position}
          company={activeExpForAI.company}
          originalDescription={activeExpForAI.description}
          originalTasks={activeExpForAI.tasks}
          lang={language}
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
