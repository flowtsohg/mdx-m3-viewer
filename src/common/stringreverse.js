/**
 * Reverses a string.
 *
 * @param {string} s The string to reverse
 * @return {string}
 */
export default function reverse(s) {
  return [...s].reverse().join('');
}
