import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEnvelopeOpenText } from 'react-icons/fa';
import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';

const VerifyEmail = () => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (index, e) => {
    const value = e.target.value;
    
    // Check if the user is pasting a full code
    if (value.length > 1) {
      const pasted = value.replace(/\D/g, '').slice(0, 6).split('');
      if (pasted.length === 0) return;
      
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || '';
      }
      setCode(newCode);
      
      // Focus the next empty input, or the last one if full
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex].focus();
      return;
    }

    // Single digit entry
    if (value && isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-advance to next input
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const otp = code.join('');
    if (otp.length === 6) {
       // In the future this will call the backend API
       console.log('Verifying OTP:', otp);
       navigate('/'); // Redirect for testing flow
    }
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
        to="/signup" 
        className="fixed top-6 left-6 z-50 flex items-center space-x-2 text-white/50 hover:text-white transition-colors group"
      >
        <FaArrowLeft className="text-sm group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[13px] font-medium">Back to Sign Up</span>
      </Link>

      {/* Main container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white p-8 sm:p-12 border border-[#222] shadow-2xl flex flex-col items-center text-center">
          
          <div className="w-16 h-16 bg-[#f4f4f5] rounded-full flex items-center justify-center mb-6">
            <FaEnvelopeOpenText className="text-2xl text-[#0c0c0c]" />
          </div>

          <h2 className="text-2xl font-black tracking-tight text-[#0c0c0c] mb-3">
            Verify your email
          </h2>
          
          <p className="text-[#666] text-[14px] leading-relaxed mb-8">
            We've sent a 6-digit verification code to your email address. Please enter it below to verify your account.
          </p>

          <form onSubmit={handleSubmit} className="w-full mb-8">
            <div className="flex justify-between items-center space-x-2 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  maxLength="6"
                  value={digit}
                  onChange={(e) => handleChange(index, e)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 sm:w-12 h-14 text-center text-xl font-bold text-[#0c0c0c] bg-transparent border-0 border-b-2 border-[#ddd] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                />
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors"
            >
              Verify Email
            </button>
          </form>

          <p className="text-[13px] text-[#999]">
            Didn't receive the code?{' '}
            <button className="text-[#0c0c0c] font-semibold hover:underline">
              Click to resend
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
