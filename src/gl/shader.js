/**
 * @class
 * @classdesc A wrapper around WebGL shader units.
 * @param {WebGLRenderingContext} gl The WebGL context.
 * @param {string} src The shader source.
 * @param {number} type The shader type.
 */
function ShaderUnit(gl, src, type) {
    let id = gl.createShader(type);

    /** @member {boolean} */
    this.loaded = false;
    /** @member {WebGLShader} */
    this.webglResource = id;
    /** @member {string} */
    this.src = src;
    /** @member {number} */
    this.shaderType = type;

    gl.shaderSource(id, src);
    gl.compileShader(id);

    if (gl.getShaderParameter(id, gl.COMPILE_STATUS)) {
        this.loaded = true;
    } else {
        let error = gl.getShaderInfoLog(id),
            lines = src.split("\n");

        console.log(error);

        let regex = /:(\d+):/g,
            lineNumber = regex.exec(error);

        while (lineNumber) {
            let integer = parseInt(lineNumber[1]);

            console.error(integer + ": " + lines[integer - 1]);

            lineNumber = regex.exec(error);
        }
    }
}

/**
 * @class
 * @classdesc A wrapper around WebGL shader programs.
 * @param {WebGLRenderingContext} gl The WebGL context.
 * @param {ShaderUnit} vertexShader The vertex shader unit.
 * @param {ShaderUnit} fragmentShader The fragment shader unit.
 */
function ShaderProgram(gl, vertexShader, fragmentShader) {
    let id = gl.createProgram(),
        uniforms = new Map(),
        attribs = new Map();

    /** @member {boolean} */
    this.loaded = false;
    /** @member {WebGLProgram} */
    this.webglResource = id;
    /** @member {array} */
    this.shaders = [vertexShader, fragmentShader];
    /** @member {map.<string, WebGLUniformLocation>} */
    this.uniforms = uniforms;
    /** @member {map.<string, number>} */
    this.attribs = attribs;

    gl.attachShader(id, vertexShader.webglResource);
    gl.attachShader(id, fragmentShader.webglResource);
    gl.linkProgram(id);

    if (gl.getProgramParameter(id, gl.LINK_STATUS)) {
        for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_UNIFORMS) ; i < l; i++) {
            let object = gl.getActiveUniform(id, i),
                location = gl.getUniformLocation(id, object.name);

            uniforms.set(object.name, location);

            // Basic support for arrays
            if (object.name.endsWith("[0]")) {
                let base = object.name.substr(0, object.name.length - 3),
                    index = 1,
                    name = base + "[" + index + "]",
                    location = gl.getUniformLocation(id, name);

                while (location) {
                    uniforms.set(name, location);

                    index += 1;
                    name = base + "[" + index + "]",
                    location = gl.getUniformLocation(id, name);
                }
            }
        }

        for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_ATTRIBUTES) ; i < l; i++) {
            let object = gl.getActiveAttrib(id, i),
                location = gl.getAttribLocation(id, object.name);

            attribs.set(object.name, location);

            // Basic support for arrays
            if (object.name.endsWith("[0]")) {
                let base = object.name.substr(0, object.name.length - 3),
                    index = 1,
                    name = base + "[" + index + "]",
                    location = gl.getAttribLocation(id, name);

                while (location) {
                    attribs.set(name, location);

                    index += 1;
                    name = base + "[" + index + "]",
                    location = gl.getAttribLocation(id, name);
                }
            }
        }
           
        this.loaded = true;
    } else {
        console.warn(gl.getProgramInfoLog(id));
    }
}
