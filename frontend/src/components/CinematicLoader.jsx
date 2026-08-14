import React from 'react';

const CinematicLoader = () => {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#030504] overflow-hidden font-sans">
      {/* Deep cinematic background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(16,185,129,0.08)_0%,rgba(0,0,0,0)_70%)] rounded-full animate-breathe pointer-events-none"></div>

      <div className="relative z-10 flex flex-col items-center transform scale-90 sm:scale-100">
        
        {/* Sleek animated icon */}
        <div className="relative w-20 h-20 mb-10 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {/* Outer rotating dashed ring */}
          <svg className="absolute inset-0 w-full h-full text-emerald-900/40 animate-spin-slow" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
          </svg>
          
          {/* Inner glowing leaf/planet abstraction */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-emerald-500 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)] animate-float">
              <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="60" strokeDashoffset="60" className="animate-draw" />
              <path d="M12 3V21M3 12H21" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="opacity-30" />
              <path d="M3.51465 18.4854L20.4852 1.51477" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="opacity-30" />
            </svg>
          </div>
        </div>

        {/* Text Reveal Container */}
        <div className="overflow-hidden relative px-4 py-2">
          {/* Shine effect passing over text */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shine z-20 mix-blend-overlay"></div>
          
          <h1 className="text-3xl md:text-5xl font-light tracking-[0.4em] text-white/80 uppercase flex items-center opacity-0 animate-reveal-up" style={{ animationDelay: '0.5s' }}>
            Carbon<span className="text-emerald-500 font-medium mx-2 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]">X</span>Planet
          </h1>
        </div>

        {/* Subtitle / Loading status */}
        <div className="mt-6 overflow-hidden opacity-0 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <p className="text-emerald-500/50 text-xs md:text-sm tracking-[0.3em] uppercase font-medium">
            Initializing System
            <span className="inline-flex w-4 text-left animate-ellipsis ml-1">...</span>
          </p>
        </div>

        {/* Sophisticated minimal progress bar */}
        <div className="w-64 h-[1px] bg-white/5 mt-10 relative overflow-hidden rounded-full opacity-0 animate-fade-in" style={{ animationDelay: '1s' }}>
          <div className="absolute top-0 left-0 h-full bg-emerald-500 shadow-[0_0_10px_#10b981] animate-progress-bar origin-left"></div>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
        }
        @keyframes draw {
          to { stroke-dashoffset: 0; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes reveal-up {
          from { opacity: 0; transform: translateY(40px) scale(0.95); filter: blur(10px); }
          to { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-15deg); }
          20%, 100% { transform: translateX(200%) skewX(-15deg); }
        }
        @keyframes ellipsis {
          0% { content: '.'; color: transparent; }
          33% { color: inherit; }
          66% { content: '..'; }
          100% { content: '...'; }
        }
        @keyframes progress-bar {
          0% { transform: translateX(-100%); width: 100%; }
          50% { transform: translateX(0%); width: 100%; }
          100% { transform: translateX(100%); width: 100%; }
        }

        .animate-breathe { animation: breathe 6s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 12s linear infinite; }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-draw { animation: draw 2s ease-out forwards 0.5s; }
        .animate-fade-in-up { animation: fade-in-up 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .animate-reveal-up { animation: reveal-up 1.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-shine { animation: shine 3s infinite 1s; }
        .animate-progress-bar { animation: progress-bar 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
      `}</style>
    </div>
  );
};

export default CinematicLoader;
