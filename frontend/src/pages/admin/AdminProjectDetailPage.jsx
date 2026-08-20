import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as adminProjectApi from "../../api/endpoint/adminProjectApi";
import * as adminApi from "../../api/endpoint/adminApi";
import AdminLayout from "../../components/layout/AdminLayout";
import ProjectStepper from "../../components/ProjectStepper";
import LocationMap from "../../components/LocationMap";
import GoogleMapModal from "../../components/GoogleMapModal";
import {
  FiChevronLeft, FiAlertTriangle, FiCheckCircle, FiUserCheck,
  FiFileText, FiMapPin, FiActivity, FiUsers, FiCalendar,
  FiShield, FiGlobe, FiClipboard, FiExternalLink, FiChevronDown,
  FiChevronUp, FiInfo, FiHash, FiCpu, FiMaximize2
} from "react-icons/fi";

/* helpers */
const InfoItem = ({ label, value, wide = false, mono = false }) => (
  <div className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}>
    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</span>
    <span className={`text-sm font-medium text-gray-900 break-words leading-snug ${mono ? "font-mono text-xs" : ""}`}>
      {value != null && value !== "" && value !== ", "
        ? value
        : <span className="text-gray-300 italic">—</span>}
    </span>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className="text-gray-400" size={18} />
    <h2 className="text-base font-bold text-gray-900 tracking-tight">{title}</h2>
  </div>
);

const Badge = ({ children, color }) => {
  const map = {
    blue:   "bg-blue-50 text-blue-700 border-blue-200",
    green:  "bg-emerald-50 text-emerald-700 border-emerald-200",
    red:    "bg-red-50 text-red-700 border-red-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    gray:   "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${map[color] || map.gray}`}>
      {children}
    </span>
  );
};

const statusColor = (s) => {
  const m = { verified: "blue", approved: "green", rejected: "red", minted: "indigo", pending: "orange", assigned: "yellow", in_progress: "yellow", draft: "gray" };
  return m[s] || "gray";
};

const DocCard = ({ url, label, status }) => {
  if (!url) return null;
  const isPdf = url.includes(".pdf") || url.includes("pdf");
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
        {status && <Badge color={status === "approved" ? "green" : status === "rejected" ? "red" : "yellow"}>{status}</Badge>}
      </div>
      <div className="flex-1 bg-gray-100 relative" style={{ minHeight: 220 }}>
        {isPdf ? (
          <iframe src={url} className="absolute inset-0 w-full h-full border-0" title={label} />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
            <img src={url} alt={label} className="max-w-full max-h-full object-contain rounded shadow-sm" />
          </div>
        )}
      </div>
      <a href={url} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 transition-colors border-t border-gray-200">
        <FiExternalLink size={12} /> Open in new tab
      </a>
    </div>
  );
};

const CollapsibleSection = ({ title, icon: Icon, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="text-gray-400" size={18} />
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
        </div>
        {open ? <FiChevronUp size={16} className="text-gray-400" /> : <FiChevronDown size={16} className="text-gray-400" />}
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </div>
  );
};

const VerificationReportCard = ({ report, label }) => {
  if (!report) return (
    <div className="bg-gray-50 rounded-xl border border-dashed border-gray-200 p-6 flex flex-col items-center justify-center gap-2 text-center">
      <FiClipboard size={24} className="text-gray-300" />
      <p className="text-sm text-gray-400 font-medium">{label} not yet submitted</p>
    </div>
  );
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 bg-white flex items-center justify-between">
        <h4 className="font-bold text-gray-900 text-sm">{label}</h4>
        <span className="text-[10px] text-gray-500">{new Date(report.submitted_at).toLocaleString()}</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-4">
        <InfoItem label="GPS Latitude" value={report.gps_lat} mono />
        <InfoItem label="GPS Longitude" value={report.gps_lng} mono />
        {report.verified_co2_amount && (
          <InfoItem label="Verified CO2 (tonnes)" value={report.verified_co2_amount?.toLocaleString()} />
        )}
        <InfoItem label="Report Type" value={report.report_type} />
        {report.notes && <InfoItem label="Agent Notes" value={report.notes} wide />}
      </div>
      {(report.photo_signed_url || report.photo_url) && (
        <div className="border-t border-gray-200">
          <div className="p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">Field Photo</p>
            <img
              src={report.photo_signed_url || report.photo_url}
              alt="Verification photo"
              className="w-full max-h-48 object-cover rounded-lg border border-gray-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/* main page */
export default function AdminProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [agents, setAgents] = useState([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [verification, setVerification] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    try {
      const { data } = await adminProjectApi.getProjectDetails(id);
      setProject(data.project);
      setDocuments(data.documents || []);
      setVerification(data.verification || null);
      const agentsRes = await adminApi.getAllAgents();
      setAgents(agentsRes.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }

  const assignedAgent = agents.find((a) => a.id === project?.agent_id);

  async function handleApprove() {
    setError(null); setActionLoading(true);
    try {
      const { data } = await adminProjectApi.approveProject(id);
      alert(data.message);
      await load();
    } catch (err) { setError(err.response?.data?.error || "Failed to approve"); }
    finally { setActionLoading(false); }
  }

  async function handleReject() {
    setError(null); setActionLoading(true); setShowRejectConfirm(false);
    try {
      await adminProjectApi.rejectProject(id);
      await load();
    } catch (err) { setError(err.response?.data?.error || "Failed to reject"); }
    finally { setActionLoading(false); }
  }

  async function handleAssignAgent() {
    if (!selectedAgentId) return;
    setError(null); setActionLoading(true);
    try {
      await adminProjectApi.assignAgent(id, Number(selectedAgentId));
      await load();
    } catch (err) { setError(err.response?.data?.error || "Failed to assign"); }
    finally { setActionLoading(false); }
  }

  async function handleRemoveAgent() {
    setError(null); setActionLoading(true);
    try {
      await adminProjectApi.removeAgent(id);
      await load();
    } catch (err) { setError(err.response?.data?.error || "Failed to remove agent"); }
    finally { setActionLoading(false); }
  }

  if (!project) return (
    <AdminLayout title="Loading Project...">
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </AdminLayout>
  );

  const isActionable = !["rejected", "approved", "minted"].includes(project.status);
  const msd = project.methodology_specific_data || {};

  return (
    <AdminLayout
      title="Project Details"
      subtitle={`Manage verification and lifecycle for Project CXP-${project.id}`}
    >
      <div className="p-6 lg:p-8 w-full max-w-[1200px] mx-auto space-y-5">

        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
          >
            <FiChevronLeft size={16} /> Back to Projects
          </button>
          <Badge color={statusColor(project.status)}>{project.status.replace(/_/g, " ")}</Badge>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
            <FiAlertTriangle /> {error}
          </div>
        )}

        {/* Hero Header Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                Project CXP-{project.id}
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight">
                {project.title}
              </h1>
              {project.project_summary && (
                <p className="text-sm text-gray-500 mt-3 leading-relaxed max-w-2xl">
                  {project.project_summary}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <Badge color={statusColor(project.status)}>{project.status.replace(/_/g, " ")}</Badge>
              <span className="text-[10px] text-gray-400 capitalize">{project.project_scale} scale</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-5 border-t border-gray-100">
            <InfoItem label="Project Type" value={project.project_type?.replace(/_/g, " ")} />
            <InfoItem label="Scale" value={project.project_scale} />
            <InfoItem label="Location" value={[project.city, project.state_region, project.country].filter(Boolean).join(", ")} />
            <InfoItem label="Seller" value={project.seller_name} />
            <InfoItem label="Est. CO2 Claimed" value={project.total_co2_claimed ? `${Number(project.total_co2_claimed).toLocaleString()} t` : null} />
            <InfoItem label="Est. VERs" value={project.estimated_vers ? Number(project.estimated_vers).toLocaleString() : null} />
          </div>
        </div>

        {/* Timeline Stepper */}
        <ProjectStepper status={project.status} />

        {/* Agent Assignment + Verification Decision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Agent Assignment */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <SectionHeader icon={FiUserCheck} title="Agent Assignment" />
            <div className="flex-1 flex flex-col justify-end">
              {project.agent_id ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {assignedAgent ? assignedAgent.name : `Agent ID: ${project.agent_id}`}
                      </p>
                      {assignedAgent && <p className="text-xs text-gray-500 mt-0.5">{assignedAgent.email}</p>}
                    </div>
                    <Badge color="blue">Assigned</Badge>
                  </div>
                  <button
                    onClick={handleRemoveAgent}
                    disabled={!isActionable || actionLoading}
                    className="w-full py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Remove Assignment
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <select
                    value={selectedAgentId}
                    onChange={(e) => setSelectedAgentId(e.target.value)}
                    disabled={!isActionable}
                    className="w-full bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-3 focus:outline-none focus:border-emerald-500 transition-colors"
                  >
                    <option value="">Select an agent for field verification...</option>
                    {(agents || []).map((a) => (
                      <option key={a.id} value={a.id}>{a.name} ({a.email})</option>
                    ))}
                  </select>
                  <button
                    onClick={handleAssignAgent}
                    disabled={!isActionable || !selectedAgentId || actionLoading}
                    className="w-full py-3 text-sm font-bold text-white bg-gray-900 hover:bg-black rounded-xl transition-colors disabled:bg-gray-300"
                  >
                    Assign Agent
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Verification Decision */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <SectionHeader icon={FiCheckCircle} title="Verification Decision" />
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">
              Final approval requires the project to be in the <strong className="text-gray-700">Verified</strong> state.
              Approving will stage it for credit minting.
            </p>
            <div className="flex-1 flex items-end gap-3">
              {showRejectConfirm ? (
                <div className="w-full bg-red-50 p-4 rounded-xl border border-red-100 flex flex-col gap-3">
                  <p className="text-sm font-semibold text-red-900">Are you sure you want to reject this project?</p>
                  <div className="flex gap-2">
                    <button onClick={handleReject} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-bold py-2 rounded-lg transition-colors">Confirm Reject</button>
                    <button onClick={() => setShowRejectConfirm(false)} className="flex-1 bg-white text-gray-600 text-sm font-bold py-2 rounded-lg border border-gray-200 transition-colors">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleApprove}
                    disabled={project.status !== "verified" || actionLoading}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${
                      project.status === "verified"
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    Approve Project
                  </button>
                  <button
                    onClick={() => setShowRejectConfirm(true)}
                    disabled={!isActionable || actionLoading}
                    className="flex-1 py-3 text-sm font-bold bg-white border border-gray-200 text-gray-700 hover:text-red-600 hover:border-red-200 hover:bg-red-50 rounded-xl transition-colors disabled:opacity-50"
                  >
                    Reject Project
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Seller & Owner Information */}
        <CollapsibleSection title="Seller & Owner Information" icon={FiUsers}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoItem label="Seller Name" value={project.seller_name} />
            <InfoItem label="Seller Email" value={project.seller_email} />
            <InfoItem label="Seller Phone" value={project.seller_phone} />
            <InfoItem label="Seller Address" value={project.seller_address} />
            <InfoItem label="Owner Full Name" value={project.owner_full_name} />
            <InfoItem label="Owner ID Type" value={project.owner_id_type} />
            <InfoItem label="Owner ID Number" value={project.owner_id_number} />
            <InfoItem label="Land Ownership Type" value={project.land_ownership_type} />
            <InfoItem label="Responsible Person" value={project.responsible_person} />
          </div>
        </CollapsibleSection>

        {/* Timeline & Scale */}
        <CollapsibleSection title="Timeline & Scale" icon={FiCalendar}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoItem label="Project Start Date" value={project.project_start_date ? new Date(project.project_start_date).toLocaleDateString() : null} />
            <InfoItem label="Duration" value={project.duration_months ? `${project.duration_months} months` : null} />
            <InfoItem label="Crediting Period" value={project.crediting_period_months ? `${project.crediting_period_months} months` : null} />
            <InfoItem label="Expected Completion" value={project.expected_completion_date ? new Date(project.expected_completion_date).toLocaleDateString() : null} />
            <InfoItem label="Total CO2 Claimed" value={project.total_co2_claimed ? `${Number(project.total_co2_claimed).toLocaleString()} tonnes` : null} />
            <InfoItem label="Estimated VERs" value={project.estimated_vers ? Number(project.estimated_vers).toLocaleString() : null} />
            <InfoItem label="Monitoring Frequency" value={project.monitoring_frequency} />
            <InfoItem label="Publicly Funded" value={project.publicly_funded ? "Yes" : project.publicly_funded === false ? "No" : null} />
            <InfoItem label="Funding Sources" value={project.funding_sources} wide />
          </div>
        </CollapsibleSection>

        {/* Location & Land Details */}
        <CollapsibleSection title="Location & Land Details" icon={FiMapPin}>
          {/* Inline Map */}
          {project.latitude && project.longitude ? (
            <div className="mb-5">
              <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 300 }}>
                <LocationMap
                  markers={[{
                    lat: Number(project.latitude),
                    lng: Number(project.longitude),
                    label: `<strong>${project.title}</strong><br/>${[project.city, project.state_region, project.country].filter(Boolean).join(", ")}`
                  }]}
                  zoom={11}
                  height="300px"
                />
                {/* Fullscreen button overlay */}
                <button
                  onClick={() => setShowMapModal(true)}
                  className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm border border-gray-200 shadow-sm px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-white transition-colors"
                >
                  <FiMaximize2 size={12} /> Full Map
                </button>
              </div>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-[10px] text-gray-400 font-mono">{project.latitude}, {project.longitude}</span>
                <a
                  href={`https://maps.google.com/?q=${project.latitude},${project.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:underline"
                >
                  <FiGlobe size={10} /> Open in Google Maps
                </a>
              </div>
            </div>
          ) : (
            <div className="mb-5 rounded-xl border border-dashed border-gray-200 bg-gray-50 h-20 flex items-center justify-center">
              <span className="text-xs text-gray-400 flex items-center gap-1.5"><FiMapPin size={14} /> No GPS coordinates available</span>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            <InfoItem label="Country" value={project.country} />
            <InfoItem label="State / Region" value={project.state_region} />
            <InfoItem label="City" value={project.city} />
            <InfoItem label="Latitude" value={project.latitude} mono />
            <InfoItem label="Longitude" value={project.longitude} mono />
            <InfoItem label="Total Project Area" value={project.total_project_area_hectares ? `${project.total_project_area_hectares} ha` : null} />
            <InfoItem label="Eligible Area" value={project.eligible_area_hectares ? `${project.eligible_area_hectares} ha` : null} />
            <InfoItem label="Set-Aside Conservation" value={project.set_aside_conservation_percent ? `${project.set_aside_conservation_percent}%` : null} />
            <InfoItem label="Climate Zone" value={project.climate_zone} />
            <InfoItem label="Soil Type" value={project.soil_type} />
            <InfoItem label="Hydrology Status" value={project.hydrology_status} />
            <InfoItem label="Land Title Status" value={project.land_title_status} />
          </div>
        </CollapsibleSection>

        {/* Google Maps Full Modal */}
        {showMapModal && project.latitude && project.longitude && (
          <GoogleMapModal
            lat={Number(project.latitude)}
            lng={Number(project.longitude)}
            label={project.title}
            onClose={() => setShowMapModal(false)}
          />
        )}

        {/* Methodology & Carbon Accounting */}
        <CollapsibleSection title="Methodology & Carbon Accounting" icon={FiCpu}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            <InfoItem label="Methodology Applied" value={project.methodology_applied} />
            <InfoItem label="GHG Sources Included" value={project.ghg_sources_included} />
            <InfoItem label="Additionality Demonstration" value={project.additionality_demonstration} wide />
            <InfoItem label="Baseline Scenario" value={project.baseline_scenario} wide />
            <InfoItem label="Technologies / Measures" value={project.technologies_measures_description} wide />
            <InfoItem label="SDG Targets" value={project.sdg_targets} wide />
          </div>
          {msd && Object.keys(msd).length > 0 && (
            <div className="mt-5 pt-5 border-t border-gray-100">
              <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">
                Type-Specific Data ({project.project_type})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(msd).map(([key, val]) => (
                  <InfoItem
                    key={key}
                    label={key.replace(/_/g, " ")}
                    value={typeof val === "object" ? JSON.stringify(val) : String(val)}
                  />
                ))}
              </div>
            </div>
          )}
        </CollapsibleSection>

        {/* Community & Governance */}
        {(project.stakeholder_consultation_summary || project.griebance_mechanism) && (
          <CollapsibleSection title="Community & Governance" icon={FiUsers} defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoItem label="Stakeholder Consultation Summary" value={project.stakeholder_consultation_summary} wide />
              <InfoItem label="Grievance Mechanism" value={project.griebance_mechanism} wide />
            </div>
          </CollapsibleSection>
        )}

        {/* Field Verification Reports */}
        {verification && (
          <CollapsibleSection title="Field Verification Reports" icon={FiActivity}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <VerificationReportCard report={verification.initial_report} label="Initial Field Verification" />
              <VerificationReportCard report={verification.completion_report} label="Completion Verification" />
            </div>
            {project.verification_pdf_ipfs_cid && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-indigo-800">Verification PDF (IPFS)</p>
                  <p className="text-[10px] text-indigo-500 font-mono mt-0.5 break-all">{project.verification_pdf_ipfs_cid}</p>
                </div>
                <a
                  href={`https://gateway.pinata.cloud/ipfs/${project.verification_pdf_ipfs_cid}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs font-bold text-indigo-700 hover:underline shrink-0 ml-4"
                >
                  <FiExternalLink size={12} /> View PDF
                </a>
              </div>
            )}
          </CollapsibleSection>
        )}

        {/* KYC & Identity Documents */}
        <CollapsibleSection title="KYC & Identity Documents" icon={FiShield}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-5">
            <InfoItem label="Aadhaar Doc Status" value={project.kyc_docs_status?.aadhaar?.status || null} />
            <InfoItem label="Land Deed Status" value={project.kyc_docs_status?.land_deed?.status || null} />
            <InfoItem label="Live Photo Status" value={project.kyc_docs_status?.live_photo?.status || null} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <DocCard
              url={project.aadhaar_doc_signed_url || project.aadhaar_url}
              label="Aadhaar Card"
              status={project.kyc_docs_status?.aadhaar?.status}
            />
            <DocCard
              url={project.land_deed_signed_url || project.land_deed_url}
              label="Land Deed"
              status={project.kyc_docs_status?.land_deed?.status}
            />
            <DocCard
              url={project.live_verification_photo_signed_url || project.live_photo_url}
              label="Live Verification Photo"
              status={project.kyc_docs_status?.live_photo?.status}
            />
          </div>
        </CollapsibleSection>

        {/* Additional Agent Documents */}
        {documents.length > 0 && (
          <CollapsibleSection title="Additional Agent Documents" icon={FiFileText} defaultOpen={false}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {documents.map(doc => (
                <div key={doc.id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-900 capitalize">{doc.document_type?.replace(/_/g, " ")}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                  </div>
                  <a
                    href={doc.ipfs_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline"
                  >
                    <FiExternalLink size={12} /> View
                  </a>
                </div>
              ))}
            </div>
          </CollapsibleSection>
        )}

        {/* Blockchain & Minting */}
        {(project.status === "minted" || project.token_id || project.contract_address || project.tx_hash) && (
          <CollapsibleSection title="Blockchain & Minting" icon={FiHash}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoItem label="Token ID" value={project.token_id} mono />
              <InfoItem label="Contract Address" value={project.contract_address} mono />
              <InfoItem label="Transaction Hash" value={project.tx_hash} mono wide />
              <InfoItem label="Network" value={project.network} />
              <InfoItem label="Credits Minted" value={project.credits_minted ? Number(project.credits_minted).toLocaleString() : null} />
            </div>
          </CollapsibleSection>
        )}

        {/* Metadata Footer */}
        <div className="flex items-center gap-6 px-2 pb-2">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <FiInfo size={12} />
            <span>Created: {new Date(project.created_at).toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <FiInfo size={12} />
            <span>Last Updated: {new Date(project.updated_at).toLocaleString()}</span>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
