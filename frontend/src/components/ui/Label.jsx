import { cn } from '../../lib/utils';

export function Label({ className, children, ...props }) {
  return (
    <label className={cn('text-sm font-medium mb-1 block', className)} {...props}>
      {children}
    </label>
  );
}