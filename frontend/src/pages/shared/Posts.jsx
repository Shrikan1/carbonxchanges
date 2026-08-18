import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiThumbsUp, FiShare2, FiClock, FiActivity, FiArrowUp } from 'react-icons/fi';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const feedRef = useRef(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

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
          <div className="lg:w-[350px] shrink-0 h-full overflow-y-auto lg:border-r lg:border-gray-200 lg:pr-10 pb-24 [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
            <div className="pt-2">
              {/* Sidebar content */}
              <div className="mb-10 hidden lg:block">
                <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
                  Community Updates
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Discover the latest developments, milestones, and real-time stories from verified carbon reduction projects globally.
                </p>
              </div>
              
              {/* Mobile Header */}
              <div className="mb-8 block lg:hidden text-center">
                <div role="heading" aria-level="1" className="text-3xl font-bold tracking-tight text-gray-900 mb-2">
                  Community Updates
                </div>
                <p className="text-gray-500 text-[15px] leading-relaxed">
                  Discover the latest developments from verified carbon reduction projects.
                </p>
              </div>

              {/* Professional widget */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
                <h3 className="font-semibold text-gray-900 mb-5 text-[14px]">Global Impact</h3>
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                     <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                       <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                     </div>
                     <div>
                       <div className="text-[13px] text-gray-500 mb-0.5">Active Projects</div>
                       <div className="font-bold text-gray-900 text-lg leading-none">1,204</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <div className="w-11 h-11 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center">
                       <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>
                     </div>
                     <div>
                       <div className="text-[13px] text-gray-500 mb-0.5">CO2 Offset</div>
                       <div className="font-bold text-gray-900 text-lg leading-none">2.4M Tons</div>
                     </div>
                  </div>
                </div>
              </div>
              
              {/* Call to action */}
              <div className="mt-4 hidden lg:block pb-6">
                <button onClick={() => navigate('/seller/post/new')} className="w-full py-3 bg-gray-900 hover:bg-black text-white text-[14px] font-semibold rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
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
              <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 skeleton-glare">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200"></div>
                    <div className="space-y-2">
                      <div className="h-4 w-32 bg-gray-200 rounded"></div>
                      <div className="h-3 w-24 bg-gray-100 rounded"></div>
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-full bg-gray-100 rounded"></div>
                  <div className="h-4 w-5/6 bg-gray-100 rounded"></div>
                </div>
                <div className="w-full h-48 sm:h-72 bg-gray-200 rounded-2xl mb-4"></div>
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
                onClick={() => navigate(`/posts/${post.id}`, { state: { post } })}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 sm:p-5 cursor-pointer max-w-[380px] mx-auto w-full"
              >
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-full overflow-hidden shrink-0 bg-gray-100 shadow-sm border border-gray-200 flex items-center justify-center text-lg font-bold text-gray-400">
                      {post.seller_avatar ? (
                        <img src={post.seller_avatar} alt={post.seller_name} className="w-full h-full object-cover" />
                      ) : (
                        post.seller_name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    {/* Author Info */}
                    <div className="flex flex-col justify-center">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-gray-900 text-[16px] leading-none">{post.seller_name}</span>
                      </div>
                      <span className="text-gray-500 text-[14px] mt-1.5 leading-none">
                        Posted {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content text */}
                <div className="mb-4">
                  <p className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap">{post.title}</p>
                  {post.description && <p className="text-[15px] text-gray-900 leading-relaxed whitespace-pre-wrap mt-2">{post.description}</p>}
                </div>

                {/* Single Media Preview */}
                {(() => {
                  const media = (post.images?.length > 0) ? { type: 'image', url: post.images[0] } : (post.videos?.length > 0) ? { type: 'video', url: post.videos[0] } : null;
                  if (!media) return null;
                  
                  const totalMediaCount = (post.images?.length || 0) + (post.videos?.length || 0);
                  
                  return (
                    <div className="w-full aspect-[4/5] max-h-[400px] bg-gray-100 rounded-[20px] mb-4 overflow-hidden relative group-hover:opacity-95 transition-opacity">
                      {media.type === 'image' ? (
                        <img src={media.url} alt="Post preview" className="w-full h-full object-cover" />
                      ) : (
                        <video src={media.url} className="w-full h-full object-cover" muted playsInline />
                      )}
                      {/* Play icon for video */}
                      {media.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center text-white backdrop-blur-sm">
                            <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                          </div>
                        </div>
                      )}
                      {/* +X more badge */}
                      {totalMediaCount > 1 && (
                        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-full font-medium border border-white/10">
                          + {totalMediaCount - 1} more
                        </div>
                      )}
                    </div>
                  );
                })()}

                {/* Footer Actions */}
                <div className="flex items-center gap-6 mt-4 pt-1">
                  {/* Likes */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                    className={`flex items-center gap-2 font-medium transition-colors cursor-pointer ${post.localLiked ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    <img src="/like.png" alt="Like" className={`w-[18px] h-[18px] object-contain transition-all ${post.localLiked ? 'brightness-0 contrast-100' : 'opacity-60 grayscale'}`} />
                    <span className="text-[14px]">{post.likes_count || 0}</span>
                  </div>

                  {/* Share */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); handleShare(post); }}
                    className="flex items-center gap-2 text-gray-500 font-medium hover:text-gray-700 transition-colors cursor-pointer"
                  >
                    <img src="/send.png" alt="Share" className="w-[18px] h-[18px] object-contain opacity-60 grayscale" />
                    <span className="text-[14px]">Share</span>
                  </div>

                  {/* Explore */}
                  <div 
                    onClick={(e) => { e.stopPropagation(); navigate(`/posts/${post.id}`, { state: { post } }); }}
                    className="flex items-center gap-1.5 text-gray-500 font-medium hover:text-gray-900 transition-colors cursor-pointer ml-auto"
                  >
                    <span className="text-[14px]">Explore</span>
                    <svg className="w-[16px] h-[16px] mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"/></svg>
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
