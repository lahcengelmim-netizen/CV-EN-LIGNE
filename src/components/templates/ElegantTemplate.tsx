import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Award, GraduationCap, Briefcase, Sparkles } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const ElegantTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#1e293b'; // Elegant Charcoal/Bronze

  return (
    <div className="w-full bg-[#fdfcfb] text-slate-800 min-h-[297mm] p-8 sm:p-12 font-serif select-text flex flex-col justify-between">
      <div>
        {/* 1. Haute Couture Centered Header */}
        <div className="text-center space-y-3 pb-6 border-b border-amber-800/20">
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="flex justify-center mb-3">
              <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'rounded' ? 'rounded-2xl' : 'rounded-full'} overflow-hidden border-2 border-amber-700/40 p-1 shadow-md shrink-0`}>
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className={`w-full h-full object-cover ${(personalInfo.photoShape || theme?.photoShape) === 'rounded' ? 'rounded-xl' : 'rounded-full'}`}
                />
              </div>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-normal tracking-wide text-slate-900 font-serif uppercase">
            {personalInfo.firstName} <span className="font-bold">{personalInfo.lastName}</span>
          </h1>

          {personalInfo.title && (
            <p className="text-xs sm:text-sm font-sans tracking-[0.2em] text-amber-800 uppercase font-semibold">
              {personalInfo.title}
            </p>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-sans text-slate-600 pt-1">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>✦ {personalInfo.phone}</span>}
            {(personalInfo.city || personalInfo.country) && (
              <span>✦ {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
            )}
            {personalInfo.linkedin && <span>✦ {personalInfo.linkedin}</span>}
          </div>
        </div>

        {/* 2. Body Grid */}
        <div className="pt-6 space-y-7">
          {/* Summary */}
          {summary && (
            <div className="text-center max-w-2xl mx-auto space-y-1">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-serif">
                « {summary} »
              </p>
            </div>
          )}

          <div className="grid grid-cols-12 gap-8 pt-2">
            {/* Left Main (8 cols) */}
            <div className="col-span-8 space-y-6">
              {/* Experience */}
              {experiences && experiences.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-amber-800/30 pb-1">
                    <h2 className="text-xs font-sans uppercase tracking-[0.15em] font-bold text-slate-900">
                      {lang === 'ar' ? 'الخبرات المهنية' : lang === 'en' ? 'Professional Experience' : 'Expérience Professionnelle'}
                    </h2>
                  </div>

                  <div className="space-y-5">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="space-y-1.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                          <h3 className="text-xs font-bold text-slate-900 font-serif text-[13px]">{exp.position}</h3>
                          <span className="text-[10px] font-sans font-medium text-amber-800 tracking-wider">
                            {exp.startDate} — {exp.current ? 'Présent' : exp.endDate}
                          </span>
                        </div>

                        <div className="text-xs font-sans text-slate-600 font-semibold">
                          {exp.company}{exp.city ? ` — ${exp.city}` : ''}
                        </div>

                        {exp.description && (
                          <p className="text-xs font-sans text-slate-600 leading-relaxed">
                            {exp.description}
                          </p>
                        )}

                        {exp.tasks && exp.tasks.length > 0 && (
                          <ul className="space-y-1 pt-0.5">
                            {exp.tasks.map((t, idx) => (
                              <li key={idx} className="text-xs font-sans text-slate-700 flex items-start gap-2">
                                <span className="text-amber-800 font-serif text-xs">❖</span>
                                <span>{t}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Key Projects */}
              {projects && projects.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-800/30 pb-1">
                    <h2 className="text-xs font-sans uppercase tracking-[0.15em] font-bold text-slate-900">
                      {lang === 'ar' ? 'المشاريع البارزة' : lang === 'en' ? 'Distinguished Projects' : 'Projets & Mandats Notables'}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="text-xs font-bold font-serif text-slate-900">{proj.title} {proj.role ? `— ${proj.role}` : ''}</div>
                        <p className="text-[11px] font-sans text-slate-600 leading-relaxed">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Aside (4 cols) */}
            <div className="col-span-4 space-y-6">
              {/* Education */}
              {educations && educations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-800/30 pb-1">
                    <h2 className="text-xs font-sans uppercase tracking-[0.15em] font-bold text-slate-900">
                      {lang === 'ar' ? 'التكوين' : lang === 'en' ? 'Education' : 'Formation'}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {educations.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <h4 className="text-xs font-bold font-serif text-slate-900">{edu.degree}</h4>
                        <div className="text-[11px] font-sans text-slate-600">{edu.institution}</div>
                        <div className="text-[10px] font-sans text-amber-800">{edu.startDate} — {edu.current ? 'En cours' : edu.endDate}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && skills.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 border-b border-amber-800/30 pb-1">
                    <h2 className="text-xs font-sans uppercase tracking-[0.15em] font-bold text-slate-900">
                      {lang === 'ar' ? 'الخبرات' : lang === 'en' ? 'Expertise' : 'Compétences'}
                    </h2>
                  </div>

                  <div className="space-y-1.5 font-sans text-xs text-slate-700">
                    {skills.map((s) => (
                      <div key={s.id} className="flex justify-between items-center py-0.5 border-b border-slate-100">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-amber-800">★ ★ ★</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {languages && languages.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 border-b border-amber-800/30 pb-1">
                    <h2 className="text-xs font-sans uppercase tracking-[0.15em] font-bold text-slate-900">
                      {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
                    </h2>
                  </div>

                  <div className="space-y-1 font-sans text-xs text-slate-700">
                    {languages.map((l) => (
                      <div key={l.id} className="flex justify-between items-center py-0.5">
                        <span className="font-medium">{l.language}</span>
                        <span className="text-[10px] text-slate-500 italic">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 border-b border-amber-800/30 pb-1">
                    <h2 className="text-xs font-sans uppercase tracking-[0.15em] font-bold text-slate-900">
                      {lang === 'ar' ? 'الشهادات' : lang === 'en' ? 'Certifications' : 'Distinctions'}
                    </h2>
                  </div>

                  <div className="space-y-1.5 font-sans text-xs text-slate-700">
                    {certifications.map((c) => (
                      <div key={c.id} className="space-y-0.5">
                        <div className="font-semibold text-slate-900">{c.title}</div>
                        <div className="text-[10px] text-slate-500">{c.organization} ({c.date})</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
