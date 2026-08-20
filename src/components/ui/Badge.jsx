import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, Sparkles, ShieldCheck, Award } from 'lucide-react';

export function Badge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  ...props
}) {
  const variantStyles = {
    primary: 'bg-sky-50 text-sky-700 border-sky-200',
    accent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    outline: 'bg-transparent text-slate-700 border-slate-300',
    // Domain specific presets
    verified: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium',
    match: 'bg-gradient-to-r from-sky-50 to-emerald-50 text-emerald-800 border-emerald-200 font-semibold shadow-xs',
    specialist: 'bg-purple-50 text-purple-700 border-purple-200 font-medium',
    expert: 'bg-sky-50 text-sky-700 border-sky-200 font-medium',
    trained: 'bg-teal-50 text-teal-700 border-teal-200 font-medium',
    upcoming: 'bg-sky-100 text-sky-800 border-sky-200 font-medium',
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-xl gap-2 font-medium',
  };

  // Built-in icon resolution for semantic variants if icon not explicitly passed
  let resolvedIcon = icon;
  if (!resolvedIcon) {
    if (variant === 'verified') resolvedIcon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />;
    else if (variant === 'match') resolvedIcon = <Sparkles className="w-3.5 h-3.5 text-emerald-600" />;
    else if (variant === 'specialist') resolvedIcon = <Award className="w-3.5 h-3.5 text-purple-600" />;
    else if (variant === 'trained' || variant === 'expert') resolvedIcon = <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center border font-medium transition-colors select-none',
        variantStyles[variant] || variantStyles.primary,
        sizeStyles[size] || sizeStyles.md,
        className
      )}
      {...props}
    >
      {resolvedIcon && <span className="shrink-0 flex items-center">{resolvedIcon}</span>}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
