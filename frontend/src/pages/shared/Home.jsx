import { Link } from 'react-router-dom';
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
import DriftWall from '../../components/ui/DriftWall';
import heroBg from '../../assets/forest-wallpaper-3840x2160-nature-tranquil-6524.jpg';
import GlareHover from '../../components/ui/GlareHover';
import DecryptedText from '../../components/ui/DecryptedText';
import ScrollExpand from '../../components/ui/ScrollExpand';
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
  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans">
      <Navbar />

      {/* ─── HERO SECTION ─── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroBg})` }}
        />
        <div className="absolute inset-0 bg-[#0c0c0c]/10" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-24 pb-20">
          {/* Headline */}
          <div className="flex flex-col items-center justify-center space-y-2 mb-10 mt-4">
            <h1 className="logo-retro text-[clamp(2.5rem,6vw,5rem)] text-white uppercase tracking-tight drop-shadow-lg leading-[1.1]" style={{ WebkitTextFillColor: 'white', background: 'none' }}>Offset Emissions.</h1>
            <h1 className="logo-retro text-[clamp(2.5rem,6vw,5rem)] text-[#f3f4f6] uppercase tracking-tight drop-shadow-lg leading-[1.1]" style={{ WebkitTextFillColor: '#f3f4f6', background: 'none' }}>Build the Future.</h1>
          </div>

          {/* Subtext */}
          <p className="text-white/50 text-base sm:text-lg max-w-xl mx-auto leading-relaxed mb-12">
            The decentralized marketplace where verified carbon credits meet transparent blockchain infrastructure.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/marketplace"
              className="inline-flex items-center space-x-2 bg-white text-[#0c0c0c] px-8 py-3.5 text-[14px] font-semibold hover:bg-[#eee] transition-colors"
            >
              <span>Explore Marketplace</span>
              <FaArrowRight className="text-[11px]" />
            </Link>
            <Link
              to="/signup"
              className="inline-block"
            >
              <GlareHover
                width="auto"
                height="auto"
                background="transparent"
                borderColor="rgba(255,255,255,0.2)"
                borderRadius="0px"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                className="px-8 py-3.5 hover:border-white/50 transition-colors !border-[rgba(255,255,255,0.2)] hover:!border-[rgba(255,255,255,0.5)]"
              >
                <span className="text-white text-[14px] font-semibold">Get Started</span>
              </GlareHover>
            </Link>
          </div>
        </div>


      </section>

      {/* ─── ABOUT THE PLATFORM ─── */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-24">

          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1 space-y-6">
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#666]">Our Purpose</p>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
                Empowering Global Climate Action.
              </h2>
              <p className="text-white/60 text-lg leading-relaxed">
                CarbonXplanet is a next-generation decentralized marketplace designed to bridge the gap between verified carbon credit projects and eco-conscious organizations.
              </p>
              <p className="text-white/60 text-lg leading-relaxed">
                By leveraging blockchain infrastructure, we bring unprecedented transparency, security, and efficiency to the trading of environmental assets—ensuring that every transaction directly contributes to a sustainable future.
              </p>

              <div className="pt-6 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Verified Impact</h4>
                  <p className="text-[#888] text-sm">Every project is stringently vetted against global standards like Verra and Gold Standard.</p>
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg mb-2">Immutable Ledger</h4>
                  <p className="text-[#888] text-sm">Blockchain technology guarantees that credits cannot be double-counted or manipulated.</p>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full">
              <div className="relative overflow-hidden shadow-2xl h-[500px]">
                <img
                  src={img4}
                  alt="Sustainable Future"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-10 left-10 right-10">
                  <div>
                    <p className="text-white font-medium text-lg leading-snug drop-shadow-md">"The transition to a net-zero global economy requires radical transparency and verifiable action."</p>
                  </div>
                </div>
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
        </div>
      </section>

      {/* ─── PLATFORM FEATURES (WHITE & FLOATING ICONS) ─── */}
      <section className="bg-white text-[#0a0a0a] overflow-hidden py-32 relative">
        <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
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
          
          <div className="relative h-[600px] flex items-center justify-center lg:justify-end lg:-mr-[5vw]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 transform -rotate-12 scale-110">
              {[FaBolt, FaShieldAlt, FaChartLine, FaFileContract, FaTree, FaWind, FaSolarPanel, FaWallet, FaHandshake].map((Icon, idx) => (
                <div key={idx} className="bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)] w-28 h-28 sm:w-36 sm:h-36 flex items-center justify-center transform transition-transform duration-500 hover:-translate-y-4 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)]">
                  <Icon className={`text-4xl sm:text-6xl ${['text-emerald-500', 'text-blue-500', 'text-indigo-500', 'text-rose-500', 'text-amber-500'][idx % 5]}`} />
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
              A carbon market<br/>that doesn't<br/>manipulate you.
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
            Don't take our word for it.<br/>
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
      <footer className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="logo-retro text-[16px]">CarbonXplanet</span>
              </div>
              <p className="text-[13px] text-[#666] leading-relaxed max-w-xs">
                Decentralized carbon credit marketplace built on blockchain technology.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-4">Product</p>
              <div className="flex flex-col space-y-2.5">
                <Link to="/marketplace" className="text-[13px] text-[#888] hover:text-white transition-colors">Marketplace</Link>
                <Link to="/projects" className="text-[13px] text-[#888] hover:text-white transition-colors">Projects</Link>
                <Link to="/about" className="text-[13px] text-[#888] hover:text-white transition-colors">About</Link>
              </div>
            </div>

            {/* Resources */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-4">Resources</p>
              <div className="flex flex-col space-y-2.5">
                <Link to="/contact" className="text-[13px] text-[#888] hover:text-white transition-colors">Contact</Link>
                <Link to="/terms" className="text-[13px] text-[#888] hover:text-white transition-colors">Terms</Link>
                <Link to="/privacy" className="text-[13px] text-[#888] hover:text-white transition-colors">Privacy</Link>
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-[#666] mb-4">Connect</p>
              <div className="flex items-center space-x-3">
                <a href="#twitter" className="w-8 h-8 border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors">
                  <FaTwitter size={12} />
                </a>
                <a href="#linkedin" className="w-8 h-8 border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors">
                  <FaLinkedinIn size={12} />
                </a>
                <a href="#github" className="w-8 h-8 border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors">
                  <FaGithub size={12} />
                </a>
                <a href="#discord" className="w-8 h-8 border border-[#333] flex items-center justify-center text-[#888] hover:text-white hover:border-[#555] transition-colors">
                  <FaDiscord size={12} />
                </a>
              </div>
            </div>

          </div>

          {/* Bottom */}
          <div className="pt-8 border-t border-[#222] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-[#666]">© 2026 CarbonXplanet. All rights reserved.</p>
            <p className="text-[12px] text-[#666]">Built with blockchain for a greener planet.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
