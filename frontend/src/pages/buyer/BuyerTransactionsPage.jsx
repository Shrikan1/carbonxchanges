import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerStore } from '../../store/useBuyerStore';
import BuyerLayout from '../../components/layout/BuyerLayout';
import {
  FiList, FiShoppingBag, FiZap, FiArrowRight, FiCheckCircle
} from 'react-icons/fi';

export default function BuyerTransactionsPage() {
  const { transactions, loading, fetchTransactions } = useBuyerStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <BuyerLayout
      title="Transaction History"
      subtitle="Complete chronological audit trail of all purchases and credit retirements."
    >
      <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5 lg:space-y-6">

        {/* ── TRANSACTIONS CARD ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight">
                Activity Log
              </h2>
              {transactions.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                  {transactions.length} {transactions.length === 1 ? 'Record' : 'Records'}
                </span>
              )}
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
            >
              Browse Marketplace <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="flex-1 bg-white">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-14 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                  <FiList className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No transactions recorded yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-6">
                  Every time you purchase carbon credits or retire them for ESG compliance, your activity is permanently logged here.
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
                <div className="hidden sm:grid grid-cols-[1fr_110px_130px_140px] px-6 py-3 text-[11px] font-mono font-bold tracking-wider text-gray-400 uppercase bg-gray-50/70 border-b border-gray-100">
                  <span>Project & Date</span>
                  <span>Type</span>
                  <span>Volume</span>
                  <span className="text-right">Unit Price</span>
                </div>
                {transactions.map((t) => (
                  <div key={t.id} className="group hover:bg-gray-50/50 transition-colors px-6 py-4">
                    <div className="flex flex-col sm:grid sm:grid-cols-[1fr_110px_130px_140px] gap-2.5 sm:gap-0 items-start sm:items-center">
                      <div className="min-w-0 pr-4">
                        <p className="font-semibold text-gray-900 text-sm truncate">{t.project_title || 'Carbon Offset'}</p>
                        <p className="text-xs text-gray-400 mt-0.5 font-mono">
                          {t.vintage_year ? `Vintage ${t.vintage_year}` : 'Verified Project'}
                          {t.created_at && ` · ${new Date(t.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}`}
                        </p>
                      </div>

                      <div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                          t.type === 'retire'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-blue-50 text-blue-800 border-blue-200'
                        }`}>
                          {t.type === 'retire' ? <FiZap size={10} /> : <FiShoppingBag size={10} />}
                          {t.type === 'retire' ? 'Retired' : 'Purchase'}
                        </span>
                      </div>

                      <div className="text-sm font-mono font-bold text-gray-900">
                        {Number(t.amount).toLocaleString()} <span className="text-xs font-normal text-gray-500">tCO₂e</span>
                      </div>

                      <div className="w-full sm:text-right">
                        <span className="text-xs font-mono font-medium text-gray-600">
                          {t.type === 'purchase' && t.price_per_credit
                            ? `₹${Number(t.price_per_credit).toLocaleString('en-IN')}/credit`
                            : 'Offset Complete'}
                        </span>
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
