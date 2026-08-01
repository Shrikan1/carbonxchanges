const { pool, query } = require('../config/db');

// Called by mintController right after a batch is minted — reserves the
// held-back portion. Never touches the seller's tradeable balance.
async function createBufferEntry(projectId, batchId, amountReserved) {
  const result = await query(
    `INSERT INTO buffer_credits (project_id, batch_id, amount_reserved)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [projectId, batchId, amountReserved]
  );
  return result.rows[0];
}

async function findByProject(projectId) {
  const result = await query(
    `SELECT * FROM buffer_credits WHERE project_id = $1 ORDER BY created_at DESC`,
    [projectId]
  );
  return result.rows;
}

// Cancels up to `amountToCancel` across a project's buffer entries, oldest
// first (FIFO). Uses FOR UPDATE to lock the rows during the transaction —
// prevents two simultaneous reversal resolutions from double-spending the
// same buffer. Returns what was actually cancelled, plus any shortfall if
// the buffer wasn't large enough to cover the full reversal (a real
// possibility — this should be surfaced to admin as a system-level flag,
// never resolved by touching buyer holdings).
async function cancelBufferCredits(projectId, amountToCancel) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const bufferRows = await client.query(
      `SELECT * FROM buffer_credits WHERE project_id = $1 AND status != 'depleted' ORDER BY created_at ASC FOR UPDATE`,
      [projectId]
    );

    let remaining = Number(amountToCancel);
    const cancelledEntries = [];

    for (const row of bufferRows.rows) {
      if (remaining <= 0) break;

      const available = Number(row.amount_reserved) - Number(row.amount_cancelled);
      const cancelFromThis = Math.min(available, remaining);
      const newCancelled = Number(row.amount_cancelled) + cancelFromThis;
      const newStatus = newCancelled >= Number(row.amount_reserved) ? 'depleted' : 'partially_cancelled';

      await client.query(
        `UPDATE buffer_credits SET amount_cancelled = $1, status = $2 WHERE id = $3`,
        [newCancelled, newStatus, row.id]
      );

      cancelledEntries.push({ buffer_id: row.id, amount_cancelled: cancelFromThis });
      remaining -= cancelFromThis;
    }

    await client.query('COMMIT');
    return { cancelled: cancelledEntries, shortfall: remaining > 0 ? remaining : 0 };
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { createBufferEntry, findByProject, cancelBufferCredits };