// src/pages/seller/ProjectVerificationPage.jsx
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as verificationApi from '../../api/endpoint/verificationApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export default function ProjectVerificationPage() {
  const { projectId } = useParams();
  const [status, setStatus] = useState(null);
  const [agent, setAgent] = useState(null);
  const [thread, setThread] = useState({ reportId: null, messages: [] });
  const [newMessage, setNewMessage] = useState('');
  const [docType, setDocType] = useState('');
  const [docCid, setDocCid] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    loadStatus();
  }, [projectId]);

  async function loadStatus() {
    try {
      const { data } = await verificationApi.getVerificationStatus(projectId);
      setStatus(data.verification);

      // Agent may not be assigned yet — 404 is expected, not an error to surface
      try {
        const agentRes = await verificationApi.getAssignedAgent(projectId);
        setAgent(agentRes.data.agent);
      } catch {
        setAgent(null);
      }

      // Load the thread for whichever report exists (completion report takes
      // priority if both exist, since that's the more recent/active one)
      const reportId = data.verification?.completion_report?.id || data.verification?.initial_report?.id;
      if (reportId) {
        const threadRes = await verificationApi.getReportThread(reportId);
        setThread({ reportId, messages: threadRes.data.messages });
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load verification status');
    }
  }

  async function handleUploadDoc(e) {
    e.preventDefault();
    try {
      await verificationApi.uploadProjectDocuments(projectId, docType, docCid);
      setDocType('');
      setDocCid('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to record document');
    }
  }

  async function handleSendMessage(e) {
    e.preventDefault();
    if (!thread.reportId || !newMessage.trim()) return;
    const { data } = await verificationApi.sendMessage(thread.reportId, newMessage);
    setThread((prev) => ({ ...prev, messages: [...prev.messages, data.data] }));
    setNewMessage('');
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Verification</h1>
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="border border-border rounded-lg p-4">
        <p className="text-sm">Status: <span className="font-medium">{status?.status}</span></p>
        {status?.expected_completion_date && (
          <p className="text-sm text-muted-foreground">
            Expected completion: {new Date(status.expected_completion_date).toLocaleDateString()}
          </p>
        )}
        <p className="text-sm mt-2">Assigned agent: {agent ? agent.name : 'Not yet assigned'}</p>
      </div>

      <form onSubmit={handleUploadDoc} className="border border-border rounded-lg p-4 space-y-3">
        <h2 className="font-semibold">Upload Document</h2>
        <p className="text-xs text-muted-foreground">
          Note: real file upload via IPFS is handled elsewhere — paste a CID here for now.
        </p>
        <Input placeholder="Document type (e.g. land_deed)" value={docType} onChange={(e) => setDocType(e.target.value)} />
        <Input placeholder="IPFS CID" value={docCid} onChange={(e) => setDocCid(e.target.value)} />
        <Button type="submit">Record Document</Button>
      </form>

      {thread.reportId && (
        <div className="border border-border rounded-lg p-4 space-y-3">
          <h2 className="font-semibold">Messages with Agent</h2>
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