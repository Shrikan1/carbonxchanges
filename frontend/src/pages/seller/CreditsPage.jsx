import { useEffect, useState } from 'react';
import * as creditApi from '../../api/endpoint/creditApi';
import SellerLayout from '../../components/layout/SellerLayout';
import { FiDatabase, FiTrendingUp, FiCheckCircle, FiArchive } from 'react-icons/fi';

export default function CreditsPage() {
  const [issued, setIssued] = useState([]);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      creditApi.getIssuedCredits(),
      creditApi.getCreditHistory(),
      creditApi.getCreditBalance()
    ]).then(([issuedRes, historyRes, balanceRes]) => {
      setIssued(issuedRes.data.data || []);
      setHistory(historyRes.data.data || []);
      setBalance(balanceRes.data.balance);
    }).catch(err => {
      console.error("Failed to load credits page data:", err);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <SellerLayout title="Credits" subtitle="Track credits issued from your verified projects.">
      <div className="p-4 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-4" />
            <p className="text-gray-500 font-medium">Loading your credits...</p>
          </div>
        ) : (
          <>
            {/* Top Summary */}
            {balance && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm flex flex-col justify-center items-start">
                  <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center mb-3">
                    <FiDatabase size={16} />
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 truncate w-full">Total Minted</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{balance.total_minted}</p>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-5 shadow-sm flex flex-col justify-center items-start">
                  <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
                    <FiTrendingUp size={16} />
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-widest mb-1 truncate w-full">Total Sold</p>
                  <p className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{balance.total_sold}</p>
                </div>

                <div className="bg-[#173d25] border border-[#173d25] rounded-xl p-4 md:p-5 shadow-sm flex flex-col justify-center items-start col-span-2 md:col-span-1">
                  <div className="w-8 h-8 bg-white/10 text-emerald-400 rounded-lg flex items-center justify-center mb-3">
                    <FiCheckCircle size={16} />
                  </div>
                  <p className="text-[10px] md:text-xs text-emerald-400 font-bold uppercase tracking-widest mb-1 truncate w-full">Remaining Balance</p>
                  <p className="text-2xl md:text-3xl font-bold text-white tracking-tight">{balance.remaining_balance}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              {/* Issued Batches */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
                  <FiArchive className="text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Issued Batches</h2>
                </div>

                <div className="flex-1 p-4 md:p-5 bg-gray-50/30">
                  {issued.length === 0 ? (
                    <div className="text-center py-8">
                      <FiArchive className="w-6 h-6 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 text-xs md:text-sm">No credit batches have been minted yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {issued.map((batch) => (
                        <div key={batch.id} className="bg-white border border-gray-200 rounded-lg p-3 md:p-4 flex justify-between items-center shadow-sm">
                          <div className="flex-1 min-w-0 pr-3">
                            <span className="block font-bold text-gray-900 text-xs md:text-sm truncate">{batch.project_title}</span>
                            <span className="text-[10px] md:text-xs text-gray-500 font-medium">Batch {String(batch.id).substring(0, 6).toUpperCase()} • {batch.vintage_year}</span>
                          </div>
                          <div className="bg-emerald-50 text-emerald-700 px-2 md:px-3 py-1 md:py-1.5 rounded text-[10px] md:text-xs font-bold border border-emerald-100 shrink-0">
                            {batch.token_amount} tCO2e
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-600" />
                  <h2 className="text-sm font-bold uppercase text-gray-900 tracking-wider">Recent Activity</h2>
                </div>

                <div className="flex-1">
                  {history.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50/30 h-full flex flex-col justify-center">
                      <FiTrendingUp className="w-6 h-6 mx-auto text-gray-300 mb-2" />
                      <p className="text-gray-500 text-xs md:text-sm">No credit transactions yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {history.map((tx) => (
                        <div key={tx.id} className="px-5 py-3 md:py-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                          <div className="flex-1 min-w-0">
                            <span className="block text-[11px] md:text-xs font-bold text-gray-900 uppercase tracking-widest truncate">
                              {tx.transaction_type.replace('_', ' ')}
                            </span>
                            <span className="text-[10px] md:text-xs text-gray-500">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right shrink-0">
                            <span className={`block font-bold text-xs md:text-sm ${tx.transaction_type === 'mint' ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {tx.transaction_type === 'mint' ? '+' : '-'}{tx.amount}
                            </span>
                            {tx.price_per_credit && (
                              <span className="text-[10px] md:text-xs text-gray-500">@ ${tx.price_per_credit}/ea</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </SellerLayout>
  );
}