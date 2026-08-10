import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { FaUser, FaPhoneAlt, FaEnvelope, FaPen } from 'react-icons/fa';

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

      <div className="flex-1 flex items-center justify-center p-4 mt-16 relative z-10">
        <div className="bg-[#111]/90 backdrop-blur-md border border-[#222] rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-sm relative group">
          
          <div className="relative z-10 text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1">SAY HELLO!</h1>
            <p className="text-white/50 text-xs md:text-sm">We'd love to hear from you. Drop us a line.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-white/30 text-xs" />
              </div>
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-black/40 border border-[#222] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="flex gap-3">
              <div className="relative w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-white/30 text-xs" />
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full bg-black/40 border border-[#222] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
              <div className="relative w-1/2">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhoneAlt className="text-white/30 text-xs" />
                </div>
                <input
                  type="tel"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-black/40 border border-[#222] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>
            </div>

            <div className="relative">
              <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                <FaPen className="text-white/30 text-xs" />
              </div>
              <textarea
                placeholder="Your message..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={3}
                className="w-full bg-black/40 border border-[#222] rounded-xl py-2.5 pl-9 pr-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
              />
            </div>

            <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3 px-6 rounded-xl transition-colors text-sm mt-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              Send Message
            </button>
          </form>
          
          <div className="mt-5 text-center text-[10px] md:text-xs text-white/40">
            Or call us directly at <br/>
            <span className="text-emerald-500/80 font-mono inline-block mt-1">+1 800 555 44 33</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
