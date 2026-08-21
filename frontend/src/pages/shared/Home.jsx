import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion, LayoutGroup, useScroll, useTransform } from 'motion/react';
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
  FaDiscord,
  FaUser,
  FaPhoneAlt,
  FaEnvelope,
  FaPen,
  FaMapMarkerAlt
} from 'react-icons/fa';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuthStore } from '../../store/useAuthStore';
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
  { image: img2, title: 'Kutch Wind Turbines' },
  { image: img3, title: 'Bhadla Solar Park' },
  { image: img4, title: 'Himalayan Valley' },
  { image: img5, title: 'Andaman Conservation' },
  { image: img7, title: 'Sundarbans Sunrise' },
  { image: img8, title: 'Delhi Recycling Hub' },
  { image: img9, title: 'Nilgiri Landscape' },
  { image: img10, title: 'Punjab Golden Fields' },
  { image: img11, title: 'Pichavaram Mangroves' },
  { image: img12, title: 'Meghalaya Forest' },
  { image: img13, title: 'Jog Falls Canyon' },
  { image: img14, title: 'Karakoram Peaks' },
  { image: heroBg, title: 'Ganga River Bridge' },
];

const testimonials = [
  {
    id: 1,
    quote: "The carbon market isn't just about numbers. It's about protecting real ecosystems, funding sustainable communities, and restoring the planet with verifiable proof.",
    name: "ANANYA SHARMA",
    role: "Head of Sustainability",
    company: "Tata EcoTech",
    image: img5
  },
  {
    id: 2,
    quote: "CarbonXplanet provides the exact transparency we need to verify our ESG commitments. The blockchain integration makes all the difference.",
    name: "RAHUL DESAI",
    role: "Chief Operations Officer",
    company: "Reliance Green",
    image: img2
  },
  {
    id: 3,
    quote: "By cutting out the middlemen, we've seen a massive increase in capital going directly to the communities protecting our forests.",
    name: "PRIYA MENON",
    role: "Project Director",
    company: "Western Ghats Conservation",
    image: img3
  },
  {
    id: 4,
    quote: "An elegant, decentralized solution to a complex global problem. We’ve retired over 10,000 tons with complete confidence.",
    name: "VIKRAM SINGH",
    role: "VP of Environmental Impact",
    company: "Adani Renewables",
    image: img4
  }
];

const Home = () => {
  const { isAuthenticated } = useAuthStore();
  const shouldReduceMotion = useReducedMotion();
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const projectSliderRef = useRef(null);

  useEffect(() => {
    const slider = projectSliderRef.current;
    if (!slider) return;

    const interval = setInterval(() => {
      if (slider.scrollLeft >= slider.scrollWidth - slider.clientWidth - 10) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: 260, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const slider = projectSliderRef.current;
      if (!slider) return;
      if (e.key === 'ArrowLeft') {
        slider.scrollBy({ left: -260, behavior: 'smooth' });
      } else if (e.key === 'ArrowRight') {
        slider.scrollBy({ left: 260, behavior: 'smooth' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for reaching out! We will get back to you soon.');
    setFormData({ name: '', phone: '', email: '', message: '' });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevTestimonial = () => {
    setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const [isFirstVisit] = useState(() => {
    if (shouldReduceMotion) return false;

    // If we've already played it this session (so F5 doesn't replay it)
    if (sessionStorage.getItem('playedIntro')) return false;

    // If the page has been loaded for > 5 seconds, they probably 
    // navigated here from another page (like /about). Don't play it.
    if (performance.now() > 5000) {
      sessionStorage.setItem('playedIntro', 'true');
      return false;
    }

    return true;
  });
  const [showIntro, setShowIntro] = useState(isFirstVisit);
  const [showCenterLogo, setShowCenterLogo] = useState(isFirstVisit);

  // Parallax effect for the How It Works watermark
  const howItWorksRef = useRef(null);
  const { scrollYProgress: howItWorksScrollY } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "end start"]
  });
  const textX = useTransform(howItWorksScrollY, [0, 1], ["10%", "-25%"]);

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
                  className="wise-font font-black uppercase tracking-normal text-[clamp(3rem,8vw,6rem)] text-transparent [text-shadow:1px_1px_0_transparent,2px_2px_0_transparent,3px_3px_0_transparent]"
                  style={{
                    WebkitTextStroke: '2px #bef264'
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
        <div className="absolute inset-0 bg-[#0c0c0c]/30 backdrop-blur-[2px]" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-8">
          {/* Headline — word-by-word stagger reveal */}
          <div className="flex flex-col items-center justify-center mb-10 mt-4">
            {['Pioneering', 'Global', 'Climate Action'].map((phrase, phraseIdx) => (
              <motion.div
                key={phraseIdx}
                className="wise-font font-black uppercase text-[clamp(3rem,7vw,6.5rem)] tracking-tight [text-shadow:1px_1px_0_#d1d5db,2px_2px_0_#d1d5db,3px_3px_0_#d1d5db,4px_4px_0_#d1d5db,5px_5px_0_#d1d5db,6px_6px_0_#d1d5db,7px_7px_0_#d1d5db,8px_8px_0_#d1d5db] text-white leading-[1.1] text-center"
                style={{ background: 'none' }}
                initial={isFirstVisit ? { opacity: 0, y: 40, filter: 'blur(12px)' } : false}
                animate={isFirstVisit ? { opacity: 1, y: 0, filter: 'blur(0px)' } : false}
                transition={isFirstVisit ? {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                  delay: 1.8 + (phraseIdx * 0.3)
                } : {}}
              >
                {phrase}
              </motion.div>
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

      {/* ─── ABOUT THE PLATFORM ─── */}
      <section className="bg-[#f4f7f5] text-[#0a0a0a] border-t border-[#e2e8e4]">
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
              <h2 className="text-4xl sm:text-6xl tracking-tighter leading-tight uppercase wise-font font-black">
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
                  <h4 className="font-bold text-base uppercase tracking-widest mb-2 subheading">Verified Impact</h4>
                  <p className="text-[#555] text-sm">Every project is vetted against global standards like Verra and Gold Standard.</p>
                </div>
                <div>
                  <h4 className="font-bold text-base uppercase tracking-widest mb-2 subheading">Immutable Ledger</h4>
                  <p className="text-[#555] text-sm">Blockchain guarantees credits cannot be double-counted or manipulated.</p>
                </div>
              </div>
            </motion.div>

            <div className="w-full lg:w-7/12">
              <div className="relative overflow-hidden border-2 border-gray-900 shadow-[17px_17px_0px_0px_#bef264] aspect-video transform transition-all duration-500 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_#bef264]">
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
      <section id="gallery" className="bg-[#112a14] text-white overflow-hidden py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">
          <div className="w-full lg:w-1/3 flex flex-col z-10 relative">
            <h2 className="text-[8vw] xl:text-[80px] leading-[0.9] font-black tracking-tighter text-[#bef264] uppercase wise-font">
              Explore
            </h2>
            <h2 className="text-[8vw] xl:text-[80px] leading-[0.9] font-black tracking-tighter text-[#bef264] uppercase wise-font mt-2 lg:mt-0">
              Projects.
            </h2>
            <div className="max-w-2xl mt-8">
              <p className="text-white/90 text-lg leading-relaxed font-medium">
                A profile, portfolio, and social feed in one place.
                Explore the initiatives shaping a carbon-neutral future. From rainforest preservation to renewable energy projects across the globe.
              </p>
            </div>
            <div className="mt-10">
              <Link to="/marketplace" className="inline-flex items-center space-x-3 bg-white text-[#112a14] px-6 py-3 text-[12px] font-black hover:bg-gray-200 transition-all hover:scale-105 shadow-xl">
                <span>VIEW MARKETPLACE</span>
                <FaArrowRight className="text-[10px]" />
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-2/3 h-[400px] lg:h-[550px] relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#bef264]/20">
            <DriftWall
              items={projectGalleryItems}
              columns={4}
              tileWidth={240}
              tileHeight={180}
              gap={16}
              speed={35}
              direction="up"
              overlayColor="transparent"
              dim={1.0}
            />
          </div>
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
            <h2 className="text-5xl sm:text-7xl tracking-tighter mb-8 leading-[1.05] text-[#1c1f1d] uppercase wise-font font-black">
              Why CarbonXplanet.
            </h2>
            <p className="text-[#4a5550] text-[18px] leading-relaxed mb-6 font-medium">
              The infrastructure for a sustainable future. A space for verifiable action, instant settlement, and complete transparency.
            </p>
            <p className="text-[#4a5550] text-[16px] leading-relaxed mb-10">
              Generate audit-ready ESG reports aligned with Verra VCS and Gold Standard. Every credit is minted as an NFT with an immutable audit trail.
            </p>
            {isAuthenticated ? (
              <Link to="/seller/post/new" className="inline-flex items-center space-x-3 bg-[#0a0a0a] text-white px-8 py-4 text-[13px] font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
                <span>CREATE NEW PROJECT</span>
                <FaArrowRight className="text-[11px]" />
              </Link>
            ) : (
              <Link to="/signup" className="inline-flex items-center space-x-3 bg-[#0a0a0a] text-white px-8 py-4 text-[13px] font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
                <span>CREATE AN ACCOUNT</span>
                <FaArrowRight className="text-[11px]" />
              </Link>
            )}
          </div>

          <div className="relative h-full min-h-[500px] flex items-center justify-center w-full">
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.1 }
                }
              }}
            >
              {[
                { Icon: FaBolt, label: 'Instant Settlement', color: 'text-emerald-500', rotate: '-rotate-2' },
                { Icon: FaShieldAlt, label: 'Verified Security', color: 'text-gray-900', rotate: 'rotate-3' },
                { Icon: FaChartLine, label: 'Scalable Impact', color: 'text-lime-500', rotate: '-rotate-1' },
                { Icon: FaFileContract, label: 'Smart Contracts', color: 'text-emerald-700', rotate: 'rotate-2' },
                { Icon: FaTree, label: 'Reforestation', color: 'text-green-600', rotate: '-rotate-3' },
                { Icon: FaWind, label: 'Wind Energy', color: 'text-teal-500', rotate: 'rotate-1' },
                { Icon: FaSolarPanel, label: 'Solar Projects', color: 'text-yellow-500', rotate: '-rotate-2' },
                { Icon: FaWallet, label: 'Secure Wallet', color: 'text-gray-900', rotate: 'rotate-2' },
                { Icon: FaHandshake, label: 'Trustless Audits', color: 'text-emerald-400', rotate: '-rotate-1' }
              ].map(({ Icon, label, color, rotate }, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 30, scale: 0.9 },
                    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 15 } }
                  }}
                  className={`bg-white border-[3px] border-[#0a0a0a] rounded-xl shadow-[6px_6px_0px_0px_#bef264] w-28 h-28 sm:w-36 sm:h-36 flex flex-col items-center justify-center transform ${rotate} transition-all duration-300 hover:rotate-0 hover:-translate-y-2 hover:-translate-x-1 hover:shadow-[10px_10px_0px_0px_#bef264] cursor-pointer group`}
                >
                  <Icon className={`text-3xl sm:text-5xl mb-3 transition-transform duration-300 group-hover:scale-110 ${color}`} />
                  <span className="text-[10px] sm:text-[11px] font-black text-[#0a0a0a] uppercase text-center px-2 font-['JetBrains_Mono'] leading-tight">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (DARK MODE) ─── */}
      <section ref={howItWorksRef} className="bg-[#0a0a0a] text-white overflow-hidden py-32 relative">
        {/* Massive Parallax Watermark */}
        <div className="absolute inset-0 flex items-end pb-16 justify-center opacity-[0.08] pointer-events-none overflow-hidden select-none">
          <motion.span
            className="text-[20vw] font-black leading-none whitespace-nowrap wise-font"
            style={{ x: textX }}
          >
            CARBONXPLANET DECENTRALIZED MARKET
          </motion.span>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-xl">
            <h2 className="text-5xl sm:text-7xl tracking-tighter mb-8 leading-[1.05] text-[#bef264] uppercase wise-font font-black">
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
                  <div className="w-10 h-10 rounded-full bg-[#022c22] flex items-center justify-center shrink-0">
                    <span className="text-emerald-500 font-bold text-sm">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 subheading">Connect Wallet</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Link your Web3 wallet to authenticate and access the marketplace securely.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#022c22] flex items-center justify-center shrink-0">
                    <span className="text-emerald-500 font-bold text-sm">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 subheading">Browse & Select</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Explore audited carbon credit projects filtered by type, region, standard, vintage.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[#bef264] flex items-center justify-center shrink-0 shadow-sm">
                    <span className="text-[#0a0a0a] font-bold text-sm">03</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 subheading">Trade & Retire</h4>
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
          <div className="flex flex-col space-y-4 font-black text-[20vw] leading-[0.8] whitespace-nowrap wise-font">
            <span>IMPACT IMPACT</span>
            <span>IMPACT IMPACT</span>
            <span>IMPACT IMPACT</span>
          </div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="text-4xl sm:text-5xl lg:text-7xl uppercase tracking-tighter mb-12 leading-[1.05] text-[#0a0a0a] wise-font font-black flex flex-col items-center text-center"
            style={{ WebkitTextFillColor: '#0a0a0a', background: 'none' }}
          >
            <span className="overflow-hidden block">
              <motion.span
                className="block"
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                Don't take our word for it.
              </motion.span>
            </span>
            <span className="overflow-hidden block mt-2">
              <motion.span
                className="block"
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                Take theirs. It's
              </motion.span>
            </span>
            <span className="overflow-hidden block mt-2">
              <motion.span
                className="block"
                variants={{
                  hidden: { y: "110%", opacity: 0 },
                  visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
                }}
              >
                pretty impactful.
              </motion.span>
            </span>
          </motion.h2>

          <div className="flex justify-center -space-x-4 mb-10 relative z-50">
            {testimonials.map((t, idx) => {
              const isActive = idx === activeTestimonial;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-14 h-14 rounded-full border-4 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 relative ${isActive ? 'z-50 border-white scale-110' : 'z-30 border-[#bef264] hover:z-40'}`}
                  style={{ zIndex: isActive ? 50 : 40 - idx }}
                >
                  <img
                    src={t.image}
                    className={`w-full h-full object-cover transition-all duration-300 ${isActive ? 'grayscale-0 opacity-100' : 'grayscale opacity-60 hover:opacity-100'}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="relative max-w-4xl mx-auto min-h-[220px]">
            {/* Left/Right Arrows */}
            <button onClick={handlePrevTestimonial} className="absolute z-50 left-0 sm:-left-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#bef264] transition-all">
              <FaArrowRight className="transform rotate-180 text-sm" />
            </button>
            <button onClick={handleNextTestimonial} className="absolute z-50 right-0 sm:-right-12 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#bef264] transition-all">
              <FaArrowRight className="text-sm" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="px-10 sm:px-16 flex flex-col items-center"
              >
                <p className="text-[22px] sm:text-[26px] font-medium leading-relaxed max-w-3xl mx-auto mb-10 text-[#222]">
                  “{testimonials[activeTestimonial].quote}”
                </p>

                <div className="mb-12 flex flex-col items-center justify-center">
                  <h4 className="font-bold text-xl uppercase tracking-widest text-[#0a0a0a] mb-2 subheading">{testimonials[activeTestimonial].name}</h4>
                  <div className="flex items-center space-x-2 text-[#444] text-sm font-medium">
                    <span>{testimonials[activeTestimonial].role}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]/30"></span>
                    <span className="font-bold text-[#0a0a0a]">{testimonials[activeTestimonial].company}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link to="/about" className="inline-flex items-center space-x-3 bg-[#0a0a0a] text-white px-8 py-4 text-[13px] font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
            <span>READ THEIR STORY</span>
            <FaArrowRight className="text-[11px]" />
          </Link>
        </div>
      </section>

      {/* ─── FREQUENTLY ASKED QUESTIONS (FAQ) ─── */}
      <section className="bg-[#f0f4f2] text-[#0a0a0a] py-24 lg:py-32 font-sans border-t border-[#e2e8e4]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl tracking-tighter mb-4 uppercase wise-font font-black">Got Questions?</h2>
            <p className="text-gray-500 text-base max-w-xl mx-auto font-medium">Everything you need to know about trading verified carbon credits on our platform.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "What exactly is a verified carbon credit?",
                a: "A verified carbon credit represents one metric ton of carbon dioxide equivalent (tCO2e) that has been prevented from entering the atmosphere or removed from it. Our credits are authenticated by top-tier registries like Verra and Gold Standard before being tokenized on-chain."
              },
              {
                q: "How does blockchain improve the carbon market?",
                a: "By putting credits on an immutable public ledger, we completely eliminate double-counting and reduce the layers of middlemen. This ensures maximum capital goes directly to the project developers protecting our planet."
              },
              {
                q: "Do I need crypto to buy carbon credits?",
                a: "While our infrastructure runs on Web3, we offer fiat gateways. You can purchase credits using traditional payment methods (credit card/bank transfer), and we handle the on-chain settlement and wallet custody seamlessly in the background."
              },
              {
                q: "Can I resell credits I've purchased?",
                a: "Yes! Active credits can be traded freely on our marketplace. However, once you choose to 'retire' a credit to offset your own footprint, it is permanently burned and removed from circulation to guarantee the environmental impact."
              }
            ].map((faq, index) => (
              <details key={index} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <summary className="flex justify-between items-center cursor-pointer px-6 py-4 font-bold text-[15px] md:text-[16px] select-none focus:outline-none focus:ring-0 focus-visible:outline-none list-none [&::-webkit-details-marker]:hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {faq.q}
                  <span className="text-gray-400 group-open:rotate-45 transition-transform duration-300 text-xl leading-none font-normal shrink-0 ml-4">
                    +
                  </span>
                </summary>
                <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm pt-0 font-medium">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="bg-white border-t border-[#e2e8e4]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="bg-[#022c22] border border-[#064e3b] p-10 sm:p-16 text-center shadow-2xl rounded-3xl">
            <p className="text-[12px] font-bold subheading uppercase tracking-widest text-[#666] mb-4">For Enterprises</p>
            <h2 className="text-3xl sm:text-5xl tracking-tighter text-white mb-6 uppercase wise-font font-black">
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
              <a
                href="#contact"
                className="text-[13px] text-[#888] hover:text-white font-medium transition-colors px-6 py-3.5"
              >
                Contact Sales →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CONTACT SECTION ─── */}
      <section id="contact" className="bg-[#0a0a0a] text-white py-24 lg:py-32 relative overflow-hidden border-t border-[#111]">
        <div className="max-w-[1200px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
          {/* Left Column - Contact Details */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl sm:text-5xl lg:text-7xl font-black mb-6 text-[#bef264] tracking-tighter leading-[1.05] uppercase wise-font">
              Get in<br />Touch.
            </h2>
            <p className="text-white/70 text-[16px] leading-relaxed max-w-md mb-12 font-medium">
              Whether you have a question about our decentralized carbon credit marketplace, want to partner with us, or just want to say hi, we're here for you.
            </p>

            <div className="space-y-8">
              {/* Address */}
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center flex-shrink-0">
                  <FaMapMarkerAlt className="text-[#bef264] text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">India Office</p>
                  <p className="text-[15px] font-medium text-white">Chhatrapati Sambhajinagar</p>
                  <p className="text-[15px] font-medium text-white">Maharashtra, India</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-[#bef264] text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Call Us</p>
                  <p className="text-[15px] font-medium text-white">+91 8080209999</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-5">
                <div className="w-12 h-12 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center flex-shrink-0">
                  <FaEnvelope className="text-[#bef264] text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Email Us</p>
                  <p className="text-[15px] font-medium text-white">contact@carbonxplanet.in</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="flex items-center justify-center">
            <div className="bg-[#111] border border-gray-800 p-8 md:p-10 shadow-2xl rounded-3xl w-full">
              <h3 className="text-3xl md:text-4xl font-black mb-8 text-white tracking-tighter uppercase wise-font">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-6">

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FaUser className="text-gray-500 text-sm" />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full bg-[#1a1a1a] border border-gray-800 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="relative w-full sm:w-1/2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-500 text-sm" />
                    </div>
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full bg-[#1a1a1a] border border-gray-800 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all"
                    />
                  </div>
                  <div className="relative w-full sm:w-1/2">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FaPhoneAlt className="text-gray-500 text-sm" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-[#1a1a1a] border border-gray-800 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all"
                    />
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute top-4 left-0 pl-4 flex items-start pointer-events-none">
                    <FaPen className="text-gray-500 text-sm mt-1" />
                  </div>
                  <textarea
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="w-full bg-[#1a1a1a] border border-gray-800 py-4 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-[#bef264] hover:bg-[#a3e635] text-[#0a0a0a] font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-[13px] uppercase tracking-widest mt-4 flex justify-center items-center">
                  Send Message
                </button>
              </form>
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
