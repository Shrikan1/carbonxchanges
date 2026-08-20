import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import AgentLayout from '../../components/layout/AgentLayout';
import { FiClock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';

export default function AgentAssignedProjectsPage() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const [tab, setTab] = useState(queryParams.get('tab') || 'active');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = new URLSearchParams(location.search).get('tab') || 'active';
    setTab(t);
  }, [location.search]);

  useEffect(() => { load(); }, [tab]);

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
    } catch (e) {
      console.error('Failed to load projects', e);
    }
    setLoading(false);
  }

  const pageTitle = tab === 'due' ? 'Due Soon' : tab === 'all' ? 'All Assignments' : 'Assigned Projects';

  return (
    <AgentLayout title={pageTitle} subtitle="Manage your verification queue">



      {/* Queue */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="px-6 py-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            Verification Queue
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-[#f4f7f5] animate-pulse" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#f4f7f5] flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-[#ccc]" />
            </div>
            <p className="text-base font-medium text-[#555]">No projects assigned</p>
            <p className="text-sm text-[#999] mt-1">New verification assignments will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Column headers */}
            <div
              className="hidden md:grid grid-cols-[1fr_160px_140px_120px_80px] px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50"
            >
              <span>Project</span>
              <span>Type</span>
              <span>Status</span>
              <span>Due Date</span>
              <span />
            </div>

            {projects.map((p) => (
              <Link
                key={p.id}
                to={`/agent/projects/${p.id}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px_120px_80px] items-center px-6 py-4 hover:bg-gray-50 transition-colors group gap-3 md:gap-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                    {p.title}
                  </p>
                  {p.location && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">{p.location}</p>
                  )}
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {p.project_type || '—'}
                  </span>
                </div>
                <div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    p.status === 'in_progress' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    p.status === 'assigned' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                    'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {p.status?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {p.expected_completion_date ? (
                    <>
                      <FiClock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-500">
                        {new Date(p.expected_completion_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </>
                  ) : <span className="text-sm text-gray-400">—</span>}
                </div>
                <div className="flex justify-end">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-gray-100 group-hover:text-emerald-600 transition-all duration-200">
                    <FiArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AgentLayout>
  );
}