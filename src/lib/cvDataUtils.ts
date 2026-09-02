import { CVData, TemplateId } from '../types';
import { getTemplateById } from './templatesData';
import { getProfilePhoto } from './defaultAvatar';

/**
 * Returns effective CVData for live rendering and preview.
 * Merges user-entered data with standard realistic sample data when fields are empty.
 * In real-time, whenever the user types in any section, their inputs immediately replace the sample data.
 */
export function getEffectiveCVData(cv: CVData): CVData {
  if (!cv) return cv;

  const templateId: TemplateId = cv.templateId || 'stockholm-modern';
  const templateDef = getTemplateById(templateId);
  const sample = templateDef.sampleCV;

  // 1. Personal Info
  const userPI = cv.personalInfo || {} as any;
  const samplePI = sample.personalInfo || {} as any;

  const firstName = userPI.firstName?.trim() ? userPI.firstName : samplePI.firstName;
  const lastName = userPI.lastName?.trim() ? userPI.lastName : samplePI.lastName;
  const title = userPI.title?.trim() ? userPI.title : samplePI.title;
  const email = userPI.email?.trim() ? userPI.email : samplePI.email;
  const phone = userPI.phone?.trim() ? userPI.phone : samplePI.phone;
  const city = userPI.city?.trim() ? userPI.city : samplePI.city;
  const country = userPI.country?.trim() ? userPI.country : samplePI.country;
  const linkedin = userPI.linkedin?.trim() ? userPI.linkedin : samplePI.linkedin;
  const website = userPI.website?.trim() ? userPI.website : samplePI.website;

  // Photo: user uploaded photo takes precedence, otherwise provisional placeholder photo
  const photoUrl = getProfilePhoto(userPI.photoUrl);

  const effectivePersonalInfo = {
    ...samplePI,
    ...userPI,
    firstName,
    lastName,
    title,
    email,
    phone,
    city,
    country,
    linkedin,
    website,
    photoUrl,
  };

  // 2. Summary
  const effectiveSummary = cv.summary && cv.summary.trim() ? cv.summary : sample.summary;

  // 3. Experiences
  const hasUserExperiences =
    Array.isArray(cv.experiences) &&
    cv.experiences.length > 0 &&
    cv.experiences.some(
      (e) =>
        (e.position && e.position.trim()) ||
        ((e as any).jobTitle && (e as any).jobTitle.trim()) ||
        (e.company && e.company.trim()) ||
        ((e as any).employer && (e as any).employer.trim()) ||
        (e.description && e.description.trim()) ||
        (Array.isArray(e.tasks) && e.tasks.length > 0)
    );
  const effectiveExperiences = hasUserExperiences ? cv.experiences : sample.experiences;

  // 4. Educations
  const hasUserEducations =
    Array.isArray(cv.educations) &&
    cv.educations.length > 0 &&
    cv.educations.some(
      (e) =>
        (e.degree && e.degree.trim()) ||
        (e.institution && e.institution.trim()) ||
        ((e as any).school && (e as any).school.trim())
    );
  const effectiveEducations = hasUserEducations ? cv.educations : sample.educations;

  // 5. Skills
  const hasUserSkills =
    Array.isArray(cv.skills) &&
    cv.skills.length > 0 &&
    cv.skills.some((s) => s.name && s.name.trim());
  const effectiveSkills = hasUserSkills ? cv.skills : sample.skills;

  // 6. Languages
  const hasUserLanguages =
    Array.isArray(cv.languages) &&
    cv.languages.length > 0 &&
    cv.languages.some(
      (l) =>
        (l.language && l.language.trim()) ||
        ((l as any).name && (l as any).name.trim())
    );
  const effectiveLanguages = hasUserLanguages ? cv.languages : sample.languages;

  // 7. Certifications
  const hasUserCertifications =
    Array.isArray(cv.certifications) &&
    cv.certifications.length > 0 &&
    cv.certifications.some(
      (c) =>
        (c.title && c.title.trim()) ||
        ((c as any).name && (c as any).name.trim())
    );
  const effectiveCertifications = hasUserCertifications
    ? cv.certifications
    : sample.certifications || [];

  // 8. Projects
  const hasUserProjects =
    Array.isArray(cv.projects) &&
    cv.projects.length > 0 &&
    cv.projects.some((p) => p.title && p.title.trim());
  const effectiveProjects = hasUserProjects
    ? cv.projects
    : sample.projects || [];

  // 9. Theme & Primary Color
  const effectiveTheme = {
    ...sample.theme,
    ...cv.theme,
    primaryColor: cv.theme?.primaryColor || templateDef.defaultColor || '#0f766e',
    showPhoto: cv.theme?.showPhoto !== undefined ? cv.theme.showPhoto : sample.theme.showPhoto,
  };

  return {
    ...sample,
    ...cv,
    templateId,
    personalInfo: effectivePersonalInfo,
    summary: effectiveSummary,
    experiences: effectiveExperiences,
    educations: effectiveEducations,
    skills: effectiveSkills,
    languages: effectiveLanguages,
    certifications: effectiveCertifications,
    projects: effectiveProjects,
    theme: effectiveTheme,
  };
}
