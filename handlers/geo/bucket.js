import Bucket from "../../src/bucket";
import { mix } from "../../src/common";

/**
 * @constructor
 * @extends Bucket
 * @memberOf Geo
 * @param {GeometryModelView} modelView
 */
function GeometryBucket(modelView) {
    Bucket.call(this, modelView);

    const env = this.model.env;
    const gl = env.gl;
    const numberOfBones = 1;

    this.env = env;

    this.boneArrayInstanceSize = numberOfBones * 16;

    this.boneArray = new Float32Array(this.boneArrayInstanceSize * this.size);

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

    // Color (per instance)
    this.updateVertexColors = new Uint8Array(1);
    this.vertexColorArray = new Uint8Array(4 * this.size);
    this.vertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertexColorArray, gl.DYNAMIC_DRAW);

    // Edge color (per instance)
    this.updateEdgeColors = new Uint8Array(1);
    this.edgeColorArray = new Uint8Array(3 * this.size);
    this.edgeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.edgeColorArray, gl.DYNAMIC_DRAW);
}

GeometryBucket.prototype = {
    getRenderStats() {
        let model = this.model,
            renderMode = model.renderMode,
            calls = (model.renderMode === 2 ? 2 : 1),
            instances = this.instances.length,
            vertices = (model.vertexArray.length / 3) * instances,
            polygons = 0;

        // Add faces
        if (renderMode === 0 || renderMode === 2) {
            polygons += (model.faceArray.length / 3) * instances;
        }

        // Add edges
        if (renderMode === 1 || renderMode === 2) {
            polygons += (model.edgeArray.length / 2) * instances;
        }

        return { calls, instances, vertices, polygons };
    },

    update(scene) {
        let gl = this.env.gl,
            size = this.instances.length;

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, size, gl.RGBA, gl.FLOAT, this.boneArray);

        if (this.updateVertexColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexColorArray.subarray(0, size * 4));

            this.updateVertexColors[0] = 0;
        }

        if (this.updateEdgeColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.edgeColorArray.subarray(0, size * 4));

            this.updateEdgeColors[0] = 0;
        }
    },

    getSharedData(index) {
        return {
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize),
            vertexColorArray: new Uint8Array(this.vertexColorArray.buffer, 4 * index, 4),
            edgeColorArray: new Uint8Array(this.edgeColorArray.buffer, 4 * index, 4)
        };
    }
};

mix(GeometryBucket.prototype, Bucket.prototype);

export default GeometryBucket;
