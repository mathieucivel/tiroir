/**
 * Async delay
 *
 * @param  {number} ms - milliseconds to wait
 * @return {Promise}
 */
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

