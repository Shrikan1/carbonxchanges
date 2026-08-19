import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Textarea = forwardRef(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'flex min-h-[120px] w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-[15px] text-gray-900 outline-none transition-all duration-200 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10 disabled:opacity-50 disabled:bg-gray-50 resize-y shadow-sm',
      className
    )}
    maxLength={2000}
    {...props}
  />
));
Textarea.displayName = 'Textarea';
