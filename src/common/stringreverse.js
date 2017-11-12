/**
 * Reverses a string.
 *
 * @param {string} s The string to reverse
 * @returns {string}
 */
export default function reverse(s) {
    return [...s].reverse().join('');
};
