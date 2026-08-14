import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';

const tabs = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Projects', path: '/admin/projects' },
  { name: 'Users', path: '/admin/oversight/users' },
  { name: 'Transactions', path: '/admin/oversight/transactions' },
  { name: 'Minting', path: '/admin/mint-queue' },
];

const AdminHeader = ({ title, pendingReviewCount = 0 }) => {
  const location = useLocation();
  const { user } = useAuthStore();

  const renderNav = () => (
    <nav className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100 min-w-max relative">
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path || (tab.path !== '/dashboard' && location.pathname.startsWith(tab.path));
        return (
          <Link
            key={tab.path}
            to={tab.path}
            className={`relative px-5 py-2 text-sm font-medium transition-colors rounded-full ${
              isActive ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <span className="relative z-10">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  const leftHeading = (
    <div className="flex items-center gap-3 sm:gap-4 shrink-0 min-w-0">
      <Link to="/" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors" title="Back to Main Site">
        <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
      </Link>
      <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black tracking-tight text-gray-900 logo-retro truncate" style={{ WebkitTextFillColor: '#111', background: 'none' }}>
        {title || 'Admin Panel'}
      </h1>
    </div>
  );

  const rightIcons = (
    <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
      <button className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors">
        <FiSearch className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button className="hidden sm:flex w-10 h-10 shrink-0 items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 transition-colors relative">
        <FiBell size={18} />
        {pendingReviewCount > 0 && (
          <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full"></span>
        )}
      </button>
      <div className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 rounded-full border-2 border-white shadow-sm overflow-hidden bg-gradient-to-tr from-blue-100 to-orange-100 flex items-center justify-center">
        <span className="font-semibold text-gray-700 text-sm sm:text-base">{user?.name?.charAt(0) || 'A'}</span>
      </div>
    </div>
  );

  return (
    <div className="mb-8 w-full relative z-20">
      
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-[1fr_auto_1fr] items-center gap-6 w-full">
        {leftHeading}
        <div className="flex justify-center overflow-visible">
          {renderNav()}
        </div>
        {rightIcons}
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col lg:hidden gap-4 w-full">
        <div className="flex justify-between items-center w-full gap-4">
          {leftHeading}
          {rightIcons}
        </div>
        <div className="flex overflow-x-auto pb-2 pt-1 scrollbar-hide w-full">
          {renderNav()}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
