import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiBell } from 'react-icons/fi';
import * as oversightApi from '../../api/endpoint/oversightApi';
import { useAuthStore } from '../../store/useAuthStore';
import AdminHeader from '../../components/layout/AdminHeader';

export default function AdminOversightUsersPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    oversightApi.getAllUsers()
      .then((r) => setUsers(r.data.data || []))
      .catch((err) => {
        if (err.response?.status === 404) setUsers([]);
        else console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">

        <AdminHeader title="Platform Users" />

        {/* Filters & Content */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col min-h-[600px]">
          <div className="flex flex-col gap-4 mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
                <tr>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Name</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Email</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900">Role</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-center">Seller</th>
                  <th scope="col" className="px-6 py-3 font-semibold text-gray-900 text-center">Buyer</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="bg-white border-b border-gray-100 animate-pulse">
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-3/4"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-full"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-1/2"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div></td>
                      <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div></td>
                    </tr>
                  ))
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                      No users found.
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {u.name}
                      </td>
                      <td className="px-6 py-4">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 capitalize">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            u.role === 'agent' ? 'bg-blue-100 text-blue-700' :
                              'bg-gray-100 text-gray-700'
                          }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {u.is_seller ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-100 text-green-700 rounded-full">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {u.is_buyer ? (
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-700 rounded-full">✓</span>
                        ) : (
                          <span className="text-gray-300">-</span>
                        )}
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