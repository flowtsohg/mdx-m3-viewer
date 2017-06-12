/**
 * @constructor
 * @param {WebGLRenderingContext} gl
 * @param {ShaderUnit} vertexShader
 * @param {ShaderUnit} fragmentShader
 */
function ShaderProgram(gl, vertexShader, fragmentShader) {
    let id = gl.createProgram(),
        uniforms = new Map(),
        attribs = new Map();

    /** @member {boolean} */
    this.loaded = false;
    /** @member {WebGLProgram} */
    this.webglResource = id;
    /** @member {ShaderUnit[]} */
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
        console.error("Shader program failed to link!");
        console.error(gl.getProgramInfoLog(id));
    }
}
