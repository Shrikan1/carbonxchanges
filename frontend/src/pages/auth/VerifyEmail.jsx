
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import { verifyOtp } from '../../api/endpoint/Authapi';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const email = location.state?.email || 'your email address';

  const [code, setCode] = useState(Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);

  // Redirect back if accessed directly without state
  useEffect(() => {
    if (!userId) {
      navigate('/signup', { replace: true });
    }
  }, [userId, navigate]);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newCode = [...code];
    // take only the last character if they typed multiple (e.g. from mobile autocomplete)
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Auto-advance
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // If current is empty, move back and clear previous
        const newCode = [...code];
        newCode[index - 1] = '';
        setCode(newCode);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.length === 0) return;
    
    const newCode = [...code];
    pastedData.forEach((char, i) => {
      if (/^\d+$/.test(char) && i < 6) {
        newCode[i] = char;
      }
    });
    setCode(newCode);
    
    // Focus the next empty input, or the last one
    const nextEmptyIndex = newCode.findIndex(val => val === '');
    if (nextEmptyIndex !== -1) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const otpCode = code.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    try {
      setLoading(true);
      const response = await verifyOtp(userId, otpCode);
      console.log('OTP Verification successful:', response.data);
      // Redirect to login page on success
      navigate('/login', { replace: true, state: { message: 'Email verified successfully! You can now log in.' } });
    } catch (err) {
      console.error('OTP Verification failed:', err);
      const defaultError = err.request ? 'Network error. Please check your connection.' : 'Invalid or expired OTP. Please try again.';
      setError(err.response?.data?.message || defaultError);
    } finally {
      setLoading(false);
    }
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

            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <div>
                <h2 className="text-white text-4xl leading-[1.05] tracking-tight mb-4 logo-retro-white">

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

          <div className="bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-start min-h-[600px]">
            <div className="mb-10">
              <h1 className="text-[#0c0c0c] text-2xl mb-2 uppercase logo-retro tracking-tighter">Check your email</h1>
              <p className="text-[#666] text-[15px]">
                We sent a 6-digit verification code to <span className="font-semibold text-[#111]">{email}</span>.
              </p>
            </div>

            <form className="space-y-8 flex-1" onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-50 text-red-500 text-[13px] font-medium p-3 border border-red-100">
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-4">
                  Verification Code
                </label>
                
                {/* 6-Digit OTP UI */}
                <div className="flex space-x-2 sm:space-x-4 justify-between max-w-[400px]" onPaste={handlePaste}>
                  {code.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(idx, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(idx, e)}
                      className="w-12 h-14 sm:w-14 sm:h-16 text-center bg-[#f9f9f9] border border-[#ddd] text-[#0c0c0c] text-[24px] font-mono font-bold focus:outline-none focus:border-[#0c0c0c] focus:bg-white transition-colors"
                    />
                  ))}
                </div>

              </div>

              <button
                type="submit"

                disabled={loading}
                className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors mt-8 disabled:opacity-60"
              >
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <p className="mt-8 text-center text-[13px] text-[#999]">
              Didn't receive the code?{' '}
              <button className="text-[#0c0c0c] font-semibold hover:underline">
                Resend
              </button>
            </p>
            
            <div className="mt-6 pt-5 border-t border-[#eee] text-center text-[13px]">
               <Link to="/login" className="text-[#666] hover:text-[#0c0c0c] transition-colors">
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