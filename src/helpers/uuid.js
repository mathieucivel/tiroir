import {bufferToHex} from './buffer.js';

/**
 * Generates a new random UUID.
 * Uses the provided prefix to fill the first n-bytes.
 * @param {String} prefix Optional prefix.
 * @returns {String} Random UUID.
 */
export function makeUuid(_prefix = '') {
  const rand = window.crypto.getRandomValues(new Uint8Array(16));
  const hex = _prefix + bufferToHex(rand);
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}
