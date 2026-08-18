import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaCheckCircle, FaArrowRight, FaGlobeAmericas, FaLeaf, FaLink } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import heroImage from '../../assets/forest-wallpaper-3840x2160-nature-tranquil-6524.jpg';

const About = () => {
  return (
    <div className="bg-white text-gray-900 min-h-screen font-sans overflow-x-hidden selection:bg-[#bef264] selection:text-black">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="pt-32 sm:pt-40 pb-20 px-6 max-w-[1200px] mx-auto text-center relative z-10">
        <div className="space-y-6 flex flex-col items-center">
          <p className="text-[13px] font-bold font-['JetBrains_Mono'] uppercase tracking-[0.2em] text-[#84cc16] bg-[#bef264]/10 px-4 py-1.5 rounded-full inline-block">
            Who We Are
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal leading-[1.05] tracking-tight text-gray-900 logo-retro max-w-4xl mx-auto">
            Building a <br className="hidden sm:block" /> Sustainable Future.
          </h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl text-[18px] sm:text-[20px] font-medium mx-auto pt-4">
            At CarbonXplanet, we believe in the power of blockchain to achieve outstanding environmental results. We work hand-in-hand with our partners to bring green ideas to life.
          </p>
        </div>
      </section>

      {/* ─── SINGLE HERO IMAGE ─── */}
      <section className="px-4 sm:px-6 max-w-[1400px] mx-auto pb-24">
        <div className="relative w-full h-[400px] sm:h-[600px] rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 group">
          <img
            src={heroImage}
            alt="Wind turbines connecting the globe"
            className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 sm:bottom-10 sm:left-10 flex items-center space-x-4 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl">
            <div className="w-12 h-12 rounded-full bg-[#bef264] flex items-center justify-center text-[#0a0a0a] shrink-0">
              <FaGlobeAmericas className="text-xl" />
            </div>
            <div>
              <h4 className="text-gray-900 font-bold text-[15px] tracking-wide font-['JetBrains_Mono']">Global Impact</h4>
              <p className="text-gray-500 text-sm">Connecting projects worldwide.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO QUOTE ─── */}
      <section className="py-24 px-6 max-w-4xl mx-auto text-center border-t border-gray-100">
        <FaLeaf className="text-[#84cc16] text-4xl mx-auto mb-8 opacity-40" />
        <h2 className="text-2xl sm:text-4xl font-medium leading-[1.5] tracking-tight text-gray-800">
          We are reshaping the carbon credit market with practical, sustainable, and transparent solutions. We combine <span className="text-black font-bold border-b-4 border-[#bef264]">cutting-edge technology</span> with trusted verification to ensure every project delivers real environmental impact.
        </h2>
      </section>

      {/* ─── MISSION & VISION GRID ─── */}
      <section className="bg-gray-50 py-32 border-t border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
          
          {/* Mission */}
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-8">
              <FaCheckCircle className="text-2xl text-[#84cc16]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 logo-retro">Our Mission.</h2>
            <p className="text-gray-600 leading-relaxed text-[17px]">
              We are here to make environmental action accessible and transparent. Our goal is to build a reliable carbon market that supports global ecosystems and fosters genuine partnerships.
            </p>
            <p className="text-gray-500 leading-relaxed text-[15px]">
              By relying on verified data and keeping our clients at the center of what we do, we aim to deliver clear, meaningful results in every transaction. Integrity is at the core of our work.
            </p>
            <ul className="space-y-4 pt-4">
              {["Supporting Green Development", "Fostering Sustainable Growth", "Prioritizing Our Community"].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#84cc16]" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Vision */}
          <div className="space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center mb-8">
              <FaLink className="text-2xl text-[#84cc16]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-normal tracking-tight text-gray-900 logo-retro">Our Vision.</h2>
            <p className="text-gray-600 leading-relaxed text-[17px]">
              We see a future where environmental action is integrated seamlessly into everyday business. We want to build systems that actively benefit both local communities and the broader environment.
            </p>
            <p className="text-gray-500 leading-relaxed text-[15px]">
              Using blockchain technology, we are paving the way for a smarter, greener industry. We focus on providing genuine value and long-term quality in everything we do.
            </p>
            <ul className="space-y-4 pt-4">
              {["Clear & Transparent Tracking", "Modern Eco-friendly Solutions"].map((item, i) => (
                <li key={i} className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-[#84cc16]" />
                  <span className="text-gray-700 font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="bg-white py-32 px-6">
        <div className="max-w-[1200px] mx-auto bg-gray-900 rounded-[3rem] p-12 sm:p-20 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-[#bef264] opacity-5 pointer-events-none mix-blend-overlay" />
          
          <h2 className="text-3xl md:text-5xl font-normal tracking-tight text-white mb-6 logo-retro relative z-10">
            Ready to make an impact?
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-[18px] relative z-10">
            Join thousands of individuals and organizations creating a sustainable future through transparent, verified carbon credits.
          </p>
          
          <div className="relative z-10">
            <Link to="/signup" className="inline-flex items-center space-x-3 bg-[#bef264] text-gray-900 px-10 py-5 rounded-full text-[16px] font-bold tracking-wide hover:bg-[#a3e635] transition-all hover:scale-105 shadow-[0_0_40px_rgba(190,242,100,0.2)]">
              <span>Get Started Today</span>
              <FaArrowRight className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
