import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, LayoutGroup } from 'motion/react';
import {
  FaArrowRight,
  FaTree,
  FaWind,
  FaSolarPanel,
  FaShieldAlt,
  FaBolt,
  FaChartLine,
  FaFileContract,
  FaWallet,
  FaSearch,
  FaHandshake,
  FaLinkedinIn,
  FaTwitter,
  FaGithub,
  FaDiscord
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import DriftWall from '../../components/ui/DriftWall';
import heroBg from '../../assets/forest-wallpaper-3840x2160-nature-tranquil-6524.jpg';
import GlareHover from '../../components/ui/GlareHover';
import DecryptedText from '../../components/ui/DecryptedText';
import ScrollExpand from '../../components/ui/ScrollExpand';
import TextLoop from '../../components/ui/TextLoop';
import img1 from '../../assets/1744ff3b8f6c99355ca2b0eafe081094.webp';
import img2 from '../../assets/18297.jpg';
import img3 from '../../assets/4k-wallpaper-clouds-cropland-dawn.jpg';
import img4 from '../../assets/634013.jpg';
import img5 from '../../assets/Mangrove-Forest-Coast-2000x1237-1.jpg';
import img6 from '../../assets/b6bd59b154cff2b6bcee4252068bfbaf.webp';
import img7 from '../../assets/images (3).jpg';
import img8 from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import img9 from '../../assets/nature-outdoors-countryside-hill.jpg';
import img10 from '../../assets/os-x-mavericks-3840x2160-24079.jpg';
import img11 from '../../assets/pexels-adnan-atasoy-261355608-12644453.jpg';
import img12 from '../../assets/shutterstock_297591356.jpg.webp';
import img13 from '../../assets/wp2557992.jpg';
import img14 from '../../assets/wp9161748.jpg';

const projectGalleryItems = [
  { image: img1, title: 'Tropical Rainforest' },
  { image: img2, title: 'Wind Turbines' },
  { image: img3, title: 'Solar Panels' },
  { image: img4, title: 'Mountain Valley' },
  { image: img5, title: 'Ocean Conservation' },
  { image: img6, title: 'Green Plantation' },
  { image: img7, title: 'Sunrise Forest' },
  { image: img8, title: 'Recycling Hub' },
  { image: img9, title: 'Evergreen Landscape' },
  { image: img10, title: 'Golden Fields' },
  { image: img11, title: 'Mangrove Roots' },
  { image: img12, title: 'Aerial Forest' },
  { image: img13, title: 'Waterfall Canyon' },
  { image: img14, title: 'Alpine Peaks' },
  { image: heroBg, title: 'River Bridge' },
];


const Home = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isFirstVisit] = useState(() => {
    if (shouldReduceMotion) return false;
    return !sessionStorage.getItem('playedIntro');
  });
  const [showIntro, setShowIntro] = useState(isFirstVisit);
  const [showCenterLogo, setShowCenterLogo] = useState(isFirstVisit);

  useEffect(() => {
    if (isFirstVisit) {
      sessionStorage.setItem('playedIntro', 'true');
      document.body.style.overflow = 'hidden';
      const timer = setTimeout(() => {
        setShowCenterLogo(false);
        setShowIntro(false);
        document.body.style.overflow = 'unset';
      }, 1600);
      return () => {
        clearTimeout(timer);
        document.body.style.overflow = 'unset';
      };
    }
  }, [isFirstVisit]);

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans">
      <AnimatePresence>
        {showIntro && (
          <motion.div
            className="fixed inset-0 z-[9999] bg-[#0c0c0c] flex items-center justify-center pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            {showCenterLogo && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                transition={{ duration: 1.0, ease: 'easeOut', delay: 0.1 }}
              >
                <motion.span
                  layoutId="brand-logo"
                  className="logo-retro text-[clamp(3rem,8vw,6rem)]"
                  style={{
                    WebkitTextStroke: '2px #bef264',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                    background: 'none'
                  }}
                  transition={{ layout: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}
                >
                  CarbonXplanet
                </motion.span>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <Navbar animateEntrance={isFirstVisit} hideLogo={showCenterLogo} />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-[#0c0c0c]/30" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-8">
          {/* Headline — word-by-word stagger reveal */}
          <div className="flex flex-col items-center justify-center space-y-2 mb-10 mt-4">
            {['Offset Emissions.', 'Build the Future.'].map((line, lineIdx) => (
              <div key={lineIdx} className="flex flex-wrap justify-center gap-x-[0.3em]">
                {line.split(' ').map((word, wordIdx) => (
                  <motion.span
                    key={wordIdx}
                    className="logo-retro text-[clamp(2.5rem,6vw,5rem)] uppercase tracking-tight drop-shadow-lg leading-[1.1] inline-block"
                    style={{ WebkitTextFillColor: 'white', background: 'none' }}
                    initial={isFirstVisit ? { opacity: 0, y: 40, filter: 'blur(12px)' } : false}
                    animate={isFirstVisit ? { opacity: 1, y: 0, filter: 'blur(0px)' } : false}
                    transition={isFirstVisit ? {
                      duration: 1.2,
                      ease: [0.22, 1, 0.36, 1],
                      delay: 1.8 + (lineIdx * 0.3) + (wordIdx * 0.12)
                    } : {}}
                  >
                    {word}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>

          {/* Subtext */}
          <motion.p
            initial={isFirstVisit ? { opacity: 0, y: 20 } : false}
            animate={isFirstVisit ? { opacity: 1, y: 0 } : false}
            transition={isFirstVisit ? { duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 2.4 } : {}}
            className="text-white/60 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-10"
          >
            The decentralized marketplace where verified carbon credits meet transparent blockchain infrastructure.
          </motion.p>


        </div>
      </section>

      {/* ─── SCROLLING MARQUEE TICKER (video-inspired lime band) ─── */}
      <div className="bg-[#bef264] py-4 overflow-hidden border-y border-[#a3e635] relative">
        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        >
          {[...Array(2)].map((_, r) => (
            <div key={r} className="flex items-center gap-0">
              {[
                'Verified Carbon Credits',
                'On-Chain Transparency',
                'Real Environmental Impact',
                'Blockchain Secured',
                'Carbon Neutral Future',
                'Immutable Records',
                'Offset Your Footprint',
                'Powered by Web3',
              ].map((item, idx) => (
                <span key={idx} className="inline-flex items-center text-[#0a0a0a] logo-retro text-[13px] uppercase tracking-widest px-8">
                  {item}
                  <span className="ml-8 text-[#0a0a0a]/30">◆</span>
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      {/* ─── ABOUT THE PLATFORM ─── */}
      <section className="bg-white text-[#0a0a0a] border-t border-gray-200">
        <div className="max-w-[1400px] mx-auto px-6 py-24 lg:py-32">

          <div className="flex flex-col lg:flex-row items-center gap-16 xl:gap-24">
            <motion.div
              className="w-full lg:w-5/12 space-y-6"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="text-[13px] font-mono uppercase tracking-[0.2em] text-[#999]">Our Purpose</p>
              {/* Word-by-word blur reveal on the headline */}
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                {'Empowering Global Climate Action.'.split(' ').map((word, i) => (
                  <motion.span
                    key={i}
                    className="inline-block mr-[0.25em]"
                    initial={{ opacity: 0, filter: 'blur(8px)', color: '#aaa' }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)', color: '#0a0a0a' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.09 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </h2>
              <p className="text-[#444] text-lg leading-relaxed">
                CarbonXplanet is a next-generation decentralized marketplace designed to bridge the gap between verified carbon credit projects and eco-conscious organizations.
              </p>
              <p className="text-[#444] text-lg leading-relaxed">
                By leveraging blockchain infrastructure, we bring unprecedented transparency, security, and efficiency to the trading of environmental assets.
              </p>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-lg mb-2">Verified Impact</h4>
                  <p className="text-[#555] text-sm">Every project is vetted against global standards like Verra and Gold Standard.</p>
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Immutable Ledger</h4>
                  <p className="text-[#555] text-sm">Blockchain guarantees credits cannot be double-counted or manipulated.</p>
                </div>
              </div>
            </motion.div>

            <div className="w-full lg:w-7/12">
              <div className="relative overflow-hidden  shadow-[0_20px_50px_rgba(0,0,0,0.15)] aspect-video ring-1 ring-black/5 transform transition-transform duration-500 ">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/lv_0_20260812015528.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ─── PROJECT GALLERY (DARK & FLOATING GALLERY) ─── */}
      <section id="gallery" className="bg-[#0a0a0a] text-white overflow-hidden py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="max-w-md z-10">
            <h2 className="text-5xl sm:text-7xl font-normal tracking-tight mb-6 text-white logo-retro" style={{ WebkitTextFillColor: 'white', background: 'none' }}>
              Explore<br />Projects.
            </h2>
            <p className="text-white/70 text-lg leading-relaxed mb-8 font-medium">
              A profile, portfolio, and social feed in one place.
              Explore the initiatives shaping a carbon-neutral future. From rainforest preservation to renewable energy projects across the globe.
            </p>
          </div>

          <div className="relative w-full lg:ml-8 mt-10 lg:mt-0 flex flex-col">
            <div className="flex items-center justify-between mb-4 px-4">
              <span className="text-sm font-bold text-gray-500 tracking-widest uppercase">Slide Projects</span>
              <div className="flex gap-2">
                <button 
                  onClick={() => document.getElementById('project-slider-dark').scrollBy({ left: -260, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  <FaArrowRight className="transform rotate-180 text-xs" />
                </button>
                <button 
                  onClick={() => document.getElementById('project-slider-dark').scrollBy({ left: 260, behavior: 'smooth' })}
                  className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center text-gray-400 hover:bg-gray-800 transition-colors"
                >
                  <FaArrowRight className="text-xs" />
                </button>
              </div>
            </div>

            <div id="project-slider-dark" className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-2 px-4 [&::-webkit-scrollbar]:hidden scroll-smooth w-full">
              {[...projectGalleryItems].reverse().map((item, idx) => (
                <div
                  key={idx}
                  className="snap-start relative w-[260px] h-[360px] rounded-[2rem] overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.5)] flex-shrink-0 cursor-pointer group bg-[#111] p-2 border border-gray-800 transition-transform duration-300 hover:-translate-y-2"
                >
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <img src={item.image} className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none" />
                    <div className="absolute bottom-5 left-5 right-5 text-left pointer-events-none">
                      <p className="text-white text-sm font-bold uppercase tracking-widest leading-tight mb-1">{item.title}</p>
                      <div className="w-8 h-1 bg-[#10b981] rounded-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/*
          <div className="relative h-[600px] w-full">
            <div className="w-full h-full overflow-hidden transform -rotate-6 scale-[1.05]">
              <DriftWall
                items={projectGalleryItems}
                columns={4}
                tileWidth={260}
                tileHeight={180}
                gap={16}
                tilt={0}
                turn={0}
                perspective={1000}
                depth={0}
                speed={30}
                direction="up"
                variance={0.2}
                parallax={0}
                lift={0}
                fade={0}
                dim={1}
                overlayColor="#0a0a0a"
                radius={0}
                roll={0}
                pauseOnHover={false}
                grayscale={false}
              />
            </div>
          </div>
          */}
        </div>
      </section>

      {/* ─── PLATFORM FEATURES (WHITE & FLOATING ICONS) ─── */}
      <section className="bg-white text-[#0a0a0a] overflow-hidden py-32 relative">
        {/* Animated Background TextLoop */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.25] pointer-events-none select-none scale-[1.5] sm:scale-[2]">
          <TextLoop
            text="CarbonXplanet ✦ Blockchain ✦ Transparent"
            shape="wave"
            speed={90}
            direction="forward"
            separator="✦"
            curviness={90}
            fontSize={46}
            fontWeight={800}
            letterSpacing={2}
            uppercase
            color="#ffffff"
            ribbon
            ribbonColor="#10B981"
            ribbonWidth={86}
            pauseOnHover={false}
          />
        </div>

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-xl lg:pr-10 z-10">
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.05] text-[#0a0a0a]">
              Why CarbonXplanet.
            </h2>
            <p className="text-[#333] text-[18px] leading-relaxed mb-6 font-medium">
              The infrastructure for a sustainable future. A space for verifiable action, instant settlement, and complete transparency.
            </p>
            <p className="text-[#555] text-[16px] leading-relaxed mb-10">
              Generate audit-ready ESG reports aligned with Verra VCS and Gold Standard. Every credit is minted as an NFT with an immutable audit trail.
            </p>
            <Link to="/signup" className="inline-flex items-center space-x-3 bg-[#0a0a0a] text-white px-8 py-4 text-[13px] font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
              <span>CREATE AN ACCOUNT</span>
              <FaArrowRight className="text-[11px]" />
            </Link>
          </div>

          <div className="relative h-[600px] flex items-center justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {[
                { Icon: FaBolt, label: 'Instant Settlement' },
                { Icon: FaShieldAlt, label: 'Verified Security' },
                { Icon: FaChartLine, label: 'Scalable Impact' },
                { Icon: FaFileContract, label: 'Smart Contracts' },
                { Icon: FaTree, label: 'Reforestation' },
                { Icon: FaWind, label: 'Wind Energy' },
                { Icon: FaSolarPanel, label: 'Solar Projects' },
                { Icon: FaWallet, label: 'Secure Wallet' },
                { Icon: FaHandshake, label: 'Trustless Audits' }
              ].map(({ Icon, label }, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] w-28 h-28 sm:w-36 sm:h-36 flex flex-col items-center justify-center transform transition-transform duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
                  <Icon className={`text-3xl sm:text-5xl mb-2 ${['text-emerald-500', 'text-blue-500', 'text-indigo-500', 'text-rose-500', 'text-amber-500'][idx % 5]}`} />
                  <span className="text-[10px] sm:text-xs font-bold text-gray-500 tracking-wider uppercase text-center px-2">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (VIBRANT EMERALD) ─── */}
      <section className="bg-[#059669] text-white overflow-hidden py-32 relative">
        {/* Massive Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden select-none">
          <span className="text-[30vw] font-black leading-none whitespace-nowrap logo-retro">CARBON</span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-xl">
            <h2 className="text-5xl sm:text-7xl font-black tracking-tight mb-8 leading-[1.05] text-[#bef264]">
              A carbon market<br />that doesn't<br />manipulate you.
            </h2>
            <p className="text-white/90 text-[18px] leading-relaxed mb-6 font-medium">
              Trade credits directly on-chain. No intermediaries, no hidden fees, and full transparency.
            </p>
            <p className="text-white/90 text-[16px] leading-relaxed mb-10 font-bold">
              No brokers. No greenwashing. No BS.
            </p>
            <Link to="/marketplace" className="inline-flex items-center space-x-3 bg-[#bef264] text-[#0a0a0a] px-8 py-4 text-[13px] font-black hover:bg-[#a3e635] transition-all hover:scale-105 shadow-xl">
              <span>EXPLORE MARKETPLACE</span>
              <FaArrowRight className="text-[11px]" />
            </Link>
          </div>

          <div className="relative">
            <div className="bg-white text-[#0a0a0a] p-8 sm:p-12 shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500 max-w-lg ml-auto">
              <div className="space-y-8">

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-bold text-sm">01</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-1">Connect Wallet</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Link your Web3 wallet to authenticate and access the marketplace securely.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <span className="text-emerald-700 font-bold text-sm">02</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-1">Browse & Select</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Explore audited carbon credit projects filtered by type, region, standard, vintage.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#bef264] flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[#0a0a0a] font-bold text-sm">03</span>
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-1">Trade & Retire</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Purchase credits via smart contract, hold them, or retire them on-chain.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── GLOBAL IMPACT (BRIGHT LIME TESTIMONIAL) ─── */}
      <section className="bg-[#bef264] text-[#0a0a0a] overflow-hidden py-32 relative">
        {/* Massive Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none overflow-hidden select-none -rotate-6 scale-150">
          <div className="flex flex-col space-y-4 font-black text-[20vw] leading-[0.8] whitespace-nowrap logo-retro">
            <span>IMPACT IMPACT</span>
            <span>IMPACT IMPACT</span>
            <span>IMPACT IMPACT</span>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-12 leading-[1.1] text-[#0a0a0a]">
            Don't take our word for it.<br />
            Take theirs. It's pretty impactful.
          </h2>

          <div className="flex justify-center -space-x-4 mb-10">
            {/* Small avatars row */}
            <div className="w-14 h-14 rounded-full border-4 border-[#bef264] bg-white overflow-hidden z-40 shadow-lg"><img src={img1} className="w-full h-full object-cover grayscale" /></div>
            <div className="w-14 h-14 rounded-full border-4 border-[#bef264] bg-white overflow-hidden z-30 shadow-lg"><img src={img2} className="w-full h-full object-cover grayscale opacity-70" /></div>
            <div className="w-14 h-14 rounded-full border-4 border-[#bef264] bg-white overflow-hidden z-20 shadow-lg"><img src={img3} className="w-full h-full object-cover grayscale opacity-50" /></div>
            <div className="w-14 h-14 rounded-full border-4 border-[#bef264] bg-white overflow-hidden z-10 shadow-lg"><img src={img4} className="w-full h-full object-cover grayscale opacity-30" /></div>
          </div>

          <p className="text-[22px] sm:text-[28px] font-medium leading-relaxed max-w-3xl mx-auto mb-10 text-[#222]">
            “The carbon market isn't just about numbers. It's about protecting real ecosystems, funding sustainable communities, and restoring the planet with verifiable proof.”
          </p>

          <div className="mb-12">
            <h4 className="font-black text-2xl uppercase tracking-tighter logo-retro text-[#0a0a0a]" style={{ WebkitTextFillColor: '#0a0a0a', background: 'none' }}>SARAH JENKINS</h4>
            <p className="text-[#444] font-medium text-sm">Head of Sustainability</p>
            <p className="text-[#444] font-medium text-sm">Global Tech Inc.</p>
          </div>

          <Link to="/about" className="inline-flex items-center space-x-3 bg-[#0a0a0a] text-white px-8 py-4 text-[13px] font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
            <span>READ THEIR STORY</span>
            <FaArrowRight className="text-[11px]" />
          </Link>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="bg-[#111] border border-[#222] p-10 sm:p-16 text-center">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#666] mb-4">For Enterprises</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-4">
              Ready to offset your<br className="hidden sm:block" /> carbon footprint?
            </h2>
            <p className="text-[#888] text-[15px] max-w-lg mx-auto mb-10 leading-relaxed">
              Whether you're a corporation, fund, or government body — our platform handles compliance-grade carbon credit acquisition at scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/signup"
                className="inline-flex items-center space-x-2 bg-white text-[#0c0c0c] px-8 py-3.5 text-[14px] font-semibold hover:bg-[#eee] transition-colors"
              >
                <span>Start Now</span>
                <FaArrowRight className="text-[11px]" />
              </Link>
              <Link
                to="/contact"
                className="text-[13px] text-[#888] hover:text-white font-medium transition-colors px-6 py-3.5"
              >
                Contact Sales →
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ─── FOOTER ─── */}
      <Footer />

    </div>
  );
};

export default Home;
