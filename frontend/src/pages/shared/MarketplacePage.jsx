import { useEffect, useState, useCallback } from 'react';
import { FiSearch, FiFilter, FiActivity } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import MarketplaceCard from '../../components/marketplace/MarketplaceCard';
import { Select } from '../../components/ui/Select';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    project_type: '',
    country: 'India',
    min_price: '',
    max_price: ''
  });

  const loadListings = useCallback(async (currentFilters = filters) => {
    try {
      setIsLoading(true);

      const params = {};
      Object.keys(currentFilters).forEach(key => {
        if (currentFilters[key] !== '') {
          params[key] = currentFilters[key];
        }
      });

      const res = await marketplaceApi.browseMarketplace(params);
      const fetchedListings = res.data.data || res.data.results || res.data || [];
      setListings(fetchedListings);
    } catch (err) {
      console.error("Failed to load marketplace listings", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleApplyFilters = () => loadListings(filters);
  const handleClearFilters = () => {
    const empty = { project_type: '', country: 'India', min_price: '', max_price: '' };
    setFilters(empty);
    loadListings(empty);
  };

  const handleFilterChange = (e) => {
    setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const filteredListings = listings.filter(l =>
    (l.project_title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-900 font-sans flex flex-col" style={{ backgroundColor: 'var(--color-brand)' }}>
      <Navbar />

      <main className="flex-grow pt-28 pb-24">
        <div className="w-full max-w-[1400px] mx-auto px-4 md:px-8 space-y-10">

          {/* Marketplace Header */}
          <div className="relative rounded-none shadow-md border border-gray-200/50 mb-4 bg-white flex flex-col justify-center px-6 py-10 md:px-12 md:py-12 overflow-hidden min-h-[240px]">
            <div className="relative z-10 max-w-xl md:max-w-2xl">
              <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-3 uppercase tracking-tighter wise-font drop-shadow-sm">
                Carbon Credit Marketplace
              </h1>
              <p className="text-gray-800 text-base md:text-lg font-medium max-w-xl leading-snug">
                Discover, verify, and purchase high-quality carbon credits to offset your corporate emissions.
              </p>
            </div>
            
            {/* Background floating globe */}
            <div className="absolute right-[-20%] md:right-[0%] lg:right-[10%] top-1/2 -translate-y-1/2 z-0 animate-float pointer-events-none opacity-60 md:opacity-100">
              <img
                src="/backgrounds/marketplace_ball-removebg-preview.png"
                alt="Marketplace Globe"
                className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] lg:w-[550px] lg:h-[550px] object-contain drop-shadow-2xl"
              />
            </div>
          </div>

          {/* Discovery Toolbar */}
          <div className="flex flex-col sm:flex-row gap-4 items-center bg-white p-3 rounded-none shadow-sm border border-gray-200">
            <div className="relative w-full flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search verified projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-transparent border-none focus:ring-0 text-base text-gray-900 placeholder-gray-400 outline-none"
              />
            </div>

            <div className="w-px h-8 bg-gray-200 hidden sm:block"></div>

            <div className="flex gap-2 w-full sm:w-auto px-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-none text-sm font-bold transition-all ${showFilters
                  ? 'bg-gray-900 text-white shadow-md'
                  : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                  }`}
              >
                <FiFilter size={16} /> Filters
              </button>
              <Select className="flex-1 sm:flex-none w-full sm:w-[180px] h-[46px] rounded-none bg-gray-50 border border-gray-200 text-gray-700 text-sm font-bold focus:outline-none focus:border-gray-300">
                <option value="newest">Sort: Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </Select>
            </div>
          </div>

          {/* Expandable Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-6 rounded-none shadow-sm border border-gray-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Project Type</label>
                    <Select
                      name="project_type"
                      value={filters.project_type}
                      onChange={(e) => handleFilterChange({ target: { name: 'project_type', value: e.target.value } })}
                      className="w-full h-[46px] bg-gray-50 border border-gray-200 rounded-none text-sm font-semibold focus:outline-none focus:border-gray-300"
                    >
                      <option value="">All Types</option>
                      <option value="reforestation">Reforestation</option>
                      <option value="renewable_energy">Renewable Energy</option>
                      <option value="direct_air_capture">Direct Air Capture</option>
                      <option value="blue_carbon">Blue Carbon</option>
                    </Select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Min Price (₹)</label>
                    <input
                      type="number" name="min_price" placeholder="0"
                      value={filters.min_price} onChange={handleFilterChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gray-300"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Max Price (₹)</label>
                    <input
                      type="number" name="max_price" placeholder="1000"
                      value={filters.max_price} onChange={handleFilterChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-none px-4 py-3 text-sm focus:outline-none focus:border-gray-300"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button onClick={handleClearFilters} className="flex-1 py-3 text-sm font-bold text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">Clear</button>
                    <button onClick={handleApplyFilters} className="flex-1 py-3 text-sm font-bold text-white bg-gray-900 rounded-xl hover:bg-black shadow-sm transition-colors">Apply</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Project Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} 
                  className="bg-white flex flex-col sm:flex-row h-full sm:min-h-[250px] relative overflow-hidden rounded-md border border-[#e5ebe6] shadow-[0_5px_18px_rgba(25,57,38,0.06)] animate-pulse"
                >
                  {/* Left Side: Content Skeleton */}
                  <div className="w-full sm:w-[58%] px-5 py-5 flex flex-col justify-between relative bg-white z-10 order-2 sm:order-1">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-2 bg-[#e8eeea] w-20 rounded"></div>
                        <span className="text-gray-200 text-[10px]">•</span>
                        <div className="h-2 bg-[#e8eeea] w-16 rounded"></div>
                      </div>
                      
                      {/* Title */}
                      <div className="space-y-2 mb-4">
                        <div className="h-6 bg-[#e8eeea] w-full rounded-sm"></div>
                        <div className="h-6 bg-[#e8eeea] w-4/5 rounded-sm"></div>
                        <div className="h-2.5 bg-[#eef2ef] w-full rounded"></div>
                      </div>
                    </div>
                    
                    <div className="mt-auto pt-5">
                      {/* Metrics */}
                      <div className="flex items-end gap-5 mb-4">
                        <div className="flex flex-col gap-2">
                          <div className="h-2 bg-[#e8eeea] w-16 rounded"></div>
                          <div className="h-4 bg-[#e8eeea] w-20 rounded"></div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <div className="h-2 bg-[#e8eeea] w-16 rounded"></div>
                          <div className="h-4 bg-[#e8eeea] w-24 rounded"></div>
                        </div>
                      </div>
                      
                      {/* Button */}
                      <div className="h-[38px] bg-[#dce9df] w-32 rounded-full"></div>
                    </div>
                  </div>

                  {/* Right Side: Image Skeleton */}
                  <div className="w-full sm:w-[42%] h-[190px] sm:h-auto bg-[#dfe9df] relative flex items-center justify-center order-1 sm:order-2">
                    <div className="absolute top-3 right-3 h-6 w-20 rounded bg-[#cbdccc]"></div>
                    <div className="w-16 h-16 bg-[#cbdccc] rounded-full flex items-center justify-center">
                      <FiActivity className="text-[#b1c8b5]" size={24} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 px-4 text-center bg-white border border-gray-200">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6 border border-gray-100">
                <FiActivity className="text-gray-300" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No verified projects found</h3>
              <p className="text-gray-500 max-w-md">
                {searchQuery ? "We couldn't find any projects matching your search criteria." : "There are currently no active listings in the marketplace. Check back later as new projects are verified."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredListings.map(listing => (
                <MarketplaceCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
