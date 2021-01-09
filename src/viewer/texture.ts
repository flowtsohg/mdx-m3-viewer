import { HandlerResource } from './handlerresource';

/**
 * A texture.
 */
export default abstract class Texture extends HandlerResource {
  webglResource: WebGLTexture | null = null;
  width: number = 0;
  height: number = 0;
}
