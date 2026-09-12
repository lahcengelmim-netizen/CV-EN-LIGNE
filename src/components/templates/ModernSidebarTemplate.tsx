import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { getProfilePhoto } from '../../lib/defaultAvatar';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Linkedin,
  Github,
  Briefcase,
  GraduationCap,
  Award,
  FolderGit2,
} from 'lucide-react';

export interface ModernSidebarTemplateProps {
  data: CVData;
  lang?: LanguageCode | string;
}

/**
 * Modern-Sidebar Template
 * Two-column layout with a colored sidebar for contact info, skills, languages, and profile photo.
 * Features:
 * - High-impact colored sidebar displaying candidate avatar and core metadata
 * - Spacious main column for detailed professional history, education, and achievements
 * - Dynamic theme color support, real-time JSON structure synchronization, and responsive A4 sizing
 */
export const ModernSidebarTemplate: React.FC<ModernSidebarTemplateProps> = ({ data, lang = 'fr' }) => {
  const {
    personalInfo,
    summary,
    experiences = [],
    educations = [],
    skills = [],
    languages = [],
    certifications = [],
    projects = [],
    theme,
    sectionTitles,
  } = data;

  const primaryColor = theme?.primaryColor || '#2563eb';
  const showPhoto = theme?.showPhoto !== false;
  const photoShape = personalInfo.photoShape || theme?.photoShape || 'rounded';

  // Section titles with internationalization fallback
  const isEn = lang === 'en';
  const isAr = lang === 'ar';

  const tContact = sectionTitles?.contact || (isAr ? 'معلومات الاتصال' : isEn ? 'Contact' : 'Coordonnées');
  const tSkills = sectionTitles?.skills || (isAr ? 'المهارات' : isEn ? 'Skills' : 'Compétences');
  const tLanguages = sectionTitles?.languages || (isAr ? 'اللغات' : isEn ? 'Languages' : 'Langues');
  const tProfile = sectionTitles?.profile || (isAr ? 'الملخص المهني' : isEn ? 'Professional Profile' : 'Profil Professionnel');
  const tExperience = sectionTitles?.experience || (isAr ? 'الخبرات المهنية' : isEn ? 'Work Experience' : 'Expériences Professionnelles');
  const tEducation = sectionTitles?.education || (isAr ? 'التعليم والتكوين' : isEn ? 'Education' : 'Formations & Diplômes');
  const tProjects = sectionTitles?.projects || (isAr ? 'المشاريع' : isEn ? 'Projects' : 'Projets Récents');
  const tCertifications = sectionTitles?.certifications || (isAr ? 'الشهادات' : isEn ? 'Certifications' : 'Certifications');

  return (
    <article
      className="w-full bg-white text-slate-800 min-h-[297mm] flex flex-row shadow-sm font-sans box-border"
      aria-label="CV Modern-Sidebar"
    >
      {/* 1. LEFT COLORED SIDEBAR */}
      <aside
        className="w-1/3 p-6 sm:p-8 text-white flex flex-col justify-between shrink-0 transition-colors duration-300"
        style={{ backgroundColor: primaryColor }}
      >
        <div className="space-y-6">
          {/* Profile Photo */}
          {showPhoto && (
            <div className="flex justify-center">
              <div
                className={`w-36 h-36 sm:w-40 sm:h-40 md:w-44 md:h-44 ${
                  photoShape === 'circle' ? 'rounded-full' : 'rounded-2xl'
                } overflow-hidden border-4 border-white/40 shadow-lg shrink-0 bg-white/10`}
              >
                <img
                  src={getProfilePhoto(personalInfo.photoUrl)}
                  alt={`${personalInfo.firstName || 'Profil'} ${personalInfo.lastName || ''}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Name & Title in Sidebar Header */}
          <div className="text-left space-y-1">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight m-0 text-white">
              {personalInfo.firstName}
              <br />
              {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <p className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wider m-0">
                {personalInfo.title}
              </p>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-3 text-xs text-white/90 border-t border-white/20 pt-4">
            <div className="text-[10px] uppercase font-bold tracking-widest text-white/70 mb-1">
              {tContact}
            </div>

            {personalInfo.email && (
              <div className="flex items-center gap-2.5 break-all">
                <Mail className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{personalInfo.email}</span>
              </div>
            )}

            {personalInfo.phone && (
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{personalInfo.phone}</span>
              </div>
            )}

            {(personalInfo.city || personalInfo.country) && (
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{[personalInfo.city, personalInfo.country].filter(Boolean).join(', ')}</span>
              </div>
            )}

            {personalInfo.linkedin && (
              <div className="flex items-center gap-2.5 break-all">
                <Linkedin className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{personalInfo.linkedin}</span>
              </div>
            )}

            {personalInfo.website && (
              <div className="flex items-center gap-2.5 break-all">
                <Globe className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{personalInfo.website}</span>
              </div>
            )}

            {personalInfo.github && (
              <div className="flex items-center gap-2.5 break-all">
                <Github className="w-3.5 h-3.5 shrink-0 opacity-90" />
                <span>{personalInfo.github}</span>
              </div>
            )}
          </div>

          {/* Skills with Progress Gauges */}
          {skills && skills.length > 0 && (
            <div className="border-t border-white/20 pt-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/70 mb-3">
                {tSkills}
              </div>
              <div className="space-y-2.5 text-xs">
                {skills.map((skill, idx) => {
                  const numericLevel =
                    typeof skill.level === 'number'
                      ? skill.level
                      : typeof skill.level === 'string' && !isNaN(Number(skill.level))
                      ? Number(skill.level)
                      : 4;
                  const percent = Math.min(Math.max(numericLevel * 20, 20), 100);

                  return (
                    <div key={skill.id || idx}>
                      <div className="flex justify-between text-xs mb-1 font-medium">
                        <span className="truncate pr-1">{skill.name}</span>
                        <span className="opacity-80 text-[10px] shrink-0">{percent}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-white h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Languages */}
          {languages && languages.length > 0 && (
            <div className="border-t border-white/20 pt-4">
              <div className="text-[10px] uppercase font-bold tracking-widest text-white/70 mb-2.5">
                {tLanguages}
              </div>
              <div className="space-y-2 text-xs">
                {languages.map((l, idx) => (
                  <div key={l.id || idx} className="flex justify-between items-center text-xs">
                    <span className="font-semibold">{l.language || l.name}</span>
                    <span className="text-[11px] opacity-85 px-1.5 py-0.5 rounded bg-white/10">
                      {l.level}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Footer Subtitle */}
        <div className="pt-6 text-[10px] text-white/50 text-left border-t border-white/10 mt-6">
          Document professionnel • Mis à jour en temps réel
        </div>
      </aside>

      {/* 2. RIGHT MAIN CONTENT COLUMN */}
      <main className="flex-1 p-6 sm:p-10 space-y-6 flex flex-col justify-between overflow-hidden">
        <div className="space-y-6">
          {/* Summary / Profile */}
          {summary && summary.trim() && (
            <section aria-labelledby="section-modern-summary">
              <h2
                id="section-modern-summary"
                className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2.5 flex items-center gap-2"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
                <span>{tProfile}</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal m-0 text-justify">
                {summary}
              </p>
            </section>
          )}

          {/* Professional Experiences with Connected Timeline */}
          {experiences && experiences.length > 0 && (
            <section aria-labelledby="section-modern-experience">
              <h2
                id="section-modern-experience"
                className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-3.5 flex items-center gap-2"
              >
                <Briefcase className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{tExperience}</span>
              </h2>

              <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-1.5">
                {experiences.map((exp, idx) => (
                  <div key={exp.id || idx} className="relative">
                    {/* Timeline Node */}
                    <div
                      className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-1 gap-1">
                      <h3 className="font-bold text-slate-900 text-sm m-0">{exp.position}</h3>
                      <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                        {exp.startDate} — {exp.current ? (isEn ? 'Present' : 'Actuel') : exp.endDate}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-600 mb-1.5">
                      {exp.company} {exp.city && `• ${exp.city}`}
                    </div>

                    {exp.description && (
                      <p className="text-xs text-slate-700 mb-2 leading-relaxed m-0">
                        {exp.description}
                      </p>
                    )}

                    {exp.tasks && exp.tasks.filter(Boolean).length > 0 && (
                      <ul className="space-y-1 text-xs text-slate-600 pl-1 list-none m-0">
                        {exp.tasks.filter(Boolean).map((task, taskIdx) => (
                          <li key={taskIdx} className="flex items-start gap-1.5">
                            <span className="text-slate-400 mt-0.5 font-bold">•</span>
                            <span className="leading-snug">{task}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {educations && educations.length > 0 && (
            <section aria-labelledby="section-modern-education">
              <h2
                id="section-modern-education"
                className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-3.5 flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{tEducation}</span>
              </h2>

              <div className="space-y-3.5 border-l-2 border-slate-100 pl-4 ml-1.5">
                {educations.map((edu, idx) => (
                  <div key={edu.id || idx} className="relative">
                    <div
                      className="absolute -left-[23px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: primaryColor }}
                    />

                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-0.5 gap-1">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm m-0">{edu.degree}</h3>
                      <span className="text-[11px] font-medium text-slate-500 shrink-0">
                        {edu.startDate} — {edu.current ? (isEn ? 'Present' : 'En cours') : edu.endDate}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-medium">
                      {edu.institution} {edu.city && `• ${edu.city}`}
                    </div>

                    {edu.description && (
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed m-0">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Key Projects */}
          {projects && projects.length > 0 && (
            <section aria-labelledby="section-modern-projects">
              <h2
                id="section-modern-projects"
                className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-3 flex items-center gap-2"
              >
                <FolderGit2 className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{tProjects}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {projects.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/50 space-y-1"
                  >
                    <div className="flex items-baseline justify-between gap-1">
                      <strong className="text-xs font-bold text-slate-900 truncate">
                        {proj.title}
                      </strong>
                      {proj.date && (
                        <span className="text-[10px] text-slate-400 shrink-0">{proj.date}</span>
                      )}
                    </div>
                    {proj.role && <p className="text-[11px] text-slate-600 m-0">{proj.role}</p>}
                    {proj.description && (
                      <p className="text-[11px] text-slate-600 leading-snug m-0 line-clamp-2">
                        {proj.description}
                      </p>
                    )}
                    {proj.technologies && proj.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] px-1.5 py-0.5 rounded bg-white text-slate-600 border border-slate-200"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications && certifications.length > 0 && (
            <section aria-labelledby="section-modern-certifications">
              <h2
                id="section-modern-certifications"
                className="text-xs uppercase font-extrabold tracking-widest text-slate-400 mb-2.5 flex items-center gap-2"
              >
                <Award className="w-4 h-4" style={{ color: primaryColor }} />
                <span>{tCertifications}</span>
              </h2>

              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, idx) => (
                  <div
                    key={cert.id || idx}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 flex items-center gap-1.5 shadow-2xs"
                  >
                    <span className="font-semibold">{cert.title}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">{cert.organization}</span>
                    {cert.date && <span className="text-slate-400 text-[10px]">({cert.date})</span>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </article>
  );
};

export default ModernSidebarTemplate;
