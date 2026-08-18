import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FiUploadCloud, FiFile, FiX, FiCheckCircle, FiImage, FiVideo } from 'react-icons/fi';

const sans = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  textTransform: 'none',
  letterSpacing: 'normal',
};

export default function FileUploadZone({
  onFileSelect,
  accept = '*',
  maxSizeMB = 10,
  formats = 'JPG, PNG, PDF',
  uploading = false,
  uploadProgress = 0,
  uploadedFiles = [],
  onRemoveFile,
  disabled = false,
  mediaType = 'document',
  pendingFile = null,
  onClearPending,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const onDragOver = useCallback((e) => { e.preventDefault(); if (!disabled && !uploading) setIsDragging(true); }, [disabled, uploading]);
  const onDragLeave = useCallback((e) => { e.preventDefault(); setIsDragging(false); }, []);
  const onDrop = useCallback((e) => {
    e.preventDefault(); setIsDragging(false);
    if (disabled || uploading) return;
    const f = e.dataTransfer.files[0];
    if (f) onFileSelect?.(f);
  }, [disabled, uploading, onFileSelect]);

  const onChange = (e) => { const f = e.target.files[0]; if (f) onFileSelect?.(f); e.target.value = null; };

  return (
    <div style={sans}>

      {/* uploaded files */}
      <AnimatePresence>
        {uploadedFiles.map((item, i) => (
          <motion.div key={item.url || i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 mb-2 bg-white">
            {mediaType === 'image'
              ? <img src={item.url} alt="" className="w-9 h-9 rounded object-cover border border-gray-100" />
              : <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                  {mediaType === 'video' ? <FiVideo size={14} /> : <FiFile size={14} />}
                </div>
            }
            <div className="flex-grow min-w-0">
              <p className="text-[13px] text-gray-800 truncate" style={sans}>{item.name}</p>
              <p className="text-[10px] text-gray-400 flex items-center gap-1" style={sans}>
                <FiCheckCircle size={9} className="text-emerald-500" /> Uploaded
              </p>
            </div>
            {onRemoveFile && (
              <button type="button" onClick={() => onRemoveFile(i)} className="text-gray-300 hover:text-red-500 transition-colors p-1">
                <FiX size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* pending / uploading file */}
      {(pendingFile || (uploading && pendingFile)) && (
        <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-3 py-2.5 mb-2 bg-white">
          <div className="w-9 h-9 rounded bg-gray-100 flex items-center justify-center text-gray-400">
            <FiFile size={14} />
          </div>
          <div className="flex-grow min-w-0">
            <p className="text-[13px] text-gray-800 truncate" style={sans}>{pendingFile.name}</p>
            {uploading ? (
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-grow h-1 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-indigo-500 rounded-full"
                    initial={{ width: '0%' }} animate={{ width: uploadProgress > 0 ? `${uploadProgress}%` : '45%' }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 shrink-0" style={sans}>{uploadProgress > 0 ? `${uploadProgress}%` : '...'}</span>
              </div>
            ) : (
              <p className="text-[10px] text-gray-400" style={sans}>{(pendingFile.size / 1024).toFixed(0)} KB</p>
            )}
          </div>
          {!uploading && onClearPending && (
            <button type="button" onClick={onClearPending} className="text-gray-300 hover:text-red-500 transition-colors p-1">
              <FiX size={14} />
            </button>
          )}
        </div>
      )}

      {/* drop zone */}
      <div
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        onClick={() => !disabled && !uploading && inputRef.current?.click()}
        className={`
          flex flex-col items-center justify-center rounded-lg py-8 px-4 cursor-pointer transition-all
          border border-dashed
          ${isDragging ? 'border-indigo-400 bg-indigo-50/40' : disabled || uploading ? 'border-gray-200 bg-gray-50/50 opacity-50 cursor-not-allowed' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100/60'}
        `}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${isDragging ? 'bg-indigo-100 text-indigo-500' : 'bg-gray-200/70 text-gray-400'}`}>
          <FiUploadCloud size={20} />
        </div>

        <p className="text-sm text-gray-500 text-center" style={sans}>
          Drag & Drop or{' '}
          <span className="text-indigo-600 font-medium cursor-pointer underline underline-offset-2">Choose file</span>
          {' '}to upload
        </p>
        <p className="text-[11px] text-gray-400 mt-1" style={sans}>{maxSizeMB} MB max file size</p>

        <p className="text-[11px] text-gray-400 mt-3 pt-2 border-t border-gray-200 w-full text-center" style={sans}>{formats}</p>

        <input ref={inputRef} type="file" className="hidden" accept={accept} onChange={onChange} disabled={disabled || uploading} />
      </div>
    </div>
  );
}
