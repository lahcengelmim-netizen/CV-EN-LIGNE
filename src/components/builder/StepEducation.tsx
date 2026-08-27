import React from 'react';
import { Education, LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { GraduationCap, Plus, Trash2 } from 'lucide-react';

interface Props {
  educations: Education[];
  onChange: (educations: Education[]) => void;
  lang?: LanguageCode;
}

export const StepEducation: React.FC<Props> = ({ educations, onChange, lang = 'fr' }) => {
  const t = translations[lang] || translations.fr;

  const handleAdd = () => {
    const newEdu: Education = {
      id: 'edu_' + Math.random().toString(36).substring(2, 9),
      degree: '',
      institution: '',
      city: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onChange([...educations, newEdu]);
  };

  const handleRemove = (id: string) => {
    onChange(educations.filter((e) => e.id !== id));
  };

  const handleUpdate = (id: string, updatedFields: Partial<Education>) => {
    onChange(
      educations.map((edu) => (edu.id === id ? { ...edu, ...updatedFields } : edu))
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">4. Formations & Diplômes</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Indiquez vos diplômes, études supérieures, baccalauréat ou formations professionnelles certifiantes.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.eduAdd}</span>
        </button>
      </div>

      {educations.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
          <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-semibold text-slate-700">Aucune formation renseignée</div>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
          >
            Ajouter une formation
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map((edu, idx) => (
            <div
              key={edu.id}
              className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 relative"
            >
              <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                <span className="font-bold text-sm text-slate-800">
                  {idx + 1}. {edu.degree || 'Nouveau diplôme'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(edu.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Supprimer cette formation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.eduDegree} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={edu.degree}
                    onChange={(e) => handleUpdate(edu.id, { degree: e.target.value })}
                    placeholder="Ex : Master Informatique, BTS Commerce, Baccalauréat..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.eduInstitution} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={edu.institution}
                    onChange={(e) => handleUpdate(edu.id, { institution: e.target.value })}
                    placeholder="Ex : Université Paris 1, Lycée Victor Hugo..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    {t.eduCity}
                  </label>
                  <input
                    type="text"
                    value={edu.city}
                    onChange={(e) => handleUpdate(edu.id, { city: e.target.value })}
                    placeholder="Ex : Lyon, Paris..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.eduStartDate}
                    </label>
                    <input
                      type="text"
                      value={edu.startDate}
                      onChange={(e) => handleUpdate(edu.id, { startDate: e.target.value })}
                      placeholder="2018"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {t.eduEndDate}
                    </label>
                    <input
                      type="text"
                      disabled={edu.current}
                      value={edu.current ? 'En cours' : edu.endDate}
                      onChange={(e) => handleUpdate(edu.id, { endDate: e.target.value })}
                      placeholder="2021"
                      className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden disabled:bg-slate-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={`current_edu_${edu.id}`}
                  checked={edu.current}
                  onChange={(e) => handleUpdate(edu.id, { current: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded-sm border-slate-300"
                />
                <label htmlFor={`current_edu_${edu.id}`} className="text-xs font-medium text-slate-700 cursor-pointer">
                  {t.eduCurrent}
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {t.eduDescription}
                </label>
                <input
                  type="text"
                  value={edu.description}
                  onChange={(e) => handleUpdate(edu.id, { description: e.target.value })}
                  placeholder="Mention Très Bien, Major de promo, Spécialisation..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
