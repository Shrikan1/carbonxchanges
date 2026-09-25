import { useState } from 'react';
import { useAuthStore } from "../../store/useAuthStore";
import * as profileApi from "../../api/endpoint/Profileapi";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { motion, AnimatePresence } from 'motion/react';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiShield, FiCheck, FiX, FiChevronDown, FiChevronUp, FiPhone, FiMapPin, FiCalendar, FiGlobe } from 'react-icons/fi';
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
    <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6"
      >
        {/* Left Column: Information */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-[13px] md:text-sm wise-font font-black uppercase text-gray-900 tracking-tight">Information</h2>
            </div>
            
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiGlobe className="w-4 h-4 mr-2.5" />
                  <span className="text-[13px] font-medium">Website</span>
                </div>
                <span className="text-[13px] text-gray-900 font-semibold truncate max-w-[140px]">N/A</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiMail className="w-4 h-4 mr-2.5" />
                  <span className="text-[13px] font-medium">Email</span>
                </div>
                <span className="text-[13px] text-gray-900 font-semibold truncate max-w-[140px]">{user?.email || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiPhone className="w-4 h-4 mr-2.5" />
                  <span className="text-[13px] font-medium">Phone</span>
                </div>
                <span className="text-[13px] text-gray-900 font-semibold truncate max-w-[140px]">{user?.phone_number || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiMapPin className="w-4 h-4 mr-2.5" />
                  <span className="text-[13px] font-medium">Address</span>
                </div>
                <span className="text-[13px] text-gray-900 font-semibold truncate max-w-[140px]">{user?.address || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <FiCalendar className="w-4 h-4 mr-2.5" />
                  <span className="text-[13px] font-medium">Joined</span>
                </div>
                <span className="text-[13px] text-gray-900 font-semibold">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Settings & Security */}
        <div className="lg:col-span-2 space-y-5 lg:space-y-6">
          
          {/* Account Details Card */}
          <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-[13px] md:text-sm wise-font font-black uppercase text-gray-900 tracking-tight">Account Details</h2>
            </div>
            
            <div className="p-5">
              <form onSubmit={handleNameSubmit} className="space-y-5 flex flex-col max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[#0c0c0c] font-mono text-[11px] font-bold uppercase tracking-wider">Email Address</Label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="pl-9 bg-gray-50 border-[#0c0c0c] text-gray-500 h-10 font-mono text-[13px] cursor-not-allowed rounded-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-[#0c0c0c] font-mono text-[11px] font-bold uppercase tracking-wider">Full Name</Label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="pl-9 bg-white border-[#0c0c0c] text-gray-900 h-10 font-mono text-[13px] focus:border-gray-900 focus:outline-none transition-all rounded-sm"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {nameStatus && (
                  <div className={`p-3 flex items-center space-x-2.5 text-[13px] border rounded-sm ${nameStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-[#f7fee7] border-[#bef264] text-gray-900'}`}>
                    <div className={`flex items-center justify-center w-5 h-5 rounded-sm ${nameStatus.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#bef264]/30 text-[#65a30d]'}`}>
                      {nameStatus.type === 'error' ? <FiX size={12} /> : <FiCheck size={12} />}
                    </div>
                    <span className="font-medium">{nameStatus.message}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-start sm:justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingName || name === user?.name}
                    className="h-10 px-6 w-full sm:w-auto bg-[#c2ed6d] hover:bg-[#a3e635] text-[#0c0c0c] text-[12px] font-mono font-bold uppercase tracking-wider border-[2px] border-[#0c0c0c] transition-colors disabled:opacity-50 rounded-sm"
                  >
                    {isSubmittingName ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-white border border-gray-200 shadow-sm flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-[13px] md:text-sm wise-font font-black uppercase text-gray-900 tracking-tight">Security</h2>
            </div>
            
            <div className="p-5">
              <form onSubmit={handlePasswordSubmit} className="space-y-5 flex flex-col max-w-md">
                <div className="space-y-1.5">
                  <Label htmlFor="current_password" className="text-[#0c0c0c] font-mono text-[11px] font-bold uppercase tracking-wider">Current Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="current_password"
                      type="password"
                      required
                      value={passwords.current_password}
                      onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                      className="pl-9 bg-white border-[#0c0c0c] text-gray-900 h-10 font-mono text-[13px] focus:border-gray-900 focus:outline-none transition-all rounded-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new_password" className="text-[#0c0c0c] font-mono text-[11px] font-bold uppercase tracking-wider">New Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="new_password"
                      type="password"
                      required
                      minLength={8}
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                      className="pl-9 bg-white border-[#0c0c0c] text-gray-900 h-10 font-mono text-[13px] focus:border-gray-900 focus:outline-none transition-all rounded-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {passwordStatus && (
                  <div className={`p-3 flex items-center space-x-2.5 text-[13px] border rounded-sm ${passwordStatus.type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-[#f7fee7] border-[#bef264] text-gray-900'}`}>
                    <div className={`flex items-center justify-center w-5 h-5 rounded-sm ${passwordStatus.type === 'error' ? 'bg-red-100 text-red-600' : 'bg-[#bef264]/30 text-[#65a30d]'}`}>
                      {passwordStatus.type === 'error' ? <FiX size={12} /> : <FiCheck size={12} />}
                    </div>
                    <span className="font-medium">{passwordStatus.message}</span>
                  </div>
                )}

                <div className="pt-2 flex justify-start sm:justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingPassword || !passwords.current_password || !passwords.new_password}
                    className="h-10 px-6 w-full sm:w-auto bg-[#c2ed6d] hover:bg-[#a3e635] text-[#0c0c0c] text-[12px] font-mono font-bold uppercase tracking-wider border-[2px] border-[#0c0c0c] transition-colors disabled:opacity-50 rounded-sm"
                  >
                    {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </div>
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