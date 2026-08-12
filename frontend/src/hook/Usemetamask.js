import { ethers } from 'ethers';

// Requests MetaMask's account access and returns the connected address.
// This is the ONLY place window.ethereum gets touched directly for the
// connect flow — purchase/retire flows (later sections) will reuse this
// same pattern for their own signing, but each stays a separate,
// deliberate call, never auto-triggered.
export async function connectMetaMask() {
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Install it from metamask.io to continue.');
  }

  const provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send('eth_requestAccounts', []);

  if (!accounts || accounts.length === 0) {
    throw new Error('No account was authorized in MetaMask.');
  }

  return accounts[0];
}

// Returns an ethers provider for read-only chain calls (e.g. balance
// lookups in the wallet page) without requesting a new connection.
export function getMetaMaskProvider() {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
}