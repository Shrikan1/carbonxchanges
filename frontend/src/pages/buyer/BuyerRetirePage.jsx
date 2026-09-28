import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useBuyerStore } from '../../store/useBuyerStore';
import { getCarbonTokenContract } from '../../lib/carbonTokenContract';
import { toOnChainAmount } from '../../lib/carbonTokenAbi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import BuyerLayout from '../../components/layout/BuyerLayout';
import toast from 'react-hot-toast';
import {
  FiZap, FiShield, FiAlertTriangle, FiCheckCircle, FiArrowRight
} from 'react-icons/fi';

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
      setError('Please connect your MetaMask wallet before retiring credits.');
      return;
    }

    setSubmitting(true);
    try {
      const contract      = await getCarbonTokenContract();
      const signerAddress = await contract.runner.getAddress();

      const tx      = await contract.burn(signerAddress, Number(form.batch_id), toOnChainAmount(form.amount));
      const receipt = await tx.wait();

      const data = await retireCredits({
        batch_id:          Number(form.batch_id),
        amount:            Number(form.amount),
        burn_tx_hash:      receipt.hash,
        retirement_reason: form.retirement_reason || undefined,
        beneficiary_name:  form.beneficiary_name  || undefined,
      });

      toast.success(data.message || 'Credits permanently retired.');
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
      subtitle="Permanently burn carbon tokens on-chain as verified climate impact and ESG offsets."
    >
      <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5 lg:space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

          {/* ── LEFT: RETIREMENT FORM (7 cols) ── */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-5 py-4 border-b border-gray-200">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight flex items-center gap-2">
                <FiZap className="text-emerald-600" /> Retirement Details
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
              <div>
                <Label htmlFor="batch_id" className="text-xs font-bold uppercase tracking-wider text-gray-700">Batch ID</Label>
                <div className="mt-1">
                  <Input
                    id="batch_id"
                    required
                    placeholder="e.g. 12"
                    value={form.batch_id}
                    onChange={(e) => set('batch_id', e.target.value)}
                    className="h-10 text-sm font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  The specific minted credit batch ID from your portfolio holdings.
                </p>
              </div>

              <div>
                <Label htmlFor="amount" className="text-xs font-bold uppercase tracking-wider text-gray-700">Amount (tCO₂e)</Label>
                <div className="mt-1">
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="e.g. 10.5"
                    value={form.amount}
                    onChange={(e) => set('amount', e.target.value)}
                    className="h-10 text-sm font-mono"
                  />
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  Each unit represents 1 metric ton of verified carbon dioxide equivalent.
                </p>
              </div>

              <div>
                <Label htmlFor="retirement_reason" className="text-xs font-bold uppercase tracking-wider text-gray-700">Retirement Purpose (Optional)</Label>
                <div className="mt-1">
                  <Input
                    id="retirement_reason"
                    placeholder="e.g. Scope 1 & 2 Emissions Offset for Q4 2026"
                    value={form.retirement_reason}
                    onChange={(e) => set('retirement_reason', e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="beneficiary_name" className="text-xs font-bold uppercase tracking-wider text-gray-700">Beneficiary / Claimed By (Optional)</Label>
                <div className="mt-1">
                  <Input
                    id="beneficiary_name"
                    placeholder="Defaults to your registered name or company"
                    value={form.beneficiary_name}
                    onChange={(e) => set('beneficiary_name', e.target.value)}
                    className="h-10 text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700 rounded-md flex items-start gap-2">
                  <FiAlertTriangle className="shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#173d25] hover:bg-[#112d1b] text-white font-bold h-11 text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  {submitting ? 'Submitting on-chain burn...' : 'Retire Credits (Sign Transaction)'}
                </Button>
              </div>
            </form>
          </div>

          {/* ── RIGHT: EXPLANATION & SAFEGUARDS (5 cols) ── */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#173d25] text-white rounded-lg p-5 sm:p-6 shadow-sm">
              <div className="w-10 h-10 rounded-full bg-white/10 text-[#bef264] flex items-center justify-center mb-3">
                <FiShield size={20} />
              </div>
              <h3 className="text-base font-bold tracking-tight mb-2">
                Permanent On-Chain Burn
              </h3>
              <p className="text-xs text-white/80 leading-relaxed">
                When you retire carbon credits, the smart contract permanently destroys (burns) the tokens from your wallet. This mathematically prevents double-counting and guarantees exclusive ownership of the environmental claim.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                What happens next?
              </h4>
              <ul className="text-xs text-gray-600 space-y-2.5">
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>Your MetaMask wallet prompts you to approve the token burn transaction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>The backend verifies the burn transaction receipt directly on the blockchain.</span>
                </li>
                <li className="flex items-start gap-2">
                  <FiCheckCircle className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>An official verifiable PDF Retirement Certificate is minted and added to your Certificates page.</span>
                </li>
              </ul>

              <div className="pt-3 border-t border-gray-100">
                <Link
                  to="/buyer/portfolio"
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                >
                  Check my current holdings <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>

        </div>

      </div>
    </BuyerLayout>
  );
}
