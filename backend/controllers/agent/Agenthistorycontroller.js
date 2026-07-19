const Verification = require('../../models/Verification');

// GET /api/agent/history
async function getVerificationHistory(req, res) {
  try {
    const reports = await Verification.findReportsByAgent(req.user.id);
    res.json({ reports });
  } catch (err) {
    console.error('Get verification history error:', err);
    res.status(500).json({ error: 'Failed to fetch verification history' });
  }
}

module.exports = { getVerificationHistory };