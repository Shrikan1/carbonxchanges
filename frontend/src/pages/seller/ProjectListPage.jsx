import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSellerStore } from '../../store/useSellerStore';
import { Button } from '../../components/ui/Button';
import { FiPlus, FiBox, FiClock, FiCheckCircle, FiAlertCircle, FiSend, FiTrash2 } from 'react-icons/fi';
import { motion } from 'motion/react';
import SellerHeader from '../../components/layout/SellerHeader';
import { useAuthStore } from '../../store/useAuthStore';
import * as walletApi from '../../api/endpoint/Walletapi';
import { connectMetaMask } from '../../hook/Usemetamask';
import { useState } from 'react';

const STATUS_CONFIG = {
  draft: { color: 'bg-gray-50 text-gray-700 border-gray-200', icon: FiBox, label: 'Draft' },
  pending: { color: 'bg-amber-50 text-amber-700 border-amber-200/60', icon: FiClock, label: 'Pending Review' },
  assigned: { color: 'bg-blue-50 text-blue-700 border-blue-200/60', icon: FiCheckCircle, label: 'Assigned' },
  in_progress: { color: 'bg-blue-50 text-blue-700 border-blue-200/60', icon: FiCheckCircle, label: 'In Progress' },
  verified: { color: 'bg-purple-50 text-purple-700 border-purple-200/60', icon: FiCheckCircle, label: 'Verified' },
  approved: { color: 'bg-purple-50 text-purple-700 border-purple-200/60', icon: FiCheckCircle, label: 'Approved' },
  minted: { color: 'bg-emerald-50 text-emerald-700 border-emerald-200/60', icon: FiCheckCircle, label: 'Minted' },
  rejected: { color: 'bg-red-50 text-red-700 border-red-200/60', icon: FiAlertCircle, label: 'Rejected' },
};

export default function ProjectListPage() {
  const navigate = useNavigate();
  const { projects, loading, error, fetchProjects, submitForReview, deleteProject } = useSellerStore();
  const { user, updateUser } = useAuthStore();
  const [walletLoading, setWalletLoading] = useState(false);
  const [walletError, setWalletError] = useState(null);

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

  async function handleConnectWallet(e) {
    e.stopPropagation();
    setWalletError(null);
    setWalletLoading(true);
    try {
      const address = await connectMetaMask();
      const { data } = await walletApi.connectWallet(address);
      updateUser({ wallet_address: data.wallet.wallet_address });
    } catch (err) {
      setWalletError(err.response?.data?.error || err.message || 'Failed to connect wallet');
      alert(err.response?.data?.error || err.message || 'Failed to connect wallet');
    } finally {
      setWalletLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="My Projects" 
        description="Manage your registered carbon reduction projects."
        contentMaxWidth="1200px"
        action={
          <Link to="/seller/projects/new" className="bg-brand hover:bg-brand-hover text-gray-900 font-bold h-10 px-6 rounded-xl flex items-center justify-center transition-colors shadow-sm">
            + Add Project
          </Link>
        }
      />
      
      <div className="w-full max-w-[1200px] px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
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
                <div key={i} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm skeleton-glare h-48" />
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

                if (project.status === 'approved' && !user?.wallet_address) {
                  return (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={project.id} 
                      className="bg-white rounded-2xl p-6 border-2 border-brand shadow-lg flex flex-col group relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-brand rounded-full blur-3xl opacity-20 -mr-10 -mt-10 pointer-events-none" />
                      
                      <div className="flex justify-between items-start mb-4 relative z-10">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-medium border ${status.color}`}>
                          <StatusIcon size={14} />
                          Project Approved 🎉
                        </div>
                      </div>

                      <div className="flex-1 mb-6 relative z-10">
                        <div className="text-[18px] font-semibold text-gray-900 mb-1.5 line-clamp-2 leading-snug">
                          {project.title || 'Untitled Project'}
                        </div>
                        <p className="text-[14px] text-gray-500 mb-4">Your project is approved and ready for minting. Connect your Web3 wallet to continue.</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto relative z-10">
                        <Button 
                          onClick={handleConnectWallet}
                          disabled={walletLoading}
                          className="w-full bg-gray-900 hover:bg-black text-white rounded-xl h-12 text-[14px] font-bold flex items-center justify-center gap-2 shadow-md"
                        >
                          <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-5 h-5" />
                          {walletLoading ? 'Connecting...' : 'Connect MetaMask'}
                        </Button>
                      </div>
                    </motion.div>
                  );
                }

                return (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={project.id} 
                    className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-sm hover:shadow-md transition-all flex flex-col group cursor-pointer"
                    onClick={() => {
                      if (project.status === 'draft') {
                        navigate(`/seller/projects/${project.id}/edit`);
                      } else {
                        navigate(`/projects/${project.id}`);
                      }
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-[13px] font-medium border ${status.color}`}>
                        <StatusIcon size={14} />
                        {status.label}
                      </div>
                    </div>

                    <div className="flex-1 mb-6">
                      <div className="text-[18px] font-semibold text-gray-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                        {project.title || 'Untitled Project'}
                      </div>
                      <p className="text-[14px] text-gray-500 capitalize">{project.project_type || 'Unspecified Type'}</p>
                    </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                      {project.status === 'draft' ? (
                        <div className="flex gap-2 w-full">
                          <Button 
                            className="flex-1 bg-gray-900 hover:bg-black text-white rounded-lg h-9 text-[13px] font-semibold"
                            onClick={(e) => { e.stopPropagation(); handleSubmit(project.id); }}
                          >
                            <FiSend className="mr-1.5" size={14} /> Submit
                          </Button>
                          <Button 
                            className="bg-white hover:bg-red-50 text-red-500 hover:text-red-600 border border-gray-200 hover:border-red-200 rounded-lg h-9 px-3 transition-colors"
                            onClick={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                            title="Delete Draft"
                          >
                            <FiTrash2 size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between w-full">
                          {project.status === 'approved' && user?.wallet_address ? (
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span className="text-[12px] font-mono text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                                {user.wallet_address.slice(0,6)}...{user.wallet_address.slice(-4)}
                              </span>
                            </div>
                          ) : <div />}
                          <div className="text-[14px] font-medium text-gray-500 group-hover:text-gray-900 flex items-center gap-1 transition-colors">
                            {project.status === 'approved' && user?.wallet_address ? 'Continue' : 'View Details'}
                            <svg className="w-4 h-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                          </div>
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
