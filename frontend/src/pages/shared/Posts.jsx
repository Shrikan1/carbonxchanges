import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import { FiThumbsUp, FiShare2, FiClock } from 'react-icons/fi';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import { formatDistanceToNow } from 'date-fns';

const Posts = () => {
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

  const handleShare = async (postId) => {
    try {
      const res = await projectPostApi.shareProjectPost(postId);
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.id === postId) {
            return { ...post, shares_count: res.data.shares_count };
          }
          return post;
        })
      );
    } catch (err) {
      console.error("Failed to share post", err);
    }
  };

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        
        {/* Posts Feed */}
        <div className="flex flex-col space-y-8">
          {loading ? (
            // Loading skeletons
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-4 sm:p-5 animate-pulse">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-[#222]"></div>
                    <div className="h-4 w-32 bg-[#222] rounded"></div>
                  </div>
                  <div className="h-8 w-16 bg-[#222] rounded mt-1"></div>
                </div>
                <div className="h-4 w-full bg-[#222] rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-[#222] rounded mb-4"></div>
                <div className="w-full h-48 sm:h-64 bg-[#222] rounded-xl mb-4"></div>
                <div className="pt-4 border-t border-[#333] flex gap-8">
                  <div className="h-4 w-12 bg-[#222] rounded"></div>
                  <div className="h-4 w-16 bg-[#222] rounded"></div>
                </div>
              </div>
            ))
          ) : posts.length === 0 ? (
            <div className="text-center text-[#888] mt-20">
              <p className="text-xl">No posts available yet.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-4 sm:p-5">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0 bg-[#222]">
                      {post.seller_avatar ? (
                        <img src={post.seller_avatar} alt={post.seller_name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl font-bold text-[#555]">
                          {post.seller_name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    
                    {/* Author Info & Project Title */}
                    <div className="flex flex-col justify-center">
                      <span className="font-bold text-[15px]">{post.seller_name}</span>
                      <span className="text-xs text-emerald-400 mt-0.5">Project: {post.project_title}</span>
                    </div>
                  </div>
                  
                  {/* Time */}
                  <div className="flex items-center gap-1 text-[#666] text-[11px] sm:text-xs shrink-0 ml-4 mt-1">
                    <FiClock />
                    {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                  </div>
                </div>

                {/* Content text */}
                <div className="mb-4">
                  <h3 className="font-bold text-lg mb-2">{post.title}</h3>
                  {post.description && <p className="text-[16px] text-gray-300 mb-3">{post.description}</p>}
                  {post.story && <p className="text-[15px] text-gray-400 whitespace-pre-wrap">{post.story}</p>}
                </div>

                {/* Media Attachment (First image if exists) */}
                {post.images && post.images.length > 0 && (
                  <div className="w-full rounded-xl overflow-hidden bg-[#222] mb-4 border border-[#333]">
                    <img 
                      src={`https://gateway.pinata.cloud/ipfs/${post.images[0]}`} 
                      alt="Post attachment" 
                      className="w-full h-auto object-cover max-h-[500px]" 
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
                
                {/* Media Attachment (First video if exists and no images) */}
                {(!post.images || post.images.length === 0) && post.videos && post.videos.length > 0 && (
                  <div className="w-full rounded-xl overflow-hidden bg-[#222] mb-4 border border-[#333]">
                    <video 
                      src={`https://gateway.pinata.cloud/ipfs/${post.videos[0]}`} 
                      controls 
                      className="w-full h-auto max-h-[500px]" 
                    />
                  </div>
                )}

                {/* Footer Actions */}
                <div className="mt-4 pt-4 border-t border-[#333] flex gap-8 items-center text-[#888]">
                  <button 
                    onClick={() => handleLike(post.id)}
                    className="flex items-center gap-2 hover:text-emerald-400 transition-colors group"
                  >
                    <FiThumbsUp className="text-lg group-hover:text-emerald-400" />
                    <span className="text-sm font-medium">{post.likes_count}</span>
                  </button>
                  
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-2 hover:text-white transition-colors group"
                  >
                    <FiShare2 className="text-lg group-hover:text-white" />
                    <span className="text-sm font-medium">{post.shares_count}</span>
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Posts;
