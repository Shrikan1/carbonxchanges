import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiThumbsUp, FiShare2, FiClock, FiActivity } from 'react-icons/fi';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Posts = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleLike = async (postId) => {
    try {
      const res = await projectPostApi.likeProjectPost(postId);
      // Update local state to reflect like change immediately
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.id === postId) {
            return { ...post, likes_count: res.data.likes_count };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Failed to like post", err);
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
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow max-w-3xl mx-auto w-full px-4 sm:px-6 pt-24 pb-24">
        
        {/* Page Header */}
        <div className="mb-10 text-center pt-8">
          <div role="heading" aria-level="1" className="text-3xl md:text-4xl font-black tracking-tight text-gray-900 mb-4 flex items-center justify-center gap-3 !font-sans !normal-case">
            <FiActivity className="text-emerald-600" size={28} />
            Community Updates
          </div>
          <p className="text-gray-500 text-base md:text-lg max-w-xl mx-auto">
            Stay up to date with the latest developments, milestones, and stories from verified carbon reduction projects.
          </p>
        </div>
        
        {/* Posts Feed */}
        <div className="flex flex-col space-y-8">
          {loading ? (
            // Premium Skeleton Loaders
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 sm:p-6 animate-pulse">
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
                onClick={() => navigate(`/projects/${post.project_id}`)}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 p-5 sm:p-6 cursor-pointer"
              >
                
                {/* Header */}
                <div className="flex justify-between items-start mb-5">
                  <div className="flex gap-4 items-center">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 shadow-sm border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400">
                      {post.seller_avatar ? (
                        <img src={post.seller_avatar} alt={post.seller_name} className="w-full h-full object-cover" />
                      ) : (
                        post.seller_name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    {/* Author Info & Project Title */}
                    <div className="flex flex-col">
                      <span className="font-bold text-gray-900 text-[15px]">{post.seller_name}</span>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700 max-w-[200px] sm:max-w-xs truncate">
                          {post.project_title}
                        </span>
                        {post.country && (
                          <span className="text-xs text-gray-500 font-medium">
                            • {post.state_region ? `${post.state_region}, ` : ''}{post.country}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Time */}
                  <div className="flex items-center gap-1.5 text-gray-400 text-[11px] sm:text-xs shrink-0 ml-4 font-medium">
                    <FiClock />
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </div>

                {/* Content text */}
                <div className="mb-5">
                  <h3 className="font-bold text-xl text-gray-900 mb-2 leading-tight">{post.title}</h3>
                  {post.description && <p className="text-[16px] text-gray-600 leading-relaxed line-clamp-3">{post.description}</p>}
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-gray-100 flex gap-6 items-center text-gray-500">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleLike(post.id); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors group"
                  >
                    <FiThumbsUp className="text-lg" />
                    <span className="text-sm font-semibold">{post.likes_count}</span>
                  </button>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleShare(post); }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                  >
                    <FiShare2 className="text-lg" />
                    <span className="text-sm font-semibold">Share</span>
                  </button>
                </div>

              </article>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Posts;
