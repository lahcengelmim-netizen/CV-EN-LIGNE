import React from 'react';
import {
  Users,
  FileText,
  CreditCard,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  DollarSign,
  Layers,
  Award,
  ChevronRight
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
  CartesianGrid,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AdminStats } from '../../types';
import { AdminTab } from './AdminLayout';

interface AdminDashboardViewProps {
  stats: AdminStats | null;
  onNavigate: (tab: AdminTab) => void;
}

const TEMPLATE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ stats, onNavigate }) => {
  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Chargement des données en temps réel...</span>
        </div>
      </div>
    );
  }

  const kpis = [
    {
      title: 'Total Utilisateurs',
      value: stats.totalUsers,
      subValue: `${stats.activeSubscriptionsCount || 0} abonnements actifs`,
      icon: <Users className="w-5 h-5 text-blue-400" />,
      bg: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
      action: () => onNavigate('users')
    },
    {
      title: 'Total CVs Créés',
      value: stats.totalCVs,
      subValue: `+${stats.cvsToday} aujourd'hui`,
      icon: <FileText className="w-5 h-5 text-emerald-400" />,
      bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20',
      action: () => onNavigate('cvs')
    },
    {
      title: 'Revenus Encaissés',
      value: `${stats.totalRevenue.toFixed(2)} $`,
      subValue: `${stats.totalPayments} transactions validées`,
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      bg: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20',
      action: () => onNavigate('revenue')
    },
    {
      title: 'Abonnés Actifs',
      value: stats.activeSubscriptionsCount || 0,
      subValue: `${stats.monthlySubscribersCount || 0} mensuels • ${stats.yearlySubscribersCount || 0} annuels`,
      icon: <Award className="w-5 h-5 text-purple-400" />,
      bg: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
      action: () => onNavigate('users')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900 border border-blue-500/30 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold rounded-full">
              ADMIN DASHBOARD v2.0
            </span>
            <span className="text-xs text-slate-400">• Données Supabase & Serveur synchronisées</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Vue d'ensemble de la plateforme
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Suivi en temps réel des utilisateurs, des téléchargements de CV rémunérés (2,00 $), des requêtes IA et de la performance des modèles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('payments')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            <span>Voir les paiements</span>
          </button>
          <button
            onClick={() => onNavigate('messages')}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700 flex items-center gap-2"
          >
            <Clock className="w-4 h-4" />
            <span>Support client</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <div
            key={index}
            onClick={kpi.action}
            className={`p-5 rounded-2xl border bg-gradient-to-b ${kpi.bg} hover:border-slate-600 transition-all cursor-pointer group`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
              <div className="p-2 bg-slate-900/80 rounded-xl border border-slate-800">
                {kpi.icon}
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-medium text-slate-400">{kpi.subValue}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* Revenue & Growth Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Area Chart (Col 7) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-white">Revenus des 7 derniers jours</h3>
              <p className="text-xs text-slate-400">Total ventes de téléchargements HD A4 à 2,00 $</p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl">
              {stats.totalRevenue.toFixed(2)} $ Total
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dailyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                  labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  name="Revenu ($)"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Template Distribution (Col 5) */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white">Popularité des Modèles</h3>
              <button
                onClick={() => onNavigate('templates')}
                className="text-xs font-semibold text-blue-400 hover:underline"
              >
                Gérer
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Répartition des choix de template par les utilisateurs</p>

            <div className="space-y-3">
              {stats.mostUsedTemplates.map((item, idx) => (
                <div key={item.templateId} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200">{item.name}</span>
                    <span className="text-slate-400 font-mono">{item.count} CVs ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: TEMPLATE_COLORS[idx % TEMPLATE_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>5 Modèles Professionnels ATS Actifs</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              100% Fonctionnels
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Row: AI Telemetry & Quick Management Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: IA Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-purple-500/20 text-purple-400 rounded-xl">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">IA Gemini 3.7 Flash</h4>
            </div>
            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-full">
              Actif
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Moteur d'amélioration d'expérience, reformulation d'accroches, suggestions de compétences et lettres de motivation.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Lettres de motivation (max 2/user) :</span>
              <span className="font-bold text-white">{stats.coverLettersGenerated}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Appels IA aujourd'hui :</span>
              <span className="font-bold text-white">{stats.aiUsageToday}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Détails de télémétrie IA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Security & RLS Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Sécurité & RLS</h4>
            </div>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full">
              Sécurisé
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Politiques RLS Supabase actives et vérification des paiements côté serveur. Aucune validation vulnérable côté frontend.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Super Administrateur :</span>
              <span className="font-bold text-white">lahcengelmim@gmail.com</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Contrôle d'accès :</span>
              <span className="font-bold text-emerald-400">Rôle Admin Requis</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Paramètres de sécurité</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Financial & Subscription Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Offres & Abonnements</h4>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full">
              3 Formules
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            1 CV (2,00 $), Pass Mensuel (9,90 $) et Pass Annuel (29,90 $ - Meilleure Offre) avec téléchargements HD illimités.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Revenu Pass Annuel :</span>
              <span className="font-bold text-amber-400">{stats.revenueYearly ? `${stats.revenueYearly.toFixed(2)} $` : '0.00 $'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Revenu Pass Mensuel :</span>
              <span className="font-bold text-blue-400">{stats.revenueMonthly ? `${stats.revenueMonthly.toFixed(2)} $` : '0.00 $'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Revenu 1 CV Unique :</span>
              <span className="font-bold text-slate-200">{stats.revenueSingleCv ? `${stats.revenueSingleCv.toFixed(2)} $` : '0.00 $'}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('revenue')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Rapports financiers détaillés</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
