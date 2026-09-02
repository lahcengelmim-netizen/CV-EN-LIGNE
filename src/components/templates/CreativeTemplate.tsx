import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { getProfilePhoto } from '../../lib/defaultAvatar';
import { Mail, Phone, MapPin, Globe, Linkedin, Sparkles, Briefcase, GraduationCap, Award } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const CreativeTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#7c3aed'; // Violet creative

  return (
    <div className="w-full bg-slate-50 text-slate-800 font-sans min-h-[297mm] p-6 sm:p-10 flex flex-col justify-between shadow-sm">
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-8 flex-1">
        {/* Creative Top Card */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            {theme?.showPhoto && (
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden p-1 shadow-md shrink-0"
                style={{ backgroundColor: primaryColor }}
              >
                <img src={getProfilePhoto(personalInfo.photoUrl)} alt="Photo" className="w-full h-full object-cover rounded-2xl" />
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white mb-2" style={{ backgroundColor: primaryColor }}>
                <Sparkles className="w-3 h-3" />
                <span>{personalInfo.title || 'Candidat'}</span>
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 mt-2 text-xs text-slate-500">
                {personalInfo.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{personalInfo.email}</span>}
                {personalInfo.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{personalInfo.phone}</span>}
                {(personalInfo.city || personalInfo.country) && (
                  <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
                )}
                {personalInfo.linkedin && <span className="flex items-center gap-1"><Linkedin className="w-3 h-3" />{personalInfo.linkedin}</span>}
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {summary && (
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-slate-100 text-xs sm:text-sm text-slate-700 leading-relaxed">
            {summary}
          </div>
        )}

        {/* 2 Column Main Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Main (Exp & Proj) */}
          <div className="col-span-2 space-y-6">
            {experiences && experiences.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'الخبرات والمسار' : lang === 'en' ? 'Experience' : 'Expériences'}</span>
                </h2>
                <div className="space-y-4">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1">
                        <span className="font-bold text-slate-900 text-sm">{exp.position}</span>
                        <span className="text-[11px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                          {exp.startDate} — {exp.current ? (lang === 'ar' ? 'الآن' : lang === 'en' ? 'Present' : 'Présent') : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mb-2">
                        {exp.company} {exp.city && `• ${exp.city}`}
                      </div>
                      {exp.description && <p className="text-xs text-slate-600 mb-2 leading-relaxed">{exp.description}</p>}
                      {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                        <ul className="space-y-1 text-xs text-slate-600">
                          {exp.tasks.filter(Boolean).map((t, idx) => (
                            <li key={idx} className="flex items-start gap-1.5">
                              <span className="text-purple-500 mt-0.5 font-bold">›</span>
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

            {projects && projects.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  {lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Projects' : 'Projets créatifs'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {projects.map((p) => (
                    <div key={p.id} className="p-3 rounded-xl border border-slate-100 bg-white shadow-xs">
                      <div className="font-bold text-xs text-slate-800">{p.title}</div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Edu, Skills, Langs) */}
          <div className="space-y-6">
            {skills && skills.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  {lang === 'ar' ? 'المهارات' : lang === 'en' ? 'Skills' : 'Compétences'}
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span 
                      key={s.id} 
                      className="text-xs px-3 py-1 rounded-xl font-medium border"
                      style={{ 
                        backgroundColor: `${primaryColor}10`, 
                        borderColor: `${primaryColor}30`,
                        color: primaryColor 
                      }}
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {educations && educations.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'التعليم' : lang === 'en' ? 'Education' : 'Formations'}</span>
                </h2>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-500">{edu.institution}</div>
                      <div className="text-[11px] text-slate-400">{edu.startDate} — {edu.endDate || 'En cours'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                  {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
                </h2>
                <div className="space-y-1.5 text-xs">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between p-2 rounded-lg bg-slate-50">
                      <span className="font-medium text-slate-800">{l.language}</span>
                      <span className="text-slate-500 text-[11px]">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'الشهادات' : lang === 'en' ? 'Certifications' : 'Certifications'}</span>
                </h2>
                <div className="space-y-2 text-xs">
                  {certifications.map((c) => (
                    <div key={c.id} className="p-2 rounded-lg bg-slate-50">
                      <div className="font-semibold text-slate-800">{c.title}</div>
                      <div className="text-[11px] text-slate-500">{c.organization}</div>
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
