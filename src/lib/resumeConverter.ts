import { CVData, Experience, Education, Skill, LanguageSkill } from '../types';
import type { ParsedResumeData } from '../types/resumeParser';

export function convertParsedToCVData(parsed: ParsedResumeData): Partial<CVData> {
  // Split fullName into firstName and lastName
  const nameParts = (parsed.personalInfo.fullName || '').trim().split(/\s+/);
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  // Parse experiences
  const experiences: Experience[] = (parsed.workExperience || []).map((exp, index) => ({
    id: exp.id || `exp_${Date.now()}_${index}`,
    title: exp.jobTitle || '',
    position: exp.jobTitle || '',
    company: exp.company || '',
    location: '',
    city: '',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    current: /présent|present|actuel|current/i.test(exp.endDate || ''),
    description: exp.description || '',
    tasks: exp.description ? exp.description.split('\n').filter(Boolean) : [],
  }));

  // Parse educations
  const educations: Education[] = (parsed.education || []).map((edu, index) => ({
    id: edu.id || `edu_${Date.now()}_${index}`,
    degree: edu.degree || '',
    institution: edu.institution || '',
    city: '',
    startDate: edu.startDate || '',
    endDate: edu.endDate || '',
    current: /présent|present|actuel|en cours/i.test(edu.endDate || ''),
    description: '',
  }));

  // Parse skills
  const skills: Skill[] = (parsed.skills || []).map((skillName, index) => ({
    id: `skill_${Date.now()}_${index}`,
    name: skillName,
    level: 4,
  }));

  // Parse languages
  const languages: LanguageSkill[] = (parsed.languages || []).map((langStr, index) => {
    // Extract language name and level if format like "Français (Natif)" or "Anglais - C1"
    const match = langStr.match(/^([^(:-]+)(?:\s*[(:-]\s*([^)]*)\)?)?$/);
    const lang = match && match[1] ? match[1].trim() : langStr;
    const level = match && match[2] ? match[2].trim() : 'Intermédiaire';

    return {
      id: `lang_${Date.now()}_${index}`,
      language: lang,
      level: level,
    };
  });

  return {
    title: parsed.personalInfo.jobTitle ? `CV ${parsed.personalInfo.jobTitle}` : 'Mon CV',
    personalInfo: {
      firstName,
      lastName,
      title: parsed.personalInfo.jobTitle || '',
      email: parsed.personalInfo.email || '',
      phone: parsed.personalInfo.phone || '',
      city: parsed.personalInfo.address || '',
      country: '',
      address: parsed.personalInfo.address || '',
    },
    summary: parsed.personalInfo.summary || '',
    experiences,
    experience: experiences,
    educations,
    education: educations,
    skills,
    languages,
  };
}
