import { useState } from 'react';
import { useAuthStore } from "../../store/useAuthStore";
import * as profileApi from "../../api/endpoint/Profileapi";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { motion, AnimatePresence } from 'motion/react';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiShield, FiCheck, FiX, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import SellerLayout from '../../components/layout/SellerLayout';
import AgentLayout from '../../components/layout/AgentLayout';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, setToken } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [nameStatus, setNameStatus] = useState(null);

  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);

  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
  const [passwordStatus, setPasswordStatus] = useState(null);

  const [isSubmittingName, setIsSubmittingName] = useState(false);
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);

  async function handleNameSubmit(e) {
    e.preventDefault();
    setNameStatus(null);
    setIsSubmittingName(true);
    try {
      const { data } = await profileApi.updateProfile(name);
      updateUser(data.user);
      setNameStatus({ type: 'success', message: 'Profile updated successfully!' });
    } catch (err) {
      setNameStatus({ type: 'error', message: err.response?.data?.error || 'Update failed' });
    } finally {
      setIsSubmittingName(false);
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordStatus(null);
    setIsSubmittingPassword(true);
    try {
      const { data } = await profileApi.changePassword(passwords.current_password, passwords.new_password);
      setToken(data.token);
      setPasswords({ current_password: '', new_password: '' });
      setPasswordStatus({ type: 'success', message: 'Password changed successfully!' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.response?.data?.error || 'Change failed' });
    } finally {
      setIsSubmittingPassword(false);
    }
  }

  const profileContent = (
    <div className="w-full max-w-2xl px-4 md:px-8 mx-auto pb-12 pt-8">
      <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          <div className="mb-10 flex flex-col items-center text-center">
            <h1 className="text-3xl text-gray-900 mb-2 uppercase wise-font font-black tracking-tighter">Profile Settings</h1>
            <p className="text-gray-500 text-sm">Manage your account details and security preferences.</p>
          </div>
          <div className="flex flex-col space-y-4 max-w-md mx-auto w-full">
            <div className="bg-white rounded-2xl p-3 sm:px-5 sm:py-3 shadow-sm border border-gray-100 flex flex-col">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#bef264]/20 text-[#84cc16] flex items-center justify-center">
                    <FiUser size={16} />
                  </div>
                  <h3 className="text-lg wise-font font-black text-gray-900 uppercase tracking-wider">
                    Account Details
                  </h3>
                </div>
                <div className="text-gray-400">
                  {isAccountOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                </div>
              </div>

              <AnimatePresence>
                {isAccountOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6">
                      <form onSubmit={handleNameSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[#0c0c0c] font-mono text-xs font-bold uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="pl-10 bg-gray-50 border-[#0c0c0c] text-gray-500 h-11 font-mono text-sm cursor-not-allowed shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[#0c0c0c] font-mono text-xs font-bold uppercase tracking-wider">Full Name</Label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="pl-10 bg-white border-[#0c0c0c] text-gray-900 h-11 font-mono text-sm focus:border-gray-900 focus:outline-none transition-all shadow-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {nameStatus && (
                  <div className={`p-4 rounded-xl flex items-center space-x-3 text-sm mt-4 border ${nameStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-[#f7fee7] border-[#bef264] text-gray-900'}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${nameStatus.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#bef264]/30 text-[#65a30d]'}`}>
                      {nameStatus.type === 'error' ? <FiX size={14} /> : <FiCheck size={14} />}
                    </div>
                    <span className="font-medium">{nameStatus.message}</span>
                  </div>
                )}

                <div className="pt-4 mt-auto flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingName || name === user?.name}
                    className="h-11 px-6 bg-[#c2ed6d] hover:bg-[#a3e635] text-[#0c0c0c] text-sm font-mono font-bold uppercase tracking-wider border-[2px] border-[#0c0c0c] transition-colors disabled:opacity-50 shadow-none hover:shadow-none"
                  >
                    {isSubmittingName ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-2xl p-3 sm:px-5 sm:py-3 shadow-sm border border-gray-100 flex flex-col">
              <div 
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsSecurityOpen(!isSecurityOpen)}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-[#bef264]/20 text-[#84cc16] flex items-center justify-center">
                    <FiShield size={16} />
                  </div>
                  <h3 className="text-lg wise-font font-black text-gray-900 uppercase tracking-wider">
                    Security
                  </h3>
                </div>
                <div className="text-gray-400">
                  {isSecurityOpen ? <FiChevronUp size={24} /> : <FiChevronDown size={24} />}
                </div>
              </div>

              <AnimatePresence>
                {isSecurityOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-6">
                      <form onSubmit={handlePasswordSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="space-y-1.5">
                  <Label htmlFor="current_password" className="text-[#0c0c0c] font-mono text-xs font-bold uppercase tracking-wider">Current Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="current_password"
                      type="password"
                      required
                      value={passwords.current_password}
                      onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                      className="pl-10 bg-white border-[#0c0c0c] text-gray-900 h-11 font-mono text-sm focus:border-gray-900 focus:outline-none transition-all shadow-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new_password" className="text-[#0c0c0c] font-mono text-xs font-bold uppercase tracking-wider">New Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="new_password"
                      type="password"
                      required
                      minLength={8}
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                      className="pl-10 bg-white border-[#0c0c0c] text-gray-900 h-11 font-mono text-sm focus:border-gray-900 focus:outline-none transition-all shadow-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {passwordStatus && (
                  <div className={`p-4 rounded-xl flex items-center space-x-3 text-sm mt-4 border ${passwordStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-[#f7fee7] border-[#bef264] text-gray-900'}`}>
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full ${passwordStatus.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#bef264]/30 text-[#65a30d]'}`}>
                      {passwordStatus.type === 'error' ? <FiX size={14} /> : <FiCheck size={14} />}
                    </div>
                    <span className="font-medium">{passwordStatus.message}</span>
                  </div>
                )}

                <div className="pt-4 mt-auto flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingPassword || !passwords.current_password || !passwords.new_password}
                    className="h-11 px-6 bg-[#c2ed6d] hover:bg-[#a3e635] text-[#0c0c0c] text-sm font-mono font-bold uppercase tracking-wider border-[2px] border-[#0c0c0c] transition-colors disabled:opacity-50 shadow-none hover:shadow-none"
                  >
                    {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
    </div>
  );

  if (user?.is_seller) {
    return (
      <SellerLayout title="Profile" subtitle="Manage your account details and security preferences">
        {profileContent}
      </SellerLayout>
    );
  }

  if (user?.role === 'agent') {
    return (
      <AgentLayout title="Profile" subtitle="Manage your account details and security preferences">
        {profileContent}
      </AgentLayout>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex flex-col items-center bg-[#f8f9fa] text-gray-900 pt-24 pb-12 font-sans">
        {profileContent}
      </div>
    </>
  );
}