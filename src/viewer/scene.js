import { vec3 } from 'gl-matrix';
import Camera from './camera';
import { NotifiedSceneNode } from './node';

// Heap allocations needed for this module.
let ndcHeap = new Float32Array(3);

export default class Scene {
    constructor() {
        /** @member {ModelViewer} */
        this.env = null;
        /** @member {Camera} */
        this.camera = new Camera();
        /** @member {Array<ModelInstance>} */
        this.instances = [];
        /** @member {Set<ModelInstance>} */
        this.instanceSet = new Set();
        /** @member {Array<Bucket>} */
        this.buckets = [];
        /** @member {Set<Bucket>} */
        this.bucketSet = new Set();
        /** @member {NotifiedSceneNode} */
        this.root = new NotifiedSceneNode();

        this.bucketsToAdd = [];
        this.bucketsToRemove = [];
    }

    /** @member {string} */
    get objectType() {
        return 'scene';
    }

    /**
     * Get the rendering statistics of this scene.
     * This includes the following:
     *     buckets
     *     calls
     *     instances
     *     vertices
     *     polygons
     *     dynamicVertices
     *     dynamicPolygons
     */
    getRenderStats() {
        let objects = this.buckets,
            buckets = objects.length,
            calls = 0,
            instances = 0,
            vertices = 0,
            polygons = 0,
            dynamicVertices = 0,
            dynamicPolygons = 0;

        for (let i = 0; i < buckets; i++) {
            let stats = objects[i].getRenderStats();

            calls += stats.calls;
            instances += stats.instances;
            vertices += stats.vertices;
            polygons += stats.polygons;
            dynamicVertices += stats.dynamicVertices;
            dynamicPolygons += stats.dynamicPolygons;
        }

        return { buckets, calls, instances, vertices, polygons, dynamicVertices, dynamicPolygons };
    }

    /**
     * Add an instance to this scene.
     * 
     * @param {ModelInstance} instance The instance to add.
     */
    addInstance(instance) {
        if (instance && instance.objectType === 'instance') {
            let instanceSet = this.instanceSet;

            if (!instanceSet.has(instance)) {
                instanceSet.add(instance);

                this.instances.push(instance);

                instance.modelView.sceneChanged(instance, this);

                if (instance.parent === null) {
                    instance.setParent(this.root);
                }

                return true;
            }
        }

        return false;
    }

    /**
     * Remove an instance from this scene.
     * 
     * @param {ModelInstance} instance The instance to remove.
     */
    removeInstance(instance) {
        if (instance && instance.objectType === 'instance') {
            let instanceSet = this.instanceSet;

            if (instanceSet.has(instance)) {
                instanceSet.delete(instance);

                let instances = this.instances;

                instances.splice(instances.indexOf(instance), 1);

                instance.modelView.sceneChanged(instance, null);

                return true;
            }
        }

        return false;
    }

    /**
     * Removes all of the buckets in this scene.
     */
    clear() {
        this.buckets.length = 0;
        this.instanceSet.clear();
        this.instances.length = 0;
    }

    /**
     * Detach this scene from the viewer.
     */
    detach() {
        if (this.env) {
            return this.env.removeScene(this);
        }

        return false;
    }

    // Note: the bucket will actually be added at the next update call.
    addBucket(bucket) {
        this.bucketsToAdd.push(bucket);
    }

    // Note: the bucket will actually be removed at the next update call.
    removeBucket(bucket) {
        this.bucketsToRemove.push(bucket);
    }

    // Sort the buckets based on priority.
    // Note that this is never called by the library so far, and is manually used by the W3x handler.
    sortBuckets() {
        this.buckets.sort((a, b) => b.priority - a.priority);
    }

    update() {
        // First update all of the instances.
        var instances = this.instances;

        for (var i = 0, l = instances.length; i < l; i++) {
            var instance = instances[i];

            if (instance.loaded) {
                var isVisible = this.isVisible(instance) || instance.noCulling || this.env.noCulling,
                    isCulled = instance.culled;

                // Handle culling.
                if (isVisible && isCulled) {
                    instance.uncull();
                } else if (!isVisible && !isCulled) {
                    instance.cull();
                }

                if (!instance.paused) {
                    // Update animation timers.
                    instance.updateTimers();

                    instance.isVisible = isVisible && !isCulled;

                    // If the instance is actually shown, do the full update.
                    if (isVisible) {
                        instance.update();
                    }
                }
            }
        }

        // Update the buckets.
        var buckets = this.buckets;

        for (var i = 0, l = buckets.length; i < l; i++) {
            buckets[i].update(this);
        }

        // Now that all updates have finished, add and remove buckets.
        var bucketSet = this.bucketSet,
            bucketsToAdd = this.bucketsToAdd,
            bucketsToRemove = this.bucketsToRemove;

        // Add buckets.
        for (var i = 0, l = bucketsToAdd.length; i < l; i++) {
            var bucket = bucketsToAdd[i];

            if (!bucketSet.has(bucket)) {
                bucketSet.add(bucket);
                buckets.push(bucket);
            }
        }

        // Remove buckets.
        for (var i = 0, l = bucketsToRemove.length; i < l; i++) {
            var bucket = bucketsToRemove[i];

            if (bucketSet.has(bucket)) {
                if (bucket.instances.length === 0) {
                    bucketSet.delete(bucket);
                    buckets.splice(buckets.indexOf(bucket), 1);
                }
            }
        }

        // Reset the arrays.
        bucketsToAdd.length = 0;
        bucketsToRemove.length = 0;
    }

    isVisible(instance) {
        //*
        let worldProjectionMatrix = this.camera.worldProjectionMatrix;

        // This test checks whether the instance's position is visible in NDC space. In other words, that it lies in [-1, 1] on all axes
        vec3.transformMat4(ndcHeap, instance.worldLocation, worldProjectionMatrix);
        if (ndcHeap[0] >= -1 && ndcHeap[0] <= 1 && ndcHeap[1] >= -1 && ndcHeap[1] <= 1 && ndcHeap[2] >= -1 && ndcHeap[2] <= 1) {
            return true;
        }

        return false;
        //*/

        //return this.model.env.camera.testIntersectionAABB(instance.boundingShape) > 0;
    }

    renderOpaque() {
        let buckets = this.buckets;

        this.setViewport();

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderOpaque(this);
        }
    }

    renderTranslucent() {
        let buckets = this.buckets;

        this.setViewport();

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderTranslucent(this);
        }
    }

    renderEmitters() {
        let buckets = this.buckets;

        this.setViewport();

        for (let i = 0, l = buckets.length; i < l; i++) {
            buckets[i].renderEmitters(this);
        }
    }

    setViewport() {
        let viewport = this.camera.viewport;

        this.env.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
};
