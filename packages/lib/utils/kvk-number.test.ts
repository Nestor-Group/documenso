import { describe, expect, it } from 'vitest';

import { isValidKvkNumber, normaliseKvkNumber } from './kvk-number';
import { hasInvalidPrefilledText } from './vat-number';

describe('normaliseKvkNumber', () => {
  it('removes spaces and dots', () => {
    expect(normaliseKvkNumber(' 1234 5678 ')).toBe('12345678');
    expect(normaliseKvkNumber('12.345.678')).toBe('12345678');
  });
});

describe('isValidKvkNumber', () => {
  it('accepts exactly 8 digits, with or without spaces and dots', () => {
    expect(isValidKvkNumber('12345678')).toBe(true);
    expect(isValidKvkNumber('1234 5678')).toBe(true);
    expect(isValidKvkNumber('12.345.678')).toBe(true);
    expect(isValidKvkNumber(' 12345678 ')).toBe(true);
    expect(isValidKvkNumber('00000000')).toBe(true);
  });

  it('rejects another number of digits', () => {
    expect(isValidKvkNumber('1234567')).toBe(false);
    expect(isValidKvkNumber('123456789')).toBe(false);
  });

  it('rejects letters, dashes, empty and arbitrary input', () => {
    expect(isValidKvkNumber('1234567A')).toBe(false);
    expect(isValidKvkNumber('KVK12345678')).toBe(false);
    expect(isValidKvkNumber('1234-5678')).toBe(false);
    expect(isValidKvkNumber('')).toBe(false);
    expect(isValidKvkNumber('   ')).toBe(false);
    expect(isValidKvkNumber('n/a')).toBe(false);
  });
});

describe('hasInvalidPrefilledText with format "kvk"', () => {
  it('is true only for a non-empty prefilled value that is not a KVK number', () => {
    expect(hasInvalidPrefilledText({ format: 'kvk', text: '1234567' })).toBe(true);
    expect(hasInvalidPrefilledText({ format: 'kvk', text: 'BE0123456749' })).toBe(true);
    expect(hasInvalidPrefilledText({ format: 'kvk', text: '12.345.678' })).toBe(false);
    expect(hasInvalidPrefilledText({ format: 'kvk', text: '' })).toBe(false);
    expect(hasInvalidPrefilledText({ format: 'kvk' })).toBe(false);
  });

  it('keeps the "vat" behaviour', () => {
    expect(hasInvalidPrefilledText({ format: 'vat', text: '12345678' })).toBe(true);
    expect(hasInvalidPrefilledText({ format: 'vat', text: 'BE0123456749' })).toBe(false);
  });
});
