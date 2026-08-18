import { useEffect, useState } from 'react';
import * as adminApi from '../../api/endpoint/adminApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

export default function AdminAgentsPage() {
  const [agents, setAgents] = useState([]);
  const [form, setForm] = useState({ name: '', email: '' });
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    try {
      const { data } = await adminApi.getAllAgents();
      setAgents(data.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setAgents([]);
      } else {
        console.error('Failed to load agents:', err);
      }
    }
  }

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    setCreating(true);
    try {
      await adminApi.createAgent(form.name, form.email);
      setForm({ name: '', email: '' });
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create agent');
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl uppercase logo-retro tracking-tighter">Agent Management</h1>

      <form onSubmit={handleCreate} className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Create Agent</h2>
        <p className="text-xs text-muted-foreground">
          A temporary password will be emailed to the agent — no OTP step, they're verified immediately.
        </p>
        <div>
          <Label>Name</Label>
          <Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create Agent'}</Button>
      </form>

      <div className="space-y-2">
        <h2 className="font-semibold">Agent Roster</h2>
        {(agents || []).map((agent) => (
          <div key={agent.id} className="border border-border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{agent.name}</p>
              <p className="text-sm text-muted-foreground">{agent.email}</p>
            </div>
            <div className="text-sm text-right">
              <p>{agent.workload?.active_count || 0} active</p>
              <p className="text-muted-foreground">{agent.workload?.completed_count || 0} completed</p>
            </div>
          </div>
        ))}
        {(!agents || agents.length === 0) && (
          <p className="text-sm text-muted-foreground p-4 text-center border border-border rounded-lg">
            No agents found. Create one above.
          </p>
        )}
      </div>
    </div>
  );
}