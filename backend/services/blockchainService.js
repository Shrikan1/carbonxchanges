const crypto = require('crypto');

// STUB — no real blockchain call happens here yet. This gets replaced once
// blockchain/contracts/CarbonToken.sol (an ERC-1155, via OpenZeppelin) +
// CarbonRegistry.sol are written, tested, and deployed to Polygon Amoy.
//
// ERC-1155, not ERC-20: every project+vintage batch gets its own distinct
// on-chain tokenId (== our own credit_batches.id — see Credit.createPendingBatch),
// so tokens from different projects/vintages are NEVER fungible with each
// other, only within their own tokenId. This preserves provenance the way
// real carbon registries require, which a single shared ERC-20 pool cannot.
//
// The REAL implementation will look like this:
//
//   const { ethers } = require('ethers');
//   const CarbonTokenABI = require('../../abi/CarbonToken.json'); // ERC-1155
//
//   const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
//   const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
//   const token = new ethers.Contract(process.env.CARBON_TOKEN_ADDRESS, CarbonTokenABI, adminWallet);
//
//   async function mintTokens({ toAddress, amount, tokenId }) {
//     // ERC-1155 mint: specific tokenId, not a shared pool
//     const tx = await token.mint(toAddress, tokenId, ethers.parseUnits(String(amount), 18), '0x');
//     const receipt = await tx.wait();
//     return { txHash: receipt.hash, contractAddress: process.env.CARBON_TOKEN_ADDRESS };
//   }
//
// Until then, this stub returns a response shaped IDENTICALLY to the real
// one, so callers (mintController.js) never need to change when the real
// implementation lands — only this file does.
async function mintTokens({ toAddress, amount, tokenId, projectId }) {
  console.warn(
    `[blockchainService STUB] Simulating ERC-1155 mint of ${amount} credits ` +
    `(tokenId ${tokenId}, project ${projectId}) to ${toAddress} — no real transaction was sent. ` +
    `Build and deploy the contracts to replace this.`
  );

  const fakeTxHash = '0x' + crypto.randomBytes(32).toString('hex');

  return {
    txHash: fakeTxHash,
    contractAddress: process.env.CARBON_TOKEN_ADDRESS || '0xSTUB_CONTRACT_NOT_DEPLOYED',
  };
}

// ANOTHER STUB — same reasoning as mintTokens above. Real implementation
// fetches the actual transaction receipt and decodes its ERC-1155
// TransferSingle event (which includes the tokenId, unlike ERC-20's Transfer):
//
//   async function verifyPurchaseTransaction({ txHash, expectedAmount, expectedBuyer, expectedSeller, tokenId }) {
//     const receipt = await provider.getTransactionReceipt(txHash);
//     if (!receipt || receipt.status !== 1) return { valid: false, reason: 'Transaction failed or not found' };
//     const transferEvent = decodeTransferSingleLog(receipt.logs, CarbonTokenABI);
//     const matches = transferEvent.id === tokenId
//                   && transferEvent.from === expectedSeller
//                   && transferEvent.to === expectedBuyer
//                   && transferEvent.value === expectedAmount;
//     return { valid: matches, reason: matches ? null : 'Transaction does not match claimed purchase' };
//   }
//
// Until contracts are deployed, this always returns valid: true — meaning
// purchase verification is NOT actually trustworthy yet. This is flagged
// loudly on purpose so nobody mistakes stub-mode for production-ready.
async function verifyPurchaseTransaction({ txHash, expectedAmount, expectedBuyer, expectedSeller, tokenId }) {
  console.warn(
    `[blockchainService STUB] Simulating verification of purchase tx ${txHash} ` +
    `(tokenId ${tokenId}, ${expectedAmount} credits, ${expectedSeller} -> ${expectedBuyer}) — ` +
    `NOT actually checking the chain. Build and deploy the contracts to replace this.`
  );
  return { valid: true, reason: null };
}

// Same reasoning as the two stubs above. Real implementation decodes the
// burn's TransferSingle event and confirms it went to the zero address,
// for the correct tokenId:
//
//   async function verifyBurnTransaction({ txHash, expectedAmount, expectedBurner, tokenId }) {
//     const receipt = await provider.getTransactionReceipt(txHash);
//     if (!receipt || receipt.status !== 1) return { valid: false, reason: 'Transaction failed or not found' };
//     const transferEvent = decodeTransferSingleLog(receipt.logs, CarbonTokenABI);
//     const isBurn = transferEvent.to === '0x0000000000000000000000000000000000000000';
//     const matches = isBurn && transferEvent.id === tokenId
//                   && transferEvent.from === expectedBurner && transferEvent.value === expectedAmount;
//     return { valid: matches, reason: matches ? null : 'Transaction is not a matching burn' };
//   }
async function verifyBurnTransaction({ txHash, expectedAmount, expectedBurner, tokenId }) {
  console.warn(
    `[blockchainService STUB] Simulating verification of burn tx ${txHash} ` +
    `(tokenId ${tokenId}, ${expectedAmount} credits burned by ${expectedBurner}) — ` +
    `NOT actually checking the chain. Build and deploy the contracts to replace this.`
  );
  return { valid: true, reason: null };
}

module.exports = { mintTokens, verifyPurchaseTransaction, verifyBurnTransaction };