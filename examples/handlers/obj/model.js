function ObjModel(env, pathSolver) {
    // Run the base Model constructor.
    Model.call(this, env, pathSolver);
}

ObjModel.prototype = {
    // Point back to this implementation's handler.
    get Handler() {
        return Obj;
    },

    // Called when the model finishes loading.
    // src is either a string, or an ArrayBuffer, depending on the handler's binaryFormat getter (default to false, where src is a string).
    initialize(src) {
        const lines = src.split("\n"),
            vertices = [],
            faces = [];

        for (let i = 0, l = lines.length; i < l; i++) {
            // Strip comments
            let line = lines[i].split("#")[0];

            // Skip empty lines
            if (line !== "") {
                // Try to match a vertex: v <real> <real> <real>
                let match = line.match(/v\s+([\d.\-+]+)\s+([\d.\-+]+)\s+([\d.\-+]+)/);

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

        // gl is the WebGLRenderingContext object used by the viewer.
        const gl = this.gl,
            vertexArray = new Float32Array(vertices),
            faceArray = new Uint16Array(faces);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertexArray , gl.STATIC_DRAW);

        const faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceArray, gl.STATIC_DRAW);

        this.vertexBuffer = vertexBuffer;
        this.faceBuffer = faceBuffer;
        this.elements = faces.length;

        // Report that this model was loaded properly.
        return true;
    },

    // Called every frame, render opaque stuff here.
    renderOpaque(bucket) {
        const webgl = this.env.webgl,
            gl = this.env.gl,
            instancedArrays = webgl.extensions.instancedArrays,
            shader = Obj.shader,
            uniforms = shader.uniforms,
            attribs = shader.attribs,
            instances = bucket.instances;


        webgl.useShaderProgram(shader);

        gl.uniformMatrix4fv(uniforms.get("u_mvp"), false, this.env.camera.worldProjectionMatrix);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(attribs.get("a_position"), 3, gl.FLOAT, false, 12, 0);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);

        // Now let's render each instance.
        for (let i = 0, l = instances.length; i < l; i++) {
            // Use the color!
            gl.uniform3fv(uniforms.get("u_color"), instances[i].color);

            // And send the instance's world matrix, so it can be moved
            gl.uniformMatrix4fv(uniforms.get("u_transform"), false, instances[i].worldMatrix);

            gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, 0);
        }
    },

    // Called every frame, render stuff with alpha translucency here.
    renderTranslucent(bucket) {

    },

    // Called every frame, render any kind of particle emitter here.
    renderEmitters(bucket) {

    }
};

// Inherit from Model.
mix(ObjModel.prototype, Model.prototype);
