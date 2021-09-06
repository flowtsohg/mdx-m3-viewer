import JassAgent from './agent';

/**
 * type timer
 */
export default class JassTimer extends JassAgent {
  elapsed = 0;
  timeout = 0;
  periodic = false;
  handlerFunc = -1;
}
