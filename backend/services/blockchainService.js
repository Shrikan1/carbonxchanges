const crypto = require('crypto');

// STUB — no real blockchain call happens here yet. This gets replaced once
// blockchain/contracts/CarbonToken.sol + CarbonRegistry.sol are written,
// tested, and deployed to Polygon Amoy (the next major phase after all
// four roles' business logic is done — see project sequencing).
//
// The REAL implementation will look like this:
//
//   const { ethers } = require('ethers');
//   const CarbonRegistryABI = require('../../abi/CarbonRegistry.json');
//
//   const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
//   const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//   const registry = new ethers.Contract(
//     process.env.CARBON_REGISTRY_ADDRESS, CarbonRegistryABI, adminWallet
//   );
//
//   async function mintTokens({ toAddress, amount, projectId }) {
//     const tx = await registry.mintCredits(projectId, toAddress, ethers.parseUnits(String(amount), 18));
//     const receipt = await tx.wait(); // waits for on-chain confirmation
//     return { txHash: receipt.hash, contractAddress: process.env.CARBON_TOKEN_ADDRESS };
//   }
//
// Until then, this stub returns a response shaped IDENTICALLY to the real
// one, so callers (mintController.js) never need to change when the real
// implementation lands — only this file does.
async function mintTokens({ toAddress, amount, projectId }) {
  console.warn(
    `[blockchainService STUB] Simulating mint of ${amount} credits to ${toAddress} ` +
    `for project ${projectId} — no real transaction was sent. Build and deploy the ` +
    `contracts to replace this.`
  );

  // Fake but correctly-shaped tx hash (32 random bytes, hex-prefixed) so
  // downstream code (which stores/displays tx_hash) works unmodified.
  const fakeTxHash = '0x' + crypto.randomBytes(32).toString('hex');

  return {
    txHash: fakeTxHash,
    contractAddress: process.env.CARBON_TOKEN_ADDRESS || '0xSTUB_CONTRACT_NOT_DEPLOYED',
  };
}

// ANOTHER STUB — same reasoning as mintTokens above. Real implementation
// will fetch the actual transaction receipt and decode its Transfer event:
//
//   async function verifyPurchaseTransaction({ txHash, expectedAmount, expectedBuyer, expectedSeller }) {
//     const receipt = await provider.getTransactionReceipt(txHash);
//     if (!receipt || receipt.status !== 1) return { valid: false, reason: 'Transaction failed or not found' };
//     const transferEvent = decodeTransferLog(receipt.logs, CarbonTokenABI);
//     const matches = transferEvent.from === expectedSeller
//                   && transferEvent.to === expectedBuyer
//                   && transferEvent.amount === expectedAmount;
//     return { valid: matches, reason: matches ? null : 'Transaction does not match claimed purchase' };
//   }
//
// Until contracts are deployed, this always returns valid: true — meaning
// purchase verification is NOT actually trustworthy yet. This is flagged
// loudly on purpose so nobody mistakes stub-mode for production-ready.
async function verifyPurchaseTransaction({ txHash, expectedAmount, expectedBuyer, expectedSeller }) {
  console.warn(
    `[blockchainService STUB] Simulating verification of purchase tx ${txHash} ` +
    `(${expectedAmount} credits, ${expectedSeller} -> ${expectedBuyer}) — NOT actually checking the chain. ` +
    `Build and deploy the contracts to replace this.`
  );
  return { valid: true, reason: null };
}

module.exports = { mintTokens, verifyPurchaseTransaction };