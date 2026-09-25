import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore } from '../../store/useAuthStore';
import NotificationDropdown from './NotificationDropdown';
import sidebarForest from '../../assets/dense-evergreen-forest-covered-fog_23-2151975503.avif';
import { 
  FiHome, FiFolder, FiUsers, FiActivity, FiCpu, 
  FiSettings, FiHelpCircle, FiLogOut, FiMenu, FiX 
} from 'react-icons/fi';
import { FaUserTie } from 'react-icons/fa';

export default function AdminLayout({ children, title, subtitle }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: FiHome },
    { name: 'Projects', path: '/admin/projects', icon: FiFolder },
    { name: 'Agents', path: '/admin/agents', icon: FaUserTie },
    { name: 'Users', path: '/admin/oversight/users', icon: FiUsers },
    { name: 'Transactions', path: '/admin/oversight/transactions', icon: FiActivity },
    { name: 'Minting', path: '/admin/mint-queue', icon: FiCpu },
  ];

  const accountNav = [
    { name: 'Profile', path: '/admin/profile', icon: FiUsers },
    { name: 'Settings', path: '/admin/settings', icon: FiSettings },
    { name: 'Support', path: '/admin/support', icon: FiHelpCircle },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/dashboard') return location.pathname === '/dashboard';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex font-sans text-gray-900 admin-theme">
      
      {/* ── Desktop Sidebar ── */}
      <aside className="hidden lg:flex flex-col w-[240px] h-screen bg-[#fcfdfb] border-r border-[#e7ece7] fixed top-0 left-0 z-40 overflow-hidden">
        <div className="px-7 pt-7 pb-5 relative z-10">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <span className="w-2 h-2 rounded-full bg-[#78a968] group-hover:scale-125 transition-transform" />
            <span className="text-[10px] font-bold tracking-[0.18em] text-[#6f8377] uppercase">CarbonX Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 overflow-y-auto px-5 py-1 space-y-8 scrollbar-hide relative z-10">
          
          <div>
            <div className="px-2 mb-2.5 text-[10px] font-bold text-[#91a098] uppercase tracking-wider">Main</div>
            <nav className="space-y-1.5">
              {mainNav.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-semibold transition-all ${
                      active 
                        ? 'bg-[#e5f1e5] text-[#315e45] shadow-[0_3px_10px_rgba(83,129,93,0.08)]' 
                        : 'text-[#71807a] hover:bg-[#f3f7f2] hover:text-[#315e45]'
                    }`}
                  >
                    {active && <span className="absolute right-0 top-2 bottom-2 w-[2px] rounded-full bg-[#316745]" />}
                    <span className={active ? 'text-[#3b7651]' : 'text-[#899a93]'}>
                      <item.icon size={16} />
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="px-2 mb-2.5 text-[10px] font-bold text-[#91a098] uppercase tracking-wider">Account</div>
            <nav className="space-y-1.5">
              {accountNav.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[12px] font-semibold text-[#71807a] hover:bg-[#f3f7f2] hover:text-[#315e45] transition-all"
                >
                  <item.icon className="text-[#899a93]" size={16} />
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

        </div>

        <div className="relative z-10 mx-5 pt-4 pb-6 border-t border-[#e9eeea]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-[12px] font-semibold text-[#df5a5a] hover:bg-red-50 transition-all"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
        <div
          className="absolute inset-x-0 bottom-0 h-[205px] opacity-35 pointer-events-none"
          style={{ backgroundImage: `linear-gradient(to top, rgba(252,253,251,0.1), #fcfdfb 88%), url(${sidebarForest})`, backgroundSize: 'cover', backgroundPosition: 'center bottom' }}
        />
        <p className="absolute z-10 left-10 bottom-24 w-24 text-[8px] leading-[1.55] font-bold tracking-[0.17em] text-[#668a73] uppercase pointer-events-none">A cleaner planet, together</p>
      </aside>

      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50 flex items-center justify-between px-4">
        <Link to="/" className="flex flex-col">
          <span className="text-lg font-black tracking-widest text-gray-900 wise-font uppercase leading-none">CXP</span>
          <span className="text-[8px] font-bold font-mono text-emerald-600 tracking-widest uppercase">Admin</span>
        </Link>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-600 hover:text-gray-900">
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* ── Mobile Sidebar Drawer ── */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/40 z-50 lg:hidden backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.3 }}
              className="fixed top-0 left-0 bottom-0 w-[280px] bg-white z-50 flex flex-col border-r border-gray-200 lg:hidden shadow-2xl"
            >
              <div className="p-5 flex items-center justify-between border-b border-gray-100">
                <Link to="/" className="inline-block" onClick={() => setIsMobileMenuOpen(false)}>
                  <h1 className="wise-font font-black uppercase tracking-tight text-[#173d25] text-xl">CARBONXPLANET</h1>
                  <p className="text-[9px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Admin Portal</p>
                </Link>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-500 bg-gray-100 p-1.5 rounded-full">
                  <FiX size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                <div>
                  <div className="px-3 mb-2 text-xs font-semibold font-mono text-gray-400 uppercase tracking-wider">Main</div>
                  <nav className="space-y-1">
                    {mainNav.map((item) => (
                      <Link
                        key={item.path} to={item.path} onClick={() => setIsMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-xl font-mono text-sm font-bold transition-all ${
                          isActive(item.path) ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600'
                        }`}
                      >
                        <item.icon className={isActive(item.path) ? 'text-emerald-600' : 'text-gray-400'} size={18} />
                        {item.name}
                      </Link>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="p-4 border-t border-gray-100">
                <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-3 rounded-xl font-mono text-sm font-bold text-red-600 bg-red-50">
                  <FiLogOut size={18} /> Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── Main Content Area ── */}
      <main className="flex-1 lg:ml-[240px] min-h-screen flex flex-col pt-16 lg:pt-0">
        
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-[60px] px-6 lg:px-8 bg-[#f4f7f5] sticky top-0 z-30">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
            {subtitle && <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          
          <div className="flex items-center gap-5">
            <NotificationDropdown />
            <div className="h-8 w-px bg-gray-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-sm font-semibold font-mono text-gray-900 leading-tight">{user?.name || 'Administrator'}</span>
                <p className="text-xs font-mono text-gray-500 font-medium leading-tight capitalize">{user?.role || 'Admin'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Page Title */}
        <div className="lg:hidden px-4 py-6 bg-[#f4f7f5]">
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>

        {/* Page Content */}
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        
      </main>
      
    </div>
  );
}
