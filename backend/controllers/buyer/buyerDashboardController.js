const Dashboard = require('../../models/Dashboard');

// GET /api/buyer/dashboard
async function getDashboardSummary(req, res) {
  try {
    const summary = await Dashboard.getBuyerDashboardSummary(req.user.id);
    res.json({ dashboard: summary });
  } catch (err) {
    console.error('Get buyer dashboard summary error:', err);
    res.status(500).json({ error: 'Failed to fetch dashboard summary' });
  }
}

module.exports = { getDashboardSummary };