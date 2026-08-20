import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import * as sellerApi from '../../api/endpoint/Sellerapi';
import LocationMap from '../../components/LocationMap';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { FiThumbsUp, FiShare2, FiClock, FiMapPin, FiArrowLeft, FiTarget, FiInfo, FiActivity } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';

export default function PublicProjectShowcasePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [postsRes, projectRes] = await Promise.all([
          projectPostApi.getProjectPosts(projectId).catch(() => ({ data: { posts: [] } })),
          sellerApi.getPublicProjectById(projectId).catch(() => null),
        ]);
        setPosts(postsRes.data.posts || []);
        setProject(projectRes?.data?.project || null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [projectId]);

  async function handleLike(postId) {
    const { data } = await projectPostApi.likeProjectPost(postId);
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, likes_count: data.likes_count } : p)));
  }

  async function handleShare(post) {
    projectPostApi.shareProjectPost(post.id).catch(console.error);
    
    const shareUrl = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title || 'Project Update',
          text: `Check out this project update on CarbonXchanges!`,
          url: shareUrl,
        });
      } catch (err) {
        if (err.name !== 'AbortError') console.error(err);
      }
    } else {
      navigator.clipboard?.writeText(shareUrl);
      alert('Link copied to clipboard!');
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <div className="flex-grow flex items-center justify-center pt-24 pb-24">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
      <Footer />
    </div>
  );

  const lat = project?.latitude || (posts.length > 0 ? posts[0].latitude : null);
  const lng = project?.longitude || (posts.length > 0 ? posts[0].longitude : null);
  const projTitle = project?.title || (posts.length > 0 ? posts[0].project_title : 'Project Showcase');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow w-full max-w-4xl mx-auto px-4 sm:px-6 pt-28 pb-24">
        
        {/* Header */}
        <div className="mb-8">
          <Link to="/posts" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 mb-6 transition-colors">
            <FiArrowLeft className="mr-2" /> Back to Updates
          </Link>
          <h1 className="text-3xl md:text-4xl text-gray-900 mb-4 uppercase logo-retro tracking-tighter">{projTitle}</h1>
          <div className="flex items-center text-gray-500 text-sm gap-4">
            {lat && lng && (
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-full font-medium">
                <FiMapPin className="text-gray-400" />
                {project?.state_region || posts[0]?.state_region ? `${project?.state_region || posts[0]?.state_region}, ` : ''}{project?.country || posts[0]?.country || 'Location Available'}
              </span>
            )}
            <span className="font-medium bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full">
              {project?.project_type?.replace(/_/g, ' ') || 'Carbon Project'}
            </span>
          </div>
        </div>

        {/* Project Detailed Stats & Description */}
        {project && (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-10">
            {project.project_summary && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FiInfo className="text-emerald-600" /> About this Project
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px]">{project.project_summary}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Total Area</div>
                <div className="text-xl font-black text-gray-900">{project.total_project_area_hectares} <span className="text-sm font-medium text-gray-500">ha</span></div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Est. CO₂ Claimed</div>
                <div className="text-xl font-black text-gray-900">{project.total_co2_claimed} <span className="text-sm font-medium text-gray-500">t</span></div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Duration</div>
                <div className="text-xl font-black text-gray-900">{project.duration_months} <span className="text-sm font-medium text-gray-500">mo</span></div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                <div className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider">Scale</div>
                <div className="text-xl font-black text-gray-900 capitalize text-ellipsis overflow-hidden whitespace-nowrap">{project.project_scale?.replace('-', ' ')}</div>
              </div>
            </div>

            {project.methodology_specific_data && Object.keys(project.methodology_specific_data).length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FiTarget className="text-emerald-600" /> Key Project Metrics
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(project.methodology_specific_data).map(([key, value]) => {
                    const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    if(typeof value === 'object') return null;
                    return (
                      <div key={key} className="inline-flex items-center gap-2 bg-emerald-50/50 border border-emerald-100 text-emerald-800 px-3 py-1.5 rounded-lg text-[13px]">
                        <span className="font-semibold">{cleanKey}:</span>
                        <span className="font-black">{value}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Location Map */}
        {lat && lng && (
          <div className="mb-12 rounded-3xl overflow-hidden shadow-sm border border-gray-100 h-80 bg-white relative">
            <LocationMap markers={[{ lat, lng, label: projTitle }]} />
          </div>
        )}

        {/* Posts Feed Header */}
        <div className="flex items-center gap-3 mb-6">
          <FiActivity className="text-gray-400 text-xl" />
          <h2 className="text-2xl font-black text-gray-900">Project Updates</h2>
        </div>

        {/* Posts Feed */}
        <div className="space-y-8">
          {posts.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl shadow-sm border border-gray-100">
               <h3 className="text-lg font-bold text-gray-900 mb-1">No updates yet</h3>
               <p className="text-gray-500 max-w-sm">
                 This project hasn't posted any updates or milestones yet.
               </p>
             </div>
          ) : posts.map((post) => (
            <article 
              key={post.id} 
              onClick={() => navigate(`/posts/${post.id}`, { state: { post } })}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center text-xl font-bold text-gray-400">
                    {post.seller_avatar ? (
                      <img src={post.seller_avatar} alt={post.seller_name} className="w-full h-full object-cover" />
                    ) : (
                      post.seller_name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-900 text-[15px]">{post.seller_name}</span>
                    <span className="text-xs text-gray-500 mt-0.5 font-medium">Project Developer</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-[11px] sm:text-xs font-medium">
                  <FiClock />
                  {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-black text-2xl text-gray-900 mb-3 leading-tight">{post.title}</h3>
                {post.description && <p className="text-[16px] text-gray-600 mb-4 leading-relaxed">{post.description}</p>}
                {post.story && <p className="text-[15px] text-gray-500 whitespace-pre-wrap leading-relaxed">{post.story}</p>}
                {post.how_it_works && (
                  <div className="mt-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <h4 className="text-sm font-black text-gray-900 mb-2 uppercase tracking-wider">How It Works</h4>
                    <p className="text-[14px] text-gray-600 whitespace-pre-wrap leading-relaxed">{post.how_it_works}</p>
                  </div>
                )}
              </div>

              {((post.images && post.images.length > 0) || (post.videos && post.videos.length > 0)) && (
                <div className={`grid gap-3 mb-6 ${
                  ((post.images?.length || 0) + (post.videos?.length || 0)) > 1 ? 'grid-cols-2' : 'grid-cols-1'
                }`}>
                  {post.images && post.images.map((imgUrl, idx) => (
                    <div key={`img-${idx}`} className="w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative pt-[60%] group">
                      <img 
                        src={imgUrl.startsWith('http') ? imgUrl : `https://gateway.pinata.cloud/ipfs/${imgUrl}`} 
                        alt="Post attachment" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                  {post.videos && post.videos.map((vidUrl, idx) => (
                    <div key={`vid-${idx}`} className="w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm relative pt-[60%]">
                      <video 
                        src={vidUrl.startsWith('http') ? vidUrl : `https://gateway.pinata.cloud/ipfs/${vidUrl}`} 
                        controls 
                        className="absolute inset-0 w-full h-full object-cover bg-black" 
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-5 border-t border-gray-100 flex gap-6 items-center text-gray-500">
                <button 
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-emerald-50 hover:text-emerald-600 transition-colors font-semibold"
                >
                  <FiThumbsUp className="text-lg" />
                  <span className="text-sm">{post.likes_count}</span>
                </button>
                <button 
                  onClick={() => handleShare(post)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-blue-50 hover:text-blue-600 transition-colors font-semibold"
                >
                  <FiShare2 className="text-lg" />
                  <span className="text-sm">Share</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}