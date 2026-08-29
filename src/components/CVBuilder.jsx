import React, { useState } from 'react';
import { CVPreview, DEFAULT_CV } from './CVPreview';
import { CoverLetterBuilder } from './CoverLetterBuilder';
import { exportCVToPDF } from '../lib/pdf';
import { FileText, Sparkles } from 'lucide-react';

/**
 * CVBuilder.jsx - ÉDITEUR DE CV COMPLET AVEC APERÇU A4 EN TEMPS RÉEL
 * Intègre la synchronisation bidirectionnelle, la fusion des données par défaut,
 * le composant de rendu unique partagé et le générateur de Lettres de Motivation par Modèles Statiques.
 */
export const CVBuilder = ({
  initialData = {},
  themeColor: initialThemeColor = '#1e3a8a',
  lang = 'fr',
  t = (key, fallback) => fallback || key,
}) => {
  // Données éditables du formulaire
  const [formData, setFormData] = useState({
    fullName: initialData.fullName || '',
    jobTitle: initialData.jobTitle || '',
    email: initialData.email || '',
    phone: initialData.phone || '',
    city: initialData.city || '',
    linkedin: initialData.linkedin || '',
    summary: initialData.summary || '',
    experiences: initialData.experiences || [],
    education: initialData.education || [],
    skills: initialData.skills || [],
    languages: initialData.languages || [],
  });

  const [themeColor, setThemeColor] = useState(initialThemeColor);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal'); // 'personal' | 'experience' | 'education' | 'skills' | 'languages'
  const [showCoverLetter, setShowCoverLetter] = useState(false);

  // Gestion de l'export PDF haute résolution
  const handleDownloadPdf = async () => {
    try {
      setIsDownloading(true);
      const name = formData.fullName?.trim() || DEFAULT_CV.fullName;
      const fileName = `CV_${name.replace(/\s+/g, '_')}.pdf`;

      const success = await exportCVToPDF({
        fileName,
        elementId: 'cv-printable-document',
      });

      if (!success) {
        window.print();
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement du PDF:', error);
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  // Ajout d'une expérience
  const handleAddExperience = () => {
    setFormData((prev) => ({
      ...prev,
      experiences: [
        ...prev.experiences,
        {
          id: `exp-${Date.now()}`,
          title: '',
          company: '',
          period: '',
          city: '',
          desc: '',
          tasks: [],
        },
      ],
    }));
  };

  // Mise à jour d'une expérience
  const handleUpdateExperience = (index, field, value) => {
    setFormData((prev) => {
      const list = [...prev.experiences];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, experiences: list };
    });
  };

  // Suppression d'une expérience
  const handleRemoveExperience = (index) => {
    setFormData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // Ajout d'une formation
  const handleAddEducation = () => {
    setFormData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: `edu-${Date.now()}`,
          degree: '',
          school: '',
          period: '',
          city: '',
          desc: '',
        },
      ],
    }));
  };

  // Mise à jour d'une formation
  const handleUpdateEducation = (index, field, value) => {
    setFormData((prev) => {
      const list = [...prev.education];
      list[index] = { ...list[index], [field]: value };
      return { ...prev, education: list };
    });
  };

  // Suppression d'une formation
  const handleRemoveEducation = (index) => {
    setFormData((prev) => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* =========================================================================
            COLONNE GAUCHE : FORMULAIRE D'ÉDITION MODULAIRE
            ========================================================================= */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
          {/* Navigation des onglets d'édition */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('personal')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'personal'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                👤 {t('form.personalInfo', 'Identité & Contact')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('experience')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'experience'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                💼 {t('sections.experience', 'Expériences')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('education')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'education'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                🎓 {t('sections.education', 'Formations')}
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('skills')}
                className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-colors cursor-pointer ${
                  activeTab === 'skills'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                ⚡ {t('sections.skills', 'Compétences & Langues')}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setShowCoverLetter(true)}
              className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Créer une lettre de motivation assortie"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Lettre de motivation</span>
            </button>
          </div>

          {/* Onglet 1 : Informations personnelles */}
          {activeTab === 'personal' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('form.fullNameLabel', 'Nom complet')}
                </label>
                <input
                  type="text"
                  placeholder={DEFAULT_CV.fullName}
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('form.jobTitleLabel', 'Poste recherché / Titre')}
                </label>
                <input
                  type="text"
                  placeholder={DEFAULT_CV.jobTitle}
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('form.emailLabel', 'Email')}
                  </label>
                  <input
                    type="email"
                    placeholder={DEFAULT_CV.email}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('form.phoneLabel', 'Téléphone')}
                  </label>
                  <input
                    type="text"
                    placeholder={DEFAULT_CV.phone}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('form.cityLabel', 'Ville & Pays')}
                  </label>
                  <input
                    type="text"
                    placeholder={DEFAULT_CV.city}
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {t('form.linkedinLabel', 'Lien LinkedIn / Web')}
                  </label>
                  <input
                    type="text"
                    placeholder={DEFAULT_CV.linkedin}
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('form.summaryLabel', 'Profil / Résumé professionnel')}
                </label>
                <textarea
                  rows={4}
                  placeholder={DEFAULT_CV.summary}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* Onglet 2 : Expériences professionnelles */}
          {activeTab === 'experience' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">
                  Vos expériences ({formData.experiences.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  + Ajouter une expérience
                </button>
              </div>

              {formData.experiences.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  Aucune expérience saisie : le modèle standard d'exemple est affiché en direct.
                  Cliquez sur "Ajouter une expérience" pour personnaliser cette section.
                </div>
              ) : (
                formData.experiences.map((exp, index) => (
                  <div key={exp.id || index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Poste #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Intitulé du poste"
                        value={exp.title || ''}
                        onChange={(e) => handleUpdateExperience(index, 'title', e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Entreprise"
                        value={exp.company || ''}
                        onChange={(e) => handleUpdateExperience(index, 'company', e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Période (ex: 2021 - Présent)"
                        value={exp.period || ''}
                        onChange={(e) => handleUpdateExperience(index, 'period', e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Ville"
                        value={exp.city || ''}
                        onChange={(e) => handleUpdateExperience(index, 'city', e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Description des missions..."
                      value={exp.desc || ''}
                      onChange={(e) => handleUpdateExperience(index, 'desc', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Onglet 3 : Formations & Diplômes */}
          {activeTab === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-700">
                  Vos formations ({formData.education.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  + Ajouter une formation
                </button>
              </div>

              {formData.education.length === 0 ? (
                <div className="p-4 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-xs text-slate-500">
                  Aucune formation saisie : les diplômes d'exemple sont affichés en direct.
                </div>
              ) : (
                formData.education.map((edu, index) => (
                  <div key={edu.id || index} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-800">Formation #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold cursor-pointer"
                      >
                        Supprimer
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Diplôme obtenu"
                        value={edu.degree || ''}
                        onChange={(e) => handleUpdateEducation(index, 'degree', e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                      <input
                        type="text"
                        placeholder="Établissement / Université"
                        value={edu.school || ''}
                        onChange={(e) => handleUpdateEducation(index, 'school', e.target.value)}
                        className="px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Période (ex: 2016 - 2018)"
                      value={edu.period || ''}
                      onChange={(e) => handleUpdateEducation(index, 'period', e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white"
                    />
                  </div>
                ))
              )}
            </div>
          )}

          {/* Onglet 4 : Compétences & Langues */}
          {activeTab === 'skills' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Compétences (séparées par une virgule)
                </label>
                <input
                  type="text"
                  placeholder="Gestion de projet, Agile/Scrum, React, UI/UX Design..."
                  value={Array.isArray(formData.skills) ? formData.skills.join(', ') : ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      skills: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Langues (séparées par une virgule, ex: Français (Natif), Anglais (Courant))
                </label>
                <input
                  type="text"
                  placeholder="Français (Natif), Anglais (Courant)..."
                  value={
                    Array.isArray(formData.languages)
                      ? formData.languages
                          .map((l) => (typeof l === 'string' ? l : `${l.language || l.name} (${l.level || ''})`))
                          .join(', ')
                      : ''
                  }
                  onChange={(e) => {
                    const rawList = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
                    const parsed = rawList.map((item) => {
                      const match = item.match(/^(.*?)\s*\((.*?)\)$/);
                      if (match) {
                        return { language: match[1].trim(), level: match[2].trim() };
                      }
                      return { language: item, level: '' };
                    });
                    setFormData({ ...formData, languages: parsed });
                  }}
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            COLONNE DROITE : APERÇU A4 EN TEMPS RÉEL (CVPreview)
            ========================================================================= */}
        <div className="lg:col-span-6 sticky top-20">
          <CVPreview
            formData={formData}
            themeColor={themeColor}
            onColorChange={setThemeColor}
            onDownloadPdf={handleDownloadPdf}
            isDownloading={isDownloading}
            t={t}
          />
        </div>
      </div>

      {/* Modal Générateur de Lettre de Motivation Statique */}
      {showCoverLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-50 rounded-2xl max-w-6xl w-full h-[92vh] max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative">
            <button
              onClick={() => setShowCoverLetter(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full transition-colors cursor-pointer shadow-md"
              title="Fermer"
            >
              ✕
            </button>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <CoverLetterBuilder
                initialCandidate={{
                  fullName: formData.fullName || DEFAULT_CV.fullName,
                  jobTitle: formData.jobTitle || DEFAULT_CV.jobTitle,
                  email: formData.email || DEFAULT_CV.email,
                  phone: formData.phone || DEFAULT_CV.phone,
                  city: formData.city || DEFAULT_CV.city,
                }}
                onClose={() => setShowCoverLetter(false)}
                lang={lang}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CVBuilder;
