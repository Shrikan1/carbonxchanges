const Wallet = require('../../models/Wallet');


const ETH_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/;

// POST /api/wallet/connect   body: { wallet_address }
async function connectWallet(req, res) {
  try {
    const { wallet_address } = req.body;
    if (!wallet_address || !ETH_ADDRESS_REGEX.test(wallet_address)) {
      return res.status(400).json({ error: 'A valid wallet_address is required' });
    }

    const existingOwner = await Wallet.findUserByWalletAddress(wallet_address);
    if (existingOwner && existingOwner.id !== req.user.id) {
      return res.status(409).json({ error: 'This wallet is already linked to another account' });
    }

    const wallet = await Wallet.updateWalletAddress(req.user.id, wallet_address);
    res.json({ message: 'Wallet connected', wallet });
  } catch (err) {
    console.error('Connect wallet error:', err);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
}

// POST /api/wallet/disconnect
async function disconnectWallet(req, res) {
  try {
    const wallet = await Wallet.clearWalletAddress(req.user.id);
    res.json({ message: 'Wallet disconnected', wallet });
  } catch (err) {
    console.error('Disconnect wallet error:', err);
    res.status(500).json({ error: 'Failed to disconnect wallet' });
  }
}

// GET /api/wallet

async function getWalletDetails(req, res) {
  try {
    const wallet = await Wallet.findWallet(req.user.id);
    res.json({ wallet });
  } catch (err) {
    console.error('Get wallet details error:', err);
    res.status(500).json({ error: 'Failed to fetch wallet details' });
  }
}

module.exports = { connectWallet, disconnectWallet, getWalletDetails };