import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiThumbsUp, FiShare2, FiClock, FiActivity, FiArrowUp } from 'react-icons/fi';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const ExpandableText = ({ text, maxLength = 60, className = "" }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  
  if (!text) return null;
  
  const finalClassName = `${className} break-words`;

  if (text.length <= maxLength) {
    return <p className={finalClassName}>{text}</p>;
  }
  
  return (
    <p className={finalClassName}>
      {isExpanded ? text : `${text.substring(0, maxLength).trim()}... `}
      <button 
        onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        className="text-gray-500 hover:text-gray-900 font-semibold transition-colors inline-block"
      >
        {isExpanded ? 'less' : 'more+'}
      </button>
    </p>
  );
};

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { isAuthenticated } = useAuthStore();

  const scrollToTop = () => {
    feedRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await projectPostApi.getAllProjectPosts();
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const clickCounts = React.useRef({});

  const handleLike = async (postId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    clickCounts.current[postId] = (clickCounts.current[postId] || 0) + 1;
    const currentClick = clickCounts.current[postId];
    
    const postToLike = posts.find(p => p.id === postId);
    if (!postToLike) return;
    
    const wasLikedLocally = postToLike.localLiked || false;
    const newLikedState = !wasLikedLocally;

    // Optimistic UI update instantly
    setPosts(currentPosts => 
      currentPosts.map(post => {
        if (post.id === postId) {
          return { 
            ...post, 
            localLiked: newLikedState,
            likes_count: Math.max(0, (post.likes_count || 0) + (newLikedState ? 1 : -1)) 
          };
        }
        return post;
      })
    );

    try {
      const res = await projectPostApi.likeProjectPost(postId);
      
      // Only sync if no newer clicks happened
      if (currentClick === clickCounts.current[postId]) {
        setPosts(currentPosts => 
          currentPosts.map(post => {
            if (post.id === postId) {
              return { 
                ...post, 
                localLiked: res.data.liked !== undefined ? res.data.liked : newLikedState,
                likes_count: Math.max(0, res.data.likes_count) 
              };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error("Failed to like post", err);
      if (currentClick === clickCounts.current[postId]) {
        // Revert on failure
        setPosts(currentPosts => 
          currentPosts.map(post => {
            if (post.id === postId) {
              return { 
                ...post, 
                localLiked: wasLikedLocally,
                likes_count: Math.max(0, (post.likes_count || 0) + (newLikedState ? -1 : 1)) 
              };
            }
            return post;
          })
        );
      }
    }
  };

  const handleShare = async (post) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      // Track share in backend silently
      projectPostApi.shareProjectPost(post.id).catch(console.error);

      // The showcase URL for this specific project
      const shareUrl = `${window.location.origin}/projects/${post.project_id}`;

      if (navigator.share) {
        await navigator.share({
          title: post.title || 'Project Update',
          text: `Check out this update from ${post.seller_name} on CarbonXchanges!`,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      // AbortError is thrown if the user cancels the share dialog, which is fine
      if (err.name !== 'AbortError') {
        console.error("Failed to share post", err);
      }
    }
  };

  return (
    <div className="bg-gray-50 text-gray-900 h-screen font-sans overflow-hidden flex flex-col pt-24">
      <Navbar />

      <main className="flex-1 min-h-0 max-w-[1100px] mx-auto w-full px-4 sm:px-6 flex flex-col">
        
        <div className="flex flex-col lg:flex-row h-full min-h-0 pt-2">
          
          {/* Left Side: Scrollable Sidebar */}
          <div className="lg:w-[350px] shrink-0 h-auto lg:h-full overflow-y-auto lg:border-r lg:border-gray-200 lg:pr-10 pb-4 lg:pb-24 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <div className="pt-2">
              {/* Sidebar content */}
              <div className="mb-10 hidden lg:block">
                <div role="heading" aria-level="1" className="text-3xl md:text-4xl wise-font font-black uppercase tracking-tight text-black mb-3 font-['Outfit']">
                  Community Updates
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Discover the latest developments, milestones, and real-time stories from verified carbon reduction projects globally.
                </p>
              </div>
              
              {/* Mobile Header */}
              <div className="mb-8 block lg:hidden text-center">
                <div role="heading" aria-level="1" className="text-3xl wise-font font-black uppercase tracking-tight text-black mb-2 font-['Outfit']">
                  Community Updates
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Discover the latest developments from verified carbon reduction projects.
                </p>
              </div>

              {/* Global Impact Widget Removed */}
              
              {/* Call to action */}
              <div className="mt-4 hidden lg:block pb-6">
                <button onClick={() => navigate('/seller/post/new')} className="w-full py-3.5 bg-[#bef264] hover:bg-[#a3e635] border-2 border-black text-black text-[14px] uppercase font-black tracking-wider transition-all shadow-[4px_4px_0_0_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_0_#000] flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  Create New Post
                </button>
              </div>

            </div>
          </div>
          
          {/* Right Side: Posts Feed */}
          <div className="flex-1 h-full relative">
            
            {/* Scroll to top button */}
            <button
              onClick={scrollToTop}
              className={`absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all duration-300 ${
                showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
              }`}
              aria-label="Scroll to top"
            >
              <FiArrowUp size={24} />
            </button>

            <div 
              ref={feedRef}
              onScroll={(e) => setShowScrollTop(e.target.scrollTop > 400)}
              className="absolute inset-0 overflow-y-auto lg:pl-10 pb-24 [&::-webkit-scrollbar]:hidden" 
              style={{ scrollbarWidth: 'none' }}
            >
              <div className="flex flex-col space-y-6 min-w-0">
            {loading ? (
            // Premium Skeleton Loaders
            [...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="group flex flex-col md:flex-row gap-6 bg-white border-2 border-black p-5 sm:p-6 mb-6 shadow-[6px_6px_0_0_#e5e7eb] max-w-full w-full mx-auto animate-pulse"
              >
                {/* Media Skeleton */}
                <div className="w-full md:w-[280px] shrink-0 aspect-video md:aspect-square bg-gray-200 border-2 border-gray-300"></div>
                
                {/* Content Skeleton */}
                <div className="flex flex-col flex-grow min-w-0">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 bg-gray-200 border-2 border-gray-300 shrink-0"></div>
                      <div className="flex flex-col gap-2">
                        <div className="h-5 w-40 bg-gray-200 rounded-sm"></div>
                        <div className="h-3 w-24 bg-gray-200 rounded-sm"></div>
                      </div>
                    </div>
                  </div>

                  {/* Content text */}
                  <div className="mb-6 flex-grow space-y-3 mt-2">
                    <div className="h-6 sm:h-8 w-3/4 bg-gray-200 rounded-sm mb-4"></div>
                    <div className="h-4 w-full bg-gray-200 rounded-sm"></div>
                    <div className="h-4 w-11/12 bg-gray-200 rounded-sm"></div>
                    <div className="h-4 w-4/5 bg-gray-200 rounded-sm"></div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-6 mt-auto pt-4 border-t-2 border-gray-100">
                    <div className="h-4 w-20 bg-gray-200 rounded-sm"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded-sm"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded-sm ml-auto"></div>
                  </div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100">
                <FiActivity className="text-gray-400" size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">No updates yet</h3>
              <p className="text-gray-500 max-w-sm">
                There are currently no posts available. Check back later for news and updates from project developers.
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <article 
                key={post.id} 
                onClick={() => {
                  if (!isAuthenticated) return navigate('/login');
                  navigate(`/posts/${post.id}`, { state: { post } });
                }}
                className="group flex flex-col md:flex-row gap-6 bg-white border-2 border-black p-5 sm:p-6 mb-6 shadow-[6px_6px_0_0_#bef264] hover:shadow-[8px_8px_0_0_#bef264] transition-all duration-300 relative cursor-pointer max-w-full w-full mx-auto"
              >
                
                {/* Media Section (Left side on desktop) */}
                {(() => {
                  const media = (post.images?.length > 0) ? { type: 'image', url: post.images[0] } : (post.videos?.length > 0) ? { type: 'video', url: post.videos[0] } : null;
                  if (!media) return null;
                  
                  const totalMediaCount = (post.images?.length || 0) + (post.videos?.length || 0);
                  
                  return (
                    <div className="w-full md:w-[280px] shrink-0 aspect-video md:aspect-square bg-gray-100 border-2 border-black overflow-hidden relative">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Post preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                      )}
                      {media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg className="w-12 h-12 text-[#bef264] fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                      {totalMediaCount > 1 && (
                        <div className="absolute top-3 right-3 bg-black text-white text-[10px] px-2 py-1 font-bold uppercase tracking-widest">
                          + {totalMediaCount - 1} MORE
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Content Section (Right side on desktop) */}
                <div className="flex flex-col flex-grow min-w-0">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3 items-center">
                      <div className="w-12 h-12 rounded-none overflow-hidden shrink-0 bg-gray-100 border-2 border-black flex items-center justify-center text-lg font-black text-gray-400 font-['Outfit'] uppercase">
                        {post.seller_avatar ? (
                          <img src={post.seller_avatar} alt={post.seller_name} className="w-full h-full object-cover" />
                        ) : (
                          post.seller_name?.charAt(0)
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <span className="font-black text-black text-[18px] uppercase tracking-tight leading-none font-['Outfit']">{post.seller_name}</span>
                        <span className="text-gray-500 text-[12px] mt-1 font-bold uppercase tracking-wider subheading">
                          {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content text */}
                  <div className="mb-6 flex-grow">
                    <ExpandableText text={post.title} className="text-[18px] md:text-[22px] font-black leading-tight text-black mb-3 font-['Outfit']" />
                    {post.description && <ExpandableText text={post.description} className="text-[14px] text-gray-700 leading-relaxed font-mono subheading" />}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-6 mt-auto pt-4 border-t-2 border-black/10 subheading">
                    {/* Likes */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className={`flex items-center gap-2 font-bold transition-colors cursor-pointer text-[12px] uppercase tracking-wider ${post.localLiked ? 'text-black' : 'text-gray-400 hover:text-black'}`}
                    >
                      <img src="/like.png" alt="Like" className={`w-[20px] h-[20px] object-contain transition-all ${post.localLiked ? 'brightness-0 contrast-100' : 'opacity-40 grayscale'}`} />
                      <span>{post.likes_count || 0} LIKES</span>
                    </div>

                    {/* Share */}
                    <div 
                      onClick={(e) => { e.stopPropagation(); handleShare(post); }}
                      className="flex items-center gap-2 text-gray-400 font-bold hover:text-black transition-colors cursor-pointer text-[12px] uppercase tracking-wider"
                    >
                      <img src="/send.png" alt="Share" className="w-[20px] h-[20px] object-contain opacity-40 grayscale" />
                      <span>SHARE</span>
                    </div>

                    {/* Explore */}
                    <div 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (!isAuthenticated) return navigate('/login');
                        navigate(`/posts/${post.id}`, { state: { post } }); 
                      }}
                      className="flex items-center gap-1.5 text-black font-black hover:text-[#00d084] transition-colors cursor-pointer ml-auto text-[14px] uppercase tracking-widest font-['Outfit']"
                    >
                      <span>EXPLORE</span>
                      <svg className="w-[18px] h-[18px] mb-0.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
            </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Posts;
