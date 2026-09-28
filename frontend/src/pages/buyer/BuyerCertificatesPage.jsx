import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useBuyerStore } from '../../store/useBuyerStore';
import { downloadCertificate } from '../../api/endpoint/buyerApi';
import BuyerLayout from '../../components/layout/BuyerLayout';
import {
  FiAward, FiDownload, FiFileText, FiCheckCircle, FiShield, FiArrowRight
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function BuyerCertificatesPage() {
  const { certificates, loading, fetchCertificates } = useBuyerStore();
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchCertificates();
  }, []);

  async function handleDownload(id) {
    setDownloadingId(id);
    try {
      await downloadCertificate(id);
      toast.success('Certificate downloaded');
    } catch (err) {
      console.error(err);
      toast.error('Failed to download certificate');
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <BuyerLayout
      title="Retirement Certificates"
      subtitle="Official cryptographic proof of permanent carbon credit retirements for ESG reporting."
    >
      <div className="p-4 lg:p-6 max-w-5xl mx-auto w-full space-y-5 lg:space-y-6">

        {/* ── ESG TRUST BANNER ── */}
        <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-lg p-4 text-xs text-emerald-950 flex items-start gap-3 shadow-xs">
          <FiShield className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <span className="font-bold">Audit-Ready Compliance:</span> Each certificate represents permanent on-chain token burning on Polygon. These official PDF certificates include verifiable serials for sustainability and corporate ESG reports.
          </div>
        </div>

        {/* ── CERTIFICATES CONTAINER CARD ── */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <h2 className="text-[13px] md:text-sm font-bold uppercase text-gray-900 tracking-tight">
                Issued Certificates
              </h2>
              {certificates && certificates.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {certificates.length} {certificates.length === 1 ? 'Certificate' : 'Certificates'}
                </span>
              )}
            </div>
            <Link
              to="/buyer/portfolio"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 transition-colors flex items-center gap-1"
            >
              My Portfolio <FiArrowRight size={13} />
            </Link>
          </div>

          <div className="flex-1 bg-white">
            {loading ? (
              <div className="p-6 space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-50 rounded-lg animate-pulse" />
                ))}
              </div>
            ) : !certificates || certificates.length === 0 ? (
              <div className="p-14 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
                  <FiAward className="w-7 h-7" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-1">No retirement certificates yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-6">
                  When you retire credits from your portfolio, official cryptographic certificates are generated here for immediate download.
                </p>
                <Link
                  to="/buyer/portfolio"
                  className="inline-flex items-center gap-2 bg-[#173d25] hover:bg-[#112d1b] text-white px-5 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
                >
                  <FiFileText className="w-4 h-4" /> Go to Portfolio
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {certificates.map((c) => (
                  <div key={c.id} className="p-5 sm:p-6 hover:bg-gray-50/50 transition-colors">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                          <FiAward size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                              {c.project_title || 'Carbon Offset Certificate'}
                            </h3>
                            <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                              CERT-#{String(c.id).padStart(5, '0')}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 mt-1">
                            Retired on {new Date(c.retired_at || c.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            {c.beneficiary_name && (
                              <span className="font-medium text-gray-700"> · In name of {c.beneficiary_name}</span>
                            )}
                          </p>

                          <div className="mt-2 flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded">
                              {Number(c.amount).toLocaleString()} tCO₂e Offset
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <button
                          onClick={() => handleDownload(c.id)}
                          disabled={downloadingId === c.id}
                          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-gray-900 bg-white hover:bg-gray-900 text-gray-800 hover:text-white text-xs font-bold rounded transition-all shadow-xs disabled:opacity-50"
                        >
                          <FiDownload size={14} />
                          {downloadingId === c.id ? 'Downloading...' : 'Download PDF'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </BuyerLayout>
  );
}
