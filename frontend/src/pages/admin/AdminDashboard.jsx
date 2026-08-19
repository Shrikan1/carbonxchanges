import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import AdminHeader from '../../components/layout/AdminHeader';

const AdminDashboard = ({ data, isLoading }) => {
  const { user } = useAuthStore();
  const { users, projects, credits, pending_review_count, overdue_completions_count } = data || {};

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        <AdminHeader title="Admin Dashboard" pendingReviewCount={pending_review_count} />

        {/* Widgets Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[200px] skeleton-glare">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="space-y-3 mt-auto">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

            {/* Gross Volume / Credits */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Gross Volume</h3>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">₹{(credits?.total_platform_revenue || 0).toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium">Credits Sold</span>
                    <span className="text-gray-900 font-semibold">₹{(credits?.total_credits_sold || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium">Credits Minted</span>
                    <span className="text-gray-900 font-semibold">₹{(credits?.total_credits_minted || 0).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Platform Users */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Platform Users</h3>
              </div>

              {/* Donut Chart */}
              {(() => {
                const total = users?.total_users || 1;
                const sPct = ((users?.total_sellers || 0) / total) * 100;
                const bPct = ((users?.total_buyers || 0) / total) * 100;

                const gradient = `conic-gradient(
                #3b82f6 0% ${sPct}%, 
                #10b981 ${sPct}% ${sPct + bPct}%, 
                #fb923c ${sPct + bPct}% 100%
              )`;

                return (
                  <div className="flex justify-center mb-6 mt-2">
                    <div
                      className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-sm transition-all"
                      style={{ background: total > 1 ? gradient : '#f3f4f6' }}
                    >
                      <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">{(users?.total_users || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-4 text-sm mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-gray-500 font-medium">Sellers</span>
                  </div>
                  <span className="font-semibold text-gray-900">{users?.total_sellers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-500 font-medium">Buyers</span>
                  </div>
                  <span className="font-semibold text-gray-900">{users?.total_buyers || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                    <span className="text-gray-500 font-medium">Agents</span>
                  </div>
                  <span className="font-semibold text-gray-900">{users?.total_agents || 0}</span>
                </div>
              </div>
            </div>

            {/* Projects Pipeline */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col row-span-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Projects Pipeline</h3>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">{(projects?.total || 0).toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-500">Total</span>
              </div>

              <div className="space-y-3 text-sm flex-1">
                {['pending', 'assigned', 'verified', 'approved', 'minted'].map((status) => {
                  const count = projects?.[status] || 0;
                  const max = projects?.total || 1;
                  const percent = (count / max) * 100;
                  return (
                    <div key={status} className="flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500 capitalize text-xs font-medium">{status.replace('_', ' ')}</span>
                        <span className="font-semibold text-gray-900 text-xs">{count}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-900 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  )
                })}
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
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
