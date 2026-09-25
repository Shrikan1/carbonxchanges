import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  FiHome, FiShoppingBag, FiPieChart, FiZap,
  FiAward, FiList, FiUser, FiLogOut,
  FiMenu, FiX,
} from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';
import WalletConnectButton from '../Walletconnectbutton';

const navItems = [
  { name: 'Dashboard',    path: '/dashboard',           icon: <FiHome       className="w-[18px] h-[18px]" /> },
  { name: 'Marketplace',  path: '/marketplace',   icon: <FiShoppingBag className="w-[18px] h-[18px]" /> },
  { name: 'Portfolio',    path: '/buyer/portfolio',     icon: <FiPieChart   className="w-[18px] h-[18px]" /> },
  { name: 'Retire',       path: '/buyer/retire',        icon: <FiZap        className="w-[18px] h-[18px]" /> },
  { name: 'Certificates', path: '/buyer/certificates',  icon: <FiAward      className="w-[18px] h-[18px]" /> },
  { name: 'Transactions', path: '/buyer/transactions',  icon: <FiList       className="w-[18px] h-[18px]" /> },
  { name: 'Pending Orders', path: '/buyer/orders',      icon: <FiShoppingBag className="w-[18px] h-[18px]" /> },
];

const bottomItems = [
  { name: 'Profile', path: '/profile', icon: <FiUser className="w-[18px] h-[18px]" /> },
];

export default function BuyerLayout({ children, title, subtitle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const user   = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  const executeLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutConfirm(false);
    }
  };

  const NavLink = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        draggable="false"
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3 w-full px-4 py-2.5 transition-colors duration-200 font-sans text-[13px] font-medium rounded select-none outline-none ${
          active
            ? 'bg-[#173d25] text-white shadow-sm'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <span className={active ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'}>
          {item.icon}
        </span>
        {item.name}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link to="/" className="block">
          <span className="font-bold uppercase tracking-tight text-[#173d25] text-[18px] leading-none block truncate pb-0.5">
            CARBONXPLANET
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#059669] block">
            Buyer Portal
          </span>
        </Link>
      </div>

      {/* Main Nav */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1 scrollbar-hide">
        {navItems.map((item, idx) => (
          <NavLink key={idx} item={item} />
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="p-4 border-t border-gray-200 space-y-1 bg-gray-50/50">
        {bottomItems.map((item, idx) => (
          <NavLink key={idx} item={item} />
        ))}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          disabled={isLoggingOut}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl transition-all text-sm font-mono font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
        >
          <span className="text-red-400">
            <FiLogOut className="w-[18px] h-[18px]" />
          </span>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="flex h-screen overflow-hidden antialiased"
      style={{ background: '#f4f7f5', color: '#0a0a0a' }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl">
            <button
              className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FiX className="w-5 h-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="h-[60px] bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-1 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight text-gray-900">
                {title || 'Buyer Dashboard'}
              </h1>
              {subtitle && (
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <WalletConnectButton />
            </div>
            <NotificationDropdown />
            <div className="h-7 w-px bg-gray-200 hidden sm:block" />
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-[#173d25] flex items-center justify-center overflow-hidden transition-all shadow-sm">
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  : <FiUser className="w-5 h-5 text-white opacity-90" />
                }
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold font-mono text-gray-900 leading-tight">{user?.name || 'Buyer'}</span>
                <span className="text-xs text-gray-500 font-mono font-medium">Carbon Buyer</span>
              </div>
            </Link>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-[#0c0c0c] shadow-[8px_8px_0_0_#0c0c0c] max-w-sm w-full p-6">
            <h3 className="text-xl wise-font font-black uppercase tracking-tight text-[#0c0c0c] mb-2">Confirm Logout</h3>
            <p className="text-sm font-mono text-gray-600 mb-8">
              Are you sure you want to end your current session?
            </p>
            <div className="flex items-center gap-3 w-full">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 font-mono font-bold text-[#0c0c0c] bg-gray-100 hover:bg-gray-200 border-[2px] border-[#0c0c0c] transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={executeLogout}
                disabled={isLoggingOut}
                className="flex-1 px-4 py-2.5 font-mono font-bold text-white bg-red-600 hover:bg-red-700 border-[2px] border-[#0c0c0c] transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {isLoggingOut ? 'LOGGING OUT...' : 'LOGOUT'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
