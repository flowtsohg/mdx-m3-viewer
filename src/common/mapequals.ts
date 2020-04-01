/**
 * Compares two Map objects, and returns whether they are equal or not.
 * Equal in this context means their keys and values are the same.
 */
export default function equals(a: Map<any, any>, b: Map<any, any>) {
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
