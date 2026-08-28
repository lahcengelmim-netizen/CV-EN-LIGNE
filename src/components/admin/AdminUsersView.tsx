import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Shield,
  UserCheck,
  UserX,
  FileText,
  Mail,
  Calendar,
  Eye,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { AdminUser } from '../../types';
import { adminService } from '../../lib/adminService';

export const AdminUsersView: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [planFilter, setPlanFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const data = await adminService.getUsers({
      search: searchTerm,
      status: statusFilter,
      plan: planFilter
    });
    if (data) {
      setUsers(data.users);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter, planFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  const toggleUserStatus = (user: AdminUser) => {
    const updatedUsers = users.map((u) => {
      if (u.id === user.id) {
        return { ...u, status: u.status === 'active' ? ('suspended' as const) : ('active' as const) };
      }
      return u;
    });
    setUsers(updatedUsers);
    if (selectedUser?.id === user.id) {
      setSelectedUser({
        ...selectedUser,
        status: selectedUser.status === 'active' ? 'suspended' : 'active'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-400" />
            Gestion des Utilisateurs
          </h2>
          <p className="text-xs text-slate-400">
            Comptes inscrits, rôles d'accès, historique de création de CV et abonnements
          </p>
        </div>

        <button
          onClick={fetchUsers}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, prénom ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="all">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="suspended">Suspendu</option>
          </select>

          {/* Plan Filter */}
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 focus:border-blue-500 focus:outline-hidden"
          >
            <option value="all">Tous les plans</option>
            <option value="free">Gratuit</option>
            <option value="single_cv">Pass Flash ($1.99)</option>
            <option value="monthly">Pass Mensuel ($7.99)</option>
            <option value="yearly">Pass Annuel ($39.99)</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Utilisateur</th>
                <th className="py-3.5 px-4">Rôle</th>
                <th className="py-3.5 px-4">Plan / Statut</th>
                <th className="py-3.5 px-4">CVs Créés</th>
                <th className="py-3.5 px-4">Date d'inscription</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                      <span>Chargement de la base utilisateurs...</span>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Aucun utilisateur trouvé avec ces filtres.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                          {user.firstName ? user.firstName[0] : 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      {user.role === 'admin' ? (
                        <span className="px-2 py-0.5 bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold rounded-md text-[10px]">
                          ADMIN
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-800 text-slate-400 font-medium rounded-md text-[10px]">
                          Utilisateur
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              user.status === 'active' ? 'bg-emerald-400' : 'bg-red-400'
                            }`}
                          />
                          <span className="capitalize text-slate-200">{user.status === 'active' ? 'Actif' : 'Suspendu'}</span>
                        </div>
                        <div>
                          {user.plan === 'yearly' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              Pass Annuel
                            </span>
                          )}
                          {user.plan === 'monthly' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                              Pass Mensuel
                            </span>
                          )}
                          {user.plan === 'single_cv' && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              Pass Flash ($1.99)
                            </span>
                          )}
                          {(!user.plan || user.plan === 'free') && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
                              Gratuit
                            </span>
                          )}
                          {user.subscriptionStatus === 'expired' && (
                            <span className="ml-1 inline-flex items-center px-1 py-0.5 rounded text-[9px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                              Expiré
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-200">
                        <FileText className="w-3.5 h-3.5 text-blue-400" />
                        <span>{user.cvCount}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                          title="Voir le profil"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {user.role !== 'admin' && (
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              user.status === 'active'
                                ? 'text-amber-400 hover:bg-amber-500/10'
                                : 'text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title={user.status === 'active' ? 'Suspendre' : 'Réactiver'}
                          >
                            {user.status === 'active' ? (
                              <UserX className="w-4 h-4" />
                            ) : (
                              <UserCheck className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold">
                  {selectedUser.firstName ? selectedUser.firstName[0] : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedUser.email}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Identifiant</span>
                  <p className="font-mono text-slate-300 font-semibold">{selectedUser.id}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Rôle</span>
                  <p className="font-semibold text-white capitalize">{selectedUser.role}</p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">Statut</span>
                  <p
                    className={`font-semibold capitalize ${
                      selectedUser.status === 'active' ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {selectedUser.status === 'active' ? 'Actif' : 'Suspendu'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold">CVs Réalisés</span>
                  <p className="font-semibold text-white">{selectedUser.cvCount} documents</p>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400">Date de création du compte :</span>
                <p className="text-slate-200 font-medium">
                  {new Date(selectedUser.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>

              {selectedUser.lastLogin && (
                <div className="space-y-1">
                  <span className="text-slate-400">Dernière activité :</span>
                  <p className="text-slate-200 font-medium">
                    {new Date(selectedUser.lastLogin).toLocaleString('fr-FR')}
                  </p>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-950 flex items-center justify-between gap-3">
              {selectedUser.role !== 'admin' && (
                <button
                  onClick={() => toggleUserStatus(selectedUser)}
                  className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors ${
                    selectedUser.status === 'active'
                      ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                      : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                  }`}
                >
                  {selectedUser.status === 'active' ? 'Suspendre ce compte' : 'Réactiver ce compte'}
                </button>
              )}

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-xs transition-colors ml-auto"
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
