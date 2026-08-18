// src/pages/shared/MarketplacePage.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiFilter, FiArrowRight, FiTrendingUp, FiActivity, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'motion/react';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    project_type: '',
    country: 'India', // Requested default/only option
    min_price: '',
    max_price: ''
  });

  const loadListings = useCallback(async (currentFilters = filters) => {
    try {
      setIsLoading(true);
      
      // Clean up empty filters to avoid sending unnecessary params
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
  }, []); // dependencies correctly omitted for standard effect

  useEffect(() => {
    loadListings();
  }, [loadListings]);

  const handleApplyFilters = () => {
    loadListings(filters);
  };

  const handleClearFilters = () => {
    const emptyFilters = { project_type: '', country: 'India', min_price: '', max_price: '' };
    setFilters(emptyFilters);
    loadListings(emptyFilters);
  };
  
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Basic client-side filtering for UX demonstration
  const filteredListings = listings.filter(l => 
    (l.project_title || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Generate a consistent but dynamic gradient based on string/id
  const getGradient = (id) => {
    const colors = [
      'from-blue-400 to-indigo-500',
      'from-emerald-400 to-teal-500',
      'from-orange-400 to-rose-500',
      'from-purple-400 to-pink-500',
      'from-cyan-400 to-blue-500',
    ];
    const index = (id?.toString().charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="bg-gray-50 min-h-screen text-gray-900 font-sans overflow-x-hidden flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 uppercase">
                Carbon Credit <br className="hidden md:block" /> Marketplace
              </h1>
              <p className="text-gray-500 text-lg">
                Discover, verify, and purchase high-quality carbon credits to offset your corporate emissions and achieve net-zero targets.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-2 rounded-full shadow-sm border border-gray-100">
            <div className="relative w-full sm:max-w-md">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <FiSearch size={18} />
              </div>
              <input
                type="text"
                placeholder="Search projects, regions, or methodologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-sm text-gray-900 placeholder-gray-400 outline-none rounded-full"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto px-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-colors border ${showFilters ? 'bg-gray-900 text-white border-gray-900 shadow-md' : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200'}`}
              >
                <FiFilter size={16} /> Filters
              </button>
              <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-full bg-gray-900 hover:bg-black text-white text-sm font-medium transition-colors shadow-md">
                Sort: Newest
              </button>
            </div>
          </div>

          {/* Expandable Filter Drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white p-3 sm:p-4 rounded-2xl shadow-sm border border-gray-200 flex flex-col sm:flex-row items-end gap-3 sm:gap-4 mt-2">
                  
                  {/* Project Type */}
                  <div className="flex flex-col gap-1.5 flex-1 w-full">
                    <label className="text-xs font-semibold text-gray-600 ml-1 uppercase tracking-wider">Project Type</label>
                    <Select 
                      name="project_type" 
                      value={filters.project_type} 
                      onChange={handleFilterChange}
                    >
                      <option value="">All Types</option>
                      <option value="reforestation">Reforestation</option>
                      <option value="renewable_energy">Renewable Energy</option>
                      <option value="direct_air_capture">Direct Air Capture</option>
                      <option value="blue_carbon">Blue Carbon</option>
                    </Select>
                  </div>

                  {/* Country - Removed from UI per user request, hardcoded to India in state */}

                  {/* Price Range */}
                  <div className="flex flex-col gap-1.5 flex-1 w-full">
                    <label className="text-xs font-semibold text-gray-600 ml-1 uppercase tracking-wider">Min Price ($)</label>
                    <Input 
                      type="number" 
                      name="min_price" 
                      placeholder="e.g. 10" 
                      value={filters.min_price} 
                      onChange={handleFilterChange} 
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1 w-full">
                    <label className="text-xs font-semibold text-gray-600 ml-1 uppercase tracking-wider">Max Price ($)</label>
                    <Input 
                      type="number" 
                      name="max_price" 
                      placeholder="e.g. 50" 
                      value={filters.max_price} 
                      onChange={handleFilterChange} 
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 shrink-0 w-full sm:w-auto mt-2 sm:mt-0">
                    <Button variant="outline" className="h-[42px] flex-1 sm:flex-none" onClick={handleClearFilters}>
                      Clear
                    </Button>
                    <Button className="h-[42px] flex-1 sm:flex-none" onClick={handleApplyFilters}>
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Listings Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 skeleton-glare">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FiSearch className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No listings found</h3>
              <p className="text-gray-500 max-w-sm">
                {searchQuery ? "We couldn't find any projects matching your search." : "There are currently no active listings in the marketplace."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredListings.map((listing) => (
                <Link
                  key={listing.id}
                  to={`/projects/${listing.project_id}`}
                  className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col h-full hover:-translate-y-1"
                >
                  {/* Dynamic Gradient Image Placeholder */}
                  <div className={`h-48 w-full bg-gradient-to-br ${getGradient(listing.project_id || listing.id)} relative p-4 flex flex-col justify-between`}>
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold uppercase tracking-wider border border-white/20 shadow-sm">
                        Verified
                      </span>
                    </div>
                  </div>
                  
                  {/* Card Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-900 mb-4 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                      {listing.project_title || `Carbon Project #${listing.project_id}`}
                    </h3>
                    
                    <div className="mt-auto space-y-4">
                      <div className="flex items-center justify-between py-3 border-y border-gray-100">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Available</span>
                          <span className="text-gray-900 font-semibold">{listing.available_amount.toLocaleString()} <span className="text-gray-500 font-normal">tons</span></span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">Price</span>
                          <span className="text-gray-900 font-bold text-lg">${listing.price_per_ton.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        View Details <FiArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
