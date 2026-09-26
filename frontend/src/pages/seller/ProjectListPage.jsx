import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';
import { useAuthStore } from '../../store/useAuthStore';
import * as walletApi from '../../api/endpoint/Walletapi';
import { connectMetaMask } from '../../hook/useMetamask';
import SellerLayout from '../../components/layout/SellerLayout';
import { FiPlus, FiBox, FiSend, FiTrash2, FiArrowRight } from 'react-icons/fi';

const STATUS_CONFIG = {
  draft: { color: 'bg-gray-100 text-gray-600 border-gray-200', label: 'Draft' },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200', label: 'Pending Review' },
  assigned: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'Assigned' },
  in_progress: { color: 'bg-blue-50 text-blue-700 border-blue-200', label: 'In Progress' },
  verified: { color: 'bg-purple-50 text-purple-700 border-purple-200', label: 'Verified' },
  approved: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Approved' },
  minted: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Minted' },
  rejected: { color: 'bg-red-50 text-red-700 border-red-200', label: 'Rejected' },
};

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects, submitForReview, deleteProject } = useSellerStore();
  const { user, updateUser } = useAuthStore();
  const [walletLoading, setWalletLoading] = useState(false);
  const [filter, setFilter] = useState('All');

  const filteredProjects = projects.filter(p => {
    if (filter === 'All') return true;
    if (filter === 'Drafts') return p.status === 'draft';
    if (filter === 'Pending') return ['pending', 'assigned', 'in_progress'].includes(p.status);
    if (filter === 'Approved') return ['approved', 'verified', 'minted'].includes(p.status);
    return true;
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleSubmit(e, projectId) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await submitForReview(projectId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit — check all required fields are filled');
    }
  }

  async function handleDelete(e, projectId) {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Delete this draft project? This cannot be undone.')) return;
    try {
      await deleteProject(projectId);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete project');
    }
  }

  async function handleConnectWallet(e) {
    e.preventDefault();
    e.stopPropagation();
    setWalletLoading(true);
    try {
      const address = await connectMetaMask();
      const { data } = await walletApi.connectWallet(address);
      updateUser({ wallet_address: data.wallet.wallet_address });
    } catch (err) {
      alert(err.response?.data?.error || err.message || 'Failed to connect wallet');
    } finally {
      setWalletLoading(false);
    }
  }

  return (
    <SellerLayout title="My Projects" subtitle="Manage your registered carbon projects.">
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        
        {/* Actions Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
            {['All', 'Drafts', 'Pending', 'Approved'].map(tab => (
              <button 
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-1.5 text-sm font-semibold transition-colors rounded-md ${
                  filter === tab 
                    ? 'bg-emerald-50 text-emerald-700' 
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <Link to="/seller/projects/new" className="bg-[#173d25] hover:bg-[#0f2f1b] text-white font-bold uppercase tracking-wider text-sm px-5 py-2.5 flex items-center justify-center gap-2 transition-colors rounded-lg shadow-sm">
            <FiPlus /> Create Project
          </Link>
        </div>

        {/* Content */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : projects.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <FiBox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No projects found</h3>
              <p className="text-sm text-gray-500 mb-6 max-w-md">You haven't registered any projects yet. Add your first carbon project to begin.</p>
              <Link to="/seller/projects/new" className="bg-[#173d25] hover:bg-[#0f2f1b] text-white font-bold uppercase tracking-wider text-sm px-5 py-2.5 flex items-center justify-center gap-2 transition-colors rounded-lg shadow-sm">
                Create Project
              </Link>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-16 text-center flex flex-col items-center justify-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No {filter.toLowerCase()} projects</h3>
              <p className="text-sm text-gray-500">You don't have any projects in this category.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              <div className="hidden md:grid grid-cols-[1.5fr_1fr_120px_1fr_1fr] px-6 py-4 text-xs font-semibold tracking-wider text-gray-500 uppercase bg-gray-50">
                <span>Project Name</span>
                <span>Type & Location</span>
                <span>ID</span>
                <span>Status</span>
                <span className="text-right">Action</span>
              </div>
              
              {filteredProjects.map((project) => {
                const status = STATUS_CONFIG[project.status] || STATUS_CONFIG.draft;
                const isDraft = project.status === 'draft';
                const isApprovedWalletPending = project.status === 'approved' && !user?.wallet_address;
                
                return (
                  <div key={project.id} className="group hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col md:grid md:grid-cols-[1.5fr_1fr_120px_1fr_1fr] gap-4 md:gap-0 items-start md:items-center px-6 py-5">
                      
                      {/* Column 1: Name */}
                      <div className="min-w-0 pr-4 w-full">
                        <Link to={isDraft ? `/seller/projects/${project.id}/edit` : `/seller/projects/${project.id}/details`} className="block">
                          <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                            {project.title || 'Untitled Project'}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            Added {new Date(project.created_at).toLocaleDateString()}
                          </p>
                        </Link>
                      </div>

                      {/* Column 2: Type/Loc */}
                      <div className="text-xs text-gray-600 uppercase tracking-wider font-bold">
                        {project.project_type?.replace('_', ' ')}
                        {project.country && <span className="block text-gray-400 mt-0.5">{project.country}</span>}
                      </div>

                      {/* Column 3: ID */}
                      <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded w-fit font-medium">
                        CXP-{String(project.id).substring(0,6).toUpperCase()}
                      </div>

                      {/* Column 4: Status */}
                      <div>
                        <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${status.color}`}>
                          {status.label}
                        </span>
                        {isApprovedWalletPending && (
                          <span className="block text-[10px] text-amber-600 font-medium mt-1">Wallet missing</span>
                        )}
                      </div>

                      {/* Column 5: Action */}
                      <div className="flex justify-end w-full">
                        {isDraft ? (
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={(e) => handleSubmit(e, project.id)}
                              className="text-[11px] font-bold tracking-wider uppercase bg-[#173d25] hover:bg-[#0f2f1b] text-white px-3 py-1.5 transition-colors flex items-center gap-1.5 rounded-md shadow-sm"
                            >
                              <FiSend /> Submit
                            </button>
                            <button 
                              onClick={(e) => handleDelete(e, project.id)}
                              className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors"
                              title="Delete Draft"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        ) : isApprovedWalletPending ? (
                          <button 
                            onClick={handleConnectWallet}
                            disabled={walletLoading}
                            className="text-[11px] font-bold tracking-wider uppercase bg-[#10b981] hover:bg-emerald-600 text-white px-3 py-1.5 transition-colors flex items-center gap-1.5 rounded-md shadow-sm"
                          >
                            <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-3.5 h-3.5 bg-white rounded-full p-0.5" />
                            {walletLoading ? 'Connecting...' : 'Connect'}
                          </button>
                        ) : (
                          <Link 
                            to={`/seller/projects/${project.id}/details`}
                            className="text-[11px] font-bold tracking-wider uppercase bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 px-3 py-1.5 transition-colors flex items-center justify-center gap-1.5 rounded-md shadow-sm"
                          >
                            View <FiArrowRight />
                          </Link>
                        )}
                      </div>
                      
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </SellerLayout>
  );
}
