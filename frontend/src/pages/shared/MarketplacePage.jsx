// src/pages/shared/MarketplacePage.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as marketplaceApi from '../../api/endpoint/marketplaceApi';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function MarketplacePage() {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadListings() {
      try {
        setIsLoading(true);
        const res = await marketplaceApi.browseMarketplace();
        // Pagination wrapper usually returns data in res.data.data or res.data.results or res.data
        const fetchedListings = res.data.data || res.data.results || res.data || [];
        setListings(fetchedListings);
      } catch (err) {
        console.error("Failed to load marketplace listings", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadListings();
  }, []);

  return (
    <div className="bg-[#0c0c0c] min-h-screen text-white font-sans overflow-x-hidden">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-['JetBrains_Mono'] tracking-tight text-[#bef264]">
            Carbon Credit Marketplace
          </h1>
          <p className="text-[#888] mt-2 text-sm">
            Browse and purchase verified carbon credits to offset your emissions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#bef264]"></div>
          </div>
        ) : listings.length === 0 ? (
          <div className="p-8 text-center text-[#888] bg-[#111] rounded-xl border border-[#222]">
            No active listings found in the marketplace.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div 
                key={listing.id} 
                className="bg-[#111] border border-[#222] p-5 rounded-xl flex flex-col justify-between hover:border-[#bef264]/50 transition-colors"
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {listing.project_title || `Project #${listing.project_id}`}
                  </h3>
                  <div className="space-y-1 mb-4">
                    <p className="text-sm text-[#888]">
                      <span className="text-[#666]">Available:</span> {listing.available_amount} tons
                    </p>
                    <p className="text-sm text-[#888]">
                      <span className="text-[#666]">Price:</span> ${listing.price_per_ton} / ton
                    </p>
                  </div>
                </div>
                
                <Link
                  to={`/projects/${listing.project_id}`}
                  className="w-full py-2 px-4 bg-white text-[#0c0c0c] text-center text-sm font-['JetBrains_Mono'] uppercase font-semibold rounded hover:bg-[#eee] transition-colors"
                >
                  View Project Details
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
      <Footer />
    </div>
  );
}
