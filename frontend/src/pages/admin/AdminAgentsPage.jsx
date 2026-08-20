import { useEffect, useState } from 'react';
import { 
  FiUserPlus, FiSearch, FiX, FiMail, FiUser, 
  FiCheckCircle, FiClock, FiChevronRight, FiLoader 
} from 'react-icons/fi';
import * as adminApi from '../../api/endpoint/adminApi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Create agent modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setLoading(true);
    try {
      const { data } = await adminApi.getAllAgents();
      setAgents(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) setAgents([]);
      else console.error('Failed to load agents:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null); setSuccessMessage(null); setCreating(true);
    try {
      await adminApi.createAgent(form.name, form.email);
      setSuccessMessage(`Agent "${form.name}" created successfully. Credentials have been emailed.`);
      setForm({ name: '', email: '' });
      loadAgents();
      setTimeout(() => { setShowCreateModal(false); setSuccessMessage(null); }, 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create agent');
    } finally {
      setCreating(false);
    }
  }

  function openCreateModal() {
    setForm({ name: '', email: '' });
    setError(null); setSuccessMessage(null); setShowCreateModal(true);
  }

  const filteredAgents = agents.filter(agent =>
    agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Agents" subtitle="Manage verification agents and their project workloads.">
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto flex flex-col h-full">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          
          {/* Toolbar */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4 items-center shrink-0">
            <div className="relative w-full sm:max-w-md">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search agents by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button
              onClick={openCreateModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-[#0f172a] text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm shrink-0"
            >
              <FiUserPlus />
              New Agent
            </button>
          </div>

          {/* Data Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[40%]">Agent Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%] text-center">Active Projects</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%] text-center">Completed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-48 mb-2"></div><div className="h-3 bg-gray-100 rounded w-32"></div></td>
                      <td className="px-6 py-5"><div className="h-6 bg-gray-100 rounded-full w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-8 mx-auto"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-8 mx-auto"></div></td>
                    </tr>
                  ))
                ) : filteredAgents.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                          <FiUser size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No agents found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredAgents.map(agent => (
                    <tr key={agent.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 font-bold shrink-0">
                            {agent.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900">{agent.name}</div>
                            <div className="text-sm text-gray-500 mt-0.5">{agent.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                          {agent.workload?.active_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-gray-500">
                          {agent.workload?.completed_count || 0}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Add New Agent</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 p-2 rounded-full">
                <FiX size={18} />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-6 border border-red-100 font-medium">
                  {error}
                </div>
              )}
              {successMessage ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <FiCheckCircle size={24} />
                  </div>
                  <h4 className="text-emerald-800 font-bold mb-2">Success!</h4>
                  <p className="text-emerald-600 text-sm">{successMessage}</p>
                </div>
              ) : (
                <form onSubmit={handleCreate} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required type="text" value={form.name} onChange={e => setForm({...form, name: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        required type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:border-emerald-500 transition-all"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>
                  <div className="pt-2">
                    <button type="submit" disabled={creating} className="w-full flex items-center justify-center gap-2 bg-[#0f172a] hover:bg-gray-800 text-white font-bold py-3 rounded-xl transition-all disabled:opacity-50">
                      {creating ? <FiLoader className="animate-spin" /> : 'Create Agent'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}