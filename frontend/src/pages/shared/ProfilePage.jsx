import { useState } from 'react';
import { useAuthStore } from "../../store/useAuthStore";
import * as profileApi from "../../api/endpoint/Profileapi";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { motion } from 'motion/react';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiShield, FiCheck, FiX } from 'react-icons/fi';
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
    <div className="min-h-screen w-full flex flex-col items-center bg-[#f4f7f5] text-gray-900 pt-24 pb-12 font-sans">
      <div className="w-full max-w-[900px] px-4 md:px-8">
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full"
        >
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 text-sm font-medium"
            >
              <FiArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-2">Profile Settings</h1>
            <p className="text-gray-500 text-sm">Manage your account details and security preferences.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Account Details Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiUser size={18} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Account Details
                </h3>
              </div>

              <form onSubmit={handleNameSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-gray-700 text-sm font-medium">Email Address</Label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="email" 
                      value={user?.email || ''} 
                      disabled 
                      className="pl-10 bg-gray-50 border-gray-200 text-gray-500 h-11 rounded-xl text-sm cursor-not-allowed shadow-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="name" className="text-gray-700 text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)} 
                      className="pl-10 bg-white border-gray-200 text-gray-900 h-11 rounded-xl text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-none"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {nameStatus && (
                  <div className={`p-3 rounded-lg flex items-center space-x-2 text-sm mt-2 ${nameStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {nameStatus.type === 'error' ? <FiX /> : <FiCheck />}
                    <span>{nameStatus.message}</span>
                  </div>
                )}

                <div className="pt-4 mt-auto flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingName || name === user?.name}
                    className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isSubmittingName ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>

            {/* Security Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100 flex flex-col">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <FiShield size={18} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Security
                </h3>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-5 flex-1 flex flex-col">
                <div className="space-y-1.5">
                  <Label htmlFor="current_password" className="text-gray-700 text-sm font-medium">Current Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="current_password"
                      type="password"
                      required
                      value={passwords.current_password}
                      onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
                      className="pl-10 bg-white border-gray-200 text-gray-900 h-11 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="new_password" className="text-gray-700 text-sm font-medium">New Password</Label>
                  <div className="relative">
                    <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      id="new_password"
                      type="password"
                      required
                      minLength={8}
                      value={passwords.new_password}
                      onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
                      className="pl-10 bg-white border-gray-200 text-gray-900 h-11 rounded-xl text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-none"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {passwordStatus && (
                  <div className={`p-3 rounded-lg flex items-center space-x-2 text-sm mt-2 ${passwordStatus.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                    {passwordStatus.type === 'error' ? <FiX /> : <FiCheck />}
                    <span>{passwordStatus.message}</span>
                  </div>
                )}

                <div className="pt-4 mt-auto flex justify-end">
                  <Button 
                    type="submit" 
                    disabled={isSubmittingPassword || !passwords.current_password || !passwords.new_password}
                    className="h-11 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {isSubmittingPassword ? 'Updating...' : 'Update Password'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}