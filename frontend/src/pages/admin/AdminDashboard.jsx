import React from 'react';
import AdminLayout from '../../components/layout/AdminLayout';
import { 
  FiFolder, FiClock, FiCheckCircle, FiCpu, 
  FiUsers, FiShoppingBag, FiUserCheck, FiDollarSign 
} from 'react-icons/fi';
import { motion } from 'motion/react';

const StatCard = ({ title, value, icon, loading, subtitle, trend }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</h3>
      </div>
    </div>
    
    {loading ? (
      <div className="h-10 bg-gray-100 rounded animate-pulse w-1/2"></div>
    ) : (
      <div>
        <div className="text-3xl font-bold text-gray-900 tracking-tight">{value}</div>
        {subtitle && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm font-medium text-gray-500">{subtitle}</span>
          </div>
        )}
      </div>
    )}
  </div>
);

export default function AdminDashboard({ data, isLoading }) {
  const { users, projects, credits, pending_review_count } = data || {};

  return (
    <AdminLayout title="Admin Dashboard" subtitle="Monitor platform activity, project verification and credit issuance.">
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto space-y-8">
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            title="Total Projects" 
            value={projects?.total?.toLocaleString() || '0'} 
            icon={<FiFolder size={20} />} 
            loading={isLoading}
          />
          <StatCard 
            title="Pending Review" 
            value={pending_review_count || '0'} 
            icon={<FiClock size={20} className="text-orange-500" />} 
            loading={isLoading}
            subtitle={pending_review_count > 0 ? 'Requires immediate action' : 'All caught up'}
          />
          <StatCard 
            title="Approved / Verified" 
            value={(projects?.approved || 0) + (projects?.verified || 0)} 
            icon={<FiCheckCircle size={20} className="text-emerald-500" />} 
            loading={isLoading}
          />
          <StatCard 
            title="Credits Minted" 
            value={credits?.total_credits_minted?.toLocaleString() || '0'} 
            icon={<FiCpu size={20} className="text-blue-500" />} 
            loading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Verification Pipeline */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 lg:p-8">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Verification Pipeline</h2>
            
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="h-12 bg-gray-50 rounded-lg animate-pulse" />)}
              </div>
            ) : (
              <div className="relative">
                <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-100 z-0 hidden sm:block"></div>
                <div className="space-y-3 relative z-10">
                  
                  {[
                    { key: 'pending', label: 'Pending', icon: FiClock, color: 'orange' },
                    { key: 'assigned', label: 'Assigned to Agent', icon: FiUserCheck, color: 'blue' },
                    { key: 'verified', label: 'Agent Verified', icon: FiCheckCircle, color: 'emerald' },
                    { key: 'approved', label: 'Admin Approved', icon: FiCheckCircle, color: 'emerald' },
                    { key: 'minted', label: 'Minted on-chain', icon: FiCpu, color: 'indigo' },
                  ].map((stage, idx) => {
                    const count = projects?.[stage.key] || 0;
                    return (
                      <div key={stage.key} className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-lg p-2 sm:p-0 sm:bg-transparent sm:border-none sm:rounded-none">
                        <div className={`w-10 h-10 shrink-0 bg-white border-2 border-${stage.color}-100 rounded-full flex items-center justify-center text-${stage.color}-600 shadow-sm z-10`}>
                          <stage.icon size={16} />
                        </div>
                        <div className="flex-1 flex justify-between items-center bg-white sm:bg-gray-50 border border-gray-100 py-2 px-4 rounded-lg shadow-sm">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{stage.label}</p>
                          </div>
                          <div className="text-lg font-bold text-gray-900">
                            {count}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Platform Overview & Finance */}
          <div className="space-y-8">
            
            {/* Platform Users */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-6">Platform Overview</h2>
              
              {isLoading ? (
                <div className="h-40 bg-gray-50 rounded-xl animate-pulse"></div>
              ) : (
                <div>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-4xl font-bold text-gray-900 tracking-tight">{users?.total_users || 0}</span>
                    <span className="text-sm font-medium text-gray-500 pb-1">Total Users</span>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <FiFolder className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">Sellers</span>
                      </div>
                      <span className="font-bold text-gray-900">{users?.total_sellers || 0}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <FiShoppingBag className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">Buyers</span>
                      </div>
                      <span className="font-bold text-gray-900">{users?.total_buyers || 0}</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="flex items-center gap-3">
                        <FiUserCheck className="text-gray-500" />
                        <span className="text-sm font-semibold text-gray-700">Agents</span>
                      </div>
                      <span className="font-bold text-gray-900">{users?.total_agents || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Financial Overview */}
            <div className="bg-[#0f172a] rounded-2xl border border-slate-800 shadow-lg p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
              <h2 className="text-lg font-bold text-white mb-6 relative z-10 flex items-center gap-2">
                <FiDollarSign className="text-emerald-400" /> Gross Volume
              </h2>
              
              {isLoading ? (
                <div className="h-12 bg-slate-800/50 rounded-xl animate-pulse"></div>
              ) : (
                <div className="relative z-10">
                  <div className="mb-6">
                    <span className="text-3xl font-black tracking-tight">
                      ₹{credits?.total_platform_revenue?.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="space-y-3 pt-4 border-t border-slate-700/50">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Credits Sold</span>
                      <span className="font-semibold">₹{credits?.total_credits_sold?.toLocaleString('en-IN') || 0}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
        
      </div>
    </AdminLayout>
  );
}
