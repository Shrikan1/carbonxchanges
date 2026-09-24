const PendingSale = require('../../models/PendingSale');
const Notification = require('../../models/Notification');
const User = require('../../models/User');

// POST /api/buyer/purchase/intent
// Buyer expresses intent — no MetaMask needed here.
// Reserves stock immediately so it can't be oversold while seller prepares.
async function createPurchaseIntent(req, res) {
  try {
    const { listing_id, amount } = req.body;
    if (!listing_id || !amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'listing_id and a positive amount are required' });
    }

    const buyer = await User.findById(req.user.id);
    if (!buyer.wallet_address) {
      return res.status(400).json({
        error: 'Connect a wallet first — the seller needs your address to send tokens to.',
      });
    }

    const { sale, listing } = await PendingSale.createPendingSale(
      Number(listing_id),
      req.user.id,
      Number(amount)
    );

    // Notify the seller so they can action it from their Sales page
    await Notification.createNotification(
      listing.seller_id,
      'New Purchase Request',
      `${buyer.name} wants to buy ${amount} credits from your listing.`
    ).catch(() => {}); // non-fatal — don't fail the response if notifications break

    res.status(201).json({
      message: 'Purchase request sent. The seller will be notified to complete the transfer.',
      sale,
    });
  } catch (err) {
    if (err.code === 'INSUFFICIENT_STOCK') return res.status(409).json({ error: err.message });
    if (err.code === 'LISTING_NOT_ACTIVE') return res.status(400).json({ error: err.message });
    if (err.code === 'LISTING_NOT_FOUND')  return res.status(404).json({ error: err.message });
    console.error('Purchase intent error:', err);
    res.status(500).json({ error: 'Failed to create purchase request' });
  }
}

// GET /api/buyer/purchase/intents
// Buyer's own purchase intents (pending, completed, rejected)
async function getMyPurchaseIntents(req, res) {
  try {
    const sales = await PendingSale.findPendingSalesByBuyer(req.user.id);
    res.json({ sales });
  } catch (err) {
    console.error('Get purchase intents error:', err);
    res.status(500).json({ error: 'Failed to fetch purchase requests' });
  }
}

module.exports = { createPurchaseIntent, getMyPurchaseIntents };
