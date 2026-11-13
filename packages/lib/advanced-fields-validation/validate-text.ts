import type { TTextFieldMeta as TextFieldMeta } from '../types/field-meta';
import { isValidKvkNumber } from '../utils/kvk-number';
import { isValidVatNumber } from '../utils/vat-number';

export const validateTextField = (
  value: string,
  fieldMeta: TextFieldMeta,
  isSigningPage: boolean = false,
): string[] => {
  const errors = [];

  const { characterLimit, readOnly, required, fontSize, format } = fieldMeta;

  if (required && !value && isSigningPage) {
    errors.push('Value is required');
  }

  // Only the value entered while signing is checked; a prefilled value may still be corrected.
  if (format === 'vat' && value && isSigningPage && !isValidVatNumber(value)) {
    errors.push('Enter a valid VAT number, for example BE0123456749.');
  }

  if (format === 'kvk' && value && isSigningPage && !isValidKvkNumber(value)) {
    errors.push('Enter a valid KVK number: 8 digits, for example 12345678.');
  }

  if (characterLimit !== undefined && characterLimit > 0 && value.length > characterLimit) {
    errors.push(`Value length (${value.length}) exceeds the character limit (${characterLimit})`);
  }

  if (readOnly && value.length < 1) {
    errors.push('A read-only field must have text');
  }

  if (readOnly && required) {
    errors.push('A field cannot be both read-only and required');
  }

  if (fontSize && (fontSize < 8 || fontSize > 96)) {
    errors.push('Font size must be between 8 and 96.');
  }

  return errors;
};
