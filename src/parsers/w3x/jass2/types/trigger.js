import JassAgent from './agent';

/**
 * type trigger
 */
export default class JassTrigger extends JassAgent {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

    /** @member {boolean} */
    this.enabled = true;
  }
}
