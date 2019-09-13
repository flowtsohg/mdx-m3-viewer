/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  /**
   * @param {ModelView} modelView
   */
  constructor(modelView) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Array<Batch>} */
    this.objects = [];
  }

  /**
   * @param {Object} data
   */
  render(data) {
    let model = this.modelView.model;
    let batches = this.objects;
    let scene = data.scene;
    let buckets = data.buckets;

    for (let i = 0, l = data.usedBuckets; i < l; i++) {
      model.renderBatches(buckets[i], scene, batches);
    }
  }
}
