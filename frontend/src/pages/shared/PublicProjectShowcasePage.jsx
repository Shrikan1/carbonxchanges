import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import * as projectPostApi from '../../api/endpoint/projectPostApi';
import * as sellerApi from '../../api/endpoint/Sellerapi';
import LocationMap from '../../components/LocationMap';
import Navbar from '../../components/layout/Navbar';
import SellerLayout from '../../components/layout/SellerLayout';
import AgentLayout from '../../components/layout/AgentLayout';
import { useAuthStore } from '../../store/useAuthStore';
import { FiThumbsUp, FiShare2, FiClock, FiMapPin, FiArrowLeft, FiTarget, FiInfo, FiActivity } from 'react-icons/fi';
import { formatDistanceToNow } from 'date-fns';
import ProjectStepper from '../../components/ProjectStepper';

export default function PublicProjectShowcasePage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const isDashboardLayout = user?.is_seller || user?.role === 'agent';
  const LayoutWrapper = user?.is_seller ? SellerLayout : (user?.role === 'agent' ? AgentLayout : ({children}) => <>{children}</>);

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
    </div>
  );

  const lat = project?.latitude || (posts.length > 0 ? posts[0].latitude : null);
  const lng = project?.longitude || (posts.length > 0 ? posts[0].longitude : null);
  const projTitle = project?.title || (posts.length > 0 ? posts[0].project_title : 'Project Showcase');

  return (
    <LayoutWrapper title={isDashboardLayout ? "Project Showcase" : undefined} subtitle={isDashboardLayout ? "Detailed view of the project" : undefined}>
    <div className={`min-h-screen bg-white ${isDashboardLayout ? '' : 'flex flex-col'}`}>
      {!isDashboardLayout && <Navbar />}
      
      <main className={`flex-1 ${isDashboardLayout ? 'py-8' : 'pt-24 pb-16'}`}>
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl text-gray-900 mb-4 uppercase font-mono font-black tracking-tight border-b-[2px] border-[#0c0c0c] pb-4">{projTitle}</h1>
          <div className="flex items-center text-gray-500 text-sm gap-4">
            {lat && lng && (
              <span className="flex items-center gap-1.5 bg-[#c2ed6d] px-3 py-1.5 rounded-sm font-bold border-[2px] border-[#0c0c0c] text-[11px] uppercase tracking-wider text-[#0c0c0c]">
                <FiMapPin className="text-[#0c0c0c]" />
                {project?.state_region || posts[0]?.state_region ? `${project?.state_region || posts[0]?.state_region}, ` : ''}{project?.country || posts[0]?.country || 'Location Available'}
              </span>
            )}
            <span className="font-bold bg-white text-[#0c0c0c] border-[2px] border-[#0c0c0c] px-3 py-1.5 rounded-sm text-[11px] uppercase tracking-wider">
              {project?.project_type?.replace(/_/g, ' ') || 'Carbon Project'}
            </span>
          </div>
        </div>

        {project?.status && (
          <div className="mb-10">
            <ProjectStepper status={project.status} />
          </div>
        )}

        {/* Project Detailed Stats & Description */}
        {project && (
          <div className="bg-white rounded-sm border-[2px] border-[#0c0c0c] p-6 sm:p-8 mb-10 space-y-8">

            {/* About */}
            {project.project_summary && (
              <div>
                <h3 className="text-lg font-black font-mono uppercase tracking-tight text-[#0c0c0c] mb-3 flex items-center gap-2">
                  <FiInfo className="text-[#c2ed6d] stroke-[3]" /> About this Project
                </h3>
                <p className="text-gray-600 leading-relaxed text-[15px] whitespace-pre-line">{project.project_summary}</p>
              </div>
            )}

            {/* Key Stats */}
            <div>
              <h4 className="text-sm font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-3">Key Stats</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Area', value: project.total_project_area_hectares, unit: 'ha' },
                  { label: 'Est. CO₂ Claimed', value: project.total_co2_claimed, unit: 't' },
                  { label: 'Duration', value: project.duration_months, unit: 'mo' },
                  { label: 'Est. VERs', value: project.estimated_vers ? Number(project.estimated_vers).toLocaleString() : null, unit: '' },
                  { label: 'Crediting Period', value: project.crediting_period_months, unit: 'mo' },
                  { label: 'Project Area (eligible)', value: project.eligible_area_hectares, unit: 'ha' },
                  { label: 'Conservation Set-Aside', value: project.set_aside_conservation_percent, unit: '%' },
                  { label: 'Scale', value: project.project_scale?.replace('-', ' '), unit: '' },
                ].filter(s => s.value != null && s.value !== '').map(({ label, value, unit }) => (
                  <div key={label} className="bg-gray-50 rounded-sm p-4 border-[2px] border-[#0c0c0c]">
                    <div className="text-[11px] text-gray-500 font-bold mb-1 uppercase tracking-wider font-mono">{label}</div>
                    <div className="text-lg font-black text-gray-900 truncate font-mono">
                      {value} {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Land & Environment */}
            {(project.climate_zone || project.soil_type || project.hydrology_status || project.land_title_status) && (
              <div className="pt-6 border-t-[2px] border-[#0c0c0c]">
                <h4 className="text-sm font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-3">Land & Environment</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Climate Zone', value: project.climate_zone },
                    { label: 'Soil Type', value: project.soil_type },
                    { label: 'Hydrology', value: project.hydrology_status },
                    { label: 'Land Title', value: project.land_title_status },
                    { label: 'Land Ownership', value: project.land_ownership_type },
                    { label: 'Publicly Funded', value: project.publicly_funded === true ? 'Yes' : project.publicly_funded === false ? 'No' : null },
                  ].filter(i => i.value != null).map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline */}
            {(project.project_start_date || project.expected_completion_date || project.monitoring_frequency) && (
              <div className="pt-6 border-t-[2px] border-[#0c0c0c]">
                <h4 className="text-sm font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-3">Timeline</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Start Date', value: project.project_start_date ? new Date(project.project_start_date).toLocaleDateString() : null },
                    { label: 'Expected Completion', value: project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString() : null },
                    { label: 'Monitoring Frequency', value: project.monitoring_frequency },
                  ].filter(i => i.value != null).map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mb-1">{label}</p>
                      <p className="text-sm font-semibold text-gray-800">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Methodology & Carbon Accounting */}
            {(project.methodology_applied || project.baseline_scenario || project.additionality_demonstration || project.technologies_measures_description || project.sdg_targets || project.ghg_sources_included) && (
              <div className="pt-6 border-t-[2px] border-[#0c0c0c]">
                <h4 className="text-sm font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-3">Methodology & Carbon Accounting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Methodology Applied', value: project.methodology_applied },
                    { label: 'GHG Sources Included', value: project.ghg_sources_included },
                    { label: 'SDG Targets', value: project.sdg_targets },
                    { label: 'Baseline Scenario', value: project.baseline_scenario },
                    { label: 'Additionality Demonstration', value: project.additionality_demonstration },
                    { label: 'Technologies & Measures', value: project.technologies_measures_description },
                  ].filter(i => i.value != null && i.value !== '').map(({ label, value }) => (
                    <div key={label} className={label === 'Baseline Scenario' || label === 'Additionality Demonstration' || label === 'Technologies & Measures' ? 'md:col-span-2' : ''}>
                      <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider mb-1 font-mono">{label}</p>
                      <p className="text-sm text-gray-800 leading-relaxed font-mono">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Type-Specific Metrics */}
            {project.methodology_specific_data && Object.keys(project.methodology_specific_data).length > 0 && (
              <div className="pt-6 border-t-[2px] border-[#0c0c0c]">
                <h4 className="text-sm font-bold font-mono text-[#0c0c0c] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <FiTarget className="text-[#c2ed6d] stroke-[3]" /> Key Project Metrics
                </h4>
                <div className="flex flex-wrap gap-3">
                  {Object.entries(project.methodology_specific_data).map(([key, value]) => {
                    const cleanKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    if(typeof value === 'object') return null;
                    return (
                      <div key={key} className="inline-flex items-center gap-2 bg-[#c2ed6d] border-[2px] border-[#0c0c0c] text-[#0c0c0c] px-3 py-1.5 rounded-sm text-[13px] font-mono">
                        <span className="font-bold">{cleanKey}:</span>
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
          <div className="mb-12 rounded-sm overflow-hidden border-[2px] border-[#0c0c0c] h-80 bg-white relative">
            <LocationMap markers={[{ lat, lng, label: projTitle }]} />
          </div>
        )}
        </div>
      </main>
    </div>
    </LayoutWrapper>
  );
}