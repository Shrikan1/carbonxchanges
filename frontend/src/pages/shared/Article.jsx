import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiBookOpen } from 'react-icons/fi';
import img1 from '../../assets/os-x-mavericks-3840x2160-24079.jpg';
import img2 from '../../assets/pexels-adnan-atasoy-261355608-12644453.jpg';
import img3 from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';
import img4 from '../../assets/18297.jpg';
import img5 from '../../assets/Mangrove-Forest-Coast-2000x1237-1.jpg';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Original high-quality project-related data, adapted for the new UI
  const originalData = [
    {
      id: 1,
      title: "Web3 & The Fight Against Climate Change",
      tags: ["FEATURED", "WEB3", "CLIMATE"],
      cover_image: img1,
      date: "Aug 15, 2026",
      read_time: "14 min read",
      url: "#"
    },
    {
      id: 2,
      title: "The Future of Carbon Markets",
      tags: ["MARKETS", "TRENDS", "EMISSIONS"],
      cover_image: img2,
      date: "Aug 12, 2026",
      read_time: "8 min read",
      url: "#"
    },
    {
      id: 3,
      title: "Blockchain's Role in Reforestation",
      tags: ["BLOCKCHAIN", "REFORESTATION", "TECH"],
      cover_image: img3,
      date: "Aug 05, 2026",
      read_time: "12 min read",
      url: "#"
    },
    {
      id: 4,
      title: "Understanding Renewable Energy Certificates",
      tags: ["EDUCATION", "RENEWABLE", "CERTIFICATES"],
      cover_image: img4,
      date: "Jul 28, 2026",
      read_time: "5 min read",
      url: "#"
    },
    {
      id: 5,
      title: "Ocean Conservation & Blue Carbon",
      tags: ["CONSERVATION", "OCEAN", "BLUE CARBON"],
      cover_image: img5,
      date: "Jul 21, 2026",
      read_time: "10 min read",
      url: "#"
    },
    {
      id: 6,
      title: "Building an Infinite Grid for Eco-Tracking",
      tags: ["DEVELOPER", "FRONT-END", "TUTORIAL"],
      cover_image: img1, // Reusing an image to fill out the 3x2 grid
      date: "Feb 16, 2026",
      read_time: "6 min read",
      url: "#"
    }
  ];

  useEffect(() => {
    // Simulating API fetch
    const fetchArticles = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        setArticles(originalData);
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
          <div role="heading" aria-level="1" className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4 !font-sans !normal-case">
            Insights & Articles
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Deep dives into climate tech, Web3 carbon markets, and the future of verifiable sustainability.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            // Premium Skeleton Loaders
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 animate-pulse">
                <div className="w-full aspect-square bg-gray-200 rounded-2xl mb-5"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4 mt-auto pt-2">
                  <div className="h-5 bg-gray-100 rounded w-16"></div>
                  <div className="h-5 bg-gray-100 rounded w-20"></div>
                </div>
              </div>
            ))
          ) : (
            articles.map((article) => (
              <a href={article.url} key={article.id} className="group flex flex-col bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
                
                {/* Square Cover Image */}
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-5 bg-gray-100 border border-gray-100 relative">
                  <img 
                    src={article.cover_image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                
                <div className="flex flex-col flex-grow px-1">
                  {/* Title */}
                  <h2 className="text-lg font-bold text-gray-900 tracking-tight leading-snug mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                    {article.title}
                  </h2>
                  
                  {/* Tags (Clean Pills) */}
                  <div className="flex flex-wrap gap-2 mb-4 mt-auto pt-2">
                    {article.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="px-2 py-1 rounded bg-gray-100 text-[10px] font-bold text-gray-500 tracking-wider transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  {/* Date & Read Time */}
                  <div className="flex items-center justify-between text-xs font-medium text-gray-400 pt-3 border-t border-gray-100">
                    <span>{article.date}</span>
                    <span>{article.read_time}</span>
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
