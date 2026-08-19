import { useEffect, useState } from 'react';
import * as salesApi from '../../api/endpoint/salesApi';
import { Button } from '../../components/ui/Button';
import { FiDownload, FiDollarSign, FiArrowRight } from 'react-icons/fi';
import { motion } from 'motion/react';
import SellerHeader from '../../components/layout/SellerHeader';

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
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="Sales History" 
        description="Track your credit sales and total revenue."
        contentMaxWidth="900px"
        action={
          <Button 
            variant="outline" 
            onClick={() => salesApi.downloadSalesReport()}
            className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900 rounded-xl px-6 h-11 font-semibold flex items-center gap-2 shadow-sm"
          >
            <FiDownload size={16} />
            <span>Download CSV</span>
          </Button>
        }
      />
      <div className="w-full max-w-[900px] px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >

          {/* Revenue Card */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-200/80 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <FiDollarSign size={24} />
            </div>
            <div>
              <p className="text-[13px] font-medium text-gray-500 mb-0.5">Total Revenue</p>
              <div className="text-3xl font-bold text-gray-900 tracking-tight">
                ₹{revenue ? Number(revenue.total_revenue).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
              </div>
            </div>
          </div>

          {/* Sales List */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200/80 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="text-[16px] font-semibold text-gray-900">Recent Transactions</div>
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
                        {Number(s.amount).toLocaleString()} credits @ ₹{Number(s.price_per_credit).toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-emerald-600 text-lg">
                        +₹{Number(s.total_price).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
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