const Credit = require('../../models/Credit');
const Paginate = require('../../utils/paginate')
// GET /api/credits/issued
async function getIssuedCredits(req, res) {
    try {
        const {page , limit , offset} = Paginate.getPagination(req.query);
        const {rows , total} = await Credit.findCreditsBySeller(req.user.id , {limit , offset});
         res.status(200).json({ 
                  success:true,
                  message:"Credit Fetch Successfully",
                  ...Paginate.paginatedResponse(rows , total , page , limit)
                 });
    } catch (err) {
        console.error('Get issued credits error:', err);
        res.status(500).json({ error: 'Failed to fetch issued credits' });
    }
}

// GET /api/credits/history
async function viewCreditHistory(req, res) {
    try {
        const {page , limit , offset} = Paginate.getPagination(req.query);
        const {rows , total} = await Credit.findCreditTransactions(req.user.id , {limit , offset});
         res.status(200).json({ 
                  success:true,
                  message:"Listing Fetch Successfully",
                  ...Paginate.paginatedResponse(rows , total , page , limit)
                 });
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