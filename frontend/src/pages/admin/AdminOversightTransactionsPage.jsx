import { useEffect, useState } from 'react';
import * as oversightApi from '../../api/endpoint/oversightApi';

export default function AdminOversightTransactionsPage() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    oversightApi.getAllTransactions()
      .then((r) => setTransactions(r.data.data || []))
      .catch((err) => {
        if (err.response?.status === 404) setTransactions([]);
        else console.error(err);
      });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Transactions</h1>
      <div className="space-y-2">
        {transactions.map((t) => (
          <div key={t.id} className="border border-border rounded-lg p-4 flex justify-between text-sm">
            <div>
              <p className="font-medium">{t.project_title}</p>
              <p className="text-muted-foreground">
                {t.type === 'purchase' ? `${t.seller_name} → ${t.buyer_name}` : `Retired by ${t.buyer_name}`}
              </p>
            </div>
            <div className="text-right">
              <p>{t.amount} tCO2e</p>
              <p className="text-muted-foreground">{t.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}