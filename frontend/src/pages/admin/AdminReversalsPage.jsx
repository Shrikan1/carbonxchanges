import { useEffect, useState } from 'react';
import * as reversalApi from '../../api/endpoint/reversalApi';
import { Button } from '../../components/ui/Button';

export default function AdminReversalsPage() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const { data } = await reversalApi.getFlaggedReversals();
      setReports(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setReports([]);
      } else {
        console.error("Failed to load reversals:", err);
      }
    }
  }

  async function handleResolve(reportId) {
    if (!confirm('Confirm this reversal? This will cancel buffer credits to cover it — buyer holdings are never touched.')) return;
    setError(null);
    try {
      const { data } = await reversalApi.resolveReversal(reportId);
      alert(data.message);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resolve reversal');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl uppercase wise-font font-black tracking-tighter">Reversal Queue</h1>
      <p className="text-sm text-muted-foreground">
        Flagged by agent re-inspections. Resolving cancels buffer pool credits only — never a buyer's holdings.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {reports.length === 0 && <p className="text-sm text-muted-foreground">No unresolved reversals.</p>}

      <div className="space-y-2">
        {reports.map((r) => (
          <div key={r.id} className="border border-border rounded-lg p-4 space-y-2">
            <p className="font-medium">{r.project_title}</p>
            <p className="text-sm">Reversal amount: {r.reversal_amount} tCO2e</p>
            {r.notes && <p className="text-sm text-muted-foreground">{r.notes}</p>}
            <Button onClick={() => handleResolve(r.id)}>Confirm & Resolve</Button>
          </div>
        ))}
      </div>
    </div>
  );
}