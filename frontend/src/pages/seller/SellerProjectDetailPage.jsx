import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as sellerApi from "../../api/endpoint/Sellerapi";
import SellerLayout from "../../components/layout/SellerLayout";
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
const InfoItem = ({ label, value, wide = false }) => (
  <div className={`flex flex-col gap-1 ${wide ? "col-span-2" : ""}`}>
    <span className="text-[11px] uppercase tracking-wider font-bold text-gray-500 font-mono">{label}</span>
    <span 
      className="text-sm font-semibold text-[#0c0c0c] break-words leading-snug"
      style={{ fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace' }}
    >
      {value != null && value !== "" && value !== ", "
        ? value
        : <span className="text-gray-400 italic font-medium" style={{ fontFamily: 'inherit' }}>—</span>}
    </span>
  </div>
);

const SectionHeader = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 mb-5">
    <Icon className="text-[#c2ed6d] stroke-[3]" size={20} />
    <h2 className="text-lg font-black text-[#0c0c0c] uppercase font-mono tracking-tight">{title}</h2>
  </div>
);

const Badge = ({ children, color }) => {
  const map = {
    blue:   "bg-[#c2ed6d] text-[#0c0c0c] border-[#0c0c0c]",
    green:  "bg-[#c2ed6d] text-[#0c0c0c] border-[#0c0c0c]",
    red:    "bg-red-50 text-red-700 border-[#0c0c0c]",
    yellow: "bg-[#c2ed6d] text-[#0c0c0c] border-[#0c0c0c]",
    indigo: "bg-[#c2ed6d] text-[#0c0c0c] border-[#0c0c0c]",
    orange: "bg-[#c2ed6d] text-[#0c0c0c] border-[#0c0c0c]",
    gray:   "bg-white text-gray-600 border-[#0c0c0c]",
  };
  return (
    <span className={`px-3 py-1.5 rounded-sm text-[11px] font-semibold uppercase tracking-wider border-[2px] ${map[color] || map.gray}`}>
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
    <div className="bg-white rounded-sm border-[2px] border-[#0c0c0c] overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b-[2px] border-[#0c0c0c] flex justify-between items-center bg-white">
        <h4 className="font-bold text-[#0c0c0c] text-sm uppercase font-mono tracking-tight">{label}</h4>
        {status && <Badge color={status === "approved" ? "green" : status === "rejected" ? "red" : "yellow"}>{status}</Badge>}
      </div>
      <div className="flex-1 bg-gray-50 relative" style={{ minHeight: 220 }}>
        {isPdf ? (
          <iframe src={url} className="absolute inset-0 w-full h-full border-0" title={label} />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
            <img src={url} alt={label} className="max-w-full max-h-full object-contain rounded-sm shadow-none" />
          </div>
        )}
      </div>
      <a href={url} target="_blank" rel="noreferrer"
        className="flex items-center justify-center gap-1 py-2 text-xs font-bold font-mono uppercase tracking-wider text-[#0c0c0c] hover:bg-[#c2ed6d] transition-colors border-t-[2px] border-[#0c0c0c]">
        <FiExternalLink size={12} /> Open in new tab
      </a>
    </div>
  );
};

const CollapsibleSection = ({ title, icon: Icon, defaultOpen = true, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-sm shadow-none border-[2px] border-[#0c0c0c] overflow-hidden">
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 hover:bg-[#c2ed6d] transition-colors">
        <div className="flex items-center gap-2">
          <Icon className="text-[#0c0c0c] stroke-[3]" size={20} />
          <h2 className="text-lg font-black text-[#0c0c0c] font-mono uppercase tracking-tight">{title}</h2>
        </div>
        {open ? <FiChevronUp size={20} className="text-[#0c0c0c] stroke-[3]" /> : <FiChevronDown size={20} className="text-[#0c0c0c] stroke-[3]" />}
      </button>
      {open && <div className="px-6 pb-6 pt-2 border-t-[2px] border-[#0c0c0c]">{children}</div>}
    </div>
  );
};

/* main page */
export default function SellerProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [error, setError] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [showMapModal, setShowMapModal] = useState(false);

  useEffect(() => { load(); }, [id]);

  async function load() {
    try {
      const { data } = await sellerApi.getProjectById(id);
      setProject(data.project);
      setDocuments(data.documents || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load project details.");
    }
  }

  if (error) return (
    <SellerLayout title="Error">
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="text-red-600 font-mono font-bold">{error}</div>
      </div>
    </SellerLayout>
  );

  if (!project) return (
    <SellerLayout title="Loading Project...">
      <div className="flex-1 flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-[4px] border-[#0c0c0c]"></div>
      </div>
    </SellerLayout>
  );

  const msd = project.methodology_specific_data || {};

  return (
    <SellerLayout
      title="Project Details"
      subtitle={`Raw details for Project CXP-${project.id}`}
    >
      <div className="p-6 lg:p-8 w-full max-w-[1200px] mx-auto space-y-6">

        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/seller/projects')}
            className="flex items-center gap-2 text-sm font-bold font-mono uppercase tracking-wider text-[#0c0c0c] hover:bg-[#c2ed6d] transition-colors bg-white border-[2px] border-[#0c0c0c] px-4 py-2 rounded-sm shadow-none"
          >
            <FiChevronLeft size={16} className="stroke-[3]" /> Back to Projects
          </button>
          <Badge color={statusColor(project.status)}>{project.status.replace(/_/g, " ")}</Badge>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-sm p-6 md:p-8 shadow-none border-[2px] border-[#0c0c0c]">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] font-mono uppercase tracking-widest font-bold text-gray-500 mb-1">
                Project CXP-{project.id}
              </p>
              <h1 className="text-2xl md:text-3xl font-black text-[#0c0c0c] font-mono tracking-tight uppercase leading-tight border-b-[2px] border-[#0c0c0c] pb-4 mb-4">
                {project.title}
              </h1>
              {project.project_summary && (
                <p className="text-sm text-gray-700 font-mono mt-3 leading-relaxed max-w-2xl">
                  {project.project_summary}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[11px] font-mono font-bold text-gray-500 capitalize">{project.project_scale} scale</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-5 border-t-[2px] border-[#0c0c0c]">
            <InfoItem label="Project Type" value={project.project_type?.replace(/_/g, " ")} />
            <InfoItem label="Scale" value={project.project_scale} />
            <InfoItem label="Location" value={[project.city, project.state_region, project.country].filter(Boolean).join(", ")} />
            <InfoItem label="Est. CO2 Claimed" value={project.total_co2_claimed ? `${Number(project.total_co2_claimed).toLocaleString()} t` : null} />
            <InfoItem label="Est. VERs" value={project.estimated_vers ? Number(project.estimated_vers).toLocaleString() : null} />
          </div>
        </div>

        {/* Timeline Stepper */}
        <ProjectStepper status={project.status} />

        {/* Environment & Location */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CollapsibleSection title="Environment & Hydrology" icon={FiMapPin}>
            <div className="grid grid-cols-2 gap-6">
              <InfoItem label="Climate Zone" value={project.climate_zone} />
              <InfoItem label="Soil Type" value={project.soil_type} />
              <InfoItem label="Hydrology Status" value={project.hydrology_status} />
              <InfoItem label="Land Title" value={project.land_title_status} />
              <InfoItem label="Land Ownership" value={project.land_ownership_type} />
              <InfoItem label="Water Management" value={project.water_management_plan} />
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Coordinates & Map" icon={FiGlobe}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <InfoItem label="Latitude" value={project.latitude} />
              <InfoItem label="Longitude" value={project.longitude} />
            </div>
            {project.latitude && project.longitude && (
              <div className="h-48 rounded-sm overflow-hidden relative border-[2px] border-[#0c0c0c]">
                <LocationMap markers={[{ lat: project.latitude, lng: project.longitude, label: project.title }]} />
                <button
                  onClick={() => setShowMapModal(true)}
                  className="absolute bottom-2 right-2 bg-white text-[#0c0c0c] border-[2px] border-[#0c0c0c] p-2 text-xs font-bold font-mono hover:bg-[#c2ed6d] flex items-center gap-1 z-[1000] rounded-sm transition-colors"
                >
                  <FiMaximize2 size={12} /> Expand Map
                </button>
              </div>
            )}
            {project.kml_file_url && (
              <div className="mt-4 pt-4 border-t-[2px] border-[#0c0c0c]">
                <a href={project.kml_file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold font-mono text-[#0c0c0c] hover:bg-[#c2ed6d] border-[2px] border-[#0c0c0c] p-2 rounded-sm w-fit transition-colors">
                  <FiFileText size={16} /> Download Boundaries KML
                </a>
              </div>
            )}
          </CollapsibleSection>
        </div>

        {/* Methodology */}
        <CollapsibleSection title="Methodology & Logic" icon={FiActivity}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoItem label="Methodology Applied" value={project.methodology_applied} />
            <InfoItem label="GHG Sources" value={project.ghg_sources_included} />
            <InfoItem label="SDG Targets" value={project.sdg_targets} />
            <InfoItem label="Baseline Scenario" value={project.baseline_scenario} wide />
            <InfoItem label="Additionality" value={project.additionality_demonstration} wide />
            <InfoItem label="Technologies / Measures" value={project.technologies_measures_description} wide />
          </div>
        </CollapsibleSection>

        {/* Dynamic Methodology Fields */}
        {Object.keys(msd).length > 0 && (
          <CollapsibleSection title="Project Specific Metrics" icon={FiCpu}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {Object.entries(msd).map(([key, value]) => {
                const cleanKey = key.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
                if(typeof value === "object") return null;
                return (
                  <div key={key} className="bg-gray-50 border-[2px] border-[#0c0c0c] p-4 rounded-sm flex flex-col gap-1">
                    <span className="text-[11px] font-bold font-mono uppercase tracking-wider text-gray-500">{cleanKey}</span>
                    <span className="text-sm font-black font-mono text-[#0c0c0c] break-words">{value}</span>
                  </div>
                );
              })}
            </div>
          </CollapsibleSection>
        )}

        {/* Supporting Documents */}
        <CollapsibleSection title="Supporting Documents" icon={FiFileText}>
          {documents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {documents.map((doc) => (
                <DocCard
                  key={doc.id}
                  url={doc.signed_url || doc.file_url}
                  label={doc.document_type?.replace(/_/g, " ").toUpperCase() || "DOCUMENT"}
                  status={doc.verification_status}
                />
              ))}
            </div>
          ) : (
            <div className="text-sm font-mono text-gray-500 italic">No documents uploaded for this project.</div>
          )}
        </CollapsibleSection>

      </div>

      {showMapModal && (
        <GoogleMapModal
          lat={project.latitude}
          lng={project.longitude}
          label={project.title}
          onClose={() => setShowMapModal(false)}
        />
      )}
    </SellerLayout>
  );
}
