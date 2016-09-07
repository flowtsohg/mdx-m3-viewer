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
}

GeometryBucket.prototype = {
    update() {
        Bucket.prototype.update.call(this);

        const gl = this.env.gl,
            size = this.instances.length;

        gl.activeTexture(gl.TEXTURE15);
        gl.bindTexture(gl.TEXTURE_2D, this.boneTexture);
        gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, this.boneTextureWidth, size, gl.RGBA, gl.FLOAT, this.boneArray);
    },

    getSharedData(index) {
        return {
            boneArray: new Float32Array(this.boneArray.buffer, this.boneArrayInstanceSize * 4 * index, this.boneArrayInstanceSize)
        };
    }
};

mix(GeometryBucket.prototype, Bucket.prototype);
