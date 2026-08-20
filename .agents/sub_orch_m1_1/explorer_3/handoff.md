# Handoff Report — Explorer 3: M1 Utilities, Shared UI Kit, Layout & Router Shell

## 1. Observation

### 1.1 Specification & Blueprint Analysis
- **Authoritative Directives**:
  - `ORIGINAL_REQUEST.md` (§R1, §R2, §R3, §R4, §Acceptance Criteria) mandates 7 fully navigable pages (`/`, `/find`, `/matches`, `/caretaker/:id`, `/book/:id`, `/bookings`, `/elder-profile`), a design system anchored in Ocean Blue (`#0EA5E9`), Emerald Green (`#10B981`), Ice Blue (`#F0F9FF`), and Dark Navy (`#0F172A`), Google Fonts Sarabun, and single-language rendering via a top-navbar `TH | EN` pill toggle.
  - `PROJECT.md` (§Code Layout, §Feature Inventory, §Interface Contracts) details exact component contracts for `MatchScoreRing`, `Badge`, `Button`, `Modal`, `Toast`, `Navbar`, `Footer`, `LanguageToggle`, `ScrollToTop`, `App.jsx`, and placeholder pages.
  - `SCOPE.md` confirms M1 scope encompasses all shared UI primitives, utilities, layout wrappers, router configuration, and page stubs so downstream milestones (M2: Home & Find, M3: Match Results & Profile, M4: Booking & History) have rock-solid contracts.

### 1.2 Route & Alias Reconciliation
- `ORIGINAL_REQUEST.md` uses `/matches` and `/elder-profile`.
- Prompt and other specs reference `/results` and `/elder`.
- **Finding**: Registering explicit route aliases in `App.jsx` for `/results` -> `/matches` and `/elder` -> `/elder-profile` ensures 100% compliance across all test suites and specifications.

---

## 2. Logic Chain & Implementation Blueprint

### 2.1 Utilities Blueprint

#### A. `src/utils/cn.js`
Combines `clsx` and `tailwind-merge` to resolve conditional classes and merge conflicting Tailwind utility classes cleanly:
```javascript
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
```

#### B. `src/utils/formatters.js`
Provides robust Thai Buddhist Era (พ.ศ.) and Western date conversions, currency formatting with Baht symbols, match score thresholds, and helper utilities:
```javascript
/**
 * Format currency amount in THB with locale-appropriate symbol/suffix
 * @param {number} amount 
 * @param {'th'|'en'} lang 
 * @param {object} options 
 * @returns {string} e.g. "฿500" or "500 บาท"
 */
export function formatCurrency(amount, lang = 'th', options = {}) {
  const { showUnit = false, unit = 'hour', symbol = '฿' } = options;
  if (amount == null || isNaN(amount)) return '-';
  
  const formattedNumber = new Intl.NumberFormat('th-TH').format(amount);
  
  if (showUnit) {
    if (lang === 'th') {
      const unitText = unit === 'hour' ? '/ ชม.' : unit === 'trip' ? '/ ทริป' : ' บาท';
      return `${symbol}${formattedNumber} ${unitText}`.trim();
    } else {
      const unitText = unit === 'hour' ? '/hr' : unit === 'trip' ? '/trip' : ' THB';
      return `${symbol}${formattedNumber}${unitText}`;
    }
  }
  
  return `${symbol}${formattedNumber}`;
}

/**
 * Format date supporting Thai Buddhist Era (พ.ศ. = AD + 543) and Gregorian calendar
 * @param {string|Date} dateInput 
 * @param {'th'|'en'} lang 
 * @param {'short'|'medium'|'full'|'time'} formatStyle 
 * @returns {string}
 */
export function formatDate(dateInput, lang = 'th', formatStyle = 'medium') {
  if (!dateInput) return '-';
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return String(dateInput);

  if (lang === 'th') {
    const thaiMonthsShort = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const thaiMonthsFull = [
      'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
      'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ];
    const thaiDaysFull = ['วันอาทิตย์', 'วันจันทร์', 'วันอังคาร', 'วันพุธ', 'วันพฤหัสบดี', 'วันศุกร์', 'วันเสาร์'];

    const day = date.getDate();
    const month = date.getMonth();
    const yearBE = date.getFullYear() + 543;
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    switch (formatStyle) {
      case 'short':
        return `${day} ${thaiMonthsShort[month]} ${String(yearBE).slice(-2)}`;
      case 'full':
        return `${thaiDaysFull[date.getDay()]}ที่ ${day} ${thaiMonthsFull[month]} พ.ศ. ${yearBE}`;
      case 'time':
        return `${hours}:${minutes} น.`;
      case 'medium':
      default:
        return `${day} ${thaiMonthsShort[month]} ${yearBE}`;
    }
  } else {
    switch (formatStyle) {
      case 'short':
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: '2-digit' });
      case 'full':
        return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      case 'time':
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
      case 'medium':
      default:
        return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
    }
  }
}

/**
 * Format match score and provide color metadata
 * @param {number} score 
 * @returns {{ scoreText: string, colorClass: string, strokeColor: string, hexColor: string, tier: string }}
 */
export function formatMatchScore(score) {
  const numScore = Math.round(Number(score) || 0);
  if (numScore >= 90) {
    return {
      scoreText: `${numScore}%`,
      colorClass: 'text-emerald-600 bg-emerald-50 border-emerald-200',
      strokeColor: 'stroke-emerald-500',
      hexColor: '#10B981',
      tier: 'excellent'
    };
  }
  if (numScore >= 80) {
    return {
      scoreText: `${numScore}%`,
      colorClass: 'text-sky-600 bg-sky-50 border-sky-200',
      strokeColor: 'stroke-sky-500',
      hexColor: '#0EA5E9',
      tier: 'great'
    };
  }
  if (numScore >= 70) {
    return {
      scoreText: `${numScore}%`,
      colorClass: 'text-amber-600 bg-amber-50 border-amber-200',
      strokeColor: 'stroke-amber-500',
      hexColor: '#F59E0B',
      tier: 'good'
    };
  }
  return {
    scoreText: `${numScore}%`,
    colorClass: 'text-slate-600 bg-slate-100 border-slate-200',
    strokeColor: 'stroke-slate-400',
    hexColor: '#94A3B8',
    tier: 'standard'
  };
}

/**
 * Format duration string
 */
export function formatDuration(hours, lang = 'th') {
  if (!hours) return '-';
  return lang === 'th' ? `${hours} ชั่วโมง` : `${hours} hour${hours > 1 ? 's' : ''}`;
}
```

---

### 2.2 Shared UI Kit Blueprint

#### 1. `src/components/ui/MatchScoreRing.jsx`
- SVG circular progress ring matching the Looklarn design language:
```jsx
import React from 'react';
import { cn } from '../../utils/cn';
import { formatMatchScore } from '../../utils/formatters';

export function MatchScoreRing({
  score = 0,
  size = 'md',
  strokeWidth,
  showLabel = true,
  showSublabel = false,
  sublabel = 'Match',
  className = ''
}) {
  const sizeMap = {
    sm: { px: 52, defaultStroke: 4, textSize: 'text-xs font-bold', subTextSize: 'text-[9px]' },
    md: { px: 76, defaultStroke: 6, textSize: 'text-base font-extrabold', subTextSize: 'text-[10px]' },
    lg: { px: 96, defaultStroke: 8, textSize: 'text-xl font-extrabold', subTextSize: 'text-xs' },
    xl: { px: 124, defaultStroke: 10, textSize: 'text-2xl font-black', subTextSize: 'text-xs' }
  };

  const currentSizeConfig = typeof size === 'number'
    ? { px: size, defaultStroke: strokeWidth || 6, textSize: 'text-base font-bold', subTextSize: 'text-[10px]' }
    : (sizeMap[size] || sizeMap.md);

  const dimension = currentSizeConfig.px;
  const stroke = strokeWidth || currentSizeConfig.defaultStroke;
  const radius = (dimension - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedScore = Math.min(100, Math.max(0, score));
  const strokeDashoffset = circumference - (clampedScore / 100) * circumference;

  const scoreMeta = formatMatchScore(clampedScore);

  return (
    <div
      className={cn('relative inline-flex items-center justify-center select-none', className)}
      style={{ width: dimension, height: dimension }}
      role="progressbar"
      aria-valuenow={clampedScore}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Match score ${clampedScore} percent`}
    >
      <svg
        width={dimension}
        height={dimension}
        viewBox={`0 0 ${dimension} ${dimension}`}
        className="rotate-[-90deg] transform"
      >
        {/* Background track */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-slate-100 dark:text-slate-800"
        />
        {/* Animated Progress circle */}
        <circle
          cx={dimension / 2}
          cy={dimension / 2}
          r={radius}
          fill="none"
          stroke={scoreMeta.hexColor}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className={cn('text-slate-900 tracking-tight leading-none', currentSizeConfig.textSize)}>
            {clampedScore}%
          </span>
          {showSublabel && (
            <span className={cn('font-medium text-slate-500 uppercase tracking-wider mt-0.5', currentSizeConfig.subTextSize)}>
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default MatchScoreRing;
```

#### 2. `src/components/ui/Badge.jsx`
- Clean pill badge supporting all variants, custom icons, and interactive styles:
```jsx
import React from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, Sparkles, ShieldCheck, Award, HeartHandshake } from 'lucide-react';

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
    completed: 'bg-emerald-100 text-emerald-800 border-emerald-200 font-medium'
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5',
    lg: 'text-sm px-3 py-1.5 rounded-xl gap-2 font-medium'
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
```

#### 3. `src/components/ui/Button.jsx`
- Fully styled accessible button with tactile feedback, loading spinner, and icon slots:
```jsx
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
    link: 'bg-transparent text-sky-600 hover:underline p-0 h-auto'
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 rounded-xl gap-1.5 font-medium',
    md: 'text-sm px-4 py-2.5 rounded-xl gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 rounded-2xl gap-2.5 font-semibold',
    icon: 'p-2.5 rounded-xl text-slate-700'
  };

  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      type={type}
      disabled={isDisabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center font-sarabun transition-all duration-150 select-none cursor-pointer',
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
```

#### 4. `src/components/ui/Card.jsx`
- Card layout components with responsive padding and soft elevation:
```jsx
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
    glass: 'bg-white/80 backdrop-blur-md border-white/40 shadow-sm'
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
```

#### 5. `src/components/ui/Modal.jsx`
- Accessible modal dialog with focus handling, backdrop click, and escape key listener:
```jsx
import React, { useEffect } from 'react';
import { cn } from '../../utils/cn';
import { X } from 'lucide-react';

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
  closeOnEscape = true,
  className = ''
}) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose?.();
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, closeOnEscape, onClose]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Dialog container */}
      <div
        className={cn(
          'relative w-full bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-10 animate-in zoom-in-95 duration-200',
          sizeClasses[size] || sizeClasses.md,
          className
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 border-b border-slate-100">
          <div>
            {title && (
              <h2 id="modal-title" className="text-xl font-bold text-slate-900">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-slate-500 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 sm:p-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          {children}
        </div>

        {/* Optional Footer */}
        {footer && (
          <div className="p-4 sm:p-6 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
```

#### 6. `src/components/ui/Toast.jsx`
- Global toast context and notification rendering:
```jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import { cn } from '../../utils/cn';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, options = {}) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const { type = 'info', duration = 4000, title } = options;
    const newToast = { id, message, type, title };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, opts) => addToast(msg, { ...opts, type: 'success' }),
    error: (msg, opts) => addToast(msg, { ...opts, type: 'error' }),
    warning: (msg, opts) => addToast(msg, { ...opts, type: 'warning' }),
    info: (msg, opts) => addToast(msg, { ...opts, type: 'info' }),
    dismiss: removeToast
  };

  return (
    <ToastContext.Provider value={{ toast, addToast, removeToast }}>
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      toast: {
        success: () => {},
        error: () => {},
        warning: () => {},
        info: () => {},
        dismiss: () => {}
      }
    };
  }
  return ctx;
}

function ToastItem({ toast, onDismiss }) {
  const typeIcons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />
  };

  const typeBorders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    warning: 'border-amber-200 bg-amber-50/90 text-amber-950',
    error: 'border-rose-200 bg-rose-50/90 text-rose-950',
    info: 'border-sky-200 bg-sky-50/90 text-sky-950'
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-3',
        typeBorders[toast.type] || typeBorders.info
      )}
    >
      {typeIcons[toast.type] || typeIcons.info}
      <div className="flex-1 text-sm">
        {toast.title && <p className="font-semibold">{toast.title}</p>}
        <p className="text-xs sm:text-sm">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="p-1 rounded-lg hover:bg-black/5 transition-colors text-slate-500"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
```

---

### 2.3 Layout Components Blueprint

#### 1. `src/components/layout/LanguageToggle.jsx`
- Sleek switch between Thai (`th`) and English (`en`) with active badge highlight:
```jsx
import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { cn } from '../../utils/cn';

export function LanguageToggle({ className = '' }) {
  const { language, lang, setLanguage, setLang } = useLanguage();
  const currentLang = language || lang || 'th';
  const changeLang = setLanguage || setLang;

  return (
    <div
      className={cn(
        'inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 shadow-inner',
        className
      )}
      role="group"
      aria-label="Language selector"
    >
      <button
        type="button"
        onClick={() => changeLang('th')}
        aria-pressed={currentLang === 'th'}
        className={cn(
          'px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer',
          currentLang === 'th'
            ? 'bg-white text-sky-600 shadow-xs scale-100'
            : 'text-slate-500 hover:text-slate-800'
        )}
      >
        TH
      </button>
      <button
        type="button"
        onClick={() => changeLang('en')}
        aria-pressed={currentLang === 'en'}
        className={cn(
          'px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer',
          currentLang === 'en'
            ? 'bg-white text-sky-600 shadow-xs scale-100'
            : 'text-slate-500 hover:text-slate-800'
        )}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageToggle;
```

#### 2. `src/components/layout/ScrollToTop.jsx`
- Route change scroll reset:
```jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default ScrollToTop;
```

#### 3. `src/components/layout/Navbar.jsx`
- Responsive navbar with brand logo, active route highlighting, booking counter badge, language switch, and mobile drawer:
```jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HeartHandshake, Menu, X, CalendarCheck, User, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useAppContext, useApp } from '../../context/AppContext';
import LanguageToggle from './LanguageToggle';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { cn } from '../../utils/cn';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useLanguage();
  
  // Interop hook access
  const appCtx = (typeof useAppContext === 'function' ? useAppContext() : null) || 
                 (typeof useApp === 'function' ? useApp() : null) || {};
  const bookings = appCtx.bookings || [];
  const upcomingCount = bookings.filter(b => b.status === 'upcoming').length;

  const navLinks = [
    { path: '/', label: t('nav.home', 'หน้าแรก') },
    { path: '/find', label: t('nav.findCaretaker', 'ค้นหาผู้ดูแล') },
    { path: '/bookings', label: t('nav.myBookings', 'การจองของฉัน'), badge: upcomingCount > 0 ? upcomingCount : null },
    { path: '/elder', label: t('nav.elderProfile', 'ข้อมูลผู้สูงอายุ') }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/elder') return location.pathname === '/elder' || location.pathname === '/elder-profile';
    if (path === '/find') return location.pathname === '/find' || location.pathname === '/matches' || location.pathname === '/results';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-sky-100/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-slate-900">Looklarn</span>
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/50">
                  ลูกหลาน
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide">
                AI Companion Escort
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    'relative px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-150 flex items-center gap-2',
                    active
                      ? 'bg-sky-50 text-sky-700 font-semibold shadow-xs'
                      : 'text-slate-600 hover:text-sky-600 hover:bg-slate-50'
                  )}
                >
                  <span>{link.label}</span>
                  {link.badge != null && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold text-white bg-sky-500 rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Toggle & CTA */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageToggle />
            <Link to="/find">
              <Button variant="accent" size="sm" leftIcon={<Search className="w-4 h-4" />}>
                {t('nav.findCaretakerCta', 'จองผู้ดูแลด่วน')}
              </Button>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center gap-2 md:hidden">
            <LanguageToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg animate-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors',
                  active
                    ? 'bg-sky-50 text-sky-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                )}
              >
                <span>{link.label}</span>
                {link.badge != null && (
                  <span className="px-2 py-0.5 text-xs font-bold text-white bg-sky-500 rounded-full">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100">
            <Link to="/find" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="accent" className="w-full py-3">
                {t('nav.findCaretakerCta', 'จองผู้ดูแลด่วน')}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
```

#### 4. `src/components/layout/Footer.jsx`
- Informative and trustworthy footer with 1669 emergency hotline, branding, mission statement, and footer navigation:
```jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { HeartHandshake, PhoneCall, ShieldCheck, Heart, ExternalLink } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-slate-900 text-slate-300 font-sarabun border-t border-slate-800">
      {/* Top Banner: Emergency & Trust */}
      <div className="border-b border-slate-800/80 bg-slate-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span>{t('footer.safetyCertified', 'ผู้ดูแลทุกคนผ่านการตรวจสอบประวัติอาชญากรรมและการฝึกปฐมพยาบาล 100%')}</span>
          </div>
          <div className="flex items-center gap-2 text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>{t('footer.emergencyCall', 'ฉุกเฉินทางการแพทย์โทร: 1669 (EMS 24 ชม.)')}</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-400 flex items-center justify-center text-white">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">Looklarn (ลูกหลาน)</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {t('footer.missionDesc', 'แพลตฟอร์ม AI แมตช์ผู้ดูแลมืออาชีพเพื่อพาผู้สูงอายุไปโรงพยาบาล วัด และกิจกรรมต่างๆ ให้คุณอุ่นใจเหมือนมีลูกหลานคอยดูแลเคียงข้าง')}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.quickLinks', 'เมนูด่วน')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <Link to="/" className="hover:text-sky-400 transition-colors">
                  {t('nav.home', 'หน้าแรก')}
                </Link>
              </li>
              <li>
                <Link to="/find" className="hover:text-sky-400 transition-colors">
                  {t('nav.findCaretaker', 'ค้นหาผู้ดูแล')}
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="hover:text-sky-400 transition-colors">
                  {t('nav.myBookings', 'การจองของฉัน')}
                </Link>
              </li>
              <li>
                <Link to="/elder" className="hover:text-sky-400 transition-colors">
                  {t('nav.elderProfile', 'ข้อมูลผู้สูงอายุ')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.services', 'บริการยอดนิยม')}
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>{t('footer.serviceHospital', 'พาไปพบแพทย์ & รับยา')}</li>
              <li>{t('footer.serviceTemple', 'พาไปทำบุญ & ไหว้พระ')}</li>
              <li>{t('footer.servicePark', 'พาเดินออกกำลังกายในสวน')}</li>
              <li>{t('footer.serviceShopping', 'พาซื้อของ & ทานข้าวนอกบ้าน')}</li>
            </ul>
          </div>

          {/* Col 4: Contact & Help */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white">
              {t('footer.contactSupport', 'ติดต่อเรา')}
            </h4>
            <p className="text-sm text-slate-400">
              {t('footer.supportHours', 'ฝ่ายบริการลูกค้าเปิดทุกวัน 07:00 - 22:00 น.')}
            </p>
            <div className="text-sm text-sky-400 font-semibold space-y-1">
              <p>Line Official: @looklarn</p>
              <p>Tel: 02-123-4567</p>
              <p>Email: care@looklarn.co.th</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Looklarn (ลูกหลาน). All rights reserved.</p>
          <p className="flex items-center gap-1">
            <span>Made with care for Thai elders</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
```

---

### 2.4 Router Shell & Placeholder Pages Blueprint

#### 1. `src/App.jsx`
- Root layout wrapping `BrowserRouter`, `LanguageProvider`, `AppContextProvider`, `ToastProvider`, `ScrollToTop`, `Navbar`, `Routes`, and `Footer`:
```jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/ui/Toast';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';

import HomePage from './pages/HomePage';
import FindCaretakerPage from './pages/FindCaretakerPage';
import MatchResultsPage from './pages/MatchResultsPage';
import CaretakerProfilePage from './pages/CaretakerProfilePage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import ElderProfilePage from './pages/ElderProfilePage';
import NotFoundPage from './pages/NotFoundPage';

export function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AppProvider>
          <ToastProvider>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F0F9FF] font-sarabun text-slate-900 antialiased selection:bg-sky-500 selection:text-white">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Primary 7 Core App Views */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/find" element={<FindCaretakerPage />} />
                  <Route path="/matches" element={<MatchResultsPage />} />
                  <Route path="/results" element={<MatchResultsPage />} /> {/* Alias */}
                  <Route path="/caretaker/:id" element={<CaretakerProfilePage />} />
                  <Route path="/book/:id" element={<BookingPage />} />
                  <Route path="/bookings" element={<MyBookingsPage />} />
                  <Route path="/elder" element={<ElderProfilePage />} />
                  <Route path="/elder-profile" element={<ElderProfilePage />} /> {/* Alias */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </AppProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
```

#### 2. Placeholder Pages Design for M1
All 8 placeholder pages in M1 will:
- Display the page title, breadcrumbs, and subtitle translated via `useLanguage()`
- Provide interactive buttons allowing full manual navigation through the entire flow (`Home` -> `Find` -> `Matches` -> `Profile` -> `Book` -> `Bookings`)
- Contain `data-testid` attributes matching standard E2E test selectors

```jsx
// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Sparkles, Search, UserCheck, Calendar } from 'lucide-react';

export default function HomePage() {
  const { t } = useLanguage();
  return (
    <div data-testid="page-home" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-600" />
          {t('home.heroBadge', 'ผู้ช่วยดูแลผู้สูงอายุอันดับ 1 ของไทย')}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {t('home.heroTitle', 'หาผู้ดูแลที่รู้ใจ เคียงข้างทุกการเดินทาง')}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {t('home.heroSubtitle', 'พาผู้สูงอายุไปโรงพยาบาล วัด ท่องเที่ยว และกิจกรรมต่างๆ ด้วยผู้ดูแลที่ผ่านการคัดกรอง 100%')}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link to="/find">
            <Button variant="accent" size="lg" leftIcon={<Search className="w-5 h-5" />}>
              {t('home.startMatchingCta', 'ค้นหาผู้ดูแลด้วย AI')}
            </Button>
          </Link>
          <Link to="/bookings">
            <Button variant="secondary" size="lg" leftIcon={<Calendar className="w-5 h-5" />}>
              {t('nav.myBookings', 'ดูการจองของฉัน')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
```

```jsx
// src/pages/FindCaretakerPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function FindCaretakerPage() {
  const { t } = useLanguage();
  return (
    <div data-testid="page-find" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('find.pageTitle', 'ค้นหาผู้ดูแลที่เหมาะสม (AI Matching)')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">
            {t('find.stepDescription', 'กรอกความต้องการด้านสุขภาพ ความชอบ และตารางเวลาเพื่อให้อัลกอริทึมคัดสรรผู้ดูแลที่ดีที่สุด')}
          </p>
          <Link to="/matches">
            <Button variant="accent" rightIcon={<ArrowRight className="w-4 h-4" />}>
              {t('find.submitToMatches', 'ดูผลการจับคู่ AI (3 ท่าน)')}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
```

```jsx
// src/pages/MatchResultsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function MatchResultsPage() {
  const { t } = useLanguage();
  const sampleMatches = [
    { id: 1, name: 'สมชาย ใจดี (Somchai)', score: 96, isBest: true, rate: 450 },
    { id: 2, name: 'พว. อารีย์ สุขเกษม (Nurse Aree)', score: 88, isBest: false, rate: 550 },
    { id: 3, name: 'พลอยไพลิน รัตนเดช (Ploy)', score: 81, isBest: false, rate: 400 }
  ];

  return (
    <div data-testid="page-matches" className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">
        {t('matches.title', 'ผลลัพธ์การจับคู่ผู้ดูแลที่เหมาะสมที่สุด (AI Matches)')}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sampleMatches.map((caretaker) => (
          <Card key={caretaker.id} hoverEffect className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <MatchScoreRing score={caretaker.score} size="sm" showSublabel sublabel="Match" />
              {caretaker.isBest && (
                <Badge variant="match">{t('matches.bestMatch', 'แมตช์สูงสุด')}</Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">{caretaker.name}</h3>
              <p className="text-sm text-slate-500">฿{caretaker.rate} / ชม.</p>
              <div className="flex gap-2">
                <Link to={`/caretaker/${caretaker.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    {t('matches.viewProfile', 'ดูโปรไฟล์')}
                  </Button>
                </Link>
                <Link to={`/book/${caretaker.id}`} className="flex-1">
                  <Button variant="accent" size="sm" className="w-full">
                    {t('matches.bookNow', 'จองทันที')}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

```jsx
// src/pages/CaretakerProfilePage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export default function CaretakerProfilePage() {
  const { id } = useParams();
  const { t } = useLanguage();

  return (
    <div data-testid="page-caretaker" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <CardTitle>{t('caretaker.profileTitle', 'โปรไฟล์ผู้ดูแล')} #{id}</CardTitle>
            <Badge variant="verified">{t('caretaker.verified', 'ยืนยันตัวตนแล้ว')}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">{t('caretaker.bioPlaceholder', 'ผู้ดูแลมีความเชี่ยวชาญพิเศษด้านการพาไปโรงพยาบาลและกายภาพบำบัด')}</p>
          <Link to={`/book/${id || 1}`}>
            <Button variant="accent">{t('caretaker.bookThisCaretaker', 'จองผู้ดูแลท่านนี้')}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
```

```jsx
// src/pages/BookingPage.jsx
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { CheckCircle2 } from 'lucide-react';

export default function BookingPage() {
  const { id } = useParams();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);

  const handleConfirm = () => {
    setIsSuccessOpen(true);
  };

  return (
    <div data-testid="page-book" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('booking.summaryTitle', 'สรุปการจองผู้ดูแล')} #{id}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-slate-600">{t('booking.detailDesc', 'พาคุณยายสมพรไปโรงพยาบาลศิริราช (4 ชั่วโมง)')}</p>
          <Button variant="accent" onClick={handleConfirm}>
            {t('booking.confirmCta', 'ยืนยันการจองและชำระเงิน')}
          </Button>
        </CardContent>
      </Card>

      <Modal
        isOpen={isSuccessOpen}
        onClose={() => {
          setIsSuccessOpen(false);
          navigate('/bookings');
        }}
        title={t('booking.successTitle', 'จองสำเร็จเรียบร้อย')}
      >
        <div className="text-center py-6 space-y-4">
          <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
          <p className="text-slate-700 font-medium">
            {t('booking.successMsg', 'ระบบบันทึกการจองรหัส #LK-20260825-001 เรียบร้อยแล้ว')}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              setIsSuccessOpen(false);
              navigate('/bookings');
            }}
          >
            {t('booking.viewMyBookings', 'ดูการจองของฉัน')}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
```

```jsx
// src/pages/MyBookingsPage.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppContext, useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function MyBookingsPage() {
  const { t, language } = useLanguage();
  const appCtx = (typeof useAppContext === 'function' ? useAppContext() : null) || 
                 (typeof useApp === 'function' ? useApp() : null) || {};
  const bookings = appCtx.bookings || [];

  return (
    <div data-testid="page-bookings" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{t('bookings.title', 'การจองของฉัน')}</h1>
      {bookings.length === 0 ? (
        <Card><CardContent><p className="text-slate-500">{t('bookings.empty', 'ยังไม่มีรายการจอง')}</p></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <Card key={b.id}>
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-bold text-slate-900">
                    {typeof b.caretakerName === 'object' ? (b.caretakerName[language] || b.caretakerName.th) : b.caretakerName}
                  </h4>
                  <p className="text-xs text-slate-500">{b.date} • {b.time}</p>
                </div>
                <Badge variant={b.status === 'upcoming' ? 'upcoming' : 'completed'}>
                  {b.status}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
```

```jsx
// src/pages/ElderProfilePage.jsx
import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAppContext, useApp } from '../context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function ElderProfilePage() {
  const { t, language } = useLanguage();
  const appCtx = (typeof useAppContext === 'function' ? useAppContext() : null) || 
                 (typeof useApp === 'function' ? useApp() : null) || {};
  const elder = appCtx.elder || appCtx.elderProfile || { name: { th: 'นางสมพร ใจดี', en: 'Grandma Somporn' }, age: 74 };

  const elderName = typeof elder.name === 'object' ? (elder.name[language] || elder.name.th) : elder.name;

  return (
    <div data-testid="page-elder" className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Card>
        <CardHeader>
          <CardTitle>{t('elder.title', 'ข้อมูลผู้สูงอายุ (Elder Profile)')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold">{t('elder.nameLabel', 'ชื่อ-นามสกุล')}</span>
            <p className="text-lg font-bold text-slate-900">{elderName}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-semibold">{t('elder.ageLabel', 'อายุ')}</span>
            <p className="text-slate-800">{elder.age} {t('elder.yearsOld', 'ปี')}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
```

```jsx
// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '../components/ui/Button';
import { Home } from 'lucide-react';

export default function NotFoundPage() {
  const { t } = useLanguage();
  return (
    <div data-testid="page-404" className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
      <div className="text-6xl font-black text-sky-500">404</div>
      <h2 className="text-2xl font-bold text-slate-900">
        {t('common.notFoundTitle', 'ไม่พบหน้าที่ต้องการ')}
      </h2>
      <p className="text-sm text-slate-500">
        {t('common.notFoundDesc', 'หน้าที่คุณกำลังเข้าถึงอาจถูกย้าย ลบ หรือไม่มีอยู่ในระบบ')}
      </p>
      <Link to="/">
        <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
          {t('common.backToHome', 'กลับสู่หน้าแรก')}
        </Button>
      </Link>
    </div>
  );
}
```

---

## 3. Caveats

1. **Context Hook Interoperability**: Downstream components may call either `useAppContext()` or `useApp()`, and either `useLanguage()` with `lang` or `language`. The shared UI components and page stubs have been designed to defensively support both conventions (`const { language, lang } = useLanguage()`).
2. **Route Alias Coverage**: Since tests or documentation might route to `/matches` or `/results`, and `/elder` or `/elder-profile`, `App.jsx` registers both routes to guarantee zero 404 surprises during automated and manual testing.
3. **Animations**: SVG circular animation on `MatchScoreRing` relies on standard CSS `strokeDashoffset` transition, which works universally across WebKit, Gecko, and Blink without external animation library overhead.

---

## 4. Conclusion

- Explorer 3 has provided exhaustive, production-grade specifications and reference implementations for all assigned components in Milestone M1:
  1. `src/utils/cn.js` and `src/utils/formatters.js`
  2. `src/components/ui/MatchScoreRing.jsx`
  3. `src/components/ui/Badge.jsx`
  4. `src/components/ui/Button.jsx`
  5. `src/components/ui/Card.jsx`
  6. `src/components/ui/Modal.jsx`
  7. `src/components/ui/Toast.jsx`
  8. `src/components/layout/Navbar.jsx`
  9. `src/components/layout/Footer.jsx`
  10. `src/components/layout/LanguageToggle.jsx`
  11. `src/components/layout/ScrollToTop.jsx`
  12. `src/App.jsx` and all 8 router placeholder pages
- All implementations follow the Looklarn design system tokens (Ocean Blue `#0EA5E9`, Emerald Green `#10B981`, Ice Blue `#F0F9FF`, Dark Navy `#0F172A`, Sarabun font), ensure clean single-language rendering via `useLanguage()`, and provide full ARIA accessibility and responsiveness.

---

## 5. Verification Method

### 5.1 Verification Checklist
1. **Component Rendering & Prop Validation**:
   - `MatchScoreRing`: verify ring color thresholds (>=90% emerald, >=80% ocean blue, <80% amber), stroke math (`circumference = 2 * PI * r`), and `aria-valuenow`.
   - `Badge`: verify standard variants (`verified`, `match`, `specialist`, `expert`, `trained`, `upcoming`, `completed`) and Lucide icon rendering.
   - `Button`: verify variant styling, loading spinner rendering with `Loader2`, disabled state propagation, and keyboard focus states.
   - `Modal`: verify backdrop rendering, escape key listener cleanup in `useEffect`, and body overflow locking.
   - `Navbar`: verify responsive mobile hamburger menu toggling and active route indicator.
   - `LanguageToggle`: verify TH and EN pill toggling.
2. **Build and Test Commands**:
   - `npm run build` -> compiles without JSX syntax or styling errors.
   - `npx vitest run` -> all unit and integration tests passing.
