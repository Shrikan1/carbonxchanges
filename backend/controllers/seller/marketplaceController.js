const { query } = require('../../config/db');
const Listing = require('../../models/Listing');
const Credit = require('../../models/Credit');

// POST /api/marketplace/listings   body: { batch_id, price_per_credit, amount_listed }
async function createCreditListing(req, res) {
  try {
    const { batch_id, price_per_credit, amount_listed } = req.body;
    if (!batch_id || !price_per_credit || !amount_listed) {
      return res.status(400).json({ error: 'batch_id, price_per_credit, and amount_listed are required' });
    }
    if (price_per_credit <= 0 || amount_listed <= 0) {
      return res.status(400).json({ error: 'price_per_credit and amount_listed must be positive' });
    }

    // Confirm this batch belongs to a project owned by the requesting seller
    const batchResult = await query(
      `SELECT cb.*, p.seller_id
       FROM credit_batches cb
       JOIN projects p ON p.id = cb.project_id
       WHERE cb.id = $1`,
      [batch_id]
    );
    const batch = batchResult.rows[0];
    if (!batch) return res.status(404).json({ error: 'Credit batch not found' });
    if (batch.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this credit batch' });
    }

    const balance = await Credit.calculateSellerBalance(req.user.id);
    const reserved = await Listing.getReservedAmountBySeller(req.user.id);
    const available = balance.remaining_balance - reserved;

    if (amount_listed > available) {
      return res.status(400).json({
        error: `Cannot list ${amount_listed} credits — only ${available} available (unsold and not already listed)`,
      });
    }

    const listing = await Listing.createListing(batch_id, req.user.id, price_per_credit, amount_listed);
    res.status(201).json({ message: 'Listing created', listing });
  } catch (err) {
    console.error('Create listing error:', err);
    res.status(500).json({ error: 'Failed to create listing' });
  }
}

// PUT /api/marketplace/listings/:id/price   body: { price_per_credit, amount_listed? }
async function updateCreditPrice(req, res) {
  try {
    const listing = await Listing.findListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this listing' });
    }
    if (listing.status !== 'active') {
      return res.status(400).json({ error: `Cannot update a ${listing.status} listing` });
    }

    const updated = await Listing.updateListing(req.params.id, req.body);
    res.json({ message: 'Listing updated', listing: updated });
  } catch (err) {
    console.error('Update listing error:', err);
    res.status(500).json({ error: 'Failed to update listing' });
  }
}

// DELETE /api/marketplace/listings/:id
async function cancelListing(req, res) {
  try {
    const listing = await Listing.findListingById(req.params.id);
    if (!listing) return res.status(404).json({ error: 'Listing not found' });
    if (listing.seller_id !== req.user.id) {
      return res.status(403).json({ error: 'You do not own this listing' });
    }
    if (listing.status !== 'active') {
      return res.status(400).json({ error: `Listing is already ${listing.status}` });
    }

    const cancelled = await Listing.deleteListing(req.params.id);
    res.json({ message: 'Listing cancelled', listing: cancelled });
  } catch (err) {
    console.error('Cancel listing error:', err);
    res.status(500).json({ error: 'Failed to cancel listing' });
  }
}

// GET /api/marketplace/listings/mine
async function getMyListings(req, res) {
  try {
    const listings = await Listing.findSellerListings(req.user.id);
    res.json({ listings });
  } catch (err) {
    console.error('Get my listings error:', err);
    res.status(500).json({ error: 'Failed to fetch your listings' });
  }
}

module.exports = { createCreditListing, updateCreditPrice, cancelListing, getMyListings };