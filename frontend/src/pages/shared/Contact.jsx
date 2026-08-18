import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaUser, FaPhoneAlt, FaEnvelope, FaPen, FaMapMarkerAlt, FaTwitter, FaLinkedinIn, FaGithub, FaDiscord } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="flex-1 max-w-[1200px] w-full mx-auto px-6 py-24 lg:py-32 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">

        {/* Left Column - Contact Details */}
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl mb-6 text-gray-900 leading-none uppercase logo-retro tracking-tighter">
            Get in Touch
          </h1>
          <p className="text-gray-500 text-lg leading-relaxed max-w-md mb-12">
            Whether you have a question about our decentralized carbon credit marketplace, want to partner with us, or just want to say hi, we're here for you.
          </p>

          <div className="space-y-8">
            {/* Address */}
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">India Office</p>
                <p className="text-[15px] font-medium text-gray-900">Chhatrapati Sambhajinagar</p>
                <p className="text-[15px] font-medium text-gray-900">Maharashtra, India</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                <FaPhoneAlt className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Call Us</p>
                <p className="text-[15px] font-medium text-gray-900">+91 8080209999</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-5">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-blue-600 text-lg" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email Us</p>
                <p className="text-[15px] font-medium text-gray-900">contact@carbonxplanet.in</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Connect</p>
            <div className="flex items-center space-x-4">
              <a href="#twitter" className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300">
                <FaTwitter size={16} />
              </a>
              <a href="#linkedin" className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300">
                <FaLinkedinIn size={16} />
              </a>
              <a href="#github" className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-blue-600 hover:border-blue-100 hover:bg-blue-50 transition-all duration-300">
                <FaGithub size={16} />
              </a>
              <a href="#discord" className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-all duration-300">
                <FaDiscord size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex items-center justify-center">
          <div className="bg-white border border-gray-100 p-8 md:p-10 shadow-xl rounded-3xl w-full">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-gray-900 tracking-tight">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhoneAlt className="text-gray-400 text-sm" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <FaPen className="text-gray-400 text-sm mt-0.5" />
                </div>
                <textarea
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-gray-50 border border-gray-200 py-3.5 pl-11 pr-4 text-sm text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-sm mt-4 flex justify-center items-center">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Contact;
