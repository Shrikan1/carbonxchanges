import React from 'react';
import SellerHeader from '../../components/layout/SellerHeader';

const SellerDashboard = ({ data, isLoading }) => {
  const {
    total_projects = 0,
    pending_projects = 0,
    approved_projects = 0,
    credits_issued = 0,
    credits_sold = 0,
    revenue = 0
  } = data || {};

  return (
    <div className="admin-theme min-h-[101vh] w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="Seller Dashboard" 
        pendingReviewCount={pending_projects} 
        contentMaxWidth="1400px"
      />
      <div className="w-full max-w-[1400px] px-4 md:px-8">
        
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

            {/* Financial Overview */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Total Revenue</h3>
              </div>

              <div className="mb-6">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">₹{(revenue || 0).toLocaleString('en-IN')}</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium">Credits Sold</span>
                    <span className="text-gray-900 font-semibold">{(credits_sold || 0).toLocaleString()}</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500 font-medium">Credits Issued</span>
                    <span className="text-gray-900 font-semibold">{(credits_issued || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Credits Performance (Donut Chart) */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">Credits Pool</h3>
              </div>

              {/* Donut Chart */}
              {(() => {
                const total = credits_issued || 1;
                const soldPct = ((credits_sold || 0) / total) * 100;
                const availPct = 100 - soldPct;

                const gradient = `conic-gradient(
                #10b981 0% ${soldPct}%, 
                #3b82f6 ${soldPct}% 100%
              )`;

                return (
                  <div className="flex justify-center mb-6 mt-2">
                    <div
                      className="relative w-32 h-32 rounded-full flex items-center justify-center shadow-sm transition-all"
                      style={{ background: credits_issued > 0 ? gradient : '#f3f4f6' }}
                    >
                      <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                        <span className="text-3xl font-bold text-gray-900 tracking-tight">{(credits_issued || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="space-y-4 text-sm mt-auto">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-500 font-medium">Sold</span>
                  </div>
                  <span className="font-semibold text-gray-900">{credits_sold || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div>
                    <span className="text-gray-500 font-medium">Available</span>
                  </div>
                  <span className="font-semibold text-gray-900">{credits_issued - credits_sold || 0}</span>
                </div>
              </div>
            </div>

            {/* Projects Pipeline */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col row-span-1">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-gray-900">My Projects</h3>
              </div>

              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900 tracking-tight">{(total_projects || 0).toLocaleString()}</span>
                <span className="text-sm font-medium text-gray-500">Total</span>
              </div>

              <div className="space-y-3 text-sm flex-1 mt-auto">
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 capitalize text-xs font-medium">Pending Review</span>
                    <span className="font-semibold text-gray-900 text-xs">{pending_projects || 0}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-400 rounded-full transition-all duration-500" style={{ width: `${total_projects ? (pending_projects / total_projects) * 100 : 0}%` }}></div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 capitalize text-xs font-medium">Approved</span>
                    <span className="font-semibold text-gray-900 text-xs">{approved_projects || 0}</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${total_projects ? (approved_projects / total_projects) * 100 : 0}%` }}></div>
                  </div>
                </div>
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
                      <span>Projects Pending</span>
                      <span className="font-bold text-lg">{pending_projects || 0}</span>
                    </div>
                    {pending_projects > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/20">
                        <p className="text-xs text-white/80">
                          You have {pending_projects} project(s) waiting for admin approval before they can be minted.
                        </p>
                      </div>
                    )}
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

export default SellerDashboard;
