// src/pages/shared/DashboardPage.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import * as dashboardApi from '../../api/endpoint/dashboardApi';
import PriceTicker from '../../components/PriceTicker';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiCheckCircle, FiClock, FiDollarSign, FiAlertCircle, FiShield, FiList, FiRefreshCw } from 'react-icons/fi';
import AdminDashboard from '../admin/AdminDashboard';
import SellerDashboard from '../seller/SellerDashboard';

const StatCard = ({ title, value, icon, subtitle }) => (
  <div className="bg-[#111] border border-[#222] p-5 rounded-xl flex flex-col justify-between hover:border-[#444] transition-colors">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-[#888] text-sm uppercase tracking-wider font-['JetBrains_Mono']">{title}</h3>
      <div className="text-[#bef264]">{icon}</div>
    </div>
    <div>
      <div className="text-3xl font-bold text-white">{value}</div>
      {subtitle && <div className="text-xs text-[#666] mt-1">{subtitle}</div>}
    </div>
  </div>
);




import AgentDashboard from '../agent/AgentDashboard';

const BuyerDashboard = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard title="Total Purchased" value={data.total_purchased || 0} icon={<FiCheckCircle size={20} />} />
        <StatCard title="Current Holdings" value={data.current_holdings || 0} icon={<FiFileText size={20} />} />
        <StatCard title="CO2 Offset" value={data.total_co2_offset || 0} icon={<FiCheckCircle size={20} />} subtitle="Tons Retired" />
      </div>
    </div>
  );
};

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      try {
        let res;
        if (user?.role === 'admin') res = await dashboardApi.getAdminDashboard();
        else if (user?.role === 'agent') res = await dashboardApi.getAgentDashboard();
        else if (user?.is_seller) res = await dashboardApi.getSellerDashboard();
        else if (user?.is_buyer) res = await dashboardApi.getBuyerDashboard();
        if (res) setData(res.data.dashboard);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [user]);

  if (!user?.is_seller && !user?.is_buyer && !['admin', 'agent'].includes(user?.role)) {
    return (
      <div className="min-h-screen pt-24 px-6 flex items-center justify-center text-center text-[#888]">
        Become a member to see your dashboard.
      </div>
    );
  }

  // Admin Dashboard renders entirely independently to maintain its white theme
  if (user?.role === 'admin') {
    return <AdminDashboard data={data} isLoading={isLoading} />;
  }

  // Agent Dashboard renders entirely independently to maintain its white theme
  if (user?.role === 'agent') {
    return (
      <AgentDashboard data={data} isLoading={isLoading} />
    );
  }

  // Seller Dashboard renders entirely independently to maintain its white theme
  if (user?.is_seller) {
    return <SellerDashboard data={data} isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-[#0c0c0c] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold uppercase logo-retro tracking-tighter text-gray-900 mb-2">
              {user?.role === 'admin' && 'Admin '}
              {user?.role === 'agent' && 'Agent '}
              {user?.is_seller && !user?.role && 'Seller '}
              {user?.is_buyer && !user?.role && !user?.is_seller && 'Buyer '}
              Dashboard
            </h1>
            <p className="text-[#888] mt-1 text-sm">Welcome back, {user?.name || 'User'}</p>
          </div>
          <PriceTicker />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bef264]"></div>
          </div>
        ) : data ? (
          <>
            {user?.is_buyer && !user?.role && !user?.is_seller && <BuyerDashboard data={data} />}
          </>
        ) : (
          <div className="p-8 text-center text-[#888] bg-[#111] rounded-xl border border-[#222]">
            Unable to load dashboard data.
          </div>
        )}
      </div>
    </div>
  );
}