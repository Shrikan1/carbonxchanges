// src/pages/seller/CreditsPage.jsx
import { useEffect, useState } from 'react';
import * as creditApi from '../../api/endpoint/creditApi';
import SellerHeader from '../../components/layout/SellerHeader';
import { motion } from 'motion/react';
import { FiDatabase, FiTrendingUp, FiActivity, FiArchive, FiCheckCircle, FiLoader } from 'react-icons/fi';

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
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="Credits" 
        description="View your minted credits and transaction history."
        contentMaxWidth="900px"
      />
      <div className="w-full max-w-[900px] px-4 md:px-8">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FiLoader className="w-10 h-10 text-brand animate-spin mb-4" />
            <p className="text-gray-500 font-medium">Loading your credits...</p>
          </div>
        ) : (
          <div className="space-y-8 mt-4">

      {balance && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10"
        >
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-brand/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="w-10 h-10 bg-brand/20 text-brand-hover rounded-xl flex items-center justify-center mb-4">
              <FiDatabase size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Minted</p>
            <p className="text-3xl font-black text-gray-900">{balance.total_minted}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <FiTrendingUp size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Total Sold</p>
            <p className="text-3xl font-black text-gray-900">{balance.total_sold}</p>
          </div>
          <div className="bg-white/80 backdrop-blur-md border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col justify-center items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <FiCheckCircle size={20} />
            </div>
            <p className="text-sm text-gray-500 font-medium mb-1">Remaining Balance</p>
            <p className="text-3xl font-black text-gray-900">{balance.remaining_balance}</p>
          </div>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiArchive className="text-brand-hover" />
          Issued Batches
        </h2>
        
        {issued.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <FiArchive size={32} className="mx-auto text-gray-300 mb-3" />
             <p className="text-gray-500 font-medium text-sm">No credit batches have been minted yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {issued.map((batch) => (
              <div key={batch.id} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex justify-between items-center transition-colors hover:bg-white hover:shadow-sm">
                <div>
                  <span className="block font-bold text-gray-900">{batch.project_title}</span>
                  <span className="text-xs text-gray-500">Batch ID: {batch.id} • Vintage Year: {batch.vintage_year}</span>
                </div>
                <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold text-gray-900 shadow-sm">
                  {batch.token_amount} tCO2e
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FiActivity className="text-blue-500" />
          Sale Transactions
        </h2>
        
        {history.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <FiActivity size={32} className="mx-auto text-gray-300 mb-3" />
             <p className="text-gray-500 font-medium text-sm">You haven't made any sales yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((tx) => (
              <div key={tx.id} className="border border-gray-100 bg-gray-50/50 rounded-2xl p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center transition-colors hover:bg-white hover:shadow-sm">
                <div className="mb-3 sm:mb-0">
                  <span className="block font-bold text-gray-900">{tx.project_title}</span>
                  <span className="text-xs text-gray-500">Buyer: {tx.buyer_name}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-emerald-600 mb-0.5">
                    ${(Number(tx.amount) * Number(tx.price_per_credit)).toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {tx.amount} credits @ ${tx.price_per_credit}/ea
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}