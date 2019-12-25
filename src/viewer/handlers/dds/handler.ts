import ModelViewer from '../../viewer';
import Texture from './texture';

export default {
  load(viewer: ModelViewer) {
    let webgl = viewer.webgl;

    // Optionally used when decoding mipmaps.
    if (!webgl.ensureExtension('WEBGL_compressed_texture_s3tc')) {
      console.warn('DDS: No compressed textures support! This might reduce performance.');
    }

    return true;
  },
  extensions: [['.dds', 'arrayBuffer']],
  resource: Texture,
};
