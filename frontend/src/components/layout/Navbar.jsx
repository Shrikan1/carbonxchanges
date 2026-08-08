import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Marketplace', path: '/marketplace' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      {/* Solid dark pill navbar */}
      <div className="max-w-5xl mx-auto bg-[#0c0c0c] border border-[#222] rounded-full px-5 py-2">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-white text-[17px] font-black tracking-tight">
              CarbonXplanet
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-1.5 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive 
                      ? 'text-white' 
                      : 'text-[#888] hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            <Link 
              to="/login" 
              className="px-4 py-1.5 text-[#888] hover:text-white text-[13px] font-medium transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              className="px-5 py-2 bg-white text-[#0c0c0c] text-[13px] font-semibold rounded-full hover:bg-[#eee] transition-colors"
            >
              Get Started
            </Link>
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
      </div>

      {/* Mobile Menu Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-72 bg-[#0c0c0c] border-l border-[#222] z-50 transform transition-transform duration-300 lg:hidden ${
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
                className="px-4 py-3 text-[#888] hover:text-white text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="mt-auto space-y-3 pt-6 border-t border-[#222]">
            <Link 
              to="/login" 
              onClick={toggleMobileMenu}
              className="block w-full px-4 py-3 text-center text-[#888] text-sm font-medium border border-[#333] hover:text-white hover:border-[#555] transition-colors"
            >
              Sign In
            </Link>
            <Link 
              to="/signup" 
              onClick={toggleMobileMenu}
              className="block w-full px-4 py-3 text-center bg-white text-[#0c0c0c] text-sm font-semibold hover:bg-[#eee] transition-colors"
            >
              Get Started
            </Link>
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
