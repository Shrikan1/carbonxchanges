import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import { login } from "../../api/endpoint/Authapi";
import Loader from '../../components/Loader';
import { useAuthStore } from '../../store/Useauthstore';

const Login = ({ isEmbedded }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill all the fields.');
      return;
    }

    try {
      setLoading(true);
      const response = await login(formData.email, formData.password);
      console.log('Login successful:', response.data);
      
      // Attempt to extract token and user from backend response
      const token = response.data.token;
      const user = response.data.user || response.data;
      
      if (token) {
        useAuthStore.getState().setSession(user, token);
      } else {
        console.warn('Login succeeded but no token was found in the response.');
      }
      
      // Redirect to home/dashboard
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formContent = (
    <div className="w-full h-full flex flex-col">
      {!isEmbedded && (
        <>
          <div className="flex items-center space-x-6 shrink-0 mb-8">
            <span className="text-[#0c0c0c] text-xl tracking-tight border-b-2 border-[#0c0c0c] pb-2" style={{ fontFamily: "'Bungee', cursive" }}>
              Sign In
            </span>
            <Link to="/signup" className="text-[#999] text-xl tracking-tight pb-2 border-b-2 border-transparent hover:text-[#0c0c0c] transition-colors" style={{ fontFamily: "'Bungee', cursive" }}>
              Sign Up
            </Link>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col justify-center">
        {successMessage && (
          <div className="mb-4 bg-green-50 text-green-700 text-[13px] font-medium p-3 border border-green-100 rounded">
            {successMessage}
          </div>
        )}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 text-red-500 text-[13px] font-medium p-3 border border-red-100">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="aarav@example.com"
              className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#888] focus:outline-none focus:border-[#0c0c0c] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••"
                className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#888] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
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
            <Link to="/forgot-password" className="text-[13px] text-[#666] hover:text-[#0c0c0c] transition-colors">Forgot Password?</Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors mt-2 disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="mt-6 pt-5 border-t border-[#eee] text-center text-[13px] text-[#999]">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#0c0c0c] font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return formContent;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] relative font-sans">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
      <div className="absolute inset-0 bg-black/70" />
      <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">
          <div className="relative hidden lg:block min-h-[500px]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              {/* Top Logo removed */}
              <div>
                <h2 className="text-white text-4xl leading-[1.05] tracking-tight mb-4 logo-retro-white">
                  Trade Carbon,<br />Save Earth.
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
          <div className="bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-start min-h-[500px]">
            {formContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
