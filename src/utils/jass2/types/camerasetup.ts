import JassHandle from './handle';
import JassLocation from './location';

/**
 * type camerasetup
 */
export default class JassCameraSetup extends JassHandle {
  targetDistance = 0;
  farZ = 0;
  angleOfAttack = 0;
  fieldOfView = 0;
  roll = 0;
  rotation = 0;
  zOffset = 0;
  destPosition = new JassLocation(0, 0);
}
