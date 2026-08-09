import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
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
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Compact Retro Title */}
        <h1 className="logo-retro text-4xl md:text-6xl lg:text-[72px] mb-12 text-white uppercase tracking-tight" style={{ WebkitTextFillColor: 'white', background: 'none' }}>
          ARTICLES
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {loading ? (
            // Loading skeletons
            [...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="w-full aspect-[4/3] bg-[#1a1a1a] rounded-3xl mb-6"></div>
                <div className="h-8 bg-[#1a1a1a] rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-[#1a1a1a] rounded w-1/2 mb-4"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-6 bg-[#1a1a1a] rounded-full w-16"></div>
                  <div className="h-6 bg-[#1a1a1a] rounded-full w-20"></div>
                </div>
              </div>
            ))
          ) : (
            articles.map((article) => (
              <a href={article.url} key={article.id} className="group block cursor-pointer">
                
                {/* Rounded Cover Image */}
                <div className="w-full aspect-[4/3] rounded-[1.5rem] overflow-hidden mb-4 bg-[#1a1a1a]">
                  <img 
                    src={article.cover_image} 
                    alt={article.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                
                {/* Title - Forced to sans-serif to avoid global Sekuya heading font */}
                <h2 className="font-sans text-lg md:text-xl font-semibold tracking-tight leading-snug mb-3 transition-colors group-hover:text-emerald-400 normal-case">
                  {article.title}
                </h2>
                
                {/* Tags (Outlined Pills) */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag, index) => (
                    <span 
                      key={index} 
                      className="px-4 py-1.5 rounded-full border border-[#333] text-[10px] md:text-xs text-[#888] uppercase tracking-wider font-mono transition-colors group-hover:border-emerald-500/30 group-hover:text-[#aaa]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Date & Read Time */}
                <div className="text-xs md:text-sm text-[#666] font-mono">
                  {article.date} — {article.read_time}
                </div>
                
              </a>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Article;
