const Credit = require('../../models/Credit');

// GET /api/credits/issued
async function getIssuedCredits(req, res) {
    try {
        const credits = await Credit.findCreditsBySeller(req.user.id);
        res.json({ credits });
    } catch (err) {
        console.error('Get issued credits error:', err);
        res.status(500).json({ error: 'Failed to fetch issued credits' });
    }
}

// GET /api/credits/history
async function viewCreditHistory(req, res) {
    try {
        const transactions = await Credit.findCreditTransactions(req.user.id);
        res.json({ transactions });
    } catch (err) {
        console.error('View credit history error:', err);
        res.status(500).json({ error: 'Failed to fetch credit history' });
    }
}

// GET /api/credits/balance
async function viewCreditBalance(req, res) {
    try {
        const balance = await Credit.calculateSellerBalance(req.user.id);
        res.json({ balance });
    } catch (err) {
        console.error('View credit balance error:', err);
        res.status(500).json({ error: 'Failed to fetch credit balance' });
    }
}

module.exports = { getIssuedCredits, viewCreditHistory, viewCreditBalance };