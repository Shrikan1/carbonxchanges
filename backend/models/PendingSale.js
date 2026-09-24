const { pool, query } = require('../config/db');

// Creates a pending sale row and reserves stock atomically.
// The reservation prevents overselling while the seller prepares the transfer.
async function createPendingSale(listingId, buyerId, amount) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Lock listing row — prevent race condition with simultaneous buyers
    const result = await client.query(
      'SELECT * FROM credit_listings WHERE id = $1 FOR UPDATE',
      [listingId]
    );
    const listing = result.rows[0];
    if (!listing) {
      await client.query('ROLLBACK');
      const err = new Error('Listing not found'); err.code = 'LISTING_NOT_FOUND'; throw err;
    }
    if (listing.status !== 'active') {
      await client.query('ROLLBACK');
      const err = new Error(`Listing is ${listing.status}`); err.code = 'LISTING_NOT_ACTIVE'; throw err;
    }

    const available =
      Number(listing.amount_listed) - Number(listing.amount_sold) - Number(listing.amount_reserved);
    if (Number(amount) > available) {
      await client.query('ROLLBACK');
      const err = new Error(`Only ${available} credits available`); err.code = 'INSUFFICIENT_STOCK'; throw err;
    }

    // Reserve the amount
    await client.query(
      'UPDATE credit_listings SET amount_reserved = amount_reserved + $1, updated_at = NOW() WHERE id = $2',
      [amount, listingId]
    );

    // Create pending sale record
    const saleResult = await client.query(
      `INSERT INTO pending_sales (listing_id, buyer_id, seller_id, batch_id, amount, price_per_credit)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [listingId, buyerId, listing.seller_id, listing.batch_id, amount, listing.price_per_credit]
    );

    await client.query('COMMIT');
    return { sale: saleResult.rows[0], listing };
  } catch (err) {
    if (!err.code || !['LISTING_NOT_FOUND', 'LISTING_NOT_ACTIVE', 'INSUFFICIENT_STOCK'].includes(err.code)) {
      try { await client.query('ROLLBACK'); } catch (_) {}
    }
    throw err;
  } finally {
    client.release();
  }
}

// Seller completes the transfer: confirms the sale, updates listing stock, creates transaction
async function completePendingSale(saleId, sellerId, txHash) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const saleResult = await client.query(
      'SELECT * FROM pending_sales WHERE id = $1 FOR UPDATE',
      [saleId]
    );
    const sale = saleResult.rows[0];
    if (!sale) throw Object.assign(new Error('Sale not found'), { status: 404 });
    if (sale.seller_id !== sellerId) throw Object.assign(new Error('Forbidden'), { status: 403 });
    if (sale.status !== 'pending') throw Object.assign(new Error(`Sale is already ${sale.status}`), { status: 400 });

    // Mark the pending sale completed
    await client.query(
      `UPDATE pending_sales SET status = 'completed', tx_hash = $1, completed_at = NOW() WHERE id = $2`,
      [txHash, saleId]
    );

    // Move reserved → sold on the listing
    const listingResult = await client.query(
      'SELECT * FROM credit_listings WHERE id = $1 FOR UPDATE',
      [sale.listing_id]
    );
    const listing = listingResult.rows[0];
    const newSold = Number(listing.amount_sold) + Number(sale.amount);
    const newReserved = Math.max(0, Number(listing.amount_reserved) - Number(sale.amount));
    const newStatus = newSold >= Number(listing.amount_listed) ? 'sold_out' : listing.status;

    await client.query(
      'UPDATE credit_listings SET amount_sold = $1, amount_reserved = $2, status = $3, updated_at = NOW() WHERE id = $4',
      [newSold, newReserved, newStatus, sale.listing_id]
    );

    // Create the real transaction record (what portfolio & dashboard read from)
    const totalPrice = Math.round(Number(sale.amount) * Number(sale.price_per_credit) * 100) / 100;
    const txResult = await client.query(
      `INSERT INTO transactions (batch_id, buyer_id, seller_id, tx_hash, type, amount, price_per_credit, total_price)
       VALUES ($1, $2, $3, $4, 'purchase', $5, $6, $7) RETURNING *`,
      [sale.batch_id, sale.buyer_id, sale.seller_id, txHash, sale.amount, sale.price_per_credit, totalPrice]
    );

    await client.query('COMMIT');
    return { sale, transaction: txResult.rows[0] };
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw err;
  } finally {
    client.release();
  }
}

// Seller rejects: release reserved stock back to available
async function rejectPendingSale(saleId, sellerId) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const saleResult = await client.query(
      'SELECT * FROM pending_sales WHERE id = $1 FOR UPDATE',
      [saleId]
    );
    const sale = saleResult.rows[0];
    if (!sale) throw Object.assign(new Error('Sale not found'), { status: 404 });
    if (sale.seller_id !== sellerId) throw Object.assign(new Error('Forbidden'), { status: 403 });
    if (sale.status !== 'pending') throw Object.assign(new Error(`Sale is already ${sale.status}`), { status: 400 });

    await client.query(
      `UPDATE pending_sales SET status = 'rejected', completed_at = NOW() WHERE id = $1`,
      [saleId]
    );

    await client.query(
      'UPDATE credit_listings SET amount_reserved = GREATEST(0, amount_reserved - $1), updated_at = NOW() WHERE id = $2',
      [sale.amount, sale.listing_id]
    );

    await client.query('COMMIT');
    return sale;
  } catch (err) {
    try { await client.query('ROLLBACK'); } catch (_) {}
    throw err;
  } finally {
    client.release();
  }
}

// Seller view: all pending sales for their listings
async function findPendingSalesBySeller(sellerId) {
  const result = await query(
    `SELECT ps.*, 
            cl.price_per_credit, p.title AS project_title,
            u.name AS buyer_name, u.email AS buyer_email, u.wallet_address AS buyer_wallet
     FROM pending_sales ps
     JOIN credit_listings cl ON cl.id = ps.listing_id
     JOIN credit_batches cb ON cb.id = ps.batch_id
     JOIN projects p ON p.id = cb.project_id
     JOIN users u ON u.id = ps.buyer_id
     WHERE ps.seller_id = $1
     ORDER BY ps.created_at DESC`,
    [sellerId]
  );
  return result.rows;
}

// Buyer view: their own purchase intents and statuses
async function findPendingSalesByBuyer(buyerId) {
  const result = await query(
    `SELECT ps.*,
            cl.price_per_credit, p.title AS project_title,
            u.name AS seller_name
     FROM pending_sales ps
     JOIN credit_listings cl ON cl.id = ps.listing_id
     JOIN credit_batches cb ON cb.id = ps.batch_id
     JOIN projects p ON p.id = cb.project_id
     JOIN users u ON u.id = ps.seller_id
     WHERE ps.buyer_id = $1
     ORDER BY ps.created_at DESC`,
    [buyerId]
  );
  return result.rows;
}

module.exports = {
  createPendingSale,
  completePendingSale,
  rejectPendingSale,
  findPendingSalesBySeller,
  findPendingSalesByBuyer,
};
