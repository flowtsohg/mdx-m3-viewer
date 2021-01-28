import { BLP1_MAGIC } from './image';

/**
 * Detects if the given object is a BLP source.
 */
export default function isBlp(object: any) {
  if (object instanceof ArrayBuffer && object.byteLength > 4) {
    let buffer = new Uint32Array(object, 0, 1);

    if (buffer[0] === BLP1_MAGIC) {
      return true;
    }
  }

  return false;
}
