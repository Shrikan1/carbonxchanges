import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import AgentHeader from '../../components/layout/AgentHeader';
import { FiCheckCircle, FiClock, FiFileText, FiArrowRight } from 'react-icons/fi';

const AgentDashboard = ({ data, isLoading }) => {
  const { user } = useAuthStore();
  const { total_assigned, pending_verifications, completed_verifications } = data || {};

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-gray-50/50">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">
        
        <AgentHeader title="Agent Dashboard" />

        {/* Widgets Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[160px] skeleton-glare">
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-10 bg-gray-200 rounded w-1/4 mt-auto"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
            
            {/* Total Assigned */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-500 font-['JetBrains_Mono']">Total Assigned</h3>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <FiFileText className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <span className="text-4xl font-black text-gray-900 tracking-tight">{total_assigned || 0}</span>
                <p className="text-sm text-gray-500 mt-1 font-medium">Projects in pipeline</p>
              </div>
            </div>

            {/* Pending Verifications */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-500 font-['JetBrains_Mono']">Action Required</h3>
                <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                  <FiClock className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <span className="text-4xl font-black text-gray-900 tracking-tight">{pending_verifications || 0}</span>
                <p className="text-sm text-gray-500 mt-1 font-medium">Pending verifications</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col hover:border-gray-200 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[15px] font-bold uppercase tracking-wider text-gray-500 font-['JetBrains_Mono']">Completed</h3>
                <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <FiCheckCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-auto">
                <span className="text-4xl font-black text-gray-900 tracking-tight">{completed_verifications || 0}</span>
                <p className="text-sm text-gray-500 mt-1 font-medium">Successfully verified</p>
              </div>
            </div>

          </div>
        )}

        {/* Quick Actions Panel */}
        {!isLoading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#0f172a] rounded-3xl p-8 shadow-md flex flex-col text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Active Verifications</h3>
                <p className="text-white/70 mb-8 max-w-sm text-sm leading-relaxed">
                  You have {pending_verifications || 0} projects waiting for your review. Complete site visits and document verifications to move them forward.
                </p>
                <Link 
                  to="/agent/projects"
                  className="inline-flex items-center gap-2 bg-white text-[#0f172a] px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors shadow-sm"
                >
                  View Active Queue
                  <FiArrowRight />
                </Link>
              </div>
              {/* Decorative Circle */}
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 rounded-full blur-2xl"></div>
            </div>
            
            <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-3xl p-8 shadow-md flex flex-col text-white relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-3 tracking-tight">Verification History</h3>
                <p className="text-white/80 mb-8 max-w-sm text-sm leading-relaxed">
                  Review the {completed_verifications || 0} projects you've successfully verified and approved on the platform.
                </p>
                <Link 
                  to="/agent/history"
                  className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/30 transition-colors"
                >
                  View History
                  <FiArrowRight />
                </Link>
              </div>
              <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/10 rounded-full blur-xl"></div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AgentDashboard;
