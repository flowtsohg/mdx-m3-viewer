function OBJModel() {

}

OBJModel.prototype = Object.create(BaseModel.prototype);

OBJModel.prototype.loadstart = function (asyncModel, src, reportError, reportLoad) {
    BaseModel.call(this, {});

    this.asyncModel = asyncModel;

    // context.gl is of type GL and adds helper functionality around WebGL.
    this.setupShaders(asyncModel.context.gl);
    this.setup(src, asyncModel.context.gl);
};

OBJModel.prototype.setup = function (data, gl) {
    var lines = data.split("\n");
    var line;
    var match;

    var vertices = [];
    var faces = [];

    for (var i = 0, l = lines.length; i < l; i++) {
        // Strip comments
        line = lines[i].split("#")[0];

        // Skip empty lines
        if (line !== "") {
            // Try to match a vertex: v <real> <real> <real>
            match = line.match(/v\s+([\d.\-+]+)\s+([\d.\-+]+)\s+([\d.\-+]+)/);

            if (match) {
                vertices.push(parseFloat(match[1]), parseFloat(match[2]), parseFloat(match[3]));
            } else {
                // Try to match a face: f <integer> <integer> <integer>
                match = line.match(/f\s+([\d]+)\s+([\d]+)\s+([\d]+)/);

                if (match) {
                    // OBJ uses 1-based indexing, so we have to deduce 1
                    faces.push(parseInt(match[1]) - 1, parseInt(match[2]) - 1, parseInt(match[3]) - 1);
                }
            }
        }
    }

    // gl.ctx is the actual WebGLRenderingContext object.
    var ctx = gl.ctx;

    var vertexArray = new Float32Array(vertices);
    var elementArray = new Uint16Array(faces);

    var arrayBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, arrayBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, vertexArray , ctx.STATIC_DRAW);

    var elementBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, elementBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, elementArray, ctx.STATIC_DRAW);

    this.arrayBuffer = arrayBuffer;
    this.elementBuffer = elementBuffer;
    this.elements = faces.length;

    // Report that this model was loaded properly, otherwise it will be ignored
    reportLoad();
};

OBJModel.prototype.setupShaders = function (gl) {
    // Check if the OBJ shader was already compiled, if it wasn't, do it
    if (!gl.shaderStatus("obj")) {
        var vertexShader = "uniform mat4 u_mvp; attribute vec3 a_position; void main() { gl_Position = u_mvp * vec4(a_position, 1.0); }";
        var fragmentShader = "void main() { gl_FragColor = vec4(1.0); }";

        gl.createShader("obj", vertexShader, fragmentShader);
    }
};

// Note: instance refers to the OBJModelInstance that is getting rendered.
OBJModel.prototype.render = function () {
    var gl = this.asyncModel.context.gl;
    var ctx = gl.ctx;

    // A GL.Shader object.
    // Its most useful member is the variables member, that holds the positions of all the shader uniforms by names.
    var shader = gl.bindShader("obj");

    ctx.uniformMatrix4fv(shader.variables.u_mvp, false, gl.getViewProjectionMatrix());

    ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);
    ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, 0);

    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, 0);
}