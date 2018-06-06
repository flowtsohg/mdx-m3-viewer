/**
 * type handle
 */
export default class JassHandle {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    /** @member {JassContext} */
    this.jassContext = jassContext;
    /** @member {number} */
    this.handleId = -1;
    /** @member {Array<string>} */
    this.handleNames = [];
  }

  /**
   * @param {string} name
   */
  addName(name) {
    this.handleNames.push(name);
  }

  /**
   *
   */
  kill() {
    this.handleId = -1;
    this.handleNames.length = [];
  }

  /**
   * @return {string}
   */
  toString() {
    // This automatically handles all of the constant global handles.
    if (this.handleNames.length) {
      return this.handleNames[0];
    }

    return `HANDLE_${this.handleId}`;
  }
}
