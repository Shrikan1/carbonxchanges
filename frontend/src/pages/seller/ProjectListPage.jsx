import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';
import { Button } from '../../components/ui/Button';

const STATUS_COLORS = {
  draft: 'bg-muted text-muted-foreground',
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-blue-100 text-blue-800',
  verified: 'bg-purple-100 text-purple-800',
  approved: 'bg-purple-100 text-purple-800',
  minted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function ProjectListPage() {
  const { projects, loading, error, fetchProjects, submitForReview, deleteProject } = useSellerStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleSubmit(projectId) {
    try {
      await submitForReview(projectId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit — check all required fields are filled');
    }
  }

  async function handleDelete(projectId) {
    if (!confirm('Delete this draft project? This cannot be undone.')) return;
    try {
      await deleteProject(projectId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Projects</h1>
        <Link to="/seller/projects/new">
          <Button>Add Project</Button>
        </Link>
      </div>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && projects.length === 0 && (
        <p className="text-sm text-muted-foreground">No projects yet — click "Add Project" to register your first one.</p>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div key={project.id} className="border border-border rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="font-medium">{project.title}</p>
              <p className="text-sm text-muted-foreground">{project.project_type}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[project.status] || 'bg-muted'}`}>
                {project.status}
              </span>

              {project.status === 'draft' && (
                <>
                  <Button variant="outline" onClick={() => handleSubmit(project.id)}>
                    Submit for Review
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(project.id)}>
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}