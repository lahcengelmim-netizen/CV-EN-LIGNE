import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github, Briefcase, GraduationCap, Award, FolderGit2, Calendar, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const TimelineTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme, sectionTitles } = data;
  const primaryColor = theme?.primaryColor || '#2563eb'; // Royal Cobalt

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] p-8 sm:p-10 font-sans select-text">
      {/* 1. Header with Compact Meta */}
      <div className="border-b-2 pb-6 mb-8" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-950">
              {personalInfo.firstName} <span style={{ color: primaryColor }}>{personalInfo.lastName}</span>
            </h1>

            {personalInfo.title && (
              <p className="text-sm font-bold text-slate-600 tracking-wider uppercase">
                {personalInfo.title}
              </p>
            )}

            {summary && (
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl pt-1">
                {summary}
              </p>
            )}
          </div>

          {/* Optional Photo */}
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="shrink-0">
              <div 
                className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'circle' ? 'rounded-full' : 'rounded-2xl'} overflow-hidden border-2 shadow-md`} 
                style={{ borderColor: primaryColor }}
              >
                <img
                  src={personalInfo.photoUrl}
                  alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-slate-600">
          {personalInfo.email && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <Mail className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <Phone className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <MapPin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <Linkedin className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{personalInfo.linkedin}</span>
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-200">
              <Github className="w-3.5 h-3.5" style={{ color: primaryColor }} />
              <span>{personalInfo.github}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Central Timeline & Asymmetric Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left / Main Timeline (8 cols): Experiences & Education */}
        <div className="lg:col-span-8 space-y-8">
          {/* Chronological Work Experience */}
          {experiences && experiences.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {sectionTitles?.experience || 'Chronologie des Expériences'}
                </h2>
              </div>

              {/* Continuous Vertical Timeline Line */}
              <div className="relative pl-6 border-l-2 ml-2 space-y-7" style={{ borderColor: `${primaryColor}40` }}>
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative group">
                    {/* Timeline Node Icon/Dot */}
                    <div
                      className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center"
                      style={{ backgroundColor: primaryColor }}
                    >
                      <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                    </div>

                    <div className="space-y-1.5 bg-slate-50/60 p-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h3 className="font-extrabold text-sm text-slate-900">{exp.position}</h3>
                        <span className="text-[11px] font-bold text-slate-600 bg-white px-2.5 py-0.5 rounded border border-slate-200 self-start flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          {exp.startDate} — {exp.current ? 'Présent' : exp.endDate}
                        </span>
                      </div>

                      <div className="text-xs font-bold" style={{ color: primaryColor }}>
                        {exp.company} {exp.city && `• ${exp.city}`}
                      </div>

                      {exp.description && (
                        <p className="text-xs text-slate-700 leading-relaxed pt-1">{exp.description}</p>
                      )}

                      {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                        <ul className="space-y-1 text-xs text-slate-600 pt-1">
                          {exp.tasks.filter(Boolean).map((task, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 shrink-0 mt-0.5" style={{ color: primaryColor }} />
                              <span className="leading-snug">{task}</span>
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

          {/* Education Timeline */}
          {educations && educations.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                <h2 className="text-sm font-black uppercase tracking-wider text-slate-900">
                  {sectionTitles?.education || 'Formations & Diplômes'}
                </h2>
              </div>

              <div className="relative pl-6 border-l-2 ml-2 space-y-5" style={{ borderColor: `${primaryColor}40` }}>
                {educations.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div
                      className="absolute -left-[31px] top-1 w-4 h-4 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    ></div>

                    <div className="bg-slate-50/60 p-3.5 rounded-xl border border-slate-100">
                      <div className="flex justify-between items-baseline">
                        <div className="font-bold text-xs text-slate-900">{edu.degree}</div>
                        <span className="text-[10px] font-bold text-slate-500">
                          {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mt-0.5">{edu.institution} {edu.city && `• ${edu.city}`}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (4 cols): Skills, Projects, Languages, Certifications */}
        <div className="lg:col-span-4 space-y-6">
          {/* Skills Badges */}
          {skills && skills.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200">
                {sectionTitles?.skills || 'Compétences'}
              </h2>
              <div className="space-y-2 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center p-1.5 bg-white rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800">{skill.name}</span>
                    {skill.level && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded text-white" style={{ backgroundColor: primaryColor }}>
                        {skill.level}/5
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 mb-3 pb-1 border-b border-slate-200">
                {sectionTitles?.languages || 'Langues'}
              </h2>
              <div className="space-y-1.5 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center bg-white p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-slate-800">{l.language}</span>
                    <span className="text-[10px] font-semibold text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
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
                  <div key={p.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="font-bold text-slate-900">{p.title}</div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
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
                  <div key={c.id} className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
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
  );
};
