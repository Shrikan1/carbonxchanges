import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'motion/react';

import { useAuthStore } from '../../store/useAuthStore';
import * as authApi from '../../api/endpoint/Authapi';


// =====================================================
// ROLE CONFIG
// =====================================================

const roleConfig = {
  seller: {
    label: 'Dashboard',
    path: '/dashboard',
  },

  buyer: {
    label: 'Dashboard',
    path: '/dashboard',
  },

  agent: {
    label: 'Dashboard',
    path: '/dashboard',
  },

  admin: {
    label: 'Dashboard',
    path: '/dashboard',
  },
};


// =====================================================
// NAVBAR
// =====================================================

const Navbar = ({
  animateEntrance = false,
  hideLogo = false,
}) => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const isLightPage = ['/', '/posts', '/article', '/seller', '/admin', '/buyer', '/profile', '/marketplace', '/about'].some(p => p === '/' ? location.pathname === '/' : location.pathname.startsWith(p));


  // ===================================================
  // AUTH STORE
  // ===================================================

  const {
    user,
    isAuthenticated,
    isInitializing,
    logout,
  } = useAuthStore();


  // ===================================================
  // DASHBOARD LINKS
  // ===================================================

  const getDashboardLinks = () => {
    const links = [];
    if (!user) return links;

    if (user.role === 'admin') {
      links.push(roleConfig.admin);
    } else if (user.role === 'agent') {
      links.push(roleConfig.agent);
    } else {
      if (user.is_seller || user.is_buyer) {
        links.push({ label: 'Dashboard', path: '/dashboard' });
      }
    }
    return links;
  };

  const dashboardLinks = getDashboardLinks();


  // ===================================================
  // NAVIGATION LINKS
  // ===================================================

  const baseNavLinks = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Marketplace',
      path: '/marketplace',
    },
    {
      name: 'Social',
      path: '/posts',
    },
    {
      name: 'Article',
      path: '/article',
    },
    {
      name: 'About',
      path: '/about',
    },
  ];

  const getNavLinks = () => {
    let links = [...baseNavLinks];

    if (!isAuthenticated) {
      // Remove 'Social' for unauthorized users to reduce clutter
      links = links.filter(link => link.name !== 'Social');
    } else {
      // Remove 'About' when logged in
      links = links.filter(link => link.name !== 'About');

      // Keep Marketplace at second position
      const marketplaceIndex = links.findIndex(link => link.name === 'Marketplace');
      if (marketplaceIndex > -1) {
        const [marketplace] = links.splice(marketplaceIndex, 1);
        links.splice(1, 0, marketplace);
      }
    }

    return links;
  };

  const navLinks = getNavLinks();


  // ===================================================
  // MOBILE MENU
  // ===================================================

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(
      (previous) => !previous
    );
  };


  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };


  // ===================================================
  // LOGOUT
  // ===================================================

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } finally {
      closeMobileMenu();
      navigate('/login', { replace: true });
      setIsLoggingOut(false);
    }
  };

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isProfileDropdownOpen]);

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // ===================================================
  // DESKTOP AUTH
  // ===================================================

  const renderDesktopAuth = () => {
    if (isInitializing) {
      return <div className="hidden lg:flex items-center space-x-2 min-w-[120px] h-10"></div>;
    }

    // ================================================
    // AUTHENTICATED USER
    // ================================================

    if (isAuthenticated) {

      return (
        <div className="hidden lg:flex items-center space-x-1.5 p-1 rounded-full bg-white shadow-sm border border-gray-200">

          {dashboardLinks.map((dash, idx) => (
            <Link
              key={idx}
              to={dash.path}
              className="group px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider flex items-center justify-center transition-colors rounded-full text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <span className="relative overflow-hidden block leading-tight">
                <span className="block">
                  {dash.label}
                </span>
              </span>
            </Link>
          ))}

          <div className="w-px h-5 mx-1.5 bg-gray-200"></div>

          {/* ------------------------------------------
              PROFILE DROPDOWN
          ------------------------------------------ */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleProfileDropdown}
              className="flex items-center justify-center w-7 h-7 rounded-full border overflow-hidden focus:outline-none border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50 text-[12px] font-bold"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[11px] font-bold uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
              )}
            </button>

            {isProfileDropdownOpen && (
              <div ref={dropdownRef} className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-[20px] shadow-2xl py-2 z-50 overflow-hidden font-sans ring-1 ring-black/5 animate-in fade-in slide-in-from-top-2 duration-200">
                
                <div className="px-4 py-3 border-b border-gray-100 mb-1 bg-gray-50/50">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {user?.email || 'Logged in'}
                  </p>
                </div>

                <div className="px-2 py-1 space-y-0.5">
                  <Link
                    to="/profile"
                    onClick={closeProfileDropdown}
                    className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                  >
                    Profile Settings
                  </Link>

                  {user?.is_seller && (
                    <>
                      <Link
                        to="/seller/projects"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        My Projects
                      </Link>
                      <Link
                        to="/seller/post/new"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Create Post
                      </Link>
                      <Link
                        to="/seller/credits"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Credits
                      </Link>
                      <Link
                        to="/seller/listings"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Listings
                      </Link>
                      <Link
                        to="/seller/sales"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Sales
                      </Link>
                    </>
                  )}
                  {user?.is_buyer && (
                    <Link
                      to="/dashboard"
                      onClick={closeProfileDropdown}
                      className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    >
                      Buyer Dashboard
                    </Link>
                  )}
                  
                  {user?.role === 'admin' && (
                    <>
                      <Link
                        to="/dashboard"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/admin/projects"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Projects
                      </Link>
                      <Link
                        to="/admin/agents"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Agents
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Users
                      </Link>
                      <Link
                        to="/admin/transactions"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Transactions
                      </Link>
                      <Link
                        to="/admin/minting"
                        onClick={closeProfileDropdown}
                        className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                      >
                        Minting
                      </Link>
                    </>
                  )}
                  {user?.role === 'agent' && (
                    <Link
                      to="/dashboard"
                      onClick={closeProfileDropdown}
                      className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    >
                      Agent Dashboard
                    </Link>
                  )}
                </div>

                <div className="px-2 mt-1 pt-2 border-t border-gray-100">
                  <button
                    onClick={() => {
                      handleLogout();
                      closeProfileDropdown();
                    }}
                    className="w-full text-left px-3 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 rounded-xl transition-colors flex items-center justify-between"
                  >
                    <span>Sign out</span>
                    <svg className="w-4 h-4 opacity-70" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  </button>
                </div>

              </div>
            )}
          </div>

        </div>
      );
    }


    // ================================================
    // GUEST USER
    // ================================================

    return (
      <div className="hidden lg:flex items-center space-x-3">

        {/* Login */}
        <Link
          to="/login"
          className="text-[12px] font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          SIGN IN
        </Link>

        {/* Sign Up — primary CTA for guests */}
        <Link
          to="/signup"
          className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#1a3a22] text-white text-[12px] font-semibold rounded-full hover:bg-[#0f2a17] transition-colors"
        >
          GET STARTED
        </Link>
      </div>
    );
  };


  // ===================================================
  // MOBILE AUTH
  // ===================================================

  const renderMobileAuth = () => {
    if (isInitializing) {
      return null;
    }

    // ================================================
    // AUTHENTICATED
    // ================================================

    if (isAuthenticated) {

      return (
        <>

          {/* Dashboard links (only if role exists) */}

          {dashboardLinks.map((dash, idx) => (
            <Link
              key={idx}
              to={dash.path}
              onClick={closeMobileMenu}
              className="block w-full px-4 py-3 text-center text-[#888] text-xs font-bold uppercase tracking-wider border border-[#333] hover:text-white hover:border-[#555] transition-colors"
            >
              {dash.label}
            </Link>
          ))}


          {/* ------------------------------------------
              LOGOUT
          ------------------------------------------ */}

          <button
            type="button"
            onClick={handleLogout}
            className="block w-full px-4 py-3 text-center bg-[#222] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#333] transition-colors"
          >
            Logout
          </button>

        </>
      );
    }


    // ================================================
    // GUEST
    // ================================================

    return (
      <>

        {/* Login */}

        <Link
          to="/login"
          onClick={closeMobileMenu}
          className="block w-full px-4 py-3 text-center text-[#888] text-xs font-bold uppercase tracking-wider border border-[#333] hover:text-white hover:border-[#555] transition-colors"
        >
          LOGIN
        </Link>


        {/* Sign Up — primary CTA for guests */}

        <Link
          to="/signup"
          onClick={closeMobileMenu}
          className="block w-full px-4 py-3 text-center bg-white text-[#0c0c0c] text-xs font-bold uppercase tracking-wider hover:bg-[#eee] transition-colors"
        >
          SIGN UP
        </Link>

      </>
    );
  };


  // ===================================================
  // JSX
  // ===================================================

  return (
    <>
      {isLoggingOut && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300">
          <div className="flex flex-col items-center">
            <svg className="animate-spin h-12 w-12 text-white mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-white text-lg uppercase tracking-[0.2em] animate-pulse">Logging out...</p>
          </div>
        </div>
      )}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#eef0eb] border-b border-[#dde0d8]">

      {/* =================================================
          NAVBAR
      ================================================= */}

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-1.5">

        <div className="flex items-center justify-between">


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >

            <span
                data-brand="logo"
                className="wise-font font-black uppercase tracking-normal text-[17px] text-[#1a3a22]"
              >
                CarbonXplanet
              </span>

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden lg:flex items-center space-x-0.5 bg-gray-100/90 backdrop-blur-sm rounded-full px-1 py-0.5">

            {navLinks.map((link) => {

              const isActive = location.pathname === link.path;

              return (

                <Link
                  key={link.name}
                  to={link.path}
                  className={`group px-4 py-1.5 text-[12px] font-semibold uppercase tracking-wider rounded-full transition-all duration-200 flex items-center justify-center ${isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
                    }`}
                >
                  <span className="relative overflow-hidden block leading-tight">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                      {link.name}
                    </span>
                    <span className="absolute top-full left-0 block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                      {link.name}
                    </span>
                  </span>
                </Link>

              );

            })}

          </nav>


          {/* =================================================
              DESKTOP AUTH
          ================================================= */}

          {renderDesktopAuth()}


          {/* =================================================
              MOBILE TOGGLE
          ================================================= */}

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-gray-900 transition-colors"
            aria-label="Toggle menu"
          >

            {isMobileMenuOpen ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} />
            )}

          </button>

        </div>

      </div>


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#0c0c0c]/70 backdrop-blur-xl border-l border-[#222]/50 z-50 transform transition-transform duration-300 lg:hidden ${isMobileMenuOpen
          ? 'translate-x-0'
          : 'translate-x-full'
          }`}
      >

        <div className="flex flex-col h-full p-6">


          {/* =================================================
              MOBILE HEADER
          ================================================= */}

          <div className="flex items-center justify-between pb-6 border-b border-[#222]">

            <span className="text-white text-sm font-bold">
              Menu
            </span>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 text-[#888] hover:text-white transition-colors"
              aria-label="Close menu"
            >

              <FaTimes size={18} />

            </button>

          </div>


          {/* =================================================
              MOBILE LINKS
          ================================================= */}

          <div className="flex flex-col space-y-1 py-6">

            {navLinks.map((link) => {

              const isActive =
                location.pathname ===
                link.path;

              return (

                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}

                  className={`px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${isActive
                    ? 'text-white'
                    : 'text-[#888] hover:text-white'
                    }`}
                >

                  {link.name}

                </Link>

              );

            })}

          </div>


          {/* =================================================
              MOBILE AUTH
          ================================================= */}

          <div className="mt-auto space-y-3 pt-6 border-t border-[#222]">

            {renderMobileAuth()}

          </div>

        </div>

      </div>


      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {isMobileMenuOpen && (

        <div
          onClick={toggleMobileMenu}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />

      )}

    </header>
    </>
  );
};


export default Navbar;
