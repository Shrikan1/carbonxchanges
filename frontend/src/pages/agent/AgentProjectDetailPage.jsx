import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import LocationMap from '../../components/LocationMap';
import GoogleMapModal from '../../components/GoogleMapModal';
import DocumentEmbed from '../../components/ui/DocumentEmbed';
import ProjectStepper from '../../components/ProjectStepper';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';
import { FiExternalLink, FiChevronLeft, FiCamera, FiTrash2, FiCheckCircle, FiFlag, FiAlertTriangle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { TYPE_TO_STEP3 } from '../../components/seller/projectFormConfig';
import CameraUploader from '../../components/ui/CameraUploader';
import AgentLayout from '../../components/layout/AgentLayout';

const InfoItem = ({ label, value, className = "", fullWidth = false }) => (
  <div className={`flex flex-col gap-1 ${fullWidth ? 'sm:col-span-2' : ''}`}>
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

const EMPTY_VERIFICATION_FORM = { gps_lat: '', gps_lng: '', photo_url: '', notes: '', verified_co2_amount: '', override_timeline: false, overridden_expected_completion_date: '' };
const EMPTY_REINSPECTION_FORM = { gps_lat: '', gps_lng: '', photo_url: '', notes: '', reversal_detected: false, reversal_amount: '' };

export default function AgentProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [thread, setThread] = useState({ reportId: null, messages: [] });
  const [newMessage, setNewMessage] = useState('');
  const [verifyForm, setVerifyForm] = useState(EMPTY_VERIFICATION_FORM);
  const [reinspectForm, setReinspectForm] = useState(EMPTY_REINSPECTION_FORM);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [checkedSections, setCheckedSections] = useState({});

  // Confirmation & Flagging Modals State
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState('verification');
  const [showFlagModal, setShowFlagModal] = useState(false);
  const [flagCategory, setFlagCategory] = useState('');
  const [flagDescription, setFlagDescription] = useState('');
  const [flagging, setFlagging] = useState(false);

  const toggleSection = async (key) => {
    const newVal = !checkedSections[key];
    const updated = { ...checkedSections, [key]: newVal };
    setCheckedSections(updated);
    try {
      await agentApi.updateReviewProgress(id, updated);
    } catch (err) {
      console.error('Failed to save progress', err);
    }
  };

  async function handleReviewDoc(docId, status, rejectionReason = null) {
    try {
      await agentApi.reviewDocument(id, docId, status, rejectionReason);
      toast.success(`Document marked as ${status}`);
      load();
    } catch (err) {
      toast.error('Failed to update document status');
    }
  }

  function promptRejectDoc(docId) {
    const reason = window.prompt("Enter rejection reason:");
    if (reason) {
      handleReviewDoc(docId, 'rejected', reason);
    }
  }

  async function handleReviewKycDoc(docType, status, rejectionReason = null) {
    try {
      await agentApi.reviewKycDocument(id, docType, status, rejectionReason);
      toast.success(`KYC Document marked as ${status}`);
      load();
    } catch (err) {
      toast.error('Failed to update KYC document status');
    }
  }

  function promptRejectKycDoc(docType) {
    const reason = window.prompt("Enter rejection reason for this KYC document:");
    if (reason) {
      handleReviewKycDoc(docType, 'rejected', reason);
    }
  }

  const renderKycDoc = (url, title, docType, path) => {
    if (!url && !path) return null;
    const docData = project.kyc_docs_status?.[docType] || { status: 'pending', reason: null };
    const isBroken = path && !url;
    
    const headerRight = (
      <div className="flex gap-2 items-center">
        {docData.status === 'approved' ? (
          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-200">APPROVED</span>
        ) : docData.status === 'rejected' ? (
          <div className="flex items-center gap-2">
            <span className="bg-white/90 text-red-700 text-[10px] px-2 py-1 rounded shadow-sm max-w-[120px] truncate border border-red-100" title={docData.reason}>{docData.reason}</span>
            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-red-200">REJECTED</span>
          </div>
        ) : (
          <div className="flex gap-1.5">
            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-yellow-200 mr-2 flex items-center">PENDING</span>
            <button type="button" onClick={() => handleReviewKycDoc(docType, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors shadow-sm">Accept</button>
            <button type="button" onClick={() => promptRejectKycDoc(docType)} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors shadow-sm">Reject</button>
          </div>
        )}
      </div>
    );

    return (
      <div className="w-full">
        {isBroken ? (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm h-[400px] flex flex-col">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
              {headerRight}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-6 text-center">
              <FiAlertTriangle size={48} className="mb-4 text-red-400" />
              <p className="font-medium text-gray-700">Image Failed to Load</p>
              <p className="text-xs mt-2 max-w-xs">The file path exists in the database, but the image is missing from storage. Please reject it so the seller can re-upload.</p>
            </div>
          </div>
        ) : (
          <DocumentEmbed url={url} title={title} headerRight={headerRight} />
        )}
      </div>
    );
  };

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    try {
      const { data } = await agentApi.getAssignedProjectDetails(id);
      setProject(data.project);
      setCheckedSections(data.project.agent_review_progress || {});
      setDocuments(data.documents || []);

      // Find this project's most recent report (if any) via history, to
      // thread messages against — agent's own history list already has every
      // report they've ever submitted, filter down to this project.
      const historyRes = await agentApi.getVerificationHistory();
      const projectReports = historyRes.data.reports.filter((r) => r.project_id === Number(id));
      if (projectReports.length > 0) {
        const latestReport = projectReports[0]; // findReportsByAgent orders most-recent-first
        const threadRes = await agentApi.getReportThread(latestReport.id);
        setThread({ reportId: latestReport.id, messages: threadRes.data.messages });
      }
    } catch (err) {
      console.error("Failed to load project details:", err);
      setError("Failed to load project details.");
      toast.error("Failed to load project details");
    }
  }

  function setVerifyField(name, value) {
    setVerifyForm((prev) => ({ ...prev, [name]: value }));
  }

  function setReinspectField(name, value) {
    setReinspectForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handlePhotoSelected(file, previewUrl, setFieldFn) {
    if (!file) return;

    setPhotoPreview(previewUrl);
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('purpose', 'verification_photo');

      const { data } = await agentApi.uploadKycDocument(formData);
      setFieldFn('photo_url', data.storagePath);
    } catch (err) {
      console.error('Photo upload failed:', err);
      toast.error('Failed to upload photo. Please try again.');
      setPhotoPreview(null);
    } finally {
      setUploadingPhoto(false);
    }
  }

  function handleRemovePhoto(setFieldFn) {
    setFieldFn('photo_url', '');
    setPhotoPreview(null);
  }

  function handleInitSubmitVerification(e) {
    e.preventDefault();

    if (project.status === 'assigned') {
      const kycDocs = project.kyc_docs_status || {};
      const unapproved = ['aadhaar', 'land_deed', 'live_photo'].some(docType => {
        // Only check if they actually provided the document
        if (docType === 'aadhaar' && !project.aadhaar_doc_signed_url) return false;
        if (docType === 'land_deed' && !project.land_deed_signed_url) return false;
        if (docType === 'live_photo' && !project.live_verification_photo_signed_url) return false;

        const status = kycDocs[docType]?.status || 'pending';
        return status !== 'approved';
      });

      if (unapproved) {
        toast.error('All Core KYC documents must be accepted before submitting Initial Verification.');
        return;
      }
    }

    setConfirmActionType('verification');
    setShowConfirmModal(true);
  }

  function handleInitSubmitReinspection(e) {
    e.preventDefault();
    setConfirmActionType('reinspection');
    setShowConfirmModal(true);
  }

  async function performVerificationSubmit() {
    setShowConfirmModal(false);
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        gps_lat: Number(verifyForm.gps_lat),
        gps_lng: Number(verifyForm.gps_lng),
        photo_url: verifyForm.photo_url,
        notes: verifyForm.notes,
      };
      if (verifyForm.override_timeline && verifyForm.overridden_expected_completion_date) {
        payload.overridden_expected_completion_date = verifyForm.overridden_expected_completion_date;
      }
      let data;
      if (project.status === 'assigned') {
        ({ data } = await agentApi.submitInitialVerification(id, payload));
      } else {
        payload.verified_co2_amount = Number(verifyForm.verified_co2_amount);
        ({ data } = await agentApi.submitCompletionVerification(id, payload));
      }
      toast.success(data.message, { duration: 5000 });
      setVerifyForm(EMPTY_VERIFICATION_FORM);
      setPhotoPreview(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit verification';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function submitFlag(e) {
    e.preventDefault();
    if (!flagCategory || !flagDescription.trim()) {
      toast.error('Please fill in both category and description.');
      return;
    }
    setFlagging(true);
    try {
      const { data } = await agentApi.flagProject(id, { category: flagCategory, description: flagDescription });
      toast.success(data.message);
      setShowFlagModal(false);
      setFlagCategory('');
      setFlagDescription('');
      load();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to flag project');
    } finally {
      setFlagging(false);
    }
  }

  async function performReinspectionSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await agentApi.submitReinspection(id, {
        gps_lat: Number(reinspectForm.gps_lat),
        gps_lng: Number(reinspectForm.gps_lng),
        photo_url: reinspectForm.photo_url,
        notes: reinspectForm.notes,
        reversal_detected: reinspectForm.reversal_detected,
        reversal_amount: reinspectForm.reversal_detected ? Number(reinspectForm.reversal_amount) : undefined,
      });
      toast.success(data.message);
      setReinspectForm(EMPTY_REINSPECTION_FORM);
      setPhotoPreview(null);
      load();
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to submit re-inspection';
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!thread.reportId || !newMessage.trim()) return;
    try {
      const { data } = await agentApi.sendMessage(thread.reportId, newMessage);
      setThread((prev) => ({ ...prev, messages: [...prev.messages, data.data] }));
      setNewMessage('');
      toast.success("Message sent");
    } catch (err) {
      console.error("Failed to send message", err);
      toast.error("Failed to send message");
    }
  }

  if (!project) return (
    <div className="admin-theme min-h-screen flex items-center justify-center text-center bg-[#f3f4f6]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>
  );

  // Dual markers: declared location (from the seller's registration) vs
  // whatever GPS the agent is currently entering — the actual Section 13
  // trust-check comparison, live as they type.
  const mapMarkers = [
    project.latitude && project.longitude
      ? { lat: Number(project.latitude), lng: Number(project.longitude), label: 'Declared location' }
      : null,
    verifyForm.gps_lat && verifyForm.gps_lng
      ? { lat: Number(verifyForm.gps_lat), lng: Number(verifyForm.gps_lng), label: 'Your current GPS entry' }
      : null,
  ].filter(Boolean);

  const today = new Date().toISOString().split('T')[0];
  const expectedDate = project.expected_completion_date ? new Date(project.expected_completion_date).toISOString().split('T')[0] : null;
  const isCompletionLocked = project.status === 'in_progress' && expectedDate && today < expectedDate;

  return (
    <AgentLayout title="Project Details" subtitle="Verification workspace">
      <div className="flex flex-col h-full w-full max-w-[1400px] mx-auto pb-12">
        <div className="max-w-5xl mx-auto space-y-6 relative w-full">
          <ProjectStepper status={project.status} />

          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl text-[#0a0a0a] font-semibold mb-2 tracking-tight">{project.title}</h1>
              <p className="text-xs text-[#999] flex flex-wrap gap-3 items-center uppercase tracking-[0.1em]" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                <span>{project.project_type}</span>
                <span className="text-[#e2e8e4]">|</span>
                <span>{project.project_scale}</span>
                <span className="text-[#e2e8e4]">|</span>
                <span className="font-bold text-[#666]">Status: {project.status.replace('_', ' ')}</span>
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

          {/* Action Cards (Verification / Re-inspection) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(project.status === 'assigned' || project.status === 'in_progress') && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col col-span-1 md:col-span-2">
                <h2 className="font-semibold text-lg text-gray-900 mb-4">
                  {project.status === 'assigned' ? 'Initial Verification' : 'Completion Verification'}
                </h2>
                
                {isCompletionLocked ? (
                  <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-blue-900 font-semibold mb-1">Project in Progress</h3>
                    <p className="text-blue-700 text-sm max-w-md">
                      Initial verification was successful. The seller is currently implementing the project. 
                      Completion verification will unlock on <strong>{new Date(project.expected_completion_date).toLocaleDateString()}</strong>.
                    </p>
                  </div>
                ) : project.status === 'flagged' ? (
                  <div className="p-6 bg-red-50 border border-red-100 rounded-3xl mb-8 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                      <FiAlertTriangle size={24} />
                    </div>
                    <h3 className="text-red-900 font-bold mb-1">Project Flagged</h3>
                    <p className="text-red-700 text-sm max-w-md">
                      This project has been flagged for issues and is awaiting Admin review. Verification is paused.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInitSubmitVerification} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">GPS Latitude</Label>
                      <Input type="number" step="any" required value={verifyForm.gps_lat} onChange={(e) => setVerifyField('gps_lat', e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-gray-700">GPS Longitude</Label>
                      <Input type="number" step="any" required value={verifyForm.gps_lng} onChange={(e) => setVerifyField('gps_lng', e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 block mb-2">Capture or Upload Field Photo</Label>
                    {!verifyForm.photo_url && !photoPreview ? (
                      <CameraUploader 
                        onPhotoSelected={(file, url) => handlePhotoSelected(file, url, setVerifyField)} 
                        uploading={uploadingPhoto} 
                      />
                    ) : (
                      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        {photoPreview && <img src={photoPreview} alt="Preview" className="w-full h-48 md:h-64 object-cover" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <span className="text-white text-sm font-medium drop-shadow-md">
                            {uploadingPhoto ? 'Uploading to secure vault...' : 'Photo Uploaded Securely'}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemovePhoto(setVerifyField)} 
                          disabled={uploadingPhoto}
                          className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    )}
                    {uploadingPhoto && (
                      <div className="flex items-center gap-2 mt-3 text-sm font-medium text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Uploading secure photo...
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700">Notes</Label>
                    <Textarea value={verifyForm.notes} onChange={(e) => setVerifyField('notes', e.target.value)} className="mt-1" rows={3} />
                  </div>
                  {project.status === 'assigned' && (
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                      <label className="flex items-center gap-2 text-sm text-gray-900 font-bold mb-2">
                        <input
                          type="checkbox"
                          checked={verifyForm.override_timeline}
                          onChange={(e) => setVerifyField('override_timeline', e.target.checked)}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        Override Expected Completion Date
                      </label>
                      {verifyForm.override_timeline && (
                        <div className="mt-3">
                          <Label className="text-gray-700">New Completion Date</Label>
                          <Input 
                            type="date" 
                            required 
                            value={verifyForm.overridden_expected_completion_date} 
                            onChange={(e) => setVerifyField('overridden_expected_completion_date', e.target.value)} 
                            className="mt-1" 
                            min={new Date().toISOString().split('T')[0]} 
                          />
                        </div>
                      )}
                    </div>
                  )}
                  {project.status === 'in_progress' && !isCompletionLocked && (
                    <div>
                      <Label className="text-gray-700">Verified CO2 Amount (tonnes)</Label>
                      <Input type="number" step="0.01" required value={verifyForm.verified_co2_amount} onChange={(e) => setVerifyField('verified_co2_amount', e.target.value)} className="mt-1" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowFlagModal(true)}
                      className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <FiFlag /> Flag Issue
                    </button>
                    <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800">
                      {submitting ? 'Submitting...' : `Submit ${project.status === 'assigned' ? 'Initial' : 'Completion'} Verification`}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

            {project.status === 'minted' && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col col-span-1 md:col-span-2">
                <h2 className="font-semibold text-lg text-gray-900 mb-4">Re-inspection (Post-mint Monitoring)</h2>
                <form onSubmit={handleInitSubmitReinspection} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">GPS Latitude</Label>
                      <Input type="number" step="any" required value={reinspectForm.gps_lat} onChange={(e) => setReinspectField('gps_lat', e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-gray-700">GPS Longitude</Label>
                      <Input type="number" step="any" required value={reinspectForm.gps_lng} onChange={(e) => setReinspectField('gps_lng', e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700 block mb-2">Capture or Upload Field Photo</Label>
                    {!reinspectForm.photo_url && !photoPreview ? (
                      <CameraUploader 
                        onPhotoSelected={(file, url) => handlePhotoSelected(file, url, setReinspectField)} 
                        uploading={uploadingPhoto} 
                      />
                    ) : (
                      <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                        {photoPreview && <img src={photoPreview} alt="Preview" className="w-full h-48 md:h-64 object-cover" />}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                          <span className="text-white text-sm font-medium drop-shadow-md">
                            {uploadingPhoto ? 'Uploading to secure vault...' : 'Photo Uploaded Securely'}
                          </span>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => handleRemovePhoto(setReinspectField)} 
                          disabled={uploadingPhoto}
                          className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg backdrop-blur-sm transition-all"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </div>
                    )}
                    {uploadingPhoto && (
                      <div className="flex items-center gap-2 mt-3 text-sm font-medium text-blue-600">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                        Uploading secure photo...
                      </div>
                    )}
                  </div>
                  <div>
                    <Label className="text-gray-700">Notes</Label>
                    <Textarea value={reinspectForm.notes} onChange={(e) => setReinspectField('notes', e.target.value)} className="mt-1" rows={3} />
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-900 font-medium">
                    <input
                      type="checkbox"
                      checked={reinspectForm.reversal_detected}
                      onChange={(e) => setReinspectField('reversal_detected', e.target.checked)}
                      className="rounded border-gray-300 text-gray-900 focus:ring-gray-900"
                    />
                    Reversal detected
                  </label>
                  {reinspectForm.reversal_detected && (
                    <div>
                      <Label className="text-gray-700">Reversal Amount (tonnes)</Label>
                      <Input type="number" step="0.01" required value={reinspectForm.reversal_amount} onChange={(e) => setReinspectField('reversal_amount', e.target.value)} className="mt-1" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setShowFlagModal(true)}
                      className="px-6 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors flex items-center gap-2"
                    >
                      <FiFlag /> Flag Issue
                    </button>
                    <Button type="submit" disabled={submitting} className="w-full sm:w-auto bg-gray-900 text-white hover:bg-gray-800">
                      {submitting ? 'Submitting...' : 'Submit Re-inspection'}
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Detailed Project Data Sections */}
          <div className="space-y-6 mt-8">
            <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-3">Full Project Details</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* General Information */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">General Information</h3>
                  <button
                    type="button"
                    onClick={() => toggleSection('general')}
                    disabled={checkedSections['general']}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      checkedSections['general'] 
                        ? 'bg-emerald-100 text-emerald-700 cursor-default opacity-80' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheckCircle size={14} className={checkedSections['general'] ? 'text-emerald-600' : 'text-gray-400'} />
                    {checkedSections['general'] ? 'CHECKED' : 'CHECK'}
                  </button>
                </div>
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
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Location & Area</h3>
                  <button
                    type="button"
                    onClick={() => toggleSection('location')}
                    disabled={checkedSections['location']}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      checkedSections['location'] 
                        ? 'bg-emerald-100 text-emerald-700 cursor-default opacity-80' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheckCircle size={14} className={checkedSections['location'] ? 'text-emerald-600' : 'text-gray-400'} />
                    {checkedSections['location'] ? 'CHECKED' : 'CHECK'}
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4 mb-6">
                  <InfoItem label="Country" value={project.country} />
                  <InfoItem label="State/Region" value={project.state_region} />
                  <InfoItem label="Coordinates" value={(project.latitude && project.longitude) ? `${project.latitude}, ${project.longitude}` : null} />
                  <InfoItem label="Total Area" value={project.total_project_area_hectares ? `${project.total_project_area_hectares} ha` : null} />
                  <InfoItem label="Eligible Area" value={project.eligible_area_hectares ? `${project.eligible_area_hectares} ha` : null} />
                  <InfoItem label="Set-Aside Conservation" value={project.set_aside_conservation_percent ? `${project.set_aside_conservation_percent}%` : null} />
                </div>
                
                {/* Map in the empty space */}
                {mapMarkers.length > 0 && (
                  <div className="mt-auto rounded-2xl overflow-hidden border border-gray-100 shadow-inner">
                    <div className="h-56">
                      <LocationMap markers={mapMarkers} zoom={12} height="100%" />
                    </div>
                    {project.latitude && project.longitude && (
                      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">Coords:</span> {project.latitude}, {project.longitude}
                        </div>
                        <button
                          onClick={() => setShowMapModal(true)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition-colors"
                        >
                          View Map <FiExternalLink />
                        </button>
                      </div>
                    )}
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
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-lg font-bold text-gray-900">{stepConfig.title}</h3>
                      <button
                        type="button"
                        onClick={() => toggleSection('specific')}
                        disabled={checkedSections['specific']}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                          checkedSections['specific'] 
                            ? 'bg-emerald-100 text-emerald-700 cursor-default opacity-80' 
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        <FiCheckCircle size={14} className={checkedSections['specific'] ? 'text-emerald-600' : 'text-gray-400'} />
                        {checkedSections['specific'] ? 'CHECKED' : 'CHECK'}
                      </button>
                    </div>
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
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Methodology & Verification</h3>
                  <button
                    type="button"
                    onClick={() => toggleSection('methodology')}
                    disabled={checkedSections['methodology']}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      checkedSections['methodology'] 
                        ? 'bg-emerald-100 text-emerald-700 cursor-default opacity-80' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheckCircle size={14} className={checkedSections['methodology'] ? 'text-emerald-600' : 'text-gray-400'} />
                    {checkedSections['methodology'] ? 'CHECKED' : 'CHECK'}
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Ownership & Compliance</h3>
                  <button
                    type="button"
                    onClick={() => toggleSection('ownership')}
                    disabled={checkedSections['ownership']}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      checkedSections['ownership'] 
                        ? 'bg-emerald-100 text-emerald-700 cursor-default opacity-80' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheckCircle size={14} className={checkedSections['ownership'] ? 'text-emerald-600' : 'text-gray-400'} />
                    {checkedSections['ownership'] ? 'CHECKED' : 'CHECK'}
                  </button>
                </div>
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
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-lg font-bold text-gray-900">Documents & Evidence</h3>
                  <button
                    type="button"
                    onClick={() => toggleSection('documents')}
                    disabled={checkedSections['documents']}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      checkedSections['documents'] 
                        ? 'bg-emerald-100 text-emerald-700 cursor-default opacity-80' 
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <FiCheckCircle size={14} className={checkedSections['documents'] ? 'text-emerald-600' : 'text-gray-400'} />
                    {checkedSections['documents'] ? 'CHECKED' : 'CHECK'}
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderKycDoc(project.aadhaar_doc_signed_url, "Owner ID (KYC)", "aadhaar", project.aadhaar_doc_path)}
                  {renderKycDoc(project.land_deed_signed_url, "Land Deed", "land_deed", project.land_deed_path)}
                  {renderKycDoc(project.live_verification_photo_signed_url, "Live Photo (KYC)", "live_photo", project.live_verification_photo_path)}
                  {documents.map((doc) => {
                    const headerRight = (
                      <div className="flex gap-2 items-center">
                        {doc.status === 'approved' ? (
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-emerald-200">APPROVED</span>
                        ) : doc.status === 'rejected' ? (
                          <div className="flex items-center gap-2">
                            <span className="bg-white/90 text-red-700 text-[10px] px-2 py-1 rounded shadow-sm max-w-[120px] truncate border border-red-100" title={doc.rejection_reason}>{doc.rejection_reason}</span>
                            <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-red-200">REJECTED</span>
                          </div>
                        ) : (
                          <div className="flex gap-1.5">
                            <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded-md shadow-sm border border-yellow-200 mr-2 flex items-center">PENDING</span>
                            <button type="button" onClick={() => handleReviewDoc(doc.id, 'approved')} className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors shadow-sm">Accept</button>
                            <button type="button" onClick={() => promptRejectDoc(doc.id)} className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded transition-colors shadow-sm">Reject</button>
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



            {/* Communication Thread (Temporarily Commented Out)
            {thread.reportId && (
              <div className="mt-8 bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Messages with Seller</h2>
                <div className="space-y-4 max-h-80 overflow-y-auto mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  {thread.messages.map((m) => (
                    <div key={m.id} className={`flex flex-col ${m.sender_role === 'agent' ? 'items-end' : 'items-start'}`}>
                      <div className={`text-sm px-4 py-2 rounded-2xl max-w-[80%] ${m.sender_role === 'agent' ? 'bg-gray-900 text-white rounded-br-sm' : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'}`}>
                        <div className="font-semibold text-xs opacity-75 mb-1">{m.sender_name}</div>
                        {m.message}
                      </div>
                    </div>
                  ))}
                  {thread.messages.length === 0 && (
                    <p className="text-sm text-gray-400 text-center py-4">No messages yet.</p>
                  )}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-3">
                  <Input 
                    value={newMessage} 
                    onChange={(e) => setNewMessage(e.target.value)} 
                    placeholder="Type a message..." 
                    className="flex-1"
                  />
                  <Button type="submit" className="bg-gray-900 text-white hover:bg-gray-800">Send</Button>
                </form>
              </div>
            )}
            */}
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

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <FiCheckCircle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {confirmActionType === 'verification' ? 'Submit Verification' : 'Submit Re-inspection'}
              </h3>
              <p className="text-gray-500 mb-8">
                Are you sure you want to submit this {confirmActionType}? This action cannot be undone and will be recorded permanently on the ledger.
              </p>
              <div className="flex gap-3 w-full">
                <Button 
                  onClick={() => setShowConfirmModal(false)} 
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={confirmActionType === 'verification' ? performVerificationSubmit : performReinspectionSubmit} 
                  disabled={submitting}
                  className="flex-1 bg-blue-600 text-white hover:bg-blue-700"
                >
                  {submitting ? 'Submitting...' : 'Confirm Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Flag Issue Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                  <FiAlertTriangle size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Flag Project Issue</h3>
              </div>
              
              <p className="text-sm text-gray-500 mb-6">
                Report critical issues like fraudulent documents or incorrect locations. This will pause the verification process and alert the Admin.
              </p>

              <form onSubmit={submitFlag} className="space-y-5">
                <div>
                  <Label className="text-gray-700 font-semibold block mb-2">Issue Category</Label>
                  <select 
                    value={flagCategory} 
                    onChange={(e) => setFlagCategory(e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 text-gray-900"
                  >
                    <option value="" disabled>Select a category...</option>
                    <option value="Fake / Suspicious Documents">Fake / Suspicious Documents</option>
                    <option value="Location Mismatch">Location Mismatch</option>
                    <option value="Incorrect Project Data">Incorrect Project Data</option>
                    <option value="Missing Information">Missing Information</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <Label className="text-gray-700 font-semibold block mb-2">Detailed Description</Label>
                  <Textarea 
                    required
                    value={flagDescription}
                    onChange={(e) => setFlagDescription(e.target.value)}
                    placeholder="Describe exactly what you found..."
                    className="bg-gray-50 border-gray-200 focus:ring-red-500/20 focus:border-red-500"
                    rows={4}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button 
                    type="button" 
                    onClick={() => setShowFlagModal(false)} 
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={flagging}
                    className="bg-red-600 text-white hover:bg-red-700"
                  >
                    {flagging ? 'Submitting Flag...' : 'Submit Flag'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AgentLayout>
  );
}