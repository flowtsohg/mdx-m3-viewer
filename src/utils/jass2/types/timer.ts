import JassAgent from './agent';

/**
 * type timer
 */
export default class JassTimer extends JassAgent {
  elapsed: number = 0;
  timeout: number = 0;
  periodic: boolean = false;
  handlerFunc: number = -1;
}
