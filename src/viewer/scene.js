import {vec3} from 'gl-matrix';
import Camera from './camera';
import {SceneNode} from './node';

// Heap allocations needed for this module.
let ndcHeap = new Float32Array(3);

/**
 * A scene.
 *
 * Every scene has its own list of model instances, and its own camera and viewport.
 *
 * In addition, every scene may have its own AudioContext if enableAudio() is called.
 * If audo is enabled, the AudioContext's listener's location will be updated automatically.
 * Note that due to browser policies, this may be done only after user interaction with the web page.
 */
export default class Scene {
  /**
   * @param {ModelViewer} viewer
   */
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

    /** @member {boolean} */
    this.audioEnabled = false;
    /** @member {?AudioContext} */
    this.audioContext = null;

    this.node.recalculateTransformation();
    this.node.wasDirty = false;
  }

  /**
   * Creates an AudioContext if one wasn't created already, and resumes it if needed.
   * The returned promise will resolve to whether it is actually running or not.
   * It may stay in suspended state indefinitly until the client interact with the page, due to browser policies.
   *
   * @return {Promise}
   */
  async enableAudio() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
    }

    if (this.audioContext.state !== 'suspended') {
      await this.audioContext.resume();
    }

    this.audioEnabled = this.audioContext.state === 'running';

    return this.audioEnabled;
  }

  /**
   * Suspend the audio context.
   */
  disableAudio() {
    if (this.audioContext) {
      this.audioContext.suspend();
    }

    this.audioEnabled = false;
  }

  /**
   * Sets the scene of the given instance.
   * This is equivalent to instance.setScene(scene).
   *
   * @param {ModelViewer.viewer.ModelInstance} instance
   * @return {boolean}
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

  /**
   * Add a model view to this scene.
   *
   * @param {ModelView} modelView
   */
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
   * @return {boolean}
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
   * Clear this scene.
   *
   * TODO: Implement this properly.
   */
  clear() {
    this.instances.length = 0;
    this.instanceSet.clear();
    this.modelViews.length = 0;
    this.modelViewSet.clear();
  }

  /**
   * Detach this scene from the viewer.
   *
   * TODO: Implement this properly.
   *
   * @return {boolean}
   */
  detach() {
    if (this.viewer) {
      return this.viewer.removeScene(this);
    }

    return false;
  }

  /**
   * Update this scene.
   * This includes updating the scene's camera, the node hierarchy (model instances etc.), the model views, and the AudoContext's lisener's position if it exists.
   */
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
        let [x, y, z] = this.camera.location;

        this.audioContext.listener.setPosition(-x, -y, -z);
      }

      this.camera.update();
    }
  }

  /**
   * Tests if an instance is currently visible in this scene.
   * If the model has a bounding sphere, it will be used. Otherwise checks only the location of the instance.
   *
   * @param {ModelInstance} instance
   * @return {boolean}
   */
  isVisible(instance) {
    let model = instance.model;
    let bounds = model.bounds;

    // If the model has a bounding sphere in it, do a sphere test.
    // Otherwise do a point test.
    if (bounds) {
      let center = bounds.center;
      let location = instance.worldLocation;

      ndcHeap[0] = location[0] + center[0];
      ndcHeap[1] = location[1] + center[1];
      ndcHeap[2] = location[2] + center[2];

      return this.camera.testSphere(ndcHeap, bounds.radius);
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

  /**
   * Render all opaque things in this scene.
   * Automatically applies the camera's viewport.
   */
  renderOpaque() {
    if (this.rendered) {
      this.viewport();

      for (let modelView of this.modelViews) {
        modelView.renderOpaque(this);
      }
    }
  }

  /**
   * Renders all translucent things in this scene.
   * Automatically applies the camera's viewport.
   */
  renderTranslucent() {
    if (this.rendered) {
      this.viewport();

      for (let modelView of this.modelViews) {
        modelView.renderTranslucent(this);
      }
    }
  }

  /**
   * Set the viewport to that of this scene's camera.
   */
  viewport() {
    let viewport = this.camera.rect;

    this.viewer.gl.viewport(viewport[0], viewport[1], viewport[2], viewport[3]);
  }

  /**
   * Clear all of the emitted objects in this scene.
   */
  clearEmittedObjects() {
    for (let instance of this.instances) {
      instance.clearEmittedObjects();
    }
  }
}
