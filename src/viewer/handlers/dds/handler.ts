import { DdsImage, DDS_MAGIC } from '../../../parsers/dds/image';
import ModelViewer from '../../viewer';
import Texture from './texture';

export default {
  load(viewer: ModelViewer) {
    let webgl = viewer.webgl;

    // Optionally used when decoding mipmaps.
    if (!webgl.ensureExtension('WEBGL_compressed_texture_s3tc')) {
      console.warn('DDS: No compressed textures support! This might reduce performance.');
    }
  },
  isValidSource(src: any) {
    if (src instanceof DdsImage) {
      return true;
    }

    if (src instanceof ArrayBuffer) {
      let buffer = new Uint32Array(src, 0, 1);

      if (buffer[0] === DDS_MAGIC) {
        return true;
      }
    }

    return false;
  },
  resource: Texture,
};
