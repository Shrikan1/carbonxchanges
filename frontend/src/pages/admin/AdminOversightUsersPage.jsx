import { useEffect, useState } from 'react';
import { FiSearch, FiUsers, FiShield, FiUserCheck, FiShoppingBag, FiBriefcase } from 'react-icons/fi';
import * as oversightApi from '../../api/endpoint/oversightApi';
import AdminLayout from '../../components/layout/AdminLayout';

export default function AdminOversightUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

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

  const getRoleBadge = (user) => {
    if (user.role === 'admin') return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-purple-200">Admin</span>;
    if (user.role === 'agent') return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-blue-200">Agent</span>;
    
    // Normal user could be seller, buyer, or both
    const roles = [];
    if (user.is_seller) roles.push(<span key="seller" className="bg-emerald-100 text-emerald-800 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-emerald-200">Seller</span>);
    if (user.is_buyer) roles.push(<span key="buyer" className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-200">Buyer</span>);
    
    if (roles.length === 0) return <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border border-gray-200">User</span>;
    return <div className="flex gap-1">{roles}</div>;
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    let matchesRole = true;
    if (roleFilter === 'admin') matchesRole = u.role === 'admin';
    else if (roleFilter === 'agent') matchesRole = u.role === 'agent';
    else if (roleFilter === 'seller') matchesRole = u.is_seller;
    else if (roleFilter === 'buyer') matchesRole = u.is_buyer;
    
    return matchesSearch && matchesRole;
  });

  return (
    <AdminLayout title="Platform Users" subtitle="Manage and oversee all registered users across the ecosystem.">
      <div className="p-6 lg:p-8 w-full max-w-[1400px] mx-auto flex flex-col h-full">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-[calc(100vh-140px)]">
          
          {/* Controls */}
          <div className="p-5 border-b border-gray-200 bg-gray-50 flex flex-col sm:flex-row justify-between gap-4 shrink-0">
            <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
              {[
                { id: 'all', label: 'All Users', icon: FiUsers },
                { id: 'seller', label: 'Sellers', icon: FiBriefcase },
                { id: 'buyer', label: 'Buyers', icon: FiShoppingBag },
                { id: 'agent', label: 'Agents', icon: FiUserCheck },
                { id: 'admin', label: 'Admins', icon: FiShield },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setRoleFilter(tab.id)}
                  className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors whitespace-nowrap ${
                    roleFilter === tab.id 
                      ? 'bg-[#0f172a] text-white shadow-sm' 
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <tab.icon size={14} /> {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:max-w-xs shrink-0">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white sticky top-0 z-10 border-b border-gray-200 shadow-sm">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[40%]">User</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">Role Access</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%]">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider w-[20%] text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-48 mb-2"></div><div className="h-3 bg-gray-100 rounded w-32"></div></td>
                      <td className="px-6 py-5"><div className="h-5 bg-gray-100 rounded w-20"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded-full w-16"></div></td>
                      <td className="px-6 py-5"><div className="h-4 bg-gray-100 rounded w-20 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                          <FiUsers size={24} className="text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-900">No users found</p>
                        <p className="text-xs text-gray-500 mt-1">Adjust filters or search query.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-500 shrink-0">
                            {u.name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900 line-clamp-1">{u.name}</p>
                            <p className="text-xs text-gray-500 line-clamp-1">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getRoleBadge(u)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-sm font-medium text-gray-600">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}