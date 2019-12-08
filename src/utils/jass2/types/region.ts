import JassAgent from './agent';
import JassRect from './rect';

/**
 * type region
 */
export default class JassRegion extends JassAgent {
  rects: Set<JassRect>;

  constructor() {
    super();

    this.rects = new Set();
  }
}
