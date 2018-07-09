import JassHandle from './handle';

/**
 * Parent class for all enum types.
 */
export default class JassEnum extends JassHandle {
  /**
   * @param {JassContext} jass
   * @param {number} value
   */
  constructor(jass, value) {
    super(jass);

    this.handleId = value;
  }
}
