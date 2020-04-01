/**
 * Returns an array that only contains unique values found in the source array.
 */
export default function unique(a: any[]) {
  return a.reverse().filter((e, i, arr) => {
    return arr.indexOf(e, i + 1) === -1;
  }).reverse();
}
