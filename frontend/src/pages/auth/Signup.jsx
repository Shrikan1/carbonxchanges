import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import { signup } from '../../api/endpoint/Authapi';


// ─── Component ────────────────────────────────────────────────────────────────

const Signup = ({ isEmbedded, isMemberSignUp }) => {

  const navigate = useNavigate();

  // Always show the toggle; default to 'seller' when coming from member intent,
  // otherwise 'buyer' as the right-side default — user can switch either way.
  const [roleType, setRoleType] = useState(isMemberSignUp ? 'seller' : 'seller');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    address: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [emptyFields, setEmptyFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (emptyFields.includes(name)) {
      setEmptyFields(emptyFields.filter(f => f !== name));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setEmptyFields([]);

    const currentEmptyFields = [];
    if (!formData.name.trim()) currentEmptyFields.push('name');
    if (!formData.email.trim()) currentEmptyFields.push('email');
    if (!formData.password) currentEmptyFields.push('password');
    if (!formData.confirmPassword) currentEmptyFields.push('confirmPassword');
    if (!formData.phone_number.trim()) currentEmptyFields.push('phone_number');
    if (!formData.address.trim()) currentEmptyFields.push('address');

    if (currentEmptyFields.length > 0) {
      setEmptyFields(currentEmptyFields);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);

      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword,
        roleType,
        formData.phone_number,
        formData.address
      );

      const userId =
        response.data.userId ||
        response.data.user?._id ||
        response.data.user?.id ||
        response.data.id;

      if (!userId) {
        setError(
          'Signup succeeded, but user ID was not returned. Check your email for the OTP, or try logging in.'
        );
        return;
      }

      navigate('/verify-email', {
        state: { userId, email: formData.email },
      });

    } catch (err) {
      const defaultError = err.request
        ? 'Network error. Is the backend server running?'
        : 'Something went wrong. Please try again.';
      setError(err.response?.data?.error || err.response?.data?.message || defaultError);
    } finally {
      setLoading(false);
    }
  };

  // ─── Role Toggle ─────────────────────────────────────────────────────────────
  const roleToggle = (
    <div className="mb-3 sm:mb-5">
      <p className="text-[10px] font-mono font-bold text-[#999] uppercase tracking-[0.1em] mb-1.5">
        Join as
      </p>

      {/* Rectangle toggle container */}
      <div className="relative flex items-center bg-[#f5f5f5] rounded-none w-full p-[2px]">

        {/* Sliding background */}
        <span
          className="absolute top-[2px] bottom-[2px] w-[calc(50%-2px)] rounded-none bg-[#0c0c0c] transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
          style={{
            transform: roleType === 'seller' ? 'translateX(2px)' : 'translateX(calc(100% + 2px))',
          }}
        />

        {/* Seller option */}
        <button
          type="button"
          onClick={() => setRoleType('seller')}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 rounded-none ${roleType === 'seller' ? 'text-white' : 'text-[#999] hover:text-[#555]'
            }`}
        >
          {/* Leaf icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          Seller
        </button>

        {/* Buyer option */}
        <button
          type="button"
          onClick={() => setRoleType('buyer')}
          className={`relative z-10 flex-1 flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono font-bold uppercase tracking-wider transition-colors duration-300 rounded-none ${roleType === 'buyer' ? 'text-white' : 'text-[#999] hover:text-[#555]'
            }`}
        >
          {/* Cart icon */}
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
          </svg>
          Buyer
        </button>

      </div>
    </div>
  );


  // ─── Form content ─────────────────────────────────────────────────────────

  const formContent = (
    <div className="w-full flex flex-col min-h-full">
      {!isEmbedded && (
        <div className="flex items-center space-x-4 sm:space-x-6 mb-5">
          <span
            className="text-[#0c0c0c] text-xl sm:text-2xl font-black uppercase wise-font tracking-tight border-b-2 border-[#0c0c0c] pb-1.5"
          >
            {isMemberSignUp ? 'Become a Member' : 'Sign Up'}
          </span>
          <Link
            to="/login"
            className="text-[#999] text-xl sm:text-2xl font-black uppercase wise-font tracking-tight pb-1.5 border-b-2 border-transparent hover:text-[#0c0c0c] transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      <div className="flex-1 flex flex-col justify-center">
        <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>

          {/* Role Toggle — always visible */}
          {roleToggle}

          {/* Name */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#111] uppercase tracking-[0.1em] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              placeholder={emptyFields.includes('name') ? 'Required' : 'Aarav Sharma'}
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-0 py-2 sm:py-2.5 bg-transparent border-0 border-b text-[14px] sm:text-[15px] focus:outline-none transition-colors ${emptyFields.includes('name')
                  ? 'border-red-500 placeholder:text-red-500/70 text-red-500'
                  : 'border-[#ddd] placeholder:text-[#888] text-[#0c0c0c] focus:border-[#0c0c0c]'
                }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[11px] font-mono font-bold text-[#111] uppercase tracking-[0.1em] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder={emptyFields.includes('email') ? 'Required' : 'aarav@example.com'}
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-0 py-2 sm:py-2.5 bg-transparent border-0 border-b text-[14px] sm:text-[15px] focus:outline-none transition-colors ${emptyFields.includes('email')
                  ? 'border-red-500 placeholder:text-red-500/70 text-red-500'
                  : 'border-[#ddd] placeholder:text-[#888] text-[#0c0c0c] focus:border-[#0c0c0c]'
                }`}
            />
          </div>

          {/* Phone and Address Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Phone Number */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#111] uppercase tracking-[0.1em] mb-1">
                Phone
              </label>
              <input
                type="tel"
                name="phone_number"
                placeholder={emptyFields.includes('phone_number') ? 'Required' : '+91 9876543210'}
                value={formData.phone_number}
                onChange={handleChange}
                className={`w-full px-0 py-2 sm:py-2.5 bg-transparent border-0 border-b text-[14px] sm:text-[15px] focus:outline-none transition-colors ${emptyFields.includes('phone_number')
                    ? 'border-red-500 placeholder:text-red-500/70 text-red-500'
                    : 'border-[#ddd] placeholder:text-[#888] text-[#0c0c0c] focus:border-[#0c0c0c]'
                  }`}
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#111] uppercase tracking-[0.1em] mb-1">
                Address
              </label>
              <input
                type="text"
                name="address"
                placeholder={emptyFields.includes('address') ? 'Required' : '123 Green St'}
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-0 py-2 sm:py-2.5 bg-transparent border-0 border-b text-[14px] sm:text-[15px] focus:outline-none transition-colors ${emptyFields.includes('address')
                    ? 'border-red-500 placeholder:text-red-500/70 text-red-500'
                    : 'border-[#ddd] placeholder:text-[#888] text-[#0c0c0c] focus:border-[#0c0c0c]'
                  }`}
              />
            </div>
          </div>

          {/* Password Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-6">
            {/* Password */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#111] uppercase tracking-[0.1em] mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={emptyFields.includes('password') ? 'Required' : '••••••••'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-0 py-2 sm:py-2.5 bg-transparent border-0 border-b text-[14px] sm:text-[15px] focus:outline-none transition-colors pr-8 ${emptyFields.includes('password')
                      ? 'border-red-500 placeholder:text-red-500/70 text-red-500'
                      : 'border-[#ddd] placeholder:text-[#888] text-[#0c0c0c] focus:border-[#0c0c0c]'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 ${emptyFields.includes('password') ? 'text-red-500' : 'text-[#999] hover:text-[#0c0c0c]'}`}
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-[11px] font-mono font-bold text-[#111] uppercase tracking-[0.1em] mb-1">
                Confirm
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  placeholder={emptyFields.includes('confirmPassword') ? 'Required' : '••••••••'}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`w-full px-0 py-2 sm:py-2.5 bg-transparent border-0 border-b text-[14px] sm:text-[15px] focus:outline-none transition-colors pr-8 ${emptyFields.includes('confirmPassword')
                      ? 'border-red-500 placeholder:text-red-500/70 text-red-500'
                      : 'border-[#ddd] placeholder:text-[#888] text-[#0c0c0c] focus:border-[#0c0c0c]'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className={`absolute right-0 top-1/2 -translate-y-1/2 ${emptyFields.includes('confirmPassword') ? 'text-red-500' : 'text-[#999] hover:text-[#0c0c0c]'}`}
                >
                  {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <p className="text-[12px] text-red-500">{error}</p>
          )}

          {/* Terms */}
          <div className="flex items-start space-x-2 pt-1">
            <input
              type="checkbox"
              className="w-[12px] h-[12px] mt-[3px] border-[#ccc] rounded-none accent-[#0c0c0c]"
            />
            <span className="text-[11px] sm:text-[12px] font-mono text-[#666] leading-tight">
              I agree to the{' '}
              <Link to="/terms" className="text-[#0c0c0c] font-semibold hover:underline">
                Terms
              </Link>
            </span>
          </div>

          {/* Submit */}
          <div className="w-full mt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary font-mono font-bold py-3 sm:py-3.5 text-[12px] sm:text-[13px] tracking-wide disabled:opacity-60 flex items-center justify-center"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-4 w-4 text-[#0c0c0c]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Processing...</span>
                </div>
              ) : (
                `Create Account →`
              )}
            </button>
          </div>

        </form>

        <div className="mt-4 pt-4 border-t border-[#eee] text-center text-[12px] font-mono text-[#999]">
          Already have an account?{' '}
          <Link to="/login" className="text-[#0c0c0c] font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return formContent;
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-x-hidden bg-white sm:bg-[#111]">
      <div className="absolute inset-0 bg-cover bg-center hidden sm:block" style={{ backgroundImage: `url(${authBg})` }} />
      <div className="absolute inset-0 bg-black/70 hidden sm:block" />
      <div className="relative z-10 w-full sm:max-w-[1060px] mx-0 sm:mx-4 md:mx-8 min-h-screen sm:min-h-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 bg-white sm:bg-[#0c0c0c] sm:border sm:border-[#222] overflow-hidden min-h-screen sm:min-h-[600px]">
          <div className="relative hidden lg:block min-h-[600px]">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
            <div className="absolute inset-0 bg-black/40" />
            <div className="relative z-10 h-full flex flex-col justify-end p-10">
              <div>
                <h2 className="text-white text-4xl leading-[1.05] tracking-tight mb-4 wise-font font-black uppercase">
                  Join the Green<br />Revolution.
                </h2>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs font-mono">
                  Build a sustainable future with blockchain-powered carbon credits.
                </p>

              </div>
            </div>
          </div>
          <div className="bg-white px-5 py-8 sm:p-10 lg:p-12 flex flex-col justify-start">
            {formContent}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;