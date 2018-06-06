/**
 * type reference
 *
 * Not visible to jass.
 */
export default class JassReference {
  /**
   * @param {string} name
   * @param {*} object
   */
  constructor(name, object) {
    /** @member {string} */
    this.name = name;
    /** @member {*} */
    this.object = object;
  }

  /**
   * @return {string}
   */
  toString() {
    return this.name || this.object.toString();
  }
}
