import JassHandle from './handle';
import JassRect from './rect';

/**
 * type weathereffect
 */
export default class JassWeatherEffect extends JassHandle {
  whichRect: JassRect;
  effectId: string;
  enabled: boolean = false;

  constructor(whichRect: JassRect, effectId: string) {
    super();

    this.whichRect = whichRect;
    this.effectId = effectId;
  }
}
