/**
 * @class
 * @classdesc A geometry bucket.
 * @extends Bucket
 * @memberOf Geo
 * @param {GeometryModelView} modelView The model view that this bucket belongs to.
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
    this.matrixSize = 4 / this.boneTextureWidth;
    this.rowSize = 1 / this.boneTextureHeight;

    gl.activeTexture(gl.TEXTURE15);
    gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, this.boneTextureWidth, this.boneTextureHeight, 0, gl.RGBA, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    // Color (per instance)
    this.updateColors = new Uint8Array(1);
    this.colorArray = new Uint8Array(3 * this.size);
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.colorArray, gl.DYNAMIC_DRAW);

    // Edge color (per instance)
    this.updateEdgeColors = new Uint8Array(1);
    this.edgeColorArray = new Uint8Array(3 * this.size);
    this.edgeColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.edgeColorArray, gl.DYNAMIC_DRAW);
}

GeometryBucket.prototype = {
    update() {
        Bucket.prototype.update.call(this);

        const gl = this.env.gl,
            size = this.instances.length;

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, size, gl.RGBA, gl.FLOAT, this.boneArray);

        if (this.updateColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.colorArray.subarray(0, size * 3));

            this.updateColors[0] = 0;
        }

        if (this.updateEdgeColors[0]) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.edgeColorBuffer);
            gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.edgeColorArray.subarray(0, size * 3));

            this.updateEdgeColors[0] = 0;
        }
    },

    getSharedData(index) {
        return {
            bucket: this,
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize),
            colorArray: new Uint8Array(this.colorArray.buffer, 3 * index, 3),
            edgeColorArray: new Uint8Array(this.edgeColorArray.buffer, 3 * index, 3)
        };
    }
};

mix(GeometryBucket.prototype, Bucket.prototype);
