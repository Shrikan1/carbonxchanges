import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerStore } from '../../store/useBuyerStore';
import BuyerLayout from '../../components/layout/BuyerLayout';
import {
  FiPieChart, FiShoppingBag, FiZap, FiArrowRight
} from 'react-icons/fi';

export default function BuyerPortfolioPage() {
  const { portfolio, loading, fetchPortfolio } = useBuyerStore();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const { summary, holdings = [] } = portfolio;
  const totalPurchased = Number(summary?.total_purchased || 0);
  const totalRetired = Number(summary?.total_retired || 0);
  const currentHoldings = Number(summary?.current_holdings || 0);

  return (
    <BuyerLayout
      title="Portfolio"
      subtitle="Track your current carbon credit holdings and project allocations."
    >
      <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5 lg:space-y-6">

        {/* ── KEY METRICS ── */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {/* Current Holdings — primary card */}
          <div className="bg-[#173d25] border border-[#173d25] shadow-sm flex flex-col p-4 sm:p-5 rounded-lg text-white">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#bbf7d0] mb-2 truncate">
              Available Holdings
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-white/10 rounded animate-pulse" />
            ) : (
              <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-white leading-none">
                {currentHoldings.toLocaleString()} <span className="text-xs font-normal text-[#bbf7d0]">tCO₂e</span>
              </span>
            )}
            <p className="text-[11px] text-[#bbf7d0]/70 mt-2 truncate">Ready to retire or hold</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm flex flex-col p-4 sm:p-5 rounded-lg">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 truncate">
              Total Purchased
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 leading-none">
                {totalPurchased.toLocaleString()} <span className="text-xs font-normal text-gray-400">tCO₂e</span>
              </span>
            )}
            <p className="text-[11px] text-gray-400 mt-2 truncate">Cumulative acquired</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-sm flex flex-col p-4 sm:p-5 rounded-lg">
            <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-gray-500 mb-2 truncate">
              Total Retired
            </p>
            {loading ? (
              <div className="h-8 w-24 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900 leading-none">
                {totalRetired.toLocaleString()} <span className="text-xs font-normal text-gray-400">tCO₂e</span>
              </span>
            )}
            <p className="text-[11px] text-gray-400 mt-2 truncate">Permanently offset</p>
          </div>
        </div>

        {/* ── HOLDINGS TABLE CARD ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight">
                Holdings by Project
              </h2>
              {holdings.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {holdings.length} {holdings.length === 1 ? 'Project' : 'Projects'}
                </span>
              )}
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
            >
              Browse More <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="flex-1 bg-white">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : holdings.length === 0 ? (
              <div className="p-14 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                  <FiPieChart className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No carbon credits in your portfolio</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-6">
                  Explore verified climate projects in the marketplace to acquire carbon credits and offset your emissions footprint.
                </p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 bg-[#173d25] hover:bg-[#112d1b] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <FiShoppingBag className="w-4 h-4" /> Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                <div className="hidden sm:grid grid-cols-[1fr_130px_130px_130px] px-6 py-3 text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase bg-gray-50/70 border-b border-gray-100">
                  <span>Project</span>
                  <span>Batch</span>
                  <span>Available</span>
                  <span className="text-right">Action</span>
                </div>
                {holdings.map((h) => (
                  <div key={h.batch_id} className="group hover:bg-gray-50/50 transition-colors px-6 py-4">
                    <div className="flex flex-col sm:grid sm:grid-cols-[1fr_130px_130px_130px] gap-3 sm:gap-0 items-start sm:items-center">
                      <div className="min-w-0 pr-4">
                        <p className="font-semibold text-gray-900 text-sm truncate">{h.project_title}</p>
                        <p className="text-xs text-gray-400 mt-0.5 capitalize">{h.project_type?.replace(/_/g, ' ') || 'Carbon Project'}</p>
                      </div>

                      <div>
                        <span className="text-xs font-mono font-medium bg-gray-100 text-gray-700 px-2 py-0.5 rounded border border-gray-200">
                          B-{String(h.batch_id).padStart(4, '0')}
                        </span>
                      </div>

                      <div className="text-sm font-mono font-bold text-gray-900">
                        {Number(h.current_holding).toLocaleString()} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
                      </div>

                      <div className="w-full flex justify-end">
                        <Link
                          to={`/buyer/retire?batch_id=${h.batch_id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#173d25] hover:bg-[#112d1b] text-white text-xs font-bold rounded transition-colors shadow-xs"
                        >
                          <FiZap size={13} className="text-[#bef264]" /> Retire
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </BuyerLayout>
  );
}
