import React, { useState } from 'react';
import { FiX, FiDownload } from 'react-icons/fi';

export default function PdfViewerModal({ cid, onClose }) {
  const [downloading, setDownloading] = useState(false);

  if (!cid) return null;
  
  // Using ipfs.io as a more reliable public gateway than Pinata's restricted free gateway
  const url = `https://ipfs.io/ipfs/${cid}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = objectUrl;
      link.download = `Verification_Report_${cid.slice(0, 8)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (err) {
      console.error('Download failed', err);
      window.open(url, '_blank');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm p-4 md:p-8" onClick={onClose}>
      <div className="flex items-center justify-between mb-4" onClick={e => e.stopPropagation()}>
        <h3 className="text-white font-semibold text-lg">Verification PDF</h3>
        <div className="flex gap-4">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
          >
            <FiDownload /> {downloading ? 'Downloading...' : 'Download PDF'}
          </button>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>
      </div>
      <div 
        className="flex-1 w-full max-w-6xl mx-auto bg-white rounded-xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <iframe 
          src={url} 
          className="w-full h-full border-0" 
          title="Verification PDF"
        />
      </div>
    </div>
  );
}
