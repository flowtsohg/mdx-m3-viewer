/**
 * Compares two Map objects, and returns whether they are equal or not.
 * Equal in this context means their keys and values are the same.
 *
 * @param {Map} a
 * @param {Map} b
 * @return {boolean}
 */
export default function equals(a, b) {
  if (a.size !== b.size) {
    return false;
  }

  for (let [key, value] of a) {
    let value2 = b.get(key);

    if (value2 !== value || (value2 === undefined && !b.has(key))) {
      return false;
    }
  }

  return true;
}
