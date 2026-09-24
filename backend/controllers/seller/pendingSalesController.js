const PendingSale = require('../../models/PendingSale');
const Notification = require('../../models/Notification');
const blockchainService = require('../../services/blockchainService');
const User = require('../../models/User');

// GET /api/seller/sales/pending
async function getPendingSales(req, res) {
  try {
    const sales = await PendingSale.findPendingSalesBySeller(req.user.id);
    res.json({ sales });
  } catch (err) {
    console.error('Get pending sales error:', err);
    res.status(500).json({ error: 'Failed to fetch pending sales' });
  }
}

// POST /api/seller/sales/:saleId/complete   body: { tx_hash }
// Seller signs the on-chain ERC-1155 transfer in MetaMask, then submits
// the tx_hash here. Backend verifies the chain event before recording anything.
async function completeSale(req, res) {
  try {
    const saleId = Number(req.params.saleId);
    const { tx_hash } = req.body;
    if (!tx_hash) return res.status(400).json({ error: 'tx_hash is required' });

    // Fetch full sale detail for on-chain verification
    const sales = await PendingSale.findPendingSalesBySeller(req.user.id);
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) return res.status(404).json({ error: 'Pending sale not found' });
    if (sale.status !== 'pending') return res.status(400).json({ error: `Sale is already ${sale.status}` });

    const seller = await User.findById(req.user.id);

    const verification = await blockchainService.verifyPurchaseTransaction({
      txHash: tx_hash,
      expectedAmount: sale.amount,
      expectedBuyer: sale.buyer_wallet,
      expectedSeller: seller.wallet_address,
      tokenId: sale.batch_id,
    });
    if (!verification.valid) {
      return res.status(400).json({ error: verification.reason || 'On-chain transfer could not be verified' });
    }

    const { transaction } = await PendingSale.completePendingSale(saleId, req.user.id, tx_hash);

    // Notify buyer their tokens are on the way
    await Notification.createNotification(
      sale.buyer_id,
      'Transfer Complete',
      `${seller.name} has transferred ${sale.amount} credits to your wallet.`
    ).catch(() => {});

    res.json({
      message: 'Sale completed. Buyer portfolio has been updated.',
      transaction,
    });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Complete sale error:', err);
    res.status(500).json({ error: 'Failed to complete sale' });
  }
}

// POST /api/seller/sales/:saleId/reject
async function rejectSale(req, res) {
  try {
    const saleId = Number(req.params.saleId);
    const sale = await PendingSale.rejectPendingSale(saleId, req.user.id);

    await Notification.createNotification(
      sale.buyer_id,
      'Purchase Request Rejected',
      `Your request to purchase ${sale.amount} credits has been declined.`
    ).catch(() => {});

    res.json({ message: 'Purchase request rejected. Stock has been released.' });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('Reject sale error:', err);
    res.status(500).json({ error: 'Failed to reject sale' });
  }
}

module.exports = { getPendingSales, completeSale, rejectSale };
