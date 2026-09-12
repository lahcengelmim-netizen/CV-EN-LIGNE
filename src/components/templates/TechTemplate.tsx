import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Terminal, Code2, Cpu, Database, Award, GraduationCap, FolderGit2 } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const TechTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#0284c7'; // Tech Sky/Cyan/Indigo

  return (
    <div className="w-full bg-slate-50/60 text-slate-800 min-h-[297mm] flex flex-col font-sans select-text">
      {/* 1. Tech Terminal Style Header */}
      <div className="bg-slate-900 text-slate-100 p-7 sm:p-8 border-b-2 border-sky-500 shadow-md">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-800 text-sky-400 font-mono text-[11px] border border-slate-700">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>~/developer/portfolio.sh</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white">
              {personalInfo.firstName} <span className="text-sky-400">{personalInfo.lastName}</span>
            </h1>

            {personalInfo.title && (
              <p className="text-xs sm:text-sm font-mono text-slate-300 flex items-center gap-2 justify-center sm:justify-start">
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>{personalInfo.title}</span>
              </p>
            )}
          </div>

          {/* Optional Photo */}
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0">
              <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'circle' ? 'rounded-full' : 'rounded-2xl'} overflow-hidden border-2 border-sky-500 shadow-lg bg-slate-800`}>
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tech Contact & Social Pill Row */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs font-mono">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              <Mail className="w-3 h-3 text-sky-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              <Phone className="w-3 h-3 text-emerald-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              <MapPin className="w-3 h-3 text-rose-400" />
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              <Github className="w-3 h-3 text-purple-400" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded text-slate-300 border border-slate-700">
              <Linkedin className="w-3 h-3 text-sky-400" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Tech Grid */}
      <div className="p-6 sm:p-8 space-y-6 flex-1">
        {/* Tech Bio / Stack Overview */}
        {summary && (
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-sky-700 uppercase">
              <Cpu className="w-3.5 h-3.5" />
              <span>// {lang === 'ar' ? 'نظرة عامة تقنية' : lang === 'en' ? 'Core Architecture & Summary' : 'Profil Technique & Spécialisation'}</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Experience Column (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Experience Section */}
            {experiences && experiences.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b-2 border-sky-600 pb-1.5">
                  <div className="flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-sky-600" />
                    <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900">
                      {lang === 'ar' ? 'الخبرات الهندسية' : lang === 'en' ? 'Work Experience & Deliverables' : 'Expériences & Réalisations'}
                    </h2>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">git log --stat</span>
                </div>

                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h3 className="text-xs font-bold text-slate-900 font-mono">{exp.position}</h3>
                        <span className="text-[10px] font-mono font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200/60">
                          {exp.startDate} → {exp.current ? 'NOW' : exp.endDate}
                        </span>
                      </div>

                      <div className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
                        <span className="text-slate-900 font-bold">{exp.company}</span>
                        {exp.city && <span className="text-slate-400">({exp.city})</span>}
                      </div>

                      {exp.description && (
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.tasks && exp.tasks.length > 0 && (
                        <ul className="space-y-1.5 pt-1">
                          {exp.tasks.map((task, idx) => (
                            <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                              <span className="text-sky-600 font-mono font-bold text-xs mt-0.5">&gt;</span>
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

            {/* Tech Projects Showcase */}
            {projects && projects.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-sky-600 pb-1.5">
                  <FolderGit2 className="w-4 h-4 text-sky-600" />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900">
                    {lang === 'ar' ? 'المشاريع التقنية' : lang === 'en' ? 'Featured Technical Projects' : 'Projets Techniques & Open Source'}
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((proj) => (
                    <div key={proj.id} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900 font-mono">{proj.title}</h4>
                        {proj.role && <span className="text-[10px] bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded font-mono">{proj.role}</span>}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar Column (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Tech Stack Chips */}
            {skills && skills.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-sky-600 pb-1.5">
                  <Database className="w-4 h-4 text-sky-600" />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900">
                    {lang === 'ar' ? 'المهارات والتقنيات' : lang === 'en' ? 'Tech Stack & Skills' : 'Stack Technique & Outils'}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill.id}
                      className="px-2.5 py-1 bg-white text-slate-800 rounded-md font-mono text-xs font-semibold border border-slate-200 shadow-2xs flex items-center gap-1.5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Degrees / Education */}
            {educations && educations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-sky-600 pb-1.5">
                  <GraduationCap className="w-4 h-4 text-sky-600" />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900">
                    {lang === 'ar' ? 'الشهادات الأكاديمية' : lang === 'en' ? 'Education' : 'Diplômes & Formations'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                      <h4 className="text-xs font-bold text-slate-900 font-mono">{edu.degree}</h4>
                      <div className="text-[11px] text-slate-600">{edu.institution}{edu.city ? ` • ${edu.city}` : ''}</div>
                      <div className="text-[10px] text-sky-700 font-mono font-semibold">
                        {edu.startDate} — {edu.current ? 'En cours' : edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {certifications && certifications.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-sky-600 pb-1.5">
                  <Award className="w-4 h-4 text-sky-600" />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900">
                    {lang === 'ar' ? 'الشهادات الاحترافية' : lang === 'en' ? 'Certifications' : 'Certifications & Badges'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="bg-white p-2.5 rounded border border-slate-200 text-xs">
                      <div className="font-bold text-slate-900 font-mono">{cert.title}</div>
                      <div className="text-[10px] text-slate-500">{cert.organization} • {cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b-2 border-sky-600 pb-1.5">
                  <Globe className="w-4 h-4 text-sky-600" />
                  <h2 className="text-xs uppercase font-mono font-bold tracking-wider text-slate-900">
                    {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
                  </h2>
                </div>

                <div className="space-y-2">
                  {languages.map((langItem) => (
                    <div key={langItem.id} className="bg-white p-2 rounded border border-slate-200 flex justify-between items-center text-xs">
                      <span className="font-bold font-mono text-slate-800">{langItem.language}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono">{langItem.level}</span>
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
