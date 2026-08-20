const { ethers } = require('ethers');
const path = require('path');

const CREDIT_DECIMALS = 2;
const SCALE = 10 ** CREDIT_DECIMALS;

function toOnChainAmount(amount) {
  return BigInt(Math.round(Number(amount) * SCALE));
}

let cachedContract = null;

function getContract() {
  if (cachedContract) return cachedContract;

  const artifactPath = path.join(
    __dirname, '..', '..', 'blockchain', 'artifacts', 'contracts', 'CarbonToken.sol', 'CarbonToken.json'
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

async function mintTokens({ toAddress, amount, tokenId, projectId, vintageYear, tokenMetadataURI }) {
  const contract = getContract();
  const onChainAmount = toOnChainAmount(amount);

 
  const uri = tokenMetadataURI || `ipfs://placeholder-metadata-token-${tokenId}`;

  const tx = await contract.mintCredits(toAddress, tokenId, onChainAmount, projectId, vintageYear, uri);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    contractAddress: await contract.getAddress(),
  };
}


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