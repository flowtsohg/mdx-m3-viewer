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
      let renderedInstances = 0;
      let renderedBuckets = 0;
      let renderCalls = 0;

      for (let bucket of data.buckets) {
        let count = bucket.count;

        if (count) {
          renderedInstances += count;
          renderedBuckets += 1;
          renderCalls += batchCount;
        }
      }

      this.renderedInstances = renderedInstances;
      this.renderedBuckets = renderedBuckets;
      this.renderCalls = renderCalls;
    }
  }
}
