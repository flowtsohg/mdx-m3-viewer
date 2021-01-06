import { isStringInBytes } from '../../../common/searches';
import Texture from './texture';

export default {
  isValidSource(src: any) {
    if (src instanceof ArrayBuffer) {
      let buffer = new Uint8Array(src);

      if (isStringInBytes(buffer, 'TRUEVISION-XFILE.\0', buffer.length - 18)) {
        return true;
      }
    }

    return false;
  },
  resource: Texture,
};
