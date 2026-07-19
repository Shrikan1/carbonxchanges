const Project = require('../../models/Project');
const User = require('../../models/User');
const Credit = require('../../models/Credit');
const Verification = require('../../models/Verification');
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
 
  const mintResult = await blockchainService.mintTokens({
    toAddress: seller.wallet_address,
    amount: verifiedAmount,
    projectId: project.id,
  });
 
  const batch = await Credit.createCreditBatch(project.id, verifiedAmount, mintResult.contractAddress, mintResult.txHash);
  await Project.changeProjectStatus(project.id, 'minted');
 
  return { minted: true, batch };
}

// GET /api/admin/mint/queue — approved projects still stuck waiting to mint
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
