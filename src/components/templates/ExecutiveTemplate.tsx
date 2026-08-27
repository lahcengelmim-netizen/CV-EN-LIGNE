import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, FolderGit2, CheckCircle2, ChevronRight } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#0f172a'; // Deep Executive Slate/Navy

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] flex flex-col font-sans select-text">
      {/* 1. Executive Top Status Header */}
      <div
        className="p-8 sm:p-10 text-white relative overflow-hidden"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 relative z-10">
          {/* Candidate Info */}
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] uppercase font-bold tracking-widest border border-white/15">
              <span>Profil Dirigeant & Cadre Supérieur</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-none text-white">
              {personalInfo.firstName} <span className="font-light text-slate-200">{personalInfo.lastName}</span>
            </h1>
            {personalInfo.title && (
              <p className="text-sm sm:text-base font-semibold text-amber-300 tracking-wide uppercase">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Optional Photo */}
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border-2 border-amber-400/60 shadow-xl">
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Executive Sub-bar Contact Strip */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-wrap items-center justify-center sm:justify-start gap-y-2 gap-x-5 text-xs text-slate-200">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-amber-300 opacity-90" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-amber-300 opacity-90" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 opacity-90" />
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5">
              <Linkedin className="w-3.5 h-3.5 text-amber-300 opacity-90" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-300 opacity-90" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Executive Body Grid */}
      <div className="p-8 sm:p-10 space-y-7 flex-1">
        {/* Executive Summary Callout */}
        {summary && (
          <div className="bg-slate-50 border-l-4 border-slate-900 p-4 rounded-r-xl space-y-1">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-slate-900 flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-amber-600" />
              {lang === 'ar' ? 'الملخص التنفيذي' : lang === 'en' ? 'Executive Profile & Vision' : 'Vision Stratégique & Synthèse Dirigeant'}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed font-normal">
              {summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Experience Column (7 cols) */}
          <div className="md:col-span-7 space-y-6">
            {/* Experience Section */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
                  <Briefcase className="w-4 h-4 text-slate-900" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'المسار المهني والقيادي' : lang === 'en' ? 'Executive Experience & Leadership' : 'Parcours Professionnel & Leadership'}
                  </h2>
                </div>

                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="relative pl-4 border-l-2 border-slate-200 space-y-1.5">
                      <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-900" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900">{exp.position}</h3>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded">
                          {exp.startDate} — {exp.current ? (lang === 'ar' ? 'حالي' : lang === 'en' ? 'Present' : 'Actuel') : exp.endDate}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-600">
                        {exp.company}{exp.city ? ` • ${exp.city}` : ''}
                      </div>

                      {exp.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.tasks && exp.tasks.length > 0 && (
                        <ul className="space-y-1 pt-1">
                          {exp.tasks.map((task, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5 leading-normal">
                              <span className="text-amber-600 font-bold text-xs mt-0.5">•</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Strategic Projects */}
            {projects && projects.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
                  <FolderGit2 className="w-4 h-4 text-slate-900" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'المشاريع الاستراتيجية' : lang === 'en' ? 'Key Strategic Initiatives' : 'Réalisations & Initiatives Clés'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-3 rounded-lg bg-slate-50 border border-slate-200/80 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">{proj.title}</h4>
                        {proj.role && <span className="text-[10px] font-semibold text-slate-500">{proj.role}</span>}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column (5 cols) */}
          <div className="md:col-span-5 space-y-6">
            {/* Core Competencies Matrix */}
            {skills && skills.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
                  <Award className="w-4 h-4 text-slate-900" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'مجالات الخبرة القيادية' : lang === 'en' ? 'Executive Competencies' : 'Domaines d\'Expertise & Direction'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold text-slate-800">
                        <span>{skill.name}</span>
                        {skill.level && <span className="text-[10px] text-slate-500">{skill.level * 20}%</span>}
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-slate-900 transition-all"
                          style={{ width: `${(skill.level || 4) * 20}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education & Diplomas */}
            {educations && educations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-900" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'التعليم والتكوين العالي' : lang === 'en' ? 'Education & Executive Training' : 'Formation Supérieure & Diplômes'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="space-y-0.5 border-l-2 border-amber-500 pl-3">
                      <h4 className="text-xs font-bold text-slate-900">{edu.degree}</h4>
                      <div className="text-[11px] font-semibold text-slate-600">{edu.institution}{edu.city ? ` • ${edu.city}` : ''}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {edu.startDate} — {edu.current ? 'En cours' : edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
                  <Globe className="w-4 h-4 text-slate-900" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues & Négociation'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {languages.map((langItem) => (
                    <div key={langItem.id} className="p-2 rounded bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-800">{langItem.language}</span>
                      <span className="text-[10px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                        {langItem.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications & Governance */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1.5">
                  <CheckCircle2 className="w-4 h-4 text-slate-900" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'الشهادات والاعتمادات' : lang === 'en' ? 'Certifications' : 'Certifications & Mandats'}
                  </h2>
                </div>

                <div className="space-y-1.5 text-xs text-slate-700">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="flex items-start gap-1.5">
                      <span className="text-slate-900 font-bold">•</span>
                      <div>
                        <div className="font-semibold text-slate-900">{cert.title}</div>
                        <div className="text-[10px] text-slate-500">{cert.organization} ({cert.date})</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
