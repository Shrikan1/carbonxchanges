import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BuyerLayout from '../../components/layout/BuyerLayout';
import * as buyerApi from '../../api/endpoint/buyerApi';
import {
  FiClock, FiCheckCircle, FiXCircle, FiShoppingBag, FiInfo, FiArrowRight
} from 'react-icons/fi';

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
    <BuyerLayout
      title="Pending Orders"
      subtitle="Track your purchase requests while sellers process on-chain token settlement."
    >
      <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5 lg:space-y-6">

        {/* ── INFO HELPER BANNER ── */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
          <FiInfo className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">How purchases work:</span> When you place an order, your carbon credits are instantly reserved so they cannot be oversold. The seller is notified to sign and submit the on-chain transfer to your wallet.
          </div>
        </div>

        {/* ── ORDERS CONTAINER CARD ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight">
                Order History & Status
              </h2>
              {orders.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                  {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </span>
              )}
            </div>
            <Link
              to="/marketplace"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
            >
              Marketplace <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="flex-1 bg-white">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-14 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                  <FiShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No purchase orders found</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-6">
                  You haven&apos;t placed any purchase requests yet. Browse available listings to acquire verified carbon credits.
                </p>
                <Link
                  to="/marketplace"
                  className="inline-flex items-center gap-2 bg-[#173d25] hover:bg-[#112d1b] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <FiShoppingBag className="w-4 h-4" /> Browse Marketplace
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {orders.map((o) => {
                  const amount = Number(o.amount || 0);
                  const price = Number(o.price_per_credit || 0);
                  const total = amount * price;

                  return (
                    <div key={o.id} className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-semibold text-gray-900 text-sm md:text-base">
                              {o.project_title}
                            </span>
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              o.status === 'pending'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : o.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                              {o.status === 'pending' && <FiClock size={11} />}
                              {o.status === 'completed' && <FiCheckCircle size={11} />}
                              {o.status === 'rejected' && <FiXCircle size={11} />}
                              {o.status}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500">
                            Seller: <span className="font-medium text-gray-700">{o.seller_name || 'Project Owner'}</span>
                            {o.created_at && (
                              <span className="text-gray-400"> · Ordered on {new Date(o.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                            )}
                          </p>

                          <p className="text-xs font-mono text-gray-700 pt-1">
                            <span className="font-bold text-gray-900">{amount.toLocaleString()} credits</span>
                            {' '}@ ₹{price.toLocaleString('en-IN')}/credit = <span className="font-bold text-emerald-700">₹{total.toLocaleString('en-IN')}</span>
                          </p>
                        </div>

                        <div className="sm:text-right shrink-0">
                          <div className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border border-gray-100 max-w-xs sm:ml-auto">
                            {o.status === 'pending' && (
                              <p className="flex items-start gap-1.5 text-amber-900 font-medium">
                                <FiClock size={13} className="shrink-0 mt-0.5 text-amber-600" />
                                Awaiting seller to sign on-chain token transfer.
                              </p>
                            )}
                            {o.status === 'completed' && (
                              <p className="flex items-start gap-1.5 text-emerald-900 font-medium">
                                <FiCheckCircle size={13} className="shrink-0 mt-0.5 text-emerald-600" />
                                Transferred to wallet. Available in Portfolio.
                              </p>
                            )}
                            {o.status === 'rejected' && (
                              <p className="flex items-start gap-1.5 text-red-900 font-medium">
                                <FiXCircle size={13} className="shrink-0 mt-0.5 text-red-600" />
                                Request declined by seller.
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>
    </BuyerLayout>
  );
}
