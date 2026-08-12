import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion } from 'motion/react';
import { useAuthStore } from '../../store/Useauthstore';

const Navbar = ({ animateEntrance = false, hideLogo = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuthStore();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Article', path: '/article' },
    { name: 'Posts', path: '/posts' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <motion.div 
        initial={animateEntrance ? { opacity: 0, y: -20 } : false}
        animate={animateEntrance ? { opacity: 1, y: 0 } : false}
        transition={animateEntrance ? { duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 2.2 } : {}}
        className="max-w-5xl mx-auto bg-[#0c0c0c]/60 backdrop-blur-lg border border-[#222]/60 rounded-full px-5 py-2 shadow-xl shadow-black/20"
      >
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            {!hideLogo && (
              <motion.span 
                layoutId={animateEntrance ? "brand-logo" : undefined}
                data-brand="logo" 
                className="logo-retro text-[18px]" 
                style={{ WebkitTextFillColor: '#bef264', background: 'none' }}
                transition={animateEntrance ? { layout: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } : {}}
              >
                CarbonXplanet
              </motion.span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
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

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="group px-4 py-1.5 text-[#888] hover:text-white text-[13px] font-['JetBrains_Mono'] uppercase font-medium flex items-center justify-center transition-colors"
                >
                  <span className="relative overflow-hidden block leading-tight">
                    <span className="block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                      Dashboard
                    </span>
                    <span className="absolute top-full left-0 block transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:-translate-y-full">
                      Dashboard
                    </span>
                  </span>
                </Link>
                <button 
                  onClick={logout}
                  className="px-5 py-2 bg-[#222] text-white text-[13px] font-['JetBrains_Mono'] uppercase font-semibold rounded-full hover:bg-[#333] transition-colors flex items-center space-x-1"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
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
                <Link 
                  to="/signup" 
                  className="px-5 py-2 bg-white text-[#0c0c0c] text-[13px] font-['JetBrains_Mono'] uppercase font-semibold rounded-full hover:bg-[#eee] transition-colors flex items-center space-x-1"
                >
                  <span>Sign Up</span>
                  <span>→</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 text-white"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
          </button>

        </div>
      </motion.div>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[#0c0c0c]/70 backdrop-blur-xl border-l border-[#222]/50 z-50 transform transition-transform duration-300 lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          
          {/* Close */}
          <div className="flex items-center justify-between pb-6 border-b border-[#222]">
            <span className="text-white text-sm font-bold">Menu</span>
            <button onClick={toggleMobileMenu} className="p-2 text-[#888] hover:text-white transition-colors">
              <FaTimes size={18} />
            </button>
          </div>

          {/* Links */}
          <div className="flex flex-col space-y-1 py-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={toggleMobileMenu}
                className="px-4 py-3 text-[#888] hover:text-white text-sm font-['JetBrains_Mono'] uppercase font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="mt-auto space-y-3 pt-6 border-t border-[#222]">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  onClick={toggleMobileMenu}
                  className="block w-full px-4 py-3 text-center text-[#888] text-sm font-['JetBrains_Mono'] uppercase font-medium border border-[#333] hover:text-white hover:border-[#555] transition-colors"
                >
                  Dashboard
                </Link>
                <button 
                  onClick={() => { logout(); toggleMobileMenu(); }}
                  className="block w-full px-4 py-3 text-center bg-[#222] text-white text-sm font-['JetBrains_Mono'] uppercase font-semibold hover:bg-[#333] transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  onClick={toggleMobileMenu}
                  className="block w-full px-4 py-3 text-center text-[#888] text-sm font-['JetBrains_Mono'] uppercase font-medium border border-[#333] hover:text-white hover:border-[#555] transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  onClick={toggleMobileMenu}
                  className="block w-full px-4 py-3 text-center bg-white text-[#0c0c0c] text-sm font-['JetBrains_Mono'] uppercase font-semibold hover:bg-[#eee] transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Sign Up</span>
                  <span>→</span>
                </Link>
              </>
            )}
          </div>

        </div>
      </div>

      {/* Overlay */}
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
