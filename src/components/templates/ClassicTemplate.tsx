import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Calendar, Briefcase, GraduationCap, Award, FolderGit2, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#1e3a8a';

  return (
    <div className="w-full bg-white text-slate-800 p-8 sm:p-12 font-serif min-h-[297mm] flex flex-col justify-between leading-relaxed shadow-sm">
      {/* Top Header */}
      <div className="border-b-2 pb-6 mb-6" style={{ borderColor: primaryColor }}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl font-bold tracking-wide uppercase text-slate-900 font-serif">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-lg font-medium tracking-wide mt-1 font-sans" style={{ color: primaryColor }}>
                {personalInfo.title}
              </p>
            )}

            {/* Contact details */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 mt-3 text-xs text-slate-600 font-sans">
              {personalInfo.email && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  {personalInfo.email}
                </span>
              )}
              {personalInfo.phone && (
                <span className="inline-flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  {personalInfo.phone}
                </span>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}
                </span>
              )}
              {personalInfo.linkedin && (
                <span className="inline-flex items-center gap-1">
                  <Linkedin className="w-3.5 h-3.5 text-slate-500" />
                  {personalInfo.linkedin}
                </span>
              )}
              {personalInfo.website && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  {personalInfo.website}
                </span>
              )}
            </div>
          </div>

          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 shadow-sm shrink-0" style={{ borderColor: primaryColor }}>
              <img src={personalInfo.photoUrl} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      <div className="space-y-6 flex-1">
        {/* Summary */}
        {summary && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-2 font-sans flex items-center gap-2" style={{ color: primaryColor }}>
              <span>{lang === 'ar' ? 'الملخص المهني' : lang === 'en' ? 'Professional Summary' : 'Profil Professionnel'}</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify font-sans">
              {summary}
            </p>
          </div>
        )}

        {/* Work Experiences */}
        {experiences && experiences.length > 0 && (
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans flex items-center gap-2" style={{ color: primaryColor }}>
              <Briefcase className="w-4 h-4" />
              <span>{lang === 'ar' ? 'الخبرات المهنية' : lang === 'en' ? 'Work Experience' : 'Expériences Professionnelles'}</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </h2>
            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="text-xs sm:text-sm font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                    <span className="font-bold text-slate-900 text-sm">{exp.position}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} — {exp.current ? (lang === 'ar' ? 'حتى الآن' : lang === 'en' ? 'Present' : 'Présent') : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-600 mb-1.5 flex items-center gap-2">
                    <span>{exp.company}</span>
                    {exp.city && <span className="text-slate-400">• {exp.city}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-xs text-slate-700 mb-1.5 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-xs text-slate-700 pl-1">
                      {exp.tasks.filter(Boolean).map((task, idx) => (
                        <li key={idx} className="leading-snug">{task}</li>
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
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider mb-3 font-sans flex items-center gap-2" style={{ color: primaryColor }}>
              <GraduationCap className="w-4 h-4" />
              <span>{lang === 'ar' ? 'التعليم والتكوين' : lang === 'en' ? 'Education' : 'Formations & Diplômes'}</span>
              <div className="h-px bg-slate-200 flex-1"></div>
            </h2>
            <div className="space-y-3 font-sans">
              {educations.map((edu) => (
                <div key={edu.id} className="text-xs sm:text-sm">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-xs text-slate-500">
                      {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600 font-medium">
                    {edu.institution}{edu.city ? `, ${edu.city}` : ''}
                  </div>
                  {edu.description && (
                    <p className="text-xs text-slate-600 mt-0.5">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills & Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-sans">
          {/* Skills */}
          {skills && skills.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>{lang === 'ar' ? 'المهارات' : lang === 'en' ? 'Key Skills' : 'Compétences'}</span>
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <span key={skill.id} className="text-xs px-2.5 py-1 bg-slate-100 text-slate-800 rounded font-medium border border-slate-200">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                <Globe className="w-4 h-4" />
                <span>{lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}</span>
              </h2>
              <div className="space-y-1 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="font-medium text-slate-800">{l.language}</span>
                    <span className="text-slate-500">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications & Projects */}
        {(certifications?.length > 0 || projects?.length > 0) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 font-sans">
            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                  <Award className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'الشهادات' : lang === 'en' ? 'Certifications' : 'Certifications'}</span>
                </h2>
                <div className="space-y-1.5 text-xs">
                  {certifications.map((c) => (
                    <div key={c.id}>
                      <div className="font-semibold text-slate-800">{c.title}</div>
                      <div className="text-slate-500">{c.organization} {c.date ? `(${c.date})` : ''}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: primaryColor }}>
                  <FolderGit2 className="w-4 h-4" />
                  <span>{lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Projects' : 'Projets'}</span>
                </h2>
                <div className="space-y-1.5 text-xs">
                  {projects.map((p) => (
                    <div key={p.id}>
                      <div className="font-semibold text-slate-800">{p.title}</div>
                      <p className="text-slate-600 line-clamp-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
