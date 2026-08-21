import { Link } from 'react-router-dom';
import { FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

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
  const { isAuthenticated } = useAuthStore();
  // If no image is provided, we fall back to a restrained, premium brand gradient.
  const imageUrl = listing.image_url;

  return (
    <div 
      className="bg-white text-black flex flex-col sm:flex-row h-full sm:min-h-[280px] relative group shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.15)] transition-shadow duration-300"
      style={{ clipPath: 'polygon(2rem 0, 100% 0, 100% calc(100% - 2rem), calc(100% - 2rem) 100%, 0 100%, 0 2rem)' }}
    >
      {/* Left Side: Content */}
      <div className="w-full sm:w-[55%] p-6 sm:p-8 flex flex-col justify-between relative bg-white z-10">
        <div>
          {/* Project Meta */}
          <div className="flex items-center gap-2 mb-2 subheading">
            <span className="text-[#00d084] font-bold text-[10px] uppercase tracking-wider">{listing.project_type?.replace(/_/g, ' ') || 'REFORESTATION'}</span>
            <span className="text-gray-300 text-[10px]">•</span>
            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1"><FiMapPin size={10} /> {listing.country || 'INDIA'}</span>
          </div>

          {/* Huge Title (Like 'PERPS ARE HERE') */}
          <h3 className="text-3xl sm:text-4xl font-black leading-[0.9] tracking-tighter uppercase font-['Outfit'] mb-4 break-words line-clamp-4">
            {listing.project_title || `Project CXP-${listing.project_id}`}
          </h3>
        </div>
        
        <div className="mt-4">
          {/* Metrics */}
          <div className="flex items-end gap-6 mb-5 subheading">
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Available</span>
              <span className="text-black font-bold text-sm">{Number(listing.amount_available || 0).toLocaleString()} <span className="text-gray-500 font-normal text-[10px]">tCO₂e</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider mb-1">Price/Ton</span>
              <span className="text-[#00d084] font-black text-lg leading-none">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          {isAuthenticated ? (
            <Link 
              to={`/marketplace/${listing.listing_id}`}
              className="inline-block bg-[#0a0a0a] text-white font-bold py-2.5 px-6 text-xs uppercase tracking-wider hover:bg-[#00d084] hover:text-black transition-colors"
            >
              View Project
            </Link>
          ) : (
            <Link 
              to="/login"
              className="inline-block bg-[#0a0a0a] text-white font-bold py-2.5 px-6 text-xs uppercase tracking-wider hover:bg-[#00d084] hover:text-black transition-colors"
            >
              Sign In to View
            </Link>
          )}
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-full sm:w-[45%] h-[200px] sm:h-full bg-[#f8fafc] relative flex items-center justify-center overflow-hidden">
        {/* Badge (Like 'LATEST') */}
        <div className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-3 py-1.5 flex items-center gap-1 z-10 uppercase tracking-widest">
          <FiCheckCircle size={10} className="text-[#00d084]" /> VERIFIED
        </div>
        
        {imageUrl ? (
          <img src={imageUrl} alt={listing.project_title} className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-[#e2e8f0] flex items-center justify-center">
            <span className="text-black/10 text-7xl font-black select-none pointer-events-none font-['Outfit'] tracking-tighter">CXP</span>
          </div>
        )}
      </div>
    </div>
  );
}
