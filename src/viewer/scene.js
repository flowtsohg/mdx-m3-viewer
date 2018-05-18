import { vec3 } from 'gl-matrix';
import Camera from './camera';
import { SceneNode } from './node';

// Heap allocations needed for this module.
let ndcHeap = new Float32Array(3);

export default class Scene {
    constructor(viewer) {
        /** @member {ModelViewer.viewer.ModelViewer} */
        this.viewer = viewer;
        /** @member {ModelViewer.viewer.Camera} */
        this.camera = new Camera();
        /** @member {Array<ModelViewer.viewer.ModelInstance>} */
        this.instances = [];
        /** @member {Set<ModelViewer.viewer.ModelInstance>} */
        this.instanceSet = new Set();
        /** @member {Array<ModelViewer.viewer.ModelView>} */
        this.modelViews = [];
        /** @member {Set<ModelViewer.viewer.ModelView>} */
        this.modelViewSet = new Set();
        /** @member {ModelViewer.viewer.SceneNode} */
        this.node = new SceneNode();
        /** @member {boolean} */
        this.rendered = true;

        /** @member {number} */
        this.renderedInstances = 0;
        /** @member {number} */
        this.renderedParticles = 0;
        /** @member {number} */
        this.renderedBuckets = 0;
        /** @member {number} */
        this.renderCalls = 0;

        /**
         * If this scene is going to use sounds, call enableAudio().
         * 
         * @member {?AudioContext}
         */
        this.audioContext = null;

        this.node.recalculateTransformation();
        this.camera.setParent(this.node);
    }

    /**
     * Creates an AudioContext if one wasn't created already, and resumes it if needed.
     * The returned promise will resolve to whether it is actually running or not.
     * It may stay in suspended state indefinitly until the client interact with the page, due to browser policies.
     * 
     * @returns {Promise}
     */
    async enableAudio() {
        if (!this.audioContext) {
            this.audioContext = new AudioContext();
        }

        if (this.audioContext.state !== 'suspended') {
            await this.audioContext.resume();
        }

        return this.audioContext.state === 'running';
    }

    /**
     * Sets the scene of the given instance.
     * This is equivalent to instance.setScene(scene).
     * 
     * @param {ModelViewer.viewer.ModelInstance} instance 
     * @returns {boolean} 
     */
    addInstance(instance) {
        let instanceSet = this.instanceSet;

        if (!instanceSet.has(instance)) {
            instanceSet.add(instance);
            this.instances.push(instance);

            if (instance.scene) {
                instance.scene.removeInstance(instance);
            }

            instance.modelView.sceneChanged(instance, this);
            instance.scene = this;

            if (!instance.parent) {
                instance.setParent(this.node);
            }

            this.addView(instance.modelView);

            return true;
        }

        return false;
    }

    // Add a model view to this scene if it wasn't added previously.
    addView(modelView) {
        let modelViewSet = this.modelViewSet;

        if (!modelViewSet.has(modelView)) {
            modelViewSet.add(modelView);
            this.modelViews.push(modelView);
        }
    }

    /**
     * Remove an instance from this scene.
     * 
     * @param {ModelInstance} instance The instance to remove.
     */
    removeInstance(instance) {
        if (this.instanceSet.delete(instance)) {
            let instances = this.instances;
            instances.splice(instances.indexOf(instance), 1);

            instance.modelView.sceneChanged(instance, null);
            instance.scene = null;

            return true;
        }

        return false;
    }

    /**
     * Removes all of the buckets in this scene.
     */
    clear() {
        this.instances.length = 0;
        this.instanceSet.clear();
        this.modelViews.length = 0;
        this.modelViewSet.clear();
    }

    /**
     * Detach this scene from the viewer.
     */
    detach() {
        if (this.viewer) {
            return this.viewer.removeScene(this);
        }

        return false;
    }

    update() {
        if (this.rendered) {
            // Update all of the nodes, instances, etc.
            this.node.updateChildren(this);

            this.renderedInstances = 0;
            this.renderedParticles = 0;
            this.renderedBuckets = 0;
            this.renderCalls = 0;

            // Update the rendering data
            for (let modelView of this.modelViews) {
                modelView.update(this);

                this.renderedInstances += modelView.renderedInstances;
                this.renderedParticles += modelView.renderedParticles;
                this.renderedBuckets += modelView.renderedBuckets;
                this.renderCalls += modelView.renderCalls;
            }

            if (this.audioContext) {
                let [x, y, z] = this.camera.worldLocation;

                this.audioContext.listener.setPosition(-x, -y, -z);
            }
        }
    }

    isVisible(instance) {
        let model = instance.model,
            bounds = model.bounds;

        // If the model has a bounding sphere in it, do a sphere test.
        // Otherwise do a point test.
        if (bounds) {
            let center = bounds.center,
                location = instance.worldLocation;

            ndcHeap[0] = location[0] + center[0];
            ndcHeap[1] = location[1] + center[1];
            ndcHeap[2] = location[2] + center[2];

            return this.camera.frustum.testSphere(ndcHeap, bounds.radius);
        } else {
            let worldProjectionMatrix = this.camera.worldProjectionMatrix;

            // This test checks whether the instance's position is visible in NDC space. In other words, that it lies in [-1, 1] on all axes
            vec3.transformMat4(ndcHeap, instance.worldLocation, worldProjectionMatrix);
            if (ndcHeap[0] >= -1 && ndcHeap[0] <= 1 && ndcHeap[1] >= -1 && ndcHeap[1] <= 1 && ndcHeap[2] >= -1 && ndcHeap[2] <= 1) {
                return true;
            }

            return false;
        }
    }

    renderOpaque() {
        if (this.rendered) {
            this.setViewport(this.viewer.gl);

            for (let modelView of this.modelViews) {
                modelView.renderOpaque(this);
            }
        }
    }

    renderTranslucent() {
        if (this.rendered) {
            this.setViewport(this.viewer.gl);

            for (let modelView of this.modelViews) {
                modelView.renderTranslucent(this);
            }
        }
    }

    setViewport() {
        let viewport = this.camera.viewport;

        this.viewer.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
};
