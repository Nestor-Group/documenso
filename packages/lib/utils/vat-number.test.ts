import { describe, expect, it } from 'vitest';

import { hasInvalidPrefilledText, isValidVatNumber, normaliseVatNumber } from './vat-number';

describe('normaliseVatNumber', () => {
  it('removes spaces, dots and dashes and upper-cases', () => {
    expect(normaliseVatNumber(' be 0123.456-749 ')).toBe('BE0123456749');
  });
});

describe('isValidVatNumber', () => {
  describe('Belgium', () => {
    it('accepts 10 digits with a valid mod-97 check, with or without the prefix', () => {
      expect(isValidVatNumber('BE0123456749')).toBe(true);
      expect(isValidVatNumber('0123456749')).toBe(true);
      expect(isValidVatNumber('be 0123.456.749')).toBe(true);
      expect(isValidVatNumber('BE1000000021')).toBe(true);
    });

    it('accepts a check of 97 (first 8 digits divisible by 97)', () => {
      expect(isValidVatNumber('BE0000009797')).toBe(true);
    });

    it('rejects a wrong check', () => {
      expect(isValidVatNumber('BE0123456789')).toBe(false);
      expect(isValidVatNumber('0123456748')).toBe(false);
    });

    it('rejects numbers that do not start with 0 or 1, or have the wrong length', () => {
      expect(isValidVatNumber('BE2123456789')).toBe(false);
      expect(isValidVatNumber('BE012345674')).toBe(false);
      expect(isValidVatNumber('BE01234567490')).toBe(false);
      expect(isValidVatNumber('123456749')).toBe(false);
    });
  });

  describe('Netherlands', () => {
    it('accepts NL + 9 digits + B + 2 digits', () => {
      expect(isValidVatNumber('NL123456789B01')).toBe(true);
      expect(isValidVatNumber('nl 1234.56789.b01')).toBe(true);
    });

    it('rejects other shapes', () => {
      expect(isValidVatNumber('NL123456789')).toBe(false);
      expect(isValidVatNumber('NL12345678B01')).toBe(false);
      expect(isValidVatNumber('NL123456789X01')).toBe(false);
    });
  });

  describe('other EU countries', () => {
    it('accepts a known prefix with 2 to 13 letters or digits', () => {
      expect(isValidVatNumber('DE123456789')).toBe(true);
      expect(isValidVatNumber('FR12345678901')).toBe(true);
      expect(isValidVatNumber('ESX1234567X')).toBe(true);
      expect(isValidVatNumber('EL12')).toBe(true);
    });

    it('rejects unknown prefixes, values without a digit and wrong lengths', () => {
      expect(isValidVatNumber('ZEZEZe')).toBe(false);
      expect(isValidVatNumber('XX123456789')).toBe(false);
      expect(isValidVatNumber('DEABCDEF')).toBe(false);
      expect(isValidVatNumber('DE1')).toBe(false);
      expect(isValidVatNumber('DE12345678901234')).toBe(false);
    });
  });

  it('rejects empty and arbitrary input', () => {
    expect(isValidVatNumber('')).toBe(false);
    expect(isValidVatNumber('   ')).toBe(false);
    expect(isValidVatNumber('n/a')).toBe(false);
    expect(isValidVatNumber('BE')).toBe(false);
  });
});

describe('hasInvalidPrefilledText', () => {
  it('is true only for a non-empty prefilled value that fails the format', () => {
    expect(hasInvalidPrefilledText({ format: 'vat', text: 'ZEZEZe' })).toBe(true);
    expect(hasInvalidPrefilledText({ format: 'vat', text: 'BE0123456749' })).toBe(false);
    expect(hasInvalidPrefilledText({ format: 'vat', text: '' })).toBe(false);
    expect(hasInvalidPrefilledText({ format: 'vat' })).toBe(false);
    expect(hasInvalidPrefilledText({ text: 'ZEZEZe' })).toBe(false);
    expect(hasInvalidPrefilledText(null)).toBe(false);
  });
});
