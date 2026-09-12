import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, FolderGit2, Sparkles, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const BoldTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme, sectionTitles } = data;
  const primaryColor = theme?.primaryColor || '#4f46e5'; // Electric Indigo default

  return (
    <div className="w-full bg-white text-slate-900 min-h-[297mm] flex flex-col font-sans select-text">
      {/* 1. Impactful Bold Header Block */}
      <div 
        className="text-white p-8 sm:p-10 relative overflow-hidden shadow-sm"
        style={{ backgroundColor: primaryColor }}
      >
        {/* Subtle geometric pattern overlay */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 pointer-events-none blur-2xl"></div>
        <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-black/10 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{personalInfo.title || 'Profil Professionnel'}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight uppercase leading-none">
              {personalInfo.firstName} <span className="opacity-90">{personalInfo.lastName}</span>
            </h1>

            {summary && (
              <p className="text-xs sm:text-sm text-white/90 max-w-2xl leading-relaxed pt-1 font-medium">
                {summary}
              </p>
            )}
          </div>

          {/* Photo */}
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0">
              <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'circle' ? 'rounded-full' : 'rounded-3xl'} overflow-hidden border-4 border-white/40 shadow-xl bg-white/10`}>
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contact Pill Bar */}
        <div className="relative z-10 mt-6 pt-5 border-t border-white/20 flex flex-wrap items-center justify-center sm:justify-start gap-2.5 text-xs font-semibold">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs text-white">
              <Mail className="w-3.5 h-3.5 opacity-90 shrink-0" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs text-white">
              <Phone className="w-3.5 h-3.5 opacity-90 shrink-0" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs text-white">
              <MapPin className="w-3.5 h-3.5 opacity-90 shrink-0" />
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs text-white">
              <Linkedin className="w-3.5 h-3.5 opacity-90 shrink-0" />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs text-white">
              <Github className="w-3.5 h-3.5 opacity-90 shrink-0" />
              <span>{personalInfo.github}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-1.5 bg-white/15 px-3 py-1.5 rounded-xl backdrop-blur-xs text-white">
              <Globe className="w-3.5 h-3.5 opacity-90 shrink-0" />
              <span>{personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Main Content Grid */}
      <div className="p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
        {/* Left Main Column (8 cols): Experiences & Projects */}
        <div className="lg:col-span-8 space-y-8">
          {/* Work Experiences */}
          {experiences && experiences.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Briefcase className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  {sectionTitles?.experience || 'Expériences Professionnelles'}
                </h2>
              </div>

              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div 
                    key={exp.id}
                    className="p-5 rounded-2xl border-2 border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors relative"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-1.5">
                      <h3 className="font-extrabold text-base text-slate-900">{exp.position}</h3>
                      <span 
                        className="text-[11px] font-bold px-2.5 py-0.5 rounded-full self-start text-white shadow-2xs"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {exp.startDate} — {exp.current ? 'Actuel' : exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-600 mb-2">
                      {exp.company} {exp.city && `• ${exp.city}`}
                    </div>

                    {exp.description && (
                      <p className="text-xs text-slate-700 leading-relaxed mb-3">{exp.description}</p>
                    )}

                    {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                      <ul className="space-y-1.5 text-xs text-slate-600 pt-1">
                        {exp.tasks.filter(Boolean).map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                            <span className="leading-snug">{task}</span>
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
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div 
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs shrink-0"
                  style={{ backgroundColor: primaryColor }}
                >
                  <FolderGit2 className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-black tracking-tight text-slate-900 uppercase">
                  {sectionTitles?.projects || 'Projets Réalisés'}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((p) => (
                  <div key={p.id} className="p-4 rounded-2xl border border-slate-200 bg-white shadow-2xs space-y-1.5">
                    <div className="font-bold text-sm text-slate-900">{p.title}</div>
                    <p className="text-xs text-slate-600 leading-relaxed">{p.description}</p>
                    {p.link && (
                      <a href={p.link} className="text-[11px] font-semibold flex items-center gap-1 hover:underline" style={{ color: primaryColor }}>
                        <Globe className="w-3 h-3" />
                        <span>Voir le projet</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar Column (4 cols): Education, Skills, Languages, Certifications */}
        <div className="lg:col-span-4 space-y-8">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-4 pb-2 border-b border-slate-200">
                {sectionTitles?.skills || 'Compétences Clés'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill.id}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {educations && educations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {sectionTitles?.education || 'Formations'}
                </h2>
              </div>

              <div className="space-y-4">
                {educations.map((edu) => (
                  <div key={edu.id} className="p-3.5 rounded-xl border border-slate-200 bg-white">
                    <div className="font-bold text-xs text-slate-900">{edu.degree}</div>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5">{edu.institution}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-1">
                      {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3">
                {sectionTitles?.languages || 'Langues'}
              </h2>
              <div className="space-y-2">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="font-bold text-slate-800">{l.language}</span>
                    <span className="text-[11px] font-semibold text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Award className="w-4 h-4" style={{ color: primaryColor }} />
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {sectionTitles?.certifications || 'Certifications'}
                </h2>
              </div>
              <div className="space-y-2">
                {certifications.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="font-bold text-slate-800">{c.title}</div>
                    <div className="text-[11px] text-slate-500">{c.organization} {c.date && `• ${c.date}`}</div>
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
