/**
 * A model view.
 *
 * Model views are used in cases where you want instances of the same model to have different rendering properties.
 * It is used for texture overriding.
 */
export default class ModelView {
  /**
   * @param {Model} model
   */
  constructor(model) {
    /** @member {Model} */
    this.model = model;
  }

  /**
   * Get a shallow copy of this view.
   *
   * A shallow copy in this context means an object that any model view can be compared against.
   * This is used in equals() to test if two model views share the same properties.
   *
   * @return {Object|null}
   */
  getShallowCopy() {
    return null;
  }

  /**
   * Given a shallow copy returned by getShallowCopy(), apply it to this model view.
   *
   * @param {Object} view
   */
  applyShallowCopy(view) {

  }

  /**
   * Check if this model view is comparable to the given shallow view.
   *
   * @param {Object} view
   * @return {boolean}
   */
  equals(view) {
    return true;
  }
}
