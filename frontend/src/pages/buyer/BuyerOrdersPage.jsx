import { useEffect, useState } from 'react';
import { useBuyerStore } from '../../store/useBuyerStore';
import BuyerLayout from '../../components/layout/BuyerLayout';
import * as buyerApi from '../../api/endpoint/buyerApi';
import { FiClock, FiCheck, FiX, FiInfo } from 'react-icons/fi';

export default function BuyerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await buyerApi.getMyPurchaseIntents();
        setOrders(data.sales || []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <BuyerLayout title="Pending Orders" subtitle="Track your purchase requests while sellers process the on-chain transfer.">
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        
        {loading ? (
          <p className="text-sm text-gray-400">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl shadow-sm">
            <FiClock className="w-10 h-10 text-gray-300 mb-4" />
            <p className="font-semibold text-gray-900">No active orders</p>
            <p className="text-sm text-gray-500 mt-1">When you request a purchase, it will appear here until the seller transfers the tokens.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o.id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gray-900 text-lg">{o.project_title}</p>
                    <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-wider rounded-full border ${
                      o.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      o.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    Seller: <span className="font-medium text-gray-700">{o.seller_name}</span>
                  </p>
                  <p className="text-sm font-mono mt-2 text-gray-600">
                    {Number(o.amount).toLocaleString()} credits @ ${Number(o.price_per_credit).toLocaleString()}
                  </p>
                </div>
                
                <div className="text-left sm:text-right w-full sm:w-auto">
                  <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100 flex items-start gap-2 max-w-xs">
                    <FiInfo className="text-gray-400 shrink-0 mt-0.5" />
                    {o.status === 'pending' && <p>Awaiting seller to sign the on-chain transfer in MetaMask. Your tokens are reserved.</p>}
                    {o.status === 'completed' && <p>Tokens transferred successfully. Check your Portfolio.</p>}
                    {o.status === 'rejected' && <p>Seller declined the request. No tokens were transferred.</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </BuyerLayout>
  );
}
