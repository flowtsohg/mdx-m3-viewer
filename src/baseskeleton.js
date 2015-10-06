window["BaseSkeleton"] = function (numberOfBones, ctx) {
    /// <field name="rootNode" type="Node"></param>
    /// <field name="nodes" type="array"></param>
    /// <field name="hwbones" type="Float32Array"></param>
    /// <field name="boneTexture" type="WebGLTexture"></param>
    /// <field name="boneTextureSize" type="number"></param>
    /// <field name="texelFraction" type="number"></param>
    /// <field name="matrixFraction" type="number"></param>
    this.rootNode = new Node();
    this.nodes = [];
    this.hwbones = new Float32Array(16 * numberOfBones);
    this.boneTexture = ctx.createTexture();
    this.boneTextureSize = Math.max(2, Math.powerOfTwo(numberOfBones)) * 4;
    this.texelFraction = 1 / this.boneTextureSize;
    this.matrixFraction = this.texelFraction * 4;

    ctx.activeTexture(ctx.TEXTURE15);
    ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
    ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, this.boneTextureSize, 1, 0, ctx.RGBA, ctx.FLOAT, null);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST);
    ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST);
}

BaseSkeleton.prototype = {
    getNode: function (node) {
        if (node === -1) {
            return this.rootNode;
        }
        
        return this.nodes[node];
    },

    updateBoneTexture: function (ctx) {
        ctx.activeTexture(ctx.TEXTURE15);
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, this.hwbones.length / 4, 1, ctx.RGBA, ctx.FLOAT, this.hwbones);
    },

    bind: function (shader, ctx) {
        ctx.activeTexture(ctx.TEXTURE15);
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);

        ctx.uniform1i(shader.variables.u_boneMap, 15);
        ctx.uniform1f(shader.variables.u_matrix_size, this.matrixFraction);
        ctx.uniform1f(shader.variables.u_texel_size, this.texelFraction);
    }
};