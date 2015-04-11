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
    this.pivot = vec3.create();
    this.localMatrix = mat4.create();
    this.localLocation = vec3.create();
    this.localRotation = quat.create();
    this.worldMatrix = mat4.create();
    this.worldLocation = vec3.create();
    this.worldRotation = quat.create();
    this.scale = vec3.create();
    this.inverseScale = vec3.create();
}

BaseNode.prototype = {
  /**
   * Updates the node's world matrix and its scale values.
   *
   * @param {mat4} worldMatrix The new world matrix.
   */
    setFromParent: function (parent) {
        var selfScale = this.scale;
        
        mat4.copy(this.worldMatrix, parent.worldMatrix);
        mat4.decomposeScale(selfScale, parent.worldMatrix);
        vec3.inverse(this.inverseScale, selfScale);
        vec3.copy(this.worldLocation, parent.worldLocation);
        quat.copy(this.worldRotation, parent.worldRotation);
    },
  
  /**
   * Updates the node's scale values.
   */
    update: function (parent, rotation, translation, scale) {
        var localMatrix = this.localMatrix,
            worldMatrix = this.worldMatrix,
            worldLocation = this.worldLocation,
            selfScale = this.scale,
            pivot = this.pivot;
        
        // Local and world matrices
        mat4.fromRotationTranslationScaleOrigin(localMatrix, rotation, translation, scale, pivot);
        mat4.mul(worldMatrix, parent.worldMatrix, localMatrix);
        
        // Scale and inverse scale
        mat4.decomposeScale(selfScale, worldMatrix);
        vec3.inverse(this.inverseScale, selfScale);
        
        // Local location and rotation
        vec3.copy(this.localLocation, translation);
        quat.copy(this.localRotation, rotation);
        
        // World location
        vec3.copy(worldLocation, pivot);
        vec3.transformMat4(worldLocation, worldLocation, worldMatrix);
        
        // World rotation
        quat.mul(this.worldRotation, parent.worldRotation, rotation);
    }
};