import React from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FaCheckCircle, FaArrowRight, FaGlobeAmericas, FaLeaf, FaLink } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import img1 from '../../assets/1744ff3b8f6c99355ca2b0eafe081094.webp';
import img2 from '../../assets/4k-wallpaper-clouds-cropland-dawn.jpg';
import img3 from '../../assets/b6bd59b154cff2b6bcee4252068bfbaf.webp';
import img4 from '../../assets/images (3).jpg';
import img5 from '../../assets/nature-outdoors-countryside-hill.jpg';

const About = () => {
  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-32 pb-24 px-6 min-h-[80vh] flex items-center justify-center overflow-hidden border-b border-[#111]">
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden select-none">
          <span className="text-[15vw] font-black leading-none whitespace-nowrap logo-retro uppercase tracking-tighter">
            CARBONXPLANET
          </span>
        </div>
        
        <div className="max-w-[1400px] w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          <div className="space-y-8">
            <p className="text-[13px] font-mono uppercase tracking-[0.2em] text-[#bef264]">Who We Are</p>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-normal leading-[1.0] tracking-tighter uppercase logo-retro text-white">
              Building<br/>A Sustainable<br/><span className="text-[#bef264]">Future.</span>
            </h1>
            <p className="text-[#888] leading-relaxed max-w-lg text-[18px] font-medium">
              At CarbonXplanet, we believe in the power of blockchain to achieve outstanding environmental results. With a team of experts and a commitment to transparency, we work hand-in-hand with our partners to bring green ideas to life.
            </p>
          </div>

          <div className="relative w-full h-[500px] rounded-3xl overflow-hidden shadow-2xl border border-gray-800 group">
            <img
              src={img1}
              alt="Team working"
              className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex items-center space-x-4 bg-black/40 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="w-12 h-12 rounded-full bg-[#bef264] flex items-center justify-center text-[#0a0a0a] shrink-0">
                  <FaGlobeAmericas className="text-xl" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm tracking-widest uppercase font-['JetBrains_Mono']">Global Impact</h4>
                  <p className="text-[#aaa] text-xs">Connecting projects worldwide.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── INTRO QUOTE ─── */}
      <section className="py-32 px-6 max-w-4xl mx-auto text-center relative">
        <FaLeaf className="text-[#bef264] text-5xl mx-auto mb-10 opacity-20" />
        <h2 className="text-3xl md:text-5xl font-medium leading-[1.4] tracking-tight text-[#eee]">
          At CarbonXplanet, we are reshaping the carbon credit market with practical, sustainable, and transparent solutions. We combine <span className="text-[#bef264] font-bold">cutting-edge technology</span> <span className="text-[#666]">with trusted verification to ensure every project delivers real environmental impact.</span>
        </h2>
      </section>

      {/* ─── OUR MISSION (DARK GREEN) ─── */}
      <section className="bg-[#022c22] py-32 px-6 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          
          <div className="relative h-[600px] w-full">
            <div className="absolute top-0 right-10 w-[70%] h-[70%] rounded-[2rem] overflow-hidden border border-[#064e3b] shadow-2xl z-10 transform -rotate-3 transition-transform hover:rotate-0 duration-500">
              <img src={img2} alt="Mission" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 left-0 w-[60%] h-[60%] rounded-[2rem] overflow-hidden border-8 border-[#022c22] shadow-2xl z-20 transform rotate-3 transition-transform hover:rotate-0 duration-500">
              <img src={img3} alt="Mission overlap" className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="space-y-8 lg:pl-10">
            <h2 className="text-5xl md:text-7xl font-normal tracking-tighter uppercase logo-retro text-white">Our<br/><span className="text-[#10b981]">Mission.</span></h2>
            <p className="text-white/80 leading-relaxed text-[18px] font-medium max-w-lg">
              We are here to make environmental action accessible and transparent. Our goal is to build a reliable carbon market that supports global ecosystems and fosters genuine partnerships.
            </p>
            <p className="text-white/60 leading-relaxed text-[16px] max-w-lg">
              By relying on verified data and keeping our clients at the center of what we do, we aim to deliver clear, meaningful results in every transaction. Integrity is at the core of our work.
            </p>

            <ul className="space-y-6 pt-6">
              {[
                "Supporting Green Development",
                "Fostering Sustainable Growth",
                "Prioritizing Our Community"
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#10b981]/20 flex items-center justify-center shrink-0">
                    <FaCheckCircle className="text-[#10b981]" />
                  </div>
                  <span className="text-lg font-bold tracking-widest uppercase text-white/90 font-['JetBrains_Mono']">{item}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ─── OUR VISION ─── */}
      <section className="py-32 px-6 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none overflow-hidden select-none">
          <span className="text-[25vw] font-black leading-none whitespace-nowrap logo-retro uppercase tracking-tighter text-white">
            VISION
          </span>
        </div>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center relative z-10">
          
          <div className="space-y-8 order-2 lg:order-1 lg:pr-10">
            <h2 className="text-5xl md:text-7xl font-normal tracking-tighter uppercase logo-retro text-white">Our<br/><span className="text-[#bef264]">Vision.</span></h2>
            <p className="text-white/80 leading-relaxed text-[18px] font-medium max-w-lg">
              We see a future where environmental action is integrated seamlessly into everyday business. We want to build systems that actively benefit both local communities and the broader environment.
            </p>
            <p className="text-white/60 leading-relaxed text-[16px] max-w-lg">
              Using blockchain technology, we are paving the way for a smarter, greener industry. We focus on providing genuine value and long-term quality in everything we do.
            </p>

            <ul className="space-y-6 pt-6">
              {[
                "Clear & Transparent Tracking",
                "Modern Eco-friendly Solutions"
              ].map((item, i) => (
                <li key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 rounded-full bg-[#bef264]/20 flex items-center justify-center shrink-0">
                    <FaLink className="text-[#bef264]" />
                  </div>
                  <span className="text-lg font-bold tracking-widest uppercase text-white/90 font-['JetBrains_Mono']">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative h-[600px] w-full order-1 lg:order-2">
            <div className="absolute top-10 right-0 w-[75%] h-[80%] rounded-[2rem] overflow-hidden border border-[#222] shadow-2xl z-10 group">
              <img src={img4} alt="Vision" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
            </div>
            <div className="absolute bottom-10 left-0 w-[50%] h-[50%] rounded-[2rem] overflow-hidden border-8 border-[#0a0a0a] shadow-2xl z-20 group">
              <img src={img5} alt="Vision overlap" className="w-full h-full object-cover transform transition-transform duration-1000 group-hover:scale-110" />
            </div>
          </div>

        </div>
      </section>

      {/* ─── CTA SECTION ─── */}
      <section className="bg-white py-24 px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-[13px] font-bold font-['JetBrains_Mono'] uppercase tracking-widest text-gray-500">Join the Movement</p>
          <h2 className="text-4xl md:text-6xl font-normal tracking-tighter uppercase logo-retro text-[#0a0a0a]">
            Ready to make an impact?
          </h2>
          <div className="pt-8">
            <Link to="/signup" className="inline-flex items-center space-x-3 bg-[#bef264] text-[#0a0a0a] px-10 py-5 text-[14px] font-black uppercase tracking-widest hover:bg-[#a3e635] transition-all hover:scale-105 shadow-xl">
              <span>GET STARTED</span>
              <FaArrowRight className="text-xs" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
