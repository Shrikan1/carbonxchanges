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
import img2 from '../../assets/18297.jpg';
import img3 from '../../assets/4k-wallpaper-clouds-cropland-dawn.jpg';
import img4 from '../../assets/634013.jpg';
import img5 from '../../assets/Mangrove-Forest-Coast-2000x1237-1.jpg';
import img7 from '../../assets/dense-evergreen-forest-covered-fog_23-2151975503.avif';
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
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  // Parallax effect for the How It Works watermark
  const howItWorksRef = useRef(null);
  const { scrollYProgress: howItWorksScrollY } = useScroll({
    target: howItWorksRef,
    offset: ["start end", "end start"]
  });
  const textX = useTransform(howItWorksScrollY, [0, 1], ["10%", "-25%"]);

  return (
    <div className="bg-[#eef0eb] text-[#1a2e1a] min-h-screen font-sans">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden bg-[#f5f7f2] border-b border-[#dfe7df]" style={{ minHeight: 'min(780px, calc(100vh - 48px))', marginTop: '48px' }}>

        {/* ── Left content ── */}
        <div className="relative z-10 w-full max-w-[1360px] mx-auto px-6 lg:px-12 xl:px-16 flex items-center h-full" style={{ minHeight: 'min(780px, calc(100vh - 48px))' }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", staggerChildren: 0.15 }}
            className="w-full lg:w-[52%] pt-8 pb-16 lg:py-0 flex flex-col justify-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
              className="wise-font font-black text-[#17351f] leading-[0.95] tracking-[-0.04em] mb-4 sm:mb-6 uppercase text-left"
              style={{ fontSize: 'clamp(2.25rem, 8vw, 4.5rem)' }}
            >
              Pioneering<br />
              Global Climate<br />
              Action
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
              className="text-[#51665a] text-[14px] sm:text-[16px] leading-relaxed max-w-[410px] mb-6 sm:mb-8 font-normal text-left"
            >
              A decentralized marketplace where verified carbon credits
              meet transparent blockchain infrastructure.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="flex flex-wrap items-center justify-start gap-3 mb-10 w-full"
            >
              <Link
                to="/marketplace"
                className="inline-flex items-center justify-center gap-2.5 bg-[#173d25] text-white px-10 py-3.5 rounded-none text-[13px] font-semibold hover:bg-[#0f2f1b] transition-colors w-full sm:w-auto"
              >
                Explore Marketplace
                <FaArrowRight className="text-[10px]" />
              </Link>
            </motion.div>

            {/* Impact Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
              className="grid grid-cols-3 gap-2 sm:gap-0 max-w-[470px] border-t border-[#ccd9cd] pt-6 mb-12 lg:mb-0"
            >
              {[
                { value: '500+', label: 'Verified Projects' },
                { value: '1.2M+', label: 'tCO₂ Credits' },
                { value: '50+', label: 'Global Contributors' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 + (i * 0.1), ease: "easeOut" }}
                  className="border-r last:border-r-0 border-[#d7e1d7] pr-2 sm:first:pr-3 sm:px-3 sm:first:pl-0 flex flex-col items-start text-left"
                >
                  <p className="wise-font font-black text-[1.4rem] sm:text-[1.6rem] text-[#17351f] leading-none mb-1">
                    {stat.value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-[#6a7e70] font-semibold tracking-wide uppercase">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </motion.div>

            {/* Mobile hero image (Moved below content for professional flow) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
              className="relative w-full flex justify-center lg:hidden"
            >
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl mx-auto ring-1 ring-black/5">
                <img
                  src={img8}
                  alt="Dark Jungle"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center 45%' }}
                />
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Right: Large circular image ── */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="absolute hidden lg:block overflow-hidden"
          style={{
            width: 'clamp(490px, 48vw, 740px)',
            height: 'calc(100% - 36px)',
            borderRadius: '260px 0 0 260px',
            top: '18px',
            right: '0',
          }}
        >
          <img
            src={heroBg}
            alt="Lush forest landscape"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 45%' }}
          />
          <div className="absolute inset-0 bg-[#16391f]/10" />
          <p className="absolute bottom-8 right-9 max-w-[116px] -rotate-6 text-[10px] font-bold uppercase leading-[1.55] tracking-[0.16em] text-[#e1efd9]">A cleaner planet, together</p>
        </motion.div>

      </section>



      {/* ─── OUR PURPOSE ─── */}
      <section className="bg-[#eef0eb] text-[#1a2e1a] py-20 lg:py-28 relative overflow-hidden">
        <div className="max-w-[1360px] mx-auto px-6 sm:px-8 lg:px-12 xl:px-16 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-10 xl:gap-16 items-center">

            {/* Left Content */}
            <div className="w-full lg:col-span-5 space-y-7 z-10">

              <div className="flex items-center gap-3">
                <span className="block w-6 h-[1px] bg-[#2d6a4f]" />
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#5a7060]">
                  Our Purpose
                </p>
              </div>

              <h2 className="text-[2.25rem] sm:text-5xl lg:text-[2.75rem] xl:text-[3.25rem] tracking-tight leading-[1.05] uppercase wise-font font-black text-[#1a2e1a] break-words">
                Empowering<br className="hidden sm:inline" />
                {" "}Global<br className="hidden sm:inline" />
                {" "}Climate<br className="hidden sm:inline" />
                {" "}Action.
              </h2>

              <div className="space-y-4 max-w-lg">
                <p className="text-[#4a6052] text-[15px] lg:text-[16px] leading-relaxed font-normal">
                  CarbonXplanet is a next-generation decentralized marketplace designed to bridge the gap between verified carbon credit projects and eco-conscious organizations.
                </p>
                <p className="text-[#4a6052] text-[15px] lg:text-[16px] leading-relaxed font-normal">
                  By leveraging blockchain infrastructure, we bring unprecedented transparency, security, and efficiency to the trading of environmental assets.
                </p>
              </div>

              <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#dbe8d1] flex items-center justify-center shrink-0 mt-0.5">
                    <FaTree className="text-[#1a3a22] text-sm" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] uppercase tracking-wider mb-1 text-[#1a2e1a]">Verified Impact</h4>
                    <p className="text-[#5a7060] text-[12px] sm:text-[13px] leading-relaxed">Every project is vetted against global standards like Verra and Gold Standard.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3.5">
                  <div className="w-8 h-8 rounded-lg bg-[#dbe8d1] flex items-center justify-center shrink-0 mt-0.5">
                    <FaShieldAlt className="text-[#1a3a22] text-sm" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[13px] uppercase tracking-wider mb-1 text-[#1a2e1a]">Immutable Ledger</h4>
                    <p className="text-[#5a7060] text-[12px] sm:text-[13px] leading-relaxed">Blockchain guarantees credits cannot be double-counted or manipulated.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Rectangular Video Card */}
            <div className="w-full lg:col-span-7 flex justify-center lg:justify-end mt-8 lg:mt-0 px-2 sm:px-0">
              <div className="relative w-full max-w-[760px]">
                {/* Offset Lime Green Background (Shadow effect) */}
                <div
                  className="absolute top-2 left-2 sm:top-4 sm:left-4 w-full h-full bg-[#b6d77e] rounded-2xl sm:rounded-3xl pointer-events-none"
                />

                {/* Video Container with Thin Green Outline / Border */}
                <div
                  className="relative w-full aspect-video border border-[#2d6a4f] rounded-2xl sm:rounded-3xl bg-[#1a2e1a] overflow-hidden z-10 shadow-sm"
                >
                  <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  >
                    <source src="/lv_0_20260812015528.mp4" type="video/mp4" />
                  </video>
                  {/* Subtle mist effect for depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/10 mix-blend-overlay pointer-events-none" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PROJECT GALLERY (FULL BLEED SPLIT SCREEN) ─── */}
      <section id="gallery" className="bg-[#0f2416] text-white overflow-hidden relative flex flex-col lg:flex-row min-h-[500px] lg:h-[80vh] lg:min-h-[700px]">
        
        {/* Left Content (Aligned with container) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center py-12 lg:py-0 z-10 relative bg-[#0f2416]">
          {/* Inner container pushes to the right, max width half of 1360 (680) */}
          <div className="w-full max-w-[680px] ml-auto px-6 lg:pl-12 lg:pr-16">
            <h2 className="text-4xl sm:text-5xl xl:text-7xl leading-[0.95] font-black tracking-[-0.04em] text-[#eaf6df] uppercase wise-font">
              Explore<br />Projects.
            </h2>
            <div className="max-w-md mt-8">
              <p className="text-[#a4c2b0] text-[17px] leading-relaxed font-medium">
                A profile, portfolio, and social feed in one place.
              </p>
              <p className="text-[#83a390] text-[15px] leading-relaxed mt-4">
                Explore the initiatives shaping a carbon-neutral future. From rainforest preservation to renewable energy projects across the globe.
              </p>
            </div>
            <div className="mt-12 hidden lg:block">
              <Link to="/marketplace" className="inline-flex items-center justify-center gap-2.5 bg-[#bef264] text-[#0f2416] px-10 py-3.5 rounded-none text-[13px] font-semibold hover:bg-white transition-colors">
                <span>VIEW MARKETPLACE</span>
                <FaArrowRight className="text-[12px]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Gallery (Full Bleed) */}
        <div className="w-full lg:w-1/2 relative h-[380px] sm:h-[450px] lg:h-full bg-[#0a170e]">
          {/* Smooth shadow overlays for seamless blending */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0f2416] to-transparent z-10 pointer-events-none hidden lg:block"></div>
          <div className="absolute inset-x-0 top-0 h-16 sm:h-24 bg-gradient-to-b from-[#0f2416] to-transparent z-10 pointer-events-none lg:hidden"></div>
          <div className="absolute inset-x-0 bottom-0 h-24 sm:h-32 bg-gradient-to-t from-[#0f2416] to-transparent z-10 pointer-events-none"></div>
          
          <DriftWall
            items={projectGalleryItems}
            columns={isMobile ? 2 : 3}
            tileWidth={isMobile ? 130 : 260}
            tileHeight={isMobile ? 100 : 200}
            gap={isMobile ? 12 : 16}
            speed={isMobile ? 12 : 25}
            direction="up"
            overlayColor="transparent"
            dim={1.0}
            turn={isMobile ? 0 : -14}
            tilt={isMobile ? 0 : 16}
          />
        </div>

        {/* Mobile CTA (Below Gallery) */}
        <div className="w-full bg-[#0a170e] px-6 pb-12 lg:hidden flex justify-center">
          <Link to="/marketplace" className="inline-flex items-center justify-center gap-2.5 bg-[#bef264] text-[#0f2416] px-10 py-3.5 rounded-none text-[13px] font-semibold hover:bg-white transition-colors w-full sm:w-auto">
            <span>VIEW MARKETPLACE</span>
            <FaArrowRight className="text-[12px]" />
          </Link>
        </div>
      </section>

      {/* ─── PLATFORM FEATURES (WHITE & FLOATING ICONS) ─── */}
      <section className="bg-[#f8faf6] text-[#17351f] overflow-hidden py-24 lg:py-32 relative min-h-[80vh] xl:min-h-[85vh] flex items-center w-full">
        {/* Animated Background TextLoop */}
        <div className="hidden absolute inset-0 flex items-center justify-center opacity-[0.25] pointer-events-none select-none scale-[1.5] sm:scale-[2]">
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

        <div className="w-full max-w-[1360px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl lg:pr-10 z-10">
            <h2 className="text-[2.25rem] sm:text-5xl tracking-[-0.05em] mb-4 sm:mb-6 leading-[1.05] sm:leading-[0.98] text-[#17351f] uppercase wise-font font-black">
              Why CarbonXplanet.
            </h2>
            <p className="text-[#4a6052] text-[17px] leading-relaxed mb-5 font-medium">
              The infrastructure for a sustainable future. A space for verifiable action, instant settlement, and complete transparency.
            </p>
            <p className="text-[#63756a] text-[15px] leading-relaxed mb-8">
              Generate audit-ready ESG reports aligned with Verra VCS and Gold Standard. Every credit is minted as an NFT with an immutable audit trail.
            </p>
            {isAuthenticated ? (
              <Link to="/seller/post/new" className="inline-flex items-center space-x-3 bg-[#173d25] text-white px-6 py-3 text-[12px] font-bold hover:bg-[#0f2f1b] transition-colors">
                <span>CREATE NEW PROJECT</span>
                <FaArrowRight className="text-[11px]" />
              </Link>
            ) : (
              <Link to="/signup" className="inline-flex items-center space-x-3 bg-[#173d25] text-white px-6 py-3 text-[12px] font-bold hover:bg-[#0f2f1b] transition-colors">
                <span>CREATE AN ACCOUNT</span>
                <FaArrowRight className="text-[11px]" />
              </Link>
            )}
          </div>

          <div className="relative flex items-center justify-center w-full mt-10 lg:mt-0 pb-6 sm:pb-0">
            <motion.div
              className="grid grid-cols-3 gap-2 sm:gap-4 w-full max-w-[340px] sm:max-w-none mx-auto lg:mx-0"
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
                  className="bg-white border border-[#d9e4da] w-full aspect-square flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-[#96b99c] hover:shadow-[0_10px_20px_rgba(27,66,39,0.08)] cursor-pointer group"
                >
                  <Icon className={`text-[26px] sm:text-[34px] mb-2 transition-transform duration-300 group-hover:scale-110 ${color}`} />
                  <span className="text-[8.5px] sm:text-[9.5px] font-bold text-[#294633] uppercase text-center px-1 leading-tight">{label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS (DARK MODE) ─── */}
      <section ref={howItWorksRef} className="bg-[#123020] text-white overflow-hidden py-24 lg:py-32 relative min-h-[80vh] xl:min-h-[85vh] flex items-center w-full">
        {/* Massive Parallax Watermark */}
        <div className="absolute inset-0 flex items-end pb-10 justify-center opacity-[0.05] pointer-events-none overflow-hidden select-none">
          <motion.span
            className="text-[20vw] font-black leading-none whitespace-nowrap wise-font"
            style={{ x: textX }}
          >
            CARBONXPLANET DECENTRALIZED MARKET
          </motion.span>
        </div>

        <div className="w-full max-w-[1360px] mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="max-w-xl">
            <h2 className="text-[2.25rem] sm:text-5xl tracking-[-0.05em] mb-4 sm:mb-6 leading-[1.05] sm:leading-[0.98] text-[#e6f0de] uppercase wise-font font-black">
              A carbon market<br />that doesn't<br />manipulate you.
            </h2>
            <p className="text-white/80 text-[17px] leading-relaxed mb-5 font-medium">
              Trade credits directly on-chain. No intermediaries, no hidden fees, and full transparency.
            </p>
            <p className="text-white/70 text-[15px] leading-relaxed mb-8 font-semibold">
              No brokers. No greenwashing. No BS.
            </p>
            <Link to="/marketplace" className="inline-flex items-center space-x-3 bg-[#e4f0db] text-[#153323] px-6 py-3 text-[12px] font-bold hover:bg-white transition-colors">
              <span>EXPLORE MARKETPLACE</span>
              <FaArrowRight className="text-[11px]" />
            </Link>
          </div>

          <div className="relative">
            <div className="bg-[#f8faf6] text-[#17351f] p-7 sm:p-9 border border-white/20 max-w-lg ml-auto">
              <div className="space-y-6">

                <div className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-full bg-[#dcebd8] flex items-center justify-center shrink-0">
                    <span className="text-[#28563b] font-bold text-xs">01</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 subheading">Connect Wallet</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Link your Web3 wallet to authenticate and access the marketplace securely.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-full bg-[#dcebd8] flex items-center justify-center shrink-0">
                    <span className="text-[#28563b] font-bold text-xs">02</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase tracking-widest mb-1 subheading">Browse & Select</h4>
                    <p className="text-[#555] text-sm leading-relaxed">Explore audited carbon credit projects filtered by type, region, standard, vintage.</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-9 h-9 rounded-full bg-[#dcebd8] flex items-center justify-center shrink-0">
                    <span className="text-[#28563b] font-bold text-xs">03</span>
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
      <section className="bg-[#bef264] text-[#0a0a0a] overflow-hidden py-16 sm:py-20 lg:py-24 relative">
        {/* Aesthetic Background Pattern */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Clean grid pattern */}
          <div className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}>
          </div>
          {/* Organic glowing orbs for a premium feel */}
          <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[60%] bg-[#d9f99d] rounded-full mix-blend-multiply filter blur-[120px] opacity-60"></div>
          <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[70%] bg-[#65a30d] rounded-full mix-blend-multiply filter blur-[120px] opacity-20"></div>
          <div className="absolute top-[10%] left-[40%] w-[30%] h-[30%] bg-[#f4fce3] rounded-full mix-blend-screen filter blur-[100px] opacity-40"></div>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.h2
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={{
              visible: {
                transition: { staggerChildren: 0.15 }
              }
            }}
            className="text-3xl sm:text-4xl lg:text-5xl uppercase tracking-tighter mb-8 leading-[1.05] text-[#0a0a0a] wise-font font-black flex flex-col items-center text-center"
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
            <span className="overflow-hidden block mt-1">
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
            <span className="overflow-hidden block mt-1">
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

          <div className="flex justify-center -space-x-3 mb-7 relative z-50">
            {testimonials.map((t, idx) => {
              const isActive = idx === activeTestimonial;
              return (
                <div
                  key={t.id}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-12 h-12 rounded-full border-3 overflow-hidden shadow-lg cursor-pointer transition-all duration-300 relative ${isActive ? 'z-50 border-white scale-110' : 'z-30 border-[#bef264] hover:z-40'}`}
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

          <div className="relative max-w-3xl mx-auto min-h-[175px]">
            {/* Left/Right Arrows */}
            <button onClick={handlePrevTestimonial} className="absolute z-50 left-0 sm:-left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#bef264] transition-all">
              <FaArrowRight className="transform rotate-180 text-sm" />
            </button>
            <button onClick={handleNextTestimonial} className="absolute z-50 right-0 sm:-right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-[#0a0a0a]/20 flex items-center justify-center text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-[#bef264] transition-all">
              <FaArrowRight className="text-sm" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="px-9 sm:px-14 flex flex-col items-center"
              >
                <p className="text-[18px] sm:text-[21px] font-medium leading-relaxed max-w-2xl mx-auto mb-6 text-[#222]">
                  “{testimonials[activeTestimonial].quote}”
                </p>

                <div className="mb-8 flex flex-col items-center justify-center">
                  <h4 className="font-bold text-base uppercase tracking-widest text-[#0a0a0a] mb-1 subheading">{testimonials[activeTestimonial].name}</h4>
                  <div className="flex items-center space-x-2 text-[#444] text-sm font-medium">
                    <span>{testimonials[activeTestimonial].role}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0a0a0a]/30"></span>
                    <span className="font-bold text-[#0a0a0a]">{testimonials[activeTestimonial].company}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <Link to="/about" className="inline-flex items-center space-x-3 bg-[#0a0a0a] text-white px-6 py-3 text-[12px] font-bold hover:bg-black transition-all hover:scale-105 shadow-xl">
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
      <section id="contact" className="bg-[#0a0a0a] text-white py-16 lg:py-20 relative overflow-hidden border-t border-[#111]">
        <div className="max-w-[1080px] w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-14 relative z-10">
          {/* Left Column - Contact Details */}
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-5 text-[#bef264] tracking-tighter leading-[1.05] uppercase wise-font">
              Get in<br />Touch.
            </h2>
            <p className="text-white/70 text-[15px] leading-relaxed max-w-sm mb-9 font-medium">
              Whether you have a question about our decentralized carbon credit marketplace, want to partner with us, or just want to say hi, we're here for you.
            </p>

            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start space-x-5">
                <div className="w-11 h-11 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center flex-shrink-0">
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
                <div className="w-11 h-11 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center flex-shrink-0">
                  <FaPhoneAlt className="text-[#bef264] text-lg" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Call Us</p>
                  <p className="text-[15px] font-medium text-white">+91 8080209999</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-5">
                <div className="w-11 h-11 rounded-full bg-[#111] border border-gray-800 flex items-center justify-center flex-shrink-0">
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
            <div className="bg-[#111] border border-gray-800 p-7 md:p-8 shadow-2xl rounded-2xl w-full max-w-[540px]">
              <h3 className="text-2xl md:text-3xl font-black mb-6 text-white tracking-tighter uppercase wise-font">Send a Message</h3>
              <form onSubmit={handleContactSubmit} className="space-y-4">

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
                    className="w-full bg-[#1a1a1a] border border-gray-800 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
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
                      className="w-full bg-[#1a1a1a] border border-gray-800 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all"
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
                      className="w-full bg-[#1a1a1a] border border-gray-800 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all"
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
                    rows={4}
                    className="w-full bg-[#1a1a1a] border border-gray-800 py-3.5 pl-12 pr-4 text-sm text-white placeholder-gray-500 rounded-xl focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-[#bef264] hover:bg-[#a3e635] text-[#0a0a0a] font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-lg text-[13px] uppercase tracking-widest mt-2 flex justify-center items-center">
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
