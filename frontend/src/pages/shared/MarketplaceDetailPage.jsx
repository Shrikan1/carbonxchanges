import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import LocationMap from '../../components/LocationMap';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import PurchaseModal from '../../components/marketplace/PurchaseModal';
import { 
  FiArrowLeft, FiMapPin, FiInfo, FiCheckCircle, FiFileText, FiTarget, 
  FiClock, FiTrendingUp, FiLayers, FiShield 
} from 'react-icons/fi';

export default function MarketplaceDetailPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    async function load() {
      try {
        const res = await marketplaceApi.getMarketplaceListing(listingId);
        setListing(res.data.listing);
        setPosts(res.data.showcase_posts || []);
      } catch (err) {
        console.error('Failed to load listing details', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [listingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32 pb-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-32 pb-24">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing Not Found</h2>
            <p className="text-gray-500 mb-6">The project you are looking for does not exist or is no longer available.</p>
            <Link to="/marketplace" className="text-emerald-600 font-bold hover:underline">Return to Marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  const getGradient = (id) => {
    const colors = [
      'from-[#0f172a] to-[#334155]',
      'from-[#064e3b] to-[#0f766e]',
      'from-[#1e3a8a] to-[#1d4ed8]',
      'from-[#451a03] to-[#78350f]',
      'from-[#312e81] to-[#4338ca]',
    ];
    const index = (id?.toString().charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-28 pb-24">
        
        {/* Project Header */}
        <div className="bg-white border border-gray-200 flex flex-col md:flex-row mb-12 shadow-sm">
          {/* Image Side */}
          <div className="w-full md:w-[40%] md:border-r border-gray-200 relative bg-gray-100 min-h-[300px]">
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.project_title} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(listing.project_id || listing.id)} flex items-center justify-center`}>
                <span className="text-white/20 font-black text-8xl uppercase tracking-tighter mix-blend-overlay logo-retro">
                  CXP
                </span>
              </div>
            )}
            <div className="absolute top-6 left-6">
              <span className="px-3 py-1.5 bg-white text-emerald-700 text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <FiCheckCircle size={12} className="text-emerald-500" /> Verified Project
              </span>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="w-full md:w-[60%] p-8 md:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100">{listing.project_type?.replace(/_/g, ' ') || 'Carbon Project'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FiMapPin size={12} /> {listing.country || 'Global'}</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-[1.1] tracking-tight">
              {listing.project_title}
            </h1>
            
            <div className="flex items-center gap-3 text-sm text-gray-600 mb-8 border-l-2 border-gray-200 pl-4">
              <span className="font-bold text-gray-900 uppercase tracking-wider text-xs">Developed By</span>
              <span className="font-medium">{listing.seller_name || 'CarbonXPlanet Partner'}</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <div className="flex flex-col bg-gray-50 px-6 py-3 border border-gray-200 shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Price per ton</span>
                <span className="text-2xl font-black text-emerald-600">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={() => setShowPurchaseModal(true)}
                className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-4 px-8 transition-colors text-center text-lg flex items-center justify-center gap-2 shadow-md"
              >
                Purchase Credits
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-gray-200 bg-white mb-12">
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"><FiLayers /> Total Area</span>
            <span className="text-2xl font-black text-gray-900">{Number(listing.total_project_area_hectares || 0).toLocaleString()} <span className="text-sm font-medium text-gray-500">ha</span></span>
          </div>
          <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"><FiTrendingUp /> Est. Volume</span>
            <span className="text-2xl font-black text-gray-900">{Number(listing.total_co2_claimed || 0).toLocaleString()} <span className="text-sm font-medium text-gray-500">tCO₂e</span></span>
          </div>
          <div className="p-6 border-r border-gray-200 flex flex-col justify-center">
            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2"><FiClock /> Duration</span>
            <span className="text-2xl font-black text-gray-900">{listing.duration_months || '-'} <span className="text-sm font-medium text-gray-500">months</span></span>
          </div>
          <div className="p-6 flex flex-col justify-center bg-gray-50">
            <span className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Available Now</span>
            <span className="text-2xl font-black text-emerald-600">{Number(listing.amount_available || 0).toLocaleString()} <span className="text-sm font-medium text-emerald-600/70">tCO₂e</span></span>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-3 mb-6">Project Overview</h2>
              <div className="prose prose-lg text-gray-600 leading-relaxed max-w-none">
                <p>
                  {posts[0]?.story || listing.project_summary || "Detailed overview documentation is pending. The verification metrics below confirm the authenticity and scale of this carbon offset initiative."}
                </p>
                {posts[0]?.how_it_works && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Implementation Strategy</h3>
                    <p>{posts[0].how_it_works}</p>
                  </>
                )}
              </div>
            </section>

            {/* Verification Timeline */}
            <section>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest border-b-2 border-gray-900 pb-3 mb-6">Verification Protocol</h2>
              <div className="bg-white border border-gray-200 p-8">
                <div className="relative">
                  {/* Vertical Line */}
                  <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-emerald-100 z-0"></div>
                  
                  <div className="space-y-8 relative z-10">
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shrink-0 bg-white">
                        <FiCheckCircle size={16} />
                      </div>
                      <div className="pt-2">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Project Registration</h4>
                        <p className="text-sm text-gray-500">Seller submitted methodology and initial claims.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shrink-0 bg-white">
                        <FiCheckCircle size={16} />
                      </div>
                      <div className="pt-2">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Document KYC Review</h4>
                        <p className="text-sm text-gray-500">Land deeds and personal identities verified.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shrink-0 bg-white">
                        <FiCheckCircle size={16} />
                      </div>
                      <div className="pt-2">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Field Verification</h4>
                        <p className="text-sm text-gray-500">Independent auditor confirmed physical project scope and calculated verified emissions.</p>
                      </div>
                    </div>
                    <div className="flex gap-6">
                      <div className="w-10 h-10 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center text-emerald-500 shrink-0 bg-white">
                        <FiShield size={16} />
                      </div>
                      <div className="pt-2">
                        <h4 className="font-bold text-gray-900 text-sm mb-1">Protocol Approval</h4>
                        <p className="text-sm text-gray-500">Platform administrators granted final approval.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Purchase CTA Box */}
            <div className="bg-gray-900 text-white p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500 rounded-full blur-[60px] opacity-20 pointer-events-none"></div>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-6 relative z-10">Carbon Credit Offer</h3>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm font-medium">Available Inventory</span>
                  <span className="font-bold">{Number(listing.amount_available || 0).toLocaleString()} tCO₂e</span>
                </div>
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="text-gray-400 text-sm font-medium">Price per unit</span>
                  <span className="font-bold">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
              
              <button 
                onClick={() => setShowPurchaseModal(true)}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 transition-colors relative z-10 shadow-lg"
              >
                Purchase Now
              </button>
            </div>

            {/* Methodology Information */}
            <div className="bg-white border border-gray-200 p-6">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <FiTarget className="text-gray-400" /> Methodology Details
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Scale</span>
                  <span className="text-sm font-semibold text-gray-900 capitalize">{listing.project_scale?.replace('-', ' ') || 'Unknown'}</span>
                </div>
                
                {listing.methodology_specific_data && Object.keys(listing.methodology_specific_data).length > 0 && (
                  <div className="pt-3 border-t border-gray-100 space-y-3">
                    {Object.entries(listing.methodology_specific_data).map(([key, value]) => (
                      <div key={key} className="flex flex-col">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                        <span className="text-sm font-semibold text-gray-900">{value.toString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Map */}
            {listing.latitude && listing.longitude && (
              <div className="bg-white border border-gray-200 p-6">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <FiMapPin className="text-gray-400" /> Location Data
                </h3>
                <div className="h-[200px] bg-gray-100 mb-4 border border-gray-200">
                  <LocationMap lat={listing.latitude} lng={listing.longitude} />
                </div>
                <div className="text-[10px] text-gray-400 font-mono">
                  LAT: {Number(listing.latitude).toFixed(4)} <br/>
                  LNG: {Number(listing.longitude).toFixed(4)}
                </div>
              </div>
            )}
            
          </div>
        </div>

      </main>
      
      {/* Purchase Flow Modal */}
      {showPurchaseModal && (
        <PurchaseModal 
          listing={listing} 
          onClose={() => setShowPurchaseModal(false)} 
        />
      )}
    </div>
  );
}
