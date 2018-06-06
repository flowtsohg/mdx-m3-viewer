import JassHandle from './handle';
import JassLocation from './location';

/**
 * type camerasetup
 */
export default class JassCameraSetup extends JassHandle {
  /**
   * @param {JassContext} jassContext
   */
  constructor(jassContext) {
    super(jassContext);

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
    this.destPosition = new JassLocation(jassContext, 0, 0);
  }
}
