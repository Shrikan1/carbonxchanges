import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] relative font-sans">
      
      {/* Full-screen background image with dark overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${authBg})` }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Main container */}
      <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">

          {/* Left Panel — Image + Branding */}
          <div className="relative hidden lg:block min-h-[600px]">
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${authBg})` }}
            />
            <div className="absolute inset-0 bg-black/40" />
            
            {/* Branding overlay */}
            <div className="relative z-10 h-full flex flex-col justify-between p-10">
              {/* Top Logo */}
              <div className="flex items-center space-x-3">
                <span className="text-white text-lg font-bold tracking-tight">
                  CarbonXplanet
                </span>
              </div>

              {/* Bottom Copy */}
              <div>
                <h2 className="text-white text-4xl font-black leading-[1.05] tracking-tight mb-4">
                  Trade Carbon,
                  <br />
                  Save Earth.
                </h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  Blockchain-powered carbon credit marketplace for a sustainable future.
                </p>
                <div className="mt-8 pt-6 border-t border-white/10 text-white/40 text-xs">
                  © 2026 CarbonXplanet. All rights reserved.
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel — Auth Form */}
          <div className="bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center min-h-[600px]">
            
            {/* Mobile logo (visible only on small screens) */}
            <div className="flex items-center space-x-2 mb-8 lg:hidden">
              <span className="text-[#0c0c0c] text-base font-bold tracking-tight">CarbonXplanet</span>
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center space-x-6 mb-10">
              <span className="text-[#0c0c0c] text-xl font-black tracking-tight border-b-2 border-[#0c0c0c] pb-2">
                Sign In
              </span>
              <Link 
                to="/signup" 
                className="text-[#999] text-xl font-medium tracking-tight pb-2 border-b-2 border-transparent hover:text-[#0c0c0c] transition-colors"
              >
                Sign Up
              </Link>
            </div>

            {/* Form */}
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              
              {/* Email */}
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

              {/* Password */}
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

              {/* Remember + Forgot */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-[14px] h-[14px] border-[#ccc] rounded-none accent-[#0c0c0c]"
                  />
                  <span className="text-[13px] text-[#666]">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-[13px] text-[#666] hover:text-[#0c0c0c] transition-colors"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
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
              <Link to="/signup" className="text-[#0c0c0c] font-semibold hover:underline">
                Sign Up
              </Link>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
