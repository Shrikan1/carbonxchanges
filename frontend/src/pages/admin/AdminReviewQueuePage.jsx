import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import { useAuthStore } from '../../store/useAuthStore';

const STATUSES = ['pending', 'assigned', 'in_progress', 'verified', 'approved', 'rejected', 'minted'];

export default function AdminReviewQueuePage() {
  const { user } = useAuthStore();
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
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        {/* Unified Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 w-full relative">
          
          {/* Left: Heading */}
          <div className="flex items-center shrink-0">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 logo-retro" style={{ WebkitTextFillColor: '#111', background: 'none' }}>Project Review</h1>
          </div>

          {/* Center: Nav (Absolute centered on large screens) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
            <nav className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100">
              <Link to="/dashboard" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Home</Link>
              <Link to="/admin/projects" className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full transition-colors">Projects</Link>
              <Link to="/admin/oversight/users" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Users</Link>
              <Link to="/admin/oversight/transactions" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Transactions</Link>
              <Link to="/admin/mint-queue" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Minting</Link>
            </nav>
          </div>

          {/* Center Nav for Mobile (fallback) */}
          <div className="flex lg:hidden overflow-x-auto pb-2 scrollbar-hide w-full">
            <nav className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100 min-w-max">
              <Link to="/dashboard" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Home</Link>
              <Link to="/admin/projects" className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full transition-colors">Projects</Link>
              <Link to="/admin/oversight/users" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Users</Link>
              <Link to="/admin/oversight/transactions" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Transactions</Link>
              <Link to="/admin/mint-queue" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors rounded-full">Minting</Link>
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
              <FiSearch size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors relative">
              <FiBell size={18} />
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-blue-100 to-orange-100 flex items-center justify-center shrink-0">
              <span className="font-semibold text-gray-700">{user?.name?.charAt(0) || 'A'}</span>
            </div>
          </div>
        </div>

        {/* Filters & Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          <div className="flex flex-col gap-4 mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Queue Management</h2>
            
            <div className="flex items-center overflow-x-auto w-full pb-2 scrollbar-hide">
              <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-100 min-w-max">
                {STATUSES.map(s => (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    className={`px-5 py-2 text-sm font-medium rounded-md transition-all ${status === s ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'}`}
                  >
                    {s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Project List */}
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : projects.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-3">
              <FiSearch size={32} className="opacity-20" />
              <p>No projects found in '{status}' queue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {projects.map((p) => (
                <Link
                  key={p.id}
                  to={`/admin/projects/${p.id}`}
                  className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md hover:border-gray-200 transition-all"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                      {p.project_type || 'Carbon Project'}
                    </div>
                    {p.created_at && (
                      <span className="text-xs font-medium text-gray-400">{new Date(p.created_at).toLocaleDateString()}</span>
                    )}
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">{p.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{p.description || "No description provided."}</p>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center text-xs font-bold text-green-800 shrink-0">
                        {p.seller_name?.charAt(0) || 'S'}
                      </div>
                      <span className="text-sm font-medium text-gray-700 line-clamp-1">{p.seller_name || 'Seller'}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 shrink-0">{p.total_credits_estimated || 0} Credits</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}