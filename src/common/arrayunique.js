/**
 * Returns an array that only contains unique values found in the source array.
 *
 * @param {array} a
 * @returns {array}.
 */
export default function unique(a) {
    return a.reverse().filter(function (e, i, arr) {
        return arr.indexOf(e, i + 1) === -1;
    }).reverse();
};
