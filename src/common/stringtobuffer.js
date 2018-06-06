/**
 * Returns the ArrayBuffer representation of the given string.
 * The string is assumed to be a binary string.
 * That is, unicode and locales are not handled in any way.
 *
 * @param {string} s
 * @return {ArrayBuffer}
 */
export function stringToBuffer(s) {
  let typedArray = new Uint8Array(s.length);

  for (let i = 0, l = typedArray.length; i < l; i++) {
    typedArray[i] = s.charCodeAt(i);
  }

  return typedArray.buffer;
}

/**
 * Returns the string representation of the given ArrayBuffer.
 *
 * @param {ArrayBuffer} b
 * @return {string}
 */
export function bufferToString(b) {
  let typedArray = new Uint8Array(b);
  let s = '';

  for (let i = 0, l = typedArray.length; i < l; i++) {
    s += String.fromCharCode(typedArray[i]);
  }

  return s;
}
