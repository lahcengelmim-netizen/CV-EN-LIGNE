import React, { useState } from 'react';
import { Skill, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Plus, X, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  skills: Skill[];
  jobTitle?: string;
  onChange: (skills: Skill[]) => void;
  lang?: LanguageCode;
}

export const StepSkills: React.FC<Props> = ({ skills, jobTitle, onChange }) => {
  const { t, language } = useLanguage();
  const [inputValue, setInputValue] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const handleAddSkill = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) return;

    const newSkill: Skill = {
      id: 'sk_' + Math.random().toString(36).substring(2, 9),
      name: trimmed,
      level: 4,
    };
    onChange([...skills, newSkill]);
    setInputValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(inputValue);
    }
  };

  const handleRemove = (id: string) => {
    onChange(skills.filter((s) => s.id !== id));
  };

  const handleLevelChange = (id: string, level: number) => {
    onChange(skills.map((s) => (s.id === id ? { ...s, level } : s)));
  };

  const fetchAISuggestions = async () => {
    if (!jobTitle) return;
    setLoadingAi(true);
    try {
      const response = await fetch('/api/ai/suggest-skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobTitle, lang: language }),
      });
      const data = await response.json();
      if (data.skills && Array.isArray(data.skills)) {
        const existingNames = new Set(skills.map((s) => s.name.toLowerCase()));
        setAiSuggestions(data.skills.filter((name: string) => !existingNames.has(name.toLowerCase())));
      }
    } catch {
      // ignore
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            {t('form.skills.title', '5. Compétences Clés')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {t('form.skills.subtitle', 'Mettez en avant vos savoir-faire techniques et compétences comportementales.')}
          </p>
        </div>

        {jobTitle && (
          <button
            type="button"
            disabled={loadingAi}
            onClick={fetchAISuggestions}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {loadingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-yellow-300" />}
            <span>{t('form.skills.suggestAi', 'Suggérer des compétences IA')}</span>
          </button>
        )}
      </div>

      {/* Input box */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('form.skills.placeholder', 'Ex : React, Gestion de projet, Python, Négociation...')}
          className="flex-1 p-3 bg-white border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
        />
        <button
          type="button"
          onClick={() => handleAddSkill(inputValue)}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t('form.skills.add', 'Ajouter')}</span>
        </button>
      </div>

      {/* AI Suggestions Pill Bar */}
      {aiSuggestions.length > 0 && (
        <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2">
          <div className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t('form.skills.suggested', 'Compétences suggérées :')}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {aiSuggestions.map((name, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  handleAddSkill(name);
                  setAiSuggestions(aiSuggestions.filter((item) => item !== name));
                }}
                className="px-3 py-1 bg-white hover:bg-blue-600 hover:text-white text-slate-700 text-xs font-semibold rounded-lg border border-blue-200 shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                {name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Skills List */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
          {t('form.skills.selected', 'Vos compétences sélectionnées')} ({skills.length})
        </div>

        {skills.length === 0 ? (
          <div className="p-6 text-center bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500">
            {t('form.skills.empty', 'Aucune compétence ajoutée. Tapez une compétence ci-dessus ou utilisez les suggestions IA.')}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between shadow-2xs group"
              >
                <div className="font-semibold text-xs text-slate-800 flex-1 truncate pr-2">
                  {skill.name}
                </div>

                <div className="flex items-center gap-1 mr-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleLevelChange(skill.id, star)}
                      className={`text-xs ${
                        (skill.level || 4) >= star ? 'text-amber-400' : 'text-slate-200'
                      } hover:scale-110 transition-transform cursor-pointer`}
                      title={`${star}/5`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(skill.id)}
                  className="text-slate-400 hover:text-red-500 p-1 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
