function WebGL(canvas) {
    let gl;

    for (let identifier of ["webgl", "experimental-webgl"]) {
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
        throw "WebGL: Failed to create a WebGL context!";
    }

    const extensions = {
        compressedTextureS3TC: gl.getExtension("WEBGL_compressed_texture_s3tc"),
        instancedArrays: gl.getExtension("ANGLE_instanced_arrays"),
        drawBuffers: gl.getExtension("WEBGL_draw_buffers"),
        elementIndexUint: gl.getExtension("OES_element_index_uint")
    };

    if (!gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS)) {
        throw "WebGL: No vertex shader texture support!";
    }

    if (!gl.getExtension("OES_texture_float")) {
        throw "WebGL: No floating point texture support!";
    }

    if (!extensions.compressedTextureS3TC) {
        console.warn("WebGL: No compressed textures support! This might reduce performance.");
    }

    gl.extensions = extensions;

    // The only initial setup required, the rest should be handled by the handelrs
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.DEPTH_TEST);

    this.gl = gl;
    this.extensions = extensions;
    this.shaderUnits = new Map();
    this.shaderPrograms = new Map();
    this.currentShaderProgram = null;
    this.floatPrecision = "precision mediump float;\n";

    // An empty 2x2 texture that is used automatically when binding an invalid texture
    const emptyTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, emptyTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, new ImageData(2, 2));
    this.emptyTexture = emptyTexture;
}

WebGL.prototype = {
    createShaderUnit(src, type) {
        // TODO: Use an actual hash?
        const hash = src,
            shaderUnits = this.shaderUnits;

        if (!shaderUnits.has(hash)) {
            shaderUnits.set(hash, new ShaderUnit(this.gl, src, type, hash));
        }

        return shaderUnits.get(hash);
    },

    createShaderProgram(vertexSource, fragmentSource) {
        const gl = this.gl,
            vertexShader = this.createShaderUnit(vertexSource, gl.VERTEX_SHADER),
            fragmentShader = this.createShaderUnit(this.floatPrecision + fragmentSource, gl.FRAGMENT_SHADER),
            shaderPrograms = this.shaderPrograms;

        if (vertexShader.loaded && fragmentShader.loaded) {
            // TODO: Use an actual hash?
            let hash = vertexSource + fragmentSource;

            if (!shaderPrograms.has(hash)) {
                shaderPrograms.set(hash, new ShaderProgram(gl, vertexShader, fragmentShader));
            }

            let shaderProgram = shaderPrograms.get(hash);

            if (shaderProgram.loaded) {
                return shaderProgram;
            }
        }
    },

    createResizeableBuffer(size) {
        return new ResizeableBuffer(this.gl, size || 64); // Arbitrary size
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
