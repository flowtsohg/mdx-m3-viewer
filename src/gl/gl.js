/**
 * @class
 * @classdesc A simple wrapper around WebGL.
 * @param {HTMLCanvasElement} canvas The canvas to create a WebGL context for.
 */
function WebGL(canvas) {
    let gl;

    for (let identifier of["webgl", "experimental-webgl"]) {
        try {
            // preserveDrawingBuffer is needed normally to be able to use the WebGL canvas as an image source (e.g. RTT).
            // It however makes rendering slower, since it doesn't let browsers implement optimizations.
            // For proper support, use the viewer's render event - the internal WebGL buffer is still valid there.
            gl = canvas.getContext(identifier, { antialias: true, alpha: false/*, preserveDrawingBuffer: true*/ });
        } catch (e) {

        }

        if (gl) {
            break;
        }
    }

    if (!gl) {
        throw new Error("WebGL: Failed to create a WebGL context!");
    }

    function extensionToCamelCase(ext) {
        let tokens = ext.split("_"),
            result = tokens[1];

        for (let i = 2, l = tokens.length; i < l; i++) {
            result += tokens[i][0].toUpperCase() + tokens[i].substr(1);
        }

        return result;
    }

    let extensions = {};
    for (let extension of gl.getSupportedExtensions()) {
        extensions[extensionToCamelCase(extension)] = gl.getExtension(extension);
    }

    if (!gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
        throw new Error("WebGL: No vertex shader texture support!");
    }

    if (!extensions.textureFloat) {
        throw new Error("WebGL: No floating point texture support!");
    }

    if (!extensions.instancedArrays) {
        throw new Error("WebGL: No instanced rendering support!");
    }

    if (!extensions.compressedTextureS3tc) {
        console.warn("WebGL: No compressed textures support! This might reduce performance.");
    }

    gl.extensions = extensions;

    // The only initial setup required, the rest should be handled by the handelrs
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);

    /** @member {WebGLRenderingContext} */
    this.gl = gl;
    /** @member {array} */
    this.extensions = extensions;
    /** @member {map.<number, ShaderUnit>} */
    this.shaderUnits = new Map();
    /** @member {map.<number, ShaderProgram>} */
    this.shaderPrograms = new Map();
    /** @member {?ShaderProgram} */
    this.currentShaderProgram = null;
    /** @member {string} */
    this.floatPrecision = "precision mediump float;\n";

    // An empty 2x2 texture that is used automatically when binding an invalid texture
    const emptyTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(2, 2));
    /** @member {WebGLTexture} */
    this.emptyTexture = emptyTexture;
}

WebGL.prototype = {
    /**
     * @method
     * @desc Create a new shader unit. Uses caching.
     * @param {string} src The shader source.
     * @param {number} type The shader type.
     * @returns {ShaderUnit}
     */
    createShaderUnit(src, type) {
        let hash = hashFromString(src),
            shaderUnits = this.shaderUnits;

        if (!shaderUnits.has(hash)) {
            shaderUnits.set(hash, new ShaderUnit(this.gl, src, type));
        }

        return shaderUnits.get(hash);
    },

    /**
     * @method
     * @desc Create a new shader program. Uses caching.
     * @param {ShaderUnit} vertexShader The vertex shader unit.
     * @param {ShaderUnit} fragmentShader The fragment shader unit.
     * @returns {ShaderProgram}
     */
    createShaderProgram(vertexSource, fragmentSource) {
        let gl = this.gl,
            vertexShader = this.createShaderUnit(vertexSource, gl.VERTEX_SHADER),
            fragmentShader = this.createShaderUnit(this.floatPrecision + fragmentSource, gl.FRAGMENT_SHADER),
            shaderPrograms = this.shaderPrograms;

        if (vertexShader.loaded && fragmentShader.loaded) {
            let hash = hashFromString(vertexSource + fragmentSource);

            if (!shaderPrograms.has(hash)) {
                shaderPrograms.set(hash, new ShaderProgram(gl, vertexShader, fragmentShader));
            }

            let shaderProgram = shaderPrograms.get(hash);

            if (shaderProgram.loaded) {
                return shaderProgram;
            }
        }
    },

    createResizeableBuffer() {
        return new ResizeableBuffer(this.gl);
    },

    enableVertexAttribs(start, end) {
        const gl = this.gl;

        for (let i = start; i < end; i++) {
            gl.enableVertexAttribArray(i);
        }
    },

    disableVertexAttribs(start, end) {
        const gl = this.gl;

        for (let i = start; i < end; i++) {
            gl.disableVertexAttribArray(i);
        }
    },

    /**
     * @method
     * @desc Use a shader program.
     * @param {ShaderProgram} shaderProgram The program.
     */
    useShaderProgram(shaderProgram) {
        if (shaderProgram && shaderProgram.loaded && shaderProgram !== this.currentShaderProgram) {
            let oldAttribs = 0,
                newAttribs = shaderProgram.attribs.size;

            if (this.currentShaderProgram) {
                oldAttribs = this.currentShaderProgram.attribs.size;
            }

            this.gl.useProgram(shaderProgram.webglResource);

            if (newAttribs > oldAttribs) {
                this.enableVertexAttribs(oldAttribs, newAttribs);
            } else if (newAttribs < oldAttribs) {
                this.disableVertexAttribs(newAttribs, oldAttribs);
            }

            this.currentShaderProgram = shaderProgram;
        }
    },

    /**
     * @method
     * @desc Bind a texture. Note: if the given texture is invalid (null or not loaded) then a 2x2 black texture will be bound instead to avoid WebGL errors.
     * @param {Texture} texture The texture to bind.
     * @param {number} unit The texture unit to bind to.
     */
    bindTexture(texture, unit) {
        const gl = this.gl;

        gl.activeTexture(gl.TEXTURE0 + unit);

        if (texture && texture.loaded) {
            gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
        } else {
            gl.bindTexture(gl.TEXTURE_2D, this.emptyTexture); // To avoid WebGL errors, bind an empty texture, in case an invalid one was given
        }
    }
};
