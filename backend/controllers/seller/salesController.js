const Sales = require('../../models/Sales');

// GET /api/sales/history
async function getSalesHistory(req, res) {
  try {
    const sales = await Sales.findSalesHistory(req.user.id);
    const revenue = await Sales.calculateRevenue(req.user.id);
    res.json({ sales, revenue });
  } catch (err) {
    console.error('Get sales history error:', err);
    res.status(500).json({ error: 'Failed to fetch sales history' });
  }
}

// GET /api/sales/report/download
async function downloadSalesReport(req, res) {
  try {
    const sales = await Sales.findSalesHistory(req.user.id);

    const header = ['Date', 'Project', 'Buyer', 'Credits Sold', 'Price/Credit', 'Total', 'Tx Hash'];
    const rows = sales.map((s) => [
      new Date(s.created_at).toISOString().split('T')[0],
      csvEscape(s.project_title),
      csvEscape(s.buyer_name || 'Unknown'),
      s.amount,
      s.price_per_credit,
      s.total_price,
      s.tx_hash,
    ]);

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="sales_report_${Date.now()}.csv"`);
    res.send(csv);
  } catch (err) {
    console.error('Download sales report error:', err);
    res.status(500).json({ error: 'Failed to generate sales report' });
  }
}

// Wraps a value in quotes if it contains a comma, so CSV columns don't shift
function csvEscape(value) {
  if (value == null) return '';
  const str = String(value);
  return str.includes(',') ? `"${str.replace(/"/g, '""')}"` : str;
}

module.exports = { getSalesHistory, downloadSalesReport };