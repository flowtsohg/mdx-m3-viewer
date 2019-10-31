import Resource from './resource';
import Bounds from './bounds';

/**
 * A model.
 */
export default class Model extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /**
     * An array of instances that were created before the model loaded.
     * When the model loads, the instances are loaded, and the array is cleared.
     *
     * @member {Array<ModelInstance>} */
    this.preloadedInstances = [];
    /** @member {Bounds} */
    this.bounds = new Bounds();
  }

  /**
   * Adds a new instance to this model, and returns it.
   *
   * @param {?number} type
   * @return {ModelInstance}
   */
  addInstance(type = 0) {
    let Instance = this.handler.Instance[type];
    let instance = new Instance(this);

    if (this.ok) {
      instance.load();
    } else {
      this.preloadedInstances.push(instance);
    }

    return instance;
  }

  /**
   * Called when the model finishes loading.
   * Automatically finalizes loading for all of the model instances.
   */
  lateLoad() {
    for (let instance of this.preloadedInstances) {
      instance.load();

      // If an instance was created and attached to a scene before the model finished loading, it was rejected by the scene.
      // Therefore re-add it now that the model is loaded.
      let scene = instance.scene;

      if (scene) {
        instance.scene = null;
        scene.addInstance(instance);
      }
    }

    // Remove references to the instances.
    this.preloadedInstances.length = 0;
  }
}
