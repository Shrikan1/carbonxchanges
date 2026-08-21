import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  FiHome, FiFolder, FiPlusSquare, FiFileText,
  FiAward, FiTag, FiDollarSign, FiBriefcase,
  FiUser, FiSettings, FiHelpCircle, FiLogOut,
  FiMenu, FiX
} from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';

export default function SellerLayout({ children, title, subtitle }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const location = useLocation();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
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

  const isActive = (path) => {
    if (path === '/dashboard' && location.pathname === '/dashboard') return true;
    if (path === '/seller/projects') {
      return location.pathname === '/seller/projects' || (location.pathname.startsWith('/seller/projects/') && !location.pathname.startsWith('/seller/projects/new'));
    }
    if (path !== '/dashboard' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <FiHome className="w-[18px] h-[18px]" /> },
    { name: 'My Projects', path: '/seller/projects', icon: <FiFolder className="w-[18px] h-[18px]" /> },
    { name: 'Create Project', path: '/seller/projects/new', icon: <FiPlusSquare className="w-[18px] h-[18px]" /> },
    // { name: 'KYC Documents', path: '/seller/kyc', icon: <FiFileText className="w-[18px] h-[18px]" /> },
    { name: 'Credits', path: '/seller/credits', icon: <FiAward className="w-[18px] h-[18px]" /> },
    { name: 'Listings', path: '/seller/listings', icon: <FiTag className="w-[18px] h-[18px]" /> },
    { name: 'Sales', path: '/seller/sales', icon: <FiDollarSign className="w-[18px] h-[18px]" /> },
    { name: 'Wallet', path: '/seller/wallet', icon: <FiBriefcase className="w-[18px] h-[18px]" /> },
  ];

  const bottomItems = [
    { name: 'Profile', path: '/profile', icon: <FiUser className="w-[18px] h-[18px]" /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings className="w-[18px] h-[18px]" /> },
    { name: 'Support', path: '/support', icon: <FiHelpCircle className="w-[18px] h-[18px]" /> },
  ];

  const NavLink = ({ item }) => {
    const active = isActive(item.path);
    return (
      <Link
        to={item.path}
        draggable="false"
        onClick={() => setMobileMenuOpen(false)}
        className={`flex items-center gap-3.5 w-full px-4 py-3 transition-colors duration-200 font-mono text-sm font-bold rounded-sm select-none outline-none ${
          active
            ? 'bg-[#c2ed6d] text-[#0c0c0c]'
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <span className={active ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'}>
          {item.icon}
        </span>
        {item.name}
      </Link>
    );
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-200">
        <Link to="/" className="block">
          <span className="wise-font font-black uppercase tracking-tight text-[#c2ed6d] [text-shadow:1px_1px_0_black,2px_2px_0_black,3px_3px_0_black] text-[22px] leading-none block truncate pb-1">
            CARBONXPLANET
          </span>
          <span className="text-[11px] font-bold uppercase font-mono tracking-widest text-[#10b981] mt-1.5 block">
            Seller Portal
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
          onClick={handleLogoutClick}
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
      className="flex h-screen overflow-hidden antialiased selection:bg-[#10b981]/20 selection:text-[#10b981]"
      style={{ background: '#f4f7f5', color: '#0a0a0a' }}
    >
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-full z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-white shadow-xl transform transition-transform duration-300">
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
        <header className="h-[68px] bg-white border-b border-gray-200 px-6 lg:px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-1 text-gray-500 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[#0c0c0c] font-mono">
                {title || 'Seller Dashboard'}
              </h1>
              {subtitle && (
                <p className="text-[11px] md:text-xs text-gray-500 mt-1 font-mono uppercase tracking-wider font-bold">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="h-7 w-px bg-gray-200 hidden sm:block" />
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-sm bg-[#c2ed6d] border-[2px] border-[#0c0c0c] flex items-center justify-center overflow-hidden transition-all shadow-none group-hover:shadow-[2px_2px_0_0_#0c0c0c] group-hover:-translate-y-px">
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  : <FiUser className="w-5 h-5 text-[#0c0c0c] opacity-80" />
                }
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold font-mono text-gray-900 leading-tight">{user?.name || 'Seller'}</span>
                <span className="text-xs text-gray-500 font-mono font-medium">
                  Project Developer
                </span>
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
          <div className="bg-white border-[3px] border-[#0c0c0c] shadow-[8px_8px_0_0_#0c0c0c] max-w-sm w-full p-6 relative">
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
