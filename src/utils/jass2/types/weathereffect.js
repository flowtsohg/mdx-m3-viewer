import JassHandle from './handle';

/**
 * type weathereffect
 */
export default class JassWeatherEffect extends JassHandle {
  /**
   * @param {JassContext} jass
   * @param {JassRect} whichRect
   * @param {string} effectId
   */
  constructor(jass, whichRect, effectId) {
    super(jass);

    /** @member {JassRect} */
    this.whichRect = whichRect;
    /** @member {string} */
    this.effectId = effectId;
    /** @member {boolean} */
    this.enabled = false;
  }
}
