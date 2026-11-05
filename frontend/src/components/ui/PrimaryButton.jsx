import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

/**
 * Reusable Primary Button Component
 * Use for main CTAs throughout the site
 */
export default function PrimaryButton({ 
  to, 
  href,
  children, 
  icon = true,
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  fullWidth = false
}) {
  const baseClasses = `inline-flex items-center justify-center gap-2.5 bg-[#173d25] text-white px-8 py-3.5 rounded-md text-[13px] font-bold hover:bg-[#0f2f1b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${fullWidth ? 'w-full' : ''} ${className}`;

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {children}
        {icon && <FaArrowRight className="text-[11px]" />}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={baseClasses} target="_blank" rel="noopener noreferrer">
        {children}
        {icon && <FaArrowRight className="text-[11px]" />}
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
      {icon && <FaArrowRight className="text-[11px]" />}
    </button>
  );
}
