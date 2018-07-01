import Resource from './resource';

/**
 * A generic resource.
 */
export default class GenericResource extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @member {*} */
    this.data = null;
  }

  /**
   * @param {*} data
   */
  load(data) {
    this.data = data;
  }
}
