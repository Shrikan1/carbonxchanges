import { useState, useRef, useEffect, forwardRef, Children, isValidElement } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../lib/utils';
import { FiChevronDown, FiCheck } from 'react-icons/fi';

const sans = {
  fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  textTransform: 'none',
  letterSpacing: 'normal',
};

/**
 * Custom styled dropdown replacing native <select>.
 * Same API: pass <option> children, value, onChange.
 */
export const Select = forwardRef(({ className, children, value, onChange, id, required, style, ...props }, ref) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const btnRef = useRef(null);
  const panelRef = useRef(null);

  // Flatten React children into option objects
  const options = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === 'option') {
      options.push({
        value: child.props.value ?? '',
        label: child.props.children ?? '',
        disabled: !!child.props.disabled,
      });
    }
  });

  const selected = options.find(o => String(o.value) === String(value));
  const displayLabel = selected?.label || options.find(o => o.disabled)?.label || 'Select...';
  const isPlaceholder = !selected || selected.disabled;

  // Position the panel relative to viewport
  useEffect(() => {
    if (open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    }
  }, [open]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (btnRef.current?.contains(e.target)) return;
      if (panelRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSelect = (val) => {
    onChange?.({ target: { value: val, name: props.name } });
    setOpen(false);
  };

  return (
    <>
      {/* Hidden native select for form validation */}
      <select ref={ref} id={id} value={value} onChange={onChange} required={required}
        className="sr-only" tabIndex={-1} aria-hidden="true" {...props}>
        {children}
      </select>

      {/* Trigger */}
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen(p => !p)}
        className={cn(
          'flex h-[42px] w-full items-center justify-between rounded-xl border bg-white px-4 py-2 text-[15px] outline-none transition-all duration-200 shadow-sm',
          'border-gray-300 hover:border-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          open && 'border-gray-900 ring-2 ring-gray-900/10',
          className
        )}
        style={{ ...sans, ...style }}
      >
        <span className={isPlaceholder ? 'text-gray-400' : 'text-gray-800'}>{displayLabel}</span>
        <FiChevronDown size={15} className={`text-gray-400 transition-transform duration-200 shrink-0 ml-2 ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Portal dropdown */}
      {open && createPortal(
        <div
          ref={panelRef}
          className="bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto py-1"
          style={{ ...sans, position: 'fixed', top: pos.top, left: pos.left, width: pos.width, zIndex: 9999 }}
        >
          {options.map((opt, i) => {
            const isSel = String(opt.value) === String(value);
            return (
              <button
                key={`${opt.value}-${i}`}
                type="button"
                disabled={opt.disabled}
                onClick={() => !opt.disabled && handleSelect(opt.value)}
                className={cn(
                  'flex items-center justify-between w-full px-3 py-2 text-sm text-left transition-colors',
                  opt.disabled && 'text-gray-300 cursor-default',
                  !opt.disabled && !isSel && 'text-gray-700 hover:bg-gray-50 cursor-pointer',
                  isSel && 'text-gray-900 bg-gray-50 font-medium',
                )}
                style={sans}
              >
                <span>{opt.label}</span>
                {isSel && !opt.disabled && <FiCheck size={14} className="text-emerald-500 shrink-0" />}
              </button>
            );
          })}
        </div>,
        document.body
      )}
    </>
  );
});

Select.displayName = 'Select';
