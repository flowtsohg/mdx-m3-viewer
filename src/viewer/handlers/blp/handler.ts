import { BlpImage, BLP1_MAGIC } from '../../../parsers/blp/image';
import Texture from './texture';

export default {
  isValidSource(src: any) {
    if (src instanceof BlpImage) {
      return true;
    }

    if (src instanceof ArrayBuffer) {
      let buffer = new Uint32Array(src, 0, 1);

      if (buffer[0] === BLP1_MAGIC) {
        return true;
      }
    }

    return false;
  },
  resource: Texture,
};
