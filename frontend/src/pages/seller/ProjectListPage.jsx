import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';
import { Button } from '../../components/ui/Button';
import { FiPlus, FiBox, FiClock, FiCheckCircle, FiAlertCircle, FiSend, FiTrash2 } from 'react-icons/fi';
import { motion } from 'motion/react';
import Navbar from '../../components/layout/Navbar';

const STATUS_CONFIG = {
  draft: { color: 'bg-gray-100 text-gray-700 border-gray-200', icon: FiBox, label: 'Draft' },
  pending: { color: 'bg-yellow-50 text-yellow-700 border-yellow-200', icon: FiClock, label: 'Pending Review' },
  assigned: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'Assigned' },
  in_progress: { color: 'bg-blue-50 text-blue-700 border-blue-200', icon: FiCheckCircle, label: 'In Progress' },
  verified: { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: FiCheckCircle, label: 'Verified' },
  approved: { color: 'bg-purple-50 text-purple-700 border-purple-200', icon: FiCheckCircle, label: 'Approved' },
  minted: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: FiCheckCircle, label: 'Minted' },
  rejected: { color: 'bg-red-50 text-red-700 border-red-200', icon: FiAlertCircle, label: 'Rejected' },
};

export default function ProjectListPage() {
  const navigate = useNavigate();
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
    if (!window.confirm('Delete this draft project? This cannot be undone.')) return;
    try {
      await deleteProject(projectId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 pt-24 pb-12 font-sans">
      <Navbar />
      <div className="w-full max-w-[1200px] px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 !font-sans !normal-case">My Projects</div>
              <p className="text-gray-500 text-sm">Manage your registered carbon reduction projects.</p>
            </div>
            <Link to="/seller/projects/new">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 font-semibold flex items-center gap-2 shadow-sm">
                <FiPlus size={18} />
                <span>Add Project</span>
              </Button>
            </Link>
          </div>

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-2xl mb-8 flex items-center gap-3">
              <FiAlertCircle size={20} />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm animate-pulse h-48" />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && projects.length === 0 && (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <FiBox size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-500 mb-6 max-w-md">You haven't registered any projects yet. Add your first carbon reduction project to start issuing credits.</p>
              <Link to="/seller/projects/new">
                <Button className="bg-gray-900 hover:bg-black text-white rounded-xl px-6">
                  Create Project
                </Button>
              </Link>
            </div>
          )}

          {/* Projects Grid */}
          {!loading && projects.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => {
                const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;
                const StatusIcon = status.icon;

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={project.id} 
                    className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
                    onClick={() => navigate(`/seller/projects/${project.id}/verification`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.color}`}>
                        <StatusIcon size={12} />
                        {status.label}
                      </div>
                    </div>

                    <div className="flex-1 mb-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {project.title || 'Untitled Project'}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">{project.project_type || 'Unspecified Type'}</p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      {project.status === 'draft' ? (
                        <div className="flex gap-2 w-full">
                          <Button 
                            className="flex-1 bg-gray-900 hover:bg-black text-white rounded-xl h-9 text-xs font-semibold"
                            onClick={(e) => { e.stopPropagation(); handleSubmit(project.id); }}
                          >
                            <FiSend className="mr-1.5" size={12} /> Submit
                          </Button>
                          <Button 
                            className="bg-red-50 hover:bg-red-100 text-red-600 border-none rounded-xl h-9 px-3"
                            onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                            title="Delete Draft"
                          >
                            <FiTrash2 size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-sm font-medium text-emerald-600 flex items-center gap-1.5">
                          View Details &rarr;
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}