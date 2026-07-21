const Listing = require('../../models/Listing');
const Transaction = require('../../models/Transaction');
const User = require('../../models/User');
const blockchainService = require('../../services/blockchainService');

// POST /api/buyer/purchase   body: { listing_id, amount, tx_hash }
//
// The buyer has already signed and sent the on-chain transfer themselves via
// MetaMask before calling this — tx_hash is the result. This endpoint does
// NOT just trust that hash; it independently verifies it against the chain
// (see blockchainService.verifyPurchaseTransaction) before recording
// anything or touching listing stock. Currently that verification is a
// STUB (always returns valid) until contracts are deployed — see the loud
// warning it logs.
async function purchaseCredits(req, res) {
  try {
    const { listing_id, amount, tx_hash } = req.body;
    if (!listing_id || !amount || !tx_hash) {
      return res.status(400).json({ error: 'listing_id, amount, and tx_hash are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: 'amount must be positive' });
    }

    const buyer = await User.findById(req.user.id);
    if (!buyer.wallet_address) {
      return res.status(400).json({ error: 'Connect a wallet before purchasing' });
    }

    const listing = await Listing.findListingPublicById(listing_id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.status !== 'active') {
      return res.status(400).json({ error: `Listing is ${listing.status}, not available for purchase` });
    }

    const seller = await User.findById(listing.seller_id);

    const verification = await blockchainService.verifyPurchaseTransaction({
      txHash: tx_hash,
      expectedAmount: amount,
      expectedBuyer: buyer.wallet_address,
      expectedSeller: seller.wallet_address,
    });
    if (!verification.valid) {
      return res.status(400).json({ error: verification.reason || 'Transaction could not be verified on-chain' });
    }

    // Row-locked update — prevents overselling if two buyers purchase
    // near-simultaneously (see Listing.purchaseFromListing)
    let updatedListing;
    try {
      updatedListing = await Listing.purchaseFromListing(listing_id, amount);
    } catch (err) {
      if (err.code === 'INSUFFICIENT_STOCK') return res.status(409).json({ error: err.message });
      if (err.code === 'LISTING_NOT_ACTIVE') return res.status(400).json({ error: err.message });
      if (err.code === 'LISTING_NOT_FOUND') return res.status(404).json({ error: err.message });
      throw err;
    }

    const transaction = await Transaction.createPurchaseTransaction(
      listing.batch_id, req.user.id, listing.seller_id, tx_hash, amount, listing.price_per_credit
    );

    res.status(201).json({
      message: 'Purchase recorded successfully',
      transaction,
      listing: updatedListing,
    });
  } catch (err) {
    console.error('Purchase credits error:', err);
    res.status(500).json({ error: 'Failed to process purchase' });
  }
}

module.exports = { purchaseCredits };