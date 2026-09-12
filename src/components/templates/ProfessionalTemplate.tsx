import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const ProfessionalTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#0f766e'; // Teal / Slate corporate

  return (
    <div className="w-full bg-white text-slate-800 font-sans min-h-[297mm] flex flex-col justify-between shadow-sm">
      {/* Top Corporate Banner */}
      <div className="p-8 sm:p-10 text-white relative overflow-hidden" style={{ backgroundColor: primaryColor }}>
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6 relative z-10">
          <div className="text-center sm:text-left flex-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-base font-medium text-white/90 mt-1 uppercase tracking-wider">
                {personalInfo.title}
              </p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 mt-4 text-xs text-white/80">
              {personalInfo.email && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{personalInfo.email}</span>}
              {personalInfo.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{personalInfo.phone}</span>}
              {(personalInfo.city || personalInfo.country) && (
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              )}
              {personalInfo.linkedin && <span className="flex items-center gap-1.5"><Linkedin className="w-3.5 h-3.5" />{personalInfo.linkedin}</span>}
            </div>
          </div>

          {theme?.showPhoto && personalInfo.photoUrl && (
            <div className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${(personalInfo.photoShape || theme?.photoShape) === 'rounded' ? 'rounded-2xl' : 'rounded-full'} overflow-hidden border-4 border-white shadow-lg shrink-0`}>
              <img src={personalInfo.photoUrl} alt="Photo" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>

      {/* Main Body */}
      <div className="p-8 sm:p-10 space-y-6 flex-1">
        {summary && (
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {summary}
            </p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8">
          {/* Main 2-columns (Experiences) */}
          <div className="col-span-2 space-y-6">
            {experiences && experiences.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 pb-1 border-b border-slate-200 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'المسار المهني' : lang === 'en' ? 'Work Experience' : 'Expériences Professionnelles'}</span>
                </h2>
                <div className="space-y-5">
                  {experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-bold text-slate-900 text-sm">{exp.position}</h3>
                        <span className="text-xs font-semibold text-slate-500">
                          {exp.startDate} — {exp.current ? (lang === 'ar' ? 'الآن' : lang === 'en' ? 'Present' : 'Présent') : exp.endDate}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-slate-600">
                        {exp.company} {exp.city && `• ${exp.city}`}
                      </div>
                      {exp.description && <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>}
                      {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                        <ul className="space-y-1 text-xs text-slate-700 pl-1 pt-1">
                          {exp.tasks.filter(Boolean).map((t, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-teal-600 font-bold">✓</span>
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
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200">
                  {lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Key Projects' : 'Projets Significatifs'}
                </h2>
                <div className="space-y-3">
                  {projects.map((p) => (
                    <div key={p.id} className="text-xs">
                      <div className="font-bold text-slate-800">{p.title}</div>
                      <p className="text-slate-600">{p.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Education, Skills, Languages) */}
          <div className="space-y-6">
            {educations && educations.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'التعليم' : lang === 'en' ? 'Education' : 'Formations'}</span>
                </h2>
                <div className="space-y-3">
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-600">{edu.institution}</div>
                      <div className="text-[11px] text-slate-400">{edu.startDate} — {edu.endDate || 'En cours'}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {skills && skills.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'المهارات' : lang === 'en' ? 'Skills' : 'Compétences'}</span>
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <span key={s.id} className="text-xs px-2.5 py-1 rounded-full font-medium bg-slate-100 text-slate-800">
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {languages && languages.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200">
                  {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
                </h2>
                <div className="space-y-1.5 text-xs">
                  {languages.map((l) => (
                    <div key={l.id} className="flex justify-between">
                      <span className="font-medium text-slate-800">{l.language}</span>
                      <span className="text-slate-500">{l.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications && certifications.length > 0 && (
              <div>
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3 pb-1 border-b border-slate-200 flex items-center gap-2">
                  <Award className="w-4 h-4" style={{ color: primaryColor }} />
                  <span>{lang === 'ar' ? 'الشهادات' : lang === 'en' ? 'Certificates' : 'Certifications'}</span>
                </h2>
                <div className="space-y-2 text-xs">
                  {certifications.map((c) => (
                    <div key={c.id}>
                      <div className="font-bold text-slate-800">{c.title}</div>
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
