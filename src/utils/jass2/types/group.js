import JassAgent from './agent';

/**
 * type group
 */
export default class JassGroup extends JassAgent {
  /**
   *
   */
  constructor() {
    super();

    /** @member {Set<JassUnit>} */
    this.units = new Set();
  }
}
