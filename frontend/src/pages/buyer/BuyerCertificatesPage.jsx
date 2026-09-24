import { useEffect } from 'react';
import { useBuyerStore } from '../../store/useBuyerStore';
import { downloadCertificate } from '../../api/endpoint/buyerApi';
import { Button } from '../../components/ui/Button';
import BuyerLayout from '../../components/layout/BuyerLayout';

export default function BuyerCertificatesPage() {
  const { certificates, fetchCertificates } = useBuyerStore();

  useEffect(() => {
    fetchCertificates();
  }, []);

  return (
    <BuyerLayout title="Retirement Certificates" subtitle="Download proof of your verified carbon offsets.">
      <div className="max-w-2xl mx-auto p-6 space-y-4">

        {certificates.length === 0 && (
          <p className="text-sm text-gray-400">No certificates yet.</p>
        )}

        <div className="space-y-2">
          {certificates.map((c) => (
            <div
              key={c.id}
              className="border border-gray-200 rounded-lg p-4 flex justify-between items-center bg-white"
            >
              <div>
                <p className="font-medium">{c.project_title}</p>
                <p className="text-sm text-gray-500">
                  {c.amount} tCO2e — {new Date(c.retired_at).toLocaleDateString()}
                </p>
              </div>
              <Button variant="outline" onClick={() => downloadCertificate(c.id)}>
                Download PDF
              </Button>
            </div>
          ))}
        </div>
      </div>
    </BuyerLayout>
  );
}
