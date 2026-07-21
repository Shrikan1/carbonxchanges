const Project = require('../../models/Project');
const User = require('../../models/User');
const Credit = require('../../models/Credit');
const Verification = require('../../models/Verification');
const BufferCredit = require('../../models/BufferCredit');
const blockchainService = require('../../services/blockchainService');


async function attemptMint(project) {
  const completionReport = await Verification.findLatestCompletionReport(project.id);
  const verifiedAmount = completionReport?.verified_co2_amount;

  if (!verifiedAmount || verifiedAmount <= 0) {
    return { minted: false, reason: 'No agent-verified completion report found for this project yet' };
  }

  const seller = await User.findById(project.seller_id);
  if (!seller.wallet_address) {
    return { minted: false, reason: 'Seller has not connected a wallet yet' };
  }

  const bufferPercent = Number(project.buffer_pool_percent) || 0;
  const bufferAmount = Math.round(Number(verifiedAmount) * (bufferPercent / 100) * 100) / 100;
  const tradeableAmount = Math.round((Number(verifiedAmount) - bufferAmount) * 100) / 100;

  const mintResult = await blockchainService.mintTokens({
    toAddress: seller.wallet_address,
    amount: tradeableAmount,
    projectId: project.id,
  });

  const batch = await Credit.createCreditBatch(project.id, tradeableAmount, mintResult.contractAddress, mintResult.txHash);

  if (bufferAmount > 0) {
    await BufferCredit.createBufferEntry(project.id, batch.id, bufferAmount);
  }

  await Project.changeProjectStatus(project.id, 'minted');

  return { minted: true, batch, buffer_amount: bufferAmount, tradeable_amount: tradeableAmount };
}

// GET /api/admin/mint/queue — approved projects still stuck waiting to mint
// (i.e. auto-mint failed at approval time, usually a missing seller wallet)
async function getMintableProjects(req, res) {
  try {
    const projects = await Project.findByStatus('approved');
    res.json({ projects });
  } catch (err) {
    console.error('Get mintable projects error:', err);
    res.status(500).json({ error: 'Failed to fetch mintable projects' });
  }
}

// POST /api/admin/mint/:id/retry
// Only exists to re-attempt the SAME automatic logic — e.g. the seller has
// now connected their wallet. Still no amount input; still fully automatic.
async function retryMint(req, res) {
  try {
    const project = await Project.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Project not found' });
    if (project.status !== 'approved') {
      return res.status(400).json({ error: 'Only approved projects pending mint can be retried' });
    }

    const result = await attemptMint(project);
    if (!result.minted) {
      return res.status(400).json({ error: result.reason });
    }

    res.status(201).json({ message: 'Credits minted successfully', batch: result.batch });
  } catch (err) {
    console.error('Retry mint error:', err);
    res.status(500).json({ error: 'Failed to mint credits' });
  }
}

module.exports = { attemptMint, getMintableProjects, retryMint };