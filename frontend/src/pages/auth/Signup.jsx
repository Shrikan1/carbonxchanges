import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import authBg from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import { signup } from "../../api/endpoint/Authapi";
import Loader from '../../components/Loader';

const Signup = () => {

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

      const userId = response.data.userId;


      // Make sure backend returned userId

      if (!userId) {

        setError(
          'Signup succeeded, but user ID was not returned by the server.'
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


      setError(
        error.response?.data?.message ||
        'Something went wrong. Please try again.'
      );


    } finally {

      setLoading(false);

    }

  };


  return (

    <>
      {loading ? (

        <Loader />

      ) : (

        <div className="min-h-screen relative flex items-center justify-center overflow-hidden">

          {/* Full-screen background */}

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${authBg})`,
            }}
          />

          <div className="absolute inset-0 bg-black/70" />


          {/* Main container */}

          <div className="relative z-10 w-full max-w-[1060px] mx-4 md:mx-8">

            <div className="grid grid-cols-1 lg:grid-cols-2 bg-[#0c0c0c] border border-[#222] overflow-hidden">


              {/* LEFT PANEL */}

              <div className="relative hidden lg:block min-h-[640px]">

                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${authBg})`,
                  }}
                />

                <div className="absolute inset-0 bg-black/40" />


                <div className="relative z-10 h-full flex flex-col justify-between p-10">

                  {/* Logo */}

                  <div className="flex items-center space-x-3">

                    <span className="text-white text-lg font-bold tracking-tight">
                      CarbonXplanet
                    </span>

                  </div>


                  {/* Bottom content */}

                  <div>

                    <h2 className="text-white text-4xl font-black leading-[1.05] tracking-tight mb-4">

                      Join the Green
                      <br />
                      Revolution.

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


              {/* RIGHT PANEL */}

              <div className="bg-white p-8 sm:p-12 lg:p-14 flex flex-col justify-center min-h-[640px]">


                {/* Mobile logo */}

                <div className="flex items-center space-x-2 mb-8 lg:hidden">

                  <span className="text-[#0c0c0c] text-base font-bold tracking-tight">

                    CarbonXplanet

                  </span>

                </div>


                {/* Tabs */}

                <div className="flex items-center space-x-6 mb-8">

                  <span className="text-[#0c0c0c] text-xl font-black tracking-tight border-b-2 border-[#0c0c0c] pb-2">

                    Sign Up

                  </span>

                  <Link
                    to="/login"
                    className="text-[#999] text-xl font-medium tracking-tight pb-2 border-b-2 border-transparent hover:text-[#0c0c0c] transition-colors"
                  >

                    Sign In

                  </Link>

                </div>


                {/* FORM */}

                <form
                  className="space-y-5"
                  onSubmit={handleSubmit}
                >


                  {/* Name */}

                  <div>

                    <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">

                      Full Name

                    </label>

                    <input
                      type="text"
                      name="name"
                      placeholder="Alex Johnson"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors"
                    />

                  </div>


                  {/* Email */}

                  <div>

                    <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">

                      Email

                    </label>

                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
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
                        type={
                          showPassword
                            ? 'text'
                            : 'password'
                        }
                        name="password"
                        placeholder="••••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
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

                    <label className="block text-[11px] font-mono font-medium text-[#999] uppercase tracking-[0.12em] mb-2">

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
                        className="w-full px-0 py-3 bg-transparent border-0 border-b border-[#ddd] text-[#0c0c0c] text-[15px] placeholder:text-[#bbb] focus:outline-none focus:border-[#0c0c0c] transition-colors pr-10"
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
                    className="w-full bg-[#0c0c0c] text-white font-semibold py-3.5 text-[14px] tracking-wide hover:bg-[#222] transition-colors mt-2 disabled:opacity-60"
                  >

                    Create Account

                  </button>

                </form>


                {/* Bottom link */}

                <p className="mt-8 text-center text-[13px] text-[#999]">

                  Already have an account?{' '}

                  <Link
                    to="/login"
                    className="text-[#0c0c0c] font-semibold hover:underline"
                  >
                    Sign In
                  </Link>

                </p>

              </div>

            </div>

          </div>

        </div>

      )}

    </>

  );
};

export default Signup;