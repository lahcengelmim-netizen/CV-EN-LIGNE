import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, FolderGit2, Star, Check } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const CompactTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme, sectionTitles } = data;
  const primaryColor = theme?.primaryColor || '#0d9488'; // Modern Teal

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] flex flex-row font-sans select-text">
      {/* Left Column (Photo, Contact, Skills, Languages, Education) */}
      <div className="w-[35%] bg-slate-50 border-r border-slate-200/80 p-6 sm:p-7 flex flex-col justify-between shrink-0 space-y-6">
        <div className="space-y-6">
          {/* Photo Frame */}
          {theme?.showPhoto && personalInfo.photoUrl ? (
            <div className="flex justify-center">
              <div 
                className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'circle' ? 'rounded-full' : 'rounded-2xl'} overflow-hidden border-3 shadow-md relative group shrink-0`} 
                style={{ borderColor: primaryColor }}
              >
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="w-20 h-20 mx-auto rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-sm" style={{ backgroundColor: primaryColor }}>
              {personalInfo.firstName?.[0]}{personalInfo.lastName?.[0]}
            </div>
          )}

          {/* Left Column Contact Box */}
          <div className="space-y-2.5">
            <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
              {sectionTitles?.contact || 'Coordonnées'}
            </h2>

            <div className="space-y-2 text-xs text-slate-700">
              {personalInfo.email && (
                <div className="flex items-start gap-2.5 break-all">
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                    <Mail className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span className="pt-0.5">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                    <Phone className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-2.5">
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                    <MapPin className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
                </div>
              )}
              {personalInfo.linkedin && (
                <div className="flex items-start gap-2.5 break-all">
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                    <Linkedin className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span className="pt-0.5">{personalInfo.linkedin}</span>
                </div>
              )}
              {personalInfo.github && (
                <div className="flex items-start gap-2.5 break-all">
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                    <Github className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span className="pt-0.5">{personalInfo.github}</span>
                </div>
              )}
              {personalInfo.website && (
                <div className="flex items-start gap-2.5 break-all">
                  <div className="p-1 rounded-md bg-white border border-slate-200 text-slate-600 shrink-0">
                    <Globe className="w-3 h-3" style={{ color: primaryColor }} />
                  </div>
                  <span className="pt-0.5">{personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>

          {/* Left Column Skills */}
          {skills && skills.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                {sectionTitles?.skills || 'Compétences'}
              </h2>

              <div className="space-y-2.5 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
                      <span>{skill.name}</span>
                      {skill.level && (
                        <span className="text-[10px] text-slate-500 font-bold">
                          {skill.level}/5
                        </span>
                      )}
                    </div>
                    {/* Modern Dot or Bar Level */}
                    <div className="w-full bg-slate-200/80 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(skill.level || 4) * 20}%`,
                          backgroundColor: primaryColor
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Left Column Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                {sectionTitles?.languages || 'Langues'}
              </h2>

              <div className="space-y-1.5 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-200/70 shadow-2xs">
                    <span className="font-bold text-slate-800">{l.language}</span>
                    <span className="text-[10px] font-bold text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Left Column Education */}
          {educations && educations.length > 0 && (
            <div className="space-y-2.5">
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-500 pb-1.5 border-b border-slate-200 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {sectionTitles?.education || 'Formations'}
              </h2>

              <div className="space-y-3 text-xs">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative pl-3 border-l-2 border-slate-200">
                    <div className="font-bold text-slate-900 leading-snug">{edu.degree}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{edu.institution} {edu.city && `• ${edu.city}`}</div>
                    <div className="text-[10px] font-bold text-slate-400 mt-0.5">
                      {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Minimal Footer Stamp */}
        <div className="text-[10px] text-slate-400 text-center font-medium pt-2">
          Curriculum Vitae Certifié
        </div>
      </div>

      {/* Right Column (Header, Summary, Experience, Projects, Certifications) */}
      <div className="flex-1 p-7 sm:p-9 space-y-6 flex flex-col justify-between bg-white">
        <div className="space-y-6">
          {/* Header Title Block */}
          <div className="border-b pb-5 border-slate-200 space-y-1">
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {personalInfo.firstName} <span style={{ color: primaryColor }}>{personalInfo.lastName}</span>
            </h1>
            {personalInfo.title && (
              <p className="text-sm font-bold text-slate-600 tracking-wide uppercase">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Profile Summary */}
          {summary && (
            <div className="p-4 rounded-xl bg-slate-50/80 border-l-4 border border-slate-200" style={{ borderLeftColor: primaryColor }}>
              <h2 className="text-[11px] font-black uppercase tracking-wider text-slate-500 mb-1.5">
                {sectionTitles?.profile || 'Profil & Objectifs'}
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Experiences */}
          {experiences && experiences.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {sectionTitles?.experience || 'Expériences Professionnelles'}
                </h2>
              </div>

              <div className="space-y-5">
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                      <h3 className="font-bold text-sm text-slate-900">{exp.position}</h3>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md self-start">
                        {exp.startDate} — {exp.current ? 'Présent' : exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs font-bold" style={{ color: primaryColor }}>
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

          {/* Key Projects & Certifications Grid */}
          {(projects?.length > 0 || certifications?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
              {projects && projects.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <FolderGit2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      {sectionTitles?.projects || 'Projets'}
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {projects.map((p) => (
                      <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                        <div className="font-bold text-slate-900">{p.title}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {certifications && certifications.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Award className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                      {sectionTitles?.certifications || 'Certifications'}
                    </h2>
                  </div>
                  <div className="space-y-2 text-xs">
                    {certifications.map((c) => (
                      <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200/70">
                        <div className="font-bold text-slate-900">{c.title}</div>
                        <div className="text-[11px] text-slate-500">{c.organization} {c.date && `• ${c.date}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
