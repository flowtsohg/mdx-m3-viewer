/**
 * A bucket.
 */
export default class Bucket {
  /**
  * @param {ModelView} modelView
  */
  constructor(modelView) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {number} */
    this.count = 0;
  }

  /**
   * @param {ModelInstance} instance
   */
  renderInstance(instance) {
    throw new Error('Bucket.renderInstance must be overloaded');
  }

  /**
   *
   */
  updateBuffers() {
    throw new Error('Bucket.updateBuffers must be overloaded');
  }
}
