const { filter } = require('pdfkit');
const Oversight = require('../../models/Oversight');
const Paginate = require('../../utils/paginate')
// GET /api/admin/oversight/users?role=agent&is_seller=true&is_buyer=false
async function getAllUsers(req, res) {
  try {
    const { role, is_seller, is_buyer } = req.query;
    const filters = {};
    if (role) filters.role = role;
    if (is_seller !== undefined) filters.is_seller = is_seller === 'true';
    if (is_buyer !== undefined) filters.is_buyer = is_buyer === 'true';

    const {page , limit , offset} = Paginate.getPagination(req.query);

    filters.limit = limit;
    filters.offset = offset

    const {rows , total} = await Oversight.findAllUsers(filters);

   // const users = Paginate.paginatedResponse(rows , total , page , offset)
    return res.status(200).json({
          success: true,
          message: " User's fetched successfully",
          ...Paginate.paginatedResponse(rows, total, page, limit),
        });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

// GET /api/admin/oversight/projects?status=in_progress
async function getAllProjects(req, res) {
  try {
    const { page, limit, offset } = Paginate.getPagination(req.query);
    const { rows, total } = await Oversight.findAllProjects({ status: req.query.status || null, limit, offset });
    return res.status(200).json({
      success: true,
      message: 'Projects fetched successfully',
      ...Paginate.paginatedResponse(rows, total, page, limit),
    });
  } catch (err) {
    console.error('Get all projects error:', err);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
}

// GET /api/admin/oversight/transactions
async function getAllTransactions(req, res) {
  try {
    const { page, limit, offset } = Paginate.getPagination(req.query);
    const { rows, total } = await Oversight.findAllTransactions({ limit, offset });
    return res.status(200).json({
      success: true,
      message: 'Transactions fetched successfully',
      ...Paginate.paginatedResponse(rows, total, page, limit),
    });
  } catch (err) {
    console.error('Get all transactions error:', err);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
}

module.exports = { getAllUsers, getAllProjects, getAllTransactions };