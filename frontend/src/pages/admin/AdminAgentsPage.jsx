import { useEffect, useState } from 'react';
import { FiUserPlus, FiUsers, FiSearch, FiX, FiMail, FiUser, FiCheckCircle, FiClock, FiChevronRight, FiLoader } from 'react-icons/fi';
import * as adminApi from '../../api/endpoint/adminApi';
import AdminHeader from '../../components/layout/AdminHeader';

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

  // Expanded agent workload state
  const [expandedAgentId, setExpandedAgentId] = useState(null);
  const [workloadData, setWorkloadData] = useState({});
  const [workloadLoading, setWorkloadLoading] = useState({});

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    setLoading(true);
    try {
      const { data } = await adminApi.getAllAgents();
      setAgents(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setAgents([]);
      } else {
        console.error('Failed to load agents:', err);
      }
    } finally {
      setLoading(false);
    }
  }

  async function loadWorkload(agentId) {
    if (workloadData[agentId]) return; // already loaded
    setWorkloadLoading(prev => ({ ...prev, [agentId]: true }));
    try {
      const { data } = await adminApi.getAgentWorkload(agentId);
      setWorkloadData(prev => ({ ...prev, [agentId]: data }));
    } catch (err) {
      console.error('Failed to load workload:', err);
    } finally {
      setWorkloadLoading(prev => ({ ...prev, [agentId]: false }));
    }
  }

  function toggleExpand(agentId) {
    if (expandedAgentId === agentId) {
      setExpandedAgentId(null);
    } else {
      setExpandedAgentId(agentId);
      loadWorkload(agentId);
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setCreating(true);
    try {
      const { data } = await adminApi.createAgent(form.name, form.email);
      setSuccessMessage(`Agent "${form.name}" created successfully. Credentials have been emailed.`);
      setForm({ name: '', email: '' });
      loadAgents();
      // Auto-close after a brief moment
      setTimeout(() => {
        setShowCreateModal(false);
        setSuccessMessage(null);
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create agent');
    } finally {
      setCreating(false);
    }
  }

  function openCreateModal() {
    setForm({ name: '', email: '' });
    setError(null);
    setSuccessMessage(null);
    setShowCreateModal(true);
  }

  const filteredAgents = agents.filter(agent =>
    agent.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalActive = agents.reduce((sum, a) => sum + (a.workload?.active_count || 0), 0);
  const totalCompleted = agents.reduce((sum, a) => sum + (a.workload?.completed_count || 0), 0);

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        <AdminHeader title="Agent Management" />

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-100">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Agent Roster</h2>
              <p className="text-sm text-gray-500 mt-1">Manage verification agents and their workloads</p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-64 pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-gray-900/5 outline-none transition-all"
                />
              </div>

              {/* Create Agent Button */}
              <button
                onClick={openCreateModal}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white text-sm font-semibold rounded-xl hover:bg-[#1e293b] transition-all shadow-sm hover:shadow-md shrink-0"
              >
                <FiUserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">New Agent</span>
              </button>
            </div>
          </div>

          {/* Agent List */}
          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 animate-pulse">
                  <div className="w-12 h-12 rounded-full bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="flex gap-6">
                    <div className="h-4 bg-gray-200 rounded w-16" />
                    <div className="h-4 bg-gray-200 rounded w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAgents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3 py-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <FiUsers className="w-7 h-7 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">
                {searchQuery ? 'No agents match your search' : 'No agents yet'}
              </p>
              <p className="text-gray-400 text-sm">
                {searchQuery ? 'Try a different search term' : 'Create your first verification agent to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={openCreateModal}
                  className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] text-white text-sm font-semibold rounded-xl hover:bg-[#1e293b] transition-all"
                >
                  <FiUserPlus className="w-4 h-4" />
                  Create Agent
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filteredAgents.map((agent) => {
                const isExpanded = expandedAgentId === agent.id;
                const activeCount = agent.workload?.active_count || 0;
                const completedCount = agent.workload?.completed_count || 0;
                const totalTasks = activeCount + completedCount;
                const completionRate = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

                return (
                  <div key={agent.id} className="group">
                    {/* Agent Row */}
                    <button
                      onClick={() => toggleExpand(agent.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl border transition-all text-left ${
                        isExpanded
                          ? 'border-gray-200 bg-gray-50/50 shadow-sm'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50/30 hover:shadow-sm'
                      }`}
                    >
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center text-base font-bold text-blue-800 shrink-0 shadow-sm">
                        {agent.name?.charAt(0)?.toUpperCase() || 'A'}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-gray-900 truncate">{agent.name}</p>
                        <p className="text-sm text-gray-500 truncate flex items-center gap-1.5">
                          <FiMail className="w-3.5 h-3.5 shrink-0" />
                          {agent.email}
                        </p>
                      </div>

                      {/* Stats */}
                      <div className="hidden sm:flex items-center gap-6 shrink-0">
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{activeCount}</p>
                          <p className="text-xs text-gray-500 font-medium">Active</p>
                        </div>
                        <div className="text-center">
                          <p className="text-lg font-bold text-gray-900">{completedCount}</p>
                          <p className="text-xs text-gray-500 font-medium">Done</p>
                        </div>
                        <div className="text-center">
                          <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${completionRate}%` }}
                            />
                          </div>
                          <p className="text-xs text-gray-500 font-medium mt-1">{completionRate}%</p>
                        </div>
                      </div>

                      {/* Expand Arrow */}
                      <FiChevronRight
                        className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </button>

                    {/* Expanded Workload Details */}
                    {isExpanded && (
                      <div className="ml-16 mr-4 mt-2 mb-2 p-4 bg-white border border-gray-100 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-200">
                        {workloadLoading[agent.id] ? (
                          <div className="flex items-center justify-center gap-2 py-6 text-gray-400">
                            <FiLoader className="w-4 h-4 animate-spin" />
                            <span className="text-sm">Loading workload details...</span>
                          </div>
                        ) : workloadData[agent.id] ? (
                          <div>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Assigned Projects</h4>
                            {workloadData[agent.id].data?.length > 0 ? (
                              <div className="space-y-2">
                                {workloadData[agent.id].data.map((project) => (
                                  <div
                                    key={project.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                  >
                                    <div className="min-w-0 flex-1">
                                      <p className="text-sm font-medium text-gray-900 truncate">{project.title}</p>
                                      <p className="text-xs text-gray-500">{project.project_type || 'Carbon Project'}</p>
                                    </div>
                                    <span
                                      className={`px-2.5 py-1 text-xs font-medium rounded-full shrink-0 ml-3 ${
                                        project.status === 'verified'
                                          ? 'bg-emerald-50 text-emerald-700'
                                          : project.status === 'assigned'
                                          ? 'bg-blue-50 text-blue-700'
                                          : project.status === 'in_progress'
                                          ? 'bg-amber-50 text-amber-700'
                                          : 'bg-gray-100 text-gray-600'
                                      }`}
                                    >
                                      {project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-400 text-center py-4">No projects assigned yet.</p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-4">Could not load workload data.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ============================================
          CREATE AGENT MODAL (Centered)
      ============================================ */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setShowCreateModal(false)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200 max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 shrink-0">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Create New Agent</h2>
                <p className="text-sm text-gray-500 mt-0.5">Add a verification agent to the platform</p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Form Content */}
            <div className="flex-1 overflow-y-auto px-6 py-6">

              {/* Info Card */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                    <FiMail className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-900">Auto-credential delivery</p>
                    <p className="text-xs text-blue-700 mt-1">
                      A temporary password will be generated and emailed to the agent automatically. They'll be verified immediately — no OTP step needed.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleCreate} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. agent@company.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 text-[15px] border border-gray-200 rounded-xl bg-white focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <FiX className="w-3 h-3 text-red-600" />
                    </div>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                {/* Success */}
                {successMessage && (
                  <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <FiCheckCircle className="w-3 h-3 text-emerald-600" />
                    </div>
                    <p className="text-sm text-emerald-700">{successMessage}</p>
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={creating || !!successMessage}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#0f172a] text-white text-sm font-semibold rounded-xl hover:bg-[#1e293b] transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? (
                    <>
                      <FiLoader className="w-4 h-4 animate-spin" />
                      Creating Agent...
                    </>
                  ) : successMessage ? (
                    <>
                      <FiCheckCircle className="w-4 h-4" />
                      Created!
                    </>
                  ) : (
                    <>
                      <FiUserPlus className="w-4 h-4" />
                      Create Agent
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}