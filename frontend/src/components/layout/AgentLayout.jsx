import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import {
  FiHome, FiFileText, FiClock, FiCheckCircle,
  FiUser, FiSettings, FiHelpCircle, FiLogOut, FiMenu
} from 'react-icons/fi';
import NotificationDropdown from './NotificationDropdown';

const AgentLayout = ({ children, title, subtitle }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const confirmLogout = async () => {
    if (logout) await logout();
    window.location.href = '/login';
  };

  const isActive = (path, searchParam = '') => {
    if (searchParam) {
      return location.pathname === path && location.search.includes(searchParam);
    }
    if (path === '/agent/projects' && location.search.includes('tab=due')) return false;
    return location.pathname === path ||
      (path !== '/dashboard' && location.pathname.startsWith(path) && !searchParam);
  };

  const navItems = [
    { name: 'Overview', path: '/dashboard', search: '', icon: <FiHome className="w-[18px] h-[18px]" /> },
    { name: 'Assigned Projects', path: '/agent/projects', search: '', icon: <img src="/icons/assign.png" alt="Assign" className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 transition-all" /> },
    { name: 'Due Soon', path: '/agent/projects', search: 'tab=due', icon: <FiClock className="w-[18px] h-[18px]" /> },
    { name: 'History', path: '/agent/history', search: '', icon: <img src="/icons/history.png" alt="History" className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 transition-all" /> },
  ];

  const bottomItems = [
    { name: 'Profile', path: '/profile', icon: <img src="/icons/user.png" alt="User" className="w-[18px] h-[18px] opacity-80 group-hover:opacity-100 transition-all" /> },
    { name: 'Settings', path: '/settings', icon: <FiSettings className="w-[18px] h-[18px]" /> },
    { name: 'Support', path: '/support', icon: <FiHelpCircle className="w-[18px] h-[18px]" /> },
  ];

  const NavLink = ({ item }) => {
    const active = isActive(item.path, item.search);
    const to = item.search ? `${item.path}?${item.search}` : item.path;
    return (
      <Link
        to={to}
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
    <div className="flex flex-col h-full bg-white border-r border-[#e2e8e4]">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <Link to="/" className="block">
          <span className="font-bold uppercase tracking-tight text-[#173d25] text-[18px] leading-none block truncate pb-0.5">
            CARBONXPLANET
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#10b981] block">
            Agent Portal
          </span>
        </Link>
      </div>

      {/* Primary Nav */}
      <nav className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-0.5 scrollbar-hide">
        {navItems.map((item) => <NavLink key={item.name} item={item} />)}

        <div className="my-4 border-t border-[#e2e8e4]" />

        {bottomItems.map((item) => <NavLink key={item.name} item={item} />)}
      </nav>

      {/* Logout */}
      <div className="px-4 py-4 border-t border-[#e2e8e4]">
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg transition-all text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600"
        >
          <FiLogOut className="w-[18px] h-[18px]" />
          Log out
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

      {/* Mobile Sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#0a0a0a]/50 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-64 max-w-[80%] h-full bg-white shadow-2xl flex-shrink-0">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top Header */}
        <header className="h-[60px] bg-white border-b border-[#e2e8e4] px-6 lg:px-8 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-1 text-[#555] hover:bg-[#f4f7f5] rounded-lg"
              onClick={() => setMobileMenuOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <div>
              <h1
                className="text-lg md:text-xl font-bold tracking-tight text-gray-900"
              >
                {title || 'Agent Dashboard'}
              </h1>
              {subtitle && (
                <p className="hidden md:block text-[11px] text-gray-500 mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationDropdown />
            <div className="h-7 w-px bg-[#e2e8e4] hidden sm:block" />
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-full bg-[#173d25] flex items-center justify-center overflow-hidden transition-all shadow-sm">
                {user?.profilePicture
                  ? <img src={user.profilePicture} alt="Profile" className="w-full h-full object-cover" />
                  : <FiUser className="w-5 h-5 text-white opacity-90" />
                }
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-sm font-semibold font-mono text-gray-900 leading-tight">{user?.name || 'Agent'}</span>
                <span className="text-xs text-gray-500 font-mono font-medium">
                  Carbon Agent
                </span>
              </div>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <div className="max-w-[1200px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* Logout Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a]/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-[#e2e8e4]">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mb-5">
                <FiLogOut className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-[#0a0a0a] mb-2 tracking-tight">Log Out</h3>
              <p className="text-sm text-[#666] mb-7 leading-relaxed">
                Are you sure you want to log out of your agent account?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-[#f4f7f5] text-[#555] hover:bg-[#e2e8e4] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="flex-1 px-4 py-3 text-sm font-semibold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentLayout;
