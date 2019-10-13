import JassAgent from './agent';

/**
 * type trigger
 */
export default class JassTrigger extends JassAgent {
  /**
   *
   */
  constructor() {
    super();

    /** @member {Array<number>} */
    this.events = [];
    /** @member {Array<number>} */
    this.conditions = [];
    /** @member {Array<number>} */
    this.actions = [];
    /** @member {boolean} */
    this.enabled = true;
  }
}
