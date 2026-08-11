import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BRAND_TEXT = 'CarbonXplanet';
const SESSION_KEY = 'cxp_intro_seen';
const TOTAL_DURATION = 1500; // ms

const CinematicIntro = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setIsVisible(false);
      onComplete?.();
      return;
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
    }, TOTAL_DURATION);

    return () => clearTimeout(timer);
  }, [onComplete]);

  // When done, mark session and notify parent
  useEffect(() => {
    if (!isVisible) {
      sessionStorage.setItem(SESSION_KEY, '1');
      const cleanup = setTimeout(() => onComplete?.(), 500); // Wait for exit animation
      return () => clearTimeout(cleanup);
    }
  }, [isVisible, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] pointer-events-none flex items-center justify-center bg-[#0c0c0c]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <motion.span
            className="logo-retro block whitespace-nowrap select-none text-4xl md:text-6xl"
            style={{
              WebkitTextFillColor: 'transparent',
              background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              letterSpacing: '0.05em',
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {BRAND_TEXT}
          </motion.span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Helper to check if intro should show
CinematicIntro.shouldShow = () => {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return !sessionStorage.getItem(SESSION_KEY);
};

export default CinematicIntro;
