import JassAgent from './agent';

/**
 * type location
 */
export default class JassLocation extends JassAgent {
  x: number;
  y: number;
  z = 0;

  constructor(x: number, y: number) {
    super();

    this.x = x;
    this.y = y;
  }
}
