import { FetchResult, fetchDataType } from '../common/fetchdatatype';
import Texture from './texture';
import { isImageSource } from './imagetexture';

/**
 * A cube map.
 */
export default class CubeMap extends Texture {
  async load() {
    let fetchPromises: Promise<FetchResult>[] = [];

    for (let i = 0; i < 6; i++) {
      let finalSrc = this.pathSolver(i)[0];

      if (isImageSource(finalSrc)) {
        fetchPromises[i] = new Promise((resolve) => resolve({ ok: true, data: finalSrc }));
      } else {
        fetchPromises[i] = fetchDataType(finalSrc, 'image');
      }
    }

    let fetchResults = await Promise.all(fetchPromises);

    for (let i = 0; i < 6; i++) {
      if (!fetchResults[i].ok) {
        throw new Error('Failed to load a cube map image');
      }
    }

    let gl = this.viewer.gl;

    this.webglResource = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.webglResource);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

    for (let i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, <TexImageSource>fetchResults[i].data);
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
