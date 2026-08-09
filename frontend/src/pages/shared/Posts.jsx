import React from 'react';
import Navbar from '../../components/layout/Navbar';
import { FiThumbsUp, FiShare2 } from 'react-icons/fi';
import imgPost from '../../assets/jungle-tree-dark-3840x2160-22695.jpg';

const Posts = () => {
  // We'll create an array of posts, even though the mockup shows one, a feed needs multiple.
  // We will keep the content Web3/Carbon related but styled exactly like the screenshot.
  const posts = [
    {
      id: 1,
      author: {
        name: "Eric Van Holtz",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=eric"
      },
      time: "Aug 2nd\n2:02 AM",
      content: "Night owls... Let's build",
      image: imgPost,
      hashtags: ["#openai", "#worklouder"],
      stats: {
        comments: 2,
        likes: 5,
        views: 543
      }
    },
    {
      id: 2,
      author: {
        name: "Sarah Jenkins",
        avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=sarah"
      },
      time: "Aug 1st\n4:15 PM",
      content: "Just deployed our new smart contracts for verifying reforestation efforts. The transparency is incredible. Next up: integrating drone data directly into the ledger.",
      image: imgPost,
      hashtags: ["#web3", "#climateaction", "#solidity"],
      stats: {
        comments: 14,
        likes: 128,
        views: 3021
      }
    }
  ];

  return (
    <div className="bg-[#0c0c0c] text-white min-h-screen font-sans overflow-x-hidden">
      <Navbar />

      <main className="max-w-2xl mx-auto px-4 sm:px-6 pt-32 pb-24">
        
        {/* Posts Feed */}
        <div className="flex flex-col space-y-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-[#1a1a1a] rounded-2xl border border-[#333] p-4 sm:p-5">
              
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg overflow-hidden shrink-0">
                    <img src={post.author.avatar} alt={post.author.name} className="w-full h-full object-cover" />
                  </div>
                  
                  {/* Author Info */}
                  <div className="flex items-center">
                    <span className="font-bold text-[15px]">{post.author.name}</span>
                  </div>
                </div>
                
                {/* Time */}
                <div className="text-right text-[#666] text-[11px] sm:text-xs font-mono leading-snug whitespace-pre-line shrink-0 ml-4 mt-1">
                  {post.time}
                </div>
              </div>

              {/* Content text */}
              <p className="text-[17px] mb-4">
                {post.content}
              </p>

              {/* Image attachment */}
              <div className="w-full rounded-xl overflow-hidden bg-[#222]">
                <img src={post.image} alt="Post attachment" className="w-full h-auto object-cover max-h-[400px]" />
              </div>

              {/* Hashtags */}
              <div className="mt-4 flex gap-3 text-[#666] text-sm">
                {post.hashtags.map(tag => (
                  <span key={tag} className="hover:text-emerald-400 cursor-pointer transition-colors">{tag}</span>
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-4 pt-4 border-t border-[#333] flex gap-8 items-center text-[#666]">
                <button className="flex items-center gap-2 hover:text-emerald-400 transition-colors group">
                  <FiThumbsUp className="text-lg group-hover:text-emerald-400" />
                  <span className="text-sm font-medium">{post.stats.likes}</span>
                </button>
                
                <button className="flex items-center gap-2 hover:text-white transition-colors group">
                  <FiShare2 className="text-lg group-hover:text-white" />
                  <span className="text-sm font-medium">Share</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Posts;
