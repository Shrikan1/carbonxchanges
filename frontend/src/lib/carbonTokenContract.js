import { ethers } from 'ethers';
import { getMetaMaskProvider } from '../hook/Usemetamask';
import { CARBON_TOKEN_ABI } from './carbonTokenAbi';

// Returns a signer-connected contract instance — every call through this
// prompts MetaMask for the connected user's own signature. This is what
// makes retirement (burn) and the seller's sale-completion transfer real,
// user-signed transactions rather than something the backend does on
// anyone's behalf.
export async function getCarbonTokenContract() {
  const provider = getMetaMaskProvider();
  if (!provider) throw new Error('MetaMask is not available. Install it to continue.');
  const signer = await provider.getSigner();
  return new ethers.Contract(import.meta.env.VITE_CARBON_TOKEN_ADDRESS, CARBON_TOKEN_ABI, signer);
}
