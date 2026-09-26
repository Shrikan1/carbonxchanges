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
        className="flex items-center justify-center gap-1 py-2 text-xs font-bold text-emerald-600 hover:bg-emerald-50 transition-colors border-t border-gray-200">
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
            className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-700 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50"
          >
            <FiChevronLeft size={16} /> Back to Projects
          </button>
          <Badge color={statusColor(project.status)}>{project.status.replace(/_/g, " ")}</Badge>
        </div>

        {/* Hero Header Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
            <div>
              <p className="text-[11px] uppercase tracking-widest font-bold text-gray-400 mb-1">
                Project CXP-{project.id}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight uppercase leading-tight border-b border-gray-200 pb-4 mb-4">
                {project.title}
              </h1>
              {project.project_summary && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-2xl">
                  {project.project_summary}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <span className="text-[11px] font-bold text-gray-400 capitalize">{project.project_scale} scale</span>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 pt-5 border-t border-gray-200">
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
              <div className="h-48 rounded-xl overflow-hidden relative border border-gray-200">
                <LocationMap markers={[{ lat: project.latitude, lng: project.longitude, label: project.title }]} />
                <button
                  onClick={() => setShowMapModal(true)}
                  className="absolute bottom-2 right-2 bg-white text-gray-700 border border-gray-200 p-2 text-xs font-bold hover:bg-gray-50 flex items-center gap-1 z-[1000] rounded-lg shadow-sm transition-colors"
                >
                  <FiMaximize2 size={12} /> Expand Map
                </button>
              </div>
            )}
            {project.kml_file_url && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <a href={project.kml_file_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:bg-gray-50 border border-gray-200 p-2 rounded-lg w-fit transition-colors shadow-sm">
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
                  <div key={key} className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{cleanKey}</span>
                    <span className="text-sm font-medium text-gray-900 break-words">{value}</span>
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
