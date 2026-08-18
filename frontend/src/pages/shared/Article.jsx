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
          <div role="heading" aria-level="1" className="text-4xl md:text-5xl font-black tracking-tight text-gray-900 mb-4">
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
              <a href={article.url} key={article.id} className="group flex flex-col bg-white border border-gray-200 border-b-[5px] border-b-gray-300 hover:border-b-gray-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                
                {/* Image Section */}
                <div className="w-full aspect-[4/5] sm:aspect-square overflow-hidden bg-gray-100">
                  <img 
                    src={article.cover_image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Content Section */}
                <div className="flex flex-col p-5 sm:p-6 bg-white">
                  
                  {/* Title */}
                  <h2 className="text-[22px] font-medium text-gray-900 tracking-tight leading-snug line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h2>
                  
                  {/* Description */}
                  <p className="text-sm text-gray-500 line-clamp-2 font-normal leading-relaxed">
                    {article.tags?.join(' • ')} — A deep dive into sustainable carbon markets and environmental impact.
                  </p>
                  
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
