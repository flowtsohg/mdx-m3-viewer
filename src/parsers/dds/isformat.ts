import { DDS_MAGIC } from './image';

/**
 * Detects if the given object is a DDS source.
 */
export default function isDds(object: any) {
  if (object instanceof ArrayBuffer && object.byteLength > 4) {
    let buffer = new Uint32Array(object, 0, 1);

    if (buffer[0] === DDS_MAGIC) {
      return true;
    }
  }

  return false;
}
