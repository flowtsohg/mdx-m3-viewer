import HandlerResource from './handlerresource';

/**
 * A texture.
 */
export default abstract class Texture extends HandlerResource {
  webglResource: WebGLTexture | null = null;
  width: number = 0;
  height: number = 0;
  wrapS: number;
  wrapT: number;

  constructor(resourceData: HandlerResourceData) {
    super(resourceData);

    const gl = resourceData.viewer.gl;

    this.wrapS = gl.CLAMP_TO_EDGE;
    this.wrapT = gl.CLAMP_TO_EDGE;
  }

  /**
   * Bind this texture to the given texture unit.
   */
  bind(unit: number) {
    this.viewer.webgl.bindTexture(this, unit);
  }
}
