import React from 'react';

export function NumberPicker({ value, onChange, min, max, step = 1, maxDecimals, className = '', id }) {
  const isFloat = step === 'any' || step < 1;

  const handleChange = (e) => {
    let val = e.target.value;
    
    // Prevent typing extremely long numbers (prevent overflow)
    if (val.length > 15) return;
    
    // Strip out all characters except digits, minus, and decimal point
    // This strictly prevents "21345675643241323674erdhgsfcvb" from being copy-pasted or typed
    // if the browser doesn't block it for some reason.
    val = val.replace(/[^\d.-]/g, '');

    if (maxDecimals !== undefined && val.includes('.')) {
      const parts = val.split('.');
      if (parts[1].length > maxDecimals) {
        val = `${parts[0]}.${parts[1].slice(0, maxDecimals)}`;
      }
    }
    onChange(val);
  };

  const handleBlur = (e) => {
     let val = Number(e.target.value);
     if (isNaN(val)) return;
     if (min !== undefined && val < min) val = min;
     if (max !== undefined && val > max) val = max;
     onChange(val.toString());
  };

  return (
    <div className={`flex items-center w-full border rounded-xl h-[42px] transition-all duration-200 bg-white border-gray-300 focus-within:border-gray-900 focus-within:ring-2 focus-within:ring-gray-900/10 overflow-hidden ${className}`}>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        className="flex-1 w-full h-full px-4 text-left text-gray-900 font-medium bg-transparent border-none focus:outline-none focus:ring-0"
        placeholder="Enter number..."
      />
    </div>
  );
}
