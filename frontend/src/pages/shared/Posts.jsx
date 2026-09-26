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
    <div className="bg-gray-50 text-gray-900 h-screen font-sans overflow-hidden flex flex-col pt-16 md:pt-24">
      <Navbar />

      <main className="flex-1 min-h-0 max-w-[520px] mx-auto w-full px-4 sm:px-6 flex flex-col pb-6">
        
        {/* Header Section */}
        <div className="flex flex-row items-center justify-between gap-3 py-5 md:py-6 border-b border-gray-100 shrink-0">
          <div className="flex-1 min-w-0 pr-2">
            <h1 className="text-lg md:text-3xl wise-font font-black uppercase tracking-tight text-gray-900 mb-0.5 md:mb-1 font-['Outfit'] truncate">
              Community Updates
            </h1>
            <p className="text-gray-500 text-[11px] md:text-sm truncate">
              Real-time stories from verified projects.
            </p>
          </div>
          
          <button onClick={() => navigate('/seller/post/new')} className="shrink-0 py-2 md:py-2.5 px-3 md:px-5 bg-[#173d25] hover:bg-[#0f2f1b] text-white text-[10px] md:text-xs uppercase font-bold tracking-wider transition-all rounded-sm shadow-sm flex items-center justify-center gap-1.5">
            <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Post</span>
          </button>
        </div>
          
        {/* Posts Feed */}
        <div className="flex-1 min-h-0 relative mt-6">
            
          {/* Scroll to top button */}
          <button
            onClick={scrollToTop}
            className={`absolute bottom-6 right-0 z-50 flex items-center justify-center bg-white shadow-md rounded-full w-10 h-10 text-gray-400 hover:text-gray-900 transition-all duration-300 ${
              showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
            }`}
            aria-label="Scroll to top"
          >
            <FiArrowUp size={20} />
          </button>

          <div 
            ref={feedRef}
            onScroll={(e) => setShowScrollTop(e.target.scrollTop > 400)}
            className="absolute inset-0 overflow-y-auto [&::-webkit-scrollbar]:hidden" 
            style={{ scrollbarWidth: 'none' }}
          >
            <div className="flex flex-col space-y-6 min-w-0 pb-12">
            {loading ? (
            // Premium Skeleton Loaders
            [...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className="flex flex-col bg-white border border-gray-200 rounded-xl mb-6 shadow-sm w-full mx-auto animate-pulse overflow-hidden"
              >
                {/* Header Skeleton */}
                <div className="flex items-center gap-3 p-4 border-b border-gray-50">
                  <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <div className="h-4 w-32 bg-gray-200 rounded-sm"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded-sm"></div>
                  </div>
                </div>

                {/* Media Skeleton */}
                <div className="w-full aspect-video bg-gray-100"></div>
                
                {/* Content Skeleton */}
                <div className="p-4 flex flex-col">
                  <div className="space-y-2.5 mb-4">
                    <div className="h-5 w-3/4 bg-gray-200 rounded-sm"></div>
                    <div className="h-3 w-full bg-gray-200 rounded-sm"></div>
                    <div className="h-3 w-5/6 bg-gray-200 rounded-sm"></div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-6 mt-2 pt-4 border-t border-gray-50">
                    <div className="h-4 w-16 bg-gray-200 rounded-sm"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded-sm"></div>
                    <div className="h-4 w-20 bg-gray-200 rounded-sm ml-auto"></div>
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
                className="flex flex-col bg-white border border-gray-200 rounded-xl mb-6 shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer overflow-hidden max-w-full w-full mx-auto"
              >
                
                {/* Header Section (User Info) */}
                <div className="flex justify-between items-center p-4 border-b border-gray-50">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-100 flex items-center justify-center text-sm font-black text-gray-400 font-['Outfit'] uppercase shadow-sm">
                      {post.seller_avatar ? (
                        <img src={post.seller_avatar} alt={post.seller_name} className="w-full h-full object-cover" />
                      ) : (
                        post.seller_name?.charAt(0)
                      )}
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-gray-900 text-sm tracking-tight">{post.seller_name}</span>
                      <span className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mt-0.5">
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Media Section (Full Width Image) */}
                {(() => {
                  const media = (post.images?.length > 0) ? { type: 'image', url: post.images[0] } : (post.videos?.length > 0) ? { type: 'video', url: post.videos[0] } : null;
                  if (!media) return null;
                  
                  const totalMediaCount = (post.images?.length || 0) + (post.videos?.length || 0);
                  
                  return (
                    <div className="w-full aspect-video bg-gray-100 relative group overflow-hidden">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Post preview" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      ) : (
                        <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                      )}
                      {media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <svg className="w-12 h-12 text-white/80 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                        </div>
                      )}
                      {totalMediaCount > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[10px] px-2 py-1 font-bold rounded uppercase tracking-widest">
                          + {totalMediaCount - 1} MORE
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Content Section */}
                <div className="p-4 flex flex-col">
                  <div className="mb-4">
                    <ExpandableText text={post.title} className="text-lg md:text-xl font-bold leading-tight text-gray-900 mb-2 font-['Outfit']" />
                    {post.description && <ExpandableText text={post.description} className="text-[13px] text-gray-600 leading-relaxed font-sans" />}
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center gap-6 mt-2 pt-4 border-t border-gray-100">
                    {/* Likes */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                      className={`flex items-center gap-1.5 font-bold transition-colors text-[11px] uppercase tracking-wider ${post.localLiked ? 'text-emerald-700' : 'text-gray-400 hover:text-gray-700'}`}
                    >
                      <img src="/like.png" alt="Like" className={`w-4 h-4 object-contain transition-all ${post.localLiked ? 'brightness-0 saturate-200 hue-rotate-140' : 'opacity-40 grayscale'}`} />
                      <span>{post.likes_count || 0} LIKES</span>
                    </button>

                    {/* Share */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleShare(post); }}
                      className="flex items-center gap-1.5 text-gray-400 font-bold hover:text-gray-700 transition-colors text-[11px] uppercase tracking-wider"
                    >
                      <img src="/send.png" alt="Share" className="w-4 h-4 object-contain opacity-40 grayscale" />
                      <span>SHARE</span>
                    </button>

                    {/* Explore */}
                    <button 
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        if (!isAuthenticated) return navigate('/login');
                        navigate(`/posts/${post.id}`, { state: { post } }); 
                      }}
                      className="flex items-center gap-1 text-emerald-700 font-bold hover:text-emerald-800 transition-colors ml-auto text-[11px] uppercase tracking-widest"
                    >
                      <span>EXPLORE</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Posts;
