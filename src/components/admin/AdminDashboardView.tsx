import React, { useState } from 'react';
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Award,
  ChevronRight,
  RefreshCw,
  RotateCcw,
  Radio,
  Activity,
  Edit3,
  UserCheck,
  AlertTriangle,
  History,
  CircleDot,
  Layers,
  Zap
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { AdminStats } from '../../types';
import { AdminTab } from './AdminLayout';
import { adminService } from '../../lib/adminService';

interface AdminDashboardViewProps {
  stats: AdminStats | null;
  onNavigate: (tab: AdminTab) => void;
  onRefresh?: () => void;
}

const TEMPLATE_COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({ stats, onNavigate, onRefresh }) => {
  const [activeTab, setActiveTab] = useState<'online' | 'logs'>('online');
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<string | null>(null);
  const [isManualRefreshing, setIsManualRefreshing] = useState<boolean>(false);

  const handleManualRefresh = async () => {
    setIsManualRefreshing(true);
    if (onRefresh) {
      await onRefresh();
    }
    setTimeout(() => setIsManualRefreshing(false), 500);
  };

  const handleConfirmReset = async () => {
    setIsResetting(true);
    try {
      const res = await adminService.resetStats();
      if (res.success) {
        setResetSuccess(res.message || 'Toutes les statistiques ont été réinitialisées à 0 (Baseline).');
        if (onRefresh) {
          await onRefresh();
        }
        setTimeout(() => {
          setResetSuccess(null);
          setShowResetModal(false);
        }, 1800);
      }
    } catch {
      // Ignored
    } finally {
      setIsResetting(false);
    }
  };

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium">Synchronisation des métriques en temps réel...</span>
        </div>
      </div>
    );
  }

  const liveUsers = stats.liveOnlineUsers || [];
  const liveLogs = stats.recentActivityLogs || [];
  const onlineCount = stats.onlineUsersCount ?? 0;
  const recentEdits = stats.recentEditsCount ?? 0;

  const kpis = [
    {
      id: 'kpi-online',
      title: 'En Ligne & Sessions Actives',
      value: onlineCount,
      subValue: onlineCount > 0 ? `${onlineCount} utilisateur(s) connecté(s)` : 'En attente de connexion...',
      icon: <Radio className="w-5 h-5 text-emerald-400 animate-pulse" />,
      bg: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/30',
      badge: 'LIVE',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      action: () => setActiveTab('online')
    },
    {
      id: 'kpi-users',
      title: 'Total Utilisateurs Inscrits',
      value: stats.totalUsers,
      subValue: `${stats.activeSubscriptionsCount || 0} abonnement(s) actif(s)`,
      icon: <Users className="w-5 h-5 text-blue-400" />,
      bg: 'from-blue-500/10 to-indigo-500/10 border-blue-500/20',
      badge: `${stats.newUsersToday || 0} ajd`,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      action: () => onNavigate('users')
    },
    {
      id: 'kpi-edits',
      title: 'Modifications en Direct (Edits)',
      value: recentEdits,
      subValue: recentEdits > 0 ? `${recentEdits} action(s) d'édition enregistrée(s)` : 'Baseline 0 - Aucune action',
      icon: <Edit3 className="w-5 h-5 text-purple-400" />,
      bg: 'from-purple-500/10 to-pink-500/10 border-purple-500/20',
      badge: 'TEMPS RÉEL',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      action: () => setActiveTab('logs')
    },
    {
      id: 'kpi-revenue',
      title: 'Revenus Réels Encaissés',
      value: `${(stats.totalRevenue || 0).toFixed(2)} $`,
      subValue: `${stats.totalPayments || 0} paiement(s) capturé(s)`,
      icon: <DollarSign className="w-5 h-5 text-amber-400" />,
      bg: 'from-amber-500/10 to-yellow-500/10 border-amber-500/20',
      badge: 'PAYPAL',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      action: () => onNavigate('revenue')
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner / Live Radar Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              RADAR TEMPS RÉEL ACTIF
            </span>
            <span className="text-xs text-slate-400 font-mono">
              • Auto-refresh 4s
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Tableau de Bord & Écoute en Direct
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Statistiques réinitialisées au standard baseline (0). Suivi direct des utilisateurs connectés, de leurs actions en direct et des modifications apportées.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            id="btn-manual-refresh"
            onClick={handleManualRefresh}
            disabled={isManualRefreshing}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-all border border-slate-700 flex items-center gap-2 cursor-pointer shadow-sm active:scale-95"
            title="Rafraîchir les statistiques immédiatement"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-blue-400 ${isManualRefreshing ? 'animate-spin' : ''}`} />
            <span>Actualiser</span>
          </button>

          <button
            id="btn-reset-stats-trigger"
            onClick={() => setShowResetModal(true)}
            className="px-3.5 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold rounded-xl transition-all border border-rose-500/30 flex items-center gap-2 cursor-pointer active:scale-95"
            title="Remettre tous les compteurs à 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>Réinitialiser à 0 (Baseline)</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div
            id={kpi.id}
            key={kpi.id}
            onClick={kpi.action}
            className={`p-5 rounded-2xl border bg-gradient-to-b ${kpi.bg} hover:border-slate-600 transition-all cursor-pointer group shadow-sm`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
              <div className="flex items-center gap-1.5">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${kpi.badgeColor}`}>
                  {kpi.badge}
                </span>
                <div className="p-1.5 bg-slate-900/80 rounded-lg border border-slate-800">
                  {kpi.icon}
                </div>
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              {kpi.value}
            </div>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800/60">
              <span className="text-[11px] font-medium text-slate-400 truncate max-w-[200px]">{kpi.subValue}</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
            </div>
          </div>
        ))}
      </div>

      {/* DEDICATED LIVE RADAR SECTION (Who is online & Who just made changes) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">Écoute en Direct : Activité & Utilisateurs</h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              </div>
              <p className="text-xs text-slate-400">
                Visualisez qui est actuellement connecté et les modifications appliquées en temps réel.
              </p>
            </div>
          </div>

          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="tab-btn-online"
              onClick={() => setActiveTab('online')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'online'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Connectés en direct ({onlineCount})</span>
            </button>
            <button
              id="tab-btn-logs"
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'logs'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Journal des actions ({liveLogs.length})</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Who is online right now */}
        {activeTab === 'online' && (
          <div className="space-y-3">
            {liveUsers.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                  <Radio className="w-6 h-6 text-slate-500 animate-pulse" />
                </div>
                <div className="text-sm font-semibold text-slate-300">Aucune session active détectée pour le moment</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Dès qu'un visiteur ouvre l'application, se connecte ou commence à créer un CV, sa session apparaîtra ici avec son statut en ligne et sa page en cours.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-slate-400 border-b border-slate-800">
                      <th className="pb-3 font-semibold">Utilisateur / Session</th>
                      <th className="pb-3 font-semibold">Rôle</th>
                      <th className="pb-3 font-semibold">Action en cours</th>
                      <th className="pb-3 font-semibold">Page active</th>
                      <th className="pb-3 font-semibold">Dernier signal</th>
                      <th className="pb-3 font-semibold text-right">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {liveUsers.map((user) => (
                      <tr key={user.sessionId} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-[11px]">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <div className="font-bold text-white text-xs">{user.name}</div>
                              <div className="text-[11px] text-slate-400">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            user.role === 'admin'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : user.role === 'user'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-slate-800 text-slate-300 border border-slate-700'
                          }`}>
                            {user.role === 'admin' ? 'Administrateur' : user.role === 'user' ? 'Inscrit' : 'Visiteur'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-medium text-slate-200 flex items-center gap-1.5">
                            <CircleDot className="w-3 h-3 text-emerald-400" />
                            {user.currentAction || 'Navigation active'}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="font-mono text-slate-400 text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                            {user.page || '/'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-slate-400 font-mono text-[11px]">
                          {user.lastSeen}
                        </td>
                        <td className="py-3 text-right">
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold text-[11px]">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                            En ligne
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Live Action Audit Logs */}
        {activeTab === 'logs' && (
          <div className="space-y-3">
            {liveLogs.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400">
                  <History className="w-6 h-6 text-slate-500" />
                </div>
                <div className="text-sm font-semibold text-slate-300">Aucune action enregistrée</div>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Toutes les actions (modifications de CV, connexions, paiements, requêtes IA) seront répertoriées en direct avec leur horodatage exact.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {liveLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between gap-4 text-xs hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white">{log.userName}</span>
                          <span className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold rounded-full">
                            {log.actionLabel}
                          </span>
                        </div>
                        <div className="text-slate-300 text-xs">{log.details}</div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-slate-400 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                      <div className="text-[10px] text-slate-500">
                        {new Date(log.timestamp).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Revenue & Growth Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Revenue Area Chart */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-md">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-base text-white">Revenus des 7 derniers jours</h3>
              <p className="text-xs text-slate-400">Calcul dynamique basé sur les paiements réels PayPal</p>
            </div>
            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold rounded-xl">
              {(stats.totalRevenue || 0).toFixed(2)} $ Total
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

        {/* Right: Template Distribution */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-white">Popularité des Modèles</h3>
              <button
                onClick={() => onNavigate('templates')}
                className="text-xs font-semibold text-blue-400 hover:underline cursor-pointer"
              >
                Gérer
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-4">Utilisation réelle enregistrée pour chaque modèle</p>

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

      {/* Bottom Row: AI Telemetry & Security Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: IA Stats */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
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
            Moteur de perfectionnement de contenu, reformulations d'expériences et génération de lettres de motivation.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Lettres générées :</span>
              <span className="font-bold text-white">{stats.coverLettersGenerated}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Requêtes IA réelles :</span>
              <span className="font-bold text-white">{stats.totalAIUsage}</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('ai')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Détails de télémétrie IA</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 2: Security & RLS Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Sécurité & Contrôle</h4>
            </div>
            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[10px] font-bold rounded-full">
              Sécurisé
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Sessions sécurisées chiffrées avec tokens à haute entropie et vérification des paiements PayPal côté serveur.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Super Administrateur :</span>
              <span className="font-bold text-white truncate max-w-[150px]">lahcengelmim@gmail.com</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Authentification :</span>
              <span className="font-bold text-emerald-400">Tokens Chiffrés</span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Paramètres de sécurité</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Card 3: Financial & Subscription Summary */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-white">Tarification & Offres</h4>
            </div>
            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 text-[10px] font-bold rounded-full">
              4 Formules
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Pass Flash (2.00 $), Pass Pro (3.99 $), Pass Mensuel (9.90 $) et Pass Annuel (29.90 $) avec paiements PayPal Sandbox.
          </p>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Panier Moyen :</span>
              <span className="font-bold text-amber-400">{stats.averageBasket ? `${stats.averageBasket.toFixed(2)} $` : '0.00 $'}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Paniers validés :</span>
              <span className="font-bold text-blue-400">{stats.totalPayments}</span>
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

      {/* Confirmation Modal for Baseline 0 Reset */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-white">
                  Réinitialiser les Statistiques à 0
                </h3>
                <p className="text-xs text-slate-400">Baseline standardisée</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Cette action va remettre tous les compteurs initiaux à <strong className="text-white">0</strong> (utilisateurs, sessions, téléchargements, logs IA, revenus et templates). Le radar temps réel continuera à écouter et afficher uniquement les nouvelles actions réelles.
            </p>

            {resetSuccess && (
              <div className="p-3 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={isResetting}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={isResetting}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isResetting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Confirmer la remise à 0</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
