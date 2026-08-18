// src/pages/seller/CreditsPage.jsx
import { useEffect, useState } from 'react';
import * as creditApi from '../../api/endpoint/creditApi';
import SellerHeader from '../../components/layout/SellerHeader';

export default function CreditsPage() {
  const [issued, setIssued] = useState([]);
  const [history, setHistory] = useState([]);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    creditApi.getIssuedCredits().then((r) => setIssued(r.data.credits));
    creditApi.getCreditHistory().then((r) => setHistory(r.data.transactions));
    creditApi.getCreditBalance().then((r) => setBalance(r.data.balance));
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="Credits" 
        description="View your minted credits and transaction history."
        contentMaxWidth="900px"
      />
      <div className="w-full max-w-[900px] px-4 md:px-8">
        
        <div className="space-y-8 mt-4">

      {balance && (
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Minted</p>
            <p className="text-xl font-bold">{balance.total_minted}</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Sold</p>
            <p className="text-xl font-bold">{balance.total_sold}</p>
          </div>
          <div className="border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Remaining</p>
            <p className="text-xl font-bold">{balance.remaining_balance}</p>
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold mb-2">Issued Batches</h2>
        {issued.map((batch) => (
          <div key={batch.id} className="border-b border-border py-2 text-sm flex justify-between">
            <span>{batch.project_title} — Vintage {batch.vintage_year}</span>
            <span>{batch.token_amount} tCO2e</span>
          </div>
        ))}
      </div>

      <div>
        <h2 className="font-semibold mb-2">Sale Transactions</h2>
        {history.map((tx) => (
          <div key={tx.id} className="border-b border-border py-2 text-sm flex justify-between">
            <span>{tx.project_title} → {tx.buyer_name}</span>
            <span>{tx.amount} @ {tx.price_per_credit}</span>
          </div>
        ))}
      </div>
        </div>
      </div>
    </div>
  );
}