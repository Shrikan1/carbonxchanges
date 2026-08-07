const { ethers } = require('ethers');
const path = require('path');

// Credits are stored off-chain as NUMERIC(12,2) — fractional tonnes are
// allowed (e.g. 123.45 tCO2e). ERC-1155 balances are uint256 — whole
// numbers only. SCALE fixes this the same way ETH uses 18-decimal "wei":
// every on-chain amount is the off-chain amount × 100, so 2 decimal places
// of precision survive the round trip. This conversion is applied HERE,
// once, so no other file needs to think about it.
const CREDIT_DECIMALS = 2;
const SCALE = 10 ** CREDIT_DECIMALS;

function toOnChainAmount(amount) {
  return BigInt(Math.round(Number(amount) * SCALE));
}

// Loads the compiled contract artifact (ABI). Assumes this repo's
// monorepo layout — backend/ and blockchain/ as sibling folders. If they
// ever get split into separate repos, copy CarbonToken.json's ABI into
// backend/ directly and adjust this path.
let cachedContract = null;

function getContract() {
  if (cachedContract) return cachedContract;

  const artifactPath = path.join(
    __dirname, '..', '..', '..', 'blockchain', 'artifacts', 'contracts', 'CarbonToken.sol', 'CarbonToken.json'
  );
  const artifact = require(artifactPath);

  if (!process.env.CARBON_TOKEN_ADDRESS || !process.env.RPC_URL || !process.env.PRIVATE_KEY) {
    throw new Error('RPC_URL, PRIVATE_KEY, and CARBON_TOKEN_ADDRESS must be set in .env to use the real blockchain service');
  }

  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  const adminWallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  cachedContract = new ethers.Contract(process.env.CARBON_TOKEN_ADDRESS, artifact.abi, adminWallet);
  return cachedContract;
}

// Mints a new batch. tokenId is our own credit_batches.id — see
// Credit.createPendingBatch/finalizeCreditBatch for why minting happens in
// two steps (the id has to exist before it can be used as the tokenId here).
async function mintTokens({ toAddress, amount, tokenId, projectId, vintageYear, tokenMetadataURI }) {
  const contract = getContract();
  const onChainAmount = toOnChainAmount(amount);

  // Falls back to a placeholder URI until ipfsService.js is wired in —
  // same placeholder-accepting pattern used everywhere else in this project.
  const uri = tokenMetadataURI || `ipfs://placeholder-metadata-token-${tokenId}`;

  const tx = await contract.mintCredits(toAddress, tokenId, onChainAmount, projectId, vintageYear, uri);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    contractAddress: await contract.getAddress(),
  };
}

// Verifies a purchase actually happened on-chain by decoding the
// transaction's TransferSingle event and checking it matches exactly what
// the buyer claims — this is what makes buyerPurchaseController trustworthy
// instead of just trusting a client-submitted tx hash.
async function verifyPurchaseTransaction({ txHash, expectedAmount, expectedBuyer, expectedSeller, tokenId }) {
  const contract = getContract();
  const provider = contract.runner.provider;

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt || receipt.status !== 1) {
    return { valid: false, reason: 'Transaction failed or not found' };
  }

  const expectedAmountOnChain = toOnChainAmount(expectedAmount);
  const iface = contract.interface;

  for (const log of receipt.logs) {
    let parsed;
    try {
      parsed = iface.parseLog(log);
    } catch (_) {
      continue; // log isn't from our contract's ABI — skip
    }
    if (!parsed || parsed.name !== 'TransferSingle') continue;

    const { from, to, id, value } = parsed.args;
    const matches =
      id.toString() === String(tokenId) &&
      from.toLowerCase() === expectedSeller.toLowerCase() &&
      to.toLowerCase() === expectedBuyer.toLowerCase() &&
      value === expectedAmountOnChain;

    if (matches) return { valid: true, reason: null };
  }

  return { valid: false, reason: 'No matching transfer found in this transaction' };
}

// Same idea as verifyPurchaseTransaction, but confirms the transfer went TO
// the zero address (the standard ERC-1155/ERC-20 signature for a burn) and
// came FROM the buyer claiming to have retired it.
async function verifyBurnTransaction({ txHash, expectedAmount, expectedBurner, tokenId }) {
  const contract = getContract();
  const provider = contract.runner.provider;

  const receipt = await provider.getTransactionReceipt(txHash);
  if (!receipt || receipt.status !== 1) {
    return { valid: false, reason: 'Transaction failed or not found' };
  }

  const expectedAmountOnChain = toOnChainAmount(expectedAmount);
  const iface = contract.interface;

  for (const log of receipt.logs) {
    let parsed;
    try {
      parsed = iface.parseLog(log);
    } catch (_) {
      continue;
    }
    if (!parsed || parsed.name !== 'TransferSingle') continue;

    const { from, to, id, value } = parsed.args;
    const matches =
      to === ethers.ZeroAddress &&
      id.toString() === String(tokenId) &&
      from.toLowerCase() === expectedBurner.toLowerCase() &&
      value === expectedAmountOnChain;

    if (matches) return { valid: true, reason: null };
  }

  return { valid: false, reason: 'No matching burn found in this transaction' };
}

module.exports = { mintTokens, verifyPurchaseTransaction, verifyBurnTransaction, toOnChainAmount };