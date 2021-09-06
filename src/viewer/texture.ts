import { HandlerResource } from './handlerresource';

/**
 * A texture.
 */
export default abstract class Texture extends HandlerResource {
  webglResource: WebGLTexture | null = null;
  width = 0;
  height = 0;
}
