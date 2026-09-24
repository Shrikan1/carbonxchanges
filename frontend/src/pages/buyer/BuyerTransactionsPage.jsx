import { useEffect } from 'react';
import { useBuyerStore } from '../../store/useBuyerStore';
import BuyerLayout from '../../components/layout/BuyerLayout';

export default function BuyerTransactionsPage() {
  const { transactions, fetchTransactions } = useBuyerStore();

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <BuyerLayout title="Transaction History" subtitle="All your purchases and retirements in one place.">
      <div className="max-w-3xl mx-auto p-6 space-y-4">

        {transactions.length === 0 && (
          <p className="text-sm text-gray-400">No transactions yet.</p>
        )}

        <div className="space-y-2">
          {transactions.map((t) => (
            <div
              key={t.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between text-sm bg-white"
            >
              <div>
                <p className="font-medium">{t.project_title}</p>
                <p className="text-gray-500">
                  Vintage {t.vintage_year} — {new Date(t.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <p className={t.type === 'retire' ? 'text-emerald-700 font-semibold' : ''}>
                  {t.amount} tCO2e
                </p>
                <p className="text-gray-500">
                  {t.type === 'purchase' ? `Bought @ $${t.price_per_credit}` : 'Retired'}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}
