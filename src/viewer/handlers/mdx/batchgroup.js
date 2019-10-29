/**
 * A group of batches that are going to be rendered together.
 */
export default class BatchGroup {
  /**
   * @param {Model} model
   * @param {?Array<number>} batches
   */
  constructor(model, batches) {
    /** @member {Model} */
    this.model = model;
    /** @member {Array<Batch>} */
    this.objects = [];

    if (batches) {
      this.objects.push(...batches);
    }
  }

  /**
   * @param {ModelInstance} instance
   */
  render(instance) {
    let model = this.model;
    let batches = model.batches;
    let viewer = model.viewer;
    let shader = viewer.shaderMap.get('MdxStandardShader');

    viewer.webgl.useShaderProgram(shader);

    for (let index of this.objects) {
      instance.renderBatch(batches[index], shader);
    }
  }
}
