import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import AgentHeader from '../../components/layout/AgentHeader';
import { FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

export default function AgentAssignedProjectsPage() {
  const [tab, setTab] = useState('active'); // 'active' | 'due' | 'all'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    load();
  }, [tab]);

  async function load() {
    setLoading(true);
    try {
      if (tab === 'due') {
        const { data } = await agentApi.getDueForCompletion();
        setProjects(data.projects || []);
      } else {
        const { data } = await agentApi.getAssignedProjects(tab === 'all' ? 'all' : undefined);
        setProjects(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load projects", error);
    }
    setLoading(false);
  }

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-gray-50/50">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">
        
        <AgentHeader title="Assigned Projects" />

        <div className="flex flex-col md:flex-row gap-6 items-start w-full">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">



            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 px-2">Views</h3>
              {[
                { id: 'active', label: 'Active Queue' },
                { id: 'due', label: 'Due for Completion' },
                { id: 'all', label: 'All Assignments' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={`px-4 py-3 text-sm font-semibold rounded-2xl transition-all text-left ${
                    tab === t.id 
                      ? 'bg-[#0f172a] text-white shadow-sm' 
                      : 'bg-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Logout */}
            <div className="mt-auto pt-4 relative">
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-bold uppercase tracking-wider rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors border border-red-100"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>

              {/* Custom Logout Confirmation Modal overlay */}
              {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
                  <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-sm shadow-xl border border-gray-100 animate-in fade-in zoom-in duration-200">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4">
                        <FiLogOut className="w-6 h-6 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Log Out</h3>
                      <p className="text-sm text-gray-500 mb-6">
                        Are you sure you want to log out of your agent account?
                      </p>
                      <div className="flex gap-3 w-full">
                        <button
                          onClick={() => setShowLogoutConfirm(false)}
                          className="flex-1 px-4 py-3 text-sm font-bold rounded-2xl bg-gray-50 text-gray-700 hover:bg-gray-100 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            await useAuthStore.getState().logout?.(); 
                            window.location.href = '/login';
                          }}
                          className="flex-1 px-4 py-3 text-sm font-bold rounded-2xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-sm"
                        >
                          Log Out
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Content / List */}
          <div className="flex-1 w-full bg-white rounded-3xl p-6 shadow-sm border border-gray-100 min-h-[600px] flex flex-col">
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20">
                <p>No projects found in this view.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {projects.map((p) => (
                  <Link 
                    key={p.id} 
                    to={`/agent/projects/${p.id}`} 
                    className="block bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all group"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">
                            {p.project_type || 'Carbon Project'}
                          </span>
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 capitalize">
                            {p.status?.replace('_', ' ')}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {p.title}
                        </h3>
                      </div>
                      
                      {p.expected_completion_date && (
                        <div className="text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg shrink-0">
                          Due: {new Date(p.expected_completion_date).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}