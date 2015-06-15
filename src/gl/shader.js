/**
 * @memberof GL
 * @class A wrapper around WebGL shader units.
 * @name ShaderUnit
 * @param {string} source The GLSL source.
 * @param {number} type The WebGL shader unit identifier - VERTEX_SHADER or FRAGMENT_SHADER.
 * @param {string} name The owning shader's name.
 * @property {string} source
 * @property {number} type
 * @property {WebGLShader} id
 * @property {boolean} ready
 */
function ShaderUnit(ctx, source, type, name) {
    var id = ctx.createShader(type);

    this.type = "shaderunit";
    this.source = source;
    this.shaderType = type;
    this.id = id;

    ctx.shaderSource(id, source);
    ctx.compileShader(id);

    if (ctx.getShaderParameter(id, ctx.COMPILE_STATUS)) {
        this.ready = true;
    } else {
        //console.warn("Failed to compile a shader:");
        console.warn(name, ctx.getShaderInfoLog(this.id));
        //console.warn(source);
        onerror(this, "Compile");
    }
}

/**
 * @memberof GL
 * @class A wrapper around WebGL shader programs.
 * @name Shader
 * @param {string} name The shader's name.
 * @param {GL.ShaderUnit} vertexUnit The vertex shader unit.
 * @param {GL.ShaderUnit} fragmentUnit The fragment shader unit.
 * @property {string} name
 * @property {GL.ShaderUnit} vertexUnit
 * @property {GL.ShaderUnit} fragmentUnit
 * @property {WebGLProgram} id
 * @property {object} variables
 * @property {number} attribs
 * @property {boolean} ready
 */
function Shader(ctx, name, vertexUnit, fragmentUnit) {
    var id = ctx.createProgram();

    this.type = "shader";
    this.name = name;
    this.vertexUnit = vertexUnit;
    this.fragmentUnit = fragmentUnit;
    this.id = id;

    ctx.attachShader(id, vertexUnit.id);
    ctx.attachShader(id, fragmentUnit.id);
    ctx.linkProgram(id);

    if (ctx.getProgramParameter(id, ctx.LINK_STATUS)) {
        this.getVariables(ctx);
        this.ready = true;
    } else {
        console.warn(name, ctx.getProgramInfoLog(this.id));
        onerror(this, "Link");
    }
}

Shader.prototype = {
    getVariables: function (ctx) {
        var id = this.id;
        var variables = {};
        var i, l, v, location;

        for (i = 0, l = ctx.getProgramParameter(id, ctx.ACTIVE_UNIFORMS); i < l; i++) {
            v = ctx.getActiveUniform(id, i);
            location = ctx.getUniformLocation(id, v.name);

            variables[v.name] = location;
        }

        l = ctx.getProgramParameter(id, ctx.ACTIVE_ATTRIBUTES);

        for (i = 0; i < l; i++) {
            v = ctx.getActiveAttrib(id, i);
            location = ctx.getAttribLocation(id, v.name);

            variables[v.name] = location;
        }

        this.variables = variables;
        this.attribs = l;
    }
};