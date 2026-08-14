import React from 'react';
import { FiSearch, FiBell, FiChevronDown, FiPlus, FiMoreHorizontal } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const AdminDashboard = ({ data }) => {
  const { user } = useAuthStore();
  const { users, projects, credits, pending_review_count, overdue_completions_count } = data || {};

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        {/* Unified Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 w-full relative">
          
          {/* Left: Heading */}
          <div className="flex items-center shrink-0">
            <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-gray-900 logo-retro" style={{ WebkitTextFillColor: '#111', background: 'none' }}>Admin Dashboard</h1>
          </div>

          {/* Center: Nav (Absolute centered on large screens) */}
          <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
            <nav className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100">
              <Link to="/dashboard" className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full">Home</Link>
              <Link to="/admin/projects" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Projects</Link>
              <Link to="/admin/oversight/users" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Users</Link>
              <Link to="/admin/oversight/transactions" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Transactions</Link>
              <Link to="/admin/mint-queue" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Minting</Link>
            </nav>
          </div>

          {/* Center Nav for Mobile (fallback) */}
          <div className="flex lg:hidden overflow-x-auto pb-2 scrollbar-hide w-full">
            <nav className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100 min-w-max">
              <Link to="/dashboard" className="px-5 py-2 text-sm font-medium bg-gray-900 text-white rounded-full">Home</Link>
              <Link to="/admin/projects" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Projects</Link>
              <Link to="/admin/oversight/users" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Users</Link>
              <Link to="/admin/oversight/transactions" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Transactions</Link>
              <Link to="/admin/mint-queue" className="px-5 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">Minting</Link>
            </nav>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
              <FiSearch size={18} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors relative">
              <FiBell size={18} />
              {pending_review_count > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
              )}
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-blue-100 to-orange-100 flex items-center justify-center shrink-0">
              <span className="font-semibold text-gray-700">{user?.name?.charAt(0) || 'A'}</span>
            </div>
          </div>
        </div>

        {/* Widgets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          {/* Gross Volume / Credits */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">Gross Volume</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">${(credits?.total_platform_revenue || 0).toLocaleString()}</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 font-medium">Credits Sold</span>
                  <span className="text-gray-900 font-semibold">${(credits?.total_credits_sold || 0).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-500 font-medium">Credits Minted</span>
                  <span className="text-gray-900 font-semibold">${(credits?.total_credits_minted || 0).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Platform Users */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">Platform Users</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">{(users?.total_users || 0).toLocaleString()}</span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Sellers</span>
                <span className="font-semibold text-gray-900">{users?.total_sellers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Buyers</span>
                <span className="font-semibold text-gray-900">{users?.total_buyers || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Agents</span>
                <span className="font-semibold text-gray-900">{users?.total_agents || 0}</span>
              </div>
            </div>
          </div>

          {/* Project Status */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-semibold text-gray-900">Projects</h3>
            </div>
            
            <div className="mb-6">
              <span className="text-3xl font-bold text-gray-900 tracking-tight">{(projects?.total || 0).toLocaleString()}</span>
            </div>

            <div className="space-y-2 text-sm">
              {['pending', 'assigned', 'in_progress', 'verified', 'approved', 'rejected', 'minted'].map(status => (
                <div key={status} className="flex justify-between">
                  <span className="text-gray-500 capitalize">{status.replace('_', ' ')}</span>
                  <span className="font-semibold text-gray-900">{projects?.[status] || 0}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div className="bg-gradient-to-br from-[#417698] via-[#8597a7] to-[#eeb075] rounded-3xl p-6 shadow-md border border-white/20 flex flex-col text-white relative overflow-hidden">
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium border border-white/20 mb-4">
                  Insights
                </div>
                
                <h4 className="text-xl font-semibold leading-tight mb-2">
                  Action Required
                </h4>
                
                <div className="space-y-3 mt-4 text-sm text-white/90">
                  <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg">
                    <span>Pending Review</span>
                    <span className="font-bold text-lg">{pending_review_count || 0}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/10 px-3 py-2 rounded-lg">
                    <span>Overdue Completions</span>
                    <span className="font-bold text-lg">{overdue_completions_count || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
