Mdx.WebGLSkeleton = function (numberOfBones, ctx) {
    this.ctx = ctx;
    this.boneTexture = ctx.createTexture();
    this.boneTextureSize = Math.max(2, Math.powerOfTwo(numberOfBones)) * 4;
    this.vectorFraction = 1 / this.boneTextureSize;
    this.matrixFraction = 4 / this.boneTextureSize;
    //this.boneBuffer = new Float32Array(numberOfBones * 16 + 16);

    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
};

Mdx.WebGLSkeleton.prototype = {
    updateTexture: function (boneBuffer) {
        var ctx = this.ctx;

        ctx.activeTexture(ctx.TEXTURE15);
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, boneBuffer.length / 4, 1, ctx.RGBA, ctx.FLOAT, boneBuffer);

        //this.boneBuffer = boneBuffer;
    },

    bind: function (shader) {
        var ctx = this.ctx;

        ctx.activeTexture(ctx.TEXTURE15);
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);

        ctx.uniform1i(shader.variables.u_boneMap, 15);
        ctx.uniform1f(shader.variables.u_matrix_size, this.matrixFraction);
        ctx.uniform1f(shader.variables.u_vector_size, this.vectorFraction);
    }
};
