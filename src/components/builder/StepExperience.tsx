import React, { useState } from 'react';
import { Experience, LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { Briefcase, Plus, Trash2, Sparkles, Calendar, MapPin, Building, ChevronDown, ChevronUp } from 'lucide-react';
import { AIEnhancerModal } from './AIEnhancerModal';

interface Props {
  experiences: Experience[];
  onChange: (experiences: Experience[]) => void;
  lang?: LanguageCode;
}

export const StepExperience: React.FC<Props> = ({ experiences, onChange, lang = 'fr' }) => {
  const t = translations[lang] || translations.fr;
  const [activeExpForAI, setActiveExpForAI] = useState<Experience | null>(null);

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
      tasks: ['']
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

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">3. Expérience Professionnelle</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Ajoutez vos postes passés et actuels. Utilisez notre Assistant IA pour valoriser vos missions sans rien inventer.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
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
            Même un stage, une alternance, un bénévolat ou un projet associatif valorise votre profil.
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Ajouter une première expérience
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {experiences.map((exp, idx) => (
            <div
              key={exp.id}
              className="p-5 sm:p-6 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-5 transition-all relative"
            >
              {/* Header card with numbering */}
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
                  {/* AI Enhance Button for this specific experience */}
                  <button
                    type="button"
                    onClick={() => setActiveExpForAI(exp)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                    <span>Améliorer avec l'IA</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRemove(exp.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer cette expérience"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Input grid */}
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
                    placeholder="Ex : Responsable Logistique, Développeur Web, Vendeur..."
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
                    placeholder="Ex : Carrefour, Ubisoft, Cabinet Alpha..."
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
                    placeholder="Paris, Télétravail..."
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

              {/* Current Job Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current_${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => handleUpdate(exp.id, { current: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300 focus:ring-blue-500"
                />
                <label htmlFor={`current_${exp.id}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                  {t.expCurrent}
                </label>
              </div>

              {/* General Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.expDescription}
                </label>
                <textarea
                  rows={2}
                  value={exp.description}
                  onChange={(e) => handleUpdate(exp.id, { description: e.target.value })}
                  placeholder="Décrivez en quelques mots l'enjeu de votre poste..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              {/* Bullet points Tasks */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {t.expTasks} (Missions & réalisations concrètes)
                </label>
                {exp.tasks.map((task, taskIdx) => (
                  <div key={taskIdx} className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold">•</span>
                    <input
                      type="text"
                      value={task}
                      onChange={(e) => handleTaskChange(exp.id, taskIdx, e.target.value)}
                      placeholder="Ex : Réduction des délais de livraison de 20%, Gestion d'une équipe de 4 personnes..."
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveTask(exp.id, taskIdx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                      title="Retirer cette puce"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={() => handleAddTask(exp.id)}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 pt-1"
                >
                  <Plus className="w-3 h-3" />
                  Ajouter une mission / tâche
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Enhancer Modal instance */}
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
              tasks: tasks.length > 0 ? tasks : activeExpForAI.tasks
            });
          }}
        />
      )}
    </div>
  );
};
