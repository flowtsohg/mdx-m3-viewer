import JassAgent from './agent';
import JassRect from './rect';

/**
 * type region
 */
export default class JassRegion extends JassAgent {
  rects: Set<JassRect> = new Set();
}
