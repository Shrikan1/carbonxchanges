const Dashboard = require('../../models/Dashboard');

async function getDashboardSummary(req, res) {
    try {
        const dashboard = await Dashboard.getAdminDashboardSummary();
        res.json({ success: true, message: 'Admin Dashboard', dashboard });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: 'Admin Dashboard Failed',
        });
    }
}

module.exports = { getDashboardSummary };