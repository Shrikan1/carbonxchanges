import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import * as adminApi from '../../api/endpoint/adminApi';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import AdminHeader from '../../components/layout/AdminHeader';
import LocationMap from '../../components/LocationMap';
import GoogleMapModal from '../../components/GoogleMapModal';
import DocumentEmbed from '../../components/ui/DocumentEmbed';
import ProjectStepper from '../../components/ProjectStepper';
import { FiExternalLink, FiChevronLeft, FiAlertTriangle } from 'react-icons/fi';
import { TYPE_TO_STEP3 } from '../../components/seller/projectFormConfig';

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

const SectionHeader = ({ title, sectionKey, project }) => {
  if (!project) return <h3 className="text-lg font-bold text-gray-900 mb-5">{title}</h3>;
  const isChecked = project.agent_review_progress?.[sectionKey];
  return (
    <div className="flex items-center justify-between mb-5">
      <h3 className="text-lg font-bold text-gray-900">{title}</h3>
      {isChecked !== undefined && (
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${isChecked ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
          {isChecked ? '✅ REVIEWED' : '⏳ PENDING'}
        </span>
      )}
    </div>
  );
};

const renderKycDoc = (project, docType, label, url, dbPath) => {
  if (!project) return null;
  if (!url && !dbPath) return null;
  const st = project.kyc_docs_status?.[docType] || { status: 'pending', reason: null };
  const isBroken = dbPath && !url;
  
  const headerRight = (
    <div className="flex gap-2 items-center">
      {st.status === 'approved' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-200">APPROVED</span>}
      {st.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-yellow-200">PENDING</span>}
      {st.status === 'rejected' && (
        <div className="flex items-center gap-2">
          <span className="bg-white/90 text-red-700 text-[10px] px-2 py-1 rounded shadow-sm max-w-[120px] truncate border border-red-100" title={st.reason}>{st.reason}</span>
          <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-red-200" title={st.reason}>REJECTED</span>
        </div>
      )}
    </div>
  );

  return (
    <div key={docType} className="w-full">
      {isBroken ? (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-[400px] flex flex-col">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
            {headerRight}
          </div>
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center">
            <FiAlertTriangle size={48} className="mb-4 text-red-400" />
            <p className="font-medium text-gray-700">Image Failed to Load</p>
            <p className="text-xs mt-2 max-w-xs">The file path exists in the database, but the image is missing from storage.</p>
          </div>
        </div>
      ) : (
        <DocumentEmbed url={url} title={label} headerRight={headerRight} />
      )}
    </div>
  );
};

export default function AdminProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const [documents, setDocuments] = useState([]);
  const [verification, setVerification] = useState(null);

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const { data } = await adminProjectApi.getProjectDetails(id);
    setProject(data.project);
    setDocuments(data.documents || []);
    setVerification(data.verification || null);

    // Always load agents so we can display the assigned agent's name/email,
    // and so they're ready if the admin wants to assign a different agent.
    try {
      const agentsRes = await adminApi.getAllAgents();
      setAgents(agentsRes.data.data || []);
    } catch (err) {
      if (err.response?.status === 404) setAgents([]);
      else console.error('Failed to load agents', err);
    }
  }

  // Find the assigned agent object if one exists
  const assignedAgent = agents.find((a) => a.id === project?.agent_id);

  async function handleApprove() {
    setError(null);
    setActionLoading(true);
    try {
      const { data } = await adminProjectApi.approveProject(id);
      // approveProject's message tells you whether it actually minted or is
      // still pending (e.g. seller has no wallet yet) — surface that directly
      alert(data.message);
      await load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve project');
    } finally {
      setActionLoading(false);
    }
  }

  async function handleReject() {
    setError(null);
    setActionLoading(true);
    setShowRejectConfirm(false);
    try {
      await adminProjectApi.rejectProject(id);
      await load();
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
      await adminProjectApi.assignAgent(id, Number(selectedAgentId));
      await load();
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
      await adminProjectApi.removeAgent(id);
      await load();
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

  const isActionable = !['rejected', 'approved', 'minted'].includes(project.status);

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-gray-50/50">
      <div className="w-full max-w-[1400px] px-4 md:px-8 py-6">
        <AdminHeader title="Project Details" />

        <div className="max-w-5xl mx-auto space-y-6 mt-4 relative">
          <button 
            onClick={() => navigate(-1)} 
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors w-fit mb-4"
          >
            <div className="w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm flex items-center justify-center group-hover:border-gray-300 group-hover:bg-gray-50 transition-all">
              <FiChevronLeft size={18} strokeWidth={2.5} />
            </div>
            <span className="text-sm font-semibold tracking-wide">Back</span>
          </button>

          <ProjectStepper status={project.status} />

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
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{assignedAgent ? assignedAgent.name : `Agent ID: ${project.agent_id}`}</p>
                      {assignedAgent && <p className="text-xs text-gray-500 mt-0.5">{assignedAgent.email}</p>}
                    </div>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleRemoveAgent} disabled={!isActionable || actionLoading}>Remove Agent</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Select value={selectedAgentId} onChange={(e) => setSelectedAgentId(e.target.value)} className="w-full" disabled={!isActionable}>
                      <option value="">Select an agent...</option>
                      {(agents || []).map((a) => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
                    </Select>
                    <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-300" onClick={handleAssignAgent} disabled={!isActionable || !selectedAgentId || actionLoading}>Assign Agent</Button>
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
                <Button 
                  variant="outline" 
                  className={`flex-1 ${!isActionable ? 'border-gray-200 text-gray-400 bg-gray-50' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                  onClick={() => setShowRejectConfirm(true)} 
                  disabled={!isActionable || actionLoading}
                >
                  {project.status === 'rejected' ? 'Rejected' : 'Reject'}
                </Button>
              </div>
            </div>
          </div>

          {/* Detailed Project Data Sections */}
          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Full Project Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Information */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <SectionHeader title="General Information" sectionKey="general" project={project} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
                  <InfoItem label="Project ID" value={project.id} />
                  <InfoItem label="Seller ID" value={project.seller_id} />
                  <InfoItem label="Seller Name" value={project.seller_name} />
                  <InfoItem label="Seller Email" value={project.seller_email} />
                  <InfoItem label="Seller Phone" value={project.seller_phone} />
                  <InfoItem label="Seller Address" value={project.seller_address} fullWidth />
                  <InfoItem label="Summary" value={project.project_summary} fullWidth />
                  <InfoItem label="Duration" value={project.duration_months ? `${project.duration_months} months` : null} />
                  <InfoItem label="Crediting Period" value={project.crediting_period_months ? `${project.crediting_period_months} months` : null} />
                  <InfoItem label="Start Date" value={project.project_start_date ? new Date(project.project_start_date).toLocaleDateString() : null} />
                  <InfoItem label="Expected Completion" value={project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString() : null} />
                </div>
              </div>

              {/* Location & Area */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <SectionHeader title="Location & Area" sectionKey="location" project={project} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-5">
                  <InfoItem label="Country" value={project.country} />
                  <InfoItem label="State/Region" value={project.state_region} />
                  <InfoItem label="Coordinates" value={(project.latitude && project.longitude) ? `${Number(project.latitude).toFixed(6)}, ${Number(project.longitude).toFixed(6)}` : null} />
                  <InfoItem label="Total Area" value={project.total_project_area_hectares ? `${project.total_project_area_hectares} ha` : null} />
                  <InfoItem label="Eligible Area" value={project.eligible_area_hectares ? `${project.eligible_area_hectares} ha` : null} />
                  <InfoItem label="Set-Aside Conservation" value={project.set_aside_conservation_percent !== null && project.set_aside_conservation_percent !== undefined ? `${project.set_aside_conservation_percent}%` : null} />
                </div>

                {/* Embedded Map */}
                {project.latitude && project.longitude && (
                  <div className="rounded-2xl overflow-hidden border border-gray-100 mt-2">
                    <div className="h-56">
                      <LocationMap
                        markers={[{ lat: Number(project.latitude), lng: Number(project.longitude), label: project.title }]}
                        zoom={13}
                        height="100%"
                      />
                    </div>
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Coordinates:</span> {project.latitude}, {project.longitude}
                      </span>
                      <button
                        onClick={() => setShowMapModal(true)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                      >
                        View in Google Maps <FiExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Type-Specific Data */}
              {(() => {
                const stepConfig = TYPE_TO_STEP3[project.project_type] || TYPE_TO_STEP3.other;
                let specData = {};
                try {
                  specData = typeof project.methodology_specific_data === 'string' 
                    ? JSON.parse(project.methodology_specific_data) 
                    : (project.methodology_specific_data || {});
                } catch (e) {
                  console.error('Failed to parse methodology_specific_data', e);
                }
                                 
                return (
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                    <SectionHeader title={stepConfig.title} sectionKey="specific" project={project} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-4">
                      {stepConfig.fields.map(field => (
                        <InfoItem 
                          key={field.name}
                          label={field.label} 
                          value={
                            field.type === 'checkbox' 
                              ? (specData[field.name] ? 'Yes' : 'No') 
                              : specData[field.name]
                          } 
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Methodology & Verification */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <SectionHeader title="Methodology & Verification" sectionKey="methodology" project={project} />
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
                <SectionHeader title="Ownership & Compliance" sectionKey="ownership" project={project} />
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

              {/* Project Documents & Evidence */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
                <h3 className="text-lg font-bold text-gray-900 mb-5">Documents & Evidence</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderKycDoc(project, 'aadhaar', 'Owner ID (KYC)', project.aadhaar_doc_signed_url, project.aadhaar_doc_path)}
                  {renderKycDoc(project, 'land_deed', 'Land Deed', project.land_deed_signed_url, project.land_deed_path)}
                  {renderKycDoc(project, 'live_photo', 'Live Photo (KYC)', project.live_verification_photo_signed_url, project.live_verification_photo_path)}
                  {documents.map((doc) => {
                    const headerRight = (
                      <div className="flex gap-2 items-center">
                        {doc.status === 'approved' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-200">APPROVED</span>}
                        {doc.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-yellow-200">PENDING</span>}
                        {doc.status === 'rejected' && (
                          <div className="flex items-center gap-2">
                            <span className="bg-white/90 text-red-700 text-[10px] px-2 py-1 rounded shadow-sm max-w-[120px] truncate border border-red-100" title={doc.rejection_reason}>{doc.rejection_reason}</span>
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-red-200" title={doc.rejection_reason}>REJECTED</span>
                          </div>
                        )}
                      </div>
                    );

                    return (
                      <div key={doc.id} className="w-full">
                        <DocumentEmbed 
                          url={`https://gateway.pinata.cloud/ipfs/${doc.ipfs_cid}`} 
                          title={doc.doc_type.replace(/_/g, ' ').toUpperCase()} 
                          headerRight={headerRight}
                        />
                      </div>
                    );
                  })}
                </div>

                {!project.aadhaar_doc_signed_url && !project.land_deed_signed_url && !project.live_verification_photo_signed_url && documents.length === 0 && (
                  <span className="text-sm text-gray-400 italic">No documents uploaded.</span>
                )}
              </div>
            </div>

            {/* Agent Verification Report Section */}
            {(verification?.initial_report || verification?.completion_report || project.verification_pdf_ipfs_cid) && (
              <div className="bg-white rounded-3xl p-8 lg:p-10 shadow-sm border border-gray-100 mt-8">
                <SectionHeader 
                  title="Agent Verification Report" 
                  icon={
                    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  } 
                />

                <div className="space-y-8 mt-6">
                  {verification?.initial_report && (
                    <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <h4 className="text-md font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Initial Site Verification</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem label="Date Submitted" value={new Date(verification.initial_report.submitted_at).toLocaleDateString()} />
                        <InfoItem label="Agent Notes" value={verification.initial_report.notes || 'N/A'} />
                        <InfoItem label="GPS Coordinates" value={`${verification.initial_report.gps_lat}, ${verification.initial_report.gps_lng}`} />
                        {verification.initial_report.photo_signed_url && (
                          <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Field Photo</span>
                            <a href={verification.initial_report.photo_signed_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
                              View Image
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {verification?.completion_report && (
                    <div className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100">
                      <h4 className="text-md font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Completion Verification</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <InfoItem label="Date Submitted" value={new Date(verification.completion_report.submitted_at).toLocaleDateString()} />
                        <InfoItem label="Agent Notes" value={verification.completion_report.notes || 'N/A'} />
                        <InfoItem label="Verified CO2 Reduction" value={`${verification.completion_report.verified_co2_amount} Tons`} />
                        <InfoItem label="GPS Coordinates" value={`${verification.completion_report.gps_lat}, ${verification.completion_report.gps_lng}`} />
                        {verification.completion_report.photo_signed_url && (
                          <div>
                            <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">Field Photo</span>
                            <a href={verification.completion_report.photo_signed_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm font-medium flex items-center gap-1">
                              View Image
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {project.verification_pdf_ipfs_cid && (
                    <div className="mt-4 flex items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100 gap-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-gray-900">Final Verification Report (PDF)</h4>
                        <p className="text-xs text-gray-500">Immutable record pinned to IPFS.</p>
                      </div>
                      <a 
                        href={`https://gateway.pinata.cloud/ipfs/${project.verification_pdf_ipfs_cid}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center gap-2"
                      >
                        Download PDF
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {showMapModal && project.latitude && project.longitude && (
        <GoogleMapModal
          lat={Number(project.latitude)}
          lng={Number(project.longitude)}
          label={project.title}
          onClose={() => setShowMapModal(false)}
        />
      )}

      {/* Reject Confirmation Modal */}
      {showRejectConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-gray-100 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Project?</h3>
            <p className="text-sm text-gray-500 mb-8 leading-relaxed">
              This action cannot be undone. The project will be permanently marked as rejected and the assigned agent will be removed.
            </p>
            <div className="flex w-full gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowRejectConfirm(false)} disabled={actionLoading}>Cancel</Button>
              <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleReject} disabled={actionLoading}>Yes, Reject</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}