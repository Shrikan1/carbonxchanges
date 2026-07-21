const { pool, query } = require('../config/db');

async function createListing(batchId, sellerId, pricePerCredit, amountListed) {
  const result = await query(
    `INSERT INTO credit_listings (batch_id, seller_id, price_per_credit, amount_listed)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [batchId, sellerId, pricePerCredit, amountListed]
  );
  return result.rows[0];
}

async function findListingById(listingId) {
  const result = await query(
    `SELECT cl.*, cb.project_id, p.title AS project_title
     FROM credit_listings cl
     JOIN credit_batches cb ON cb.id = cl.batch_id
     JOIN projects p ON p.id = cb.project_id
     WHERE cl.id = $1`,
    [listingId]
  );
  return result.rows[0] || null;
}

// Only allows updating price and/or the listed amount — never amount_sold
// or status directly through here (status changes go through cancelListing
// or the future purchase-completion logic).
async function updateListing(listingId, { price_per_credit, amount_listed }) {
  const fields = [];
  const values = [];
  let i = 1;

  if (price_per_credit !== undefined) {
    fields.push(`price_per_credit = $${i++}`);
    values.push(price_per_credit);
  }
  if (amount_listed !== undefined) {
    fields.push(`amount_listed = $${i++}`);
    values.push(amount_listed);
  }
  if (fields.length === 0) return findListingById(listingId);

  values.push(listingId);
  await query(
    `UPDATE credit_listings SET ${fields.join(', ')}, updated_at = NOW() WHERE id = $${i}`,
    values
  );
  return findListingById(listingId);
}

// Soft "delete" — marks the listing cancelled rather than removing the row,
// so purchase/sales history referencing this listing_id stays intact.
async function deleteListing(listingId) {
  const result = await query(
    `UPDATE credit_listings SET status = 'cancelled', updated_at = NOW() WHERE id = $1 RETURNING *`,
    [listingId]
  );
  return result.rows[0];
}

async function findSellerListings(sellerId) {
  const result = await query(
    `SELECT cl.*, cb.project_id, p.title AS project_title
     FROM credit_listings cl
     JOIN credit_batches cb ON cb.id = cl.batch_id
     JOIN projects p ON p.id = cb.project_id
     WHERE cl.seller_id = $1
     ORDER BY cl.created_at DESC`,
    [sellerId]
  );
  return result.rows;
}

// Sum of credits currently "locked" in active listings (listed but not yet
// sold) — used to prevent a seller from listing more credits than they
// actually have unlisted, on top of what's already sold.
async function getReservedAmountBySeller(sellerId) {
  const result = await query(
    `SELECT COALESCE(SUM(amount_listed - amount_sold), 0) AS reserved
     FROM credit_listings
     WHERE seller_id = $1 AND status = 'active'`,
    [sellerId]
  );
  return Number(result.rows[0].reserved);
}

// Public marketplace browse — only active listings with remaining stock,
// with optional filters. This is intentionally NOT scoped to any user;
// browsing doesn't require being logged in as a buyer at all (only the
// actual purchase does, via ensureBuyer).
async function findActiveListings(filters = {}) {
  const conditions = [`cl.status = 'active'`, `(cl.amount_listed - cl.amount_sold) > 0`];
  const values = [];
  let i = 1;

  if (filters.project_type) { conditions.push(`p.project_type = $${i++}`); values.push(filters.project_type); }
  if (filters.country) { conditions.push(`pd.country = $${i++}`); values.push(filters.country); }
  if (filters.min_price) { conditions.push(`cl.price_per_credit >= $${i++}`); values.push(filters.min_price); }
  if (filters.max_price) { conditions.push(`cl.price_per_credit <= $${i++}`); values.push(filters.max_price); }

  const result = await query(
    `SELECT cl.id AS listing_id, cl.price_per_credit, cl.amount_listed, cl.amount_sold,
            (cl.amount_listed - cl.amount_sold) AS amount_available, cl.created_at,
            p.id AS project_id, p.title AS project_title, p.project_type, p.project_scale,
            pd.country, pd.state_region, pd.latitude, pd.longitude,
            u.name AS seller_name
     FROM credit_listings cl
     JOIN credit_batches cb ON cb.id = cl.batch_id
     JOIN projects p ON p.id = cb.project_id
     LEFT JOIN project_details pd ON pd.project_id = p.id
     JOIN users u ON u.id = cl.seller_id
     WHERE ${conditions.join(' AND ')}
     ORDER BY cl.created_at DESC`,
    values
  );
  return result.rows;
}

// Full detail for one listing — the buyer's "product page" before purchasing
async function findListingPublicById(listingId) {
  const result = await query(
    `SELECT cl.*, (cl.amount_listed - cl.amount_sold) AS amount_available,
            p.id AS project_id, p.title AS project_title, p.project_type, p.project_scale,
            pd.country, pd.state_region, pd.latitude, pd.longitude, pd.project_summary,
            u.name AS seller_name
     FROM credit_listings cl
     JOIN credit_batches cb ON cb.id = cl.batch_id
     JOIN projects p ON p.id = cb.project_id
     LEFT JOIN project_details pd ON pd.project_id = p.id
     JOIN users u ON u.id = cl.seller_id
     WHERE cl.id = $1`,
    [listingId]
  );
  return result.rows[0] || null;
}

// Records a purchase against a listing. Uses SELECT ... FOR UPDATE to lock
// the row for the duration of the transaction — without this, two buyers
// purchasing the same limited-stock listing at nearly the same moment could
// both read "5 available" and both succeed, overselling past what actually
// exists. Throws specific error codes the controller translates to HTTP responses.
async function purchaseFromListing(listingId, amountToBuy) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const result = await client.query('SELECT * FROM credit_listings WHERE id = $1 FOR UPDATE', [listingId]);
    const listing = result.rows[0];
    if (!listing) {
      await client.query('ROLLBACK');
      const err = new Error('Listing not found'); err.code = 'LISTING_NOT_FOUND'; throw err;
    }
    if (listing.status !== 'active') {
      await client.query('ROLLBACK');
      const err = new Error(`Listing is ${listing.status}, not active`); err.code = 'LISTING_NOT_ACTIVE'; throw err;
    }

    const available = Number(listing.amount_listed) - Number(listing.amount_sold);
    if (Number(amountToBuy) > available) {
      await client.query('ROLLBACK');
      const err = new Error(`Only ${available} credits available, requested ${amountToBuy}`); err.code = 'INSUFFICIENT_STOCK'; throw err;
    }

    const newSold = Number(listing.amount_sold) + Number(amountToBuy);
    const newStatus = newSold >= Number(listing.amount_listed) ? 'sold_out' : 'active';

    await client.query(
      'UPDATE credit_listings SET amount_sold = $1, status = $2, updated_at = NOW() WHERE id = $3',
      [newSold, newStatus, listingId]
    );

    await client.query('COMMIT');
    return { ...listing, amount_sold: newSold, status: newStatus };
  } catch (err) {
    if (!err.code) { try { await client.query('ROLLBACK'); } catch (_) {} }
    throw err;
  } finally {
    client.release();
  }
}

module.exports = {
  createListing, findListingById, updateListing, deleteListing,
  findSellerListings, getReservedAmountBySeller,
  findActiveListings, findListingPublicById, purchaseFromListing,
};