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
   * @param {ModelViewData} modelViewData
   */
  render(modelViewData) {
    let model = this.modelView.model;
    let batches = this.objects;
    let scene = modelViewData.scene;
    let buckets = modelViewData.buckets;

    for (let i = 0, l = modelViewData.usedBuckets; i < l; i++) {
      model.renderBatches(buckets[i], scene, batches);
    }
  }
}
