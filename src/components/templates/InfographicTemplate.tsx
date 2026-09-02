import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, FolderGit2, Sparkles, Star, Palette } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const InfographicTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme, sectionTitles } = data;
  const primaryColor = theme?.primaryColor || '#8b5cf6'; // Creative Violet

  return (
    <div className="w-full bg-slate-50 text-slate-800 min-h-[297mm] flex flex-col md:flex-row font-sans select-text">
      {/* 1. Creative Vibrant Sidebar */}
      <div 
        className="w-full md:w-[36%] p-7 text-white flex flex-col justify-between shrink-0 space-y-6 shadow-md"
        style={{ 
          background: `linear-gradient(175deg, ${primaryColor} 0%, #3b0764 100%)` 
        }}
      >
        <div className="space-y-6">
          {/* Photo with double border & glow */}
          {theme?.showPhoto && personalInfo.photoUrl ? (
            <div className="flex justify-center pt-2">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white/40 shadow-2xl bg-white/10">
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto rounded-3xl bg-white/20 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              <Palette className="w-8 h-8" />
            </div>
          )}

          {/* Name in Sidebar */}
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {personalInfo.firstName} <br />
              <span className="text-white/90">{personalInfo.lastName}</span>
            </h1>
            {personalInfo.title && (
              <p className="text-xs font-bold text-white/80 mt-1 uppercase tracking-wider">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact Cards in Sidebar */}
          <div className="space-y-2 text-xs">
            <div className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-1">
              {sectionTitles?.contact || 'Coordonnées'}
            </div>

            {personalInfo.email && (
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <Phone className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10">
                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10 break-all">
                <Linkedin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/10 break-all">
                <Github className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.github}</span>
              </div>
            )}
          </div>

          {/* Graphical Skill Meters */}
          {skills && skills.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
                {sectionTitles?.skills || 'Compétences & Niveaux'}
              </div>

              <div className="space-y-2 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill.name}</span>
                      <span className="text-[10px] opacity-80">{(skill.level || 4) * 20}%</span>
                    </div>
                    <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-white h-1.5 rounded-full"
                        style={{ width: `${(skill.level || 4) * 20}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages with stars/dots */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] font-black uppercase tracking-widest text-white/60">
                {sectionTitles?.languages || 'Langues'}
              </div>
              <div className="space-y-1.5 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/10">
                    <span className="font-semibold">{l.language}</span>
                    <span className="text-[11px] opacity-80">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-white/50 text-center font-medium pt-2">
          Design Graphique & Créatif
        </div>
      </div>

      {/* 2. Main Content Right Panel */}
      <div className="flex-1 p-7 sm:p-9 space-y-6 flex flex-col justify-between bg-white">
        <div className="space-y-6">
          {/* Summary / Mission */}
          {summary && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                <span>{sectionTitles?.profile || 'Profil & Vision'}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experiences */}
          {experiences && experiences.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {sectionTitles?.experience || 'Parcours Professionnel'}
                </h2>
              </div>

              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/70 space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900">{exp.position}</h3>
                      <span 
                        className="text-[11px] font-bold px-2 py-0.5 rounded-md text-white self-start"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {exp.startDate} — {exp.current ? 'Présent' : exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-slate-600">
                      {exp.company} {exp.city && `• ${exp.city}`}
                    </div>

                    {exp.description && (
                      <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
                    )}

                    {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-600 pt-1">
                        {exp.tasks.filter(Boolean).map((task, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ backgroundColor: primaryColor }} />
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

          {/* Education & Projects in Two Columns */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
            {/* Education */}
            {educations && educations.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    {sectionTitles?.education || 'Formations'}
                  </h2>
                </div>

                <div className="space-y-2.5">
                  {educations.map((edu) => (
                    <div key={edu.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-[11px] text-slate-600 mt-0.5">{edu.institution}</div>
                      <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                        {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects & Certifications */}
            <div className="space-y-3">
              {projects && projects.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <FolderGit2 className="w-4 h-4" style={{ color: primaryColor }} />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      {sectionTitles?.projects || 'Projets'}
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {projects.map((p) => (
                      <div key={p.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Award className="w-4 h-4" style={{ color: primaryColor }} />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      {sectionTitles?.certifications || 'Certifications'}
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {certifications.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-[10px] text-slate-500">{c.organization} {c.date && `• ${c.date}`}</div>
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
