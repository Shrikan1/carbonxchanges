import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      'flex h-[42px] w-full rounded-xl border border-gray-300 bg-white px-4 py-2 text-[15px] text-gray-900 outline-none transition-all duration-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 disabled:bg-gray-50 shadow-sm',
      className
    )}
    maxLength={255}
    {...props}
  />
));
Input.displayName = 'Input';