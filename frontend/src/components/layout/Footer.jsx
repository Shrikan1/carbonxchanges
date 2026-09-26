import React from 'react';
import { Link } from 'react-router-dom';
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="w-full bg-[#0a0a0a] pb-12 pt-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#111] border border-[#222] rounded-[2rem] p-10 md:p-16 shadow-2xl relative overflow-hidden">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16 relative z-10">
            {/* Logo and Description (Left Column) */}
            <div className="md:col-span-5">
              <Link to="/" className="flex items-center mb-6">
                <span className="font-bold uppercase tracking-tight text-emerald-400 text-3xl">
                  CARBONXPLANET
                </span>
              </Link>
              <p className="text-[#888] text-sm leading-relaxed mb-8 max-w-sm">
                CarbonXplanet empowers teams to transform environmental impact into clear, compelling action making carbon offsetting easier to share, understand, and act on.
              </p>
              
              <div className="flex space-x-5">
                <a href="#" className="text-[#666] hover:text-white transition-colors">
                  <FaTwitter className="text-xl" />
                </a>
                <a href="#" className="text-[#666] hover:text-white transition-colors">
                  <FaInstagram className="text-xl" />
                </a>
                <a href="#" className="text-[#666] hover:text-white transition-colors">
                  <FaLinkedinIn className="text-xl" />
                </a>
                <a href="#" className="text-[#666] hover:text-white transition-colors">
                  <FaGithub className="text-xl" />
                </a>
              </div>

            </div>

            {/* Links Columns (Right Columns) */}
            <div className="md:col-span-7 grid grid-cols-2 gap-8 pt-2">

              <div>
                <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Platform</h4>
                <ul className="space-y-4">
                  <li><Link to="/" className="text-[#888] hover:text-white text-sm transition-colors">Home</Link></li>
                  <li><Link to="/marketplace" className="text-[#888] hover:text-white text-sm transition-colors">Marketplace</Link></li>
                  <li><Link to="/posts" className="text-[#888] hover:text-white text-sm transition-colors">Posts</Link></li>
                  <li><Link to="/article" className="text-[#888] hover:text-white text-sm transition-colors">Article</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">Resources</h4>
                <ul className="space-y-4">
                  <li><a href="#" className="text-[#888] hover:text-white text-sm transition-colors">Documentation</a></li>
                  <li><a href="#" className="text-[#888] hover:text-white text-sm transition-colors">Tutorials</a></li>
                  <li><a href="#" className="text-[#888] hover:text-white text-sm transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-[#888] hover:text-white text-sm transition-colors">Support</a></li>
                </ul>
              </div>


            </div>
          </div>


          {/* Subtle large background text like the image (watermark effect) */}
          <div className="absolute -bottom-[20%] left-1/2 transform -translate-x-1/2 text-[15vw] font-bold uppercase tracking-tighter opacity-[0.03] text-white pointer-events-none select-none whitespace-nowrap">
            CarbonXplanet
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
