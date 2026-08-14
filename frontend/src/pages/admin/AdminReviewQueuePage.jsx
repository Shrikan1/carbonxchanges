import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import { Select } from '../../components/ui/Select';

const STATUSES = ['pending', 'assigned', 'in_progress', 'verified', 'approved', 'rejected', 'minted'];

export default function AdminReviewQueuePage() {
  const [status, setStatus] = useState('pending');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [status]);

  async function load() {
    setLoading(true);
    try {
      const { data } = await adminProjectApi.getReviewQueue(status);
      setProjects(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setProjects([]);
      } else {
        console.error("Failed to load review queue", err);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Project Review Queue</h1>
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-48">
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </Select>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && projects.length === 0 && <p className="text-sm text-muted-foreground">No projects with this status.</p>}

      <div className="space-y-2">
        {projects.map((p) => (
          <Link
            key={p.id}
            to={`/admin/projects/${p.id}`}
            className="block border border-border rounded-lg p-4 hover:bg-muted"
          >
            <p className="font-medium">{p.title}</p>
            <p className="text-sm text-muted-foreground">{p.seller_name} — {p.project_type}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}