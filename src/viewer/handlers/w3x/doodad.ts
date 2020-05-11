import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import { MappedDataRow } from '../../../utils/mappeddata';
import DooDoodad from '../../../parsers/w3x/doo/doodad';
import MdxModel from '../mdx/model';
import MdxModelInstance from '../mdx/modelinstance';
import War3MapViewer from './viewer';

/**
 * A doodad.
 */
export default class Doodad {
  instance: MdxModelInstance;
  row: MappedDataRow;

  constructor(map: War3MapViewer, model: MdxModel, row: MappedDataRow, doodad: DooDoodad) {
    let instance = <MdxModelInstance>model.addInstance();

    instance.move(<vec3>doodad.location);
    instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, doodad.angle));
    instance.scale(<vec3>doodad.scale);
    instance.setScene(map.worldScene);

    this.instance = instance;
    this.row = row;
  }
}
