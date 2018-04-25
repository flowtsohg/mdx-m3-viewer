import { vec3 } from 'gl-matrix';
import Camera from './camera';
import { NotifiedSceneNode } from './node';

// Heap allocations needed for this module.
let ndcHeap = new Float32Array(3);

export default class Scene {
    constructor() {
        this.viewer = null;

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
        /** @member {ModelViewer.viewer.NotifiedSceneNode} */
        this.root = new NotifiedSceneNode();
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
        //let objects = this.buckets,
       //     buckets = objects.length,
        let buckets = 0,
            calls = 0,
            instances = 0,
            vertices = 0,
            polygons = 0,
            dynamicVertices = 0,
            dynamicPolygons = 0;

        /*
        for (let i = 0; i < buckets; i++) {
            let stats = objects[i].getRenderStats();

            calls += stats.calls;
            instances += stats.instances;
            vertices += stats.vertices;
            polygons += stats.polygons;
            dynamicVertices += stats.dynamicVertices;
            dynamicPolygons += stats.dynamicPolygons;
        }
        */

        return { buckets, calls, instances, vertices, polygons, dynamicVertices, dynamicPolygons };
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

    update() {
        for (let instance of this.instances) {
            if (instance.loaded && !instance.paused) {
                // Update animation timers.
                instance.updateTimers();
                
                if (instance.rendered) {
                    let visible = this.isVisible(instance) || instance.noCulling || this.viewer.noCulling;

                    instance.culled = !visible;
                    
                    if (visible) {
                        instance.update();
                    }
                }
            }
        }

        for (let modelView of this.modelViews) {
            modelView.update(this);
        }
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

    renderOpaque(gl) {
        this.setViewport(gl);

        for (let modelView of this.modelViews) {
            modelView.renderOpaque(this);
        }
    }

    renderTranslucent(gl) {
        this.setViewport(gl);

        for (let modelView of this.modelViews) {
            modelView.renderTranslucent(this);
        }
    }

    setViewport(gl) {
        let viewport = this.camera.viewport;

        gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
    }
};
