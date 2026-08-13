import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'motion/react';

import { useAuthStore } from '../../store/useAuthStore';


// =====================================================
// ROLE CONFIG
// =====================================================

const roleConfig = {
  seller: {
    label: 'Seller Dashboard',
    path: '/seller/dashboard',
  },

  buyer: {
    label: 'Buyer Dashboard',
    path: '/buyer/dashboard',
  },

  agent: {
    label: 'Agent Dashboard',
    path: '/agent/dashboard',
  },

  admin: {
    label: 'Admin Dashboard',
    path: '/admin/dashboard',
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


  // ===================================================
  // AUTH STORE
  // ===================================================

  const {
    user,
    isAuthenticated,
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
      if (user.is_seller) links.push(roleConfig.seller);
      if (user.is_buyer) links.push(roleConfig.buyer);
    }
    return links;
  };

  const dashboardLinks = getDashboardLinks();


  // ===================================================
  // NAVIGATION LINKS
  // ===================================================

  const navLinks = [
    {
      name: 'Home',
      path: '/',
    },

    {
      name: 'Article',
      path: '/article',
    },

    {
      name: 'Posts',
      path: '/posts',
    },

    {
      name: 'Gallery',
      path: '/gallery',
    },

    {
      name: 'About',
      path: '/about',
    },

    {
      name: 'Contact',
      path: '/contact',
    },
  ];


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

  const handleLogout = () => {
    logout();
    closeMobileMenu();
  };

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

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

    // ================================================
    // AUTHENTICATED USER
    // ================================================

    if (isAuthenticated) {

      return (
        <div className="hidden lg:flex items-center space-x-2">

          {/* Dashboard links (only rendered when role exists) */}

          {dashboardLinks.map((dash, idx) => (
            <Link
              key={idx}
              to={dash.path}
              className="group px-4 py-1.5 text-[#888] hover:text-white text-[13px] font-['JetBrains_Mono'] uppercase font-medium flex items-center justify-center transition-colors"
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


          {/* ------------------------------------------
              PROFILE DROPDOWN
          ------------------------------------------ */}
          <div className="relative">
            <button
              type="button"
              onClick={toggleProfileDropdown}
              className="flex items-center justify-center w-10 h-10 rounded-full border border-[#333] hover:border-[#555] overflow-hidden focus:outline-none transition-colors"
            >
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-[#222] text-white flex items-center justify-center text-sm font-semibold uppercase">
                  {user?.name ? user.name.charAt(0) : 'U'}
                </div>
              )}
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#0c0c0c] border border-[#222] rounded-lg shadow-xl py-2 z-50 overflow-hidden">
                <Link
                  to="/profile"
                  onClick={closeProfileDropdown}
                  className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                >
                  Profile
                </Link>
                {user?.is_seller && (
                  <>
                    {/* <Link
                      to="/seller/dashboard"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      Dashboard
                    </Link> */}
                    <Link
                      to="/seller/projects"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      My Projects
                    </Link>
                    <Link
                      to="/seller/projects/new"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      Add Project
                    </Link>
                    <Link
                      to="/seller/post/new"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      Create Post
                    </Link>
                    <Link
                      to="/seller/credits"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      Credits
                    </Link>
                    <Link
                      to="/seller/listings"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      Listings
                    </Link>
                    <Link
                      to="/seller/sales"
                      onClick={closeProfileDropdown}
                      className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                    >
                      Sales
                    </Link>
                  </>
                )}
                {user?.is_buyer && (
                  <Link
                    to="/buyer/dashboard"
                    onClick={closeProfileDropdown}
                    className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                  >
                    Buyer Dashboard
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    onClick={closeProfileDropdown}
                    className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                  >
                    Admin Dashboard
                  </Link>
                )}
                {user?.role === 'agent' && (
                  <Link
                    to="/agent/dashboard"
                    onClick={closeProfileDropdown}
                    className="block px-4 py-2 text-sm text-[#888] hover:text-white hover:bg-[#222] transition-colors"
                  >
                    Agent Dashboard
                  </Link>
                )}
                <button
                  type="button"
                  onClick={() => {
                    handleLogout();
                    closeProfileDropdown();
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-[#222] transition-colors"
                >
                  Logout
                </button>
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
      <div className="hidden lg:flex items-center space-x-2">

        {/* Login */}

        <Link
          to="/login"
          className="group px-4 py-1.5 text-[#888] hover:text-white text-[13px] font-['JetBrains_Mono'] uppercase font-medium flex items-center justify-center transition-colors"
        >

          <span className="relative overflow-hidden block leading-tight">

            <span className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
              Login
            </span>

            <span className="absolute top-full left-0 block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
              Login
            </span>

          </span>

        </Link>


        {/* Become a Member — primary CTA for guests */}

        <Link
          to="/signup?intent=member"
          className="px-5 py-2 bg-white text-[#0c0c0c] text-[13px] font-['JetBrains_Mono'] uppercase font-semibold rounded-full hover:bg-[#eee] transition-colors flex items-center space-x-1"
        >
          <span>Become a Member</span>
          <span>→</span>
        </Link>

      </div>
    );
  };


  // ===================================================
  // MOBILE AUTH
  // ===================================================

  const renderMobileAuth = () => {

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
              className="block w-full px-4 py-3 text-center text-[#888] text-sm font-['JetBrains_Mono'] uppercase font-medium border border-[#333] hover:text-white hover:border-[#555] transition-colors"
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
            className="block w-full px-4 py-3 text-center bg-[#222] text-white text-sm font-['JetBrains_Mono'] uppercase font-semibold hover:bg-[#333] transition-colors"
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
          className="block w-full px-4 py-3 text-center text-[#888] text-sm font-['JetBrains_Mono'] uppercase font-medium border border-[#333] hover:text-white hover:border-[#555] transition-colors"
        >
          Login
        </Link>


        {/* Become a Member — primary CTA for guests */}

        <Link
          to="/signup?intent=member"
          onClick={closeMobileMenu}
          className="block w-full px-4 py-3 text-center bg-white text-[#0c0c0c] text-sm font-['JetBrains_Mono'] uppercase font-semibold hover:bg-[#eee] transition-colors"
        >
          Become a Member →
        </Link>

      </>
    );
  };


  // ===================================================
  // JSX
  // ===================================================

  return (

    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">


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
                delay: 2.2,
              }
            : {}
        }

        className="max-w-5xl mx-auto bg-[#0c0c0c]/60 backdrop-blur-lg border border-[#222]/60 rounded-full px-5 py-2 shadow-xl shadow-black/20"
      >

        <div className="flex items-center justify-between">


          {/* =================================================
              LOGO
          ================================================= */}

          <Link
            to="/"
            className="flex items-center"
          >

            {!hideLogo && (

              <motion.span
                layoutId={
                  animateEntrance
                    ? 'brand-logo'
                    : undefined
                }

                data-brand="logo"

                className="logo-retro text-[18px]"

                style={{
                  WebkitTextFillColor:
                    '#bef264',

                  background: 'none',
                }}

                transition={
                  animateEntrance
                    ? {
                        layout: {
                          duration: 1.2,
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

          <nav className="hidden lg:flex items-center space-x-1">

            {navLinks.map((link) => {

              const isActive =
                location.pathname ===
                link.path;

              return (

                <Link
                  key={link.name}
                  to={link.path}

                  className={`group px-3 py-1.5 text-[13px] font-['JetBrains_Mono'] uppercase font-medium tracking-wide flex items-center justify-center transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-[#888] hover:text-white'
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
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >

            {isMobileMenuOpen ? (
              <FaTimes size={18} />
            ) : (
              <FaBars size={18} />
            )}

          </button>

        </div>

      </motion.div>


      {/* =================================================
          MOBILE MENU
      ================================================= */}

      <div
        className={`fixed top-0 right-0 h-full w-72 bg-[#0c0c0c]/70 backdrop-blur-xl border-l border-[#222]/50 z-50 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen
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

                  className={`px-4 py-3 text-sm font-['JetBrains_Mono'] uppercase font-medium transition-colors ${
                    isActive
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