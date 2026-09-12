import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, GraduationCap, Briefcase, Award, FolderGit2, Star, Sparkles, HeartHandshake } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const StudentTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#4f46e5'; // Indigo / Energetic Youth / Modern

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] flex flex-col font-sans select-text">
      {/* 1. Engaging Student Header */}
      <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 border-b border-indigo-100">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>{lang === 'ar' ? 'طالب / خريج جديد' : lang === 'en' ? 'Student / Graduate Profile' : 'Profil Étudiant / Premier Emploi / Stage'}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
              {personalInfo.firstName} <span className="text-indigo-600">{personalInfo.lastName}</span>
            </h1>

            {personalInfo.title && (
              <p className="text-sm font-bold text-slate-700">
                {personalInfo.title}
              </p>
            )}

            {/* Quick Contact Line */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-y-1.5 gap-x-4 text-xs text-slate-600">
              {personalInfo.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-center gap-1.5">
                  <Linkedin className="w-3.5 h-3.5 text-indigo-600" />
                  <span>{personalInfo.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {/* Photo */}
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0">
              <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'circle' ? 'rounded-full' : 'rounded-2xl'} overflow-hidden border-3 border-white shadow-lg ring-2 ring-indigo-200`}>
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Body: Education & Key Potential First */}
      <div className="p-6 sm:p-8 space-y-6 flex-1">
        {/* Objective / Bio */}
        {summary && (
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-1">
            <h2 className="text-xs font-black uppercase text-indigo-700 tracking-wider">
              {lang === 'ar' ? 'الهدف المهني' : lang === 'en' ? 'Career Objective & Motivation' : 'Objectif Professionnel & Motivation'}
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Main Left Column (7 cols) */}
          <div className="col-span-7 space-y-6">
            {/* Education First (Highlighted for students) */}
            {educations && educations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'التكوين والدراسة' : lang === 'en' ? 'Education & Academic Pathway' : 'Formation & Diplômes Universitaires'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100/80 space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900">{edu.degree}</h3>
                        <span className="text-[10px] font-bold text-indigo-700 bg-white px-2 py-0.5 rounded shadow-2xs">
                          {edu.startDate} — {edu.current ? 'En cours' : edu.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600">{edu.institution}{edu.city ? ` • ${edu.city}` : ''}</div>
                      {edu.description && <p className="text-[11px] text-slate-600">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stages, Alternance & Expériences */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-1.5">
                  <Briefcase className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'التدريب والخبرات المهنية' : lang === 'en' ? 'Internships & Work Experience' : 'Stages, Alternances & Expériences'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1.5 pl-3 border-l-2 border-slate-200">
                      <div className="flex justify-between items-baseline">
                        <h4 className="text-xs font-bold text-slate-900">{exp.position}</h4>
                        <span className="text-[10px] text-slate-500">{exp.startDate} — {exp.endDate || 'Actuel'}</span>
                      </div>
                      <div className="text-xs font-medium text-indigo-600">{exp.company}</div>
                      {exp.description && <p className="text-xs text-slate-600">{exp.description}</p>}
                      {exp.tasks && exp.tasks.length > 0 && (
                        <ul className="space-y-1 pt-1">
                          {exp.tasks.map((t, i) => (
                            <li key={i} className="text-xs text-slate-700 flex items-start gap-1.5">
                              <span className="text-indigo-500 font-bold">•</span>
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

            {/* Projects & University Work */}
            {projects && projects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-1.5">
                  <FolderGit2 className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'المشاريع الدراسية والشخصية' : lang === 'en' ? 'Academic & Personal Projects' : 'Projets d\'Études & Réalisations'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-900">{proj.title}</span>
                        {proj.role && <span className="text-[10px] text-indigo-600 font-semibold">{proj.role}</span>}
                      </div>
                      <p className="text-[11px] text-slate-600">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (5 cols) */}
          <div className="col-span-5 space-y-6">
            {/* Skills */}
            {skills && skills.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-1.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'المهارات والكفاءات' : lang === 'en' ? 'Skills' : 'Compétences & Savoir-Être'}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-900 font-semibold rounded-lg text-xs border border-indigo-200/70"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-1.5">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {languages.map((l) => (
                    <div key={l.id} className="p-2 bg-slate-50 rounded-lg flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">{l.language}</span>
                      <span className="text-[10px] text-slate-600 font-semibold bg-white px-2 py-0.5 rounded shadow-2xs border border-slate-200">
                        {l.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-indigo-500 pb-1.5">
                  <Star className="w-4 h-4 text-indigo-600" />
                  <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                    {lang === 'ar' ? 'الشهادات والأنشطة' : lang === 'en' ? 'Certifications' : 'Certifications & Bénévolat'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {certifications.map((c) => (
                    <div key={c.id} className="p-2 bg-slate-50 rounded-lg text-xs space-y-0.5">
                      <div className="font-bold text-slate-900">{c.title}</div>
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
  );
};
