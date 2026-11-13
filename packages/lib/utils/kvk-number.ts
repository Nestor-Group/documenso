/**
 * Removes spaces and dots from a Dutch Chamber of Commerce (KVK) number.
 */
export const normaliseKvkNumber = (value: string) => value.replace(/[\s.]/g, '');

/**
 * Whether the value is a valid Dutch Chamber of Commerce (KVK) number: exactly 8 digits.
 *
 * Spaces and dots between the digits are allowed and ignored; letters, dashes or another number of
 * digits are not.
 */
export const isValidKvkNumber = (value: string): boolean => {
  return /^\d{8}$/.test(normaliseKvkNumber(value));
};
