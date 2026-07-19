const Oversight = require('../../models/Oversight');

// GET /api/admin/oversight/users?role=agent&is_seller=true&is_buyer=false
async function getAllUsers(req, res) {
  try {
    const { role, is_seller, is_buyer } = req.query;
    const filters = {};
    if (role) filters.role = role;
    if (is_seller !== undefined) filters.is_seller = is_seller === 'true';
    if (is_buyer !== undefined) filters.is_buyer = is_buyer === 'true';

    const users = await Oversight.findAllUsers(filters);
    res.json({ users });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

// GET /api/admin/oversight/projects?status=in_progress
async function getAllProjects(req, res) {
  try {
    const projects = await Oversight.findAllProjects(req.query.status || null);
    res.json({ projects });
  } catch (err) {
    console.error('Get all projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

// GET /api/admin/oversight/transactions
async function getAllTransactions(req, res) {
  try {
    const transactions = await Oversight.findAllTransactions();
    res.json({ transactions });
  } catch (err) {
    console.error('Get all transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}

module.exports = { getAllUsers, getAllProjects, getAllTransactions };