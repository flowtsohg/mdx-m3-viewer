/**
 * A very simple string hashing algorithm.
 */
export default function stringHash(s: string) {
  let hash = 0;

  for (let i = 0, l = s.length; i < l; i++) {
    hash = hash * 31 + s.charCodeAt(i);
    hash = hash & hash;
  }

  return hash;
}
