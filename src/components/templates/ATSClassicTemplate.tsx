import React from 'react';
import { CVData, LanguageCode } from '../../types';

export interface ATSClassicTemplateProps {
  data: CVData;
  lang?: LanguageCode | string;
}

/**
 * ATS-Classic Template
 * Clean single-column design, black text, highly parsable, optimized layout for Applicant Tracking Systems.
 * Follows strict ATS best practices:
 * - Semantic linear structure (Header -> Main -> Sections)
 * - Pure high-contrast black typography on crisp white background
 * - No complex multi-column floating blocks or graphics that confuse OCR parsers
 * - Standard bullet points and explicit date ranges
 */
export const ATSClassicTemplate: React.FC<ATSClassicTemplateProps> = ({ data, lang = 'fr' }) => {
  const {
    personalInfo,
    summary,
    experiences = [],
    educations = [],
    skills = [],
    languages = [],
    certifications = [],
    projects = [],
    sectionTitles,
  } = data;

  // Language-aware default headers
  const isEn = lang === 'en';
  const isAr = lang === 'ar';

  const tSummary = sectionTitles?.profile || (isAr ? 'الملخص المهني' : isEn ? 'Professional Summary' : 'Profil Professionnel');
  const tSkills = sectionTitles?.skills || (isAr ? 'المهارات والكفاءات' : isEn ? 'Core Competencies & Skills' : 'Compétences Clés');
  const tExperience = sectionTitles?.experience || (isAr ? 'الخبرات المهنية' : isEn ? 'Professional Experience' : 'Expérience Professionnelle');
  const tEducation = sectionTitles?.education || (isAr ? 'التعليم والتكوين' : isEn ? 'Education & Qualifications' : 'Formation & Diplômes');
  const tProjects = sectionTitles?.projects || (isAr ? 'المشاريع الرئيسية' : isEn ? 'Key Projects' : 'Projets Significatifs');
  const tLanguages = sectionTitles?.languages || (isAr ? 'اللغات' : isEn ? 'Languages' : 'Langues');
  const tCertifications = sectionTitles?.certifications || (isAr ? 'الشهادات' : isEn ? 'Certifications' : 'Certifications');

  const contactItems = [
    personalInfo.email,
    personalInfo.phone,
    [personalInfo.city, personalInfo.country].filter(Boolean).join(', '),
    personalInfo.linkedin,
    personalInfo.website,
    personalInfo.github,
  ].filter(Boolean);

  return (
    <article
      className="w-full bg-white text-black min-h-[297mm] p-8 sm:p-12 font-sans select-text leading-relaxed box-border"
      aria-label="CV ATS-Classic"
    >
      {/* 1. Header: Candidate Identity & Linear Contact Bar */}
      <header className="border-b-2 border-black pb-4 text-center space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-black m-0">
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>

        {personalInfo.title && (
          <p className="text-sm font-semibold text-neutral-800 uppercase tracking-wider m-0">
            {personalInfo.title}
          </p>
        )}

        {contactItems.length > 0 && (
          <div className="pt-1 text-xs text-neutral-800 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
            {contactItems.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-neutral-500">•</span>}
                <span className="font-normal">{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
      </header>

      {/* 2. Main Content Body - Linear Single-Column */}
      <main className="space-y-5 pt-4 text-xs text-neutral-900">
        {/* Professional Summary */}
        {summary && summary.trim() && (
          <section className="space-y-1.5" aria-labelledby="section-ats-summary">
            <h2
              id="section-ats-summary"
              className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
            >
              {tSummary}
            </h2>
            <p className="text-xs text-neutral-800 leading-normal text-justify">
              {summary}
            </p>
          </section>
        )}

        {/* Core Competencies / Skills */}
        {skills && skills.length > 0 && (
          <section className="space-y-1.5" aria-labelledby="section-ats-skills">
            <h2
              id="section-ats-skills"
              className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
            >
              {tSkills}
            </h2>
            <div className="text-xs text-neutral-800 leading-normal">
              {skills.map((s, idx) => (
                <span key={s.id || idx}>
                  <strong className="font-semibold">{s.name}</strong>
                  {s.level ? ` (${typeof s.level === 'number' ? `${s.level}/5` : s.level})` : ''}
                  {idx < skills.length - 1 ? ' • ' : ''}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Professional Experience */}
        {experiences && experiences.length > 0 && (
          <section className="space-y-3" aria-labelledby="section-ats-experience">
            <h2
              id="section-ats-experience"
              className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
            >
              {tExperience}
            </h2>

            <div className="space-y-3.5">
              {experiences.map((exp, idx) => (
                <div key={exp.id || idx} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs text-black">
                    <div>
                      <strong className="font-bold">{exp.position}</strong>
                      <span className="text-neutral-700">
                        {' '}— {exp.company}
                        {exp.city ? `, ${exp.city}` : ''}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-700 shrink-0 ml-2">
                      {exp.startDate} – {exp.current ? (isEn ? 'Present' : 'Actuel') : exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-neutral-800 leading-normal m-0">
                      {exp.description}
                    </p>
                  )}

                  {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-0.5 text-neutral-800">
                      {exp.tasks.filter(Boolean).map((task, taskIdx) => (
                        <li key={taskIdx} className="text-xs leading-normal">
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

        {/* Education & Qualifications */}
        {educations && educations.length > 0 && (
          <section className="space-y-2.5" aria-labelledby="section-ats-education">
            <h2
              id="section-ats-education"
              className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
            >
              {tEducation}
            </h2>

            <div className="space-y-2">
              {educations.map((edu, idx) => (
                <div key={edu.id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <strong className="font-bold text-black">{edu.degree}</strong>
                      <span className="text-neutral-700">
                        {' '}| {edu.institution}
                        {edu.city ? `, ${edu.city}` : ''}
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-neutral-700 shrink-0 ml-2">
                      {edu.startDate} – {edu.current ? (isEn ? 'Present' : 'En cours') : edu.endDate}
                    </span>
                  </div>
                  {edu.description && (
                    <p className="text-[11px] text-neutral-700 m-0">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Key Projects */}
        {projects && projects.length > 0 && (
          <section className="space-y-2" aria-labelledby="section-ats-projects">
            <h2
              id="section-ats-projects"
              className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
            >
              {tProjects}
            </h2>

            <div className="space-y-2">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <div className="font-bold text-black">
                      {proj.title}
                      {proj.role ? <span className="font-normal text-neutral-700"> ({proj.role})</span> : ''}
                    </div>
                    {proj.date && <span className="text-[11px] text-neutral-600">{proj.date}</span>}
                  </div>
                  {proj.description && (
                    <p className="text-xs text-neutral-800 leading-normal m-0">{proj.description}</p>
                  )}
                  {proj.technologies && proj.technologies.length > 0 && (
                    <p className="text-[11px] text-neutral-600 m-0">
                      <em>Technologies:</em> {proj.technologies.join(', ')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages & Certifications (Linear ATS Row) */}
        {(languages?.length > 0 || certifications?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            {languages && languages.length > 0 && (
              <section className="space-y-1" aria-labelledby="section-ats-languages">
                <h2
                  id="section-ats-languages"
                  className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
                >
                  {tLanguages}
                </h2>
                <p className="text-xs text-neutral-800 leading-relaxed m-0">
                  {languages.map((l, i) => (
                    <span key={l.id || i}>
                      <strong>{l.language || l.name}</strong> ({l.level})
                      {i < languages.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
              </section>
            )}

            {certifications && certifications.length > 0 && (
              <section className="space-y-1" aria-labelledby="section-ats-certifications">
                <h2
                  id="section-ats-certifications"
                  className="text-xs font-bold uppercase tracking-wider text-black border-b border-black pb-0.5"
                >
                  {tCertifications}
                </h2>
                <div className="space-y-1">
                  {certifications.map((c, i) => (
                    <p key={c.id || i} className="text-xs text-neutral-800 m-0">
                      <strong>{c.title}</strong> — {c.organization} {c.date ? `(${c.date})` : ''}
                    </p>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </article>
  );
};

export default ATSClassicTemplate;
