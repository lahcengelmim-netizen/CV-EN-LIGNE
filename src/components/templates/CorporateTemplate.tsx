import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { getProfilePhoto } from '../../lib/defaultAvatar';
import { Mail, Phone, MapPin, Globe, Linkedin, Briefcase, GraduationCap, Award, Building2, CheckCircle2 } from 'lucide-react';

interface TemplateProps {
  data: CVData;
  lang?: LanguageCode;
}

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, lang = 'fr' }) => {
  const { personalInfo, summary, experiences, educations, skills, languages, certifications, projects, theme } = data;
  const primaryColor = theme?.primaryColor || '#1e3a8a'; // Deep Corporate Blue

  return (
    <div className="w-full bg-white text-slate-800 min-h-[297mm] flex flex-row font-sans select-text">
      {/* 1. Left Corporate Rail */}
      <div className="w-[32%] bg-slate-900 text-white p-6 sm:p-7 space-y-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Photo */}
          {theme?.showPhoto && (
            <div className="flex justify-center">
              <div className="w-28 h-28 rounded-xl overflow-hidden border-2 border-blue-400 shadow-lg">
                <img
                  src={getProfilePhoto(personalInfo.photoUrl)}
                  alt={`${personalInfo.firstName || 'Profil'} ${personalInfo.lastName || ''}`}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Contact Strip */}
          <div className="space-y-3 text-xs text-slate-200">
            <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 border-b border-slate-700 pb-1">
              {lang === 'ar' ? 'بيانات التواصل' : lang === 'en' ? 'Contact Details' : 'Coordonnées Pro'}
            </div>

            {personalInfo.email && (
              <div className="flex items-center gap-2 break-all">
                <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{personalInfo.email}</span>
              </div>
            )}
            {personalInfo.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{personalInfo.phone}</span>
              </div>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}
          </div>

          {/* Skills Matrix */}
          {skills && skills.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 border-b border-slate-700 pb-1">
                {lang === 'ar' ? 'الكفاءات الرئيسية' : lang === 'en' ? 'Core Competencies' : 'Compétences Clés'}
              </div>

              <div className="space-y-2">
                {skills.map((s) => (
                  <div key={s.id} className="space-y-1">
                    <div className="flex justify-between text-xs text-slate-200 font-medium">
                      <span>{s.name}</span>
                    </div>
                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(s.level || 4) * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono font-bold tracking-widest text-blue-400 border-b border-slate-700 pb-1">
                {lang === 'ar' ? 'اللغات' : lang === 'en' ? 'Languages' : 'Langues'}
              </div>

              <div className="space-y-1.5 text-xs text-slate-200">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between items-center">
                    <span className="font-semibold">{l.language}</span>
                    <span className="text-[10px] bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded font-mono">{l.level}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Certifications footer */}
        {certifications && certifications.length > 0 && (
          <div className="space-y-1.5 pt-4 border-t border-slate-800 text-xs">
            <div className="text-[10px] uppercase font-mono font-bold text-blue-400">Certifications</div>
            {certifications.map((c) => (
              <div key={c.id} className="text-[11px] text-slate-300">
                • {c.title} ({c.date})
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Main Corporate Content */}
      <div className="w-[68%] p-7 sm:p-9 space-y-6 flex-1">
        {/* Top Candidate Heading */}
        <div className="border-b-2 border-slate-900 pb-4 space-y-1">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 uppercase">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <p className="text-sm font-bold text-blue-800 uppercase tracking-wider">
              {personalInfo.title}
            </p>
          )}
        </div>

        {/* Executive Summary */}
        {summary && (
          <div className="space-y-1 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h3 className="text-xs uppercase font-extrabold text-slate-900 tracking-wider">
              {lang === 'ar' ? 'الملخص المهني' : lang === 'en' ? 'Corporate Profile' : 'Synthèse Professionnelle'}
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {experiences && experiences.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <Briefcase className="w-4 h-4 text-blue-900" />
              <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                {lang === 'ar' ? 'الخبرات والمسؤوليات' : lang === 'en' ? 'Professional Experience' : 'Expérience Professionnelle'}
              </h2>
            </div>

            <div className="space-y-4">
              {experiences.map((exp) => (
                <div key={exp.id} className="space-y-1.5 pl-3 border-l-2 border-blue-900">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <h3 className="text-xs font-bold text-slate-900">{exp.position}</h3>
                    <span className="text-[10px] font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {exp.startDate} — {exp.current ? 'Actuel' : exp.endDate}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-blue-800">
                    {exp.company}{exp.city ? ` • ${exp.city}` : ''}
                  </div>

                  {exp.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">{exp.description}</p>
                  )}

                  {exp.tasks && exp.tasks.length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {exp.tasks.map((task, idx) => (
                        <li key={idx} className="text-xs text-slate-700 flex items-start gap-1.5">
                          <span className="text-blue-700 font-bold">•</span>
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
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <GraduationCap className="w-4 h-4 text-blue-900" />
              <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                {lang === 'ar' ? 'التكوين الأكاديمي' : lang === 'en' ? 'Education' : 'Formation & Diplômes'}
              </h2>
            </div>

            <div className="space-y-2">
              {educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{edu.degree}</span>
                    <span className="text-slate-600"> — {edu.institution}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{edu.startDate} - {edu.endDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {projects && projects.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 border-b-2 border-slate-900 pb-1">
              <Building2 className="w-4 h-4 text-blue-900" />
              <h2 className="text-xs uppercase font-black tracking-wider text-slate-900">
                {lang === 'ar' ? 'المشاريع' : lang === 'en' ? 'Projects & Mandates' : 'Projets & Mandats'}
              </h2>
            </div>

            <div className="space-y-1.5">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <span className="font-bold text-slate-900">{proj.title} : </span>
                  <span className="text-slate-600">{proj.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
