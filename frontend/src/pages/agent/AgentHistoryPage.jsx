import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import AgentLayout from '../../components/layout/AgentLayout';
import { FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';

export default function AgentHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    agentApi.getVerificationHistory()
      .then(r => setReports(r.data.reports || []))
      .catch(e => console.error('Failed to load history', e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AgentLayout title="Verification History" subtitle="Your submitted verification reports">

      <div className="bg-white rounded-xl border border-[#e2e8e4] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#e2e8e4]">
          <h2 className="text-base font-semibold text-[#0a0a0a] tracking-tight">Past Verifications</h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 rounded-lg bg-[#f4f7f5] animate-pulse" />)}
          </div>
        ) : reports.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-[#f4f7f5] flex items-center justify-center mb-4">
              <FiCheckCircle className="w-6 h-6 text-[#ccc]" />
            </div>
            <p className="text-base font-medium text-[#555]">No past verifications</p>
            <p className="text-sm text-[#999] mt-1">Completed verification reports will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {/* Column headers */}
            <div
              className="hidden md:grid grid-cols-[1fr_160px_140px_120px_80px] px-6 py-3 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50"
            >
              <span>Project</span>
              <span>Report Type</span>
              <span>Status</span>
              <span>Submitted</span>
              <span />
            </div>

            {reports.map(r => (
              <Link
                key={r.id}
                to={`/agent/projects/${r.project_id || r.id}`}
                className="grid grid-cols-1 md:grid-cols-[1fr_160px_140px_120px_80px] items-center px-6 py-4 hover:bg-gray-50 transition-colors group gap-3 md:gap-0"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                    {r.project_title}
                  </p>
                  {r.verified_co2_amount && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {r.verified_co2_amount.toLocaleString()} tCO2e
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                    {r.report_type?.replace('_', ' ') || '—'}
                  </span>
                </div>

                <div>
                  <span className="inline-block text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                    {r.project_status?.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <FiClock className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="text-sm text-gray-500">
                    {new Date(r.submitted_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </span>
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