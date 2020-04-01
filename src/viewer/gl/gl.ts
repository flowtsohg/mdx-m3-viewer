import Texture from '../texture';
import CubeMap from '../cubemap';
import ShaderUnit from './shader';
import ShaderProgram from './program';

/**
 * A small WebGL utility class.
 * Makes it easier to generate shaders, textures, etc.
 */
export default class WebGL {
  gl: WebGLRenderingContext;
  shaderUnits: Map<string, ShaderUnit> = new Map();
  shaderPrograms: Map<string, ShaderProgram> = new Map();
  currentShaderProgram: ShaderProgram | null = null;
  emptyTexture: WebGLTexture;
  emptyCubeMap: WebGLTexture;
  extensions: { [key: string]: any } = {};

  constructor(canvas: HTMLCanvasElement, options: object = { alpha: false }) {
    let gl = <WebGLRenderingContext>canvas.getContext('webgl', options);

    if (!gl) {
      gl = <WebGLRenderingContext>canvas.getContext('experimental-webgl', options);
    }

    if (!gl) {
      throw new Error('WebGL: Failed to create a WebGL context!');
    }

    let twoByTwo = new Uint8ClampedArray([0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255, 0, 0, 0, 255]);

    let emptyTexture = <WebGLTexture>gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, twoByTwo);

    let emptyCubeMap = <WebGLTexture>gl.createTexture();
    gl.bindTexture(gl.TEXTURE_CUBE_MAP, emptyCubeMap);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    for (let i = 0; i < 6; i++) {
      gl.texImage2D(gl.TEXTURE_CUBE_MAP_POSITIVE_X + i, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, twoByTwo);
    }

    this.gl = gl;
    this.emptyTexture = emptyTexture;
    this.emptyCubeMap = emptyCubeMap;

    // The only initial setup, the rest should be handled by the handlers.
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.SCISSOR_TEST);
  }

  /**
   * Ensures that an extension is available.
   * 
   * If it is, it will be added to `extensions`.
   */
  ensureExtension(name: string) {
    let ext = this.gl.getExtension(name);

    if (ext) {
      this.extensions[name] = ext;

      return true;
    }

    return false;
  }

  /**
   * Create a new shader unit. Uses caching.
   */
  createShaderUnit(src: string, type: number) {
    let shaderUnits = this.shaderUnits;

    if (!shaderUnits.has(src)) {
      shaderUnits.set(src, new ShaderUnit(this.gl, src, type));
    }

    return <ShaderUnit>shaderUnits.get(src);
  }

  /**
   * Create a new shader program. Uses caching.
   */
  createShaderProgram(vertexSrc: string, fragmentSrc: string) {
    let gl = this.gl;
    let vertexShader = this.createShaderUnit(vertexSrc, gl.VERTEX_SHADER);
    let fragmentShader = this.createShaderUnit(fragmentSrc, gl.FRAGMENT_SHADER);
    let shaderPrograms = this.shaderPrograms;

    if (vertexShader.ok && fragmentShader.ok) {
      let src = vertexSrc + fragmentSrc;

      if (!shaderPrograms.has(src)) {
        shaderPrograms.set(src, new ShaderProgram(this, vertexShader, fragmentShader));
      }

      let program = <ShaderProgram>shaderPrograms.get(src);

      if (program.ok) {
        return program;
      }
    }

    return null;
  }

  /**
   * Enables all vertex attribs between [start, end], including start and discluding end.
   */
  enableVertexAttribs(start: number, end: number) {
    let gl = this.gl;

    for (let i = start; i < end; i++) {
      gl.enableVertexAttribArray(i);
    }
  }

  /**
   * Disables all vertex attribs between [start, end], including start and discluding end.
   */
  disableVertexAttribs(start: number, end: number) {
    let gl = this.gl;

    for (let i = start; i < end; i++) {
      gl.disableVertexAttribArray(i);
    }
  }

  /**
   * Use a shader program.
   */
  useShaderProgram(shaderProgram: ShaderProgram) {
    let currentShaderProgram = this.currentShaderProgram;

    if (shaderProgram && shaderProgram.ok && shaderProgram !== currentShaderProgram) {
      let oldAttribs = 0;
      let newAttribs = shaderProgram.attribsCount;

      if (currentShaderProgram) {
        oldAttribs = currentShaderProgram.attribsCount;
      }

      this.gl.useProgram(shaderProgram.webglResource);

      if (newAttribs > oldAttribs) {
        this.enableVertexAttribs(oldAttribs, newAttribs);
      } else if (newAttribs < oldAttribs) {
        this.disableVertexAttribs(newAttribs, oldAttribs);
      }

      this.currentShaderProgram = shaderProgram;
    }
  }

  /**
   * Bind a texture.
   * 
   * If the given texture is invalid, a 2x2 black texture will be bound instead.
   */
  bindTexture(texture: Texture | null, unit: number) {
    let gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + unit);

    if (texture && texture.ok) {
      gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
    } else {
      // Bind an empty texture in case an invalid one was given, to avoid WebGL errors.
      gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);
    }
  }

  /**
   * Bind a cube map texture.
   * 
   * If the given texture is invalid, a 2x2 black texture will be bound instead.
   */
  bindCubeMap(cubeMap: CubeMap | null, unit: number) {
    let gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + unit);

    if (cubeMap && cubeMap.ok) {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubeMap.webglResource);
    } else {
      gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.emptyCubeMap);
    }
  }

  /**
   * Set the texture wrap and filter values.
   */
  setTextureMode(wrapS: number, wrapT: number, magFilter: number, minFilter: number) {
    let gl = this.gl;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  }
}
