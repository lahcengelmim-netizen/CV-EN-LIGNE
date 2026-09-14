import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, 
  Activity, 
  ShieldCheck, 
  Lock, 
  Sparkles, 
  RefreshCw, 
  User, 
  FileText, 
  UploadCloud, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Play, 
  Pause, 
  Trash2, 
  ExternalLink,
  Users,
  Eye,
  Sliders,
  Layers
} from 'lucide-react';
import { realtimeAdminService, RealtimeEventData } from '../../lib/realtimeAdminService';
import { adminService } from '../../lib/adminService';
import { AdminPortal } from './AdminPortal';
import { ADMIN_SECRET_ROUTE } from '../../config/adminConfig';

interface IsolatedAdminDashboardProps {
  onLogout: () => void;
  adminEmail?: string;
}

export const IsolatedAdminDashboard: React.FC<IsolatedAdminDashboardProps> = ({
  onLogout,
  adminEmail,
}) => {
  const [events, setEvents] = useState<RealtimeEventData[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connecting');
  const [latency, setLatency] = useState<number>(12);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [showExtendedPortal, setShowExtendedPortal] = useState<boolean>(false);
  const [stats, setStats] = useState<any>(null);
  const tableBottomRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time events stream
  useEffect(() => {
    realtimeAdminService.connect();

    const unsubscribeEvents = realtimeAdminService.subscribe((newEvent) => {
      setEvents((prev) => [newEvent, ...prev].slice(0, 150));
    });

    const unsubscribeStatus = realtimeAdminService.onStatusChange((status, ping) => {
      setConnectionStatus(status);
      if (ping) setLatency(ping);
    });

    // Initial load of server stats
    adminService.getStats().then((data) => {
      if (data) setStats(data);
    });

    return () => {
      unsubscribeEvents();
      unsubscribeStatus();
      realtimeAdminService.disconnect();
    };
  }, []);

  const handleTogglePause = () => {
    const next = !isPaused;
    setIsPaused(next);
    realtimeAdminService.setPaused(next);
  };

  const handleClearLogs = () => {
    setEvents([]);
  };

  const handleSimulate = async (type: string = 'user_register') => {
    setIsSimulating(true);
    await realtimeAdminService.simulateRealtimeEvent(type);
    setTimeout(() => setIsSimulating(false), 500);
  };

  // Filtered event list
  const filteredEvents = events.filter((evt) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'auth') return evt.type === 'user_register' || evt.type === 'user_login';
    if (activeFilter === 'cv') return evt.type === 'cv_create' || evt.type === 'cv_edit' || evt.type === 'cv_download';
    if (activeFilter === 'pdf') return evt.type === 'pdf_import';
    if (activeFilter === 'payments') return evt.type === 'payment';
    return true;
  });

  const getEventBadge = (type: string) => {
    switch (type) {
      case 'user_register':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-3 h-3" />
            <span>Inscription Utilisateur</span>
          </span>
        );
      case 'user_login':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <User className="w-3 h-3" />
            <span>Connexion Active</span>
          </span>
        );
      case 'cv_create':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <FileText className="w-3 h-3" />
            <span>Création CV</span>
          </span>
        );
      case 'cv_edit':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
            <Sparkles className="w-3 h-3" />
            <span>Modification CV</span>
          </span>
        );
      case 'pdf_import':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <UploadCloud className="w-3 h-3" />
            <span>Importation PDF IA</span>
          </span>
        );
      case 'payment':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <CreditCard className="w-3 h-3" />
            <span>Transaction Paiement</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-slate-700/50 text-slate-300 border border-slate-600/30">
            <Activity className="w-3 h-3" />
            <span>Événement Système</span>
          </span>
        );
    }
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  // If user switches to full administrative portal tabs
  if (showExtendedPortal) {
    return (
      <div className="relative">
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Mode Tableau de Bord Étendu</span>
          </div>
          <button
            onClick={() => setShowExtendedPortal(false)}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded font-medium transition-colors cursor-pointer"
          >
            ← Revenir au flux temps réel
          </button>
        </div>
        <AdminPortal
          onBackToSite={onLogout}
          currentUser={{ email: adminEmail || 'admin@cvenligne.internal' }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* 1. Dedicated Command Center Header */}
      <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Node Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 border border-blue-400/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100 tracking-wide uppercase">
                  Control Panel X-97
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  OBFUSCATED NODE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {ADMIN_SECRET_ROUTE} &bull; RBAC Protected
              </p>
            </div>
          </div>

          {/* Real-time Status Badge & Latency */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
              <span 
                className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' 
                    ? 'bg-emerald-400 animate-ping' 
                    : connectionStatus === 'connecting' 
                    ? 'bg-amber-400 animate-pulse' 
                    : 'bg-rose-500'
                }`} 
              />
              <span className="font-medium capitalize text-slate-300">
                {connectionStatus === 'connected' ? 'SSE Flux Direct' : connectionStatus}
              </span>
              <span className="text-slate-500">|</span>
              <span className="font-mono text-emerald-400 text-[11px]">
                {latency}ms
              </span>
            </div>

            {/* Quick Switch to Full Portal */}
            <button
              onClick={() => setShowExtendedPortal(true)}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors border border-slate-700/50 cursor-pointer"
              title="Accéder aux modules avancés (Base de données, utilisateurs, revenus)"
            >
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              <span>Base & Tables</span>
            </button>

            {/* Lock / Terminate Session Button */}
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-semibold transition-all cursor-pointer"
              title="Verrouiller la session administrateur"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Verrouiller</span>
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Top Control Bar & Live Feed Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Stream Status */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Statut du Flux</p>
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                {connectionStatus === 'connected' ? 'En écoute active' : 'Connexion...'}
              </h3>
            </div>
            <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
              <Activity className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: Total Realtime Events */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Événements Capturés</p>
              <h3 className="text-lg font-bold text-slate-100 font-mono mt-0.5">
                {events.length} <span className="text-xs text-slate-500 font-normal">reçus</span>
              </h3>
            </div>
            <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
              <Radio className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: Active Users Detected */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Sessions Détectées</p>
              <h3 className="text-lg font-bold text-slate-100 font-mono mt-0.5">
                {stats?.onlineUsersCount || (events.length > 0 ? new Set(events.map(e => e.user?.email || e.user?.id)).size : 0)}
              </h3>
            </div>
            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 4: Actions & Simulation Control */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Simulateur d'Action</p>
              <button
                onClick={() => handleSimulate('user_register')}
                disabled={isSimulating}
                className="mt-1 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                <span>Simuler un Événement</span>
              </button>
            </div>
            <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Radio className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* 3. Real-time Live Feed Container & Table */}
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-2xl overflow-hidden shadow-xl">
          {/* Table Header Controls */}
          <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <span>Flux d'Activité en Temps Réel</span>
                {events.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30">
                    {filteredEvents.length} événements
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Surveillance continue des interactions utilisateurs, créations de CV et conversions.
              </p>
            </div>

            {/* Filter Tabs & Actions */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Filter Chips */}
              <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeFilter === 'all' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Tous
                </button>
                <button
                  onClick={() => setActiveFilter('auth')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeFilter === 'auth' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Inscriptions
                </button>
                <button
                  onClick={() => setActiveFilter('cv')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeFilter === 'cv' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  CVs
                </button>
                <button
                  onClick={() => setActiveFilter('pdf')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeFilter === 'pdf' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Imports
                </button>
                <button
                  onClick={() => setActiveFilter('payments')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    activeFilter === 'payments' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Paiements
                </button>
              </div>

              {/* Pause / Resume Button */}
              <button
                onClick={handleTogglePause}
                className={`p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                  isPaused 
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20' 
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
                }`}
                title={isPaused ? "Reprendre le flux d'événements" : "Mettre en pause le flux"}
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>

              {/* Clear Logs Button */}
              {events.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-red-400 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Effacer le flux actuel"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 4. Minimalist Empty State or Table Content */}
          {filteredEvents.length === 0 ? (
            /* Requirement 2: Clean Minimalist Empty State */
            <div className="py-20 px-6 flex flex-col items-center justify-center text-center">
              {/* Radar pulse visual */}
              <div className="relative mb-6">
                <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-inner">
                  <Radio className="w-8 h-8 animate-pulse text-blue-400 stroke-[1.5]" />
                </div>
                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-ping pointer-events-none" />
              </div>

              {/* Clean Minimalist Message */}
              <h3 className="text-lg font-bold text-slate-200 tracking-tight">
                En attente de données en temps réel / Aucun utilisateur actif
              </h3>
              <p className="text-xs text-slate-400 max-w-md mt-2 leading-relaxed">
                Le canal de surveillance SSE est ouvert et prêt. Dès qu'un candidat visite le site, s'inscrit, édite un CV ou télécharge un document, l'événement apparaîtra instantanément ci-dessous.
              </p>

              {/* Test Action Trigger */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  onClick={() => handleSimulate('user_register')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Tester avec un utilisateur fictif</span>
                </button>
                <button
                  onClick={() => handleSimulate('cv_create')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Tester création de CV</span>
                </button>
              </div>
            </div>
          ) : (
            /* Requirement 2 & 3: Real-time Data Container & Dynamic Table */
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase tracking-wider font-semibold text-[10px]">
                    <th className="py-3 px-4">Horodatage</th>
                    <th className="py-3 px-4">Utilisateur / Session</th>
                    <th className="py-3 px-4">Événement</th>
                    <th className="py-3 px-4">Détails de l'Action</th>
                    <th className="py-3 px-4 text-right">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredEvents.map((evt, idx) => (
                    <tr 
                      key={evt.id || idx}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Horodatage */}
                      <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                          <span>{formatTimestamp(evt.timestamp)}</span>
                        </div>
                      </td>

                      {/* Utilisateur */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-slate-300 text-[10px]">
                            {evt.user?.name ? evt.user.name.substring(0, 2).toUpperCase() : 'US'}
                          </div>
                          <div>
                            <p className="font-semibold text-slate-200 text-xs leading-none">
                              {evt.user?.name || 'Visiteur En Ligne'}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                              {evt.user?.email || evt.user?.id || 'Session Invité'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Événement */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getEventBadge(evt.type)}
                      </td>

                      {/* Détails */}
                      <td className="py-3.5 px-4 text-slate-300 max-w-md">
                        <p className="font-medium truncate">{evt.title}</p>
                        <p className="text-[11px] text-slate-400 truncate">{evt.details}</p>
                      </td>

                      {/* Statut */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Actif</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div ref={tableBottomRef} />
            </div>
          )}
        </div>

        {/* 5. Secret Security & Privacy Footnote */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Route confidentielle : <code className="text-slate-300 font-mono bg-slate-800 px-1.5 py-0.5 rounded">{ADMIN_SECRET_ROUTE}</code> &bull; Sécurité par obscurité & contrôle d'accès strict.
            </span>
          </div>
          <div>
            Aucun lien public &bull; Écoute temps réel chiffrée
          </div>
        </div>
      </main>
    </div>
  );
};

export default IsolatedAdminDashboard;
