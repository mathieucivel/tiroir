/**
 * Gives a truncated floored value contained in the specified unit range.
 * Example: truncFloor(1232.234, 100) -> 1200
 * @param  {Number} _value Value.
 * @param  {Number} _unit Unit factor.
 * @return {Number} The truncated and floored value.
 */
export function truncFloor(_value, _unit) {
  return Math.floor(_value / _unit) * _unit;
}

/**
 * Gives a truncated ceiled value contained in the specified unit range.
 * Example: truncFloor(1232.234, 100) -> 1300
 * @param  {Number} _value Value.
 * @param  {Number} _unit Unit factor.
 * @return {Number} The ceiled and truncated value.
 */
export function truncCeil(_value, _unit) {
  return Math.ceil(_value / _unit) * _unit;
}

/**
 * Gives a truncated rounded value contained in the specified unit range.
 * Example: truncFloor(1232.234, 100) -> 1200
 * @param  {Number} _value Value.
 * @param  {Number} _unit Unit factor.
 * @return {Number} The truncated and rounded value.
 */
export function truncRound(_value, _unit) {
  return Math.round(_value / _unit) * _unit;
}

/**
 * Gives a limited floored value contained in the specified unit range.
 * Example: limitFloor(1232.234, 100) -> 1232.23
 * @param  {Number} _value Value.
 * @param  {Number} _unit Unit factor.
 * @return {Number} The limited and floored value.
 */
export function limitFloor(_value, _unit) {
  return Math.floor(_value * _unit) / _unit;
}

/**
 * Gives a limited ceiled value contained in the specified unit range.
 * Example: limitCeil(1232.234, 100) -> 1232.24
 * @param  {Number} _value Value.
 * @param  {Number} _unit Unit factor.
 * @return {Number} The ceiled and limited value.
 */
export function limitCeil(_value, _unit) {
  return Math.ceil(_value * _unit) / _unit;
}

/**
 * Gives a limited rounded value contained in the specified unit range.
 * Example: limitRound(1232.234, 100) -> 1232.23
 * @param  {Number} _value Value.
 * @param  {Number} _unit Unit factor.
 * @return {Number} The limited and rounded value.
 */
export function limitRound(_value, _unit) {
  return Math.round(_value * _unit) / _unit;
}
