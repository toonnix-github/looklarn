import React from 'react';
import { cn } from '../../utils/cn';
import { Loader2 } from 'lucide-react';

export const Button = React.forwardRef(function Button(
  {
    children,
    className = '',
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    leftIcon,
    rightIcon,
    type = 'button',
    onClick,
    ...props
  },
  ref
) {
  const variantStyles = {
    primary: 'bg-primary-700 hover:bg-primary-800 active:bg-primary-900 text-white shadow-sm shadow-primary-900/20 border border-transparent',
    secondary: 'bg-secondary-700 hover:bg-secondary-800 active:bg-secondary-900 text-sub1-50 shadow-sm shadow-secondary-700/20 border border-transparent',
    sub1: 'bg-sub1-50 hover:bg-sub1-100 active:bg-sub1-200 text-primary-800 border border-sub1-200/70',
    sub2: 'bg-sub2-50 hover:bg-sub2-100 active:bg-sub2-200 text-sub2-800 border border-sub2-200/80',
    accent: 'bg-secondary-700 hover:bg-secondary-800 active:bg-secondary-900 text-sub1-50 shadow-sm shadow-secondary-700/20 border border-transparent',
    outline: 'bg-white hover:bg-sub1-50 active:bg-sub1-100 text-primary-700 border-2 border-primary-600',
    ghost: 'bg-transparent hover:bg-sub1-50 active:bg-sub1-100 text-sub2-700 border border-transparent',
    danger: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-sm border border-transparent',
    link: 'bg-transparent text-primary-700 hover:underline p-0 h-auto',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 font-medium',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
    icon: 'p-2.5 rounded-xl text-slate-700',
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-sans transition-all duration-150 select-none cursor-pointer',
        'active:scale-[0.98] disabled:active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin shrink-0" />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon && <span className="shrink-0 flex items-center">{rightIcon}</span>}
    </button>
  );
});

export default Button;
