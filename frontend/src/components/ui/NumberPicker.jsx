import React from 'react';
import { FiMinus, FiPlus } from 'react-icons/fi';

export function NumberPicker({ value, onChange, min, max, step = 1, maxDecimals, className = '', id }) {
  const isFloat = step === 'any' || step < 1;
  const numStep = isFloat ? 1 : Number(step); // default increment by 1

  const handleDecrement = () => {
    let current = Number(value) || 0;
    let next = current - numStep;
    if (min !== undefined && next < min) next = min;
    onChange(isFloat ? next : Math.round(next));
  };

  const handleIncrement = () => {
    let current = Number(value) || 0;
    let next = current + numStep;
    if (max !== undefined && next > max) next = max;
    onChange(isFloat ? next : Math.round(next));
  };

  const handleChange = (e) => {
    let val = e.target.value;
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
      <button 
        type="button" 
        onClick={handleDecrement} 
        disabled={min !== undefined && Number(value) <= min}
        className="px-4 h-full bg-gray-50/50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border-r border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <FiMinus size={14} strokeWidth={3} />
      </button>
      
      <input
        id={id}
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        className="flex-1 w-full h-full text-center text-gray-900 font-medium bg-transparent border-none focus:outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      
      <button 
        type="button" 
        onClick={handleIncrement} 
        disabled={max !== undefined && Number(value) >= max}
        className="px-4 h-full bg-gray-50/50 hover:bg-gray-100 text-gray-500 hover:text-gray-900 border-l border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        <FiPlus size={14} strokeWidth={3} />
      </button>
    </div>
  );
}
