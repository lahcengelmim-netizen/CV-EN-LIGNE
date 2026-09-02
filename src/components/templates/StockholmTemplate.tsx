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

export const StockholmTemplate: React.FC<TemplateProps> = ({ data }) => {
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
  const isRtl = theme?.isRtl || data.language === 'ar' || data.templateId === 'dubai-luxury-rtl' || (data.templateId as string) === 'casablanca-bilingual';

  const fontClass =
    theme?.fontFamily === 'serif' || data.design?.fontFamily === 'Merriweather' || data.design?.fontFamily === 'Playfair Display'
      ? 'font-serif'
      : theme?.fontFamily === 'mono' || data.design?.fontFamily === 'JetBrains Mono'
      ? 'font-mono'
      : 'font-sans';

  const renderContactItem = (icon: React.ReactNode, text?: string, href?: string) => {
    if (!text) return null;
    return (
      <div className="flex items-center gap-1.5 text-xs text-neutral-600 dark:text-neutral-300">
        <span className="shrink-0 text-neutral-400" style={{ color: primaryColor }}>{icon}</span>
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
    if (data.language === 'fr') return 'Compétences';
    if (data.language === 'ar') return 'المهارات';
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
    if (data.language === 'fr') return 'Certifications';
    if (data.language === 'ar') return 'الشهادات';
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
      className={`w-full bg-white text-neutral-900 shadow-none mx-auto transition-all select-text ${fontClass}`}
      style={{ minHeight: '297mm' }}
    >
      <div className="grid grid-cols-12 min-h-[297mm]">
        {/* Left Sidebar (4 cols) */}
        <div 
          className={`col-span-12 sm:col-span-4 p-6 ${isRtl ? 'border-l' : 'border-r'} border-neutral-200 text-neutral-800 space-y-5`}
          style={{ backgroundColor: `${primaryColor}08` }}
        >
          {theme?.showPhoto !== false && personalInfo.photoUrl && (
            <div className="flex justify-center">
              <img
                src={personalInfo.photoUrl}
                alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                referrerPolicy="no-referrer"
                className="w-24 h-24 rounded-full object-cover border-2 shadow-sm"
                style={{ borderColor: primaryColor }}
              />
            </div>
          )}

          <div>
            <h1 className="text-lg font-extrabold tracking-tight" style={{ color: primaryColor }}>
              {personalInfo.firstName} <br />
              {personalInfo.lastName}
            </h1>
            <p className="text-xs font-semibold text-neutral-600 mt-1">
              {personalInfo.title}
            </p>
          </div>

          {/* Contact details */}
          <div className="space-y-2 pt-2 border-t border-neutral-200">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              {sectionTitles?.contact || (data.language === 'fr' ? 'Contact' : 'Contact')}
            </h4>
            {renderContactItem(<Mail className="w-3 h-3" />, personalInfo.email, `mailto:${personalInfo.email}`)}
            {renderContactItem(<Phone className="w-3 h-3" />, personalInfo.phone, `tel:${personalInfo.phone}`)}
            {renderContactItem(
              <MapPin className="w-3 h-3" />, 
              [personalInfo.city, personalInfo.country].filter(Boolean).join(', ')
            )}
            {renderContactItem(<Linkedin className="w-3 h-3" />, personalInfo.linkedin, personalInfo.linkedin)}
            {renderContactItem(<Globe className="w-3 h-3" />, personalInfo.website, personalInfo.website)}
          </div>

          {/* Skills in sidebar */}
          {activeSections.skills !== false && skills.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {getSkillsTitle()}
              </h4>
              <div className="flex flex-wrap gap-1">
                {skills.map((s) => (
                  <span
                    key={s.id}
                    className="px-2 py-0.5 text-[10.5px] rounded font-medium"
                    style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  >
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages in sidebar */}
          {activeSections.languages !== false && languages.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {getLanguagesTitle()}
              </h4>
              <div className="space-y-1 text-[11px]">
                {languages.map((l) => (
                  <div key={l.id} className="flex justify-between">
                    <span className="font-medium text-neutral-800">{l.language || l.name}</span>
                    <span className="text-neutral-500">{l.level} {l.cefr && `(${l.cefr})`}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications in sidebar */}
          {activeSections.certifications !== false && certifications.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-neutral-200">
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
                {getCertificationsTitle()}
              </h4>
              <div className="space-y-1.5 text-[10.5px]">
                {certifications.map((c) => (
                  <div key={c.id}>
                    <p className="font-semibold text-neutral-800">{c.title || c.name}</p>
                    <p className="text-neutral-500">{c.organization || c.issuer} {c.date && `(${c.date})`}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Main Content (8 cols) */}
        <div className="col-span-12 sm:col-span-8 p-7 space-y-5">
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
    </div>
  );
};
