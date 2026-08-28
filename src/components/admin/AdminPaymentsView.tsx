import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
  FileCheck,
  ShieldCheck,
  Receipt
} from 'lucide-react';
import { AdminPayment } from '../../types';
import { adminService } from '../../lib/adminService';

export const AdminPaymentsView: React.FC = () => {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchPayments = async () => {
    setLoading(true);
    const data = await adminService.getPayments({
      search: searchTerm,
      status: statusFilter
    });
    if (data) {
      setPayments(data.payments);
      setSummary(data.summary);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPayments();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPayments();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-amber-400" />
            Transactions & Paiements
          </h2>
          <p className="text-xs text-slate-400">
            Historique certifié des téléchargements HD A4 facturés dès $1.99 (Vérification côté serveur)
          </p>
        </div>

        <button
          onClick={fetchPayments}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Total Encaissé</div>
            <div className="text-2xl font-black text-emerald-400">
              {summary.totalRevenue.toFixed(2)} $
            </div>
            <div className="text-[11px] text-slate-500 mt-1">
              {summary.totalSuccess} transactions réussies
            </div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Tarif Pass Flash</div>
            <div className="text-2xl font-black text-white">$1.99</div>
            <div className="text-[11px] text-slate-500 mt-1">Devise : USD ($)</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Panier Moyen</div>
            <div className="text-2xl font-black text-blue-400">
              {summary.averageBasket.toFixed(2)} $
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Téléchargement unitaire</div>
          </div>

          <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
            <div className="text-xs font-semibold text-slate-400 mb-1">Sécurité Transaction</div>
            <div className="text-2xl font-black text-purple-400 flex items-center gap-1.5">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
              100%
            </div>
            <div className="text-[11px] text-slate-500 mt-1">Audit tokenisé côté serveur</div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par Order ID, référence, nom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
          />
        </form>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:border-blue-500 focus:outline-hidden"
        >
          <option value="all">Tous les statuts de paiement</option>
          <option value="succeeded">Réussi / Encaissé</option>
          <option value="pending">En attente</option>
          <option value="failed">Échoué</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Référence / Commande</th>
                <th className="py-3.5 px-4">Client & Email</th>
                <th className="py-3.5 px-4">CV Débloqué</th>
                <th className="py-3.5 px-4">Montant</th>
                <th className="py-3.5 px-4">Statut</th>
                <th className="py-3.5 px-4">Date de transaction</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Chargement du grand livre des paiements...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Aucun paiement enregistré pour cette sélection.
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div>
                        <div className="font-mono font-bold text-white flex items-center gap-1.5">
                          <Receipt className="w-3.5 h-3.5 text-amber-400" />
                          {payment.reference}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{payment.orderId}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div>
                        <div className="font-semibold text-slate-200">{payment.userName}</div>
                        <div className="text-[11px] text-slate-400">{payment.userEmail}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="max-w-[200px] truncate text-slate-300 font-medium">
                        {payment.cvTitle}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 font-mono text-sm">
                        {payment.amount.toFixed(2)} {payment.currency}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {payment.status === 'succeeded' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Validé
                        </span>
                      ) : payment.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500/10 border border-red-500/30 text-red-400 text-[10px] font-bold rounded-full">
                          <XCircle className="w-3 h-3" />
                          Échoué
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-bold rounded-full">
                          <Clock className="w-3 h-3" />
                          En attente
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(payment.createdAt).toLocaleString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
