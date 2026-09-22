import { Link } from 'react-router-dom';
import { FiArrowRight, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';

export default function MarketplaceCard({ listing }) {
  const { isAuthenticated } = useAuthStore();
  const imageUrl = listing.image_url;
  const title = listing.project_title || `Project CXP-${listing.project_id}`;
  const projectType = listing.project_type?.replace(/_/g, ' ') || 'Reforestation';
  const summary = listing.project_summary || 'Verified climate action project creating measurable environmental impact for local communities.';

  return (
    <div className="bg-white text-[#153126] flex flex-col sm:flex-row h-full sm:min-h-[250px] relative group overflow-hidden rounded-md border border-[#e5ebe6] shadow-[0_5px_18px_rgba(25,57,38,0.06)] hover:-translate-y-1 hover:shadow-[0_14px_30px_rgba(25,57,38,0.12)] transition-all duration-300">
      {/* Left Side: Content */}
      <div className="w-full sm:w-[58%] px-5 py-5 flex flex-col justify-between relative bg-white z-10 order-2 sm:order-1">
        <div>
          {/* Project Meta */}
          <div className="flex items-center gap-2 mb-2 subheading">
            <span className="text-[#49a67d] font-bold text-[9px] uppercase tracking-wider">{projectType}</span>
            <span className="text-gray-300 text-[10px]">•</span>
            <span className="text-[#829087] font-bold text-[9px] uppercase tracking-wider flex items-center gap-1"><FiMapPin size={10} /> {listing.country || 'India'}</span>
          </div>

          {/* Huge Title (Like 'PERPS ARE HERE') */}
          <h3 className="text-[23px] font-black leading-[0.94] tracking-[-0.055em] uppercase wise-font mt-2.5 line-clamp-3">
            {title}
          </h3>
          <p className="mt-3 line-clamp-3 max-w-[300px] text-[12px] leading-[1.45] text-[#7a8780]">{summary}</p>
        </div>
        
        <div className="mt-auto pt-4">
          {/* Metrics */}
          <div className="flex items-end gap-5 mb-4 subheading">
            <div className="flex flex-col">
              <span className="text-[#a0aaa3] text-[9px] font-bold uppercase tracking-wider mb-1">Available</span>
              <span className="text-black font-bold text-sm">{Number(listing.amount_available || 0).toLocaleString()} <span className="text-gray-500 font-normal text-[10px]">tCO₂e</span></span>
            </div>
            <div className="flex flex-col">
              <span className="text-[#a0aaa3] text-[9px] font-bold uppercase tracking-wider mb-1">Price/Ton</span>
              <span className="text-[#00d084] font-black text-lg leading-none">₹{Number(listing.price_per_credit || 0).toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          {isAuthenticated ? (
            <Link 
              to={`/marketplace/${listing.listing_id}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#0c3a25] text-white font-bold py-2.5 px-5 text-[11px] hover:bg-[#1b5a39] transition-colors"
            >
              View Project <FiArrowRight size={14} />
            </Link>
          ) : (
            <Link 
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-[#0c3a25] text-white font-bold py-2.5 px-5 text-[11px] hover:bg-[#1b5a39] transition-colors"
            >
              Sign In to View <FiArrowRight size={14} />
            </Link>
          )}
        </div>
      </div>

      {/* Right Side: Image */}
      <div className="w-full sm:w-[42%] h-[190px] sm:h-auto bg-[#dfe9df] relative flex items-center justify-center overflow-hidden order-1 sm:order-2">
        {/* Badge (Like 'LATEST') */}
        <div className="absolute top-3 right-3 rounded bg-[#0c3a25] text-white text-[9px] font-bold px-2.5 py-1.5 flex items-center gap-1 z-10 uppercase tracking-wide">
          <FiCheckCircle size={10} className="text-[#a7e67c]" /> VERIFIED
        </div>
        
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        ) : (
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#b6d7bd,#e7f0e4)] flex items-center justify-center">
            <span className="text-[#49755a]/15 text-7xl font-black select-none pointer-events-none wise-font tracking-tighter">CXP</span>
          </div>
        )}
      </div>
    </div>
  );
}
