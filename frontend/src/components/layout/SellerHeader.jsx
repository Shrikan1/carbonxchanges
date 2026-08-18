import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiSearch, FiBell, FiHome } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

const tabs = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'My Projects', path: '/seller/projects' },
  { name: 'Create Post', path: '/seller/post/new' },
  { name: 'Credits', path: '/seller/credits' },
  { name: 'Listings', path: '/seller/listings' },
  { name: 'Sales', path: '/seller/sales' },
];

const SellerHeader = ({ 
  title, 
  description,
  action,
  pendingReviewCount = 0,
  contentMaxWidth = "1400px"
}) => {
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
            className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
              isActive ? 'bg-[#0f172a] text-white shadow-sm' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            <span className="relative z-10">{tab.name}</span>
            {tab.name === 'My Projects' && pendingReviewCount > 0 && (
              <span className={`absolute top-0 right-0 -mt-1 -mr-1 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${isActive ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-600'}`}>
                {pendingReviewCount}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const homeButton = (
    <Link to="/" className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors" title="Back to Main Site">
      <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
    </Link>
  );

  const pageTitle = (
    <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 truncate" style={{ WebkitTextFillColor: '#111', background: 'none' }}>
      {title || 'Seller Portal'}
    </h1>
  );

  const rightIcons = null;

  return (
    <div className="w-full flex flex-col items-center mb-8 relative z-20">
      
      {/* Universal Top Navigation - ALWAYS max-w-[1400px] to prevent shifting */}
      <div className="w-full max-w-[1400px] px-4 md:px-8">
        {/* Desktop Layout */}
        <div className="hidden lg:flex items-center justify-center gap-6 w-full relative min-h-[48px]">
          {homeButton}
          {renderNav()}
        </div>

        {/* Mobile / Tablet Layout */}
        <div className="flex flex-col lg:hidden gap-4 w-full">
          <div className="flex justify-between items-center w-full gap-4">
            {homeButton}
            {rightIcons}
          </div>
          <div className="flex overflow-x-auto pb-2 pt-1 scrollbar-hide w-full">
            {renderNav()}
          </div>
        </div>
      </div>

      {/* Page Title & Actions - Aligned with the specific page's content width */}
      <div className="w-full px-4 md:px-8 mt-8" style={{ maxWidth: contentMaxWidth }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            {pageTitle}
            {description && (
              <p className="text-gray-500 text-sm mt-2">{description}</p>
            )}
          </div>
          {action && (
            <div className="shrink-0 mt-2 md:mt-0">
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerHeader;
