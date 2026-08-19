import { useEffect } from 'react';
import { FiX, FiExternalLink } from 'react-icons/fi';

export default function GoogleMapModal({ lat, lng, label, onClose }) {
  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const googleMapsUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-[95vw] max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{label || 'Project Location'}</h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {lat}, {lng}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a
              href={googleMapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors px-3 py-1.5 rounded-lg hover:bg-emerald-50"
            >
              Open in Google Maps <FiExternalLink />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        {/* Map iframe */}
        <div className="w-full h-[70vh]">
          <iframe
            src={googleMapsUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Maps - Project Location"
          />
        </div>
      </div>
    </div>
  );
}
