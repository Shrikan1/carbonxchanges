const Transaction = require('../../models/Transaction');

// GET /api/buyer/transactions
async function getTransactionHistory(req, res) {
  try {
    const transactions = await Transaction.findByBuyer(req.user.id);
    res.json({ transactions });
  } catch (err) {
    console.error('Get buyer transaction history error:', err);
    res.status(500).json({ error: 'Failed to fetch transaction history' });
  }
}

module.exports = { getTransactionHistory };