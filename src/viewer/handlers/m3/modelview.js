import TexturedModelView from '../../texturedmodelview';

/**
 * An M3 model view.
 */
export default class ModelView extends TexturedModelView {
  /**
   * @param {Scene} scene
   */
  update(scene) {
    let data = super.update(scene);

    if (data) {
      let batchCount = this.model.batches.length;
      let buckets = data.buckets;
      let renderedInstances = 0;
      let renderedBuckets = 0;
      let renderCalls = 0;

      for (let i = 0, l = data.usedBuckets; i < l; i++) {
        renderedInstances += buckets[i].count;
        renderedBuckets += 1;
        renderCalls += batchCount;
      }

      this.renderedInstances = renderedInstances;
      this.renderedBuckets = renderedBuckets;
      this.renderCalls = renderCalls;
    }
  }
}
