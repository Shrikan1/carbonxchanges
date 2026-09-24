import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useBuyerStore } from '../../store/useBuyerStore';
import { getCarbonTokenContract } from '../../lib/carbonTokenContract';
import { toOnChainAmount } from '../../lib/carbonTokenAbi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import BuyerLayout from '../../components/layout/BuyerLayout';
import toast from 'react-hot-toast';

export default function BuyerRetirePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const retireCredits = useBuyerStore((s) => s.retireCredits);

  const [form, setForm] = useState({
    batch_id:          searchParams.get('batch_id') || '',
    amount:            '',
    retirement_reason: '',
    beneficiary_name:  '',
  });
  const [error, setError]         = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function set(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!user?.wallet_address) {
      setError('Connect a wallet before retiring credits.');
      return;
    }

    setSubmitting(true);
    try {
      // Real on-chain burn — this IS the retirement/offset claim. Only the
      // holder's own wallet can call this (proven in the contract's test
      // suite — not even the platform admin can force-burn someone's tokens).
      const contract      = await getCarbonTokenContract();
      const signerAddress = await contract.runner.getAddress();

      const tx      = await contract.burn(signerAddress, Number(form.batch_id), toOnChainAmount(form.amount));
      const receipt = await tx.wait();

      // Backend independently verifies the burn before recording anything
      const data = await retireCredits({
        batch_id:          Number(form.batch_id),
        amount:            Number(form.amount),
        burn_tx_hash:      receipt.hash,
        retirement_reason: form.retirement_reason || undefined,
        beneficiary_name:  form.beneficiary_name  || undefined,
      });

      toast.success(data.message || 'Credits retired successfully.');
      navigate('/buyer/certificates');
    } catch (err) {
      setError(err.response?.data?.error || err.reason || err.message || 'Failed to retire credits');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <BuyerLayout
      title="Retire Credits"
      subtitle="Permanently burn credits as your verified carbon offset claim."
    >
      <div className="max-w-lg mx-auto p-6">
        <p className="text-sm text-gray-500 mb-6">
          Retiring permanently burns these credits — this is your actual offset claim, and cannot be undone.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Batch ID</Label>
            <Input
              required
              value={form.batch_id}
              onChange={(e) => set('batch_id', e.target.value)}
            />
          </div>
          <div>
            <Label>Amount (tCO2e)</Label>
            <Input
              type="number"
              step="0.01"
              required
              value={form.amount}
              onChange={(e) => set('amount', e.target.value)}
            />
          </div>
          <div>
            <Label>Retirement Purpose (optional)</Label>
            <Input
              placeholder="e.g. 2026 Annual Emissions Offset"
              value={form.retirement_reason}
              onChange={(e) => set('retirement_reason', e.target.value)}
            />
          </div>
          <div>
            <Label>On Behalf Of (optional)</Label>
            <Input
              placeholder="Defaults to your own name"
              value={form.beneficiary_name}
              onChange={(e) => set('beneficiary_name', e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Processing...' : 'Retire (sign transaction)'}
          </Button>
        </form>
      </div>
    </BuyerLayout>
  );
}
