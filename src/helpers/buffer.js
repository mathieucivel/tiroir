/**
 * Converts binary data into a string
 * @param  {Uint8Array} _buffer
 * @return {string}
 */
export function bufferToString(_buffer) {
  let str = '';
  for (let i = 0; i < _buffer.length; ++i) {
    str += String.fromCharCode(_buffer[i]);
  }
  return str;
}

/**
 * Converts binary data into an hexadecimal string
 * @param  {Uint8Array} _buffer
 * @return {string}
 */
export function bufferToHex(_buffer) {
  let str = '';
  for (let i = 0; i < _buffer.length; ++i) {
    let hex = _buffer[i].toString(16);
    if (hex.length === 1) {
      hex = `0${hex}`;
    }
    str += hex;
  }
  return str;
}

/**
 * Converts a string into a buffer array
 * @param  {string} _string
 * @return {Uint8Array}
 */
export function bufferFromString(_string) {
  let bytes = new Uint8Array(_string.length);
  for (let i = 0; i < _string.length; ++i) {
    bytes[i] = _string.charCodeAt(i);
  }
  return bytes;
}

/**
 * Converts an hexadecimal string into a buffer array
 * @param  {string} _string
 * @return {Uint8Array}
 */
export function bufferFromHex(_string) {
  let size = _string.length / 2;
  let bytes = new Uint8Array(size);
  for (let i = 0; i < size; ++i) {
    bytes[i] = parseInt(_string.slice(i * 2, (i + 1) * 2), 16);
  }
  return bytes;
}
