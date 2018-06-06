/**
 * M3 animation data validator.
 */
export default class M3Sts {
  /**
   * @param {M3ParserSts} sts
   */
  constructor(sts) {
    const animIds = sts.animIds.getAll();

    this.animIds = {};

    // Allows direct checks instead of loops
    for (let i = 0, l = animIds.length; i < l; i++) {
      this.animIds[animIds[i]] = i;
    }
  }

  hasData(animRef) {
    return !!this.animIds[animRef.animId];
  }
}
