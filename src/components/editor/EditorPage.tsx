import React, { useState, useEffect } from 'react';
import {
  User,
  Briefcase,
  GraduationCap,
  Sparkles,
  Plus,
  Trash2,
  Save,
  ArrowLeft,
  ExternalLink,
  Wand2,
  Languages,
  CheckCircle,
  FileText,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Award,
  UploadCloud,
  Check
} from 'lucide-react';
import type { ParsedResumeData, ParsedWorkExperience, ParsedEducation } from '../../types/resumeParser';

interface EditorPageProps {
  initialData?: ParsedResumeData | null;
  onNavigate?: (view: string) => void;
  onOpenAdvancedStudio?: (data: ParsedResumeData) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({
  initialData,
  onNavigate,
  onOpenAdvancedStudio,
}) => {
  // 1. Initialisation de l'état avec les données parsées par Gemini
  const [resumeData, setResumeData] = useState<ParsedResumeData>(() => {
    if (initialData) return initialData;

    // Lecture depuis le localStorage
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('parsed_cv_data');
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (err) {
        console.error('Erreur lecture parsed_cv_data:', err);
      }
    }

    // État par défaut si aucun CV n'a été importé
    return {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        jobTitle: '',
        summary: '',
      },
      workExperience: [],
      education: [],
      skills: [],
      languages: [],
    };
  });

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [newSkill, setNewSkill] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Synchronisation si initialData change
  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
    }
  }, [initialData]);

  // Sauvegarde automatique dans le localStorage
  const handleSave = () => {
    try {
      localStorage.setItem('parsed_cv_data', JSON.stringify(resumeData));
      setSaveStatus('Modifications enregistrées !');
      setTimeout(() => setSaveStatus(null), 2500);
    } catch (e) {
      console.error('Erreur de sauvegarde:', e);
    }
  };

  // ----------------------------------------------------
  // GESTION DES COORDONNÉES PERSONNELLES
  // ----------------------------------------------------
  const handlePersonalInfoChange = (field: keyof ParsedResumeData['personalInfo'], value: string) => {
    setResumeData((prev) => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value,
      },
    }));
  };

  // ----------------------------------------------------
  // GESTION DES EXPÉRIENCES PROFESSIONNELLES
  // ----------------------------------------------------
  const handleExperienceChange = (
    index: number,
    field: keyof ParsedWorkExperience,
    value: string
  ) => {
    setResumeData((prev) => {
      const updated = [...prev.workExperience];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, workExperience: updated };
    });
  };

  const handleAddExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: [
        ...prev.workExperience,
        {
          id: 'exp_' + Math.random().toString(36).substring(2, 7),
          jobTitle: '',
          company: '',
          startDate: '',
          endDate: 'Présent',
          description: '',
        },
      ],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------------------------------
  // GESTION DES FORMATIONS & ÉDUCATION
  // ----------------------------------------------------
  const handleEducationChange = (
    index: number,
    field: keyof ParsedEducation,
    value: string
  ) => {
    setResumeData((prev) => {
      const updated = [...prev.education];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, education: updated };
    });
  };

  const handleAddEducation = () => {
    setResumeData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: 'edu_' + Math.random().toString(36).substring(2, 7),
          degree: '',
          institution: '',
          startDate: '',
          endDate: '',
        },
      ],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------------------------------
  // GESTION DES COMPÉTENCES (SKILLS)
  // ----------------------------------------------------
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (!trimmed) return;

    if (!resumeData.skills.includes(trimmed)) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, trimmed],
      }));
    }
    setNewSkill('');
  };

  const handleRemoveSkill = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // ----------------------------------------------------
  // GESTION DES LANGUES (LANGUAGES)
  // ----------------------------------------------------
  const handleAddLanguage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newLanguage.trim();
    if (!trimmed) return;

    if (!resumeData.languages.includes(trimmed)) {
      setResumeData((prev) => ({
        ...prev,
        languages: [...prev.languages, trimmed],
      }));
    }
    setNewLanguage('');
  };

  const handleRemoveLanguage = (index: number) => {
    setResumeData((prev) => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50/80 pb-20">
      {/* Top Application Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onNavigate ? onNavigate('import') : (window.location.href = '/import')}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
              title="Importer un autre CV"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Importer un autre PDF</span>
            </button>

            <div className="h-4 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                En cours de création
              </span>
              <span className="text-xs text-slate-400 hidden md:inline">
                {resumeData.sourceFileName ? `Fichier source : ${resumeData.sourceFileName}` : 'Données pré-remplies par Gemini'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher Mobile */}
            <div className="flex md:hidden bg-slate-100 p-0.5 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'edit' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Édition
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'preview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                }`}
              >
                Aperçu
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {saveStatus ? <Check className="w-4 h-4 text-emerald-600" /> : <Save className="w-4 h-4" />}
              <span>{saveStatus || 'Sauvegarder'}</span>
            </button>

            {/* Open in full studio button */}
            {onOpenAdvancedStudio && (
              <button
                onClick={() => onOpenAdvancedStudio(resumeData)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ouvrir dans le Studio Avancé</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Extraction Success Notification */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200/80 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Données du CV extraites par Gemini avec succès
              </h2>
              <p className="text-xs text-slate-600">
                Toutes les sections ci-dessous sont pré-remplies et directement éditables. Modifiez ou ajoutez vos informations selon vos besoins.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate ? onNavigate('import') : (window.location.href = '/import')}
            className="text-xs font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1 shrink-0 cursor-pointer self-end sm:self-auto"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Changer de PDF</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ==================================================== */}
          {/* LEFT COLUMN: FULL EDITABLE FORM */}
          {/* ==================================================== */}
          <div className={`space-y-8 lg:col-span-7 ${activeTab === 'preview' ? 'hidden lg:block' : 'block'}`}>
            {/* 1. INFORMATIONS PERSONNELLES */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Informations Personnelles</h2>
                  <p className="text-xs text-slate-500">Coordonnées et présentation générale</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Nom complet</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.fullName}
                    onChange={(e) => handlePersonalInfoChange('fullName', e.target.value)}
                    placeholder="Ex: Jean Dupont"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Titre professionnel / Métier visé</label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.jobTitle}
                    onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                    placeholder="Ex: Développeur Full-Stack Senior"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Adresse E-mail</span>
                  </label>
                  <input
                    type="email"
                    value={resumeData.personalInfo.email}
                    onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    placeholder="jean.dupont@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Téléphone</span>
                  </label>
                  <input
                    type="tel"
                    value={resumeData.personalInfo.phone}
                    onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    placeholder="+33 6 12 34 56 78"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Adresse / Ville / Pays</span>
                  </label>
                  <input
                    type="text"
                    value={resumeData.personalInfo.address}
                    onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                    placeholder="Paris, France"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700">Résumé professionnel (Accroche)</label>
                  <textarea
                    rows={4}
                    value={resumeData.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    placeholder="Décrivez brièvement vos points forts, réalisations et objectifs professionnels..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-y"
                  />
                </div>
              </div>
            </div>

            {/* 2. EXPÉRIENCES PROFESSIONNELLES */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Expériences Professionnelles</h2>
                    <p className="text-xs text-slate-500">{resumeData.workExperience.length} expérience(s) répertoriée(s)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un poste</span>
                </button>
              </div>

              {resumeData.workExperience.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                  <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Aucune expérience enregistrée.</p>
                  <button
                    type="button"
                    onClick={handleAddExperience}
                    className="mt-3 text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Ajouter une première expérience
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {resumeData.workExperience.map((exp, index) => (
                    <div
                      key={exp.id || index}
                      className="p-4 sm:p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Expérience #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExperience(index)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer cette expérience"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Intitulé du poste</label>
                          <input
                            type="text"
                            value={exp.jobTitle}
                            onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                            placeholder="Ex: Chef de Projet Digital"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span>Entreprise</span>
                          </label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                            placeholder="Ex: Orange, BNP Paribas, etc."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Date de début</span>
                          </label>
                          <input
                            type="text"
                            value={exp.startDate}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                            placeholder="Ex: 2021 ou Jan 2021"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>Date de fin</span>
                          </label>
                          <input
                            type="text"
                            value={exp.endDate}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            placeholder="Ex: 2023 ou Présent"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-xs font-bold text-slate-700">Description des missions et résultats</label>
                          <textarea
                            rows={3}
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                            placeholder="Détaillez vos responsabilités, technologies utilisées et résultats chiffrés..."
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-y"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. FORMATIONS ET ÉDUCATION */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Formations & Diplômes</h2>
                    <p className="text-xs text-slate-500">{resumeData.education.length} formation(s)</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une formation</span>
                </button>
              </div>

              {resumeData.education.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-2xl">
                  <GraduationCap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Aucune formation répertoriée.</p>
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="mt-3 text-xs font-bold text-emerald-600 hover:text-emerald-800"
                  >
                    + Ajouter une première formation
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {resumeData.education.map((edu, index) => (
                    <div
                      key={edu.id || index}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 relative group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Diplôme #{index + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveEducation(index)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer cette formation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Diplôme ou certification</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            placeholder="Ex: Master Informatique"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Établissement / Université</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            placeholder="Ex: Université de la Sorbonne"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Date de début</label>
                          <input
                            type="text"
                            value={edu.startDate}
                            onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                            placeholder="Ex: 2018"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-700">Date de fin</label>
                          <input
                            type="text"
                            value={edu.endDate}
                            onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                            placeholder="Ex: 2021"
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. COMPÉTENCES (SKILLS) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Compétences</h2>
                    <p className="text-xs text-slate-500">Mots-clés et technologies extraits</p>
                  </div>
                </div>
              </div>

              {/* Add skill input */}
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Ajouter une compétence (ex: React, Gestion de projet...)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Ajouter
                </button>
              </form>

              {/* Skills chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 text-xs font-semibold group shadow-2xs"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(index)}
                      className="text-purple-400 hover:text-purple-700 p-0.5 rounded cursor-pointer"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* 5. LANGUES (LANGUAGES) */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center font-bold">
                    <Languages className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">Langues</h2>
                    <p className="text-xs text-slate-500">Niveaux de maîtrise linguistique</p>
                  </div>
                </div>
              </div>

              {/* Add language input */}
              <form onSubmit={handleAddLanguage} className="flex gap-2">
                <input
                  type="text"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Ajouter une langue (ex: Anglais - C1, Espagnol...)"
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Ajouter
                </button>
              </form>

              {/* Languages chips */}
              <div className="flex flex-wrap gap-2 pt-2">
                {resumeData.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold group shadow-2xs"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLanguage(index)}
                      className="text-teal-400 hover:text-teal-700 p-0.5 rounded cursor-pointer"
                      title="Supprimer"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ==================================================== */}
          {/* RIGHT COLUMN: REAL-TIME DOCUMENT PREVIEW */}
          {/* ==================================================== */}
          <div className={`lg:col-span-5 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'} sticky top-24`}>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
              {/* Document Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Aperçu en Direct
                  </span>
                </div>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Synchronisé
                </span>
              </div>

              {/* Candidate Card Preview */}
              <div className="space-y-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                    {resumeData.personalInfo.fullName || 'Prénom & Nom'}
                  </h1>
                  <p className="text-sm font-bold text-blue-600 mt-0.5">
                    {resumeData.personalInfo.jobTitle || 'Titre du poste'}
                  </p>
                </div>

                {/* Contact row */}
                <div className="flex flex-wrap gap-y-1 gap-x-3 text-xs text-slate-500">
                  {resumeData.personalInfo.email && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-3 h-3 text-slate-400" />
                      {resumeData.personalInfo.email}
                    </span>
                  )}
                  {resumeData.personalInfo.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {resumeData.personalInfo.phone}
                    </span>
                  )}
                  {resumeData.personalInfo.address && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {resumeData.personalInfo.address}
                    </span>
                  )}
                </div>

                {/* Summary */}
                {resumeData.personalInfo.summary && (
                  <div className="pt-2">
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Profil
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                      {resumeData.personalInfo.summary}
                    </p>
                  </div>
                )}
              </div>

              {/* Experiences Preview */}
              {resumeData.workExperience.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                    Expériences ({resumeData.workExperience.length})
                  </h2>
                  <div className="space-y-3">
                    {resumeData.workExperience.map((exp, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{exp.jobTitle || 'Poste'}</span>
                          <span className="text-slate-400 font-normal">
                            {exp.startDate} - {exp.endDate}
                          </span>
                        </div>
                        <p className="text-indigo-600 font-semibold">{exp.company}</p>
                        {exp.description && (
                          <p className="text-slate-500 line-clamp-3 leading-relaxed">
                            {exp.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education Preview */}
              {resumeData.education.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                    Formations ({resumeData.education.length})
                  </h2>
                  <div className="space-y-2">
                    {resumeData.education.map((edu, i) => (
                      <div key={i} className="text-xs space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{edu.degree || 'Diplôme'}</span>
                          <span className="text-slate-400 font-normal">
                            {edu.startDate} - {edu.endDate}
                          </span>
                        </div>
                        <p className="text-slate-500">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills Preview */}
              {resumeData.skills.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                    Compétences
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.skills.map((s, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages Preview */}
              {resumeData.languages.length > 0 && (
                <div className="space-y-2 pt-2">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                    Langues
                  </h2>
                  <div className="flex flex-wrap gap-1.5">
                    {resumeData.languages.map((l, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 text-[11px] font-medium"
                      >
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorPage;
