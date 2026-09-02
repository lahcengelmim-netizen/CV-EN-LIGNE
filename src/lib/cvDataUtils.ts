import { CVData, TemplateId } from '../types';
import { getTemplateById } from './templatesData';
import { getProfilePhoto } from './defaultAvatar';

/**
 * Returns effective CVData for live rendering and preview.
 * Ensures the preview is always complete, formatted according to the selected template,
 * and updates seamlessly in direct real-time as the user edits any field in the form.
 */
export function getEffectiveCVData(cv: CVData): CVData {
  if (!cv) return cv;

  const templateId: TemplateId = cv.templateId || 'stockholm-modern';
  const templateDef = getTemplateById(templateId);
  const sample = templateDef.sampleCV;

  // 1. Personal Info
  const userPI = cv.personalInfo || ({} as any);
  const samplePI = sample.personalInfo || ({} as any);

  // If user has entered a value (even empty string when deliberately cleared), respect it,
  // but if both firstName & lastName are empty/whitespace, provide readable placeholders so the header stays structured
  const hasUserFirstName = userPI.firstName !== undefined;
  const hasUserLastName = userPI.lastName !== undefined;

  let firstName = hasUserFirstName ? userPI.firstName : (samplePI.firstName || 'Prénom');
  let lastName = hasUserLastName ? userPI.lastName : (samplePI.lastName || 'Nom');

  // If both are empty strings (e.g. fresh empty state), show helpful placeholder names
  if (!firstName?.trim() && !lastName?.trim()) {
    firstName = samplePI.firstName || 'Prénom';
    lastName = samplePI.lastName || 'Nom';
  }

  const title = userPI.title !== undefined 
    ? userPI.title 
    : (samplePI.title || 'Titre Professionnel');

  const email = userPI.email !== undefined ? userPI.email : (samplePI.email || '');
  const phone = userPI.phone !== undefined ? userPI.phone : (samplePI.phone || '');
  const city = userPI.city !== undefined ? userPI.city : (samplePI.city || '');
  const country = userPI.country !== undefined ? userPI.country : (samplePI.country || '');
  const linkedin = userPI.linkedin !== undefined ? userPI.linkedin : (samplePI.linkedin || '');
  const website = userPI.website !== undefined ? userPI.website : (samplePI.website || '');

  // Photo: user uploaded photo takes precedence, otherwise fallback to sample / avatar placeholder
  const photoUrl = getProfilePhoto(userPI.photoUrl || samplePI.photoUrl);

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
  const effectiveSummary = cv.summary !== undefined ? cv.summary : (sample.summary || '');

  // 3. Experiences
  let effectiveExperiences: any[] = [];
  if (Array.isArray(cv.experiences)) {
    if (cv.experiences.length > 0) {
      effectiveExperiences = cv.experiences.map((exp) => ({
        ...exp,
        position: exp.position || (exp as any).jobTitle || 'Intitulé du poste',
        company: exp.company || (exp as any).employer || 'Entreprise',
        startDate: exp.startDate || '2022',
        endDate: exp.endDate || '',
        current: exp.current || false,
        description: exp.description || '',
        tasks: Array.isArray(exp.tasks) ? exp.tasks.filter((t) => t && t.trim()) : []
      }));
    } else {
      effectiveExperiences = [];
    }
  } else {
    effectiveExperiences = sample.experiences || [];
  }

  // 4. Educations
  let effectiveEducations: any[] = [];
  if (Array.isArray(cv.educations)) {
    if (cv.educations.length > 0) {
      effectiveEducations = cv.educations.map((edu) => ({
        ...edu,
        degree: edu.degree || 'Diplôme ou Formation',
        institution: edu.institution || (edu as any).school || 'Établissement',
        startDate: edu.startDate || '2020',
        endDate: edu.endDate || '2022',
        city: edu.city || '',
        description: edu.description || ''
      }));
    } else {
      effectiveEducations = [];
    }
  } else {
    effectiveEducations = sample.educations || [];
  }

  // 5. Skills
  const effectiveSkills = Array.isArray(cv.skills) ? cv.skills : (sample.skills || []);

  // 6. Languages
  const effectiveLanguages = Array.isArray(cv.languages) ? cv.languages : (sample.languages || []);

  // 7. Certifications
  const effectiveCertifications = Array.isArray(cv.certifications) ? cv.certifications : (sample.certifications || []);

  // 8. Projects
  const effectiveProjects = Array.isArray(cv.projects) ? cv.projects : (sample.projects || []);

  // 9. Theme & Primary Color
  const effectiveTheme = {
    ...sample.theme,
    ...cv.theme,
    primaryColor: cv.theme?.primaryColor || templateDef.defaultColor || '#0f766e',
    showPhoto: cv.theme?.showPhoto !== undefined ? cv.theme.showPhoto : (sample.theme?.showPhoto !== false),
    fontFamily: cv.theme?.fontFamily || sample.theme?.fontFamily || 'sans',
    spacing: cv.theme?.spacing || sample.theme?.spacing || 'normal',
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
