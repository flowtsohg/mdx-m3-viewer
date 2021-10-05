import Texture from '../texture';
import ClientBuffer from './clientbuffer';
import ClientDataTexture from './clientdatatexture';
import DataTexture from './datatexture';
import Shader from './shader';

/**
 * A small WebGL utility class.
 * Makes it easier to generate shaders, textures, etc.
 */
export default class WebGL {
  gl: WebGLRenderingContext;
  currentShader: Shader | null = null;
  emptyTexture: WebGLTexture;
  extensions: {[key: string]: unknown } = {};

  constructor(canvas: HTMLCanvasElement, options: WebGLContextAttributes = { alpha: false }) {
    let gl = canvas.getContext('webgl', options);

    if (!gl) {
      gl = <WebGLRenderingContext | null>canvas.getContext('experimental-webgl', options);
    }

    if (!gl) {
      throw new Error('WebGL: Failed to create a WebGL context!');
    }

    const twoByTwo = new Uint8ClampedArray(16).fill(255);

    const emptyTexture = <WebGLTexture>gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 2, 2, 0, gl.RGBA, gl.UNSIGNED_BYTE, twoByTwo);

    this.gl = gl;
    this.emptyTexture = emptyTexture;
  }

  /**
   * Ensures that an extension is available.
   * 
   * If it is, it will be added to `extensions`.
   */
  ensureExtension(name: string): boolean {
    const ext = this.gl.getExtension(name);

    if (ext) {
      this.extensions[name] = ext;

      return true;
    }

    return false;
  }

  createShader(vertexSource: string, fragmentSource: string): Shader {
    const gl = this.gl;

    const vertex = <WebGLShader>gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertex, vertexSource);
    gl.compileShader(vertex);

    const fragment = <WebGLShader>gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragment, fragmentSource);
    gl.compileShader(fragment);

    const program = <WebGLProgram>gl.createProgram();
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      let log = 'Shader failed to link:';

      const vertexLog = gl.getShaderInfoLog(vertex);
      if (vertexLog && vertexLog.length) {
        log += ` Vertex shader: ${vertexLog}`;
      }

      const fragmentLog = gl.getShaderInfoLog(fragment);
      if (fragmentLog && fragmentLog.length) {
        log += ` Fragment shader: ${fragmentLog}`;
      }

      throw new Error(log);
    }

    return new Shader(this, program);
  }

  /**
   * Enables all vertex attribs between [start, end], including start and discluding end.
   */
  enableVertexAttribs(start: number, end: number): void {
    const gl = this.gl;

    for (let i = start; i < end; i++) {
      gl.enableVertexAttribArray(i);
    }
  }

  /**
   * Disables all vertex attribs between [start, end], including start and discluding end.
   */
  disableVertexAttribs(start: number, end: number): void {
    const gl = this.gl;

    for (let i = start; i < end; i++) {
      gl.disableVertexAttribArray(i);
    }
  }

  /**
   * Use a shader program.
   */
  useShader(shader: Shader): void {
    if (shader && shader !== this.currentShader) {
      let oldAttribs = 0;
      const newAttribs = shader.attribsCount;

      if (this.currentShader) {
        oldAttribs = this.currentShader.attribsCount;
      }

      this.gl.useProgram(shader.program);

      if (newAttribs > oldAttribs) {
        this.enableVertexAttribs(oldAttribs, newAttribs);
      } else if (newAttribs < oldAttribs) {
        this.disableVertexAttribs(newAttribs, oldAttribs);
      }

      this.currentShader = shader;
    }
  }

  /**
   * Bind a texture.
   * 
   * If the given texture is invalid, a 2x2 black texture will be bound instead.
   */
  bindTexture(texture: Texture | undefined | null, unit: number): void {
    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + unit);

    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
    } else {
      // Bind an empty texture in case an invalid one was given, to avoid WebGL errors.
      gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);
    }
  }

  bindTextureAndWrap(texture: Texture | undefined | null, unit: number, wrapS: number, wrapT: number): void {
    const gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + unit);

    if (texture) {
      gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
    } else {
      // Bind an empty texture in case an invalid one was given, to avoid WebGL errors.
      gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
  }

  /**
   * Set the texture wrap and filter values.
   */
  setTextureMode(wrapS: number, wrapT: number, magFilter: number, minFilter: number): void {
    const gl = this.gl;

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  }

  /**
   * A shortcut for `new ClientBuffer(gl, size)`.
   */
  createClientBuffer(size = 4): ClientBuffer {
    return new ClientBuffer(this.gl, size);
  }

  /**
   * A shortcut for `new DataTexture(gl, channels, width, height)`.
   */
  createDataTexture(channels = 4, width = 1, height = 1): DataTexture {
    return new DataTexture(this.gl, channels, width, height);
  }

  /**
   * A shortcut for `new ClientDataTexture(gl, width, height)`.
   */
  createClientDataTexture(width = 1, height = 1): ClientDataTexture {
    return new ClientDataTexture(this.gl, width, height);
  }
}
