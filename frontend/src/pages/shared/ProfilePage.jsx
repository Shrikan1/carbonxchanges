import { useState } from 'react';
import { useAuthStore } from "../../store/useAuthStore";
import * as profileApi from "../../api/endpoint/Profileapi";
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';

export default function ProfilePage() {
  const { user, updateUser, setToken } = useAuthStore();

  const [name, setName] = useState(user?.name || '');
  const [nameStatus, setNameStatus] = useState(null);

  const [passwords, setPasswords] = useState({ current_password: '', new_password: '' });
  const [passwordStatus, setPasswordStatus] = useState(null);

  async function handleNameSubmit(e) {
    e.preventDefault();
    setNameStatus(null);
    try {
      const { data } = await profileApi.updateProfile(name);
      updateUser(data.user);
      setNameStatus({ type: 'success', message: 'Profile updated' });
    } catch (err) {
      setNameStatus({ type: 'error', message: err.response?.data?.error || 'Update failed' });
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordStatus(null);
    try {
      const { data } = await profileApi.changePassword(passwords.current_password, passwords.new_password);
      // changePassword bumps token_version server-side and returns a fresh
      // token — without swapping it in here, every subsequent request from
      // THIS session would immediately fail as "revoked."
      setToken(data.token);
      setPasswords({ current_password: '', new_password: '' });
      setPasswordStatus({ type: 'success', message: 'Password changed' });
    } catch (err) {
      setPasswordStatus({ type: 'error', message: err.response?.data?.error || 'Change failed' });
    }
  }

  return (
    <div className="max-w-lg mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Profile</h1>

      <form onSubmit={handleNameSubmit} className="space-y-4">
        <h2 className="font-semibold">Account details</h2>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={user?.email || ''} disabled />
        </div>

        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        {nameStatus && (
          <p className={`text-sm ${nameStatus.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {nameStatus.message}
          </p>
        )}

        <Button type="submit">Save changes</Button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-6 border-t border-border">
        <h2 className="font-semibold">Change password</h2>

        <div>
          <Label htmlFor="current_password">Current password</Label>
          <Input
            id="current_password"
            type="password"
            required
            value={passwords.current_password}
            onChange={(e) => setPasswords({ ...passwords, current_password: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="new_password">New password</Label>
          <Input
            id="new_password"
            type="password"
            required
            minLength={8}
            value={passwords.new_password}
            onChange={(e) => setPasswords({ ...passwords, new_password: e.target.value })}
          />
        </div>

        {passwordStatus && (
          <p className={`text-sm ${passwordStatus.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>
            {passwordStatus.message}
          </p>
        )}

        <Button type="submit">Change password</Button>
      </form>
    </div>
  );
}