import JassAgent from './agent';
import JassPlayer from './player';

/**
 * type force
 */
export default class JassForce extends JassAgent {
  players: Set<JassPlayer> = new Set();
}
