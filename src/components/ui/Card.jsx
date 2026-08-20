import React from 'react';
import { cn } from '../../utils/cn';

export function Card({
  children,
  className = '',
  hoverEffect = false,
  variant = 'default',
  ...props
}) {
  const variantStyles = {
    default: 'bg-white border-slate-100 shadow-sm',
    flat: 'bg-white border-slate-200',
    ice: 'bg-sky-50/50 border-sky-100 shadow-xs',
    glass: 'bg-white/80 backdrop-blur-md border-white/40 shadow-sm',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border transition-all duration-200 text-slate-900',
        variantStyles[variant] || variantStyles.default,
        hoverEffect && 'hover:shadow-md hover:border-sky-200 hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pb-2 sm:pb-3 flex flex-col space-y-1.5', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '', as = 'h3', ...props }) {
  const Component = as;
  return (
    <Component className={cn('text-lg sm:text-xl font-bold text-slate-900 tracking-tight', className)} {...props}>
      {children}
    </Component>
  );
}

export function CardDescription({ children, className = '', ...props }) {
  return (
    <p className={cn('text-sm text-slate-500 leading-relaxed', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pt-2 sm:pt-3', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '', ...props }) {
  return (
    <div className={cn('p-5 sm:p-6 pt-0 flex items-center gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export default Card;
