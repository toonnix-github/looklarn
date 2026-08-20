import { describe, it, expect } from 'vitest';
import { th } from '../i18n/th';
import { en } from '../i18n/en';
import { translations, DEFAULT_LANGUAGE } from '../i18n';

function extractAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key of Object.keys(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (obj[key] !== null && typeof obj[key] === 'object' && !Array.isArray(obj[key])) {
      keys = keys.concat(extractAllKeys(obj[key], fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

describe('i18n Subsystem Parity and Translations', () => {
  it('should have Thai (th) as the default language', () => {
    expect(DEFAULT_LANGUAGE).toBe('th');
  });

  it('should export both th and en dictionaries in translations object', () => {
    expect(translations).toHaveProperty('th');
    expect(translations).toHaveProperty('en');
  });

  it('should have exact key parity between Thai and English dictionaries', () => {
    const thKeys = extractAllKeys(th).sort();
    const enKeys = extractAllKeys(en).sort();

    const missingInEn = thKeys.filter((k) => !enKeys.includes(k));
    const missingInTh = enKeys.filter((k) => !thKeys.includes(k));

    expect(missingInEn).toEqual([]);
    expect(missingInTh).toEqual([]);
    expect(thKeys).toEqual(enKeys);
  });

  it('should not contain empty strings in required top-level navigation keys', () => {
    expect(th.nav.brandName.trim().length).toBeGreaterThan(0);
    expect(en.nav.brandName.trim().length).toBeGreaterThan(0);
    expect(th.nav.findCaretaker.trim().length).toBeGreaterThan(0);
    expect(en.nav.findCaretaker.trim().length).toBeGreaterThan(0);
  });

  it('should verify essential domain translation namespaces exist', () => {
    const requiredNamespaces = [
      'nav',
      'common',
      'home',
      'find',
      'matches',
      'caretaker',
      'book',
      'bookings',
      'elderProfile',
      'footer',
    ];

    for (const ns of requiredNamespaces) {
      expect(th).toHaveProperty(ns);
      expect(en).toHaveProperty(ns);
    }
  });
});
