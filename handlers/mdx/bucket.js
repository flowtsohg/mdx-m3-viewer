/**
 * @constructor
 * @augments Bucket
 * @memberOf Mdx
 * @param {MdxModelView} modelView
 */
function MdxBucket(modelView) {
    Bucket.call(this, modelView);

    let model = this.model,
        gl = model.env.gl,
        numberOfBones = model.bones.length + 1,
        objects;

    this.boneArrayInstanceSize = numberOfBones * 16;
    this.boneArray = new Float32Array(this.boneArrayInstanceSize * this.size);

    this.updateBoneTexture = new Uint8Array([1]);
    this.boneTexture = gl.createTexture();
    this.boneTextureWidth = numberOfBones * 4;
    this.boneTextureHeight = this.size;
    this.vectorSize = 1 / this.boneTextureWidth;
    this.rowSize = 1 / this.boneTextureHeight;

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.boneTextureWidth, this.boneTextureHeight, 0, gl.RGBA, gl.FLOAT, this.boneArray);

    // Team colors (per instance)
    this.updateTeamColors = new Uint8Array(1);
    this.teamColorArray = new Uint8Array(this.size);
    this.teamColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.teamColorArray, gl.DYNAMIC_DRAW);

    // Vertex color (per instance)
    this.updateVertexColors = new Uint8Array(1);
    this.vertexColorArray = new Uint8Array(4 * this.size).fill(255); // Vertex color initialized to white
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);

    // Batch visibility (per instance per batch)
    this.updateBatches = new Uint8Array(model.batches.length);
    this.batchVisibilityArrays = [];
    this.batchVisibilityBuffers = [];

    // Geoset colors (per instance per batch)
    // While the RGB color is per-geoset, the alpha is per-layer, so I'll just keep it per-batch meanwhile
    /// ------------------
    /// TODO: Split the RGB and A channels, this will allow far less writing
    /// -----------------
    this.geosetColorArrays = [];
    this.geosetColorBuffers = [];

    // Texture coordinate animations (per instance per layer)
    this.updateUvOffsets = new Uint8Array(1);
    this.uvOffsetArrays = [];
    this.uvOffsetBuffers = [];

    // Batches
    if (model.batches.length) {
        for (var i = 0, l = model.batches.length; i < l; i++) {
            this.batchVisibilityArrays[i] = new Uint8Array(this.size);
            this.batchVisibilityBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.batchVisibilityBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.batchVisibilityArrays[i], gl.DYNAMIC_DRAW);

            this.geosetColorArrays[i] = new Uint8Array(4 * this.size).fill(255); // Geoset colors are initialized to white
            this.geosetColorBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.geosetColorArrays[i], gl.DYNAMIC_DRAW);
        }

        for (var i = 0, l = model.layers.length; i < l; i++) {
            this.uvOffsetArrays[i] = new Float32Array(4 * this.size);
            this.uvOffsetBuffers[i] = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, this.uvOffsetBuffers[i]);
            gl.bufferData(gl.ARRAY_BUFFER, this.uvOffsetArrays[i], gl.DYNAMIC_DRAW);
        }
    }

    // Emitters
    this.particleEmitters = [];
    this.particleEmitters2 = [];
    this.eventObjectEmitters = [];
    this.ribbonEmitters = [];

    objects = model.particleEmitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.particleEmitters[i] = new MdxParticleEmitter(model, objects[i]);
    }

    objects = model.particleEmitters2;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.particleEmitters2[i] = new MdxParticleEmitter2(model, objects[i]);
    }

    objects = model.ribbonEmitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.ribbonEmitters[i] = new MdxRibbonEmitter(model, objects[i]);
    }

    objects = model.eventObjectEmitters;
    for (let i = 0, l = objects.length; i < l; i++) {
        this.eventObjectEmitters[i] = new MdxEventObjectEmitter(model, objects[i]);
    }
}

MdxBucket.prototype = {
    getRenderStats() {
        let model = this.model,
            instances = this.instances,
            renderedInstances = instances.length,
            renderCalls = 0,
            renderedVertices = 0,
            renderedPolygons = 0,
            objects;

        objects = model.batches;
        for (let i = 0, l = objects.length; i < l; i++) {
            let geoset = objects[i].geoset;

            renderCalls += 1;
            renderedVertices += (geoset.locationArray.length / 3) * renderedInstances;
            renderedPolygons += (geoset.faceArray.length / 3) * renderedInstances;
        }

        objects = this.particleEmitters2;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                renderCalls += 1;
                renderedVertices += active * 4;
                renderedPolygons += active * 2;
            }
        }

        objects = this.ribbonEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                renderCalls += emitter.layers.length;
                renderedVertices += active * 4;
                renderedPolygons += active * 2;
            }
        }

        objects = this.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            let emitter = objects[i],
                active = emitter.active.length;

            if (active > 0) {
                let type = emitter.type;

                if (type === "SPL" || type === "UBR") {
                    renderCalls += 1;
                    renderedVertices += active * 4;
                    renderedPolygons += active * 2;
                }
            }
        }
      
        return { renderedInstances, renderCalls, renderedVertices, renderedPolygons };
    },

    update(scene) {
        let gl = this.model.env.gl,
            size = this.instances.length,
            objects;

        //this.updateBatches.fill(0);

        objects = this.particleEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update();
        }

        objects = this.particleEmitters2;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update(scene);
        }

        objects = this.eventObjectEmitters;
        for (let i = 0, l = objects.length; i < l; i++) {
            objects[i].update(scene);
        }

        if (this.updateBoneTexture[0]) {
            gl.activeTexture(gl.TEXTURE15);
            gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, size, gl.RGBA, gl.FLOAT, this.boneArray);

            this.updateBoneTexture[0] = 0;
        }

        if (this.updateTeamColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.teamColorArray.subarray(0, size));

            this.updateTeamColors[0] = 0;
        }

        if (this.updateVertexColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexColorArray.subarray(0, 3 * size));

            this.updateVertexColors[0] = 0;
        }

        for (var i = 0, l = this.batchVisibilityArrays.length; i < l; i++) {
            //if (this.updateBatches[i]) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.batchVisibilityBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.batchVisibilityArrays[i].subarray(0, size));

                gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geosetColorArrays[i].subarray(0, 4 * size));
            //}
        }

        //console.log(this.batchVisibilityArrays)

        if (this.updateUvOffsets[0]) {
            for (var i = 0, l = this.uvOffsetArrays.length; i < l; i++) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.uvOffsetBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvOffsetArrays[i].subarray(0, 4 * size));
            }

            this.updateUvOffsets[0] = 0;
        }
    },

    getSharedData(index) {
        var data = {
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize),
            geosetColorArrays: [],
            uvOffsetArrays: [],
            teamColorArray: new Uint8Array(this.teamColorArray.buffer, index, 1),
            vertexColorArray: new Uint8Array(this.vertexColorArray.buffer, 4 * index, 4),
            batchVisibilityArrays: []
        };

        for (var i = 0, l = this.batchVisibilityArrays.length; i < l; i++) {
            data.batchVisibilityArrays[i] = new Uint8Array(this.batchVisibilityArrays[i].buffer, index, 1);
            data.geosetColorArrays[i] = new Uint8Array(this.geosetColorArrays[i].buffer, 4 * index, 4);
        }

        for (var i = 0, l = this.uvOffsetArrays.length; i < l; i++) {
            data.uvOffsetArrays[i] = new Float32Array(this.uvOffsetArrays[i].buffer, 4 * 4 * index, 4);
        }

        return data;
    }
};

mix(MdxBucket.prototype, Bucket.prototype);
