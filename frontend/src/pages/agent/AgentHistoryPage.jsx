import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import AgentHeader from '../../components/layout/AgentHeader';
import { FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

export default function AgentHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setLoading(true);
    agentApi.getVerificationHistory()
      .then((r) => setReports(r.data.reports || []))
      .catch((e) => console.error("Failed to load history", e))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-gray-50/50">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">
        
        <AgentHeader title="Verification History" hideNav={false} />

        <div className="flex flex-col md:flex-row gap-6 items-start w-full mt-4">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 flex flex-col gap-6">

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
          
            <div className="mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Past Verifications</h2>
            <p className="text-sm text-gray-500 mt-1">Projects you have reviewed and submitted reports for.</p>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-100 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 py-20">
              <p>You haven't submitted any verification reports yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div 
                  key={r.id} 
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl hover:border-gray-200 hover:shadow-sm transition-all"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 capitalize">
                        {r.report_type?.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-gray-50 text-gray-600 capitalize">
                        Status: {r.project_status?.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-bold text-gray-900">{r.project_title}</h3>
                  </div>
                  
                  <div className="text-left sm:text-right flex flex-col sm:items-end justify-center">
                    {r.verified_co2_amount && (
                      <span className="text-sm font-bold text-gray-900 bg-gray-100 px-3 py-1 rounded-lg">
                        {r.verified_co2_amount.toLocaleString()} tCO2e
                      </span>
                    )}
                    <span className="text-xs font-medium text-gray-400 mt-2">
                      Submitted: {new Date(r.submitted_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          </div>
        </div>
      </div>
    </div>
  );
}