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
        className="fixed top-6 left-6 lg:top-10 lg:left-10 z-50 flex items-center space-x-2 px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-all backdrop-blur-md group shadow-lg"
      >
        <FaArrowLeft className="text-xs group-hover:-translate-x-1 transition-transform" />
        <span className="text-[11px] font-bold uppercase tracking-widest">Home</span>
      </Link>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">

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
                    <h2 className="text-white text-4xl leading-[1.05] tracking-tight mb-4 logo-retro-white">
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
          <div className="bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-start h-[680px] overflow-hidden">
            
            {/* Mobile logo removed */}

            {/* Tab Navigation */}
            <div className="flex items-center space-x-6 shrink-0">
              <button
                onClick={() => switchMode('login')}
                className={`relative text-xl tracking-tight pb-2 transition-colors duration-300 ${
                  mode === 'login' ? 'text-[#0c0c0c]' : 'text-[#999] hover:text-[#666]'
                }`}
                style={{ fontFamily: "'Bungee', cursive" }}
              >
                Sign In
                <span 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c0c0c] transition-transform duration-300 origin-left"
                  style={{ transform: mode === 'login' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
              <button
                onClick={() => switchMode('signup')}
                className={`relative text-xl tracking-tight pb-2 transition-colors duration-300 ${
                  mode === 'signup' ? 'text-[#0c0c0c]' : 'text-[#999] hover:text-[#666]'
                }`}
                style={{ fontFamily: "'Bungee', cursive" }}
              >
                Sign Up
                <span 
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#0c0c0c] transition-transform duration-300 origin-left"
                  style={{ transform: mode === 'signup' ? 'scaleX(1)' : 'scaleX(0)' }}
                />
              </button>
            </div>

            {/* Animated Form Container */}
            <div className="relative flex-1 flex flex-col justify-center">
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
