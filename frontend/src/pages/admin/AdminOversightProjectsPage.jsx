import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as oversightApi from '../../api/endpoint/oversightApi';

export default function AdminOversightProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    oversightApi.getAllProjects()
      .then((r) => setProjects(r.data.data || []))
      .catch((err) => {
        if (err.response?.status === 404) setProjects([]);
        else console.error(err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Projects</h1>
      <div className="space-y-2">
        {projects.map((p) => (
          <Link key={p.id} to={`/admin/projects/${p.id}`} className="block border border-border rounded-lg p-4 hover:bg-muted">
            <div className="flex justify-between">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">
                  {p.seller_name} — Agent: {p.agent_name || 'unassigned'}
                </p>
              </div>
              <span className="text-xs self-center px-2 py-1 rounded-full bg-muted">{p.status}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}