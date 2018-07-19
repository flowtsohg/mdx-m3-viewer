/**
 * A bucket.
 */
export default class Bucket {
  /**
  * @param {ModelView} modelView
  */
  constructor(modelView) {
    let model = modelView.model;
    let gl = model.viewer.gl;

    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Model} */
    this.model = model;
    /** @member {number} */
    this.count = 0;

    // The index buffer is used instead of gl_InstanceID, which isn't defined in WebGL shaders.
    // It's a simple buffer of indices, [0, 1, ..., this.size - 1].
    // While it can be shared between all buckets in the viewer, this makes the code slightly messy and less dynamic.
    // It's 256 bytes per bucket, no big deal. Right?
    this.instanceIdBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceIdBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint16Array(model.batchSize).map((currentValue, index, array) => index), gl.STATIC_DRAW);
  }

  /**
   * Fills in data from a collection of model instances.
   *
   * @param {Object} data
   * @param {number} baseInstance
   * @param {Scene} scene
   * @return {number}
   */
  fill(data, baseInstance, scene) {
    // Make believe the bucket is now filled with data for all instances.
    // This is because if a non-specific bucket implementation is supplied, instancing isn't used, so batching is irrelevant.
    return data.instances.length;
  }
}
