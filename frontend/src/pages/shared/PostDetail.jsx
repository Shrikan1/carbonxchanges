import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import { FiArrowLeft, FiClock, FiTag, FiThumbsUp, FiShare2, FiChevronLeft, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import { useAuthStore } from '../../store/useAuthStore';
import * as projectPostApi from '../../api/endpoint/projectPostApi';

const PostDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { postId } = useParams();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  const [post, setPost] = useState(location.state?.post || null);
  const [loading, setLoading] = useState(!post);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const clickCount = React.useRef(0);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await projectPostApi.deleteProjectPost(post.id);
        navigate('/posts', { replace: true });
      } catch (err) { console.error(err); }
    }
  };

  const handleLike = async () => {
    const currentClick = ++clickCount.current;
    
    const wasLikedLocally = post.localLiked || false;
    const newLikedState = !wasLikedLocally;

    // Optimistic UI update instantly
    setPost(p => ({ 
      ...p, 
      localLiked: newLikedState,
      likes_count: Math.max(0, (p.likes_count || 0) + (newLikedState ? 1 : -1)) 
    }));

    try {
      const { data } = await projectPostApi.likeProjectPost(post.id);
      
      // Only sync with backend if no newer clicks happened
      if (currentClick === clickCount.current) {
        setPost(p => ({ 
          ...p, 
          localLiked: data.liked !== undefined ? data.liked : newLikedState,
          likes_count: Math.max(0, data.likes_count) 
        }));
      }
    } catch (err) { 
      console.error(err);
      if (currentClick === clickCount.current) {
        // Revert on failure
        setPost(p => ({ 
          ...p, 
          localLiked: wasLikedLocally,
          likes_count: Math.max(0, (p.likes_count || 0) + (newLikedState ? -1 : 1)) 
        }));
      }
    }
  };

  const handleShare = async () => {
    projectPostApi.shareProjectPost(post.id).catch(() => {});
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post.title, url }); } catch {}
    } else {
      navigator.clipboard?.writeText(url);
      alert('Link copied!');
    }
  };

  useEffect(() => {
    if (!post && postId) {
      setLoading(true);
      projectPostApi.getProjectPost(postId)
        .then(res => setPost(res.data.post))
        .catch(() => navigate('/posts', { replace: true }))
        .finally(() => setLoading(false));
    }
  }, [postId, post, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-grow flex items-center justify-center pt-24">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div>
        </div>
      </div>
    );
  }

  if (!post) return null;

  const allMedia = [
    ...(post.images || []).map(url => ({ type: 'image', url })),
    ...(post.videos || []).map(url => ({ type: 'video', url })),
  ];
  const currentMedia = allMedia[activeMediaIdx];
  const hasMedia = allMedia.length > 0;

  const prevMedia = () => setActiveMediaIdx(i => i > 0 ? i - 1 : allMedia.length - 1);
  const nextMedia = () => setActiveMediaIdx(i => i < allMedia.length - 1 ? i + 1 : 0);

  return (
    <div className="bg-gray-50 text-gray-900 min-h-screen font-sans overflow-x-hidden flex flex-col">
      <Navbar />

      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6">
        <div className={`mx-auto ${hasMedia ? 'max-w-5xl' : 'max-w-2xl'}`}>

          {/* Back */}
          <button onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 shadow-sm transition-all mb-6 px-4 py-2 rounded-full text-[13px] font-semibold group w-fit">
            <FiArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform text-gray-400 group-hover:text-gray-600" />
            Back to Updates
          </button>

          {/* Main split layout */}
          <div className={`grid ${hasMedia ? 'grid-cols-1 lg:grid-cols-5' : 'grid-cols-1'} bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm`}>

            {/* ── LEFT: Media Gallery ──────────────────────── */}
            {hasMedia && (
              <div className="relative bg-gray-100 flex flex-col lg:col-span-2">
                {/* Main viewer */}
                <div className="relative h-[360px] flex items-center justify-center bg-gray-100 overflow-hidden">
                  {currentMedia?.type === 'image' ? (
                    <img src={currentMedia.url} alt={`Media ${activeMediaIdx + 1}`}
                      className="w-full h-full object-contain" />
                  ) : currentMedia?.type === 'video' ? (
                    <video src={currentMedia.url} controls className="w-full h-full object-contain bg-black" />
                  ) : null}

                  {/* Arrows */}
                  {allMedia.length > 1 && (
                    <>
                      <button onClick={prevMedia}
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center transition-colors shadow-sm">
                        <FiChevronLeft size={16} />
                      </button>
                      <button onClick={nextMedia}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-gray-600 flex items-center justify-center transition-colors shadow-sm">
                        <FiChevronRight size={16} />
                      </button>
                    </>
                  )}

                  {/* Counter */}
                  {allMedia.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm text-gray-600 text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                      {activeMediaIdx + 1} / {allMedia.length}
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {allMedia.length > 1 && (
                  <div className="flex gap-1.5 p-2 overflow-x-auto border-t border-gray-200 bg-white scrollbar-hide">
                    {allMedia.map((m, i) => (
                      <button key={i} onClick={() => setActiveMediaIdx(i)}
                        className={`shrink-0 w-12 h-12 rounded-md overflow-hidden border-2 transition-all ${
                          i === activeMediaIdx ? 'border-gray-900 opacity-100' : 'border-transparent opacity-50 hover:opacity-80'
                        }`}>
                        {m.type === 'image'
                          ? <img src={m.url} alt="" className="w-full h-full object-cover" />
                          : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-[10px] text-gray-500 font-medium">VID</div>
                        }
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── RIGHT: Info Panel ───────────────────────── */}
            <div className={`flex flex-col p-6 sm:p-8 ${hasMedia ? 'lg:col-span-3' : ''}`}>

              {/* Author + time */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-400 overflow-hidden shrink-0">
                    {post.seller_avatar
                      ? <img src={post.seller_avatar} alt="" className="w-full h-full object-cover" />
                      : post.seller_name?.charAt(0).toUpperCase()
                    }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{post.seller_name}</p>
                    <Link to={`/projects/${post.project_id}`} className="text-xs text-blue-600 hover:underline font-medium">
                      {post.project_title}
                    </Link>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                  <FiClock size={12} />
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>

              <div className="h-px bg-gray-100 mb-6"></div>

              {/* Title */}
              <h1 className="text-lg sm:text-xl font-bold text-gray-900 tracking-tight leading-snug mb-3" style={{ textTransform: 'none', letterSpacing: '-0.01em' }}>
                {post.title}
              </h1>

              {/* Category */}
              {post.category && (
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    <FiTag size={10} /> {post.category}
                  </span>
                </div>
              )}

              {/* Description */}
              <div className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap flex-grow mb-6" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
                {post.description}
              </div>

              <div className="h-px bg-gray-100 mb-4"></div>

              {/* Actions */}
              <div className="flex items-center gap-4">
                <button onClick={handleLike}
                  className={`flex items-center gap-2 text-[15px] px-5 py-2 rounded-full transition-all font-semibold ${
                    post.localLiked 
                      ? 'text-white bg-gray-900 hover:bg-black' 
                      : 'text-gray-900 bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <img src="/like.png" alt="Like" className={`w-5 h-5 object-contain transition-all ${
                    post.localLiked ? 'brightness-0 invert' : 'opacity-70'
                  }`} />
                  <span>{post.likes_count || 0}</span>
                </button>

                <button onClick={handleShare}
                  className="flex items-center gap-2 text-[15px] text-gray-500 hover:text-gray-700 bg-transparent px-2 py-2 rounded-full transition-all font-semibold">
                  <img src="/send.png" alt="Share" className="w-5 h-5 object-contain opacity-60" />
                  <span>Share</span>
                </button>

                {isAdmin && (
                  <button onClick={handleDelete}
                    className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 bg-gray-50 hover:bg-red-50 border border-gray-200 hover:border-red-200 px-3 py-1.5 rounded-lg transition-all font-medium ml-auto">
                    <FiTrash2 size={14} />
                    <span>Delete</span>
                  </button>
                )}
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default PostDetail;
