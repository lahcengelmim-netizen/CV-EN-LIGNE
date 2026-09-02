import React from 'react';
import { CVData } from '../../types';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Globe, 
  Award, 
  GraduationCap, 
  Briefcase, 
  Languages, 
  Sparkles, 
  CheckCircle2, 
  FolderGit2,
  Users
} from 'lucide-react';

interface TemplateProps {
  data: CVData;
}

export const ZurichTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, summary, theme, sectionTitles } = data;
  const experiences = data.experiences || data.experience || [];
  const educations = data.educations || data.education || [];
  const skills = data.skills || [];
  const languages = data.languages || [];
  const certifications = data.certifications || [];
  const projects = data.projects || [];
  const references = data.references || [];
  const activeSections = data.activeSections || {
    summary: !!summary,
    experience: experiences.length > 0,
    education: educations.length > 0,
    skills: skills.length > 0,
    languages: languages.length > 0,
    certifications: certifications.length > 0,
    projects: projects.length > 0,
    references: references.length > 0,
  };

  const primaryColor = theme?.primaryColor || data.design?.primaryColor || '#0f766e';
  const isRtl = theme?.isRtl || data.language === 'ar' || data.templateId === 'dubai-luxury-rtl';

  const fontClass =
    theme?.fontFamily === 'serif' || data.design?.fontFamily === 'Merriweather' || data.design?.fontFamily === 'Playfair Display'
      ? 'font-serif'
      : theme?.fontFamily === 'mono' || data.design?.fontFamily === 'JetBrains Mono'
      ? 'font-mono'
      : 'font-sans';

  const spacing = theme?.spacing || 'normal';
  const paddingClass =
    spacing === 'compact' ? 'p-6' : spacing === 'spacious' ? 'p-12' : 'p-8 sm:p-10';
  const spacingClass =
    spacing === 'compact' ? 'space-y-3' : spacing === 'spacious' ? 'space-y-6' : 'space-y-4';

  const renderContactItem = (icon: React.ReactNode, text?: string, href?: string) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
        <span className="shrink-0" style={{ color: primaryColor }}>{icon}</span>
        {href ? (
          <a 
            href={href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') ? href : `https://${href}`} 
            target="_blank" 
            rel="noreferrer" 
            className="hover:underline truncate max-w-[180px]"
          >
            {text}
          </a>
        ) : (
          <span className="truncate max-w-[180px]">{text}</span>
        )}
      </div>
    );
  };

  const getSummaryTitle = () => {
    if (sectionTitles?.profile) return sectionTitles.profile;
    if (data.language === 'fr') return 'Profil Professionnel';
    if (data.language === 'ar') return 'الملف الشخصي';
    return 'Professional Summary';
  };

  const getExperienceTitle = () => {
    if (sectionTitles?.experience) return sectionTitles.experience;
    if (data.language === 'fr') return 'Expérience Professionnelle';
    if (data.language === 'ar') return 'الخبرات المهنية';
    return 'Work Experience';
  };

  const getEducationTitle = () => {
    if (sectionTitles?.education) return sectionTitles.education;
    if (data.language === 'fr') return 'Formation & Diplômes';
    if (data.language === 'ar') return 'التعليم والمؤهلات';
    return 'Education & Credentials';
  };

  const getSkillsTitle = () => {
    if (sectionTitles?.skills) return sectionTitles.skills;
    if (data.language === 'fr') return 'Compétences & Atouts';
    if (data.language === 'ar') return 'المهارات والكفاءات';
    return 'Skills & Competencies';
  };

  const getLanguagesTitle = () => {
    if (sectionTitles?.languages) return sectionTitles.languages;
    if (data.language === 'fr') return 'Langues';
    if (data.language === 'ar') return 'اللغات';
    return 'Languages';
  };

  const getCertificationsTitle = () => {
    if (sectionTitles?.certifications) return sectionTitles.certifications;
    if (data.language === 'fr') return 'Certifications & Prix';
    if (data.language === 'ar') return 'الشهادات والجوائز';
    return 'Certifications';
  };

  const getProjectsTitle = () => {
    if (sectionTitles?.projects) return sectionTitles.projects;
    if (data.language === 'fr') return 'Projets Notables';
    if (data.language === 'ar') return 'المشاريع الرئيسية';
    return 'Key Projects';
  };

  const getReferencesTitle = () => {
    if (sectionTitles?.references) return sectionTitles.references;
    if (data.language === 'fr') return 'Références';
    if (data.language === 'ar') return 'المراجع';
    return 'References';
  };

  const getPresentLabel = () => {
    if (data.language === 'fr') return 'Présent';
    if (data.language === 'ar') return 'حالي';
    return 'Present';
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`w-full bg-white text-neutral-900 shadow-none mx-auto transition-all select-text ${fontClass} ${paddingClass}`}
      style={{ minHeight: '297mm' }}
    >
      {/* Centered Executive Header */}
      <div className="text-center pb-5 mb-5 border-b-2" style={{ borderColor: primaryColor }}>
        {theme?.showPhoto !== false && personalInfo.photoUrl && (
          <div className="flex justify-center mb-3">
            <img
              src={personalInfo.photoUrl}
              alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
              referrerPolicy="no-referrer"
              className="w-20 h-20 rounded-full object-cover border-2 shadow-sm"
              style={{ borderColor: primaryColor }}
            />
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ color: primaryColor }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <p className="text-sm font-medium tracking-wide text-neutral-600 dark:text-neutral-400 uppercase mt-0.5">
            {personalInfo.title}
          </p>
        )}

        {/* Contact details inline with bullets */}
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs text-neutral-600 dark:text-neutral-300 mt-2">
          {personalInfo.email && renderContactItem(<Mail className="w-3.5 h-3.5" />, personalInfo.email, `mailto:${personalInfo.email}`)}
          {personalInfo.email && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && renderContactItem(<Phone className="w-3.5 h-3.5" />, personalInfo.phone, `tel:${personalInfo.phone}`)}
          {(personalInfo.city || personalInfo.country) && (personalInfo.email || personalInfo.phone) && <span>•</span>}
          {(personalInfo.city || personalInfo.country) && renderContactItem(
            <MapPin className="w-3.5 h-3.5" />, 
            [personalInfo.city, personalInfo.country].filter(Boolean).join(', ')
          )}
          {personalInfo.linkedin && <span>•</span>}
          {personalInfo.linkedin && renderContactItem(<Linkedin className="w-3.5 h-3.5" />, personalInfo.linkedin, personalInfo.linkedin)}
          {personalInfo.website && <span>•</span>}
          {personalInfo.website && renderContactItem(<Globe className="w-3.5 h-3.5" />, personalInfo.website, personalInfo.website)}
        </div>
      </div>

      {/* Main Content Sections */}
      <div className={spacingClass}>
        {/* Summary */}
        {activeSections.summary !== false && summary && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-2 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{getSummaryTitle()}</span>
            </h3>
            <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300 text-justify">
              {summary}
            </p>
          </div>
        )}

        {/* Experience */}
        {activeSections.experience !== false && experiences.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-3 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span>{getExperienceTitle()}</span>
            </h3>
            <div className="space-y-3">
              {experiences.map((exp) => (
                <div 
                  key={exp.id} 
                  className={`relative ${isRtl ? 'pr-3 border-r-2' : 'pl-3 border-l-2'} border-neutral-200 dark:border-neutral-700`}
                >
                  <div className="flex flex-wrap justify-between items-baseline gap-1">
                    <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                      {exp.position || exp.jobTitle}
                    </span>
                    <span className="text-[11px] font-medium text-neutral-500">
                      {exp.startDate} – {exp.current ? getPresentLabel() : exp.endDate || getPresentLabel()}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-[11px] text-neutral-600 dark:text-neutral-400 mb-1">
                    <span className="font-semibold" style={{ color: primaryColor }}>{exp.company}</span>
                    {(exp.city || exp.location) && <span>{exp.city || exp.location}</span>}
                  </div>
                  {exp.description && (
                    <p className="text-[11.5px] text-neutral-700 dark:text-neutral-300 mb-1 leading-snug">
                      {exp.description}
                    </p>
                  )}
                  {((exp.tasks && exp.tasks.length > 0) || (exp.bullets && exp.bullets.length > 0)) && (
                    <ul className={`list-disc list-outside ${isRtl ? 'mr-3.5' : 'ml-3.5'} text-[11px] text-neutral-600 dark:text-neutral-300 space-y-0.5`}>
                      {(exp.tasks || exp.bullets || []).filter(Boolean).map((bullet, idx) => (
                        <li key={idx} className="leading-snug">
                          {bullet}
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
        {activeSections.education !== false && educations.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-3 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{getEducationTitle()}</span>
            </h3>
            <div className="space-y-2.5">
              {educations.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{edu.degree}</span>
                    <span className="text-[11px] text-neutral-500">
                      {edu.startDate} – {edu.endDate || (edu.current ? (data.language === 'fr' ? 'En cours' : 'Present') : getPresentLabel())}
                    </span>
                  </div>
                  <div className="flex justify-between text-[11px] text-neutral-600 dark:text-neutral-400">
                    <span className="font-medium" style={{ color: primaryColor }}>{edu.institution}</span>
                    {(edu.city || edu.location) && <span>{edu.city || edu.location}</span>}
                  </div>
                  {edu.grade && <div className="text-[10.5px] text-neutral-500 italic mt-0.5">{edu.grade}</div>}
                  {edu.description && <p className="text-[11px] text-neutral-600 dark:text-neutral-300 mt-0.5">{edu.description}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {activeSections.skills !== false && skills.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-2 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{getSkillsTitle()}</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium border"
                  style={{
                    backgroundColor: `${primaryColor}0d`,
                    borderColor: `${primaryColor}30`,
                    color: primaryColor,
                  }}
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {activeSections.languages !== false && languages.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-2 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>{getLanguagesTitle()}</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center text-[11px] border-b border-neutral-100 dark:border-neutral-800 pb-0.5">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200">{lang.language || lang.name}</span>
                  <span className="text-neutral-500">{lang.level} {lang.cefr && `(${lang.cefr})`}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {activeSections.certifications !== false && certifications.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-2 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Award className="w-3.5 h-3.5" />
              <span>{getCertificationsTitle()}</span>
            </h3>
            <div className="space-y-1.5 text-xs">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline text-[11px]">
                  <div>
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{cert.title || cert.name}</span>
                    <span className="text-neutral-500"> — {cert.organization || cert.issuer}</span>
                  </div>
                  <span className="text-neutral-400 text-[10.5px]">{cert.date}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {activeSections.projects !== false && projects.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-2 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>{getProjectsTitle()}</span>
            </h3>
            <div className="space-y-2">
              {projects.map((proj) => (
                <div key={proj.id} className="text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-neutral-900 dark:text-neutral-100">{proj.title || proj.name}</span>
                    {(proj.date || proj.link) && <span className="text-[10.5px] text-neutral-500">{proj.date || proj.link}</span>}
                  </div>
                  <p className="text-[11px] text-neutral-700 dark:text-neutral-300 leading-snug">{proj.description}</p>
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10.5px] text-neutral-500 mt-0.5">
                      Tech: {proj.technologies.join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* References */}
        {activeSections.references !== false && references.length > 0 && (
          <div className="cv-section">
            <h3 
              className="text-xs uppercase font-bold tracking-wider mb-2 border-b pb-1 flex items-center gap-2"
              style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{getReferencesTitle()}</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              {references.map((ref) => (
                <div key={ref.id} className="bg-neutral-50 dark:bg-neutral-800/50 p-2 rounded border border-neutral-200 dark:border-neutral-700">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100">{ref.name}</div>
                  <div className="text-neutral-600 dark:text-neutral-400">{ref.title}, {ref.company}</div>
                  {ref.email && <div className="text-neutral-500 truncate">{ref.email}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
