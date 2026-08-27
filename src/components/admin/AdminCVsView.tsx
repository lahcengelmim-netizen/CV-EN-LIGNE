import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Download,
  Calendar,
  Sparkles,
  RefreshCw,
  X
} from 'lucide-react';
import { AdminCV } from '../../types';
import { adminService } from '../../lib/adminService';

export const AdminCVsView: React.FC = () => {
  const [cvs, setCvs] = useState<AdminCV[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [templateFilter, setTemplateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [previewCv, setPreviewCv] = useState<AdminCV | null>(null);

  const fetchCVs = async () => {
    setLoading(true);
    const data = await adminService.getCVs({
      search: searchTerm,
      template: templateFilter,
      status: statusFilter
    });
    setCvs(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchCVs();
  }, [templateFilter, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCVs();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            Gestion des Curriculum Vitae
          </h2>
          <p className="text-xs text-slate-400">
            Tous les CVs générés, statut de paiement HD (2,00 $) et modèle utilisé
          </p>
        </div>

        <button
          onClick={fetchCVs}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par titre de CV, candidat ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-3">
          <select
            value={templateFilter}
            onChange={(e) => setTemplateFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="all">Tous les templates</option>
            <option value="modern">Moderne (2 Colonnes)</option>
            <option value="classic">Classique</option>
            <option value="minimal">Minimaliste</option>
            <option value="professional">Corporate</option>
            <option value="creative">Créatif</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="all">Tous les statuts</option>
            <option value="paid">Payé & Débloqué</option>
            <option value="draft">Brouillon / En cours</option>
          </select>
        </div>
      </div>

      {/* CVs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Titre du CV</th>
                <th className="py-3.5 px-4">Candidat</th>
                <th className="py-3.5 px-4">Modèle Choisi</th>
                <th className="py-3.5 px-4">Statut HD (2 $)</th>
                <th className="py-3.5 px-4">Date de mise à jour</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Chargement des CVs...</span>
                    </div>
                  </td>
                </tr>
              ) : cvs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Aucun CV trouvé avec ces critères de recherche.
                  </td>
                </tr>
              ) : (
                cvs.map((cv) => (
                  <tr key={cv.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-semibold text-white">{cv.title}</div>
                          <div className="text-[10px] font-mono text-slate-500">{cv.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-medium text-slate-200">{cv.userName}</div>
                        <div className="text-[11px] text-slate-400">{cv.userEmail}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-slate-300 font-medium capitalize text-[11px]">
                        {cv.templateId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {cv.isPaid ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Payé HD (2 $)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full">
                          <Clock className="w-3 h-3" />
                          Brouillon
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(cv.updatedAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setPreviewCv(cv)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspecter</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CV Quick View Modal */}
      {previewCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Fiche Détail du CV</h3>
              </div>
              <button
                onClick={() => setPreviewCv(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <div className="text-slate-400">Titre :</div>
                <div className="text-sm font-bold text-white">{previewCv.title}</div>
                <div className="text-slate-400 pt-2">Candidat :</div>
                <div className="text-slate-200 font-semibold">{previewCv.userName} ({previewCv.userEmail})</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Modèle</span>
                  <p className="font-bold text-slate-200 capitalize">{previewCv.templateId}</p>
                </div>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Statut Paiement</span>
                  <p className={`font-bold ${previewCv.isPaid ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {previewCv.isPaid ? 'Payé ($2.00)' : 'Non payé'}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-slate-400">
                <div>Créé le : {new Date(previewCv.createdAt).toLocaleString('fr-FR')}</div>
                <div>Mis à jour le : {new Date(previewCv.updatedAt).toLocaleString('fr-FR')}</div>
                {previewCv.paidAt && (
                  <div className="text-emerald-400 font-medium">Paiement validé le : {new Date(previewCv.paidAt).toLocaleString('fr-FR')}</div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setPreviewCv(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
