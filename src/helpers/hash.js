/**
 * Fast synchronous string hashing function.
 * @param {String} s String to hash.
 * @returns {Number} Positive number.
 */
export function quickHash(s) {
  return s.split('').reduce((a, b) => (a = ((a << 5) - a) + b.charCodeAt(0)) & a, 0) >>> 0;
}
