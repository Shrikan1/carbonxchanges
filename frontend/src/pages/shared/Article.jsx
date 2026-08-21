import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiBookOpen, FiCheck } from 'react-icons/fi';
import img1 from '../../assets/os-x-mavericks-3840x2160-24079.jpg';
import img2 from '../../assets/pexels-adnan-atasoy-261355608-12644453.jpg';
import img3 from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import img4 from '../../assets/18297.jpg';
import img5 from '../../assets/Mangrove-Forest-Coast-2000x1237-1.jpg';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const fallbackImage = img1;

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      try {
        const apiKey = import.meta.env.VITE_ARTICAL_API;
        if (!apiKey) {
          console.error("VITE_ARTICAL_API is not defined in .env");
          return;
        }

        const url = 
          `https://content.guardianapis.com/search` +
          `?q=carbon%20credits` +
          `&section=environment` +
          `&order-by=newest` +
          `&show-fields=thumbnail,trailText` +
          `&api-key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.response && data.response.results) {
          setArticles(data.response.results);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 pt-24 pb-24">
        
        {/* Clean Header */}
        <div className="mb-12 text-center pt-8">
          <div role="heading" aria-level="1" className="text-4xl md:text-5xl wise-font font-black uppercase tracking-tight text-black mb-4 font-['Outfit']">
            Insights & Articles
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Deep dives into climate tech, Web3 carbon markets, and the future of verifiable sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 border-b-[5px] border-b-gray-300 rounded-3xl skeleton-glare flex flex-col overflow-hidden shadow-sm">
                <div className="w-full aspect-[4/5] sm:aspect-square bg-gray-200"></div>
                <div className="p-5 sm:p-6 flex flex-col">
                  <div className="h-7 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            articles.map((article) => (
              <a href={article.webUrl} target="_blank" rel="noopener noreferrer" key={article.id} className="group flex flex-col bg-white border border-gray-200 border-b-[5px] border-b-gray-300 hover:border-b-gray-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                
                {/* Image Section */}
                <div className="w-full aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-100 flex-shrink-0">
                  <img 
                    src={article.fields?.thumbnail || fallbackImage} 
                    alt={article.webTitle} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex flex-col p-5 sm:p-6 bg-white flex-grow">
                  
                  {/* Title */}
                  <h2 
                    className="text-[22px] font-medium text-gray-900 tracking-tight leading-snug line-clamp-3 mb-2 group-hover:text-emerald-600 transition-colors"
                    dangerouslySetInnerHTML={{ __html: article.webTitle }}
                  />
                  
                  {/* Description */}
                  {article.fields?.trailText && (
                    <p 
                      className="text-sm text-gray-500 line-clamp-3 font-normal leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: article.fields.trailText }}
                    />
                  )}
                  
                  {/* Date */}
                  <div className="mt-auto pt-4 flex items-center text-xs text-gray-400 font-medium uppercase tracking-wider">
                    <span>{new Date(article.webPublicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Article;
