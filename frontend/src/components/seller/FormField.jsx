import { useState, useRef } from 'react';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Label } from '../ui/Label';
import { DatePicker } from '../ui/DatePicker';
import { NumberPicker } from '../ui/NumberPicker';
import { FiUpload, FiCheckCircle, FiCheck, FiAlertCircle, FiLoader, FiX } from 'react-icons/fi';
import api from '../../api/axiosInstance';

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
    async function handleFileChange(e) {
      const file = e.target.files[0];
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
        const msg = err.response?.data?.error || 'Upload failed. Please try again.';
        setUploadError(msg);
      } finally {
        setUploading(false);
        e.target.value = null;
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
          <p className="text-xs text-gray-500 mt-0.5 mb-2 leading-relaxed">{description}</p>
        )}

        {/* Hint (format / size) */}
        {hint && (
          <p className="text-[11px] text-gray-400 mb-2 font-medium tracking-wide">{hint}</p>
        )}

        <div>
          {value ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
              <div className="flex items-center gap-2 min-w-0">
                <FiCheckCircle className="text-emerald-500 flex-shrink-0" size={16} />
                <span className="text-sm text-emerald-700 font-medium truncate">
                  {uploadedFileName || 'Document uploaded'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleClear}
                className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <label
              htmlFor={name}
              className={`flex items-center justify-center gap-2.5 border-2 border-dashed rounded-xl px-4 py-4 cursor-pointer transition-colors
                ${uploadError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-emerald-400'}`}
            >
              <input
                id={name}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
              {uploading
                ? <FiLoader className="animate-spin text-emerald-500" size={18} />
                : <FiUpload className="text-gray-400" size={18} />
              }
              <span className="text-sm font-medium text-gray-600">
                {uploading ? 'Uploading...' : 'Click to upload'}
              </span>
            </label>
          )}

          {(uploadError || error) && (
            <div className="flex items-center gap-1.5 mt-1.5">
              <FiAlertCircle className="text-red-500 flex-shrink-0" size={13} />
              <p className="text-xs text-red-600">{uploadError || error}</p>
            </div>
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
              <p className="text-[13px] text-gray-500 mt-0.5 leading-relaxed">{description}</p>
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