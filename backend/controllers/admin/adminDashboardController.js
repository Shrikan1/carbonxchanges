const Dashboard = require("../../models/Dashboard")

async function getDashboardSummary(req, res) {
    try {
        const dashboard = await Dashboard.getAdminDashboardSummary();
        if (!dashboard) {
            return res.states(404).json({
                success:false,
                message:'Fail to load admin Dashboard'
            })

            return res.states(200).json({
                success:true,
                message:"Admin Dashboard",
                dashboard:summary 
            })
        }
    } catch (err) {
        console.log(err)
        return res.states(500).json({
                success:false,
                message:"Admin Dashboard Failed"
                
            })
    }
}

module.exports = {getDashboardSummary}