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
    label: 'Seller Dashboard',
    path: '/dashboard',
  },

  buyer: {
    label: 'Buyer Dashboard',
    path: '/dashboard',
  },

  agent: {
    label: 'Agent Dashboard',
    path: '/dashboard',
  },

  admin: {
    label: 'Admin Dashboard',
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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();
  const isLightPage = ['/posts', '/article', '/seller', '/admin', '/buyer', '/profile', '/marketplace', '/about'].some(p => location.pathname.startsWith(p));


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

  const handleLogout = async () => {
    try {
      // 1. Tell backend to invalidate the session tokens completely
      await authApi.logout();
    } catch (err) {
      console.error("Failed to invalidate session on server", err);
    } finally {
      // 2. Clear local storage and UI state
      logout();
      closeMobileMenu();
      
      // 3. Force hard redirect to clear protected views from memory
      navigate('/login', { replace: true });
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
        <div className={`hidden lg:flex items-center space-x-1 p-1 rounded-full transition-all duration-300 ${isScrolled || isLightPage ? 'bg-white shadow-sm border border-gray-200' : 'bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30'}`}>



          {dashboardLinks.map((dash, idx) => (
            <Link
              key={idx}
              to={dash.path}
              className={`group px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center justify-center transition-colors rounded-full ${isScrolled || isLightPage ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-100' : 'text-gray-200 hover:text-white hover:bg-white/10'}`}
            >
              <span className="relative overflow-hidden block leading-tight">
                <span className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                  {dash.label}
                </span>
                <span className="absolute top-full left-0 block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                  {dash.label}
                </span>
              </span>
            </Link>
          ))}


          <div className={`w-px h-6 mx-1 ${isScrolled || isLightPage ? 'bg-gray-200' : 'bg-white/20'}`}></div>

          {/* ------------------------------------------
              PROFILE DROPDOWN
          ------------------------------------------ */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleProfileDropdown}
              className={`flex items-center justify-center w-9 h-9 rounded-full border overflow-hidden focus:outline-none transition-all duration-300 ${isScrolled || isLightPage ? 'border-gray-200 hover:border-gray-300 text-gray-700 bg-gray-50' : 'border-white/20 hover:border-white/40 text-white bg-white/5'}`}
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-sm font-bold uppercase`}>
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
                    <Link
                      to="/dashboard"
                      onClick={closeProfileDropdown}
                      className="block px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
                    >
                      Admin Dashboard
                    </Link>
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
      <div className="hidden lg:flex items-center space-x-4">

        {/* Login */}
        <Link
          to="/login"
          className={`text-[14px] font-medium transition-colors ${isScrolled || isLightPage ? 'text-gray-600 hover:text-gray-900' : 'text-white/90 hover:text-white drop-shadow-md'}`}
        >
          Sign In
        </Link>

        {/* Sign Up — primary CTA for guests */}
        <Link
          to="/signup"
          className="px-6 py-2.5 bg-[#bef264] text-[#0a0a0a] text-[14px] font-bold rounded-full hover:bg-[#a3e635] transition-all shadow-sm hover:shadow-md"
        >
          Get Started
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
          Login
        </Link>


        {/* Sign Up — primary CTA for guests */}

        <Link
          to="/signup"
          onClick={closeMobileMenu}
          className="block w-full px-4 py-3 text-center bg-white text-[#0c0c0c] text-xs font-bold uppercase tracking-wider hover:bg-[#eee] transition-colors"
        >
          Sign Up
        </Link>

      </>
    );
  };


  // ===================================================
  // JSX
  // ===================================================

  return (

    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled ? 'px-4 sm:px-6 pt-4' : 'px-0 pt-0'}`}>


      {/* =================================================
          NAVBAR
      ================================================= */}

      <motion.div
        initial={
          animateEntrance
            ? {
              opacity: 0,
              y: -20,
            }
            : false
        }

        animate={
          animateEntrance
            ? {
              opacity: 1,
              y: 0,
            }
            : false
        }

        transition={
          animateEntrance
            ? {
              duration: 1.2,
              ease: [
                0.16,
                1,
                0.3,
                1,
              ],
              delay: 1.6,
            }
            : {}
        }

        className={`mx-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] border ${isScrolled ? 'max-w-5xl bg-white border-gray-200 rounded-full px-6 py-1 shadow-lg' : 'max-w-[1400px] bg-transparent border-transparent rounded-full px-6 sm:px-8 py-6 shadow-none'}`}
      >

        <div className="flex items-center justify-between">


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className={`flex items-center px-4 py-1.5 rounded-full transition-all duration-300 ${isScrolled || isLightPage ? 'bg-white shadow-sm border border-gray-200' : 'bg-black/20 backdrop-blur-md border border-white/10 hover:bg-black/30'}`}
          >

            {!hideLogo && (

              <motion.span
                layoutId={
                  animateEntrance
                    ? 'brand-logo'
                    : undefined
                }

                data-brand="logo"

                className={`logo-retro uppercase tracking-tighter text-xl transition-colors duration-300 ${isScrolled || isLightPage ? 'text-gray-900' : 'text-[#bef264]'}`}
                transition={
                  animateEntrance
                    ? {
                      layout: {
                        duration: 1.0,
                        ease: [
                          0.16,
                          1,
                          0.3,
                          1,
                        ],
                      },
                    }
                    : {}
                }
              >

                CarbonXplanet

              </motion.span>

            )}

          </Link>


          {/* =================================================
              DESKTOP NAVIGATION
          ================================================= */}

          <nav className="hidden lg:flex items-center space-x-1 bg-gray-100/80 backdrop-blur-sm rounded-full px-1 py-1">

            {navLinks.map((link) => {

              const isActive = location.pathname === link.path;

              return (

                <Link
                  key={link.name}
                  to={link.path}
                  className={`group px-5 py-2 text-xs font-bold uppercase tracking-wider rounded-full transition-all duration-300 flex items-center justify-center ${isActive
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-200/50'
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
            className={`lg:hidden p-2 transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900'}`}
            aria-label="Toggle menu"
          >

            {isMobileMenuOpen ? (
              <FaTimes size={20} />
            ) : (
              <FaBars size={20} />
            )}

          </button>

        </div>

      </motion.div>


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
  );
};


export default Navbar;