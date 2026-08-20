import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as verificationApi from '../../api/endpoint/verificationApi';
import * as sellerApi from '../../api/endpoint/Sellerapi';
import api from '../../api/axiosInstance';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Label } from '../../components/ui/Label';
import FileUploadZone from '../../components/ui/FileUploadZone';
import SellerHeader from '../../components/layout/SellerHeader';
import { motion, AnimatePresence } from 'motion/react';
import {
  FiUser, FiCheckCircle, FiAlertCircle,
  FiUpload, FiSend, FiMessageSquare, FiLoader,
  FiX, FiClock
} from 'react-icons/fi';

const s = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  textTransform: 'none',
  letterSpacing: 'normal',
};

const DOC_TYPES = [
  { value: 'land_deed',         label: 'Land Deed' },
  { value: 'aadhaar',           label: 'Aadhaar Card' },
  { value: 'government_id',     label: 'Government ID' },
  { value: 'survey_report',     label: 'Survey Report' },
  { value: 'baseline_study',    label: 'Baseline Study' },
  { value: 'carbon_assessment', label: 'Carbon Assessment' },
  { value: 'other',             label: 'Other Document' },
];

export default function ProjectVerificationPage() {
  const { projectId } = useParams();
  const [status, setStatus]           = useState(null);
  const [agent, setAgent]             = useState(null);
  const [thread, setThread]           = useState({ reportId: null, messages: [] });
  const [newMessage, setNewMessage]   = useState('');
  const [docType, setDocType]         = useState('');
  const [docCid, setDocCid]           = useState('');
  const [error, setError]             = useState(null);
  const [loading, setLoading]         = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [sendingMsg, setSendingMsg]   = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documents, setDocuments]     = useState([]);
  const [project, setProject]         = useState(null);
  const [replacingKyc, setReplacingKyc] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => { loadStatus(); }, [projectId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [thread.messages]);

  async function loadStatus() {
    setLoading(true);
    try {
      const { data } = await verificationApi.getVerificationStatus(projectId);
      setStatus(data.verification);
      setProject(data.project);
      try { const r = await verificationApi.getAssignedAgent(projectId); setAgent(r.data.agent); } catch { setAgent(null); }
      const reportId = data.verification?.completion_report?.id || data.verification?.initial_report?.id;
      if (reportId) {
        const t = await verificationApi.getReportThread(reportId);
        setThread({ reportId, messages: t.data.messages });
      }
      try { const docsRes = await verificationApi.getProjectDocuments(projectId); setDocuments(docsRes.data.documents); } catch (e) { console.error('Failed to load docs'); }
    } catch (err) { setError(err.response?.data?.error || 'Failed to load verification status'); }
    finally { setLoading(false); }
  }

  async function handleUploadDoc(e) {
    e.preventDefault();
    if (!docType) { setError('Please select a document type.'); return; }
    setUploadingDoc(true); setError(null); setUploadSuccess(false);
    try {
      let cidToUse = docCid;
      if (selectedFile) {
        const fd = new FormData(); fd.append('file', selectedFile);
        const r = await api.post('/upload/kyc', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        cidToUse = r.data.path || r.data.cid || r.data.url;
      }
      if (!cidToUse) { setError('Upload a file or paste a CID.'); setUploadingDoc(false); return; }
      await verificationApi.uploadProjectDocuments(projectId, docType, cidToUse);
      setDocType(''); setDocCid(''); setSelectedFile(null);
      setUploadSuccess(true); setTimeout(() => setUploadSuccess(false), 3000);
      loadStatus();
    } catch (err) { setError(err.response?.data?.error || 'Upload failed'); }
    finally { setUploadingDoc(false); }
  }

  async function handleDeleteDoc(docId) {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      await verificationApi.deleteProjectDocument(projectId, docId);
      setUploadSuccess(true); setTimeout(() => setUploadSuccess(false), 3000);
      loadStatus();
    } catch (err) { setError(err.response?.data?.error || 'Delete failed'); }
  }

  async function handleReplaceKycDoc(docType, file) {
    if (!file) return;
    setReplacingKyc(docType);
    setError(null);
    try {
      const fd = new FormData(); fd.append('file', file);
      const r = await api.post('/upload/kyc', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const path = r.data.path || r.data.cid || r.data.url;
      if (!path) throw new Error('Upload failed to return path');
      await sellerApi.replaceKycDocument(projectId, docType, path);
      setUploadSuccess(true); setTimeout(() => setUploadSuccess(false), 3000);
      loadStatus();
    } catch (err) { setError(err.response?.data?.error || 'Failed to replace KYC document'); }
    finally { setReplacingKyc(null); }
  }

  const renderKycDoc = (docType, label, path) => {
    if (!project || !path) return null;
    const st = project.kyc_docs_status?.[docType] || { status: 'pending', reason: null };
    return (
      <div key={docType} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 gap-3">
        <div>
          <p className="text-sm font-semibold text-gray-800" style={s}>{label}</p>
          <a href={project[`${docType === 'live_photo' ? 'live_verification_photo' : docType}_signed_url`] || path} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline" style={s}>View Document</a>
        </div>
        <div className="flex items-center gap-3">
          {st.status === 'approved' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">APPROVED</span>}
          {st.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded">PENDING REVIEW</span>}
          {st.status === 'rejected' && (
            <div className="flex flex-col items-end gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded" title={st.reason}>REJECTED</span>
                <span className="text-[11px] text-red-600 font-medium">Reason: {st.reason}</span>
              </div>
              <div className="relative">
                <input type="file" onChange={(e) => handleReplaceKycDoc(docType, e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.jpg,.jpeg,.png,.webp" disabled={replacingKyc === docType} />
                <button type="button" className="text-[11px] font-bold bg-gray-900 hover:bg-gray-800 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50" disabled={replacingKyc === docType} style={s}>
                  {replacingKyc === docType ? 'Uploading...' : 'Upload Replacement'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!thread.reportId || !newMessage.trim()) return;
    setSendingMsg(true);
    try {
      const { data } = await verificationApi.sendMessage(thread.reportId, newMessage);
      setThread(p => ({ ...p, messages: [...p.messages, data.data] }));
      setNewMessage('');
    } catch (err) { setError(err.response?.data?.error || 'Failed to send'); }
    finally { setSendingMsg(false); }
  }

  const st = status?.status || 'pending';

  if (loading) return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader title="Verification" contentMaxWidth="800px" />
      <div className="flex-grow flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-400"></div></div>
    </div>
  );

  return (
    <div className="admin-theme min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader title="Verification" description="Track progress and upload documents." contentMaxWidth="800px" />

      <div className="w-full max-w-[800px] px-4 md:px-8 space-y-5">

        {/* banners */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm" style={s}>
            <FiAlertCircle size={16} /> <span className="flex-grow">{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><FiX size={14} /></button>
          </div>
        )}
        {uploadSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center gap-2 text-sm" style={s}>
            <FiCheckCircle size={16} /> Document uploaded successfully.
          </div>
        )}

        {/* ── Status ──────────────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 font-medium mb-1" style={s}>Status</p>
              <span className={`inline-block text-xs font-bold px-2.5 py-1 rounded-full ${
                st === 'approved'  ? 'bg-emerald-100 text-emerald-700' :
                st === 'rejected'  ? 'bg-red-100 text-red-700' :
                st === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                'bg-orange-100 text-orange-700'
              }`} style={s}>
                {st === 'in_progress' ? 'In Progress' : st === 'changes_requested' ? 'Changes Requested' : st.charAt(0).toUpperCase() + st.slice(1)}
              </span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400 font-medium mb-1" style={s}>Agent</p>
              <p className="text-sm font-semibold text-gray-800" style={s}>{agent?.name || '—'}</p>
            </div>
          </div>
          {status?.expected_completion_date && (
            <p className="text-xs text-gray-400 mt-4 pt-3 border-t border-gray-100" style={s}>
              Expected: <span className="text-gray-600 font-medium">{new Date(status.expected_completion_date).toLocaleDateString()}</span>
            </p>
          )}
        </div>

        {/* ── Upload Document ─────────────────────────────── */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-base font-bold text-gray-900 mb-1" style={s}>Upload Document</h3>
          <p className="text-xs text-gray-400 mb-5" style={s}>Upload supporting KYC or project documents.</p>

          <form onSubmit={handleUploadDoc} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-600" style={s}>Document Type</Label>
              <Select value={docType} onChange={(e) => setDocType(e.target.value)}
                className="mt-1 h-10 bg-gray-50 border-gray-200 rounded-lg w-full text-sm" style={s}>
                <option value="" disabled>Select type</option>
                {DOC_TYPES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </Select>
            </div>

            <FileUploadZone
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              maxSizeMB={10}
              formats=".pdf, .jpg, .png and .webp files"
              mediaType="document"
              uploading={uploadingDoc}
              pendingFile={selectedFile}
              onClearPending={() => setSelectedFile(null)}
              onFileSelect={(f) => setSelectedFile(f)}
            />

            <div className="flex items-center gap-3">
              <div className="flex-grow h-px bg-gray-200"></div>
              <span className="text-[11px] text-gray-400" style={s}>or paste CID</span>
              <div className="flex-grow h-px bg-gray-200"></div>
            </div>

            <Input placeholder="IPFS CID" value={docCid} onChange={(e) => setDocCid(e.target.value)}
              className="h-10 bg-gray-50 border-gray-200 rounded-lg text-sm" style={s} />

            <Button type="submit" disabled={uploadingDoc || (!selectedFile && !docCid)}
              className="w-full h-10 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-lg disabled:opacity-40" style={s}>
              {uploadingDoc ? 'Uploading...' : 'Upload'}
            </Button>
          </form>
        </div>

        {/* ── Core Identity Documents ────────────────────── */}
        {project && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={s}>Core Identity Documents</h3>
            <div className="space-y-3">
              {renderKycDoc('aadhaar', 'Owner ID (KYC)', project.aadhaar_doc_signed_url)}
              {renderKycDoc('land_deed', 'Land Deed', project.land_deed_signed_url)}
              {renderKycDoc('live_photo', 'Live Photo (KYC)', project.live_verification_photo_signed_url)}
            </div>
          </div>
        )}

        {/* ── Your Documents ─────────────────────────────── */}
        {documents.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={s}>Your Documents</h3>
            <div className="space-y-3">
              {documents.map(doc => (
                <div key={doc.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50 gap-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-800" style={s}>{doc.doc_type.replace(/_/g, ' ').toUpperCase()}</p>
                    <a href={`https://gateway.pinata.cloud/ipfs/${doc.ipfs_cid}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline" style={s}>View Document</a>
                  </div>
                  <div className="flex items-center gap-3">
                    {doc.status === 'approved' && <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded">APPROVED</span>}
                    {doc.status === 'pending' && <span className="bg-yellow-100 text-yellow-800 text-[10px] font-bold px-2 py-1 rounded">PENDING REVIEW</span>}
                    {doc.status === 'rejected' && (
                      <div className="flex items-center gap-2">
                        <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded" title={doc.rejection_reason}>REJECTED</span>
                        <button type="button" onClick={() => handleDeleteDoc(doc.id)} className="text-[11px] font-bold bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded transition-colors" style={s}>Delete & Re-upload</button>
                      </div>
                    )}
                  </div>
                  {doc.status === 'rejected' && doc.rejection_reason && (
                    <div className="w-full sm:w-auto text-xs text-red-600 bg-red-50 p-2 rounded sm:hidden block mt-1" style={s}>
                      Reason: {doc.rejection_reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Messages ────────────────────────────────────── */}
        {thread.reportId && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-base font-bold text-gray-900 mb-4" style={s}>Messages</h3>

            <div className="bg-gray-50 rounded-xl p-4 max-h-72 overflow-y-auto space-y-3 mb-4 border border-gray-100">
              {thread.messages.length === 0
                ? <p className="text-sm text-gray-400 text-center py-6" style={s}>No messages yet.</p>
                : thread.messages.map(m => (
                    <div key={m.id} className="flex gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 shrink-0 mt-0.5"><FiUser size={11} /></div>
                      <div>
                        <p className="text-[11px] text-gray-400 mb-0.5" style={s}>
                          <span className="font-semibold text-gray-700">{m.sender_name}</span>
                          {m.created_at && <> · {new Date(m.created_at).toLocaleString()}</>}
                        </p>
                        <p className="text-sm text-gray-700 leading-relaxed" style={s}>{m.message}</p>
                      </div>
                    </div>
                  ))
              }
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..."
                className="flex-grow h-10 bg-gray-50 border-gray-200 rounded-lg text-sm" style={s} />
              <Button type="submit" disabled={sendingMsg || !newMessage.trim()}
                className="h-10 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-lg disabled:opacity-40 shrink-0">
                {sendingMsg ? <FiLoader className="animate-spin" size={14} /> : <FiSend size={14} />}
              </Button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}