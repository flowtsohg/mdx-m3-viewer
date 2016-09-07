function MdxBucket(modelView) {
    Bucket.call(this, modelView);

    const model = this.model;
    const env = model.env;
    const gl = env.gl;

    this.env = env;

    var numberOfBones = model.bones.length + 1;

    this.boneArrayInstanceSize = numberOfBones * 16;
    this.boneArray = new Float32Array(this.boneArrayInstanceSize * this.size);

    this.updateBoneTexture = new Uint8Array([1]);
    this.boneTexture = gl.createTexture();
    this.boneTextureWidth = numberOfBones * 4;
    this.boneTextureHeight = this.size;
    this.vectorSize = 1 / this.boneTextureWidth;
    this.matrixSize = 4 / this.boneTextureWidth;
    this.rowSize = 1 / this.boneTextureHeight;

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.boneTextureWidth, this.boneTextureHeight, 0, gl.RGBA, gl.FLOAT, null);

    // Team colors (per instance)
    this.updateTeamColors = new Uint8Array(1);
    this.teamColorArray = new Uint8Array(this.size);
    this.teamColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.teamColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.teamColorArray, gl.DYNAMIC_DRAW);

    // Tint color (per instance)
    this.updateTintColors = new Uint8Array(1);
    this.tintColorArray = new Uint8Array(3 * this.size).fill(255); // Tint color initialized to white
    this.tintColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.tintColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.tintColorArray, gl.DYNAMIC_DRAW);

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

    //var particles = 0;
    //var particleEmitters = model.particleEmitters2;

    //if (particleEmitters.length) {

    //    for (var i = 0, l = particleEmitters.length; i < l; i++) {
    //        var sd = particleEmitters[i].tracks.sd.KP2E;

    //        if (sd) {
    //            var tracks = sd.tracks;
    //            var biggestValue = 0;

    //            for (var i = 0, l = tracks.length; i < l; i++) {
    //                if (tracks[i].value > biggestValue) {
    //                    biggestValue = tracks[i].value;
    //                }
    //            }

    //            particles += Math.ceil(particleEmitters[i].lifespan * biggestValue);
    //        } else {
    //            particles += Math.ceil(particleEmitters[i].lifespan * particleEmitters[i].emissionRate);
    //        }

    //    }



    //    this.blarg = new Float32Array(particles * 30 * 512);

    //    console.log(model.name, particles, this.blarg.byteLength / 1024 / 1024)
    //}
}

MdxBucket.prototype = {
    update() {
        const gl = this.env.gl,
            size = this.instances.length;

        this.updateBatches.fill(0);

        Bucket.prototype.update.call(this);

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

        if (this.updateTintColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.tintColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.tintColorArray.subarray(0, 3 * size));

            this.updateTintColors[0] = 0;
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
            bucket: this,
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize),
            geosetColorArrays: [],
            uvOffsetArrays: [],
            teamColorArray: new Uint8Array(this.teamColorArray.buffer, index, 1),
            tintColorArray: new Uint8Array(this.tintColorArray.buffer, 3 * index, 3),
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
