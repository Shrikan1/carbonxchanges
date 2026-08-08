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
import ParticleText from '../../components/ui/ParticleText';
import GlareHover from '../../components/ui/GlareHover';
import DecryptedText from '../../components/ui/DecryptedText';

const projectGalleryItems = [
  { image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop', title: 'Tropical Rainforest' },
  { image: 'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=600&h=400&fit=crop', title: 'Wind Turbines' },
  { image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=600&h=400&fit=crop', title: 'Solar Panels' },
  { image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop', title: 'Mountain Valley' },
  { image: 'https://images.unsplash.com/photo-1518173946687-a696ef0c30d4?w=600&h=400&fit=crop', title: 'Ocean Conservation' },
  { image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop', title: 'Green Plantation' },
  { image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=600&h=400&fit=crop', title: 'Sunrise Forest' },
  { image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=600&h=400&fit=crop', title: 'Recycling Hub' },
  { image: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=600&h=400&fit=crop', title: 'Evergreen Landscape' },
  { image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&h=400&fit=crop', title: 'Golden Fields' },
  { image: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=600&h=400&fit=crop', title: 'Mangrove Roots' },
  { image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=600&h=400&fit=crop', title: 'Aerial Forest' },
  { image: 'https://images.unsplash.com/photo-1413752362258-7af2a667b590?w=600&h=400&fit=crop', title: 'Waterfall Canyon' },
  { image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop', title: 'Alpine Peaks' },
  { image: 'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=600&h=400&fit=crop', title: 'River Bridge' },
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
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight text-white mb-8">
            Offset Emissions.
            <br />
            <span className="text-white/40">Build the Future.</span>
          </h1>

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

        {/* Bottom Stats Bar */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#0c0c0c]/80">
          <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/40 mb-1">Total Volume</p>
              <p className="text-xl font-bold text-white">
                <DecryptedText text="$24.8M" animateOn="view" speed={60} maxIterations={12} encryptedClassName="text-white/60" />
              </p>
            </div>
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/40 mb-1">Credits Retired</p>
              <p className="text-xl font-bold text-white">
                <DecryptedText text="1.2M tCO₂" animateOn="view" speed={60} maxIterations={12} encryptedClassName="text-white/60" />
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/40 mb-1">Active Projects</p>
              <p className="text-xl font-bold text-white">
                <DecryptedText text="340+" animateOn="view" speed={60} maxIterations={12} encryptedClassName="text-white/60" />
              </p>
            </div>
            <div className="hidden md:block">
              <p className="text-[11px] font-mono uppercase tracking-[0.12em] text-white/40 mb-1">Avg. Price/Credit</p>
              <p className="text-xl font-bold text-white">
                <DecryptedText text="$18.40" animateOn="view" speed={60} maxIterations={12} encryptedClassName="text-white/60" />
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURED PROJECTS ─── */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-14 gap-4">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#666] mb-3">Featured</p>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
                Carbon Credit Projects
              </h2>
            </div>
            <Link to="/projects" className="text-[13px] text-[#888] hover:text-white font-medium flex items-center space-x-1.5 transition-colors">
              <span>View all projects</span>
              <FaArrowRight className="text-[10px]" />
            </Link>
          </div>

          {/* Project Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Project 1 (Full Image Card - Like New York) */}
            <div className="bg-white p-2.5 rounded-[2.5rem] shadow-xl h-[480px] flex flex-col relative group">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?q=80&w=800&auto=format&fit=crop" 
                  alt="Amazon Rainforest Conservation" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Heart Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors z-10">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="text-[22px] font-bold text-white mb-1">Amazon Rainforest</h3>
                  <p className="text-[13px] text-white/70 font-medium mb-5">Forestry · Verra VCS</p>
                  
                  <div className="flex items-center space-x-4 mb-6 text-[13px] font-semibold text-white/90">
                    <div className="flex items-center space-x-1.5">
                       <span className="text-white/60">from</span> <span>$14.20</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                       <FaTree className="text-white/60" /> <span>BRZ</span>
                    </div>
                  </div>

                  <Link to="/projects" className="block w-full text-center bg-white text-black py-3.5 rounded-[1.25rem] text-[14px] font-bold hover:bg-gray-100 transition-colors shadow-lg">
                    View Details
                  </Link>
                </div>
              </div>
            </div>

            {/* Project 2 (Split Image/White Card - Like San Francisco) */}
            <div className="bg-white p-2.5 rounded-[2.5rem] shadow-xl h-[480px] flex flex-col group">
              <div className="relative w-full h-[55%] rounded-[2rem] overflow-hidden mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=800&auto=format&fit=crop" 
                  alt="Gujarat Wind Farm Cluster" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
              </div>
              
              <div className="flex-grow flex flex-col px-4 pb-3">
                <h3 className="text-[22px] font-bold text-[#111] mb-1">Gujarat Wind Farm</h3>
                <p className="text-[13px] text-[#888] font-medium mb-5">Wind Energy · Gold Standard</p>
                
                <div className="flex items-center space-x-4 mb-auto text-[13px] font-bold text-[#111]">
                  <div className="flex items-center space-x-1.5">
                     <span className="text-[#888] font-medium">from</span> <span>$22.50</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                     <FaWind className="text-[#888]" /> <span>IND</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3 mt-4">
                  <Link to="/projects" className="flex-grow text-center bg-[#1a1a1a] text-white py-3.5 rounded-[1.25rem] text-[14px] font-bold hover:bg-black transition-colors shadow-lg">
                    View Details
                  </Link>
                  <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors flex-shrink-0">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Project 3 (Full Image Card - Like New York) */}
            <div className="bg-white p-2.5 rounded-[2.5rem] shadow-xl h-[480px] flex flex-col relative group">
              <div className="relative w-full h-full rounded-[2rem] overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1509391366360-2e959784a276?q=80&w=800&auto=format&fit=crop" 
                  alt="Rajasthan Solar Grid" 
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Heart Icon */}
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/40 transition-colors z-10">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className="text-[22px] font-bold text-white mb-1">Rajasthan Solar Grid</h3>
                  <p className="text-[13px] text-white/70 font-medium mb-5">Solar · Verra VCS</p>
                  
                  <div className="flex items-center space-x-4 mb-6 text-[13px] font-semibold text-white/90">
                    <div className="flex items-center space-x-1.5">
                       <span className="text-white/60">from</span> <span>$18.80</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                       <FaSolarPanel className="text-white/60" /> <span>IND</span>
                    </div>
                  </div>

                  <Link to="/projects" className="block w-full text-center bg-white text-black py-3.5 rounded-[1.25rem] text-[14px] font-bold hover:bg-gray-100 transition-colors shadow-lg">
                    View Details
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ─── PROJECT GALLERY (DRIFT WALL) ─── */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 pt-24 pb-8">
          <div className="text-center mb-4">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#666] mb-3">Gallery</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Projects Around the World
            </h2>
            <p className="text-[#888] text-[14px] mt-3 max-w-lg mx-auto">
              From rainforest preservation to renewable energy — explore the initiatives shaping a carbon-neutral future.
            </p>
          </div>
        </div>
        <div style={{ height: 560 }}>
          <DriftWall
            items={projectGalleryItems}
            columns={5}
            tileWidth={220}
            tileHeight={148}
            gap={14}
            tilt={14}
            turn={-12}
            perspective={1200}
            depth={100}
            speed={36}
            direction="up"
            variance={0.4}
            parallax={0.5}
            lift={56}
            fade={0.55}
            dim={1}
            overlayColor="#060010"
            radius={10}
            roll={0}
            pauseOnHover={false}
            grayscale={false}
          />
        </div>
      </section>

      {/* ─── PLATFORM FEATURES ─── */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          
          <div className="mb-14">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#666] mb-3">Platform</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Why CarbonXplanet
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#222]">
            
            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="w-10 h-10 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-5">
                <FaBolt className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Instant Settlement</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Smart contract-powered transactions settle in seconds with zero intermediaries and full on-chain transparency.
              </p>
            </div>

            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="w-10 h-10 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-5">
                <FaShieldAlt className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Blockchain Proof</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Every credit is minted as an NFT with verifiable provenance. Tamper-proof audit trail from issuance to retirement.
              </p>
            </div>

            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="w-10 h-10 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-5">
                <FaChartLine className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Real-Time Analytics</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Track your carbon footprint, portfolio performance, and market trends with live dashboards and reporting tools.
              </p>
            </div>

            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="w-10 h-10 bg-[#1a1a1a] border border-[#333] flex items-center justify-center mb-5">
                <FaFileContract className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">ESG Compliance</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Generate audit-ready ESG reports. Aligned with Verra VCS, Gold Standard, and international carbon accounting frameworks.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="border-t border-[#222]">
        <div className="max-w-5xl mx-auto px-6 py-24">
          
          <div className="mb-14">
            <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-[#666] mb-3">Process</p>
            <div className="relative w-full h-[120px] -ml-2 -mt-4 mb-4">
              <ParticleText
                text="How It Works"
                particleSize={2.5}
                density={3}
                color="#ffffff"
                highlightColor="#aaf7a7"
                scatter={80}
                gatherDuration={1500}
                stagger={200}
                trigger="scroll"
                fontSize="clamp(2rem, 6vw, 3.5rem)"
                fontWeight={900}
                glow={true}
                className="!min-h-0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[#222]">
            
            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-[11px] font-mono text-[#666] border border-[#333] w-8 h-8 flex items-center justify-center">01</span>
                <FaWallet className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Connect Wallet</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Link your Web3 wallet to securely authenticate and access the marketplace. No passwords, no email signups needed.
              </p>
            </div>

            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-[11px] font-mono text-[#666] border border-[#333] w-8 h-8 flex items-center justify-center">02</span>
                <FaSearch className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Browse & Select</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Explore audited carbon credit projects filtered by type, region, standard, vintage, and price per tonne.
              </p>
            </div>

            <div className="bg-[#0c0c0c] p-8 sm:p-10">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-[11px] font-mono text-[#666] border border-[#333] w-8 h-8 flex items-center justify-center">03</span>
                <FaHandshake className="text-white text-sm" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Trade & Retire</h3>
              <p className="text-[13px] text-[#888] leading-relaxed">
                Purchase credits via smart contract, hold them in your portfolio, or retire them on-chain to offset your emissions.
              </p>
            </div>

          </div>
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
                <img src="/fevicon.png" alt="CarbonXplanet" className="h-6 w-6 object-contain" />
                <span className="text-white text-sm font-bold tracking-tight">CarbonXplanet</span>
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
