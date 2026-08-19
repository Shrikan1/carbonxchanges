import { useState } from 'react';
import { FiMaximize2, FiExternalLink, FiFileText } from 'react-icons/fi';

export default function DocumentEmbed({ url, title }) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Simple heuristic to check if it's an image based on the URL extension.
  // Determine if it's an image by inspecting the URL pathname (ignoring query strings like ?token=...)
  let isImage = false;
  try {
    const urlObj = new URL(url, window.location.origin);
    isImage = /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(urlObj.pathname);
  } catch (e) {
    isImage = /\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i.test(url);
  }

  const content = isImage ? (
    <img src={url} alt={title} className="w-full h-full object-contain bg-gray-50" />
  ) : (
    <iframe src={url} className="w-full h-full border-0 bg-gray-50" title={title} />
  );

  return (
    <div className="flex flex-col border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <FiFileText className="text-emerald-600" />
          <h4 className="text-sm font-semibold text-gray-700 truncate max-w-[200px]" title={title}>
            {title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
            title="Expand"
          >
            <FiMaximize2 size={16} />
          </button>
        </div>
      </div>
      
      <div className="relative h-64 md:h-80 w-full group">
        {content}
      </div>

      {isFullscreen && (
        <div 
          className="fixed inset-0 z-[9999] flex flex-col bg-black/90 backdrop-blur-sm"
          onClick={() => setIsFullscreen(false)}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsFullscreen(false)}
              className="text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors"
            >
              Close
            </button>
          </div>
          <div 
            className="flex-1 w-full max-w-6xl mx-auto p-4 pb-8 overflow-hidden flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {isImage ? (
              <img src={url} alt={title} className="max-w-full max-h-full object-contain rounded-lg" />
            ) : (
              <iframe src={url} className="w-full h-full border-0 rounded-xl bg-white" title={title} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
