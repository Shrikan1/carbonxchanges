const Dashboard = require('../../models/Dashboard');

// GET /api/agent/dashboard
async function getDashboardSummary(req, res) {
  try {
    const summary = await Dashboard.getAgentDashboardSummary(req.user.id);
    res.json({ dashboard: summary });
  } catch (err) {
    console.error('Get agent dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
}

module.exports = { getDashboardSummary };