const Verification = require('../../models/Verification');
const VerificationMessage = require('../../models/VerificationMessage');

// GET /api/agent/reports/:reportId/messages
async function getReportThread(req, res) {
  try {
    const report = await Verification.findReportById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Verification report not found' });

    if (report.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not the agent for this report' });
    }

    const messages = await VerificationMessage.findByReport(req.params.reportId);
    res.json({ report, messages });
  } catch (err) {
    console.error('Get report thread error:', err);
    res.status(500).json({ error: 'Failed to fetch report thread' });
  }
}

// POST /api/agent/reports/:reportId/messages   body: { message }
async function sendMessage(req, res) {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'message is required' });
    }

    const report = await Verification.findReportById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Verification report not found' });

    if (report.agent_id !== req.user.id) {
      return res.status(403).json({ error: 'You are not the agent for this report' });
    }

    const newMessage = await VerificationMessage.createMessage(req.params.reportId, req.user.id, message.trim());
    res.status(201).json({ message: 'Message sent', data: newMessage });
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
}

module.exports = { getReportThread, sendMessage };