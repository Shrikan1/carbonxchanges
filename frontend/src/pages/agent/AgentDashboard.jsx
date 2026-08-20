import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AgentLayout from '../../components/layout/AgentLayout';
import { FiCheckCircle, FiClock, FiFileText, FiArrowRight, FiActivity } from 'react-icons/fi';
import * as agentApi from '../../api/endpoint/agentApi';

const AgentDashboard = ({ data, isLoading: dashboardLoading }) => {
  const { total_assigned, pending_verifications, completed_verifications } = data || {};
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(false);

  useEffect(() => { loadProjects(); }, []);

  async function loadProjects() {
    setLoadingProjects(true);
    try {
      const { data } = await agentApi.getAssignedProjects();
      setProjects(data.data || []);
    } catch (err) {
      console.error('Failed to load projects', err);
    }
    setLoadingProjects(false);
  }

  return (
    <AgentLayout title="Agent Dashboard" subtitle="Verification workspace">

      {/* ── STATS ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

        {/* Assigned */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <img src="/icons/assign.png" alt="Assigned" className="w-16 h-16 grayscale" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Assigned
          </p>
          {dashboardLoading
            ? <div className="h-12 w-20 bg-gray-100 rounded animate-pulse" />
            : <span className="text-5xl font-light tracking-tight text-gray-900 leading-none">{total_assigned ?? 0}</span>
          }
        </div>

        {/* Due Soon — dark hero card */}
        <div className="bg-[#022c22] border border-[#022c22] rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all">
          <div className="absolute top-4 right-4 text-white/5 group-hover:text-white/10 transition-colors">
            <FiActivity size={64} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#bef264] mb-4">
            Due Soon
          </p>
          {dashboardLoading
            ? <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            : <span className="text-5xl font-light tracking-tight text-white leading-none">{pending_verifications ?? 0}</span>
          }
        </div>

        {/* Completed */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden group hover:shadow-md transition-all">
          <div className="absolute top-4 right-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <img src="/icons/history.png" alt="Completed" className="w-16 h-16 grayscale" />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">
            Completed
          </p>
          {dashboardLoading
            ? <div className="h-12 w-20 bg-gray-100 rounded animate-pulse" />
            : <span className="text-5xl font-light tracking-tight text-gray-900 leading-none">{completed_verifications ?? 0}</span>
          }
        </div>

      </div>

      {/* ── VERIFICATION QUEUE ── */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Queue header */}
        <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900 tracking-tight">
            Verification Queue
          </h2>
          <Link
            to="/agent/projects"
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Queue body */}
        {loadingProjects ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-14 rounded-lg bg-[#f4f7f5] animate-pulse" />
            ))}
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
          /* Table-style rows */
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
                {/* Name */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                    {p.title}
                  </p>
                  {p.location && (
                    <p className="text-sm text-gray-500 mt-0.5 truncate">
                      {p.location}
                    </p>
                  )}
                </div>

                {/* Type */}
                <div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {p.project_type || '—'}
                  </span>
                </div>

                {/* Status badge */}
                <div>
                  <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                    p.status === 'in_progress'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : p.status === 'assigned'
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {p.status?.replace('_', ' ')}
                  </span>
                </div>

                {/* Due date */}
                <div className="flex items-center gap-1.5">
                  {p.expected_completion_date ? (
                    <>
                      <FiClock className="w-4 h-4 text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-500">
                        {new Date(p.expected_completion_date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>

                {/* Arrow */}
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
};

export default AgentDashboard;
