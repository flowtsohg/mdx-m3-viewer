/**
 * Mix ...args into dst
 *
 * @param {*} dst
 * @param {*} args
 * @return {dst}
 */
export default function mix(dst, ...args) {
  for (let arg of args) {
    let keys = Reflect.ownKeys(arg);

    for (let i = 0, l = keys.length; i < l; i++) {
      let key = keys[i];

      if (!Reflect.has(dst, key)) {
        Reflect.defineProperty(dst, key, Reflect.getOwnPropertyDescriptor(arg, key));
      }
    }
  }

  return dst;
}
