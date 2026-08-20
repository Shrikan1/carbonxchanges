import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import LocationMap from '../../components/LocationMap';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiArrowLeft, FiMapPin, FiPlayCircle, FiInfo, FiVideo, FiActivity, FiTarget } from 'react-icons/fi';

export default function MarketplaceDetailPage() {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-24 pb-24">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-24 pb-24">
          <h2 className="text-xl text-gray-500">Listing not found</h2>
        </div>
        <Footer />
      </div>
    );
  }

  // Find the first post with a video (if any) to use as the project demo
  const demoPost = posts.find(p => p.videos && p.videos.length > 0);
  const demoVideo = demoPost ? demoPost.videos[0] : null;

  // Use the most recent post for "how it works" and "story"
  const recentPost = posts.length > 0 ? posts[0] : null;

  return (
    <div className="min-h-screen bg-[#f4f7f5] flex flex-col font-sans">
      <Navbar />
      
      <main className="flex-grow w-full max-w-5xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        <Link to="/marketplace" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
          <FiArrowLeft className="mr-2" /> Back to Marketplace
        </Link>

        {/* Header Section */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-1/3 aspect-square bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-inner relative overflow-hidden">
             {/* If we had a main image, we'd put it here. Using a gradient placeholder for now */}
             <div className="absolute inset-0 bg-black/10"></div>
             <FiActivity className="w-16 h-16 opacity-50 relative z-10" />
          </div>
          
          <div className="flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-tight">
              {listing.project_title}
            </h1>
            <div className="flex items-center gap-2 text-gray-500 mb-6">
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                {listing.seller_name?.charAt(0).toUpperCase()}
              </div>
              <span className="font-semibold text-gray-700">{listing.seller_name}</span>
            </div>

            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              {listing.project_summary || "High-quality verified carbon credits available for immediate purchase and retirement."}
            </p>

            <div className="flex gap-4">
               {/* Buy Button Placeholder */}
               <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-xl shadow-sm transition-colors text-lg flex-1 md:flex-none">
                 Buy Credits
               </button>
               <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold px-8 py-3 rounded-xl shadow-sm transition-colors text-lg flex-1 md:flex-none">
                 Explore Project
               </button>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            
            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiInfo className="text-emerald-500" /> About the Project
              </h3>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                {recentPost?.story || listing.project_summary || "Detailed description not available for this project. Check the metrics below for verified data."}
              </p>
            </section>

            {(recentPost?.how_it_works || demoVideo) && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row gap-8">
                  
                  {recentPost?.how_it_works && (
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">How it Works</h3>
                      <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {recentPost.how_it_works}
                      </p>
                    </div>
                  )}

                  {demoVideo && (
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <FiVideo className="text-emerald-500" /> Project Demo
                      </h3>
                      <div className="rounded-2xl overflow-hidden bg-black shadow-inner aspect-video relative">
                        <video 
                          src={demoVideo.startsWith('http') ? demoVideo : `https://gateway.pinata.cloud/ipfs/${demoVideo}`} 
                          controls 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                </div>
              </section>
            )}

            <section className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="text-emerald-500" /> Project Location
              </h3>
              
              <div className="h-[300px] bg-gray-100 rounded-2xl overflow-hidden mb-6 border border-gray-200">
                {listing.latitude && listing.longitude ? (
                  <LocationMap lat={listing.latitude} lng={listing.longitude} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium">
                    Map Data Unavailable
                  </div>
                )}
              </div>

              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                <span className="font-bold text-gray-800 flex items-center gap-2">
                  📍 {listing.state_region ? `${listing.state_region}, ` : ''}{listing.country || 'Unknown'}
                </span>
                <span className="text-sm font-medium text-gray-500">
                  {listing.latitude ? `Lat: ${Number(listing.latitude).toFixed(4)} | Lng: ${Number(listing.longitude).toFixed(4)}` : 'Coordinates unknown'}
                </span>
              </div>
            </section>
            
          </div>

          {/* Sidebar Metrics */}
          <div className="space-y-6">
            
            {/* Core Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Total Area</div>
                <div className="text-xl font-black text-gray-900">{Number(listing.total_project_area_hectares || 0).toLocaleString()} <span className="text-xs text-gray-400 font-medium">ha</span></div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Est. CO₂</div>
                <div className="text-xl font-black text-gray-900">{Number(listing.total_co2_claimed || 0).toLocaleString()} <span className="text-xs text-gray-400 font-medium">t</span></div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Duration</div>
                <div className="text-xl font-black text-gray-900">{listing.duration_months || '-'} <span className="text-xs text-gray-400 font-medium">mo</span></div>
              </div>
              <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center flex flex-col justify-center">
                <div className="text-[10px] text-gray-400 font-bold mb-1 uppercase tracking-wider">Scale</div>
                <div className="text-sm font-black text-gray-900 capitalize leading-tight">{listing.project_scale?.replace('-', ' ') || 'Unknown'}</div>
              </div>
            </div>

            {/* Methodology Metrics */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-50 pb-3">
                <FiTarget className="text-emerald-500" /> Key Project Metrics
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {listing.methodology_specific_data && Object.keys(listing.methodology_specific_data).length > 0 ? (
                  Object.entries(listing.methodology_specific_data).map(([key, value]) => (
                    <div key={key} className="bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full text-xs font-medium text-emerald-800 flex gap-1.5 items-center">
                      <span className="opacity-70">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</span>
                      <span className="font-bold">{value.toString()}</span>
                    </div>
                  ))
                ) : (
                  <span className="text-sm text-gray-400 italic">No specific methodology metrics provided.</span>
                )}
              </div>
            </div>

            {/* Listing Info */}
            <div className="bg-gradient-to-b from-gray-900 to-gray-800 p-6 rounded-3xl shadow-lg border border-gray-700 text-white">
              <h3 className="text-sm font-bold text-gray-300 mb-4 uppercase tracking-wider">Listing Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-gray-700 pb-3">
                  <span className="text-gray-400 font-medium text-sm">Available</span>
                  <span className="font-bold text-xl">{Number(listing.amount_available || 0).toLocaleString()} <span className="text-sm text-gray-400">tCO₂e</span></span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-medium text-sm">Price</span>
                  <span className="font-bold text-2xl text-emerald-400">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
      
      <Footer />
    </div>
  );
}
