// frontend/src/pages/admin/AdminMessagesPage.jsx
import { useEffect, useState } from 'react';
import {
  FiMail,
  FiSearch,
  FiTrash2,
  FiCheckCircle,
  FiEye,
  FiClock,
  FiPhone,
  FiSend,
  FiRefreshCw,
  FiMessageSquare,
  FiAlertCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import * as contactApi from '../../api/endpoint/contactApi';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [counts, setCounts] = useState({ total: 0, unread: 0, read: 0, resolved: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await contactApi.getAdminMessages({
        status: statusFilter,
      });
      setMessages(res.data?.messages || []);
      if (res.data?.counts) {
        setCounts(res.data.counts);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
      toast.error('Failed to load contact messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [statusFilter]);

  const handleStatusChange = async (id, newStatus, e) => {
    if (e) e.stopPropagation();
    try {
      await contactApi.updateAdminMessageStatus(id, newStatus);
      toast.success(`Message marked as ${newStatus}`);
      setMessages((prev) =>
        prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage((prev) => ({ ...prev, status: newStatus }));
      }
      // Re-fetch counts
      contactApi.getAdminMessages({ status: 'all' }).then((res) => {
        if (res.data?.counts) setCounts(res.data.counts);
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to update message status');
    }
  };

  const handleDelete = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await contactApi.deleteAdminMessage(id);
      toast.success('Message deleted');
      setMessages((prev) => prev.filter((msg) => msg.id !== id));
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      // Refresh count
      contactApi.getAdminMessages({ status: 'all' }).then((res) => {
        if (res.data?.counts) setCounts(res.data.counts);
      });
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const q = search.toLowerCase();
    return (
      msg.name?.toLowerCase().includes(q) ||
      msg.email?.toLowerCase().includes(q) ||
      msg.phone?.toLowerCase().includes(q) ||
      msg.message?.toLowerCase().includes(q)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'unread':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Unread
          </span>
        );
      case 'read':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
            <FiEye className="w-3 h-3" />
            Read
          </span>
        );
      case 'resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
            <FiCheckCircle className="w-3 h-3" />
            Resolved
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-gray-100 text-gray-700 border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <AdminLayout
      title="Contact Inquiries"
      subtitle="View, manage, and respond to incoming user messages and contact requests."
    >
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto space-y-6">

        {/* ── Summary Stats ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            onClick={() => setStatusFilter('all')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-[#173d25] text-white border-[#173d25] shadow-md shadow-[#173d25]/10'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${statusFilter === 'all' ? 'text-white/80' : 'text-gray-500'}`}>
                Total Messages
              </span>
              <FiMail className={`w-4 h-4 ${statusFilter === 'all' ? 'text-[#bef264]' : 'text-gray-400'}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono">{counts.total}</p>
          </div>

          <div
            onClick={() => setStatusFilter('unread')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'unread'
                ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/10'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${statusFilter === 'unread' ? 'text-white/80' : 'text-gray-500'}`}>
                Unread
              </span>
              <FiAlertCircle className={`w-4 h-4 ${statusFilter === 'unread' ? 'text-white' : 'text-amber-500'}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono">{counts.unread}</p>
          </div>

          <div
            onClick={() => setStatusFilter('read')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'read'
                ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/10'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${statusFilter === 'read' ? 'text-white/80' : 'text-gray-500'}`}>
                Read
              </span>
              <FiEye className={`w-4 h-4 ${statusFilter === 'read' ? 'text-white' : 'text-blue-500'}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono">{counts.read}</p>
          </div>

          <div
            onClick={() => setStatusFilter('resolved')}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer ${
              statusFilter === 'resolved'
                ? 'bg-emerald-700 text-white border-emerald-700 shadow-md shadow-emerald-700/10'
                : 'bg-white border-gray-200 hover:border-gray-300 text-gray-900'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-bold uppercase tracking-wider ${statusFilter === 'resolved' ? 'text-white/80' : 'text-gray-500'}`}>
                Resolved
              </span>
              <FiCheckCircle className={`w-4 h-4 ${statusFilter === 'resolved' ? 'text-[#bef264]' : 'text-emerald-500'}`} />
            </div>
            <p className="text-2xl sm:text-3xl font-bold font-mono">{counts.resolved}</p>
          </div>
        </div>

        {/* ── Main Container ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">

          {/* Controls Bar */}
          <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50/70 flex flex-col sm:flex-row justify-between items-center gap-4">
            
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'all', label: 'All Inquiries' },
                { id: 'unread', label: 'Unread' },
                { id: 'read', label: 'Read' },
                { id: 'resolved', label: 'Resolved' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setStatusFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    statusFilter === tab.id
                      ? 'bg-gray-900 text-white shadow-sm'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search & Refresh */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  placeholder="Search inquiries..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors"
                />
              </div>

              <button
                onClick={fetchMessages}
                disabled={isLoading}
                title="Refresh messages"
                className="p-2.5 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-600 transition-colors cursor-pointer"
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-gray-900' : ''}`} />
              </button>
            </div>
          </div>

          {/* List Content */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-12 flex flex-col items-center justify-center text-center">
                <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin mb-3" />
                <p className="text-xs text-gray-500 font-medium">Loading inquiries...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-400 mb-3">
                  <FiMessageSquare className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-1">No inquiries found</h4>
                <p className="text-xs text-gray-500 max-w-sm">
                  {search
                    ? 'No messages matched your search query. Try clearing your search.'
                    : 'There are currently no contact messages in this category.'}
                </p>
              </div>
            ) : (
              filteredMessages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => {
                    setSelectedMessage(msg);
                    if (msg.status === 'unread') {
                      handleStatusChange(msg.id, 'read');
                    }
                  }}
                  className={`p-4 sm:p-6 transition-all hover:bg-gray-50/80 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    msg.status === 'unread' ? 'bg-amber-50/20' : ''
                  }`}
                >
                  {/* Left: Sender & Message Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#173d25] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {msg.name?.charAt(0).toUpperCase() || 'U'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1">
                        <span className="font-bold text-sm text-gray-900">{msg.name}</span>
                        {getStatusBadge(msg.status)}
                        <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                          <FiClock className="w-3 h-3" />
                          {new Date(msg.created_at).toLocaleString(undefined, {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-2 flex-wrap font-mono">
                        <span className="text-gray-700">{msg.email}</span>
                        {msg.phone && (
                          <span className="flex items-center gap-1 text-gray-600">
                            <FiPhone className="w-3 h-3 text-gray-400" />
                            {msg.phone}
                          </span>
                        )}
                      </div>

                      <p className="text-xs sm:text-[13px] text-gray-700 line-clamp-2 leading-relaxed">
                        {msg.message}
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                    <a
                      href={`mailto:${msg.email}?subject=Re: CarbonXPlanet Inquiry&body=Hi ${msg.name},%0D%0A%0D%0AThank you for reaching out to CarbonXPlanet regarding your inquiry:%0D%0A"${msg.message}"%0D%0A%0D%0A`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#173d25] hover:bg-[#0f2a17] text-white text-xs font-bold rounded-lg transition-colors"
                      title="Reply via email"
                    >
                      <FiSend className="w-3 h-3" />
                      Reply
                    </a>

                    {msg.status !== 'resolved' ? (
                      <button
                        onClick={(e) => handleStatusChange(msg.id, 'resolved', e)}
                        className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 transition-colors"
                        title="Mark as resolved"
                      >
                        Resolve
                      </button>
                    ) : (
                      <button
                        onClick={(e) => handleStatusChange(msg.id, 'unread', e)}
                        className="px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors"
                        title="Mark as unread"
                      >
                        Reopen
                      </button>
                    )}

                    <button
                      onClick={(e) => handleDelete(msg.id, e)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete inquiry"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Message Detail Modal ── */}
        {selectedMessage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 max-w-xl w-full p-6 sm:p-8 space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-[#173d25] text-[#bef264] flex items-center justify-center font-bold text-base shrink-0">
                    {selectedMessage.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">{selectedMessage.name}</h3>
                    <p className="text-xs text-gray-400 font-mono">
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>{getStatusBadge(selectedMessage.status)}</div>
              </div>

              {/* Sender Details */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 uppercase tracking-wider">Email</span>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="text-[#173d25] font-bold hover:underline"
                  >
                    {selectedMessage.email}
                  </a>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200/60">
                    <span className="text-gray-400 uppercase tracking-wider">Phone</span>
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="text-gray-900 font-bold hover:underline"
                    >
                      {selectedMessage.phone}
                    </a>
                  </div>
                )}
              </div>

              {/* Message Body */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Full Message
                </label>
                <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm text-gray-800 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <button
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <FiTrash2 className="w-3.5 h-3.5" />
                  Delete
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
                  >
                    Close
                  </button>

                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: CarbonXPlanet Inquiry&body=Hi ${selectedMessage.name},%0D%0A%0D%0AThank you for reaching out to CarbonXPlanet regarding your inquiry:%0D%0A"${selectedMessage.message}"%0D%0A%0D%0A`}
                    className="px-5 py-2 text-xs font-bold bg-[#173d25] hover:bg-[#0f2a17] text-white rounded-xl transition-colors flex items-center gap-2 shadow-sm"
                  >
                    <FiSend className="w-3.5 h-3.5" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
