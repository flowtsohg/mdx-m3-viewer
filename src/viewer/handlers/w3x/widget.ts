import MdxModel from '../mdx/model';
import MdxModelInstance from '../mdx/modelinstance';
import War3MapViewerMap from './map';
import randomStandSequence from './standsequence';

export enum WidgetState {
  IDLE,
  WALK,
}


/**
 * A widget.
 */
export class Widget {
  instance: MdxModelInstance;
  state: WidgetState = WidgetState.IDLE;

  constructor(map: War3MapViewerMap, model: MdxModel) {
    this.instance = <MdxModelInstance>model.addInstance();

    this.instance.setScene(map.worldScene);
  }

  update() {
    if (this.instance.sequenceEnded || this.instance.sequence === -1) {
      if (this.state === WidgetState.IDLE) {
        randomStandSequence(this.instance);
      }
    }
  }
}
