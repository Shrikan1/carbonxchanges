import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import LocationMap from '../../components/LocationMap';
import Navbar from '../../components/layout/Navbar';
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
      
      <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
        
        {/* Project Header */}
        <div className="bg-white border border-gray-200 flex flex-col md:flex-row mb-8 md:mb-12 shadow-sm">
          {/* Image Side */}
          <div className="w-full md:w-[40%] md:border-r border-gray-200 relative bg-gray-100 h-[180px] md:h-auto md:min-h-[300px]">
            {listing.image_url ? (
              <img src={listing.image_url} alt={listing.project_title} className="w-full h-full object-cover absolute inset-0" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(listing.project_id || listing.id)} flex items-center justify-center`}>
                <span className="text-white/20 font-black text-6xl md:text-8xl uppercase tracking-tighter mix-blend-overlay wise-font">
                  CXP
                </span>
              </div>
            )}
            <div className="absolute top-4 left-4 md:top-6 md:left-6">
              <span className="px-2.5 py-1 md:px-3 md:py-1.5 bg-white text-emerald-700 text-[10px] md:text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-md">
                <FiCheckCircle size={12} className="text-emerald-500" /> Verified
              </span>
            </div>
          </div>
          
          {/* Content Side */}
          <div className="w-full md:w-[60%] p-4 md:p-12 flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-[10px] md:text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 md:mb-4">
              <span className="text-emerald-700 bg-emerald-50 px-2 py-1 border border-emerald-100">{listing.project_type?.replace(/_/g, ' ') || 'Carbon Project'}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><FiMapPin size={12} /> {listing.country || 'Global'}</span>
            </div>
            
            <h1 className="text-xl md:text-5xl font-black text-gray-900 mb-3 md:mb-6 leading-[1.15] tracking-tight">
              {listing.project_title}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-[12px] md:text-sm text-gray-600 mb-5 md:mb-6 border-l-2 border-gray-200 pl-3 md:pl-4">
              <span className="font-bold text-gray-900 uppercase tracking-wider text-[10px] md:text-xs">Developed By</span>
              <span className="font-medium">{listing.seller_name || 'CarbonXPlanet Partner'}</span>
            </div>

            <div className="flex flex-row items-stretch gap-3 mt-auto">
              <div className="flex flex-col justify-center bg-gray-50 px-4 py-2 md:px-6 md:py-3 border border-gray-200 shrink-0">
                <span className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5 md:mb-1">Price / Ton</span>
                <span className="text-xl md:text-2xl font-black text-emerald-600 leading-none">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
              </div>
              <button 
                onClick={() => setShowPurchaseModal(true)}
                className="flex-1 bg-gray-900 hover:bg-black text-white font-bold py-2 px-4 transition-colors text-center text-sm md:text-lg flex items-center justify-center shadow-md"
              >
                Purchase
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 border border-gray-200 bg-white mb-8 md:mb-12">
          <div className="p-4 md:p-6 border-b md:border-b-0 border-r md:border-r border-gray-200 flex flex-col justify-center">
            <span className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2"><FiLayers /> Total Area</span>
            <span className="text-lg md:text-2xl font-black text-gray-900 leading-none">{Number(listing.total_project_area_hectares || 0).toLocaleString()} <span className="text-[10px] md:text-sm font-medium text-gray-500">ha</span></span>
          </div>
          <div className="p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-200 flex flex-col justify-center">
            <span className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2"><FiTrendingUp /> Est. Volume</span>
            <span className="text-lg md:text-2xl font-black text-gray-900 leading-none">{Number(listing.total_co2_claimed || 0).toLocaleString()} <span className="text-[10px] md:text-sm font-medium text-gray-500">tCO₂e</span></span>
          </div>
          <div className="p-4 md:p-6 border-r border-gray-200 flex flex-col justify-center">
            <span className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2"><FiClock /> Duration</span>
            <span className="text-lg md:text-2xl font-black text-gray-900 leading-none">{listing.duration_months || '-'} <span className="text-[10px] md:text-sm font-medium text-gray-500">mo</span></span>
          </div>
          <div className="p-4 md:p-6 flex flex-col justify-center bg-gray-50">
            <span className="flex items-center gap-1.5 md:gap-2 text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 md:mb-2">Available</span>
            <span className="text-lg md:text-2xl font-black text-emerald-600 leading-none">{Number(listing.amount_available || 0).toLocaleString()} <span className="text-[10px] md:text-sm font-medium text-emerald-600/70">tCO₂e</span></span>
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
                <div className="whitespace-pre-line">
                  {posts[0]?.story || listing.project_summary || "Detailed overview documentation is pending. The verification metrics below confirm the authenticity and scale of this carbon offset initiative."}
                </div>
                {posts[0]?.how_it_works && (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 mt-8 mb-4">Implementation Strategy</h3>
                    <div className="whitespace-pre-line">{posts[0].how_it_works}</div>
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
                <div className="h-[200px] border border-gray-200 overflow-hidden">
                  <LocationMap
                    markers={[{
                      lat: Number(listing.latitude),
                      lng: Number(listing.longitude),
                      label: listing.project_title
                    }]}
                    zoom={11}
                    height="200px"
                  />
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
