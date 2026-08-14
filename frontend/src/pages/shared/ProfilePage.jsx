import { useState } from 'react';
import { useAuthStore } from "../../store/useAuthStore";
import * as profileApi from "../../api/endpoint/Profileapi";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { motion } from 'motion/react';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiShield } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser, setToken } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [nameStatus, setNameStatus] = useState(null);

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

  return (
    <div className="min-h-screen bg-[#0c0c0c] text-white pt-24 pb-12 px-4 sm:px-6 font-['JetBrains_Mono'] relative overflow-hidden">
      {/* Tech Grid Background */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.04]" 
        style={{ 
          backgroundImage: 'radial-gradient(#bef264 1px, transparent 1px)', 
          backgroundSize: '32px 32px' 
        }}
      />
      
      {/* Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-lg h-[300px] bg-[#bef264]/[0.02] blur-[100px] pointer-events-none z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto relative z-10"
      >
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-[#bef264] hover:text-white transition-colors mb-4 text-sm uppercase tracking-wider"
          >
            <FiArrowLeft />
            <span>Back</span>
          </button>
          <div className="text-2xl font-bold tracking-tight text-white mb-1">Profile Settings</div>
          <p className="text-[#888] text-sm">Manage your account details and security preferences.</p>
        </div>

        <div className="space-y-6">
          {/* Account Details Card */}
          <div className="bg-[#111] border border-[#222] border-l-2 border-l-[#bef264] rounded-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 pb-3 border-b border-[#222]">
              Account Details
            </h3>

            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-[#888] text-xs uppercase tracking-wider font-medium">Email Address</Label>
                <div className="relative">
                  <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] text-sm" />
                  <Input 
                    id="email" 
                    value={user?.email || ''} 
                    disabled 
                    className="pl-9 bg-[#0a0a0a] border-[#222] text-[#666] h-10 rounded-none text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-[#888] text-xs uppercase tracking-wider font-medium">Full Name</Label>
                <div className="relative">
                  <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888] text-sm" />
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    className="pl-9 bg-[#161616] border-[#333] text-white h-10 rounded-none text-sm focus:border-white focus:ring-1 focus:ring-white transition-all"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {nameStatus && (
                <p className={`text-xs flex items-center space-x-1.5 pt-1 ${nameStatus.type === 'error' ? 'text-red-400' : 'text-[#10b981]'}`}>
                  <span>{nameStatus.type === 'error' ? '✖' : '✔'}</span>
                  <span>{nameStatus.message}</span>
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmittingName || name === user?.name}
                  className="h-9 px-6 bg-white hover:bg-gray-200 text-black text-sm font-semibold rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingName ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </form>
          </div>

          {/* Security Card */}
          <div className="bg-[#111] border border-[#222] border-l-2 border-l-[#10b981] rounded-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.5)]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-5 pb-3 border-b border-[#222]">
              Security
            </h3>

            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="current_password" className="text-[#888] text-xs uppercase tracking-wider font-medium">Current Password</Label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888] text-sm" />
                  <Input
                    id="current_password"
                    type="password"
                    required
                    value={passwords.current_password}
                    onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                    className="pl-9 bg-[#161616] border-[#333] text-white h-10 rounded-none text-sm focus:border-white focus:ring-1 focus:ring-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="new_password" className="text-[#888] text-xs uppercase tracking-wider font-medium">New Password</Label>
                <div className="relative">
                  <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#888] text-sm" />
                  <Input
                    id="new_password"
                    type="password"
                    required
                    minLength={8}
                    value={passwords.new_password}
                    onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                    className="pl-9 bg-[#161616] border-[#333] text-white h-10 rounded-none text-sm focus:border-white focus:ring-1 focus:ring-white transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {passwordStatus && (
                <p className={`text-xs flex items-center space-x-1.5 pt-1 ${passwordStatus.type === 'error' ? 'text-red-400' : 'text-[#10b981]'}`}>
                  <span>{passwordStatus.type === 'error' ? '✖' : '✔'}</span>
                  <span>{passwordStatus.message}</span>
                </p>
              )}

              <div className="pt-2 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isSubmittingPassword || !passwords.current_password || !passwords.new_password}
                  className="h-9 px-6 bg-transparent border border-[#444] text-white hover:bg-[#222] hover:border-white text-sm font-medium rounded-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}