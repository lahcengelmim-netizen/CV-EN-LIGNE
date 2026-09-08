import React from 'react';
import { LanguageSkill, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Globe, Plus, Trash2 } from 'lucide-react';

interface Props {
  languages: LanguageSkill[];
  onChange: (languages: LanguageSkill[]) => void;
  lang?: LanguageCode;
}

export const StepLanguages: React.FC<Props> = ({ languages, onChange }) => {
  const { t } = useLanguage();

  const commonLevels = [
    { value: 'native', label: t('form.languages.levels.native', 'Langue maternelle') },
    { value: 'fluent', label: t('form.languages.levels.fluent', 'Courant / Bilingue (C1/C2)') },
    { value: 'advanced', label: t('form.languages.levels.advanced', 'Avancé (B2)') },
    { value: 'intermediate', label: t('form.languages.levels.intermediate', 'Intermédiaire (B1)') },
    { value: 'beginner', label: t('form.languages.levels.beginner', 'Débutant (A1/A2)') },
  ];

  const handleAdd = () => {
    const newLang: LanguageSkill = {
      id: 'lang_' + Math.random().toString(36).substring(2, 9),
      language: '',
      level: commonLevels[1].label,
    };
    onChange([...languages, newLang]);
  };

  const handleRemove = (id: string) => {
    onChange(languages.filter((l) => l.id !== id));
  };

  const handleUpdate = (id: string, updated: Partial<LanguageSkill>) => {
    onChange(languages.map((l) => (l.id === id ? { ...l, ...updated } : l)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('form.languages.title', '6. Langues Maîtrisées')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('form.languages.subtitle', 'Indiquez les langues parlées et votre niveau de maîtrise.')}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="self-start sm:self-auto inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('form.languages.add', 'Ajouter une langue')}</span>
        </button>
      </div>

      {languages.length === 0 ? (
        <div className="p-8 text-center bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 space-y-3">
          <Globe className="w-8 h-8 text-slate-400 mx-auto" />
          <div className="text-sm font-semibold text-slate-700">
            {t('form.languages.empty', 'Aucune langue ajoutée')}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors"
          >
            {t('form.languages.add', 'Ajouter une langue')}
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {languages.map((item) => (
            <div
              key={item.id}
              className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center gap-3"
            >
              <div className="w-full sm:w-1/2">
                <input
                  type="text"
                  value={item.language}
                  onChange={(e) => handleUpdate(item.id, { language: e.target.value })}
                  placeholder="Ex : Français, Anglais, Espagnol, Arabe, Allemand..."
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="w-full sm:w-1/2 flex items-center gap-2">
                <select
                  value={item.level}
                  onChange={(e) => handleUpdate(item.id, { level: e.target.value })}
                  className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden font-medium text-slate-700"
                >
                  {commonLevels.map((lvl) => (
                    <option key={lvl.value} value={lvl.label}>
                      {lvl.label}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="p-2 text-slate-400 hover:text-red-500 rounded-lg shrink-0 cursor-pointer"
                  title={t('form.languages.remove', 'Supprimer')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
