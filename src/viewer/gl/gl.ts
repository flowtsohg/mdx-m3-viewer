import stringHash from '../../common/stringhash';
import ShaderUnit from './shader';
import ShaderProgram from './program';
import Texture from '../texture';

/**
 * SOME_Ext_Name -> someExtName
 */
function extensionToCamelCase(ext: string) {
  let tokens = ext.split('_');
  let result = tokens[1];

  for (let i = 2, l = tokens.length; i < l; i++) {
    result += tokens[i][0].toUpperCase() + tokens[i].substr(1);
  }

  return result;
}

/**
 * A small WebGL utility class.
 * Makes it easier to generate shaders, textures, etc.
 */
export default class WebGL {
  gl: WebGLRenderingContext;
  extensions: object;
  shaderUnits: Map<number, ShaderUnit>;
  shaderPrograms: Map<number, ShaderProgram>;
  currentShaderProgram: ShaderProgram | null;
  floatPrecision: string;
  emptyTexture: WebGLTexture;

  /**
   *
   */
  constructor(canvas: HTMLCanvasElement, options?: object) {
    let gl = <WebGLRenderingContext>canvas.getContext('webgl', options || { alpha: false });

    if (!gl) {
      gl = <WebGLRenderingContext>canvas.getContext('experimental-webgl', options || { alpha: false });
    }

    if (!gl) {
      throw new Error('WebGL: Failed to create a WebGL context!');
    }

    let extensions = {};
    let supportedExtensions = gl.getSupportedExtensions();

    if (supportedExtensions) {
      for (let extension of supportedExtensions) {
        // Firefox keeps spamming errors about MOZ_ prefixed extension strings being deprecated.
        if (!extension.startsWith('MOZ_')) {
          extensions[extensionToCamelCase(extension)] = gl.getExtension(extension);
        }
      }
    }

    this.gl = gl;
    this.extensions = extensions;

    if (!gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
      throw new Error('WebGL: No vertex shader texture support!');
    }

    if (!extensions.textureFloat) {
      throw new Error('WebGL: No floating point texture support!');
    }

    if (!extensions.instancedArrays) {
      throw new Error('WebGL: No instanced rendering support!');
    }

    if (!extensions.compressedTextureS3tc) {
      console.warn('WebGL: No compressed textures support! This might reduce performance.');
    }

    if (!extensions.vertexArrayObject) {
      console.warn('WebGL: No vertex array object support! This might reduce performance.');
    }

    // An empty 2x2 texture that is used automatically when binding an invalid texture
    let imageData = new ImageData(2, 2);

    // Alpha fully set.
    for (let i = 0; i < 4; i++) {
      imageData.data[i * 4 + 3] = 255;
    }

    let emptyTexture = <WebGLTexture>gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    this.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

    // The only initial setup required, the rest should be handled by the handlers
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);


    this.shaderUnits = new Map();
    this.shaderPrograms = new Map();
    this.currentShaderProgram = null;
    this.floatPrecision = 'precision mediump float;\n';
    this.emptyTexture = emptyTexture;
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
    let fragmentShader = this.createShaderUnit(this.floatPrecision + fragmentSrc, gl.FRAGMENT_SHADER);
    let shaderPrograms = this.shaderPrograms;

    if (vertexShader.ok && fragmentShader.ok) {
      let hash = stringHash(vertexSrc + fragmentSrc);

      if (!shaderPrograms.has(hash)) {
        shaderPrograms.set(hash, new ShaderProgram(this, vertexShader, fragmentShader));
      }

      let shaderProgram = <ShaderProgram>shaderPrograms.get(hash);

      if (shaderProgram.ok) {
        return shaderProgram;
      }
    }
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
   * Note that if the given texture is invalid (null or not loaded) then a 2x2 black texture will be bound instead.
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
