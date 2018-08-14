import Resource from './resource';

/**
 * A model.
 */
export default class Model extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @member {number} */
    this.batchSize = resourceData.viewer.batchSize;

    /** @member {Array<ModelInstance>} */
    this.instances = [];

    /** @member {Array<ModelView>} */
    this.views = [];
  }

  /**
   * Adds a new instance to this model, and returns it.
   *
   * @return {ModelInstance}
   */
  addInstance() {
    let views = this.views;
    let instance = new this.handler.Instance(this);

    this.instances.push(instance);

    if (views.length === 0) {
      this.addView();
    }

    views[0].addInstance(instance);

    if (this.ok) {
      instance.load();
    }

    return instance;
  }

  /**
   * Render opaque things.
   *
   * @param {*} data
   * @param {*} scene
   * @param {*} modelView
   */
  renderOpaque(data, scene, modelView) {

  }

  /**
   * Render translucent things.
   *
   * @param {*} data
   * @param {*} scene
   * @param {*} modelView
   */
  renderTranslucent(data, scene, modelView) {

  }

  /**
   * Create a new model view for this model, and return it.
   *
   * @return {ModelView}
   */
  addView() {
    let view = new this.handler.View(this);

    this.views.push(view);

    return view;
  }

  /**
   * Remove a model view from this model.
   *
   * @param {*} modelView
   */
  removeView(modelView) {
    let views = this.views;

    views.splice(views.indexOf(modelView), 1);
  }

  /**
   * Called every time an instance changes a model view.
   * This generally corresponds to the instance creation, and to texture overriding.
   *
   * @param {ModelInstance} instance
   * @param {Object} shallowView
   */
  viewChanged(instance, shallowView) {
    // Check if there's another view that matches the instance
    for (let view of this.views) {
      if (view.equals(shallowView)) {
        view.addInstance(instance);
        return;
      }
    }

    // Since no view matched, create a new one
    let view = this.addView();

    view.applyShallowCopy(shallowView);
    view.addInstance(instance);

    // If the instance is already in a scene, and this is a new view, it will not be in the scene, so add it.
    if (instance.scene) {
      instance.scene.addView(view);
    }
  }

  /**
   * Called when the model finishes loading.
   * Automatically finalizes loading for all of the model instances and views of this model.
   */
  lateLoad() {
    for (let instance of this.instances) {
      instance.load();
    }

    for (let view of this.views) {
      view.lateLoad();
    }
  }
}
