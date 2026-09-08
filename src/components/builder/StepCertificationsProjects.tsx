import React from 'react';
import { Certification, Project, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { Award, FolderGit2, Plus, Trash2 } from 'lucide-react';

interface Props {
  certifications: Certification[];
  projects: Project[];
  onCertificationsChange: (certs: Certification[]) => void;
  onProjectsChange: (projs: Project[]) => void;
  lang?: LanguageCode;
}

export const StepCertificationsProjects: React.FC<Props> = ({
  certifications = [],
  projects = [],
  onCertificationsChange,
  onProjectsChange,
}) => {
  const { t } = useLanguage();

  // Certifications
  const handleAddCert = () => {
    const newCert: Certification = {
      id: 'cert_' + Math.random().toString(36).substring(2, 9),
      title: '',
      organization: '',
      date: '',
    };
    onCertificationsChange([...certifications, newCert]);
  };

  const handleRemoveCert = (id: string) => {
    onCertificationsChange(certifications.filter((c) => c.id !== id));
  };

  const handleUpdateCert = (id: string, updated: Partial<Certification>) => {
    onCertificationsChange(certifications.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  // Projects
  const handleAddProject = () => {
    const newProj: Project = {
      id: 'proj_' + Math.random().toString(36).substring(2, 9),
      title: '',
      description: '',
      link: '',
    };
    onProjectsChange([...projects, newProj]);
  };

  const handleRemoveProject = (id: string) => {
    onProjectsChange(projects.filter((p) => p.id !== id));
  };

  const handleUpdateProject = (id: string, updated: Partial<Project>) => {
    onProjectsChange(projects.map((p) => (p.id === id ? { ...p, ...updated } : p)));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          {t('form.certifications.title', '7. Certifications & Projets (Optionnel)')}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          {t('form.certifications.subtitle', 'Apportez de la valeur ajoutée à votre profil avec vos diplômes complémentaires et réalisations clés.')}
        </p>
      </div>

      {/* Certifications Block */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <Award className="w-4 h-4 text-blue-600" />
            <span>{t('form.certifications.certTitle', 'Certifications & Permis')}</span>
          </div>
          <button
            type="button"
            onClick={handleAddCert}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('form.certifications.addCert', 'Ajouter une certification')}</span>
          </button>
        </div>

        {certifications.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
            {t('form.certifications.emptyCert', 'Aucune certification renseignée (ex: Scrum Master, TOEIC, AWS, Permis B...).')}
          </div>
        ) : (
          <div className="space-y-3">
            {certifications.map((c) => (
              <div key={c.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="text"
                  value={c.title}
                  onChange={(e) => handleUpdateCert(c.id, { title: e.target.value })}
                  placeholder={t('form.certifications.certName', 'Intitulé (ex : AWS Certified, Permis B...)')}
                  className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={c.organization}
                  onChange={(e) => handleUpdateCert(c.id, { organization: e.target.value })}
                  placeholder={t('form.certifications.certIssuer', 'Organisme (ex : Amazon, Google...)')}
                  className="w-full sm:w-48 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <input
                  type="text"
                  value={c.date}
                  onChange={(e) => handleUpdateCert(c.id, { date: e.target.value })}
                  placeholder={t('form.certifications.certDate', 'Année (ex : 2023)')}
                  className="w-full sm:w-28 p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveCert(c.id)}
                  className="p-1.5 text-slate-400 hover:text-red-500 rounded-md cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Projects Block */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
            <FolderGit2 className="w-4 h-4 text-purple-600" />
            <span>{t('form.certifications.projTitle', 'Projets notables & Réalisations')}</span>
          </div>
          <button
            type="button"
            onClick={handleAddProject}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('form.certifications.addProj', 'Ajouter un projet')}</span>
          </button>
        </div>

        {projects.length === 0 ? (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
            {t('form.certifications.emptyProj', 'Aucun projet renseigné (ex: refonte de site web, organisation d\'événement, application mobile...).')}
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <div key={p.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 relative">
                <div className="flex items-center justify-between">
                  <input
                    type="text"
                    value={p.title}
                    onChange={(e) => handleUpdateProject(p.id, { title: e.target.value })}
                    placeholder={t('form.certifications.projName', 'Nom du projet')}
                    className="w-full sm:w-1/2 p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(p.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 rounded-md ml-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={p.description}
                  onChange={(e) => handleUpdateProject(p.id, { description: e.target.value })}
                  placeholder={t('form.certifications.projDesc', 'Description brève des résultats ou technologies utilisées...')}
                  className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
