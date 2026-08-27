import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, FolderGit2, Star } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#2563eb';

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] flex flex-col md:flex-row shadow-sm font-sans">
      {/* Left Sidebar */}
      <div className="w-full md:w-1/3 p-6 sm:p-8 text-white flex flex-col justify-between shrink-0" style={{ backgroundColor: primaryColor }}>
        <div>
          {/* Photo */}
          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className="mb-6 flex justify-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-4 border-white/30 shadow-md">
                <img src={personalInfo.photoUrl} alt={`${personalInfo.firstName} ${personalInfo.lastName}`} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Name & Title on Mobile if stacked, or top sidebar */}
          <div className="text-center md:text-left mb-6">
            <h1 className="text-2xl font-black tracking-tight leading-tight">
              {personalInfo.firstName} <br className="hidden md:inline" />
              {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-xs sm:text-sm font-medium text-white/90 mt-1 uppercase tracking-wider">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact details */}
          <div className="space-y-3 text-xs text-white/90 border-t border-white/20 pt-4 mb-6">
            <div className="text-[10px] uppercase font-bold tracking-widest text-white/60 mb-1">
              {lang === 'ar' ? 'معلومات الاتصال' : lang === 'en' ? 'Contact Info' : 'Coordonnées'}
            </div>
            {personalInfo.email && (
              <div className="flex items-center gap-2.5 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2.5 break-all">
                <Linkedin className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
            {personalInfo.website && (
              <div className="flex items-center gap-2.5 break-all">
                <Globe className="w-3.5 h-3.5 shrink-0 opacity-80" />
                <span>{personalInfo.website}</span>
              </div>
            )}
          </div>

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div className="border-t border-white/20 pt-4 mb-6">
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">
                {lang === 'ar' ? 'المهارات' : lang === 'en' ? 'Skills' : 'Compétences'}
              </div>
              <div className="space-y-2 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>{skill.name}</span>
                      {skill.level && <span className="opacity-75">{skill.level * 20}%</span>}
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
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

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="border-t border-white/20 pt-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/60 mb-2">
                {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
              </div>
              <div className="space-y-2 text-xs">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center text-xs">
                    <span className="font-medium">{l.language}</span>
                    <span className="text-[11px] opacity-80">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer branding */}
        <div className="pt-6 text-[10px] text-white/40 text-center md:text-left">
          CV certifié professionnel
        </div>
      </div>

      {/* Right Content Area */}
      <div className="flex-1 p-6 sm:p-10 space-y-6 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Summary */}
          {summary && (
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }}></span>
                {lang === 'ar' ? 'نبذة مهنية' : lang === 'en' ? 'Profile' : 'À propos'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                {summary}
              </p>
            </div>
          )}

          {/* Work Experiences */}
          {experiences && experiences.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {lang === 'ar' ? 'الخبرات المهنية' : lang === 'en' ? 'Experience' : 'Expériences professionnelles'}
              </h2>
              <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-1">
                {experiences.map((exp) => (
                  <div key={exp.id} className="relative">
                    {/* Timeline dot */}
                    <div 
                      className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ backgroundColor: primaryColor }}
                    ></div>

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5">
                      <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                      <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} — {exp.current ? (lang === 'ar' ? 'حتى الآن' : lang === 'en' ? 'Present' : 'Présent') : exp.endDate}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">
                      {exp.company} {exp.city && `• ${exp.city}`}
                    </div>
                    {exp.description && (
                      <p className="text-xs text-slate-700 mb-1.5 leading-relaxed">{exp.description}</p>
                    )}
                    {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-600">
                        {exp.tasks.filter(Boolean).map((task, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-slate-400 mt-1">•</span>
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

          {/* Education */}
          {educations && educations.length > 0 && (
            <div>
              <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                <GraduationCap className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                {lang === 'ar' ? 'المؤهلات العلمية' : lang === 'en' ? 'Education' : 'Formations'}
              </h2>
              <div className="space-y-3 border-l-2 border-slate-100 pl-4 ml-1">
                {educations.map((edu) => (
                  <div key={edu.id} className="relative">
                    <div 
                      className="absolute -left-[21px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                      style={{ backgroundColor: primaryColor }}
                    ></div>
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm">{edu.degree}</h3>
                      <span className="text-[11px] text-slate-500">
                        {edu.startDate} — {edu.endDate || (edu.current ? 'En cours' : '')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 font-medium">{edu.institution} {edu.city && `• ${edu.city}`}</div>
                    {edu.description && <p className="text-xs text-slate-500 mt-0.5">{edu.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications and Projects */}
          {(certifications?.length > 0 || projects?.length > 0) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {certifications && certifications.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    {lang === 'ar' ? 'الشهادات' : lang === 'en' ? 'Certifications' : 'Certifications'}
                  </h2>
                  <div className="space-y-1.5 text-xs">
                    {certifications.map((c) => (
                      <div key={c.id} className="bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="font-semibold text-slate-800">{c.title}</div>
                        <div className="text-[11px] text-slate-500">{c.organization} {c.date && `• ${c.date}`}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {projects && projects.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2 flex items-center gap-1.5">
                    <FolderGit2 className="w-3.5 h-3.5" style={{ color: primaryColor }} />
                    {lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Projects' : 'Projets'}
                  </h2>
                  <div className="space-y-1.5 text-xs">
                    {projects.map((p) => (
                      <div key={p.id} className="bg-slate-50 p-2 rounded border border-slate-100">
                        <div className="font-semibold text-slate-800">{p.title}</div>
                        <p className="text-[11px] text-slate-600 line-clamp-2">{p.description}</p>
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
