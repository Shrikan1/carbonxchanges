import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as adminProjectApi from '../../api/endpoint/adminProjectApi';
import * as adminApi from '../../api/endpoint/adminApi';
import AdminLayout from '../../components/layout/AdminLayout';
import ProjectStepper from '../../components/ProjectStepper';
import DocumentEmbed from '../../components/ui/DocumentEmbed';
import PdfViewerModal from '../../components/ui/PdfViewerModal';
import { 
  FiChevronLeft, FiAlertTriangle, FiCheckCircle, FiClock, 
  FiUserCheck, FiFileText, FiMapPin, FiCpu 
} from 'react-icons/fi';

const InfoItem = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</span>
    <span className="text-sm font-medium text-gray-900 break-words">
      {value || <span className="text-gray-400 italic">Not provided</span>}
    </span>
  </div>
);

const DocViewer = ({ url, label, status }) => {
  if (!url) return null;
  return (
    <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
        <h4 className="font-semibold text-gray-800 text-sm">{label}</h4>
        {status === 'approved' && <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-700 rounded uppercase">Approved</span>}
        {status === 'pending' && <span className="text-[10px] font-bold px-2 py-1 bg-yellow-100 text-yellow-700 rounded uppercase">Pending</span>}
        {status === 'rejected' && <span className="text-[10px] font-bold px-2 py-1 bg-red-100 text-red-700 rounded uppercase">Rejected</span>}
      </div>
      <div className="flex-1 bg-gray-100 relative min-h-[300px]">
        {url.endsWith('.pdf') ? (
          <iframe src={url} className="absolute inset-0 w-full h-full border-0" title={label} />
        ) : (
          <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4">
            <img src={url} alt={label} className="max-w-full max-h-full object-contain rounded shadow-sm" />
          </div>
        )}
      </div>
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
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [verification, setVerification] = useState(null);

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
    } catch (err) { setError(err.response?.data?.error || 'Failed to approve'); }
    finally { setActionLoading(false); }
  }

  async function handleReject() {
    setError(null); setActionLoading(true); setShowRejectConfirm(false);
    try {
      await adminProjectApi.rejectProject(id);
      await load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to reject'); }
    finally { setActionLoading(false); }
  }

  async function handleAssignAgent() {
    if (!selectedAgentId) return;
    setError(null); setActionLoading(true);
    try {
      await adminProjectApi.assignAgent(id, Number(selectedAgentId));
      await load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to assign'); }
    finally { setActionLoading(false); }
  }

  async function handleRemoveAgent() {
    setError(null); setActionLoading(true);
    try {
      await adminProjectApi.removeAgent(id);
      await load();
    } catch (err) { setError(err.response?.data?.error || 'Failed to remove agent'); }
    finally { setActionLoading(false); }
  }

  if (!project) return (
    <AdminLayout title="Loading Project...">
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    </AdminLayout>
  );

  const isActionable = !['rejected', 'approved', 'minted'].includes(project.status);

  return (
    <AdminLayout title="Project Details" subtitle={`Manage verification and lifecycle for Project CXP-${project.id}`}>
      <div className="p-6 lg:p-8 w-full max-w-[1200px] mx-auto space-y-6">

        {/* Top Controls */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors bg-white border border-gray-200 px-4 py-2 rounded-lg shadow-sm"
          >
            <FiChevronLeft size={16} /> Back to Projects
          </button>
          
          <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border shadow-sm ${
            project.status === 'verified' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            project.status === 'approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
            project.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
            project.status === 'minted' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
            'bg-orange-50 text-orange-700 border-orange-200'
          }`}>
            {project.status.replace('_', ' ')}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 text-sm font-medium flex items-center gap-2">
            <FiAlertTriangle /> {error}
          </div>
        )}

        {/* Project Header Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <h1 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-6">{project.title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-gray-100">
            <InfoItem label="Project Type" value={project.project_type} />
            <InfoItem label="Location" value={`${project.city || ''}, ${project.country || ''}`} />
            <InfoItem label="Seller" value={project.seller_name} />
            <InfoItem label="Est. Credits" value={project.total_credits_estimated?.toLocaleString()} />
          </div>
        </div>

        <ProjectStepper status={project.status} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Agent Assignment Block */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <FiUserCheck className="text-gray-400" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Agent Assignment</h2>
            </div>
            
            <div className="flex-1 flex flex-col justify-end">
              {project.agent_id ? (
                <div className="flex flex-col gap-4">
                  <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-900">{assignedAgent ? assignedAgent.name : `Agent ID: ${project.agent_id}`}</p>
                      {assignedAgent && <p className="text-xs text-gray-500 mt-1">{assignedAgent.email}</p>}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-1 rounded">Assigned</span>
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
                    {(agents || []).map((a) => <option key={a.id} value={a.id}>{a.name} ({a.email})</option>)}
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

          {/* Admin Actions Block */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <FiCheckCircle className="text-gray-400" size={20} />
              <h2 className="text-lg font-bold text-gray-900">Verification Decision</h2>
            </div>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">
              Final approval requires the project to be in the <strong className="text-gray-700">Verified</strong> state by the assigned agent. Approving the project will automatically stage it for credit minting.
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
                    disabled={project.status !== 'verified' || actionLoading}
                    className={`flex-1 py-3 text-sm font-bold rounded-xl transition-colors ${
                      project.status === 'verified' 
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
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

        {/* KYC / Documents Section */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-6">
            <FiFileText className="text-gray-400" size={20} />
            <h2 className="text-lg font-bold text-gray-900">KYC & Evidence Documents</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DocViewer url={project.land_deed_url} label="Land Deed" status={project.kyc_docs_status?.land_deed?.status} />
            <DocViewer url={project.aadhaar_url} label="Aadhaar Card" status={project.kyc_docs_status?.aadhaar?.status} />
          </div>
          
          {documents.length > 0 && (
            <div className="mt-8">
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Additional Agent Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {documents.map(doc => (
                  <div key={doc.id} className="bg-gray-50 border border-gray-200 p-4 rounded-xl flex justify-between items-center">
                    <div>
                      <p className="text-sm font-bold text-gray-900 capitalize">{doc.document_type.replace('_', ' ')}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                    </div>
                    <a href={doc.ipfs_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline">
                      View File
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}