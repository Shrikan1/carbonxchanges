import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(location.pathname === '/signup' ? 'signup' : 'login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Sync mode with URL on external navigation
  useEffect(() => {
    const newMode = location.pathname === '/signup' ? 'signup' : 'login';
    if (newMode !== mode) {
      switchMode(newMode);
    }
  }, [location.pathname]);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    setShowPassword(false);
    setShowConfirmPassword(false);
    // Update URL without full page reload
    navigate(newMode === 'signup' ? '/signup' : '/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] relative font-sans">
      
      {/* Full-screen background */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Back button */}
      <Link 
        to="/" 
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-white/50 hover:text-white transition-colors group"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[13px] font-medium">Back</span>
      </Link>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">

          {/* Left Panel — Image + Branding */}
          <div className="relative hidden lg:block min-h-[640px]">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${authBg})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
              {/* Top Logo */}
              <div className="flex items-center space-x-3">
                <img 
                  src="/fevicon.png" 
                  alt="CarbonXplanet" 
                  className="h-8 w-8 object-contain"
                />
                <span className="text-white text-lg font-bold tracking-tight">
                  CarbonXplanet
                </span>
              </div>

              {/* Bottom Copy — changes with mode smoothly */}
              <div className="relative h-32">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="absolute inset-0"
                  >
                    <h2 className="text-white text-4xl font-black leading-[1.05] tracking-tight mb-4">
                      {mode === 'login' ? (
                        <>Trade Carbon,<br />Save Earth.</>
                      ) : (
                        <>Join the Green<br />Revolution.</>
                      )}
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                      {mode === 'login' 
                        ? 'Blockchain-powered carbon credit marketplace for a sustainable future.'
                        : 'Build a sustainable future with blockchain-powered carbon credits.'
                      }
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Panel — Auth Form */}
          <div className="bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center min-h-[640px]">
            
            {/* Mobile logo */}
            <div className="flex items-center space-x-2 mb-8 lg:hidden">
              <img src="/fevicon.png" alt="CarbonXplanet" className="h-7 w-7 object-contain" />
              <span className="text-[#0c0c0c] text-base font-bold tracking-tight">CarbonXplanet</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-6 mb-8">
              <button
                onClick={() => switchMode('login')}
                className={`relative text-xl font-black tracking-tight pb-2 transition-colors duration-300 ${
                  mode === 'login' ? 'text-[#0c0c0c]' : 'text-[#999] hover:text-[#666]'
                }`}
              >
                Sign In
                <span 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c0c0c] transition-transform duration-300 origin-left"
                  style={{ transform: mode === 'login' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`relative text-xl font-black tracking-tight pb-2 transition-colors duration-300 ${
                  mode === 'signup' ? 'text-[#0c0c0c]' : 'text-[#999] hover:text-[#666]'
                }`}
              >
                Sign Up
                <span 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c0c0c] transition-transform duration-300 origin-left"
                  style={{ transform: mode === 'signup' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
            </div>

            {/* Animated Form Container */}
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {mode === 'login' ? (
                    /* ─── SIGN IN FORM ─── */
                    <>
                      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                        <div>
                          <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••••"
                              className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0c0c0c] transition-colors"
                            >
                              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <label className="flex items-center space-x-2 cursor-pointer select-none">
                            <input type="checkbox" className="w-[14px] h-[14px] border-[#ccc] rounded-none accent-[#0c0c0c]" />
                            <span className="text-[13px] text-[#666]">Remember me</span>
                          </label>
                          <Link to="/forgot-password" className="text-[13px] text-[#666] hover:text-[#0c0c0c] transition-colors">
                            Forgot Password?
                          </Link>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors mt-2"
                        >
                          Sign In
                        </button>
                      </form>

                      {/* Bottom link */}
                      <p className="mt-8 text-center text-[13px] text-[#999]">
                        Don't have an account?{' '}
                        <button onClick={() => switchMode('signup')} className="text-[#0c0c0c] font-semibold hover:underline">
                          Sign Up
                        </button>
                      </p>
                    </>
                  ) : (
                    /* ─── SIGN UP FORM ─── */
                    <>
                      <form className="space-y-5" onSubmit={(e) => {
                        e.preventDefault();
                        navigate('/verify-email');
                      }}>
                        <div>
                          <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            placeholder="Alex Johnson"
                            className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            placeholder="name@example.com"
                            className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                            Password
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              placeholder="••••••••••"
                              className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0c0c0c] transition-colors"
                            >
                              {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                            Confirm Password
                          </label>
                          <div className="relative">
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              placeholder="••••••••••"
                              className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0c0c0c] transition-colors"
                            >
                              {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                          </div>
                        </div>

                        <div className="flex items-start space-x-2 pt-1">
                          <input type="checkbox" className="w-[14px] h-[14px] mt-0.5 border-[#ccc] rounded-none accent-[#0c0c0c]" />
                          <span className="text-[13px] text-[#666] leading-snug">
                            I agree to the{' '}
                            <Link to="/terms" className="text-[#0c0c0c] font-semibold hover:underline">Terms & Conditions</Link>
                          </span>
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors mt-2"
                        >
                          Create Account
                        </button>
                      </form>

                      {/* Bottom link */}
                      <p className="mt-8 text-center text-[13px] text-[#999]">
                        Already have an account?{' '}
                        <button onClick={() => switchMode('login')} className="text-[#0c0c0c] font-semibold hover:underline">
                          Sign In
                        </button>
                      </p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};

export default AuthPage;
