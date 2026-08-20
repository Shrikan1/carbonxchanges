import { Link } from 'react-router-dom';
import { FiMapPin, FiCheckCircle } from 'react-icons/fi';

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

export default function MarketplaceCard({ listing }) {
  // If no image is provided, we fall back to a restrained, premium brand gradient.
  const imageUrl = listing.image_url;
  
  return (
    <div className="group bg-white flex flex-col h-full border border-gray-200 hover:border-emerald-500 transition-all duration-300 shadow-sm hover:shadow-xl relative">
      {/* Image Section */}
      <div className="h-48 w-full relative overflow-hidden bg-gray-100">
        {imageUrl ? (
          <img src={imageUrl} alt={listing.project_title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${getGradient(listing.project_id || listing.id)} flex flex-col items-center justify-center opacity-90 group-hover:opacity-100 transition-opacity duration-500`}>
             <span className="text-white/20 font-black text-6xl uppercase tracking-tighter mix-blend-overlay logo-retro">
                CXP
             </span>
          </div>
        )}

        <div className="absolute top-4 left-4 flex gap-2">
          {/* Always true for marketplace listings right now, but we keep it dynamic */}
          <span className="px-2.5 py-1 bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 shadow-sm">
            <FiCheckCircle size={10} /> Verified
          </span>
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        
        {/* Project Meta */}
        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
          <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 border border-emerald-100">{listing.project_type?.replace(/_/g, ' ') || 'Carbon Project'}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><FiMapPin size={10} /> {listing.country || 'Global'}</span>
        </div>

        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
          {listing.project_title || `Project CXP-${listing.project_id}`}
        </h3>
        
        {/* Metrics Grid */}
        <div className="mt-auto pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Available</span>
            <span className="text-gray-900 font-semibold">{Number(listing.amount_available || 0).toLocaleString()} <span className="text-gray-500 font-normal text-xs">tCO₂e</span></span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-0.5">Price / Ton</span>
            <span className="text-emerald-600 font-bold text-lg leading-none">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        <Link 
          to={`/marketplace/${listing.listing_id}`}
          className="mt-5 w-full block text-center py-2.5 text-sm font-bold bg-primary"
        >
          View Project
        </Link>
      </div>
    </div>
  );
}
