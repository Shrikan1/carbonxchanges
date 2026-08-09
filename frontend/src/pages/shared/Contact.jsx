import React, { useState } from 'react';
import Navbar from '../../components/layout/Navbar';
import { FaUser, FaPhoneAlt, FaEnvelope, FaInfoCircle, FaPen } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/634013.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      {/* Hero Banner with Background Image */}
      <section className="relative h-[45vh] min-h-[400px] flex flex-col justify-center px-6 border-b border-[#222]">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src={heroBg} 
            alt="Wind turbines or solar panels" 
            className="w-full h-full object-cover opacity-30" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0c] to-transparent" />
          <div className="absolute inset-0 bg-[#0c0c0c]/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full pt-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4 text-white drop-shadow-md">
            Contact Us
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-xl font-light">
            Have questions about carbon credits or want to list your eco-project? We're here to help you build the future.
          </p>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="relative py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-start">
          
          {/* Left Column - Text and Contact Info */}
          <div className="lg:col-span-5 space-y-10">
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Get Your Instant <br className="hidden md:block" /> Free Consultation Now
            </h2>
            <div className="space-y-6">
              <p className="text-white/60 text-lg leading-relaxed font-medium">
                Reach out to our experts to learn more about our decentralized marketplace and verified environmental assets.
              </p>
              <p className="text-white/50 text-base leading-relaxed">
                Whether you are an organization looking to offset emissions or a project developer needing funding, our dedicated support team is ready to assist you every step of the way.
              </p>
            </div>
            
            {/* Phone Number Block */}
            <div className="flex items-center space-x-6 pt-4">
              <div className="w-16 h-16 rounded-full bg-[#10b981] flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.3)] shrink-0">
                <FaPhoneAlt className="text-white text-2xl" />
              </div>
              <div>
                <p className="text-white/50 text-sm font-mono uppercase tracking-widest mb-1">Call Us Directly</p>
                <p className="text-2xl md:text-3xl font-black tracking-tight">+1 800 555 44 33</p>
              </div>
            </div>
          </div>

          {/* Right Column - Form Card */}
          <div className="lg:col-span-7 lg:pl-12">
            <div className="bg-[#111] border border-[#222] rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden mt-[-100px] lg:mt-[-150px] z-20">
              {/* Subtle green glow inside card */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                
                {/* Inputs with Icons */}
                <div className="space-y-6">
                  {/* Name */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaUser className="text-white/30 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#333] py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Phone */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhoneAlt className="text-white/30 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-0 border-b border-[#333] py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-white/30 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#333] py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Subject */}
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaInfoCircle className="text-white/30 group-focus-within:text-emerald-500 transition-colors" />
                    </div>
                    <input
                      type="text"
                      placeholder="Subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      required
                      className="w-full bg-transparent border-0 border-b border-[#333] py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  {/* Message */}
                  <div className="relative group">
                    <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                      <FaPen className="text-white/30 group-focus-within:text-emerald-500 transition-colors mt-1" />
                    </div>
                    <textarea
                      placeholder="How can we help you? Feel free to get in touch!"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      required
                      rows={4}
                      className="w-full bg-transparent border-0 border-b border-[#333] py-4 pl-12 pr-4 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button type="submit" className="bg-[#10b981] hover:bg-[#059669] text-white font-bold py-4 px-10 rounded-full transition-colors shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        </div>
      </section>
    </div>
  );
};

export default Contact;
