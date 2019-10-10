import JassHandle from './handle';

/**
 * Parent class for all enum types.
 */
export default class JassEnum extends JassHandle {
  /**
   * @param {number} value
   */
  constructor(value) {
    super();

    this.id = value;
  }
}
