import JassHandle from './handle';
import JassLocation from './location';

/**
 * type camerasetup
 */
export default class JassCameraSetup extends JassHandle {
  targetDistance: number = 0;
  farZ: number = 0;
  angleOfAttack: number = 0;
  fieldOfView: number = 0;
  roll: number = 0;
  rotation: number = 0;
  zOffset: number = 0;
  destPosition: JassLocation = new JassLocation(0, 0);
}
