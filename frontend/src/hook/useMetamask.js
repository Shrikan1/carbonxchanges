import { ethers } from 'ethers';

// Requests MetaMask's account access and returns the connected address.
// This is the ONLY place window.ethereum gets touched directly for the
// connect flow — purchase/retire flows (later sections) will reuse this
// same pattern for their own signing, but each stays a separate,
// deliberate call, never auto-triggered.
export async function connectMetaMask() {
  // Check if running in browser context
  if (typeof window === 'undefined') {
    throw new Error('MetaMask can only be used in a browser environment.');
  }

  // Check if MetaMask is installed
  if (!window.ethereum) {
    throw new Error('MetaMask is not installed. Please install MetaMask extension from metamask.io to continue.');
  }

  // Check if MetaMask is the provider
  if (!window.ethereum.isMetaMask) {
    throw new Error('Please use MetaMask extension to connect your wallet.');
  }

  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Request account access
    const accounts = await provider.send('eth_requestAccounts', []);

    if (!accounts || accounts.length === 0) {
      throw new Error('No account was authorized. Please unlock MetaMask and try again.');
    }

    // Verify the account is still accessible
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return address;
    
  } catch (error) {
    // Handle specific MetaMask errors
    if (error.code === 4001) {
      throw new Error('Connection request rejected. Please approve the connection in MetaMask.');
    } else if (error.code === -32002) {
      throw new Error('Connection request pending. Please check MetaMask extension.');
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Failed to connect MetaMask. Please try again.');
    }
  }
}

// Returns an ethers provider for read-only chain calls (e.g. balance
// lookups in the wallet page) without requesting a new connection.
export function getMetaMaskProvider() {
  if (!window.ethereum) return null;
  return new ethers.BrowserProvider(window.ethereum);
}

// src/hooks/useMetaMask.js — ADD this function to the existing file
export async function getPolBalance(address) {
  const provider = getMetaMaskProvider();
  if (!provider) return null;
  const balanceWei = await provider.getBalance(address);
  return ethers.formatEther(balanceWei); // wei -> POL, human-readable
}