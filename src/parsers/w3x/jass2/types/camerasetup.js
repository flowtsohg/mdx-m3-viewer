import JassHandle from './handle';
import JassLocation from './location';

/**
 * type camerasetup
 */
export default class JassCameraSetup extends JassHandle {
  /**
   * @param {JassContext} jass
   */
  constructor(jass) {
    super(jass);

    /** @member {number} */
    this.targetDistance = 0;
    /** @member {number} */
    this.farZ = 0;
    /** @member {number} */
    this.angleOfAttack = 0;
    /** @member {number} */
    this.fieldOfView = 0;
    /** @member {number} */
    this.roll = 0;
    /** @member {number} */
    this.rotation = 0;
    /** @member {number} */
    this.zOffset = 0;
    /** @member {JassLocation} */
    this.destPosition = new JassLocation(jass, 0, 0);
  }
}
