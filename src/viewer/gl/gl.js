import stringHash from '../../common/stringhash';
import ShaderUnit from './shader';
import ShaderProgram from './program';

/**
 * SOME_Ext_Name -> someExtName
 *
 * @param {string} ext
 * @return {string}
 */
function extensionToCamelCase(ext) {
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
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {?Object} options
   */
  constructor(canvas, options) {
    let gl = canvas.getContext('webgl', options || {alpha: false});

    if (!gl) {
      gl = canvas.getContext('experimental-webgl', options || {alpha: false});
    }

    if (!gl) {
      throw new Error('WebGL: Failed to create a WebGL context!');
    }

    let extensions = {};
    for (let extension of gl.getSupportedExtensions()) {
      // Firefox keeps spamming errors about MOZ_ prefixed extension strings being deprecated.
      if (!extension.startsWith('MOZ_')) {
        extensions[extensionToCamelCase(extension)] = gl.getExtension(extension);
      }
    }

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

    gl.extensions = extensions;

    // The only initial setup required, the rest should be handled by the handlers
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);

    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {array} */
    this.extensions = extensions;
    /** @member {Map<number, ShaderUnit>} */
    this.shaderUnits = new Map();
    /** @member {Map<number, ShaderProgram>} */
    this.shaderPrograms = new Map();
    /** @member {?ShaderProgram} */
    this.currentShaderProgram = null;
    /** @member {string} */
    this.floatPrecision = 'precision mediump float;\n';

    // An empty 2x2 texture that is used automatically when binding an invalid texture
    let imageData = new ImageData(2, 2);

    // Alpha fully set.
    for (let i = 0; i < 4; i++) {
      imageData.data[i * 4 + 3] = 255;
    }

    let emptyTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, imageData);

    /** @member {WebGLTexture} */
    this.emptyTexture = emptyTexture;
  }

  /**
   * Create a new shader unit. Uses caching.
   *
   * @param {string} src The shader source.
   * @param {number} type The shader type.
   * @return {ShaderUnit}
   */
  createShaderUnit(src, type) {
    let hash = stringHash(src);
    let shaderUnits = this.shaderUnits;

    if (!shaderUnits.has(hash)) {
      shaderUnits.set(hash, new ShaderUnit(this.gl, src, type));
    }

    return shaderUnits.get(hash);
  }

  /**
   * Create a new shader program. Uses caching.
   *
   * @param {string} vertexSrc The vertex shader source.
   * @param {string} fragmentSrc The fragment shader source.
   * @return {ShaderProgram}
   */
  createShaderProgram(vertexSrc, fragmentSrc) {
    let gl = this.gl;
    let vertexShader = this.createShaderUnit(vertexSrc, gl.VERTEX_SHADER);
    let fragmentShader = this.createShaderUnit(this.floatPrecision + fragmentSrc, gl.FRAGMENT_SHADER);
    let shaderPrograms = this.shaderPrograms;

    if (vertexShader.ok && fragmentShader.ok) {
      let hash = stringHash(vertexSrc + fragmentSrc);

      if (!shaderPrograms.has(hash)) {
        shaderPrograms.set(hash, new ShaderProgram(gl, vertexShader, fragmentShader));
      }

      let shaderProgram = shaderPrograms.get(hash);

      if (shaderProgram.ok) {
        return shaderProgram;
      }
    }
  }

  /**
   * Enables all vertex attribs between [start, end], including start and discluding end.
   *
   * @param {number} start
   * @param {number} end
   */
  enableVertexAttribs(start, end) {
    let gl = this.gl;

    for (let i = start; i < end; i++) {
      gl.enableVertexAttribArray(i);
    }
  }

  /**
   * Disables all vertex attribs between [start, end], including start and discluding end.
   *
   * @param {number} start
   * @param {number} end
   */
  disableVertexAttribs(start, end) {
    let gl = this.gl;

    for (let i = start; i < end; i++) {
      gl.disableVertexAttribArray(i);
    }
  }

  /**
   * Use a shader program.
   *
   * @param {ShaderProgram} shaderProgram The program.
   */
  useShaderProgram(shaderProgram) {
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
   * Note that if the given texture is invalid (null or not loaded) then a 2x2 black texture will be bound instead.
   *
   * @param {Texture} texture The texture to bind.
   * @param {number} unit The texture unit to bind to.
   */
  bindTexture(texture, unit) {
    let gl = this.gl;

    gl.activeTexture(gl.TEXTURE0 + unit);

    if (texture && texture.ok) {
      gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
    } else {
      // Bind an empty texture in case an invalid one was given, to avoid WebGL errors.
      gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture);
    }
  }
}
