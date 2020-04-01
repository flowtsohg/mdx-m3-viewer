import JassAgent from './agent';
import JassUnit from './unit';

/**
 * type group
 */
export default class JassGroup extends JassAgent {
  units: Set<JassUnit> = new Set();
}
