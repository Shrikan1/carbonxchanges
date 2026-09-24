// Minimal ABI — only the functions the frontend actually calls directly.
// Not the full contract artifact (that lives in blockchain/artifacts/ and
// is what the backend's blockchainService.js uses) — deliberately small so
// the frontend bundle doesn't need to import the whole compiled contract JSON.
export const CARBON_TOKEN_ABI = [
  'function safeTransferFrom(address from, address to, uint256 id, uint256 amount, bytes data)',
  'function burn(address account, uint256 id, uint256 value)',
  'function balanceOf(address account, uint256 id) view returns (uint256)',
];

// Must match backend/src/services/blockchainService.js's SCALE exactly —
// both sides convert human amounts (e.g. 123.45 tCO2e) to the same
// on-chain uint256 representation (2 decimal places, ×100). If these ever
// drift apart, the backend's on-chain verification will never match what
// actually happened, and every purchase/retirement will fail to confirm.
export const CREDIT_SCALE = 100;

export function toOnChainAmount(amount) {
  return BigInt(Math.round(Number(amount) * CREDIT_SCALE));
}
