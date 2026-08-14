import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import * as oversightApi from '../../api/endpoint/oversightApi';
import { useAuthStore } from '../../store/useAuthStore';
import AdminHeader from '../../components/layout/AdminHeader';

export default function AdminOversightTransactionsPage() {
  const { user } = useAuthStore();
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
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        <AdminHeader title="All Transactions" />

        {/* Filters & Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          <div className="flex flex-col gap-4 mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">Transaction History</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Project</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Details</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Type</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-right">Amount (tCO2e)</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-10 text-center text-gray-400">
                      No transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {t.project_title}
                      </td>
                      <td className="px-6 py-4">
                        {t.type === 'purchase' ? (
                          <span className="text-gray-600">{t.seller_name} &rarr; {t.buyer_name}</span>
                        ) : (
                          <span className="text-gray-600">Retired by {t.buyer_name}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${t.type === 'purchase' ? 'bg-blue-100 text-blue-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                          {t.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-900 text-right">
                        {t.amount}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}