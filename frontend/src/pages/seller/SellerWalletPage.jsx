import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import * as walletApi from '../../api/endpoint/Walletapi';
import { connectMetaMask, getPolBalance } from '../../hook/useMetamask';
import SellerLayout from '../../components/layout/SellerLayout';
import { FiAlertCircle, FiCheckCircle, FiLogOut, FiLink, FiShield } from 'react-icons/fi';
import { FaWallet, FaEthereum } from 'react-icons/fa';

function truncateAddress(address) {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export default function SellerWalletPage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.wallet_address) {
      getPolBalance(user.wallet_address)
        .then(setBalance)
        .catch(() => setBalance(null));
    }
  }, [user?.wallet_address]);

  async function handleConnect() {
    setError(null);
    setLoading(true);
    try {
      const address = await connectMetaMask();
      const { data } = await walletApi.connectWallet(address);
      updateUser({ wallet_address: data.wallet.wallet_address });
    } catch (err) {
      let msg = err.response?.data?.error || err.message || 'Failed to connect wallet';
      if (msg.includes('-32002') || msg.includes('already pending')) {
        msg = 'A connection request is already pending. Please open the MetaMask extension to approve it.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleDisconnect() {
    setLoading(true);
    try {
      await walletApi.disconnectWallet();
      updateUser({ wallet_address: null });
      setBalance(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to disconnect wallet');
    } finally {
      setLoading(false);
    }
  }

  const isConnected = !!user?.wallet_address;

  return (
    <SellerLayout title="Wallet & Payouts" subtitle="Manage your blockchain wallet and network balances.">
      <div className="p-6 lg:p-8 max-w-[1000px] w-full">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start gap-3 text-sm">
            <FiAlertCircle size={18} className="shrink-0 mt-0.5" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area (Left) */}
          <div className="lg:col-span-2 space-y-8">
            
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl wise-font font-black uppercase text-gray-900 tracking-tight flex items-center gap-2">
                <FaWallet className="text-emerald-600" /> Web3 Connection
              </h2>
              <p className="text-sm font-mono text-gray-500 mt-1 max-w-lg">
                Your wallet is required to sign smart contracts, mint carbon credits on-chain, and receive payments directly from buyers.
              </p>
            </div>

            {isConnected ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border border-gray-200 rounded-xl shadow-sm">
                  <div className="flex items-center gap-4 mb-4 sm:mb-0">
                    <div className="w-12 h-12 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center text-emerald-600 shrink-0">
                      <FaEthereum size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        Primary Wallet 
                        <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                        </span>
                      </p>
                      <p className="text-sm font-mono text-gray-500 mt-0.5">
                        {truncateAddress(user.wallet_address)}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-red-50"
                  >
                    <FiLogOut /> {loading ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Network Balance</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-gray-900">{balance !== null ? balance : '--'}</span>
                      <span className="text-sm font-medium text-gray-500">POL</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">Used for network gas fees.</p>
                  </div>
                  
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Network</p>
                    <div className="flex items-center gap-2 text-gray-900 font-medium">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500"></div>
                      Polygon Amoy
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">All assets are minted on Polygon.</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex flex-col items-start max-w-md">
                  <div className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-center text-gray-400 mb-5">
                    <FiLink size={20} />
                  </div>
                  <h3 className="text-lg wise-font font-black uppercase text-gray-900 mb-2">No Wallet Connected</h3>
                  <p className="text-sm font-mono text-gray-500 mb-6 leading-relaxed">
                    You cannot publish projects or receive marketplace payouts until a compatible Web3 wallet is connected to your account.
                  </p>
                  <button
                    onClick={handleConnect}
                    disabled={loading}
                    className="bg-primary hover:bg-[#a3e635] text-[#0c0c0c] font-mono font-bold uppercase tracking-wider px-6 py-2.5 transition-colors shadow-[4px_4px_0_0_#0c0c0c] border border-[#0c0c0c] flex items-center gap-2.5 text-sm"
                  >
                    <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" alt="MetaMask" className="w-4 h-4" />
                    {loading ? 'Connecting...' : 'Connect MetaMask'}
                  </button>
                </div>
              </div>
            )}
            
          </div>

          {/* Sidebar Area (Right) */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-sm">
              <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider text-gray-900 mb-3">
                <FiShield className="text-emerald-600" />
                Security Notice
              </div>
              <p className="text-sm font-mono text-gray-600 leading-relaxed mb-4">
                CarbonXPlanet never has access to your private keys. We only request your public address to route payments and link on-chain assets to your profile.
              </p>
              <a href="https://metamask.io" target="_blank" rel="noreferrer" className="text-emerald-600 font-mono font-bold uppercase tracking-wider hover:underline text-[11px]">
                Learn more about Web3 security &rarr;
              </a>
            </div>
          </div>

        </div>
      </div>
    </SellerLayout>
  );
}
