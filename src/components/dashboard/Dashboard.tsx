import React, { useState, useEffect } from 'react';
import { CVData, LanguageCode } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { ENABLE_PAYMENTS } from '../../config/features';
import { CoverLetterStudio } from '../cover-letter/CoverLetterStudio';
import { Plus, Edit, Copy, Trash2, CheckCircle2, Clock, FileText, Sparkles, UploadCloud } from 'lucide-react';

interface DashboardProps {
  cvList: CVData[];
  onSelectCV: (cv: CVData) => void;
  onNewCV: () => void;
  onImportCV?: () => void;
  onDuplicateCV: (cv: CVData) => void;
  onDeleteCV: (id: string) => void;
  lang?: LanguageCode;
  user: any;
  initialTab?: 'cvs' | 'cover-letters';
  onTabChange?: (tab: 'cvs' | 'cover-letters') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cvList,
  onSelectCV,
  onNewCV,
  onImportCV,
  onDuplicateCV,
  onDeleteCV,
  user,
  initialTab = 'cvs',
  onTabChange
}) => {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'cvs' | 'cover-letters'>(initialTab);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabClick = (tab: 'cvs' | 'cover-letters') => {
    setActiveTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  const paidCount = cvList.filter((c) => c.isPaid).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Primary Navigation Menu Tabs */}
      <div className="flex items-center gap-2 sm:gap-3 border-b border-slate-200/80 pb-4 overflow-x-auto no-scrollbar">
        <button
          onClick={() => handleTabClick('cvs')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
            activeTab === 'cvs'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{t('dashboard.myCvsTab', 'Mes CV')}</span>
          <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
            activeTab === 'cvs' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
          }`}>
            {cvList.length}
          </span>
        </button>

        <button
          onClick={() => handleTabClick('cover-letters')}
          className={`px-5 py-3 rounded-2xl font-extrabold text-xs sm:text-sm transition-all flex items-center gap-2.5 shrink-0 cursor-pointer ${
            activeTab === 'cover-letters'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20 ring-2 ring-purple-600/30'
              : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 shadow-2xs'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-300" />
          <span>{t('dashboard.coverLettersTab', 'Lettre de Motivation')}</span>
          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            activeTab === 'cover-letters' ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700'
          }`}>
            {t('dashboard.independentAi', 'Indépendant & IA')}
          </span>
        </button>
      </div>

      {activeTab === 'cover-letters' ? (
        <CoverLetterStudio
          user={user}
          cvList={cvList}
          lang={language}
          onSelectCV={onSelectCV}
        />
      ) : (
        <>
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>{t('dashboard.welcome', 'Tableau de bord utilisateur')}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
                {t('dashboard.hello', 'Bonjour')}, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || t('dashboard.candidate', 'Candidat')}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                {t('dashboard.subtitle', 'Gérez vos différents CVs, modifiez-les à tout moment et téléchargez vos versions certifiées en PDF.')}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 relative z-10">
              {onImportCV && (
                <button
                  onClick={onImportCV}
                  className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-xs border border-white/20 shadow-xs transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <UploadCloud className="w-4 h-4 text-blue-300" />
                  <span>Importer un CV (PDF)</span>
                </button>
              )}
              <button
                onClick={onNewCV}
                className="px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>{t('nav.newCv', 'Nouveau CV')}</span>
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs font-bold uppercase text-slate-400">
                {t('dashboard.totalCvs', 'Total CVs créés')}
              </div>
              <div className="text-2xl font-black text-slate-900">{cvList.length}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs font-bold uppercase text-slate-400">
                {t('dashboard.paidCvs', 'CVs Débloqués en HD')}
              </div>
              <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
                <span>{!ENABLE_PAYMENTS ? cvList.length : paidCount}</span>
                {(!ENABLE_PAYMENTS ? cvList.length > 0 : paidCount > 0) && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
              <div className="text-xs font-bold uppercase text-slate-400">
                {t('dashboard.remainingEdits', 'Modifications restantes')}
              </div>
              <div className="text-2xl font-black text-blue-600">
                {t('dashboard.unlimitedEdits', 'Illimitées')}
              </div>
            </div>
          </div>

          {/* CVs Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">
                {t('dashboard.currentDocs', 'Vos documents en cours')}
              </h2>
              <span className="text-xs text-slate-500">
                {cvList.length} {t('dashboard.docCount', 'document(s)')}
              </span>
            </div>

            {cvList.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    {t('dashboard.emptyTitle', 'Aucun CV pour l\'instant')}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                    {t('dashboard.emptyDesc', 'Créez votre premier CV en 5 minutes avec l\'aide de notre assistant intelligent.')}
                  </p>
                </div>
                <button
                  onClick={onNewCV}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('nav.newCv', 'Nouveau CV')}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cvList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {/* Card Top Preview Bar */}
                    <div 
                      className="p-6 border-b border-slate-100 bg-slate-50/50 cursor-pointer"
                      onClick={() => onSelectCV(item)}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800">
                          {t('builder.templateActive', 'Modèle :')} {item.templateId}
                        </span>

                        {(!ENABLE_PAYMENTS || item.isPaid) ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {!ENABLE_PAYMENTS ? t('dashboard.readyHdFree', 'Prêt & HD (Gratuit)') : t('dashboard.paidStatus', 'Payé & HD')}
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                            {t('dashboard.draftStatus', 'Brouillon')}
                          </span>
                        )}
                      </div>

                      <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                        {item.title || t('dashboard.untitledCv', 'CV sans titre')}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {item.personalInfo.firstName} {item.personalInfo.lastName} • {item.personalInfo.title || t('dashboard.candidate', 'Candidat')}
                      </p>

                      <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-4">
                        <Clock className="w-3 h-3" />
                        <span>{t('dashboard.recentUpdate', 'Mis à jour récemment')}</span>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-4 bg-white flex items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => onSelectCV(item)}
                        className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>{t('common.edit', 'Modifier')}</span>
                      </button>

                      <button
                        onClick={() => onDuplicateCV(item)}
                        className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                        title={t('dashboard.duplicate', 'Dupliquer')}
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => onDeleteCV(item.id)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                        title={t('common.delete', 'Supprimer')}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
