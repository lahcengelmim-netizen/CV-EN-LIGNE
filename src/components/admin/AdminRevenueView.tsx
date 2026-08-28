import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Calendar,
  CreditCard,
  Download,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { adminService } from '../../lib/adminService';

export const AdminRevenueView: React.FC = () => {
  const [revenueData, setRevenueData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchRevenue = async () => {
    setLoading(true);
    const data = await adminService.getRevenue();
    setRevenueData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  if (loading || !revenueData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Calcul des revenus et du grand livre...</span>
        </div>
      </div>
    );
  }

  const breakdownCards = [
    {
      title: 'Total Encaissé (À vie)',
      amount: `${revenueData.totalRevenue.toFixed(2)} $`,
      detail: `${revenueData.totalSalesCount} ventes cumulées`,
      color: 'text-emerald-400',
      bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20'
    },
    {
      title: 'Revenu du Jour',
      amount: `${revenueData.dayRevenue.toFixed(2)} $`,
      detail: "Transactions d'aujourd'hui",
      color: 'text-blue-400',
      bg: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20'
    },
    {
      title: '7 Derniers Jours',
      amount: `${revenueData.weekRevenue.toFixed(2)} $`,
      detail: 'Revenu hebdomadaire glissant',
      color: 'text-purple-400',
      bg: 'from-purple-500/10 to-pink-500/10 border-purple-500/20'
    },
    {
      title: 'Mois en cours',
      amount: `${revenueData.monthRevenue.toFixed(2)} $`,
      detail: 'Total du mois calendaire',
      color: 'text-amber-400',
      bg: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-400" />
            Analyse Financière & Revenus
          </h2>
          <p className="text-xs text-slate-400">
            Rapport comptable basé strictement sur les paiements réels enregistrés en base de données
          </p>
        </div>

        <button
          onClick={fetchRevenue}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* 4 Financial Period Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {breakdownCards.map((card, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border bg-gradient-to-b ${card.bg}`}>
            <div className="text-xs font-semibold text-slate-400 mb-1">{card.title}</div>
            <div className={`text-2xl sm:text-3xl font-black ${card.color} tracking-tight`}>
              {card.amount}
            </div>
            <div className="text-[11px] text-slate-400 mt-2">{card.detail}</div>
          </div>
        ))}
      </div>

      {/* Revenue Structure Information Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <h3 className="font-bold text-base text-white mb-2">Grille Tarifaire Unifiée (USD $)</h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Le modèle économique propose 4 formules claires et transparentes : <strong>Pass Flash ($1.99)</strong>, <strong>Pass Pro ($3.99)</strong>, <strong>Monthly Pass ($7.99/mois)</strong> et <strong>Annual Pass ($39.99/an - SAVE 50%)</strong>.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Pass Flash</span>
            <div className="text-xl font-black text-white mt-1">$1.99</div>
            <p className="text-slate-400 text-[11px] mt-1">1 Téléchargement HD + ATS Check</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-blue-500/30">
            <span className="text-blue-400 font-bold uppercase text-[10px]">Pass Pro (7j)</span>
            <div className="text-xl font-black text-blue-400 mt-1">$3.99</div>
            <p className="text-slate-400 text-[11px] mt-1">Accès 7j illimité + IA ATS Check</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <span className="text-purple-400 font-bold uppercase text-[10px]">Monthly Pass</span>
            <div className="text-xl font-black text-purple-400 mt-1">$7.99 / mois</div>
            <p className="text-slate-400 text-[11px] mt-1">Illimité + Cover Letters + Support</p>
          </div>

          <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <span className="text-amber-400 font-bold uppercase text-[10px]">Annual Pass</span>
              <span className="px-1.5 py-0.5 bg-amber-500/20 text-amber-300 rounded text-[9px] font-black uppercase">
                SAVE 50%
              </span>
            </div>
            <div className="text-xl font-black text-amber-400 mt-1">$39.99 / an</div>
            <p className="text-slate-400 text-[11px] mt-1">~$3.33/mois • Accès total 1 an</p>
          </div>
        </div>
      </div>
    </div>
  );
};
