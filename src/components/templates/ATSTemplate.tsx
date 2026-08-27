import React from 'react';
import { CVData, LanguageCode } from '../../types';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const ATSTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;

  return (
    <div className="w-full bg-white text-black min-h-[297mm] p-8 sm:p-12 font-sans select-text leading-relaxed">
      {/* 1. Standard Linear ATS Header */}
      <header className="border-b-2 border-black pb-4 text-center space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        
        {personalInfo.title && (
          <p className="text-sm font-semibold text-neutral-800 uppercase tracking-wide">
            {personalInfo.title}
          </p>
        )}

        <div className="pt-1 text-xs text-neutral-700 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>• {personalInfo.phone}</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>• {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
          )}
          {personalInfo.linkedin && <span>• {personalInfo.linkedin}</span>}
          {personalInfo.website && <span>• {personalInfo.website}</span>}
        </div>
      </header>

      <main className="space-y-6 pt-5 text-xs text-neutral-900">
        {/* 2. Professional Summary */}
        {summary && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
              {lang === 'ar' ? 'الملخص المهني' : lang === 'en' ? 'Professional Summary' : 'Profil Professionnel'}
            </h2>
            <p className="text-xs text-neutral-800 leading-normal">
              {summary}
            </p>
          </section>
        )}

        {/* 3. Core Competencies / Skills */}
        {skills && skills.length > 0 && (
          <section className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
              {lang === 'ar' ? 'المهارات والخبرات' : lang === 'en' ? 'Core Competencies & Skills' : 'Compétences Clés'}
            </h2>
            <p className="text-xs text-neutral-800">
              {skills.map((s) => s.name).join(' • ')}
            </p>
          </section>
        )}

        {/* 4. Professional Experience */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
              {lang === 'ar' ? 'الخبرات المهنية' : lang === 'en' ? 'Professional Experience' : 'Expérience Professionnelle'}
            </h2>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline font-bold text-xs text-black">
                    <span>{exp.position} — {exp.company}{exp.city ? `, ${exp.city}` : ''}</span>
                    <span className="text-[11px] font-normal">
                      {exp.startDate} – {exp.current ? (lang === 'en' ? 'Present' : 'Actuel') : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-neutral-800">
                      {exp.description}
                    </p>
                  )}

                  {exp.tasks && exp.tasks.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 pl-1">
                      {exp.tasks.map((task, i) => (
                        <li key={i} className="text-xs text-neutral-800">
                          {task}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Education */}
        {educations && educations.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
              {lang === 'ar' ? 'التعليم والتكوين' : lang === 'en' ? 'Education' : 'Formation & Diplômes'}
            </h2>

            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold">{edu.degree}</span> | {edu.institution}{edu.city ? `, ${edu.city}` : ''}
                  </div>
                  <div className="text-[11px] text-neutral-600">
                    {edu.startDate} – {edu.current ? 'En cours' : edu.endDate}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 6. Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
              {lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Key Projects' : 'Projets Significatifs'}
            </h2>

            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <div className="font-bold text-xs">{proj.title} {proj.role ? `(${proj.role})` : ''}</div>
                  <p className="text-xs text-neutral-800">{proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Languages & Certifications */}
        {(languages?.length || certifications?.length) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {languages && languages.length > 0 && (
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                  {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
                </h2>
                <p className="text-xs text-neutral-800">
                  {languages.map((l) => `${l.language} (${l.level})`).join(', ')}
                </p>
              </section>
            )}

            {certifications && certifications.length > 0 && (
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5">
                  {lang === 'ar' ? 'الشهادات' : lang === 'en' ? 'Certifications' : 'Certifications'}
                </h2>
                <p className="text-xs text-neutral-800">
                  {certifications.map((c) => `${c.title} - ${c.organization} (${c.date})`).join(', ')}
                </p>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
