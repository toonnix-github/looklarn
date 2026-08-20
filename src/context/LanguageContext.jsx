import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { translations, DEFAULT_LANGUAGE } from '../i18n';

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('looklarn_lang');
      return saved === 'en' || saved === 'th' ? saved : DEFAULT_LANGUAGE;
    } catch {
      return DEFAULT_LANGUAGE;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('looklarn_lang', language);
    } catch (e) {
      console.warn('Unable to persist language to localStorage', e);
    }
    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.lang = language;
    }
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'th' ? 'en' : 'th'));
  };

  /**
   * Translates a dot-notated key with optional interpolation tokens or fallback string.
   * e.g. t('nav.findCaretaker')
   * e.g. t('matches.summaryPill', { activity: 'Hospital', date: '25 Aug', budget: 500 })
   */
  const t = (keyPath, paramsOrFallback = {}) => {
    if (!keyPath) return '';

    const isFallbackString = typeof paramsOrFallback === 'string';
    const fallback = isFallbackString ? paramsOrFallback : keyPath;
    const params = isFallbackString ? {} : paramsOrFallback;

    const keys = keyPath.split('.');
    let current = translations[language];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        // Fallback to alternate language if key missing
        const altLang = language === 'th' ? 'en' : 'th';
        let altCurrent = translations[altLang];
        for (const altKey of keys) {
          if (altCurrent && typeof altCurrent === 'object' && altKey in altCurrent) {
            altCurrent = altCurrent[altKey];
          } else {
            altCurrent = null;
            break;
          }
        }
        if (altCurrent && typeof altCurrent === 'string') {
          current = altCurrent;
        } else {
          return fallback;
        }
        break;
      }
    }

    if (typeof current !== 'string') {
      return fallback;
    }

    let result = current;
    if (params && typeof params === 'object') {
      Object.keys(params).forEach((param) => {
        result = result.replace(new RegExp(`\\{${param}\\}`, 'g'), String(params[param]));
      });
    }

    return result;
  };

  /**
   * Extracts localized values from bilingual mock items supporting:
   * 1. Nested objects: item[field][language]
   * 2. Suffix properties: item[`${field}_${language}`]
   */
  const getLocalized = (item, field) => {
    if (!item) return '';

    // If item itself is a bilingual string object { th: '...', en: '...' }
    if (!field && typeof item === 'object') {
      return item[language] || item['th'] || item['en'] || '';
    }

    // Check nested object: item.name.th
    if (item[field] && typeof item[field] === 'object' && !Array.isArray(item[field])) {
      return item[field][language] || item[field]['th'] || item[field]['en'] || '';
    }

    // Check suffix property: item.name_th
    const suffixedKey = `${field}_${language}`;
    if (item[suffixedKey] !== undefined) {
      return item[suffixedKey];
    }

    // Alternate language fallback
    const altLang = language === 'th' ? 'en' : 'th';
    const altKey = `${field}_${altLang}`;
    if (item[altKey] !== undefined) {
      return item[altKey];
    }

    return item[field] !== undefined ? item[field] : '';
  };

  const contextValue = useMemo(
    () => ({
      language,
      lang: language,
      setLanguage,
      setLang: setLanguage,
      toggleLanguage,
      t,
      getLocalized,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
