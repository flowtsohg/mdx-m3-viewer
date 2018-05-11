export default class ModelView {
    /**
     * @param {ModelViewer.viewer.Model} model
     */
    constructor(model) {
        /** @member {ModelViewer.viewer.Model} */
        this.model = model;

        this.instanceSet = new Set();
        this.sceneData = new Map();

        this.renderedInstances = 0;
        this.renderedParticles = 0;
        this.renderedBuckets = 0;
        this.renderCalls = 0;
    }

    // Get a shallow copy of this view
    getShallowCopy() {

    }

    // Given a shallow copy, copy its contents to this view
    applyShallowCopy(view) {

    }

    // Given another view or shallow view, determine whether they have equal values or not
    equals(view) {
        return true;
    }

    // Called when the model loads
    lateLoad() {
        for (let instance of this.instanceSet) {
            this.addSceneData(instance, instance.scene);
        }
    }

    addSceneData(instance, scene) {
        if (this.model.loaded && scene) {
            let sceneData = this.sceneData,
                data = sceneData.get(scene);

            if (!data) {
                data = this.createSceneData();

                sceneData.set(scene, data);
            }

            data.instances.push(instance);
        }
    }

    addInstance(instance) {
        let instanceSet = this.instanceSet;

        if (!instanceSet.has(instance)) {
            // If the instance is already in another view, remove it first.
            // This is always true, except when the instance is created and added to its first view.
            let modelView = instance.modelView;
            if (modelView) {
                modelView.removeInstance(instance);
            }

            // Add the instance
            instanceSet.add(instance);
            instance.modelView = this;

            this.addSceneData(instance, instance.scene);

            return true;
        }

        return false;
    }

    createSceneData() {
        return {
            instances: [],
            buckets: []
        };
    }

    removeInstance(instance) {
        let instanceSet = this.instanceSet;

        if (instanceSet.delete(instance)) {
            let sceneData = this.sceneData,
                scene = instance.scene;

            if (scene) {
                let data = sceneData.get(scene),
                    instances = data.instances,
                    buckets = data.buckets;

                // Remove the instance from its scene data.
                instances.splice(instances.indexOf(instance), 1);

                // See how many buckets are needed to hold all of the instances.
                let neededBuckets = Math.ceil(instances.length / this.model.batchSize);
                
                // If there are more buckets than are needed, remove them.
                if (neededBuckets < buckets.length) {
                    buckets.length = neededBuckets;
                }
            }

            instance.modelView = null;

            // If this view has no instances, ask the model to remove it.
            if (instanceSet.size === 0) {
                /// TODO: THIS NEEDS TO ALSO UPDATE ALL SCENES???
                this.model.removeView(this);
            }

            return true;
        }

        return false;
    }

    // Called every time an instance changes its scene via scene.addInstance(instance) or instance.setScene(scene).
    sceneChanged(instance, scene) {
        if (this.model.loaded) {
            let sceneData = this.sceneData,
                oldScene = instance.scene;

            if (oldScene) {
                let data = sceneData.get(oldScene),
                    instances = data.instances,
                    buckets = data.buckets;

                // Remove the instance from its scene data.
                instances.splice(instances.indexOf(instance), 1);

                // See how many buckets are needed to hold all of the instances.
                let neededBuckets = Math.ceil(instances.length / this.model.batchSize);
                
                // If there are more buckets than are needed, remove them.
                if (neededBuckets < buckets.length) {
                    buckets.length = neededBuckets;
                }
            }

            if (scene) {
                this.addSceneData(instance, scene);
            }
        }
    }

    clear() {

    }

    detach() {
        if (this.model) {
            this.model.removeView(this);
            this.model = null;

            return true;
        }

        return false;
    }

    update(scene) {
        if (this.model.loaded) {
            let data = this.sceneData.get(scene);

            if (data) {
                let instances = data.instances,
                    buckets = data.buckets,
                    bucketIndex = 0,
                    offset = 0,
                    count = instances.length;

                while (offset < count) {
                    let bucket = buckets[bucketIndex];

                    if (!bucket) {
                        bucket = new this.model.handler.bucket(this);

                        buckets[bucketIndex] = bucket;
                    }

                    bucketIndex += 1;

                    offset = bucket.fill(data, offset, scene);
                }

                return data;
            }
        }
    }

    renderOpaque(scene) {
        let data = this.sceneData.get(scene);

        if (data) {
            this.model.renderOpaque(data, scene, this);
        }
    }

    renderTranslucent(scene) {
        let data = this.sceneData.get(scene);

        if (data) {
            this.model.renderTranslucent(data, scene, this);
        }
    }
};
