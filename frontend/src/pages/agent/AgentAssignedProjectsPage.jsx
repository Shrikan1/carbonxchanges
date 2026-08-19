import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import AgentHeader from '../../components/layout/AgentHeader';

export default function AgentAssignedProjectsPage() {
  const [tab, setTab] = useState('active'); // 'active' | 'due' | 'all'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

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
        setProjects(data.projects || []);
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

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          
          {/* Tabs */}
          <div className="flex items-center gap-2 mb-8 border-b border-gray-100 pb-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'active', label: 'Active Queue' },
              { id: 'due', label: 'Due for Completion' },
              { id: 'all', label: 'All Assignments' }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-all whitespace-nowrap ${
                  tab === t.id 
                    ? 'bg-[#0f172a] text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* List */}
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
  );
}