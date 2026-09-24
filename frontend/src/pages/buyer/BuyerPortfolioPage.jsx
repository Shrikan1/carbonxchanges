import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerStore } from '../../store/useBuyerStore';
import BuyerLayout from '../../components/layout/BuyerLayout';

export default function BuyerPortfolioPage() {
  const { portfolio, loading, fetchPortfolio } = useBuyerStore();

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const { summary, holdings } = portfolio;

  return (
    <BuyerLayout title="Portfolio" subtitle="Your current carbon credit holdings.">
      <div className="max-w-3xl mx-auto p-6 space-y-6">

        {loading && <p className="text-sm text-gray-400">Loading...</p>}

        {summary && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="text-sm text-gray-500">Total Purchased</p>
              <p className="text-xl font-bold mt-1">{summary.total_purchased}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="text-sm text-gray-500">Total Retired</p>
              <p className="text-xl font-bold mt-1">{summary.total_retired}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <p className="text-sm text-gray-500">Current Holdings</p>
              <p className="text-xl font-bold mt-1">{summary.current_holdings}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <h2 className="font-semibold text-gray-700">Holdings by Project</h2>
          {holdings.map((h) => (
            <div
              key={h.batch_id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-medium">{h.project_title}</p>
                <p className="text-sm text-gray-500">{h.project_type}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">{h.current_holding} tCO2e</p>
                <Link
                  to={`/buyer/retire?batch_id=${h.batch_id}`}
                  className="text-sm text-emerald-600 underline"
                >
                  Retire these credits
                </Link>
              </div>
            </div>
          ))}
          {!loading && holdings.length === 0 && (
            <p className="text-sm text-gray-400">No current holdings.</p>
          )}
        </div>
      </div>
    </BuyerLayout>
  );
}
