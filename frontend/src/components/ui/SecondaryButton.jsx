import { Link } from 'react-router-dom';

/**
 * Reusable Secondary Button Component
 * Use for secondary actions throughout the site
 */
export default function SecondaryButton({ 
  to, 
  href,
  children, 
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false
}) {
  const baseClasses = `inline-flex items-center justify-center gap-2 border-2 border-[#173d25] text-[#173d25] bg-transparent px-8 py-3 rounded-md text-[13px] font-bold hover:bg-[#173d25] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button 
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={baseClasses}
    >
      {children}
    </button>
  );
}
