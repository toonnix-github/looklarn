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
    primary: 'bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-sm shadow-sky-500/20 border border-transparent',
    accent: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white shadow-sm shadow-emerald-500/20 border border-transparent',
    secondary: 'bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-700 border border-sky-200/60',
    outline: 'bg-white hover:bg-sky-50 active:bg-sky-100 text-sky-600 border-2 border-sky-500',
    ghost: 'bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 border border-transparent',
    danger: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white shadow-sm border border-transparent',
    link: 'bg-transparent text-sky-600 hover:underline p-0 h-auto',
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
        'focus:outline-hidden focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2',
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
