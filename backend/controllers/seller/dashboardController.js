const Dashboard = require('../../models/Dashboard');

// GET /api/dashboard
async function getDashboardSummary(req, res) {
  try {
    const summary = await Dashboard.getDashboardSummary(req.user.id);
    res.json({ dashboard: summary });
  } catch (err) {
    console.error('Get dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
}

module.exports = { getDashboardSummary };