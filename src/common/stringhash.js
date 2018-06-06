/**
 * A very simple string hashing algorithm.
 *
 * @param {string} s A string to hash.
 * @return {number} The hash.
 */
export default function stringHash(s) {
  let hash = 0;

  for (let i = 0, l = s.length; i < l; i++) {
    hash = hash * 31 + s.charCodeAt(i);
    hash = hash & hash;
  }

  return hash;
}
