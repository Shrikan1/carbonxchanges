import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';

const VerifyEmail = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic later
    console.log("Verifying code:", code);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] relative font-sans">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
      <div className="absolute inset-0 bg-black/70" />
      
      <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">
          
          {/* Left Panel */}
          <div className="relative hidden lg:block min-h-[600px]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
              <div className="flex items-center space-x-3">
                <span className="text-white text-lg font-bold tracking-tight">CarbonXplanet</span>
              </div>
              <div>
                <h2 className="text-white text-4xl font-black leading-[1.05] tracking-tight mb-4">
                  Verify Your<br />Email.
                </h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  We've sent a code to your inbox. Enter it here to complete your registration.
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 text-white/40 text-xs">
                  © 2026 CarbonXplanet. All rights reserved.
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center min-h-[600px]">
            
            <div className="flex items-center space-x-2 mb-8 lg:hidden">
              <span className="text-[#0c0c0c] text-base font-bold tracking-tight">CarbonXplanet</span>
            </div>

            <div className="mb-10">
              <h1 className="text-[#0c0c0c] text-2xl font-black tracking-tight mb-2">Check your email</h1>
              <p className="text-[#666] text-[15px]">Enter the 6-digit verification code sent to you.</p>
            </div>

            <form className="space-y-8" onSubmit={handleSubmit}>
              <div>
                <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="000000"
                  className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[24px] tracking-[0.5em] font-mono placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors mt-2"
              >
                Verify & Continue
              </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-[#999]">
              Didn't receive the code?{' '}
              <button className="text-[#0c0c0c] font-semibold hover:underline">
                Resend
              </button>
            </p>
            
            <div className="mt-6 text-center">
               <Link to="/login" className="text-[13px] text-[#666] hover:text-[#0c0c0c] transition-colors">
                  Back to Sign In
               </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;