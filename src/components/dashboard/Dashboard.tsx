import React from 'react';
import { CVData, LanguageCode } from '../../types';
import { translations } from '../../lib/translations';
import { Plus, Edit, Copy, Trash2, Download, CheckCircle2, Clock, FileText, Sparkles, User, ExternalLink } from 'lucide-react';

interface DashboardProps {
  cvList: CVData[];
  onSelectCV: (cv: CVData) => void;
  onNewCV: () => void;
  onDuplicateCV: (cv: CVData) => void;
  onDeleteCV: (id: string) => void;
  lang?: LanguageCode;
  user: any;
}

export const Dashboard: React.FC<DashboardProps> = ({
  cvList,
  onSelectCV,
  onNewCV,
  onDuplicateCV,
  onDeleteCV,
  lang = 'fr',
  user
}) => {
  const t = translations[lang] || translations.fr;

  const paidCount = cvList.filter((c) => c.isPaid).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/20">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Tableau de bord utilisateur</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Bonjour, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Candidat'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Gérez vos différents CVs, modifiez-les à tout moment et téléchargez vos versions certifiées en PDF.
          </p>
        </div>

        <button
          onClick={onNewCV}
          className="relative z-10 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-xs shadow-lg hover:shadow-xl transition-all flex items-center gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{t.btnNewCv}</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase text-slate-400">Total CVs créés</div>
          <div className="text-2xl font-black text-slate-900">{cvList.length}</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase text-slate-400">CVs Débloqués en HD</div>
          <div className="text-2xl font-black text-emerald-600 flex items-center gap-2">
            <span>{paidCount}</span>
            {paidCount > 0 && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
          <div className="text-xs font-bold uppercase text-slate-400">Modifications restantes</div>
          <div className="text-2xl font-black text-blue-600">Illimitées</div>
        </div>
      </div>

      {/* CVs Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">Vos documents en cours</h2>
          <span className="text-xs text-slate-500">{cvList.length} document(s)</span>
        </div>

        {cvList.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border-2 border-dashed border-slate-200 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">Aucun CV pour l'instant</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Créez votre premier CV en 5 minutes avec l'aide de notre assistant intelligent.
              </p>
            </div>
            <button
              onClick={onNewCV}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>{t.btnNewCv}</span>
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
                      Modèle {item.templateId}
                    </span>

                    {item.isPaid ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Payé & HD
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        Brouillon
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {item.title || 'CV sans titre'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.personalInfo.firstName} {item.personalInfo.lastName} • {item.personalInfo.title || 'Candidat'}
                  </p>

                  <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-4">
                    <Clock className="w-3 h-3" />
                    <span>Mis à jour récemment</span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-white flex items-center justify-between gap-2 text-xs">
                  <button
                    onClick={() => onSelectCV(item)}
                    className="flex-1 py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>{t.btnEdit}</span>
                  </button>

                  <button
                    onClick={() => onDuplicateCV(item)}
                    className="p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
                    title={t.btnDuplicate}
                  >
                    <Copy className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteCV(item.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                    title={t.btnDelete}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
