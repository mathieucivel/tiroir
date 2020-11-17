import {isNumeric} from '../helpers/types';

/**
 * Represents a numerical range.
 * 
 * @param {Array} range Array of two ordered numbers
 */
export function Range(range = []) {

  function isValid() {
    return range && range.length >= 2 && isNumeric(range[0]) && isNumeric(range[1]) && range[0] <= range[1]
  }

  /**
   * Increase both bounds by a given percentage. 
   * 
   * TODO: add option to increase left or right bound
   * @param  {Number} percent increase wanted in percentage for each bound
   * @return {Array} a new range array
   */
  function increasePercent(percent) {
    if (!isValid()) return
    const incValue = (range[1] - range[0]) * (percent / 100);
    return Range([range[0] - incValue, range[1] + incValue]);
  }

  /**
   * Split the range into several sub-ranges where the length of the range is 
   * smaller than the given max parameter.
   *   ex: range([2, 10]).split(2)  -> [[2, 4], [4, 6], [6, 8], [8, 10]]
   *
   * @param  {number} max - split period
   * @return {Array[]} - array of ranges
   */
  function split(max) {
    if (!isValid()) return
    a = range[0]
    b = range[1]
    if (b - a > max) {
      return [Range([a, a + max]), ...Range([a + max, b]).split(max)];
    }
    return [Range([a, b])];
  }


  Object.defineProperties(range, {
    isValid: {value: isValid},
    increasePercent: {value: increasePercent}, 
    split: {value: split}, 
  });
}