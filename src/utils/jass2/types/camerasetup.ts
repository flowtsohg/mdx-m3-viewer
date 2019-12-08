import JassHandle from './handle';
import JassLocation from './location';

/**
 * type camerasetup
 */
export default class JassCameraSetup extends JassHandle {
  targetDistance: number;
  farZ: number;
  angleOfAttack: number;
  fieldOfView: number;
  roll: number;
  rotation: number;
  zOffset: number;
  destPosition: JassLocation;

  constructor() {
    super();

    this.targetDistance = 0;
    this.farZ = 0;
    this.angleOfAttack = 0;
    this.fieldOfView = 0;
    this.roll = 0;
    this.rotation = 0;
    this.zOffset = 0;
    this.destPosition = new JassLocation(0, 0);
  }
}
