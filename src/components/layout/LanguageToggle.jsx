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
