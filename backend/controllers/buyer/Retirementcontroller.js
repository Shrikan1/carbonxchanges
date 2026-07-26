const User = require('../../models/User');
const Portfolio = require('../../models/Portfolio');
const Transaction = require('../../models/Transaction');
const Certificate = require('../../models/Certificate');
const blockchainService = require('../../services/blockchainService');
const { streamCertificatePdf } = require('../../services/certificateService');

// POST /api/buyer/retire   body: { batch_id, amount, burn_tx_hash }
//
// Same trust pattern as purchase: the buyer has already signed and sent the
// burn themselves via MetaMask (calling the token's own burn() — nobody
// else CAN burn their tokens). This endpoint independently verifies that
// transaction happened before recording anything (currently a STUB — see
// blockchainService.verifyBurnTransaction).
async function retireCredits(req, res) {
  try {
    const { batch_id, amount, burn_tx_hash, retirement_reason, beneficiary_name } = req.body;
    if (!batch_id || !amount || !burn_tx_hash) {
      return res.status(400).json({ error: 'batch_id, amount, and burn_tx_hash are required' });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: 'amount must be positive' });
    }

    const buyer = await User.findById(req.user.id);
    if (!buyer.wallet_address) {
      return res.status(400).json({ error: 'Connect a wallet before retiring credits' });
    }

    const currentHolding = await Portfolio.getHoldingForBatch(req.user.id, batch_id);
    if (amount > currentHolding) {
      return res.status(409).json({ error: `You only hold ${currentHolding} credits from this batch, cannot retire ${amount}` });
    }

    const verification = await blockchainService.verifyBurnTransaction({
      txHash: burn_tx_hash,
      expectedAmount: amount,
      expectedBurner: buyer.wallet_address,
      tokenId: batch_id,
    });
    if (!verification.valid) {
      return res.status(400).json({ error: verification.reason || 'Burn transaction could not be verified on-chain' });
    }

    const transaction = await Transaction.createRetireTransaction(batch_id, req.user.id, burn_tx_hash, amount);
    // beneficiary_name defaults to the retiring buyer's own name if not
    // explicitly given (e.g. a broker retiring on behalf of a client company)
    const certificate = await Certificate.createCertificate(
      transaction.id,
      burn_tx_hash,
      null,
      retirement_reason || null,
      beneficiary_name || buyer.name
    );

    res.status(201).json({
      message: 'Credits retired successfully. Certificate is ready to download.',
      transaction,
      certificate,
      download_url: `/api/buyer/certificates/${certificate.id}/download`,
    });
  } catch (err) {
    console.error('Retire credits error:', err);
    res.status(500).json({ error: 'Failed to retire credits' });
  }
}

// GET /api/buyer/certificates
async function getMyCertificates(req, res) {
  try {
    const certificates = await Certificate.findByBuyer(req.user.id);
    res.json({ certificates });
  } catch (err) {
    console.error('Get certificates error:', err);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
}

// GET /api/buyer/certificates/:id/download — streams a freshly generated PDF
async function downloadCertificate(req, res) {
  try {
    const details = await Certificate.findCertificateDetails(req.params.id);
    if (!details) return res.status(404).json({ error: 'Certificate not found' });

    if (details.buyer_id !== req.user.id) {
      return res.status(403).json({ error: 'This certificate does not belong to you' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="retirement_certificate_${details.id}.pdf"`);
    streamCertificatePdf(details, res);
  } catch (err) {
    console.error('Download certificate error:', err);
    res.status(500).json({ error: 'Failed to generate certificate' });
  }
}

module.exports = { retireCredits, getMyCertificates, downloadCertificate };