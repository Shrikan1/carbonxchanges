import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import * as walletApi from '../../api/endpoint/Walletapi';
import { connectMetaMask, getPolBalance } from '../../hook/Usemetamask';
import SellerHeader from '../../components/layout/SellerHeader';
import { motion } from 'motion/react';
import { FiAlertCircle, FiCheckCircle, FiLoader, FiLogOut } from 'react-icons/fi';
import { FaWallet } from 'react-icons/fa';

function truncateAddress(address) {
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

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 py-8 font-sans">
      <SellerHeader 
        title="Web3 Wallet" 
        description="Connect your MetaMask wallet to mint credits and receive payments."
        contentMaxWidth="1200px"
      />
      
      <div className="w-full max-w-[1200px] px-4 md:px-8 mt-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-red-50/80 backdrop-blur-md border border-red-200 text-red-700 p-4 rounded-2xl mb-6 flex items-center gap-3 shadow-sm"
            >
              <FiAlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-white shadow-[0_8px_32px_-8px_rgba(0,0,0,0.05)] relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl opacity-40 -mr-20 -mt-20 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-40 -ml-20 -mb-20 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-gradient-to-tr from-brand to-brand-hover rounded-2xl flex items-center justify-center text-gray-900 shadow-xl shadow-brand/20 mb-6 transform -rotate-3 transition-transform hover:rotate-0 duration-300">
                <FaWallet size={36} />
              </div>
              
              <h2 className="text-3xl font-black tracking-tight text-gray-900 mb-3">
                {user?.wallet_address ? 'Wallet Connected' : 'Connect MetaMask'}
              </h2>
              
              <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed text-sm">
                {user?.wallet_address 
                  ? 'Your Web3 wallet is successfully linked to your seller account. You are ready to mint carbon credits.'
                  : 'Link your Web3 wallet to authenticate and access the marketplace securely. We never store private keys.'}
              </p>

              {user?.wallet_address ? (
                <div className="w-full space-y-6">
                  <div className="bg-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                        <FiCheckCircle size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Connected Address</p>
                        <p className="font-mono text-gray-900 font-medium tracking-tight">
                          {truncateAddress(user.wallet_address)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-left md:text-right w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200 pt-4 md:pt-0 md:pl-6">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">POL Balance</p>
                      <p className="font-mono text-gray-900 font-bold">
                        {balance !== null ? `${Number(balance).toFixed(4)}` : '...'}
                        <span className="text-sm font-medium text-gray-500 ml-1">POL</span>
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={handleDisconnect}
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full md:w-auto mx-auto px-6 py-2.5 rounded-full border border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all font-semibold text-sm"
                  >
                    {loading ? <FiLoader className="animate-spin" /> : <FiLogOut />}
                    Disconnect Wallet
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleConnect}
                  disabled={loading}
                  className="group relative w-full sm:w-auto flex items-center justify-center gap-3 bg-gray-900 hover:bg-black text-white px-8 py-4 rounded-xl font-bold transition-all shadow-xl shadow-gray-900/10 hover:shadow-gray-900/20 active:scale-95 disabled:opacity-70 disabled:pointer-events-none overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  {loading ? (
                    <FiLoader className="animate-spin relative z-10" size={20} />
                  ) : (
                    <img 
                      src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                      alt="MetaMask" 
                      className="w-6 h-6 relative z-10" 
                    />
                  )}
                  <span className="relative z-10">{loading ? 'Connecting...' : 'Connect with MetaMask'}</span>
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
