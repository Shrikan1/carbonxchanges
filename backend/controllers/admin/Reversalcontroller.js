const Reinspection = require('../../models/Reinspection');
const BufferCredit = require('../../models/BufferCredit');
const Notification = require('../../models/Notification');
const Project = require('../../models/Project');

// GET /api/admin/reversals/queue — reversal findings awaiting admin review
async function getFlaggedReversals(req, res) {
  try {
    const reports = await Reinspection.findUnresolvedReversals();
    res.json({ reports });
  } catch (err) {
    console.error('Get flagged reversals error:', err);
    res.status(500).json({ error: 'Failed to fetch flagged reversals' });
  }
}

// PUT /api/admin/reversals/:reportId/resolve
// Confirms an agent's reversal finding and cancels the corresponding amount
// from the project's buffer pool — NEVER from a buyer's purchased holdings.
// If the buffer is insufficient (shortfall > 0), that's surfaced back to
// admin as a system-level problem to handle separately (e.g. insurance,
// cross-project reserve) — it does not silently touch buyer balances.
async function resolveReversal(req, res) {
  try {
    const report = await Reinspection.findById(req.params.reportId);
    if (!report) return res.status(404).json({ error: 'Re-inspection report not found' });

    if (!report.reversal_detected) {
      return res.status(400).json({ error: 'This report did not flag a reversal — nothing to resolve' });
    }
    if (report.resolved) {
      return res.status(400).json({ error: 'This reversal has already been resolved' });
    }

    const result = await BufferCredit.cancelBufferCredits(report.project_id, report.reversal_amount);
    await Reinspection.markResolved(report.id);

    // Transparency for the seller — their project's buffer pool was drawn
    // down. Buyer is NOT notified here because nothing about their holdings changed.
    const project = await Project.findProjectById(report.project_id);
    await Notification.createNotification(
      project.seller_id,
      'Buffer credits cancelled due to reversal',
      `A re-inspection confirmed a reversal of ${report.reversal_amount} credits on "${project.title}". ` +
      `${result.cancelled.reduce((sum, c) => sum + c.amount_cancelled, 0)} buffer credits were cancelled to cover it.` +
      (result.shortfall > 0 ? ` WARNING: buffer pool was insufficient — a shortfall of ${result.shortfall} remains unresolved.` : '')
    );

    res.json({
      message: result.shortfall > 0
        ? `Reversal resolved, but buffer pool was insufficient — shortfall of ${result.shortfall} requires separate handling`
        : 'Reversal resolved — buffer credits cancelled',
      ...result,
    });
  } catch (err) {
    console.error('Resolve reversal error:', err);
    res.status(500).json({ error: 'Failed to resolve reversal' });
  }
}

module.exports = { getFlaggedReversals, resolveReversal }; //