import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Mail,
  CheckCircle,
  Clock,
  Send,
  User,
  Calendar,
  RefreshCw,
  X,
  FileText
} from 'lucide-react';
import { AdminMessage } from '../../types';
import { adminService } from '../../lib/adminService';

export const AdminMessagesView: React.FC = () => {
  const [messages, setMessages] = useState<AdminMessage[]>([]);
  const [counts, setCounts] = useState<{ total: number; nouveau: number; lu: number; traite: number }>({
    total: 0,
    nouveau: 0,
    lu: 0,
    traite: 0
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState<AdminMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    const data = await adminService.getMessages(statusFilter);
    if (data) {
      setMessages(data.messages);
      setCounts(data.counts);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleOpenMessage = async (msg: AdminMessage) => {
    setSelectedMessage(msg);
    if (msg.status === 'nouveau') {
      await adminService.updateMessage(msg.id, 'lu');
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, status: 'lu' as const } : m))
      );
      setCounts((prev) => ({
        ...prev,
        nouveau: Math.max(0, prev.nouveau - 1),
        lu: prev.lu + 1
      }));
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    setIsSendingReply(true);
    const success = await adminService.replyMessage(selectedMessage.id, replyText);
    if (success) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === selectedMessage.id
            ? { ...m, status: 'traite' as const, repliedAt: new Date().toISOString() }
            : m
        )
      );
      setSelectedMessage((prev) =>
        prev
          ? {
              ...prev,
              status: 'traite' as const,
              repliedAt: new Date().toISOString(),
              notes: `Réponse : "${replyText.slice(0, 60)}..."`
            }
          : null
      );
      setReplyText('');
    }
    setIsSendingReply(false);
  };

  const handleStatusChange = async (newStatus: 'nouveau' | 'lu' | 'traite') => {
    if (!selectedMessage) return;
    await adminService.updateMessage(selectedMessage.id, newStatus);
    setMessages((prev) =>
      prev.map((m) => (m.id === selectedMessage.id ? { ...m, status: newStatus } : m))
    );
    setSelectedMessage((prev) => (prev ? { ...prev, status: newStatus } : null));
    fetchMessages();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-400" />
            Support Client & Messages
          </h2>
          <p className="text-xs text-slate-400">
            Boîte de réception des demandes de contact destinées à <strong>{adminService.getStoredAdminEmail() || 'vitareysupport@gmail.com'}</strong>
          </p>
        </div>

        <button
          onClick={fetchMessages}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-800 transition-colors flex items-center gap-2"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualiser</span>
        </button>
      </div>

      {/* Message Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Tous', count: counts.total },
          { id: 'nouveau', label: 'Nouveaux', count: counts.nouveau, color: 'text-amber-400' },
          { id: 'lu', label: 'Lus', count: counts.lu, color: 'text-blue-400' },
          { id: 'traite', label: 'Traités', count: counts.traite, color: 'text-emerald-400' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 whitespace-nowrap ${
              statusFilter === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 bg-slate-950/80 rounded-md text-[10px] font-bold ${
                tab.color || 'text-white'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="divide-y divide-slate-800/60">
          {loading ? (
            <div className="py-12 text-center text-slate-500 flex items-center justify-center gap-2 text-xs">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Chargement des messages...</span>
            </div>
          ) : messages.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-xs">
              Aucun message dans cette boîte de réception.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                onClick={() => handleOpenMessage(msg)}
                className={`p-4 sm:p-5 hover:bg-slate-800/40 transition-colors cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  msg.status === 'nouveau' ? 'bg-blue-950/20' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center text-white font-bold text-xs shrink-0 mt-0.5">
                    {msg.name ? msg.name[0] : 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white">{msg.name}</span>
                      <span className="text-xs text-slate-400">({msg.email})</span>
                      {msg.status === 'nouveau' && (
                        <span className="px-2 py-0.2 bg-amber-500/20 text-amber-300 font-bold rounded-full text-[10px]">
                          NOUVEAU
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-semibold text-slate-200 mt-0.5">{msg.subject}</div>
                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xl">
                      {msg.message}
                    </p>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 shrink-0 sm:text-right">
                  <div>{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</div>
                  <span
                    className={`font-semibold capitalize text-[10px] ${
                      msg.status === 'traite'
                        ? 'text-emerald-400'
                        : msg.status === 'lu'
                        ? 'text-blue-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Message Reader Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-white text-base">{selectedMessage.subject}</h3>
                <p className="text-xs text-slate-400">
                  De : {selectedMessage.name} ({selectedMessage.email})
                </p>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs max-h-[70vh] overflow-y-auto">
              <div className="flex items-center justify-between text-[11px] text-slate-500 pb-2 border-b border-slate-800">
                <span>Date de réception : {new Date(selectedMessage.createdAt).toLocaleString('fr-FR')}</span>
                <div className="flex items-center gap-2">
                  <span>Statut :</span>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleStatusChange(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-[11px] text-slate-200"
                  >
                    <option value="nouveau">Nouveau</option>
                    <option value="lu">Lu</option>
                    <option value="traite">Traité</option>
                  </select>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedMessage.message}
              </div>

              {selectedMessage.notes && (
                <div className="p-3 bg-blue-950/30 border border-blue-900/40 rounded-xl text-blue-300 text-[11px]">
                  <strong>Notes administratives :</strong> {selectedMessage.notes}
                </div>
              )}

              {/* Quick Reply Form */}
              <div className="pt-2 space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-400" />
                  <span>Répondre par email au candidat</span>
                </label>
                <textarea
                  rows={3}
                  placeholder={`Écrivez votre réponse à ${selectedMessage.name}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-hidden"
                />

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    disabled={!replyText.trim() || isSendingReply}
                    onClick={handleSendReply}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSendingReply ? 'Envoi...' : 'Envoyer la réponse'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950 flex justify-end">
              <button
                onClick={() => setSelectedMessage(null)}
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
