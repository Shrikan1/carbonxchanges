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
      <div className="p-6 lg:p-8 max-w-[1200px] mx-auto w-full space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-emerald-500 mb-4" />
            <p className="text-gray-500 font-mono font-medium">Loading your credits...</p>
          </div>
        ) : (
          <>
            {/* Top Summary */}
            {balance && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-start">
                  <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
                    <FiDatabase size={20} />
                  </div>
                  <p className="text-xs font-mono text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Minted</p>
                  <p className="text-4xl font-light text-gray-900 tracking-tight">{balance.total_minted}</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-center items-start">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                    <FiTrendingUp size={20} />
                  </div>
                  <p className="text-xs font-mono text-gray-500 font-semibold uppercase tracking-wider mb-1">Total Sold</p>
                  <p className="text-4xl font-light text-gray-900 tracking-tight">{balance.total_sold}</p>
                </div>
                
                <div className="bg-[#022c22] border border-[#022c22] rounded-2xl p-6 shadow-md flex flex-col justify-center items-start">
                  <div className="w-10 h-10 bg-white/10 text-[#bef264] rounded-xl flex items-center justify-center mb-4">
                    <FiCheckCircle size={20} />
                  </div>
                  <p className="text-xs font-mono text-[#bef264] font-semibold uppercase tracking-wider mb-1">Remaining Balance</p>
                  <p className="text-4xl font-light text-white tracking-tight">{balance.remaining_balance}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Issued Batches */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
                  <FiArchive className="text-emerald-600" />
                  <h2 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">Issued Batches</h2>
                </div>
                
                <div className="flex-1 p-6 bg-gray-50/30">
                  {issued.length === 0 ? (
                    <div className="text-center py-10">
                      <FiArchive className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-mono text-sm">No credit batches have been minted yet.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {issued.map((batch) => (
                        <div key={batch.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center shadow-sm">
                          <div>
                            <span className="block font-mono font-semibold text-gray-900 text-sm truncate">{batch.project_title}</span>
                            <span className="text-xs font-mono text-gray-500 font-medium">Batch {String(batch.id).substring(0,6).toUpperCase()} • {batch.vintage_year}</span>
                          </div>
                          <div className="bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-sm font-bold font-mono border border-emerald-100 shrink-0">
                            {batch.token_amount} tCO2e
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction History */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center gap-2">
                  <FiTrendingUp className="text-emerald-600" />
                  <h2 className="text-base wise-font font-black uppercase text-gray-900 tracking-tight">Recent Activity</h2>
                </div>
                
                <div className="flex-1">
                  {history.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50/30 h-full flex flex-col justify-center">
                      <FiTrendingUp className="w-8 h-8 mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500 font-mono text-sm">No credit transactions yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {history.map((tx) => (
                        <div key={tx.id} className="px-6 py-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
                          <div>
                            <span className="block text-sm font-mono font-semibold text-gray-900 uppercase tracking-wider">
                              {tx.transaction_type.replace('_', ' ')}
                            </span>
                            <span className="text-xs font-mono text-gray-500">
                              {new Date(tx.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`block font-mono font-bold text-sm ${tx.transaction_type === 'mint' ? 'text-emerald-600' : 'text-gray-900'}`}>
                              {tx.transaction_type === 'mint' ? '+' : '-'}{tx.amount} credits
                            </span>
                            {tx.price_per_credit && (
                              <span className="text-xs font-mono text-gray-500">@ ${tx.price_per_credit}/each</span>
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