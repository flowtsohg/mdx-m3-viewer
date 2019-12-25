import stringHash from '../../common/stringhash';
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
  shaderUnits: Map<number, ShaderUnit> = new Map();
  shaderPrograms: Map<number, ShaderProgram> = new Map();
  currentShaderProgram: ShaderProgram | null = null;
  emptyTexture: WebGLTexture;
  emptyCubeMap: WebGLTexture;
  extensions: {
    instancedArrays: ANGLE_instanced_arrays,
    compressedTextureS3tc: WEBGL_compressed_texture_s3tc | null,
    vertexArrayObject: OES_vertex_array_object | null
  };

  constructor(canvas: HTMLCanvasElement, options?: object) {
    let gl = <WebGLRenderingContext>canvas.getContext('webgl', options || { alpha: false });

    if (!gl) {
      gl = <WebGLRenderingContext>canvas.getContext('experimental-webgl', options || { alpha: false });
    }

    if (!gl) {
      throw new Error('WebGL: Failed to create a WebGL context!');
    }

    let textureFloat = gl.getExtension('OES_texture_float')
    let instancedArrays = gl.getExtension('ANGLE_instanced_arrays')
    let compressedTextureS3tc = gl.getExtension('WEBGL_compressed_texture_s3tc')
    let vertexArrayObject = gl.getExtension('OES_vertex_array_object')
    let standardDerivatives = gl.getExtension('OES_standard_derivatives'); // Used in War3MapViewer's shaders, but that might change.
    let textureLod = gl.getExtension('EXT_shader_texture_lod');

    if (gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) === 0) {
      throw new Error('WebGL: No vertex shader texture support!');
    }

    if (textureFloat === null) {
      throw new Error('WebGL: No floating point texture support!');
    }

    if (instancedArrays === null) {
      throw new Error('WebGL: No instanced rendering support!');
    }

    if (compressedTextureS3tc === null) {
      console.warn('WebGL: No compressed textures support! This might reduce performance.');
    }

    if (vertexArrayObject === null) {
      console.warn('WebGL: No vertex array object support! This might reduce performance.');
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
    this.extensions = {
      instancedArrays,
      compressedTextureS3tc,
      vertexArrayObject,
    }

    // The only initial setup, the rest should be handled by the handlers.
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);
  }

  /**
   * Create a new shader unit. Uses caching.
   */
  createShaderUnit(src: string, type: number) {
    let hash = stringHash(src);
    let shaderUnits = this.shaderUnits;

    if (!shaderUnits.has(hash)) {
      shaderUnits.set(hash, new ShaderUnit(this.gl, src, type));
    }

    return <ShaderUnit>shaderUnits.get(hash);
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
      let hash = stringHash(vertexSrc + fragmentSrc);

      if (!shaderPrograms.has(hash)) {
        shaderPrograms.set(hash, new ShaderProgram(this, vertexShader, fragmentShader));
      }

      let program = <ShaderProgram>shaderPrograms.get(hash);

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
