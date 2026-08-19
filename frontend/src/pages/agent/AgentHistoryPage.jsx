import { useEffect, useState } from 'react';
import * as agentApi from '../../api/endpoint/agentApi';
import AgentHeader from '../../components/layout/AgentHeader';

export default function AgentHistoryPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

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
        
        <AgentHeader title="Verification History" />

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          
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
  );
}