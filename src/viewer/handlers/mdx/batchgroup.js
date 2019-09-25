/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  /**
   * @param {ModelView} modelView
   * @param {?Array<Batch>} batches
   */
  constructor(modelView, batches) {
    /** @member {ModelView} */
    this.modelView = modelView;
    /** @member {Array<Batch>} */
    this.objects = [];

    if (batches) {
      this.objects.push(...batches);
    }
  }

  /**
   * @param {ModelViewData} modelViewData
   */
  render(modelViewData) {
    let model = this.modelView.model;
    let viewer = model.viewer;
    let batches = this.objects;
    let scene = modelViewData.scene;
    let buckets = modelViewData.buckets;
    let shader = viewer.shaderMap.get('MdxStandardShader');

    viewer.webgl.useShaderProgram(shader);

    for (let i = 0, l = modelViewData.usedBuckets; i < l; i++) {
      model.renderBatches(buckets[i], scene, batches, shader);
    }
  }
}
