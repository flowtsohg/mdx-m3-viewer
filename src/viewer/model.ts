import { HandlerResource } from './handlerresource';
import Bounds from './bounds';
import ModelInstance from './modelinstance';

/**
 * A model.
 */
export default abstract class Model extends HandlerResource {
  /**
   * An array of instances that were created before the model loaded.
   * 
   * When the model loads, the instances are loaded, and the array is cleared.
   */
  preloadedInstances: ModelInstance[] = [];
  bounds: Bounds = new Bounds();

  /**
   * Create the actual instance object and return it.
   * 
   * The given type can be used to select between instance classes, if there are more than one.
   */
  abstract createInstance(): ModelInstance;

  /**
   * Adds a new instance to this model, and returns it.
   */
  addInstance() {
    let instance = this.createInstance();

    if (this.ok) {
      instance.load();
    } else {
      this.preloadedInstances.push(instance);
    }

    return instance;
  }

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
