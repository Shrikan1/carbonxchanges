import { useEffect, useState } from 'react';
import { FiSearch, FiActivity, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import * as oversightApi from '../../api/endpoint/oversightApi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminOversightTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setIsLoading(true);
    oversightApi.getAllTransactions()
      .then((r) => setTransactions(r.data.data || []))
      .catch((err) => {
        if (err.response?.status === 404) setTransactions([]);
        else console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredTransactions = transactions.filter(t => 
    t.project_title?.toLowerCase().includes(search.toLowerCase()) || 
    t.buyer_name?.toLowerCase().includes(search.toLowerCase()) ||
    t.seller_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout title="Transactions Ledger" subtitle="Monitor credit transfers, purchases, and retirement activity.">
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto flex flex-col h-full">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          
          {/* Controls */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4 items-center shrink-0">
            <h2 className="text-lg font-bold text-gray-900 hidden sm:block">All Activity</h2>

            <div className="relative w-full sm:max-w-md shrink-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by project or user..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[35%]">Project</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[30%]">Transfer Details</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%] text-right">Volume (tCO₂e)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div><div className="h-3 bg-gray-100 rounded w-1/2"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                      <td className="px-6 py-5"><div className="h-5 bg-gray-100 rounded w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                          <FiActivity size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No transactions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((t) => (
                    <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 line-clamp-1">{t.project_title}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">TX: {t.id}</div>
                      </td>
                      <td className="px-6 py-4">
                        {t.type === 'purchase' ? (
                          <div className="flex items-center gap-3 text-sm font-medium text-gray-700">
                            <span className="truncate max-w-[120px]" title={t.seller_name}>{t.seller_name}</span>
                            <FiArrowRight className="text-gray-400 shrink-0" />
                            <span className="truncate max-w-[120px] text-gray-900" title={t.buyer_name}>{t.buyer_name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                            <FiCheckCircle className="text-emerald-500 shrink-0" />
                            <span>Retired by <strong className="text-gray-900">{t.buyer_name}</strong></span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                          t.type === 'purchase' 
                            ? 'bg-blue-50 text-blue-700 border-blue-200' 
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-gray-900">
                          {t.amount?.toLocaleString()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}