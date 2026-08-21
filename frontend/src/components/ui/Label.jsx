import { cn } from '../../lib/utils';

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('text-sm font-bold font-mono uppercase tracking-tight mb-1 block', className)} {...props}>
      {children}
    </label>
  );
}