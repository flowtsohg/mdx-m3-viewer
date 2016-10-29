function GeometryModel(env, pathSolver) {
    Model.call(this, env, pathSolver);
}

GeometryModel.prototype = {
    get Handler() {
        return Geometry;
    },

    initialize(src) {
        const gl = this.env.gl;

        var geometry = src.geometry;
        var material = src.material;

        var vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry.vertices, gl.STATIC_DRAW);

        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, geometry.uvs, gl.STATIC_DRAW);

        var faceBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.faces, gl.STATIC_DRAW);

        var edgeBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, edgeBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, geometry.edges, gl.STATIC_DRAW);

        this.boundingRadius = geometry.boundingRadius;

        this.vertexArray = geometry.vertices;
        this.uvArray = geometry.uvs;
        this.faceArray = geometry.faces;
        this.edgeArray = geometry.edges;
        this.vertexBuffer = vertexBuffer;
        this.uvBuffer = uvBuffer;
        this.faceBuffer = faceBuffer;
        this.edgeBuffer = edgeBuffer;

        var bytesPerElement = geometry.faces.BYTES_PER_ELEMENT;

        if (bytesPerElement === 1) {
            this.faceIndexType = gl.UNSIGNED_BYTE;
        } else if (bytesPerElement === 2) {
            this.faceIndexType = gl.UNSIGNED_SHORT;
        } else {
            this.faceIndexType = gl.UNSIGNED_INT;
        }

        bytesPerElement = geometry.edges.BYTES_PER_ELEMENT;

        if (bytesPerElement === 1) {
            this.edgeIndexType = gl.UNSIGNED_BYTE;
        } else if (bytesPerElement === 2) {
            this.edgeIndexType = gl.UNSIGNED_SHORT;
        } else {
            this.edgeIndexType = gl.UNSIGNED_INT;
        }

        this.texture = material.texture;

        this.twoSided = material.twoSided || false;
        this.noDepthTest = material.noDepthSet || false;
        this.noDepthSet = material.noDepthSet || false;

        this.uvScale = material.uvScale || new Float32Array([1, 1]);
        this.uvOffset = material.uvOffset || new Float32Array(2);

        this.color = material.color || new Float32Array(3);
        this.edgeColor = material.edgeColor || new Float32Array([1, 1, 1]);

        this.renderMode = 0;

        if (material.renderMode > 0) {
            this.renderMode = material.renderMode;
        }

        this.isBGR = material.isBGR || false;
        this.isBlended = material.isBlended || false;

        this.alpha = material.alpha || 1;

        if (this.alpha < 1) {
            this.translucent = true;
        } else {
            this.opaque = true;
        }

        return true;
    },

    render(bucket) {
        const webgl = this.env.webgl,
            gl = this.env.gl,
            instancedArrays = webgl.extensions.instancedArrays,
            shader = Geometry.shader,
            uniforms = shader.uniforms,
            attribs = shader.attribs,
            instances = bucket.instances;

        webgl.useShaderProgram(shader);

        gl.uniformMatrix4fv(uniforms.get("u_mvp"), false, this.env.camera.worldProjectionMatrix);

        // Bone texture
        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, bucket.boneTexture);
        gl.uniform1i(uniforms.get("u_boneMap"), 15);
        gl.uniform1f(uniforms.get("u_vector_size"), bucket.vectorSize);
        gl.uniform1f(uniforms.get("u_matrix_size"), bucket.matrixSize);
        gl.uniform1f(uniforms.get("u_row_size"), bucket.rowSize);

        // Instanced IDs
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.instanceIdBuffer);
        gl.vertexAttribPointer(attribs.get("a_InstanceID"), 1, gl.UNSIGNED_SHORT, false, 2, 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get("a_InstanceID"), 1);

        // Vertices
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.vertexAttribPointer(attribs.get("a_position"), 3, gl.FLOAT, false, 12, 0);

        // UVs
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.vertexAttribPointer(attribs.get("a_uv"), 2, gl.FLOAT, false, 8, 0);

        // Colors
        gl.bindBuffer(gl.ARRAY_BUFFER, bucket.colorBuffer);
        gl.vertexAttribPointer(attribs.get("a_color"), 3, gl.UNSIGNED_BYTE, false, 3, 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get("a_color"), 1);

        if (this.twoSided) {
            gl.disable(gl.CULL_FACE);
        } else {
            gl.enable(gl.CULL_FACE);
        }

        if (this.noDepthTest) {
            gl.disable(gl.DEPTH_TEST);
        } else {
            gl.enable(gl.DEPTH_TEST);
        }

        if (this.noDepthSet) {
            gl.depthMask(0);
        } else {
            gl.depthMask(1);
        }

        if (this.isBlended) {
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } else {
            gl.disable(gl.BLEND);
        }

        gl.uniform1i(uniforms.get("u_texture"), 0);

        if (this.renderMode === 0 || this.renderMode === 2) {
            webgl.bindTexture(this.texture, 0);

            gl.uniform1f(uniforms.get("u_isEdge"), 0);
            gl.uniform2fv(uniforms.get("u_uvScale"), this.uvScale);
            gl.uniform2fv(uniforms.get("u_uvOffset"), this.uvOffset);
            gl.uniform1f(uniforms.get("u_isBGR"), this.isBGR);
            gl.uniform1f(uniforms.get("u_alphaMod"), this.alpha)

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);

            instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.faceArray.length, this.faceIndexType, 0, instances.length);
        }

        if (this.renderMode === 1 || this.renderMode === 2) {
            webgl.bindTexture(null, 0);

            gl.uniform1f(uniforms.get("u_isEdge"), 1);

            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);

            instancedArrays.drawElementsInstancedANGLE(gl.LINES, this.edgeArray.length, this.edgeIndexType, 0, instances.length);
        }

        /// Reset the attributes to play nice with other handlers
        instancedArrays.vertexAttribDivisorANGLE(attribs.get("a_InstanceID"), 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.get("a_color"), 0);
    },

    renderOpaque(bucket) {
        if (this.opaque) {
            this.render(bucket);
        }
    },

    renderTranslucent(bucket) {
        if (this.translucent) {
            this.render(bucket);
        }
    },

    renderEmitters(bucket) {

    }
};

mix(GeometryModel.prototype, Model.prototype);
