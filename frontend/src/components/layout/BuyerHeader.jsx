import { Link, useLocation } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';

const tabs = [
  { name: 'Dashboard',    path: '/dashboard'          },
  { name: 'Marketplace',  path: '/marketplace'  },
  { name: 'Portfolio',    path: '/buyer/portfolio'    },
  { name: 'Retire',       path: '/buyer/retire'       },
  { name: 'Certificates', path: '/buyer/certificates' },
  { name: 'Transactions', path: '/buyer/transactions' },
];

export default function BuyerHeader({
  title,
  description,
  action,
  contentMaxWidth = '1400px',
}) {
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const renderNav = () => (
    <nav className="flex items-center bg-white rounded-full px-1 py-1 shadow-sm border border-gray-100 min-w-max relative">
      {tabs.map((tab) => (
        <Link
          key={tab.path}
          to={tab.path}
          className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
            isActive(tab.path)
              ? 'bg-[#0f172a] text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <span className="relative z-10">{tab.name}</span>
        </Link>
      ))}
    </nav>
  );

  const homeButton = (
    <Link
      to="/"
      className="w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
      title="Back to Main Site"
    >
      <FiHome className="w-4 h-4 sm:w-5 sm:h-5" />
    </Link>
  );

  const rightIcons = (
    <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
      <NotificationDropdown />
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center mb-8 relative z-20">

      {/* Top navigation bar — fixed max-width to prevent layout shift */}
      <div className="w-full max-w-[1400px] px-4 md:px-8">

        {/* Desktop */}
        <div className="hidden lg:flex items-center justify-between w-full relative min-h-[48px]">
          {homeButton}
          <div className="absolute left-1/2 -translate-x-1/2">
            {renderNav()}
          </div>
          {rightIcons}
        </div>

        {/* Mobile / Tablet */}
        <div className="flex flex-col lg:hidden gap-4 w-full">
          <div className="flex justify-between items-center w-full gap-4 mt-2">
            {homeButton}
            {rightIcons}
          </div>
          <div className="flex overflow-x-auto pb-2 pt-1 scrollbar-hide w-full">
            {renderNav()}
          </div>
        </div>
      </div>

      {/* Page title & action — respects per-page content width */}
      <div className="w-full px-4 md:px-8 mt-8" style={{ maxWidth: contentMaxWidth }}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1
              className="text-2xl lg:text-3xl font-black tracking-tight text-gray-900 truncate"
              style={{ WebkitTextFillColor: '#111', background: 'none' }}
            >
              {title || 'Buyer Portal'}
            </h1>
            {description && (
              <p className="text-gray-500 text-sm mt-2">{description}</p>
            )}
          </div>
          {action && (
            <div className="shrink-0 mt-2 md:mt-0">{action}</div>
          )}
        </div>
      </div>
    </div>
  );
}
