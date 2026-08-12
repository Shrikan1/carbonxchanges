import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import * as walletApi from '../api/endpoint/Walletapi';
import { connectMetaMask } from '../hook/Usemetamask';
import { Button } from './ui/Button';

function truncateAddress(address) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function WalletConnectButton() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleConnect() {
    setError(null);
    setLoading(true);
    try {
      const address = await connectMetaMask();
      // Persist to the backend — this is what unlocks minting-to-this-wallet,
      // purchase/retire verification, etc. Not just a frontend-only display.
      const { data } = await walletApi.connectWallet(address);
      updateUser({ wallet_address: data.wallet.wallet_address });
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to connect wallet');
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await walletApi.disconnectWallet();
      updateUser({ wallet_address: null });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  }

  if (user?.wallet_address) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
          {truncateAddress(user.wallet_address)}
        </span>
        <Button variant="outline" onClick={handleDisconnect} disabled={loading}>
          Disconnect
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Button onClick={handleConnect} disabled={loading}>
        {loading ? 'Connecting...' : 'Connect Wallet'}
      </Button>
      {error && <p className="text-xs text-red-600 mt-1">{error}</p>}
    </div>
  );
}