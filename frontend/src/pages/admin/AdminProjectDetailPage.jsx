import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import * as adminApi from '../../api/endpoint/adminApi';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import AdminHeader from '../../components/layout/AdminHeader';

const InfoItem = ({ label, value, className = "" }) => (
  <div className={`flex flex-col gap-1`}>
    <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
    <span className={`text-sm text-gray-900 font-medium break-words ${className}`}>
      {value === null || value === undefined || value === '' ? (
        <span className="text-gray-400 italic">N/A</span>
      ) : (
        value
      )}
    </span>
  </div>
);

export default function AdminProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const { data } = await adminProjectApi.getProjectDetails(id);
    setProject(data.project);

    // Only needed while the project has no agent yet — skip the extra call otherwise
    if (!data.project.agent_id) {
      try {
        const agentsRes = await adminApi.getAllAgents();
        setAgents(agentsRes.data.data || []);
      } catch (err) {
        if (err.response?.status === 404) setAgents([]);
        else console.error('Failed to load agents', err);
      }
    }
  }

  async function handleApprove() {
    setError(null);
    setActionLoading(true);
    try {
      const { data } = await adminProjectApi.approveProject(id);
      // approveProject's message tells you whether it actually minted or is
      // still pending (e.g. seller has no wallet yet) — surface that directly
      alert(data.message);
      setProject(data.project);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve project');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    if (!confirm('Reject this project? This cannot be undone.')) return;
    setError(null);
    setActionLoading(true);
    try {
      const { data } = await adminProjectApi.rejectProject(id);
      setProject(data.project);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reject project');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleAssignAgent() {
    if (!selectedAgentId) return;
    setError(null);
    setActionLoading(true);
    try {
      const { data } = await adminProjectApi.assignAgent(id, Number(selectedAgentId));
      setProject(data.project);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to assign agent');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleRemoveAgent() {
    setError(null);
    setActionLoading(true);
    try {
      const { data } = await adminProjectApi.removeAgent(id);
      setProject(data.project);
      const agentsRes = await adminApi.getAllAgents();
      setAgents(agentsRes.data.data || []);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.error || 'Failed to remove agent');
      } else {
        setAgents([]);
      }
    } finally {
      setActionLoading(false);
    }
  }

  if (!project) return (
    <div className="admin-theme min-h-screen flex items-center justify-center text-center bg-[#f3f4f6]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-gray-50/50">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">
        <AdminHeader title="Project Details" />

        <div className="max-w-5xl mx-auto space-y-6 mt-4">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 hover:text-gray-900 font-medium flex items-center gap-2 mb-2 transition-colors">
            &larr; Back
          </button>

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2 uppercase logo-retro tracking-tighter">{project.title}</h1>
              <p className="text-sm text-gray-500 flex flex-wrap gap-2 items-center">
                <span>{project.project_type}</span>
                <span className="text-gray-300">•</span>
                <span>{project.project_scale}</span>
                <span className="text-gray-300">•</span>
                <span>Status: <strong className="text-gray-900 uppercase tracking-wide">{project.status}</strong></span>
              </p>
            </div>
            
            {/* Status Badge */}
            <div className={`px-4 py-2 rounded-full text-sm font-semibold capitalize whitespace-nowrap ${
              project.status === 'verified' ? 'bg-blue-100 text-blue-700' :
              project.status === 'approved' ? 'bg-green-100 text-green-700' :
              project.status === 'rejected' ? 'bg-red-100 text-red-700' :
              project.status === 'minted' ? 'bg-purple-100 text-purple-700' :
              'bg-gray-100 text-gray-700'
            }`}>
              {project.status.replace('_', ' ')}
            </div>
          </div>

          {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium">{error}</div>}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Assign / remove agent */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
              <h2 className="font-semibold text-lg text-gray-900 mb-4">Agent Assignment</h2>
              <div className="mt-auto">
                {project.agent_id ? (
                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <p className="text-sm font-medium text-gray-900">Agent ID: {project.agent_id}</p>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleRemoveAgent} disabled={actionLoading}>Remove Agent</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)} className="w-full">
                      <option value="">Select an agent...</option>
                      {(agents || []).map((a) => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
                    </Select>
                    <Button className="w-full bg-gray-900 text-white hover:bg-gray-800" onClick={handleAssignAgent} disabled={!selectedAgentId || actionLoading}>Assign Agent</Button>
                  </div>
                )}
              </div>
            </div>

            {/* Approve / reject */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col h-full">
              <h2 className="font-semibold text-lg text-gray-900 mb-2">Review Decision</h2>
              <p className="text-xs text-gray-500 mb-6 leading-relaxed">
                Approving is only possible once status is "verified". Approval automatically triggers minting using the agent's verified figure.
              </p>
              <div className="flex gap-3 mt-auto">
                <Button 
                  className={`flex-1 ${project.status === 'verified' ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 text-gray-400'}`}
                  onClick={handleApprove} 
                  disabled={project.status !== 'verified' || actionLoading}
                >
                  Approve {project.status === 'verified' ? '(Auto-Mint)' : ''}
                </Button>
                <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50" onClick={handleReject} disabled={actionLoading}>Reject</Button>
              </div>
            </div>
          </div>

          {/* Detailed Project Data Sections */}
          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Full Project Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Information */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-5">General Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoItem label="Project ID" value={project.id} />
                  <InfoItem label="Seller ID" value={project.seller_id} />
                  <InfoItem label="Summary" value={project.project_summary} fullWidth />
                  <InfoItem label="Duration" value={project.duration_years ? `${project.duration_years} years` : null} />
                  <InfoItem label="Crediting Period" value={project.crediting_period_years ? `${project.crediting_period_years} years` : null} />
                  <InfoItem label="Start Date" value={project.project_start_date ? new Date(project.project_start_date).toLocaleDateString() : null} />
                  <InfoItem label="Expected Completion" value={project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString() : null} />
                </div>
              </div>

              {/* Location & Area */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Location & Area</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoItem label="Country" value={project.country} />
                  <InfoItem label="State/Region" value={project.state_region} />
                  <InfoItem label="Coordinates" value={(project.latitude && project.longitude) ? `${project.latitude}, ${project.longitude}` : null} />
                  <InfoItem label="Total Area" value={project.total_project_area_hectares ? `${project.total_project_area_hectares} ha` : null} />
                  <InfoItem label="Eligible Area" value={project.eligible_area_hectares ? `${project.eligible_area_hectares} ha` : null} />
                  <InfoItem label="Set-Aside Conservation" value={project.set_aside_conservation_percent ? `${project.set_aside_conservation_percent}%` : null} />
                </div>
              </div>

              {/* Ecological Data */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Ecological Data</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoItem label="Climate Zone" value={project.climate_zone} />
                  <InfoItem label="Soil Type" value={project.soil_type} />
                  <InfoItem label="Hydrology Status" value={project.hydrology_status} />
                  <InfoItem label="Dominant Species" value={project.dominant_species} />
                  <InfoItem label="Species Type" value={project.species_type} />
                  <InfoItem label="Management Regime" value={project.management_regime} />
                  <InfoItem label="Biodiversity Index" value={project.biodiversity_index} />
                </div>
              </div>

              {/* Carbon Metrics */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Carbon Metrics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoItem label="Above Ground Biomass" value={project.above_ground_biomass} />
                  <InfoItem label="Below Ground Biomass" value={project.below_ground_biomass} />
                  <InfoItem label="Soil Organic Carbon (0-30cm)" value={project.soil_organic_carbon_0_30cm} />
                  <InfoItem label="Soil Organic Carbon (30-100cm)" value={project.soil_organic_carbon_30_100cm} />
                  <InfoItem label="Dead Wood Carbon" value={project.dead_wood_carbon} />
                  <InfoItem label="Litter Carbon" value={project.litter_carbon} />
                  <InfoItem label="Total CO2 Claimed" value={project.total_co2_claimed ? `${project.total_co2_claimed} tCO2e` : null} className="text-green-600 font-bold text-lg" />
                  <InfoItem label="Estimated VERs" value={project.estimated_vers} />
                  <InfoItem label="Buffer Pool" value={project.buffer_pool_percent ? `${project.buffer_pool_percent}%` : null} />
                  <InfoItem label="Uncertainty" value={project.uncertainty_percentage ? `${project.uncertainty_percentage}%` : null} />
                </div>
              </div>

              {/* Methodology & Verification */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Methodology & Verification</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                  <InfoItem label="Methodology Applied" value={project.methodology_applied} />
                  <InfoItem label="GHG Sources Included" value={project.ghg_sources_included} />
                  <InfoItem label="Monitoring Frequency" value={project.monitoring_frequency} />
                  <InfoItem label="Sampling Plots" value={project.sampling_plots} />
                  <InfoItem label="SDG Targets" value={project.sdg_targets} />
                  <InfoItem label="Live Photo CID" value={project.live_verification_photo_ipfs_cid} fullWidth />
                  <InfoItem label="Baseline Scenario" value={project.baseline_scenario} fullWidth />
                  <InfoItem label="Additionality Demonstration" value={project.additionality_demonstration} fullWidth />
                  <InfoItem label="Technologies/Measures" value={project.technologies_measures_description} fullWidth />
                </div>
              </div>

              {/* Ownership & Compliance */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Ownership & Compliance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
                  <InfoItem label="Owner Name" value={project.owner_full_name} />
                  <InfoItem label="Owner ID Type" value={project.owner_id_type} />
                  <InfoItem label="Owner ID Number" value={project.owner_id_number} />
                  <InfoItem label="Land Ownership Type" value={project.land_ownership_type} />
                  <InfoItem label="Land Title Status" value={project.land_title_status} />
                  <InfoItem label="Publicly Funded" value={project.publicly_funded === true ? 'Yes' : (project.publicly_funded === false ? 'No' : null)} />
                  <InfoItem label="Funding Sources" value={project.funding_sources} />
                  <InfoItem label="Responsible Person" value={project.responsible_person} />
                  <InfoItem label="Grievance Mechanism" value={project.grievance_mechanism} fullWidth />
                  <InfoItem label="Stakeholder Consultation" value={project.stakeholder_consultation_summary} fullWidth />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}