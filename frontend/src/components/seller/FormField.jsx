import { useState, useRef } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Label } from '../ui/Label';
import { DatePicker } from '../ui/DatePicker';
import { NumberPicker } from '../ui/NumberPicker';
import { FiUpload, FiCheckCircle, FiCheck, FiAlertCircle, FiLoader, FiX } from 'react-icons/fi';
import api from '../../api/axiosInstance';
import FileUploadZone from '../ui/FileUploadZone';

/**
 * FormField renders one form field from a projectFormConfig field definition.
 *
 * Props:
 *   field    — field config object
 *   value    — current value from formData
 *   onChange — (name, value) => void
 *   error    — optional per-field error string
 */
export default function FormField({ field, value, onChange, error }) {
  const { name, label, type, options, required, description, hint, min, max, step, accept, kycPurpose } = field;

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  // ── File (KYC document) upload ─────────────────────────────────────────────
  if (type === 'file') {
    async function handleFileSelect(file) {
      if (!file) return;

      setUploading(true);
      setUploadError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('purpose', kycPurpose || 'aadhaar');

        const res = await api.post('/upload/kyc', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        onChange(name, res.data.storagePath);
        setUploadedFileName(file.name);
      } catch (err) {
        const status = err.response?.status;
        const msg = err.response?.data?.error || 'Upload failed. Please try again.';

        if (status === 503) {
          setUploadError('Storage service is temporarily unavailable. You can save the draft and upload documents later.');
        } else {
          setUploadError(msg);
        }
      } finally {
        setUploading(false);
      }
    }

    function handleClear() {
      onChange(name, null);
      setUploadedFileName(null);
      setUploadError(null);
    }

    return (
      <div>
        {/* Label */}
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>

        {/* Description */}
        {description && (
          <p className="text-xs font-mono text-gray-500 mt-0.5 mb-2 leading-relaxed">{description}</p>
        )}

        {/* Hint (format / size) */}
        {hint && (
          <p className="text-[11px] text-gray-400 mb-2 font-medium tracking-wide">{hint}</p>
        )}

        <div>
          {value && !uploading ? (
            <FileUploadZone
              uploading={false}
              uploadedFiles={[{ name: uploadedFileName || 'Document uploaded' }]}
              onRemoveFile={handleClear}
              disabled={false}
              mediaType="document"
            />
          ) : (
            <FileUploadZone
              onFileSelect={handleFileSelect}
              accept={accept}
              uploading={uploading}
              disabled={uploading}
              maxSizeMB={15}
              formats="JPEG, PNG, WEBP, PDF"
              mediaType="document"
            />
          )}

          {(uploadError || error) && (
            <div className="flex items-start gap-1.5 mt-1.5">
              <FiAlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={13} />
              <p className="text-xs text-red-600">{uploadError || error}</p>
            </div>
          )}

          {/* Optional hint when no doc is uploaded */}
          {!value && !uploadError && !error && (
            <p className="text-[11px] text-gray-400 mt-1.5">Optional for draft — required before submitting for review.</p>
          )}
        </div>
      </div>
    );
  }

  // ── Checkbox ───────────────────────────────────────────────────────────────
  if (type === 'checkbox') {
    return (
      <div>
        <label className="flex items-start gap-3 text-[15px] cursor-pointer group">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              id={name}
              type="checkbox"
              checked={!!value}
              onChange={(e) => onChange(name, e.target.checked)}
              className="peer sr-only"
            />
            <div className={`w-5 h-5 rounded-[6px] border transition-all duration-200 flex items-center justify-center ${
              !!value 
                ? 'bg-gray-900 border-gray-900 text-white shadow-sm' 
                : 'bg-white border-gray-300 group-hover:border-gray-400'
            } peer-focus-visible:ring-2 peer-focus-visible:ring-gray-900/20`}>
              {!!value && <FiCheck size={14} strokeWidth={3.5} />}
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-gray-900 font-medium group-hover:text-black transition-colors select-none">
              {label}
            </span>
            {description && (
              <p className="text-[13px] font-mono text-gray-500 mt-0.5 leading-relaxed">{description}</p>
            )}
          </div>
        </label>
      </div>
    );
  }

  // ── All other field types ─────────────────────────────────────────────────
  const borderClass = error ? 'border-red-400 focus:ring-red-400' : '';

  return (
    <div>
      {/* Label */}
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {/* Description — shows below label, above the input */}
      {description && (
        <p className="text-xs text-gray-500 mt-0.5 mb-2 leading-relaxed">{description}</p>
      )}

      {/* Input */}
      <div className={description ? '' : 'mt-1.5'}>
        {type === 'textarea' && (
          <Textarea
            id={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={borderClass}
          />
        )}

        {type === 'select' && (
          <Select
            id={name}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={borderClass}
          >
            <option value="">Select...</option>
            {(options || []).map((opt) => {
              const isString = typeof opt === 'string';
              return (
                <option key={isString ? opt : opt.value} value={isString ? opt : opt.value}>
                  {isString ? opt : opt.label}
                </option>
              );
            })}
          </Select>
        )}

        {type === 'text' && (
          <Input
            id={name}
            type={type}
            value={value || ''}
            onChange={(e) => onChange(name, e.target.value)}
            className={borderClass}
          />
        )}

        {type === 'date' && (
          <DatePicker
            value={value || ''}
            onChange={(val) => onChange(name, val)}
            className={borderClass}
          />
        )}

        {type === 'number' && (
          <NumberPicker
            id={name}
            value={value ?? ''}
            onChange={(val) => onChange(name, val)}
            min={min}
            max={max}
            step={step || 'any'}
            maxDecimals={name.includes('years') ? 1 : undefined}
            className={borderClass}
          />
        )}
      </div>

      {/* Inline error */}
      {error && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <FiAlertCircle className="text-red-500 flex-shrink-0" size={13} />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}
    </div>
  );
}