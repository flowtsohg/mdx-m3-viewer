import TgaImage from '../../../parsers/tga/image';
import isTga from '../../../parsers/tga/isformat';
import Texture from './texture';

export default {
  isValidSource(object: unknown): boolean {
    if (object instanceof TgaImage) {
      return true;
    }

    return isTga(object);
  },
  resource: Texture,
};
