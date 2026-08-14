import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as mintApi from '../../api/endpoint/mintApi';
import { Button } from '../../components/ui/Button';

export default function AdminMintQueuePage() {
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const { data } = await mintApi.getMintableProjects();
    setProjects(data.data || data.projects || []);
  }

  async function handleRetry(id) {
    setError(null);
    try {
      const { data } = await mintApi.retryMint(id);
      alert(data.message);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Retry failed — check the reason shown and resolve it first');
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Mint Queue</h1>
      <p className="text-sm text-muted-foreground">
        Approved projects still waiting to mint — usually because the seller hasn't connected a wallet yet.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {projects.length === 0 && <p className="text-sm text-muted-foreground">Nothing pending.</p>}

      <div className="space-y-2">
        {projects.map((p) => (
          <div key={p.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
            <Link to={`/admin/projects/${p.id}`} className="font-medium hover:underline">{p.title}</Link>
            <Button onClick={() => handleRetry(p.id)}>Retry Mint</Button>
          </div>
        ))}
      </div>
    </div>
  );
}