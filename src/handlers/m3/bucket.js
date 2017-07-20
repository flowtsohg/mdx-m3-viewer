import { mix } from "../../common";
import Bucket from "../../bucket";

/**
 * @constructor
 * @extends Bucket
 * @memberOf M3
 * @param {TexturedModelView} modelView
 */
function M3Bucket(modelView) {
    Bucket.call(this, modelView);

    const model = this.model;
    const gl = model.gl;

    this.gl = gl;

    var numberOfBones = model.initialReference.length;
    
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

    for (var i = 0, l = model.batches.length; i < l; i++) {
        this.batchVisibilityArrays[i] = new Uint8Array(this.size);
        this.batchVisibilityBuffers[i] = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.batchVisibilityBuffers[i]);
        gl.bufferData(gl.ARRAY_BUFFER, this.batchVisibilityArrays[i], gl.DYNAMIC_DRAW);
    }
}

M3Bucket.prototype = {
    getRenderStats() {
        let model = this.model,
            calls = 0,
            instances = this.instances.length,
            vertices = 0,
            polygons = 0,
            objects = model.batches;

        for (let i = 0, l = objects.length; i < l; i++) {
            let region = objects[i].region;

            calls += 1;
            vertices += region.verticesCount;
            polygons += region.elements / 3;
        }

        return { calls, instances, vertices, polygons };
    },

    update(scene) {
        let gl = this.gl,
            size = this.instances.length;

        //this.updateBatches.fill(0);

        //if (this.updateBoneTexture[0]) {
            gl.activeTexture(gl.TEXTURE15);
            gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
            gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, size, gl.RGBA, gl.FLOAT, this.boneArray);
            //console.log(this.boneTextureWidth, size)

            //this.updateBoneTexture[0] = 0;
        //}

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
        /*
        for (var i = 0, l = this.batchVisibilityArrays.length; i < l; i++) {
            if (this.updateBatches[i]) {
                gl.bindBuffer(gl.ARRAY_BUFFER, this.batchVisibilityBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.batchVisibilityArrays[i].subarray(0, size));

                gl.bindBuffer(gl.ARRAY_BUFFER, this.geosetColorBuffers[i]);
                gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.geosetColorArrays[i].subarray(0, 4 * size));
            }
        }
        */
    },

    getSharedData(index) {
        var data = {
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize),
            teamColorArray: new Uint8Array(this.teamColorArray.buffer, index, 1),
            vertexColorArray: new Uint8Array(this.vertexColorArray.buffer, 4 * index, 4),
            batchVisibilityArrays: []
        };

        for (var i = 0, l = this.batchVisibilityArrays.length; i < l; i++) {
            data.batchVisibilityArrays[i] = new Uint8Array(this.batchVisibilityArrays[i].buffer, index, 1);
        }

        return data;
    }
};

mix(M3Bucket.prototype, Bucket.prototype);

export default M3Bucket;
