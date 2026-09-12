/**
 * Types definition for CV / Resume Parsing with Gemini
 */

export interface ParsedPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  jobTitle: string;
  summary: string;
}

export interface ParsedWorkExperience {
  id?: string;
  jobTitle: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface ParsedEducation {
  id?: string;
  degree: string;
  institution: string;
  startDate: string;
  endDate: string;
}

export interface ParsedResumeData {
  personalInfo: ParsedPersonalInfo;
  workExperience: ParsedWorkExperience[];
  education: ParsedEducation[];
  skills: string[];
  languages: string[];
  importedAt?: string;
  sourceFileName?: string;
}

export interface ParseCvApiResponse {
  success: boolean;
  data?: ParsedResumeData;
  error?: string;
  modelUsed?: string;
  metadata?: {
    pages?: number;
    textLength?: number;
    fileName?: string;
  };
}
