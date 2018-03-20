export default class ShaderProgram {
    /**
     * @param {WebGLRenderingContext} gl
     * @param {ShaderUnit} vertexShader
     * @param {ShaderUnit} fragmentShader
     */
    constructor(gl, vertexShader, fragmentShader) {
        let id = gl.createProgram(),
            uniforms = new Map(),
            attribs = new Map();

        /** @member {boolean} */
        this.loaded = false;
        /** @member {WebGLProgram} */
        this.webglResource = id;
        /** @member {Array<ShaderUnit>} */
        this.shaders = [vertexShader, fragmentShader];
        /** @member {Map<string, WebGLUniformLocation>} */
        this.uniforms = uniforms;
        /** @member {Map<string, number>} */
        this.attribs = attribs;

        gl.attachShader(id, vertexShader.webglResource);
        gl.attachShader(id, fragmentShader.webglResource);
        gl.linkProgram(id);

        if (gl.getProgramParameter(id, gl.LINK_STATUS)) {
            for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_UNIFORMS) ; i < l; i++) {
                let object = gl.getActiveUniform(id, i);

                if (object.size === 1) {
                    uniforms.set(object.name, gl.getUniformLocation(id, object.name));
                } else {
                    let base = object.name.substr(0, object.name.length - 3);

                    for (let index = 0; index < object.size; index++) {
                        let name = base + '[' + index + ']';

                        uniforms.set(name, gl.getUniformLocation(id, name));
                    }
                }
            }

            for (let i = 0, l = gl.getProgramParameter(id, gl.ACTIVE_ATTRIBUTES) ; i < l; i++) {
                let object = gl.getActiveAttrib(id, i);

                if (object.size === 1) {
                    attribs.set(object.name, gl.getAttribLocation(id, object.name));
                } else {
                    let base = object.name.substr(0, object.name.length - 3);

                    for (let index = 0; index < object.size; index++) {
                        let name = base + '[' + index + ']';

                        attribs.set(name, gl.getAttribLocation(id, name));
                    }
                }
            }
            
            this.loaded = true;
        } else {
            console.error('Shader program failed to link!');
            console.error(gl.getProgramInfoLog(id));
        }
    }
};
