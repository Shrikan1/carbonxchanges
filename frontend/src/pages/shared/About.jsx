import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';
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

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="text-sm font-bold tracking-widest text-[#888] uppercase">
              [<Link to="/" className="hover:text-white transition-colors">Home</Link> / <span className="text-emerald-500">About</span>]
            </div>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.1] tracking-tight">
              Building a Sustainable Future
            </h1>
            <p className="text-white/60 leading-relaxed max-w-md text-lg">
              At CarbonXplanet, we believe in the power of blockchain to achieve outstanding environmental results. With a team of experts and a commitment to transparency, we work hand-in-hand with our partners to bring green ideas to life.
            </p>
          </div>

          <div className="relative mt-8 md:mt-0">
            <div className="w-full aspect-[4/3] rounded-[2.5rem] overflow-hidden">
              <img
                src={img1}
                alt="Team working"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Circular Badge Overlay */}
            <div className="absolute -bottom-10 -left-6 md:-left-12 w-32 h-32 md:w-40 md:h-40 bg-[#0c0c0c] rounded-full flex items-center justify-center p-2">
              <div className="w-full h-full rounded-full border border-white/20 flex items-center justify-center relative">
                {/* Simplified rotating text effect */}
                <div className="absolute inset-0 rounded-full border border-dashed border-white/30 animate-[spin_20s_linear_infinite]" />
                <div className="w-12 h-12 md:w-16 md:h-16 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                  <FaArrowRight className="-rotate-45 text-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Intro Quote */}
      <section className="py-20 px-6 max-w-5xl mx-auto text-center mt-12 md:mt-0">
        <h2 className="text-2xl md:text-4xl font-medium leading-relaxed tracking-tight">
          At CarbonXplanet, we are reshaping the carbon credit market with practical, sustainable, and transparent solutions. We combine <span className="font-bold">cutting-edge technology</span> <span className="text-white/40">with trusted verification to ensure every project delivers real environmental impact.</span>
        </h2>
      </section>

      {/* Stats Section */}
      <section className="pb-24 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center md:divide-x divide-white/10">
          <div className="flex flex-col space-y-2">
            <span className="text-5xl md:text-6xl font-black">150+</span>
            <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Verified Projects</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-5xl md:text-6xl font-black">100+</span>
            <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Global Partners</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-5xl md:text-6xl font-black">2M+</span>
            <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Credits Retired</span>
          </div>
          <div className="flex flex-col space-y-2">
            <span className="text-5xl md:text-6xl font-black">30</span>
            <span className="text-white/50 text-sm font-medium uppercase tracking-wider">Winning Awards</span>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-24 px-6 max-w-7xl mx-auto border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* Images */}
          <div className="relative">
            <div className="w-[85%] aspect-[4/5] rounded-[2.5rem] overflow-hidden">
              <img
                src={img2}
                alt="Mission"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-10 right-0 w-[55%] aspect-square rounded-[2rem] overflow-hidden border-8 border-[#0c0c0c]">
              <img
                src={img3}
                alt="Mission overlap"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Our Mission</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              We are here to make environmental action accessible and transparent. Our goal is to build a reliable carbon market that supports global ecosystems and fosters genuine partnerships.
            </p>
            <p className="text-white/60 leading-relaxed text-lg">
              By relying on verified data and keeping our clients at the center of what we do, we aim to deliver clear, meaningful results in every transaction. Integrity is at the core of our work.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-center space-x-3 text-lg font-medium">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Supporting Green Development</span>
              </li>
              <li className="flex items-center space-x-3 text-lg font-medium">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Fostering Sustainable Growth</span>
              </li>
              <li className="flex items-center space-x-3 text-lg font-medium">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Prioritizing Our Community</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Our Vision */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">

          {/* Text (Left on Desktop) */}
          <div className="space-y-8 order-2 md:order-1">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Our Vision</h2>
            <p className="text-white/60 leading-relaxed text-lg">
              We see a future where environmental action is integrated seamlessly into everyday business. We want to build systems that actively benefit both local communities and the broader environment.
            </p>
            <p className="text-white/60 leading-relaxed text-lg">
              Using blockchain technology, we are paving the way for a smarter, greener industry. We focus on providing genuine value and long-term quality in everything we do.
            </p>

            <ul className="space-y-4 pt-4">
              <li className="flex items-center space-x-3 text-lg font-medium">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Clear & Transparent Tracking</span>
              </li>
              <li className="flex items-center space-x-3 text-lg font-medium">
                <FaCheckCircle className="text-emerald-500 flex-shrink-0" />
                <span>Modern Eco-friendly Solutions</span>
              </li>
            </ul>
          </div>

          {/* Images (Right on Desktop) */}
          <div className="relative order-1 md:order-2">
            <div className="w-[85%] aspect-[4/5] rounded-[2.5rem] overflow-hidden ml-auto">
              <img
                src={img4}
                alt="Vision"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-10 left-0 w-[55%] aspect-square rounded-[2rem] overflow-hidden border-8 border-[#0c0c0c]">
              <img
                src={img5}
                alt="Vision overlap"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default About;
