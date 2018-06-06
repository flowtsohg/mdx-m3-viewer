import JassHandle from './handle';

/**
 * type weathereffect
 */
export default class JassWeatherEffect extends JassHandle {
  /**
   * @param {JassContext} jassContext
   * @param {JassRect} whichRect
   * @param {string} effectId
   */
  constructor(jassContext, whichRect, effectId) {
    super(jassContext);

    /** @member {JassRect} */
    this.whichRect = whichRect;
    /** @member {string} */
    this.effectId = effectId;
    /** @member {boolean} */
    this.enabled = false;
  }
}
