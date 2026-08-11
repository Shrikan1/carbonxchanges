import { useState, useEffect } from 'react';
import { useUIStore } from '../store/useUIStore';
import { useAuthStore } from '../store/useAuthStore';
import * as roleApi from '../api/endpoint/Roleapi';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Label } from './ui/Label';

export default function BecomeMemberModal() {
  const { becomeMemberModal, closeBecomeMemberModal } = useUIStore();
  const setSession = useAuthStore((s) => s.setSession);
  const user = useAuthStore((s) => s.user);

  const [step, setStep] = useState('form'); // 'form' | 'otp'
  const [roleType, setRoleType] = useState('seller');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Reset to a clean first step every time the modal opens, and pre-select
  // the role if it was opened automatically (see axiosInstance's
  // ROLE_VERIFICATION_REQUIRED handling) rather than by a generic click.
  useEffect(() => {
    if (becomeMemberModal.open) {
      setStep('form');
      setError(null);
      setName(user?.name || '');
      setPhone('');
      setOtpCode('');
      if (becomeMemberModal.presetRole) setRoleType(becomeMemberModal.presetRole);
    }
  }, [becomeMemberModal.open]);

  if (!becomeMemberModal.open) return null;

  async function handleRequestSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await roleApi.requestRoleUpgrade(roleType, name, phone);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to start verification');
    } finally {
      setLoading(false);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await roleApi.verifyRoleUpgrade(otpCode);
      setSession(data.user, data.token); // fresh token with is_seller/is_buyer now set
      closeBecomeMemberModal();
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg border border-border w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Become a Member</h2>
          <button onClick={closeBecomeMemberModal} className="text-muted-foreground hover:text-foreground">
            &times;
          </button>
        </div>

        {step === 'form' && (
          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div>
              <Label>I want to</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role_type"
                    value="seller"
                    checked={roleType === 'seller'}
                    onChange={() => setRoleType('seller')}
                  />
                  Sell carbon credits
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="role_type"
                    value="buyer"
                    checked={roleType === 'buyer'}
                    onChange={() => setRoleType('buyer')}
                  />
                  Buy carbon credits
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="member-name">Name</Label>
              <Input id="member-name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="member-phone">Phone number</Label>
              <Input
                id="member-phone"
                required
                placeholder="+91..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending code...' : 'Continue'}
            </Button>
          </form>
        )}

        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter the code we emailed you to confirm {roleType} access.
            </p>
            <div>
              <Label htmlFor="member-otp">Verification code</Label>
              <Input
                id="member-otp"
                required
                maxLength={6}
                inputMode="numeric"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Verifying...' : 'Confirm'}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}