import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import { signup } from "../../api/endpoint/Authapi";
import Loader from '../../components/Loader';

const Signup = ({ isEmbedded }) => {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState('');




  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

  };


  // -----------------------------
  // Handle signup
  // -----------------------------

  const handleSubmit = async (e) => {

    e.preventDefault();

    setError('');


    // Validate fields

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError('Please fill all the fields.');
      return;
    }


    // Validate password

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError('Passwords do not match.');
      return;
    }


    try {

      setLoading(true);


      // Call signup API

      const response = await signup(
        formData.name,
        formData.email,
        formData.password,
        formData.confirmPassword
      );


      console.log(
        'Signup successful:',
        response.data
      );


      /*
        IMPORTANT:

        This assumes your backend returns:

        {
          userId: "...",
          message: "..."
        }

        If your backend returns a different structure,
        change response.data.userId accordingly.
      */

      const userId = response.data.userId || response.data.user?._id || response.data.user?.id || response.data.id;

      // Make sure backend returned userId
      if (!userId) {
        setError(
          'Signup succeeded, but user ID was not returned by the server. Please check your email for the OTP, or try logging in.'
        );
        return;
      }


      // Go to OTP verification

      navigate('/verify-email', {
        state: {
          userId: userId,
          email: formData.email,
        },
      });


    } catch (error) {

      console.error(
        'Signup failed:',
        error
      );


      const defaultError = error.request ? 'Network error. Is the backend server running?' : 'Something went wrong. Please try again.';
      setError(error.response?.data?.message || defaultError);


    } finally {

      setLoading(false);

    }

  };


  const formContent = (
    <div className="w-full h-full flex flex-col">
      {!isEmbedded && (
        <>
          {/* Mobile logo removed */}
          <div className="flex items-center space-x-6 mb-8">
            <span className="text-[#0c0c0c] text-xl tracking-tight border-b-2 border-[#0c0c0c] pb-2" style={{ fontFamily: "'Bungee', cursive" }}>
              Sign Up
            </span>
            <Link
              to="/login"
              className="text-[#999] text-xl tracking-tight pb-2 border-b-2 border-transparent hover:text-[#0c0c0c] transition-colors"
              style={{ fontFamily: "'Bungee', cursive" }}
            >
              Sign In
            </Link>
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col justify-center">
      {/* FORM */}
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >


                  {/* Name */}

                  <div>

                    <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">

                      Full Name

                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Aarav Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#888] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                    />

                  </div>


                  {/* Email */}

                  <div>

                    <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">

                      Email

                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="aarav@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#888] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                    />

                  </div>


                  {/* Password */}

                  <div>

                    <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">

                      Password

                    </label>

                    <div className="relative">

                      <input
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="password"
                        placeholder="••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#888] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0c0c0c]"
                      >

                        {showPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* Confirm Password */}

                  <div>

                    <label className="block text-[14px] font-mono font-bold text-[#111] uppercase tracking-[0.12em] mb-2">

                      Confirm Password

                    </label>

                    <div className="relative">

                      <input
                        type={
                          showConfirmPassword
                            ? 'text'
                            : 'password'
                        }
                        name="confirmPassword"
                        placeholder="••••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-0 py-3.5 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[16px] placeholder:text-[#888] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-[#999] hover:text-[#0c0c0c]"
                      >

                        {showConfirmPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* Error */}

                  {error && (

                    <p className="text-sm text-red-500">
                      {error}
                    </p>

                  )}


                  {/* Terms */}

                  <div className="flex items-start space-x-2 pt-1">

                    <input
                      type="checkbox"
                      className="w-[14px] h-[14px] mt-0.5 border-[#ccc] rounded-none accent-[#0c0c0c]"
                    />

                    <span className="text-[13px] text-[#666] leading-snug">

                      I agree to the{' '}

                      <Link
                        to="/terms"
                        className="text-[#0c0c0c] font-semibold hover:underline"
                      >
                        Terms & Conditions
                      </Link>

                    </span>

                  </div>


                  {/* Submit */}

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
                        <span>Processing...</span>
                      </div>
                    ) : (
                      'Create Account'
                    )}

                  </button>

                </form>


                {/* Bottom link */}

          <div className="mt-6 pt-5 border-t border-[#eee] text-center text-[13px] text-[#999]">
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
    <>
        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">
              <div className="relative hidden lg:block min-h-[680px]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${authBg})` }} />
                <div className="absolute inset-0 bg-black/40" />
                <div className="relative z-10 h-full flex flex-col justify-end p-10">
                  {/* Top Logo removed */}
                  <div>
                    <h2 className="text-white text-4xl leading-[1.05] tracking-tight mb-4 logo-retro-white">
                      Join the Green<br />Revolution.
                    </h2>
                    <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                      Build a sustainable future with blockchain-powered carbon credits.
                    </p>
                    <div className="mt-8 pt-6 border-t border-white/10 text-white/40 text-xs">
                      © 2026 CarbonXplanet. All rights reserved.
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 sm:p-10 lg:p-12 flex flex-col justify-start min-h-[680px]">
                {formContent}
              </div>
            </div>
          </div>
        </div>
    </>


  );
};

export default Signup;