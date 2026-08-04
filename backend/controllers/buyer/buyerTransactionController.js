const Transaction = require('../../models/Transaction');
const Paginate = require('../../utils/paginate')
// GET /api/buyer/transactions
async function getTransactionHistory(req, res) {
  try {
    const {page , limit , offset} = Paginate.getPagination(req.query)
    const {rows , total} = await Transaction.findByBuyer(req.user.id , {limit , offset});
    res.status(200).json({ 
      success:true,
      message:"Histroy Fetch Successfully",
      ...Paginate.paginatedResponse(rows , total , page , limit)
     });
  } catch (err) {
    console.error('Get buyer transaction history error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
}

module.exports = { getTransactionHistory };