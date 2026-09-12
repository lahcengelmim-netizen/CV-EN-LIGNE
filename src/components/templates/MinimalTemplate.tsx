import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#0f172a';

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-14 font-sans min-h-[297mm] flex flex-col justify-between leading-relaxed shadow-sm">
      <div className="space-y-8">
        {/* Header Minimalist */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-light tracking-tight text-slate-900">
              <span className="font-semibold">{personalInfo.firstName}</span> {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-sm font-medium tracking-wide text-slate-500 uppercase mt-1">
                {personalInfo.title}
              </p>
            )}

            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mt-4 text-xs text-slate-500 font-normal">
              {personalInfo.email && <span>{personalInfo.email}</span>}
              {personalInfo.phone && <span>• {personalInfo.phone}</span>}
              {(personalInfo.city || personalInfo.country) && (
                <span>• {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              )}
              {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
              {personalInfo.website && <span>• {personalInfo.website}</span>}
            </div>
          </div>

          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'circle' ? 'rounded-full' : 'rounded-2xl'} overflow-hidden grayscale contrast-125 border border-slate-200 shrink-0`}>
              <img src={personalInfo.photoUrl} alt="Photo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Summary */}
        {summary && (
          <div className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            {summary}
          </div>
        )}

        {/* Experience Section */}
        {experiences && experiences.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase mb-4">
              // {lang === 'ar' ? 'الخبرة العملية' : lang === 'en' ? 'EXPERIENCE' : 'EXPÉRIENCE PROFESSIONNELLE'}
            </h2>
            <div className="space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-xs font-mono text-slate-400">
                    {exp.startDate} — {exp.current ? (lang === 'ar' ? 'الآن' : lang === 'en' ? 'Present' : 'Présent') : exp.endDate}
                  </div>
                  <div className="sm:col-span-3 space-y-1">
                    <div className="text-sm font-semibold text-slate-900">
                      {exp.position} <span className="text-slate-400 font-normal">@ {exp.company}</span>
                    </div>
                    {exp.description && <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>}
                    {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-600 pt-1">
                        {exp.tasks.filter(Boolean).map((t, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-slate-300 font-mono">—</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {educations && educations.length > 0 && (
          <div>
            <h2 className="text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase mb-4">
              // {lang === 'ar' ? 'التعليم' : lang === 'en' ? 'EDUCATION' : 'FORMATION'}
            </h2>
            <div className="space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="grid grid-cols-1 sm:grid-cols-4 gap-2 sm:gap-4">
                  <div className="text-xs font-mono text-slate-400">
                    {edu.startDate} — {edu.endDate || 'En cours'}
                  </div>
                  <div className="sm:col-span-3">
                    <div className="text-sm font-medium text-slate-900">{edu.degree}</div>
                    <div className="text-xs text-slate-500">{edu.institution}{edu.city ? `, ${edu.city}` : ''}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Langs Minimal Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-2">
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase mb-3">
                // {lang === 'ar' ? 'المهارات' : lang === 'en' ? 'SKILLS' : 'COMPÉTENCES'}
              </h2>
              <div className="flex flex-wrap gap-2 text-xs text-slate-700 font-mono">
                {skills.map((s) => (
                  <span key={s.id} className="bg-slate-50 px-2 py-1 border border-slate-200 rounded text-slate-800">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-mono font-semibold tracking-widest text-slate-400 uppercase mb-3">
                // {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'LANGUAGES' : 'LANGUES'}
              </h2>
              <div className="space-y-1 text-xs text-slate-700">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between border-b border-slate-100 pb-0.5">
                    <span>{l.language}</span>
                    <span className="text-slate-400 font-mono">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
