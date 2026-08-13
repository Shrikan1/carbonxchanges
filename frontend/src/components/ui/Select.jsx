import { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Select = forwardRef(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      'flex h-10 w-full items-center justify-between rounded-md border border-border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 text-[#888] appearance-none',
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = 'Select';
