import { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiArrowUpRight, FiCalendar, FiClock, FiSearch } from 'react-icons/fi';
import img1 from '../../assets/os-x-mavericks-3840x2160-24079.jpg';
import heroForest from '../../assets/forest-wallpaper-3840x2160-nature-tranquil-6524.jpg';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  const visibleArticles = articles.filter((article) => {
    const content = `${article.webTitle || ''} ${article.fields?.trailText || ''}`.toLowerCase();
    return content.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="bg-[#f8faf6] text-[#14352a] min-h-screen font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow pt-16 md:pt-20 pb-24">
        
        {/* Editorial hero */}
        <section className="border-y border-[#e1e8df] bg-[#fbfcf9] overflow-hidden">
          <div className="max-w-[1440px] mx-auto min-h-[160px] md:min-h-[250px] px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-[60%_40%] items-center">
            <div className="py-6 lg:py-11 relative z-10">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 md:w-10 bg-[#9ebda3]" />
                <span className="text-[9px] md:text-[11px] font-bold uppercase tracking-[0.27em] text-[#6b8575]">Insights &amp; Articles</span>
              </div>
              <h1 className="max-w-[620px] text-2xl sm:text-4xl xl:text-[3.35rem] font-black uppercase leading-[1.05] md:leading-[0.94] tracking-[-0.055em] text-[#123328] wise-font">
                Stories for a<br className="hidden sm:block" /> brighter tomorrow
              </h1>
              <p className="mt-2 md:mt-4 max-w-xl text-[13px] sm:text-[16px] leading-relaxed text-[#63756a]">
                Deep dives into climate tech, Web3 carbon markets, and the future of verifiable sustainability.
              </p>
            </div>
            <div className="hidden lg:block relative self-stretch min-h-[250px]">
              <div className="absolute inset-y-0 right-[-4vw] w-[115%] overflow-hidden rounded-bl-[46%] bg-[#e3eddf]">
                <img src={heroForest} alt="Forest canopy" className="h-full w-full object-cover object-center" />
              </div>
              <p className="absolute right-2 bottom-8 max-w-[115px] rotate-[-8deg] text-[11px] font-bold uppercase leading-relaxed tracking-[0.13em] text-[#5f8d6f]">A cleaner planet together</p>
            </div>
          </div>
        </section>

        <section className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 pt-8 sm:pt-10">
          <div className="flex items-center">
            <label className="relative block w-full xl:max-w-[520px]">
              <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-[#7c8d83]" size={18} />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search articles, topics, or keywords..."
                className="w-full rounded-md border border-[#e1e8df] bg-white py-4 pl-12 pr-5 text-sm text-[#254638] outline-none transition-colors placeholder:text-[#a0aba3] focus:border-[#8cae92]"
              />
            </label>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 mt-7 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="bg-white border border-[#e1e8df] skeleton-glare flex flex-col overflow-hidden shadow-[0_4px_12px_rgba(29,62,43,0.04)]">
                <div className="w-full aspect-[16/10] bg-[#e5ece5]"></div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-3 bg-[#e8eee8] rounded w-1/3"></div>
                  <div className="h-5 bg-[#e8eee8] rounded w-11/12"></div>
                  <div className="h-5 bg-[#e8eee8] rounded w-3/4"></div>
                  <div className="h-3 bg-[#eef2ee] rounded w-full"></div>
                  <div className="h-3 bg-[#eef2ee] rounded w-2/3"></div>
                </div>
              </div>
            ))
          ) : (
            visibleArticles.map((article) => (
              <a href={article.webUrl} target="_blank" rel="noopener noreferrer" key={article.id} className="group flex flex-col bg-white border border-[#e1e8df] overflow-hidden shadow-[0_4px_12px_rgba(29,62,43,0.04)] hover:border-[#b6cdb9] hover:shadow-[0_10px_22px_rgba(29,62,43,0.09)] transition-all duration-300 hover:-translate-y-1">
                
                {/* Image Section */}
                <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#e5ece5] flex-shrink-0">
                  <img 
                    src={article.fields?.thumbnail || fallbackImage} 
                    alt={article.webTitle} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-[#f9fbf7]/95 px-3 py-1 text-[9px] font-bold uppercase tracking-wide text-[#24523b]">{article.sectionName || 'Climate Science'}</span>
                </div>
                
                {/* Content Section */}
                <div className="flex flex-col p-5 bg-white flex-grow">
                  
                  {/* Title */}
                  <h2 
                    className="text-[20px] font-bold text-[#18372b] tracking-[-0.035em] leading-[1.12] line-clamp-3 mb-3 group-hover:text-[#397554] transition-colors"
                    dangerouslySetInnerHTML={{ __html: article.webTitle }}
                  />
                  
                  {/* Description */}
                  {article.fields?.trailText && (
                    <p 
                      className="text-[14px] text-[#718177] line-clamp-3 font-normal leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: article.fields.trailText }}
                    />
                  )}
                  
                  {/* Editorial metadata */}
                  <div className="mt-auto pt-5 flex items-center justify-between gap-3 text-[11px] text-[#77867d] font-medium">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5"><FiCalendar size={13} />{new Date(article.webPublicationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span className="flex items-center gap-1.5"><FiClock size={13} />{Math.max(3, Math.ceil(`${article.webTitle || ''} ${article.fields?.trailText || ''}`.split(' ').length / 45))} min</span>
                    </div>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf4ea] text-[#24523b] transition-colors group-hover:bg-[#dcebd8]"><FiArrowUpRight size={15} /></span>
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
