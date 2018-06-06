import JassHandle from './handle';

/**
 * Parent class for all enum types.
 */
export default class JassEnum extends JassHandle {
  /**
   * @param {JassContext} jassContext
   * @param {number} value
   */
  constructor(jassContext, value) {
    super(jassContext);

    this.handleId = value;
  }
}
