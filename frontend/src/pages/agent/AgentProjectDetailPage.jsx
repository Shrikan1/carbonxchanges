import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import * as agentApi from '../../api/endpoint/agentApi';
import LocationMap from '../../components/LocationMap';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Label } from '../../components/ui/Label';

const EMPTY_VERIFICATION_FORM = { gps_lat: '', gps_lng: '', photo_ipfs_cid: '', notes: '', verified_co2_amount: '' };
const EMPTY_REINSPECTION_FORM = { gps_lat: '', gps_lng: '', photo_ipfs_cid: '', notes: '', reversal_detected: false, reversal_amount: '' };

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

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    const { data } = await agentApi.getAssignedProjectDetails(id);
    setProject(data.project);

    const docsRes = await agentApi.getProjectDocuments(id);
    setDocuments(docsRes.data.documents);

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
  }

  function setVerifyField(name, value) {
    setVerifyForm((prev) => ({ ...prev, [name]: value }));
  }

  function setReinspectField(name, value) {
    setReinspectForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmitVerification(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        gps_lat: Number(verifyForm.gps_lat),
        gps_lng: Number(verifyForm.gps_lng),
        photo_ipfs_cid: verifyForm.photo_ipfs_cid,
        notes: verifyForm.notes,
      };
      let data;
      if (project.status === 'assigned') {
        ({ data } = await agentApi.submitInitialVerification(id, payload));
      } else {
        payload.verified_co2_amount = Number(verifyForm.verified_co2_amount);
        ({ data } = await agentApi.submitCompletionVerification(id, payload));
      }
      alert(data.message);
      setVerifyForm(EMPTY_VERIFICATION_FORM);
      load();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit verification');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSubmitReinspection(e) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { data } = await agentApi.submitReinspection(id, {
        gps_lat: Number(reinspectForm.gps_lat),
        gps_lng: Number(reinspectForm.gps_lng),
        photo_ipfs_cid: reinspectForm.photo_ipfs_cid,
        notes: reinspectForm.notes,
        reversal_detected: reinspectForm.reversal_detected,
        reversal_amount: reinspectForm.reversal_detected ? Number(reinspectForm.reversal_amount) : undefined,
      });
      alert(data.message);
      setReinspectForm(EMPTY_REINSPECTION_FORM);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit re-inspection');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!thread.reportId || !newMessage.trim()) return;
    const { data } = await agentApi.sendMessage(thread.reportId, newMessage);
    setThread((prev) => ({ ...prev, messages: [...prev.messages, data.data] }));
    setNewMessage('');
  }

  if (!project) return <div className="p-8">Loading...</div>;

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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <button onClick={() => navigate(-1)} className="text-sm text-muted-foreground">&larr; Back</button>

      <div>
        <h1 className="text-2xl font-bold">{project.title}</h1>
        <p className="text-sm text-muted-foreground">
          {project.project_type} — Status: <span className="font-medium">{project.status}</span>
        </p>
      </div>

      {mapMarkers.length > 0 && <LocationMap markers={mapMarkers} zoom={12} />}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="border border-border rounded-lg p-4 space-y-2">
        <h2 className="font-semibold">Documents</h2>
        {documents.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded yet.</p>}
        {documents.map((d) => (
          <p key={d.id} className="text-sm">{d.doc_type}: {d.ipfs_cid}</p>
        ))}
      </div>

      {(project.status === 'assigned' || project.status === 'in_progress') && (
        <form onSubmit={handleSubmitVerification} className="border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">
            {project.status === 'assigned' ? 'Initial Verification' : 'Completion Verification'}
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>GPS Latitude</Label>
              <Input type="number" step="any" required value={verifyForm.gps_lat} onChange={(e) => setVerifyField('gps_lat', e.target.value)} />
            </div>
            <div>
              <Label>GPS Longitude</Label>
              <Input type="number" step="any" required value={verifyForm.gps_lng} onChange={(e) => setVerifyField('gps_lng', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Field Photo (IPFS CID)</Label>
            <Input required value={verifyForm.photo_ipfs_cid} onChange={(e) => setVerifyField('photo_ipfs_cid', e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={verifyForm.notes} onChange={(e) => setVerifyField('notes', e.target.value)} />
          </div>
          {project.status === 'in_progress' && (
            <div>
              <Label>Verified CO2 Amount (tonnes)</Label>
              <Input type="number" step="0.01" required value={verifyForm.verified_co2_amount} onChange={(e) => setVerifyField('verified_co2_amount', e.target.value)} />
            </div>
          )}
          <Button type="submit" disabled={submitting}>
            {submitting ? 'Submitting...' : `Submit ${project.status === 'assigned' ? 'Initial' : 'Completion'} Verification`}
          </Button>
        </form>
      )}

      {project.status === 'minted' && (
        <form onSubmit={handleSubmitReinspection} className="border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Re-inspection (Post-mint Monitoring)</h2>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>GPS Latitude</Label>
              <Input type="number" step="any" required value={reinspectForm.gps_lat} onChange={(e) => setReinspectField('gps_lat', e.target.value)} />
            </div>
            <div>
              <Label>GPS Longitude</Label>
              <Input type="number" step="any" required value={reinspectForm.gps_lng} onChange={(e) => setReinspectField('gps_lng', e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Field Photo (IPFS CID)</Label>
            <Input required value={reinspectForm.photo_ipfs_cid} onChange={(e) => setReinspectField('photo_ipfs_cid', e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea value={reinspectForm.notes} onChange={(e) => setReinspectField('notes', e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={reinspectForm.reversal_detected}
              onChange={(e) => setReinspectField('reversal_detected', e.target.checked)}
            />
            Reversal detected
          </label>
          {reinspectForm.reversal_detected && (
            <div>
              <Label>Reversal Amount (tonnes)</Label>
              <Input type="number" step="0.01" required value={reinspectForm.reversal_amount} onChange={(e) => setReinspectField('reversal_amount', e.target.value)} />
            </div>
          )}
          <Button type="submit" disabled={submitting}>{submitting ? 'Submitting...' : 'Submit Re-inspection'}</Button>
        </form>
      )}

      {thread.reportId && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Messages with Seller</h2>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {thread.messages.map((m) => (
              <div key={m.id} className="text-sm">
                <span className="font-medium">{m.sender_name}: </span>{m.message}
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." />
            <Button type="submit">Send</Button>
          </form>
        </div>
      )}
    </div>
  );
}