import TexturedModelView from '../../texturedmodelview';

export default class ModelView extends TexturedModelView {
    update(scene) {
        let data = super.update(scene);

        if (data) {
            let batchCount = (this.model.renderMode === 2 ? 2 : 1),
                renderedInstances = 0,
                renderedBuckets = 0,
                renderCalls = 0;

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
};
