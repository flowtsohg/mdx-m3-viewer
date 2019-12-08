import Resource from './resource';

/**
 * A texture.
 */
export default class Texture extends Resource {
  webglResource: WebGLTexture | null;
  width: number;
  height: number;
  wrapS: number;
  wrapT: number;

  constructor(resourceData: ResourceData) {
    super(resourceData);

    const gl = this.viewer.gl;

    this.webglResource = null;
    this.width = 0;
    this.height = 0;
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
