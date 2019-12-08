import JassAgent from './agent';

/**
 * type timer
 */
export default class JassTimer extends JassAgent {
  elapsed: number;
  timeout: number;
  periodic: boolean;
  handlerFunc: number;

  constructor() {
    super();

    this.elapsed = 0;
    this.timeout = 0;
    this.periodic = false;
    this.handlerFunc = -1;
  }
}
