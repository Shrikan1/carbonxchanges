import { useEffect, useState } from 'react';
import * as salesApi from '../../api/endpoint/salesApi';
import SellerLayout from '../../components/layout/SellerLayout';
import { FiDownload, FiDollarSign, FiArrowRight, FiActivity, FiClock, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getCarbonTokenContract } from '../../lib/carbonTokenContract';
import { toOnChainAmount } from '../../lib/carbonTokenAbi';
import { useAuthStore } from '../../store/useAuthStore';

export default function SalesPage() {
  const [sales, setSales] = useState([]);
  const [pendingSales, setPendingSales] = useState([]);
  const [revenue, setRevenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [histRes, pendRes] = await Promise.all([
        salesApi.getSalesHistory(),
        salesApi.getPendingSales()
      ]);
      setSales(histRes.data.sales || []);
      setRevenue(histRes.data.revenue);
      setPendingSales(pendRes.data.sales || []);
    } catch (err) {
      console.error("Failed to load sales data:", err);
      toast.error('Failed to load sales data');
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteTransfer(sale) {
    if (!user?.wallet_address) {
      toast.error('Please connect your wallet first.');
      return;
    }
    
    setProcessingId(sale.id);
    try {
      const contract = await getCarbonTokenContract();
      const signerAddress = await contract.runner.getAddress();
      
      if (signerAddress.toLowerCase() !== user.wallet_address.toLowerCase()) {
         toast.error(`Please switch MetaMask to the wallet registered on this account (${user.wallet_address})`);
         setProcessingId(null);
         return;
      }
      
      const onChainAmount = toOnChainAmount(sale.amount);
      
      // Execute the on-chain transfer (ERC-1155)
      const tx = await contract.safeTransferFrom(
        signerAddress, 
        sale.buyer_wallet, 
        sale.batch_id, 
        onChainAmount, 
        "0x"
      );
      
      toast.loading('Transaction submitted, waiting for confirmation...', { id: 'tx' });
      const receipt = await tx.wait();
      
      // Tell backend to finalize it
      const { data } = await salesApi.completeSale(sale.id, receipt.hash);
      
      toast.success(data.message, { id: 'tx' });
      loadData(); // Refresh UI
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || err.reason || err.message || 'Transfer failed', { id: 'tx' });
    } finally {
      setProcessingId(null);
    }
  }

  async function handleReject(saleId) {
    if (!confirm('Are you sure you want to reject this purchase request? The reserved stock will be released.')) return;
    
    setProcessingId(saleId);
    try {
      const { data } = await salesApi.rejectSale(saleId);
      toast.success(data.message);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to reject sale');
    } finally {
      setProcessingId(null);
    }
  }

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
                  <span className="text-2xl text-emerald-500 font-medium">$</span>
                  {revenue ? Number(revenue.total_revenue).toLocaleString('en-US', { maximumFractionDigits: 0 }) : '0'}
                </div>
              </div>
            </div>

            {/* Sales Table & Pending */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
              {/* Pending Purchase Requests */}
              {pendingSales.length > 0 && (
                <div className="bg-amber-50 rounded-2xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
                  <div className="px-6 py-5 border-b border-amber-200 flex items-center gap-2">
                    <FiClock className="text-amber-600" />
                    <h3 className="text-base wise-font font-black uppercase text-amber-900 tracking-tight">Pending Requests</h3>
                  </div>
                  
                  <div className="divide-y divide-amber-100 bg-white">
                    {pendingSales.map((sale) => (
                      <div key={sale.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <p className="font-bold text-gray-900">{sale.project_title}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Buyer: <span className="font-medium text-gray-700">{sale.buyer_name}</span> ({sale.buyer_wallet})
                          </p>
                          <p className="text-sm font-mono mt-2 text-gray-600">
                            {Number(sale.amount).toLocaleString()} credits @ ${Number(sale.price_per_credit).toLocaleString()} = <span className="font-bold text-emerald-600">${Number(sale.amount * sale.price_per_credit).toLocaleString()}</span>
                          </p>
                        </div>
                        
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleReject(sale.id)}
                            disabled={processingId === sale.id}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                            title="Reject Request"
                          >
                            <FiX size={20} />
                          </button>
                          <button
                            onClick={() => handleCompleteTransfer(sale)}
                            disabled={processingId === sale.id}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                          >
                            {processingId === sale.id ? 'Processing...' : (
                              <>
                                <FiCheck size={18} /> Transfer Tokens
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transaction History */}
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
                              ${Number(s.price_per_credit).toLocaleString()}
                            </div>
                            
                            <div className="w-full text-right">
                              <div className="font-mono font-bold text-emerald-600 text-sm">
                                +${Number(s.total_price).toLocaleString('en-US', { maximumFractionDigits: 0 })}
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
