const Portfolio = require('../../models/Portfolio');

// GET /api/buyer/portfolio
async function getPortfolio(req, res) {
  try {
    const [holdings, summary] = await Promise.all([
      Portfolio.findPortfolioByBuyer(req.user.id),
      Portfolio.getPortfolioSummary(req.user.id),
    ]);

    res.json({ summary, holdings });
  } catch (err) {
    console.error('Get portfolio error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}

module.exports = { getPortfolio };