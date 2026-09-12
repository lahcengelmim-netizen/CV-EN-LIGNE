import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  FileCheck, 
  ShieldCheck,
  Zap,
  RefreshCw
} from 'lucide-react';
import type { ParsedResumeData, ParseCvApiResponse } from '../../types/resumeParser';

interface ResumeImportProps {
  onSuccess?: (data: ParsedResumeData) => void;
  onNavigate?: (view: string) => void;
}

export const ResumeImport: React.FC<ResumeImportProps> = ({ onSuccess, onNavigate }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<ParsedResumeData | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      validateAndUpload(file);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      validateAndUpload(file);
    }
  };

  const validateAndUpload = async (file: File) => {
    setError(null);

    // Validation PDF
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setError('Format invalide. Seuls les documents PDF (.pdf) sont acceptés pour l\'importation automatique.');
      return;
    }

    // Validation taille max (15 Mo)
    const MAX_SIZE_MB = 15;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`Le fichier est trop volumineux (${(file.size / (1024 * 1024)).toFixed(1)} Mo). La taille maximale est de ${MAX_SIZE_MB} Mo.`);
      return;
    }

    setSelectedFile(file);
    await uploadAndParse(file);
  };

  const uploadAndParse = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Téléversement sécurisé de votre CV...');

    try {
      // Étape 1 : Préparation du FormData
      const formData = new FormData();
      formData.append('file', file);

      // Simulation de progression visuelle pour une expérience utilisateur fluide
      const timer1 = setTimeout(() => {
        setLoadingStep('Lecture et analyse de la mise en page PDF...');
      }, 1200);

      const timer2 = setTimeout(() => {
        setLoadingStep('Extraction intelligente par Gemini (coordonnées, postes, diplômes, compétences)...');
      }, 2500);

      const timer3 = setTimeout(() => {
        setLoadingStep('Structuration JSON et validation des données...');
      }, 4200);

      // Appel de l'API /api/parse-cv
      const response = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      const result: ParseCvApiResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(result.error || 'Impossible d\'extraire les données du CV. Veuillez vérifier votre document ou réessayer.');
      }

      const extracted = result.data;
      setSuccessData(extracted);
      setLoadingStep('Données extraites avec succès ! Redirection...');

      // 1. Sauvegarde dans le localStorage
      try {
        localStorage.setItem('parsed_cv_data', JSON.stringify(extracted));
        localStorage.setItem('parsed_cv_timestamp', Date.now().toString());
      } catch (storageErr) {
        console.warn('Erreur lors de la sauvegarde locale:', storageErr);
      }

      // 2. Notification au parent si présent
      if (onSuccess) {
        onSuccess(extracted);
      }

      // 3. Redirection vers /editor après un court délai visuel
      setTimeout(() => {
        if (onNavigate) {
          onNavigate('editor');
        } else {
          // Fallback redirection de routage standard
          if (window.location.pathname !== '/editor') {
            try {
              window.history.pushState({}, '', '/editor');
              window.dispatchEvent(new PopStateEvent('popstate'));
            } catch {
              window.location.href = '/editor';
            }
          }
        }
      }, 1000);

    } catch (err: any) {
      console.error('Erreur import CV:', err);
      setError(err?.message || 'Une erreur inattendue est survenue lors du traitement de votre CV.');
    } finally {
      setIsLoading(false);
    }
  };

  // Chargement d'un exemple démo pour tester sans fichier
  const handleLoadDemo = () => {
    const demoData: ParsedResumeData = {
      personalInfo: {
        fullName: 'Alexandre Martin',
        email: 'alexandre.martin@example.com',
        phone: '+33 6 12 34 56 78',
        address: 'Paris, France',
        jobTitle: 'Développeur Full-Stack Senior',
        summary: 'Ingénieur logiciel avec 6 ans d\'expérience dans la conception d\'architectures web scalables (React, Node.js, TypeScript). Passionné par la performance, l\'UX et l\'intelligence artificielle.',
      },
      workExperience: [
        {
          id: 'exp_1',
          jobTitle: 'Lead Développeur Full-Stack',
          company: 'TechFlow Solutions',
          startDate: '2022',
          endDate: 'Présent',
          description: 'Direction technique d\'une équipe de 5 développeurs. Refonte de la plateforme SaaS vers Next.js et micro-services. Amélioration du temps de chargement de 45% et gestion de 500k utilisateurs actifs.',
        },
        {
          id: 'exp_2',
          jobTitle: 'Développeur Front-End & TypeScript',
          company: 'Innovate Studio',
          startDate: '2019',
          endDate: '2022',
          description: 'Développement d\'interfaces web réactives et de dashboards analytiques complexes. Intégration de bibliothèques de data-visualisation et tests unitaires avec Jest et Cypress.',
        },
      ],
      education: [
        {
          id: 'edu_1',
          degree: 'Master en Ingénierie Logicielle',
          institution: 'Université Paris-Saclay',
          startDate: '2017',
          endDate: '2019',
        },
        {
          id: 'edu_2',
          degree: 'Licence Informatique',
          institution: 'Université de Lille',
          startDate: '2014',
          endDate: '2017',
        },
      ],
      skills: ['React', 'TypeScript', 'Node.js', 'Next.js', 'PostgreSQL', 'Tailwind CSS', 'Docker', 'GraphQL', 'CI/CD'],
      languages: ['Français (Langue maternelle)', 'Anglais (Professionnel C1)', 'Espagnol (Intermédiaire B1)'],
      sourceFileName: 'Exemple_Alexandre_Martin.pdf',
    };

    localStorage.setItem('parsed_cv_data', JSON.stringify(demoData));
    if (onSuccess) {
      onSuccess(demoData);
    }
    if (onNavigate) {
      onNavigate('editor');
    } else {
      window.location.href = '/editor';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Header Banner */}
      <div className="text-center space-y-3 mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold tracking-wide shadow-2xs">
          <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          <span>Extraction Intelligente par IA Gemini</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Importez votre CV existant en PDF
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
          Téléversez votre ancien CV en PDF. Notre IA analyse et extrait instantanément toutes vos informations pour pré-remplir l'éditeur en quelques secondes.
        </p>
      </div>

      {/* Upload Zone Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 sm:p-10">
          {/* Hidden native input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
            id="pdf-upload-input"
          />

          {/* Interactive Drag & Drop Box */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer select-none ${
              isDragging
                ? 'border-blue-500 bg-blue-50/70 scale-[1.01] shadow-md'
                : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
            } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
          >
            {/* Animated Loading Overlay */}
            {isLoading ? (
              <div className="space-y-5 py-4">
                <div className="relative inline-flex items-center justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-slate-900">
                    Analyse de votre CV en cours...
                  </h3>
                  <p className="text-xs sm:text-sm font-medium text-blue-600 flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span>{loadingStep || 'Extraction des données structurées...'}</span>
                  </p>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Le modèle Gemini analyse vos postes, entreprises, dates, formations et compétences clés.
                  </p>
                </div>
              </div>
            ) : successData ? (
              /* Success State */
              <div className="space-y-4 py-3 text-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-2xs">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">
                    CV analysé avec succès !
                  </h3>
                  <p className="text-sm text-slate-600 mt-1">
                    Candidat détecté : <span className="font-semibold text-slate-800">{successData.personalInfo.fullName || 'Profil extrait'}</span>
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 pt-2">
                  <span>Redirection vers l'éditeur en cours...</span>
                  <ArrowRight className="w-4 h-4 animate-bounce-x" />
                </div>
              </div>
            ) : (
              /* Default Upload Prompt */
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-blue-600 flex items-center justify-center mx-auto shadow-2xs group-hover:scale-105 transition-transform">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div className="space-y-1.5">
                  <p className="text-base sm:text-lg font-bold text-slate-900">
                    Glissez-déposez votre CV ici
                  </p>
                  <p className="text-xs sm:text-sm text-slate-500">
                    ou cliquez pour parcourir les fichiers de votre appareil
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-98"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Choisir un fichier PDF</span>
                  </button>
                </div>

                <div className="pt-2 flex items-center justify-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <FileCheck className="w-3.5 h-3.5 text-slate-400" />
                    PDF uniquement
                  </span>
                  <span>•</span>
                  <span>Jusqu'à 15 Mo</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    Données 100% confidentielles
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Error Message Display */}
          {error && (
            <div className="mt-5 p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3 text-left animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div className="flex-1 text-xs sm:text-sm text-red-700">
                <p className="font-bold">Échec de l'importation</p>
                <p className="mt-0.5">{error}</p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="mt-2 text-xs font-bold text-red-800 underline hover:no-underline flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Essayer avec un autre fichier PDF</span>
                </button>
              </div>
            </div>
          )}

          {/* Demo Fallback Option */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Vous n'avez pas de CV sous la main ?</span>
              <p>Testez l'expérience instantanément avec un profil d'exemple complet.</p>
            </div>

            <button
              type="button"
              onClick={handleLoadDemo}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Charger un exemple de CV</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeImport;
