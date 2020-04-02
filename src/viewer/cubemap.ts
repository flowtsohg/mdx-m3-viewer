import Texture from './texture';

/**
 * A cube map.
 */
export default class CubeMap extends Texture {
  load(planes: TexImageSource[]) {
    let gl = this.viewer.gl;

    this.webglResource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.webglResource);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    for (let i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, planes[i]);
    }

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
  }

  /**
   * Bind this texture to the given texture unit.
   */
  bind(unit: number) {
    this.viewer.webgl.bindCubeMap(this, unit);
  }
}
