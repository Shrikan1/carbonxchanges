import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import NotificationDropdown from './NotificationDropdown';

const tabs = [
  { name: 'Assigned Projects', path: '/agent/projects' },
  { name: 'History', path: '/agent/history' },
];

const AgentHeader = ({ title, hideNav = false, centerContent }) => {
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
            className={`relative px-5 py-2 text-xs font-bold uppercase tracking-wider transition-colors rounded-full ${
              isActive ? 'bg-[#0f172a] text-white shadow-md' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
            }`}
          >
            <span className="relative z-10">{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );

  const rightIcons = (
    <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
      <NotificationDropdown />
    </div>
  );

  return (
    <div className="mb-8 w-full relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-5">
      {/* Left: Title and Home */}
      <div className="flex items-center gap-3 sm:gap-4 shrink-0">
        <Link to="/" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors" title="Back to Main Site">
          <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
        <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold tracking-tight text-gray-900">
          {title || 'Agent Portal'}
        </h1>
      </div>

      {/* Center: Custom Content */}
      {centerContent && (
        <div className="flex-1 flex justify-center w-full md:w-auto">
          {centerContent}
        </div>
      )}

      {/* Right: Navigation and Icons */}
      <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto scrollbar-hide justify-start md:justify-end shrink-0">
        {!hideNav && renderNav()}
        {rightIcons}
      </div>
    </div>
  );
};

export default AgentHeader;
