import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const NordicTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme, sectionTitles } = data;
  const primaryColor = theme?.primaryColor || '#18181b'; // Onyx Black

  return (
    <div className="w-full bg-white text-zinc-900 min-h-[297mm] p-8 sm:p-12 font-sans select-text border-t-8" style={{ borderTopColor: primaryColor }}>
      {/* 1. Haute Couture Minimal Header */}
      <div className="flex flex-col sm:flex-row items-baseline justify-between gap-6 pb-6 border-b border-zinc-200">
        <div className="space-y-1">
          <h1 className="text-3xl sm:text-4xl font-extralight tracking-tight text-zinc-950 font-serif">
            <span className="font-semibold">{personalInfo.firstName}</span> {personalInfo.lastName}
          </h1>

          {personalInfo.title && (
            <p className="text-xs sm:text-sm font-medium text-zinc-500 tracking-widest uppercase">
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Minimal Photo or Monogram */}
        {theme?.showPhoto && personalInfo.photoUrl && (
          <div className="shrink-0">
            <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'rounded' ? 'rounded-2xl' : 'rounded-full'} overflow-hidden border border-zinc-300 shadow-2xs grayscale contrast-110`}>
              <img
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Minimal Contact Row */}
      <div className="py-3.5 border-b border-zinc-100 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-600 font-light">
        {personalInfo.email && (
          <div className="flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-zinc-400" />
            <span>{personalInfo.email}</span>
          </div>
        )}
        {personalInfo.phone && (
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-zinc-400" />
            <span>{personalInfo.phone}</span>
          </div>
        )}
        {(personalInfo.city || personalInfo.country) && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-zinc-400" />
            <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
          </div>
        )}
        {personalInfo.linkedin && (
          <div className="flex items-center gap-1.5">
            <Linkedin className="w-3.5 h-3.5 text-zinc-400" />
            <span>{personalInfo.linkedin}</span>
          </div>
        )}
        {personalInfo.website && (
          <div className="flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-zinc-400" />
            <span>{personalInfo.website}</span>
          </div>
        )}
      </div>

      {/* 2. Structured Editorial Flow */}
      <div className="pt-6 space-y-7">
        {/* Profile Summary */}
        {summary && (
          <div className="grid grid-cols-12 gap-4 items-baseline">
            <div className="col-span-3 text-[11px] font-bold tracking-widest uppercase text-zinc-400">
              01 / {sectionTitles?.profile || 'Profil'}
            </div>
            <div className="col-span-9">
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-light">
                {summary}
              </p>
            </div>
          </div>
        )}

        {/* Experiences */}
        {experiences && experiences.length > 0 && (
          <div className="grid grid-cols-12 gap-4 items-baseline pt-4 border-t border-zinc-100">
            <div className="col-span-3 text-[11px] font-bold tracking-widest uppercase text-zinc-400">
              02 / {sectionTitles?.experience || 'Expériences'}
            </div>

            <div className="col-span-9 space-y-6">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1.5">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="font-semibold text-sm text-zinc-900">{exp.position}</h3>
                    <span className="text-xs font-light text-zinc-500">
                      {exp.startDate} — {exp.current ? 'Présent' : exp.endDate}
                    </span>
                  </div>

                  <div className="text-xs font-medium text-zinc-600">
                    {exp.company} {exp.city && `• ${exp.city}`}
                  </div>

                  {exp.description && (
                    <p className="text-xs text-zinc-600 leading-relaxed pt-0.5 font-light">{exp.description}</p>
                  )}

                  {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                    <ul className="space-y-1 text-xs text-zinc-600 pt-1 font-light">
                      {exp.tasks.filter(Boolean).map((task, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-zinc-400 mt-0.5">—</span>
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

        {/* Education */}
        {educations && educations.length > 0 && (
          <div className="grid grid-cols-12 gap-4 items-baseline pt-4 border-t border-zinc-100">
            <div className="col-span-3 text-[11px] font-bold tracking-widest uppercase text-zinc-400">
              03 / {sectionTitles?.education || 'Formation'}
            </div>

            <div className="col-span-9 space-y-4">
              {educations.map((edu) => (
                <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div>
                    <h3 className="font-semibold text-xs text-zinc-900">{edu.degree}</h3>
                    <div className="text-xs text-zinc-500 font-light mt-0.5">{edu.institution} {edu.city && `• ${edu.city}`}</div>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-light shrink-0">
                    {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Languages */}
        {((skills && skills.length > 0) || (languages && languages.length > 0)) && (
          <div className="grid grid-cols-12 gap-4 items-baseline pt-4 border-t border-zinc-100">
            <div className="col-span-3 text-[11px] font-bold tracking-widest uppercase text-zinc-400">
              04 / {sectionTitles?.skills || 'Expertise'}
            </div>

            <div className="col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Skills text list */}
              {skills && skills.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-bold text-zinc-800">Compétences</div>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((s) => (
                      <span key={s.id} className="px-2.5 py-1 rounded bg-zinc-100 text-zinc-800 text-xs font-light">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages text list */}
              {languages && languages.length > 0 && (
                <div className="space-y-2">
                  <div className="text-[11px] uppercase font-bold text-zinc-800">Langues</div>
                  <div className="space-y-1 text-xs">
                    {languages.map((l) => (
                      <div key={l.id} className="flex justify-between text-zinc-700 font-light">
                        <span>{l.language}</span>
                        <span className="text-zinc-400 text-[11px]">{l.level}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Certifications & Projects */}
        {(certifications?.length > 0 || projects?.length > 0) && (
          <div className="grid grid-cols-12 gap-4 items-baseline pt-4 border-t border-zinc-100">
            <div className="col-span-3 text-[11px] font-bold tracking-widest uppercase text-zinc-400">
              05 / Distinctions
            </div>

            <div className="col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {certifications && certifications.map((c) => (
                <div key={c.id} className="p-2.5 bg-zinc-50 rounded border border-zinc-100 font-light">
                  <div className="font-medium text-zinc-900">{c.title}</div>
                  <div className="text-[11px] text-zinc-500 mt-0.5">{c.organization} {c.date && `• ${c.date}`}</div>
                </div>
              ))}
              {projects && projects.map((p) => (
                <div key={p.id} className="p-2.5 bg-zinc-50 rounded border border-zinc-100 font-light">
                  <div className="font-medium text-zinc-900">{p.title}</div>
                  <div className="text-[11px] text-zinc-500 line-clamp-2 mt-0.5">{p.description}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
