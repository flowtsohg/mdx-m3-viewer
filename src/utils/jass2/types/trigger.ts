import JassAgent from './agent';

/**
 * type trigger
 */
export default class JassTrigger extends JassAgent {
  events: number[];
  conditions: number[];
  actions: number[];
  enabled: boolean;

  constructor() {
    super();

    this.events = [];
    this.conditions = [];
    this.actions = [];
    this.enabled = true;
  }
}
