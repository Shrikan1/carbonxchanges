import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import { Button } from '../../components/ui/Button';

export default function AgentAssignedProjectsPage() {
  const [tab, setTab] = useState('active'); // 'active' | 'due' | 'all'
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
  }, [tab]);

  async function load() {
    setLoading(true);
    if (tab === 'due') {
      const { data } = await agentApi.getDueForCompletion();
      setProjects(data.projects);
    } else {
      const { data } = await agentApi.getAssignedProjects(tab === 'all' ? 'all' : undefined);
      setProjects(data.projects);
    }
    setLoading(false);
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl uppercase logo-retro tracking-tighter">Assigned Projects</h1>

      <div className="flex gap-2">
        <Button variant={tab === 'active' ? 'default' : 'outline'} onClick={() => setTab('active')}>Active Queue</Button>
        <Button variant={tab === 'due' ? 'default' : 'outline'} onClick={() => setTab('due')}>Due for Completion</Button>
        <Button variant={tab === 'all' ? 'default' : 'outline'} onClick={() => setTab('all')}>All History</Button>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {!loading && projects.length === 0 && <p className="text-sm text-muted-foreground">Nothing here.</p>}

      <div className="space-y-2">
        {projects.map((p) => (
          <Link key={p.id} to={`/agent/projects/${p.id}`} className="block border border-border rounded-lg p-4 hover:bg-muted">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-sm text-muted-foreground">{p.project_type}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-muted">{p.status}</span>
            </div>
            {p.expected_completion_date && (
              <p className="text-xs text-muted-foreground mt-1">
                Due: {new Date(p.expected_completion_date).toLocaleDateString()}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}