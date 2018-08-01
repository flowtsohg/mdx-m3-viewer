import TexturedModelView from '../../texturedmodelview';

/**
 * GEO model view implementation.
 */
export default class ModelView extends TexturedModelView {
  /**
   * @param {Scene} scene
   */
  update(scene) {
    let data = super.update(scene);

    if (data) {
      let batchCount = (this.model.renderMode === 2 ? 2 : 1);
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
