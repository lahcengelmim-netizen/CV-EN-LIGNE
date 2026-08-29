import { COVER_LETTER_TEMPLATES, interpolateCoverLetter } from '../utils/coverLetterTemplates';

export interface CoverLetterTemplate {
  id: string;
  sector: string;
  title: string;
  icon: string;
  badge: string;
  subject: string;
  body: string;
}

export interface CoverLetterVariables {
  Nom?: string;
  Entreprise?: string;
  Poste?: string;
  'Compétence Clé'?: string;
  Ville?: string;
  Date?: string;
  Destinataire?: string;
  Téléphone?: string;
  Email?: string;
  Raison?: string;
  [key: string]: string | undefined;
}

export { COVER_LETTER_TEMPLATES, interpolateCoverLetter };
