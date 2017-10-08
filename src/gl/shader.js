/**
 * @constructor
 * @param {WebGLRenderingContext} gl
 * @param {string} src
 * @param {number} type
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
            lines = src.split('\n');

        console.error('Shader unit failed to compile!');
        console.error(error);

        let regex = /:(\d+):/g,
            lineNumber = regex.exec(error);

        while (lineNumber) {
            let integer = parseInt(lineNumber[1]);

            console.error(integer + ': ' + lines[integer - 1]);

            lineNumber = regex.exec(error);
        }
    }
}

export default ShaderUnit;
