import { useEffect, useState } from 'react';
import * as agentApi from '../../api/endpoint/agentApi';

export default function AgentHistoryPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    agentApi.getVerificationHistory().then((r) => setReports(r.data.reports));
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Verification History</h1>
      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="border border-border rounded-lg p-4 flex justify-between text-sm">
            <div>
              <p className="font-medium">{r.project_title}</p>
              <p className="text-muted-foreground">{r.report_type} — {new Date(r.submitted_at).toLocaleDateString()}</p>
            </div>
            <div className="text-right">
              {r.verified_co2_amount && <p>{r.verified_co2_amount} tCO2e</p>}
              <p className="text-muted-foreground">{r.project_status}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}