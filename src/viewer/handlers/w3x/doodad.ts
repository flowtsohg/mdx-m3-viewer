import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import DooDoodad from '../../../parsers/w3x/doo/doodad';
import MdxModel from '../mdx/model';
import MdxComplexInstance from '../mdx/complexinstance';
import MdxSimpleInstance from '../mdx/simpleinstance';
import War3MapViewer from './viewer';

/**
 * A doodad.
 */
export default class Doodad {
  instance: MdxSimpleInstance | MdxComplexInstance;
  row: any;

  constructor(map: War3MapViewer, model: MdxModel, row: any, doodad: DooDoodad) {
    let isSimple = row.lightweight === 1;
    let instance;

    if (isSimple) {
      instance = <MdxSimpleInstance>model.addInstance(1);
    } else {
      instance = <MdxComplexInstance>model.addInstance();
    }

    instance.move(<vec3>doodad.location);
    instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, doodad.angle));
    instance.scale(<vec3>doodad.scale);
    instance.setScene(map.scene);

    this.instance = instance;
    this.row = row;
  }
}
