/**
 * Creates a new BaseNode.
 *
 * @class A node.
 * @name BaseNode
 * @property {mat4} worldMatrix
 * @property {vec3} scale
 * @property {vec3} inverseScale
 * @property {mat4} externalWorldMatrix
 */
window["BaseNode"] = function () {
    this.worldMatrix = mat4.create();
    this.scale = vec3.create();
    this.inverseScale = vec3.create();
    this.externalWorldMatrix = mat4.create();
}

BaseNode.prototype = {
  /**
   * Updates the node's world matrix and its scale values.
   *
   * @param {mat4} worldMatrix The new world matrix.
   */
    update: function (worldMatrix) {
        mat4.copy(this.worldMatrix, worldMatrix);
        mat4.decomposeScale(this.scale, this.worldMatrix);
        vec3.inverse(this.inverseScale, this.scale);
    },
  
  /**
   * Updates the node's scale values.
   */
    updateScale: function () {
        mat4.decomposeScale(this.scale, this.worldMatrix);
        vec3.inverse(this.inverseScale, this.scale);
    },
  
  /**
   * Returns a copy of the node's world matrix.
   *
   * @returns {mat4} The world matrix.
   */
    getTransformation: function () {
        return mat4.copy(this.externalWorldMatrix, this.worldMatrix);
    }
};