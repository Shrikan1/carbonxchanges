import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { motion, AnimatePresence } from 'motion/react';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';

import { useAuthStore } from '../../store/useAuthStore';
import Login from './Login';
import Signup from './Signup';

const AuthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState(location.pathname === '/signup' ? 'signup' : 'login');

  const { isAuthenticated, isInitializing } = useAuthStore();

  // If the user is already logged in, send them home.
  // isInitializing guard prevents a flash redirect before the session
  // restore attempt in App.jsx has finished.

  const params = new URLSearchParams(location.search);
  const isMemberSignUp = params.get('intent') === 'member';



  useEffect(() => {
    if (!isInitializing && isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  // Sync mode with URL on external navigation
  useEffect(() => {
    const newMode = location.pathname === '/signup' ? 'signup' : 'login';
    if (newMode !== mode) {
      setMode(newMode);
    }
  }, [location.pathname]);

  const switchMode = (newMode) => {
    if (newMode === mode) return;
    setMode(newMode);
    navigate(newMode === 'signup' ? '/signup' : '/login', { replace: true });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center overflow-x-hidden bg-white sm:bg-[#0c0c0c] relative font-sans">

      {/* Full-screen background */}
      <div
        className="absolute inset-0 bg-cover bg-center hidden sm:block"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-black/70 hidden sm:block" />

      {/* Back button */}
      <Link
        to="/"
        className="fixed top-6 left-6 sm:top-6 sm:left-6 lg:top-10 lg:left-10 z-50 flex items-center justify-center text-gray-900 sm:text-white/70 hover:text-black sm:hover:text-white transition-colors"
      >
        <FaArrowLeft className="text-xl sm:text-[14px]" />
      </Link>

      {/* Main container */}
      <div className="relative z-10 w-full sm:max-w-[1060px] mx-0 sm:mx-4 md:mx-8 min-h-screen sm:min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white sm:bg-[#0c0c0c] sm:border sm:border-[#222] overflow-hidden min-h-screen sm:min-h-[680px]">

          {/* Left Panel — Image + Branding */}
          <div className="relative hidden lg:block overflow-hidden h-[680px]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${authBg})` }}
            />
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              {/* Top Logo removed */}

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
                    <h2 className="text-white text-4xl leading-[1.05] tracking-tight mb-4 font-bold">
                      {mode === 'login' ? (
                        <>TRADE CARBON,<br />SAVE EARTH.</>
                      ) : (
                        <>JOIN THE GREEN<br />REVOLUTION.</>
                      )}
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs font-mono">
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
          <div className="bg-white px-6 pt-20 pb-12 sm:p-10 lg:p-12 flex flex-col justify-start min-h-screen sm:min-h-[680px] sm:h-[680px] overflow-hidden">

            {/* Mobile logo removed */}

            {/* Tab Navigation */}
            <div className="flex items-center space-x-6 shrink-0 mt-6 sm:mt-0">
              <button
                onClick={() => switchMode('login')}
                className={`relative text-xl tracking-tight pb-2 transition-colors duration-300 font-bold ${mode === 'login' ? 'text-[#0c0c0c]' : 'text-[#999] hover:text-[#666]'
                  }`}
              >
                SIGN IN
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c0c0c] transition-transform duration-300 origin-left"
                  style={{ transform: mode === 'login' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`relative text-xl tracking-tight pb-2 transition-colors duration-300 font-bold ${mode === 'signup' ? 'text-[#0c0c0c]' : 'text-[#999] hover:text-[#666]'
                  }`}
              >
                SIGN UP
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c0c0c] transition-transform duration-300 origin-left"
                  style={{ transform: mode === 'signup' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
            </div>

            {/* Animated Form Container */}
            <div className="relative flex-1 flex flex-col justify-start sm:justify-center mt-6 sm:mt-0 pb-10 sm:pb-0 overflow-y-auto sm:overflow-visible">
              <AnimatePresence mode="wait">
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, x: mode === 'login' ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: mode === 'login' ? 20 : -20 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                >
                  {mode === 'login' ? <Login isEmbedded={true} /> : <Signup isMemberSignUp={isMemberSignUp} isEmbedded={true} />}
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
