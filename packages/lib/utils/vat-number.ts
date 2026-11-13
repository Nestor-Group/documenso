/**
 * Country prefixes of VAT numbers in the European Union (Greece uses "EL", Northern Ireland "XI").
 */
const EU_VAT_PREFIXES = new Set([
  'AT',
  'BE',
  'BG',
  'CY',
  'CZ',
  'DE',
  'DK',
  'EE',
  'EL',
  'ES',
  'FI',
  'FR',
  'HR',
  'HU',
  'IE',
  'IT',
  'LT',
  'LU',
  'LV',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SE',
  'SI',
  'SK',
  'XI',
]);

/**
 * Removes spaces, dots and dashes and upper-cases the value.
 */
export const normaliseVatNumber = (value: string) => value.replace(/[\s.-]/g, '').toUpperCase();

/**
 * Whether the value looks like a valid EU VAT number.
 *
 * - Belgium: an optional "BE" followed by 10 digits starting with 0 or 1, with the mod-97 check
 *   (97 minus the first 8 digits modulo 97 equals the last 2 digits).
 * - Netherlands: "NL", 9 digits, "B" and 2 digits.
 * - Other EU countries, loosely: the country prefix followed by 2 to 13 letters or digits, at
 *   least one of them a digit.
 */
export const isValidVatNumber = (value: string): boolean => {
  const vatNumber = normaliseVatNumber(value);

  const belgian = /^(?:BE)?([01]\d{9})$/.exec(vatNumber);

  if (belgian) {
    const digits = belgian[1];

    return 97 - (Number(digits.slice(0, 8)) % 97) === Number(digits.slice(8));
  }

  const prefix = vatNumber.slice(0, 2);

  if (prefix === 'BE') {
    return false;
  }

  if (prefix === 'NL') {
    return /^NL\d{9}B\d{2}$/.test(vatNumber);
  }

  return EU_VAT_PREFIXES.has(prefix) && /^[A-Z]{2}[0-9A-Z]{2,13}$/.test(vatNumber) && /\d/.test(vatNumber.slice(2));
};

/**
 * Whether the text field meta has a prefilled value that does not match its format.
 *
 * Such a value is not inserted automatically: the recipient sees it in the text dialog, with the
 * error, and corrects it.
 */
export const hasInvalidPrefilledText = (fieldMeta?: { format?: string; text?: string } | null): boolean => {
  return fieldMeta?.format === 'vat' && Boolean(fieldMeta.text) && !isValidVatNumber(fieldMeta.text ?? '');
};
