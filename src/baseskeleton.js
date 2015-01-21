/**
 * Creates a new BaseSkeleton.
 *
 * @class A skeleton.
 * @name BaseSkeleton
 * @param {number} numberOfBones
 * @param {WebGLRenderingContext} ctx
 * @property {BaseNode} rootNode
 * @property {Float32Array} hwbones
 * @property {WebGLTexture} boneTexture
 * @property {number} boneTextureSize
 * @property {number} texelFraction
 * @property {number} matrixFraction
 */
window["BaseSkeleton"] = function (numberOfBones, ctx) {
    this.rootNode = new BaseNode();
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
  /**
    * Gets either the root node of this skeleton, or one of the nodes in its node list.
    *
    * @param {number} node The node to return. If -1, will return the root node.
    * @returns {BaseNode} The node.
    */
    getNode: function (node) {
        if (node === -1) {
            return this.rootNode;
        }
        
        return this.nodes[node];
    },
  
  /**
    * Updates the bone texture with the current state.
    *
    * @param {WebGLRenderingContext} ctx The WebGL context.
    */
    updateBoneTexture: function (ctx) {
        ctx.activeTexture(ctx.TEXTURE15);
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);
        ctx.texSubImage2D(ctx.TEXTURE_2D, 0, 0, 0, this.hwbones.length / 4, 1, ctx.RGBA, ctx.FLOAT, this.hwbones);
    },
  
  /**
    * Binds the skeleton bone texture and parameters.
    *
    * @param {GL.Shader} shader The active shader.
    * @param {WebGLRenderingContext} ctx The WebGL context.
    */
    bind: function (shader, ctx) {
        ctx.activeTexture(ctx.TEXTURE15);
        ctx.bindTexture(ctx.TEXTURE_2D, this.boneTexture);

        ctx.uniform1i(shader.variables.u_boneMap, 15);
        ctx.uniform1f(shader.variables.u_matrix_size, this.matrixFraction);
        ctx.uniform1f(shader.variables.u_texel_size, this.texelFraction);
    }
};