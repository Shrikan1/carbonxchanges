// src/pages/WalletPage.jsx
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { getPolBalance } from '../../hook/Usemetamask';
import WalletConnectButton from '../../components/WalletConnectButton';
import PriceTicker from '../../components/PriceTicker';

export default function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    if (user?.wallet_address) {
      getPolBalance(user.wallet_address).then(setBalance);
    }
  }, [user?.wallet_address]);

  return (
    <div className="max-w-lg mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Wallet</h1>

      <div className="border border-border rounded-lg p-4 space-y-4">
        <WalletConnectButton />

        {user?.wallet_address && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Balance</span>
            <span className="font-mono">{balance !== null ? `${Number(balance).toFixed(4)} POL` : 'Loading...'}</span>
          </div>
        )}

        <div className="pt-2 border-t border-border">
          <PriceTicker />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Carbon credit token balances (per project) are shown on your Portfolio/Credits page —
        this page shows your native POL balance, used for gas fees on transactions.
      </p>
    </div>
  );
}