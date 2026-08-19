import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaArrowLeft } from 'react-icons/fa';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import { forgotPassword, resetPassword } from "../../api/endpoint/Authapi";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    try {
      setLoading(true);
      const response = await forgotPassword(email);
      setMessage(response.data.message || 'OTP sent successfully.');
      setStep(2);
    } catch (error) {
      console.error('Request reset failed:', error);
      setError(error.response?.data?.error || 'Failed to send reset code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otpCode || !newPassword) {
      setError('Please fill in both the OTP and your new password.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    try {
      setLoading(true);
      const response = await resetPassword(email, otpCode, newPassword);
      // On success, redirect to login with a success message
      navigate('/login', { state: { message: response.data.message || 'Password reset successfully!' } });
    } catch (error) {
      console.error('Reset failed:', error);
      setError(error.response?.data?.error || 'Failed to reset password. Please check your OTP and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0c0c0c] relative font-sans">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
      <div className="absolute inset-0 bg-black/80" />
      
      <div className="relative z-10 w-full max-w-[500px] mx-4 md:mx-8 bg-white p-8 sm:p-12 shadow-2xl rounded-none border border-[#222]">
        
        {/* Back link */}
        <Link to="/login" className="inline-flex items-center text-[#666] hover:text-[#0c0c0c] text-sm font-medium transition-colors mb-8 group">
          <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Login
        </Link>

        <h2 className="text-2xl tracking-tight text-[#0c0c0c] mb-2 uppercase" style={{ fontFamily: "'Bungee', cursive" }}>
          {step === 1 ? 'Reset Password' : 'Enter OTP'}
        </h2>
        <p className="text-[#666] text-sm leading-relaxed mb-8">
          {step === 1 
            ? "Enter the email address associated with your account and we'll send you a secure code to reset your password." 
            : `We've sent a 6-digit code to ${email}. Enter it below along with your new password.`}
        </p>

        {error && (
          <div className="mb-6 bg-red-50 text-red-500 text-[13px] font-medium p-3 border border-red-100">
            {error}
          </div>
        )}
        {message && step === 2 && (
          <div className="mb-6 bg-green-50 text-green-700 text-[13px] font-medium p-3 border border-green-100">
            {message}
          </div>
        )}

        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleRequestReset}>
            <div>
              <label className="block text-[13px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#aaa] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                autoFocus
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c0c0c] text-white font-semibold py-4 text-[14px] tracking-wide hover:bg-[#222] transition-colors disabled:opacity-60 flex items-center justify-center mt-4"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Sending Code...</span>
                </div>
              ) : 'Send Code'}
            </button>
          </form>
        ) : (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div>
              <label className="block text-[13px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">Verification Code</label>
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[20px] tracking-[0.5em] placeholder:tracking-normal placeholder:text-[#aaa] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#aaa] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0c0c0c] text-white font-semibold py-4 text-[14px] tracking-wide hover:bg-[#222] transition-colors disabled:opacity-60 flex items-center justify-center mt-4"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Resetting...</span>
                </div>
              ) : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
