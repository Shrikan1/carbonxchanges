import { Link } from 'react-router-dom';
import BuyerLayout from '../../components/layout/BuyerLayout';
import {
  FiShoppingBag, FiPieChart, FiZap, FiAward,
  FiArrowRight, FiList, FiCheckCircle,
} from 'react-icons/fi';

// ──────────────────────────────────────────────────────
// QUICK ACTIONS
// ──────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: 'Browse Marketplace',  to: '/marketplace',  icon: <FiShoppingBag className="w-5 h-5" /> },
  { label: 'View Portfolio',      to: '/buyer/portfolio',    icon: <FiPieChart    className="w-5 h-5" /> },
  { label: 'Retire Credits',      to: '/buyer/retire',       icon: <FiZap         className="w-5 h-5" /> },
  { label: 'My Certificates',     to: '/buyer/certificates', icon: <FiAward       className="w-5 h-5" /> },
  { label: 'Transaction History', to: '/buyer/transactions', icon: <FiList        className="w-5 h-5" /> },
  { label: 'Pending Orders',      to: '/buyer/orders',       icon: <FiShoppingBag className="w-5 h-5" /> },
];

export default function BuyerDashboard({ data, isLoading }) {
  const {
    total_purchased    = 0,
    total_retired      = 0,
    current_holdings   = 0,
    total_co2_offset   = 0,
    recent_transactions = [],
  } = data || {};

  // Retirement progress as a percentage of total purchased
  const retirementPct =
    total_purchased > 0
      ? Math.min(100, Math.round((total_retired / total_purchased) * 100))
      : 0;

  return (
    <BuyerLayout
      title="Buyer Dashboard"
      subtitle="Track your carbon credit purchases, holdings, and retirement impact."
    >
      <div className="p-6 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">

        {/* ── KEY METRICS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

          {/* Total Purchased — accent card */}
          <div className="bg-[#022c22] border border-[#022c22] rounded-2xl p-6 group hover:shadow-lg transition-all">
            <p className="text-xs font-semibold uppercase font-mono tracking-wider text-[#6ee7b7] mb-4">
              Total Purchased
            </p>
            {isLoading ? (
              <div className="h-12 w-20 bg-white/10 rounded animate-pulse" />
            ) : (
              <span className="text-5xl font-light tracking-tight text-white leading-none">
                {Number(total_purchased).toLocaleString()}
              </span>
            )}
            <p className="text-xs text-[#6ee7b7]/60 font-mono mt-2">tCO2e acquired</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 group hover:shadow-md transition-all">
            <p className="text-xs font-semibold uppercase font-mono tracking-wider text-gray-500 mb-4">
              Current Holdings
            </p>
            {isLoading ? (
              <div className="h-12 w-20 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-5xl font-light tracking-tight text-gray-900 leading-none">
                {Number(current_holdings).toLocaleString()}
              </span>
            )}
            <p className="text-xs text-gray-400 font-mono mt-2">tCO2e available</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 group hover:shadow-md transition-all">
            <p className="text-xs font-semibold uppercase font-mono tracking-wider text-gray-500 mb-4">
              Total Retired
            </p>
            {isLoading ? (
              <div className="h-12 w-20 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-5xl font-light tracking-tight text-gray-900 leading-none">
                {Number(total_retired).toLocaleString()}
              </span>
            )}
            <p className="text-xs text-gray-400 font-mono mt-2">tCO2e offset</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 group hover:shadow-md transition-all">
            <p className="text-xs font-semibold uppercase font-mono tracking-wider text-gray-500 mb-4">
              CO₂ Offset
            </p>
            {isLoading ? (
              <div className="h-12 w-20 bg-gray-100 rounded animate-pulse" />
            ) : (
              <span className="text-5xl font-light tracking-tight text-gray-900 leading-none">
                {Number(total_co2_offset).toLocaleString()}
              </span>
            )}
            <p className="text-xs text-gray-400 font-mono mt-2">tons verified</p>
          </div>
        </div>

        {/* ── MAIN WORKSPACE: 3 columns ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT: Recent Transactions (2 cols) */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">
                Recent Transactions
              </h2>
              <Link
                to="/buyer/transactions"
                className="text-sm font-medium font-mono text-emerald-600 hover:text-emerald-700"
              >
                View All
              </Link>
            </div>

            <div className="flex-1">
              {isLoading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-gray-50 rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : !recent_transactions || recent_transactions.length === 0 ? (
                <div className="p-12 text-center flex flex-col items-center justify-center h-full">
                  <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 mb-4">
                    <FiShoppingBag className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">No transactions yet</h3>
                  <p className="text-sm text-gray-500 mb-6 max-w-sm">
                    Browse the marketplace and purchase your first carbon credits.
                  </p>
                  <Link
                    to="/marketplace"
                    className="inline-flex items-center gap-2 bg-[#059669] hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
                  >
                    <FiShoppingBag className="w-4 h-4" /> Browse Marketplace
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {/* Table header */}
                  <div className="hidden md:grid grid-cols-[1fr_120px_100px_80px] px-6 py-3 text-xs font-semibold font-mono tracking-wider text-gray-500 uppercase bg-gray-50">
                    <span>Project</span>
                    <span>Amount</span>
                    <span>Type</span>
                    <span />
                  </div>
                  {recent_transactions.map((t) => (
                    <div
                      key={t.id}
                      className="grid grid-cols-1 md:grid-cols-[1fr_120px_100px_80px] items-center px-6 py-4 hover:bg-gray-50 transition-colors gap-3 md:gap-0"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{t.project_title}</p>
                        <p className="text-[11px] text-gray-500 mt-0.5 uppercase tracking-wider font-mono">
                          {t.vintage_year ? `Vintage ${t.vintage_year}` : ''}{' '}
                          {t.created_at ? `· ${new Date(t.created_at).toLocaleDateString()}` : ''}
                        </p>
                      </div>

                      <div className="text-sm font-mono text-gray-700 font-semibold">
                        {Number(t.amount).toLocaleString()} tCO2e
                      </div>

                      <div>
                        <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                          t.type === 'retire'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {t.type === 'retire' ? 'Retired' : 'Purchase'}
                        </span>
                      </div>

                      <div className="flex justify-end">
                        <span className="text-sm font-medium text-gray-400 flex items-center gap-1">
                          {t.type === 'purchase' && t.price_per_credit
                            ? `$${t.price_per_credit}/cr`
                            : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Retirement Progress */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm flex flex-col">
            <div className="px-6 py-5 border-b border-gray-200">
              <h2 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">
                Retirement Progress
              </h2>
            </div>
            <div className="p-6 flex-1 bg-gray-50/30 space-y-6">

              {/* Progress bar */}
              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-xs font-semibold font-mono text-gray-500 uppercase tracking-wider">
                    % Retired
                  </p>
                  <span className="text-2xl font-light text-gray-900">{retirementPct}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${retirementPct}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 font-mono mt-2">
                  {Number(total_retired).toLocaleString()} of {Number(total_purchased).toLocaleString()} tCO2e retired
                </p>
              </div>

              {/* Step breakdown */}
              <div className="relative pl-3 space-y-5">
                <div className="absolute left-[15px] top-2 bottom-4 w-px bg-gray-200" />
                {[
                  { label: 'PURCHASED',   desc: 'Credits acquired',    done: total_purchased > 0 },
                  { label: 'IN HOLDINGS', desc: 'Credits available',   done: current_holdings > 0 },
                  { label: 'INITIATED',   desc: 'Retire flow started', done: total_retired > 0 },
                  { label: 'RETIRED',     desc: 'On-chain burn confirmed', done: total_co2_offset > 0 },
                  { label: 'CERTIFIED',   desc: 'Certificate issued',  done: total_co2_offset > 0 },
                ].map((step, idx, arr) => {
                  const prev = idx === 0 ? true : arr[idx - 1].done;
                  const active = step.done;
                  const current = !active && prev;
                  return (
                    <div key={step.label} className="relative flex items-start gap-4">
                      <div className={`relative z-10 w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${
                        active   ? 'bg-emerald-500' :
                        current  ? 'bg-amber-400 ring-4 ring-amber-400/20' :
                        'bg-gray-300'
                      }`} />
                      <div>
                        <p className={`text-sm font-semibold font-mono tracking-wide ${
                          active || current ? 'text-gray-900' : 'text-gray-400'
                        }`}>{step.label}</p>
                        <p className="text-xs font-mono text-gray-500 mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>

        {/* ── ACTION AREA & HOLDINGS SUMMARY ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* CTA banner */}
          <div className="lg:col-span-2 flex flex-col sm:flex-row items-center gap-4 bg-emerald-50 border border-emerald-100 rounded-2xl p-6">
            <div className="flex-1">
              <h3 className="text-lg wise-font font-black uppercase text-emerald-900">
                Offset your footprint
              </h3>
              <p className="text-sm font-mono text-emerald-700 mt-1">
                Retire your held credits to make a verified, permanent carbon offset claim.
              </p>
            </div>
            <Link
              to="/buyer/retire"
              className="shrink-0 bg-[#6ee7b7] hover:bg-emerald-300 text-[#0c0c0c] px-6 py-3.5 font-mono font-bold transition-colors shadow-[4px_4px_0_0_#0c0c0c] border border-[#0c0c0c] flex items-center gap-2"
            >
              <FiZap /> Retire Credits
            </Link>
          </div>

          {/* Holdings summary */}
          <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Holdings Overview
            </h3>
            {total_purchased === 0 ? (
              <div className="text-center">
                <FiCheckCircle className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-gray-900 mb-1">No credits yet</p>
                <p className="text-xs text-gray-500">Purchase credits from the marketplace to get started.</p>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Purchased</span>
                  <span className="font-semibold text-gray-900">{Number(total_purchased).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 font-medium">Retired</span>
                  <span className="font-semibold text-gray-900">{Number(total_retired).toLocaleString()}</span>
                </div>
                <div className="w-full h-px bg-gray-100 my-2" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-900 font-semibold">Remaining</span>
                  <span className="font-bold text-emerald-600">
                    {(Number(total_purchased) - Number(total_retired)).toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── QUICK NAV CARDS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.to}
              to={action.to}
              className="flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-2xl p-5 text-center hover:border-emerald-300 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                {action.icon}
              </div>
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-gray-700 group-hover:text-emerald-700 transition-colors">
                {action.label}
              </span>
              <FiArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
            </Link>
          ))}
        </div>

      </div>
    </BuyerLayout>
  );
}
