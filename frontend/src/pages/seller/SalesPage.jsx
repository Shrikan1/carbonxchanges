import { useEffect, useState } from 'react';
import * as salesApi from '../../api/endpoint/salesApi';
import { Button } from '../../components/ui/Button';
import { FiDownload, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { motion } from 'motion/react';
import Navbar from '../../components/layout/Navbar';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [revenue, setRevenue] = useState(null);

  useEffect(() => {
    salesApi.getSalesHistory().then((r) => {
      setSales(r.data.sales);
      setRevenue(r.data.revenue);
    });
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 pt-24 pb-12 font-sans">
      <Navbar />
      <div className="w-full max-w-[900px] px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2 !font-sans !normal-case">Sales History</div>
              <p className="text-gray-500 text-sm">Track your credit sales and total revenue.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => salesApi.downloadSalesReport()}
              className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-6 h-11 font-semibold flex items-center gap-2 shadow-sm"
            >
              <FiDownload size={16} />
              <span>Download CSV</span>
            </Button>
          </div>

          {/* Revenue Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 mb-8 flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <FiDollarSign size={32} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Revenue</p>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight">
                ${revenue ? Number(revenue.total_revenue).toLocaleString(undefined, { minimumFractionDigits: 2 }) : '0.00'}
              </h2>
            </div>
          </div>

          {/* Sales List */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Recent Transactions</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {sales.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <p>No sales history found.</p>
                </div>
              ) : (
                sales.map((s) => (
                  <div key={s.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-gray-50/50 transition-colors">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{s.project_title}</span>
                        <FiArrowRight className="text-gray-400" size={14} />
                        <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full text-xs">{s.buyer_name}</span>
                      </div>
                      <p className="text-sm text-gray-500">
                        {Number(s.amount).toLocaleString()} credits @ ${Number(s.price_per_credit).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-lg">
                        +${Number(s.total_price).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <p className="text-xs text-gray-400">Transaction ID: #{s.id}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}