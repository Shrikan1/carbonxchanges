import { useEffect, useState } from 'react';
import * as salesApi from '../../api/endpoint/salesApi';
import SellerLayout from '../../components/layout/SellerLayout';
import { FiDownload, FiDollarSign, FiArrowRight, FiActivity } from 'react-icons/fi';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    salesApi.getSalesHistory().then((r) => {
      setSales(r.data.sales || []);
      setRevenue(r.data.revenue);
    }).catch(err => {
      console.error("Failed to load sales history:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <SellerLayout title="Sales" subtitle="Track completed and pending credit transactions.">
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        
        {/* Header Actions */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl wise-font font-black uppercase text-gray-900 tracking-tight">Sales Overview</h2>
          <button 
            onClick={() => salesApi.downloadSalesReport()}
            className="text-[11px] font-mono font-bold uppercase tracking-widest bg-white border border-[#0c0c0c] text-[#0c0c0c] hover:bg-gray-50 px-4 py-2 transition-colors flex items-center gap-2 shadow-[2px_2px_0_0_#0c0c0c]"
          >
            <FiDownload /> Download CSV
          </button>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-32 bg-gray-50 rounded-2xl animate-pulse" />
            <div className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Revenue Widget */}
            <div className="lg:col-span-1">
              <div className="bg-[#022c22] border border-[#022c22] rounded-2xl p-6 shadow-md flex flex-col justify-center items-start lg:sticky lg:top-6">
                <div className="w-12 h-12 bg-white/10 text-[#bef264] rounded-xl flex items-center justify-center mb-6">
                  <FiDollarSign size={24} />
                </div>
                <p className="text-xs font-mono text-[#bef264] font-bold uppercase tracking-wider mb-2">Total Revenue</p>
                <div className="text-5xl font-mono font-bold text-white tracking-tight flex items-baseline gap-1">
                  <span className="text-2xl text-emerald-500 font-medium">₹</span>
                  {revenue ? Number(revenue.total_revenue).toLocaleString('en-IN', { maximumFractionDigits: 0 }) : '0'}
                </div>
              </div>
            </div>

            {/* Sales Table */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
                  <FiActivity className="text-emerald-600" />
                  <h3 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">Transaction History</h3>
                </div>
                
                <div className="flex-1 bg-gray-50/30">
                  {sales.length === 0 ? (
                    <div className="p-16 text-center flex flex-col items-center justify-center h-full">
                      <FiActivity className="w-8 h-8 text-gray-300 mb-3" />
                      <p className="text-sm font-mono text-gray-500">No sales history found.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      <div className="hidden sm:grid grid-cols-[1fr_120px_100px_100px] px-6 py-3 text-xs font-mono font-bold tracking-wider text-gray-500 uppercase bg-gray-50">
                        <span>Transaction</span>
                        <span>Amount</span>
                        <span>Price</span>
                        <span className="text-right">Total</span>
                      </div>
                      {sales.map((s) => (
                        <div key={s.id} className="group hover:bg-gray-50/50 transition-colors px-6 py-4">
                          <div className="flex flex-col sm:grid sm:grid-cols-[1fr_120px_100px_100px] gap-3 sm:gap-0 items-start sm:items-center">
                            
                            <div className="min-w-0 pr-4 w-full">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-mono font-bold text-gray-900 text-sm truncate">{s.project_title}</span>
                                <FiArrowRight className="text-gray-400 shrink-0" size={12} />
                                <span className="font-mono font-bold text-[#0c0c0c] bg-primary border border-[#0c0c0c] px-2 py-0.5 text-[10px] uppercase tracking-wider shrink-0">{s.buyer_name}</span>
                              </div>
                              <p className="text-xs text-gray-500 font-mono">ID: #{s.id}</p>
                            </div>
                            
                            <div className="text-sm font-mono font-bold text-gray-900">
                              {Number(s.amount).toLocaleString()} <span className="text-xs font-mono text-gray-500">credits</span>
                            </div>

                            <div className="text-sm font-mono text-gray-600">
                              ₹{Number(s.price_per_credit).toLocaleString()}
                            </div>
                            
                            <div className="w-full text-right">
                              <div className="font-mono font-bold text-emerald-600 text-sm">
                                +₹{Number(s.total_price).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                              </div>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </SellerLayout>
  );
}