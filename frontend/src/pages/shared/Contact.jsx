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
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans flex flex-col relative overflow-hidden">
      <Navbar />

      <div className="flex-1 max-w-6xl w-full mx-auto px-6 py-32 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">

        {/* Left Column - Contact Details */}
        <div className="flex flex-col justify-center">
          <h1 className="logo-retro text-[clamp(2rem,4vw,3.5rem)] mb-6 text-white tracking-tight leading-none" style={{ WebkitTextFillColor: '#ffffffff', background: 'none' }}>
            GET IN TOUCH
          </h1>
          <p className="text-[#888] text-base leading-relaxed max-w-md mb-12">
            Whether you have a question about our decentralized carbon credit marketplace, want to partner with us, or just want to say hi, we're here for you.
          </p>

          <div className="space-y-8">
            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
                <FaMapMarkerAlt className="text-[#bef264] text-sm" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-1">India Office</p>
                <p className="text-[14px] text-white">123 Green Block, Tech Park Phase 2</p>
                <p className="text-[14px] text-white">Bengaluru, Karnataka, India 560100</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
                <FaPhoneAlt className="text-[#bef264] text-sm" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-1">Call Us</p>
                <p className="text-[14px] font-mono text-white">+91 98765 43210</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center flex-shrink-0">
                <FaEnvelope className="text-[#bef264] text-sm" />
              </div>
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-1">Email Us</p>
                <p className="text-[14px] font-mono text-white">contact@carbonxplanet.in</p>
              </div>
            </div>
          </div>

          <div className="mt-16">
            <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-4">Connect</p>
            <div className="flex items-center space-x-3">
              <a href="#twitter" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#bef264] hover:border-[#bef264]/50 transition-colors">
                <FaTwitter size={14} />
              </a>
              <a href="#linkedin" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#bef264] hover:border-[#bef264]/50 transition-colors">
                <FaLinkedinIn size={14} />
              </a>
              <a href="#github" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#bef264] hover:border-[#bef264]/50 transition-colors">
                <FaGithub size={14} />
              </a>
              <a href="#discord" className="w-10 h-10 rounded-full bg-[#111] border border-[#222] flex items-center justify-center text-[#888] hover:text-[#bef264] hover:border-[#bef264]/50 transition-colors">
                <FaDiscord size={14} />
              </a>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="flex items-center justify-center">
          <div className="bg-[#111]/90 backdrop-blur-md border border-[#222] p-8 md:p-10 shadow-2xl w-full">
            <h2 className="text-xl md:text-2xl font-semibold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FaUser className="text-white/30 text-sm" />
                </div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full bg-[#0c0c0c] border border-[#222] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#bef264] transition-colors"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-5">
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaEnvelope className="text-white/30 text-sm" />
                  </div>
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="w-full bg-[#0c0c0c] border border-[#222] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#bef264] transition-colors"
                  />
                </div>
                <div className="relative w-full sm:w-1/2">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaPhoneAlt className="text-white/30 text-sm" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#0c0c0c] border border-[#222] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#bef264] transition-colors"
                  />
                </div>
              </div>

              <div className="relative">
                <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                  <FaPen className="text-white/30 text-sm" />
                </div>
                <textarea
                  placeholder="How can we help you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full bg-[#0c0c0c] border border-[#222] py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/30 focus:outline-none focus:border-[#bef264] transition-colors resize-none"
                />
              </div>

              <button type="submit" className="w-full bg-[#bef264] hover:bg-[#a6d854] text-[#0c0c0c] font-bold py-4 px-6 transition-colors text-sm mt-4 uppercase tracking-wider">
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
