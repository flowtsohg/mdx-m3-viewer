import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import DooUnit from '../../../parsers/w3x/unitsdoo/unit';
import MdxModel from '../mdx/model';
import MdxComplexInstance from '../mdx/complexinstance';
import War3MapViewer from './viewer';

/**
 * A unit.
 */
export default class Unit {
  instance: MdxComplexInstance;
  row: any;

  constructor(map: War3MapViewer, model: MdxModel, row: any, unit: DooUnit) {
    let instance = <MdxComplexInstance>model.addInstance();

    //let normal = this.groundNormal([], unit.location[0], unit.location[1]);

    instance.move(<vec3>unit.location);
    instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, unit.angle));
    instance.scale(<vec3>unit.scale);
    instance.setTeamColor(unit.player);
    instance.setScene(map.scene);

    if (row) {
      instance.move([0, 0, row.moveHeight]);
      instance.setVertexColor([row.red / 255, row.green / 255, row.blue / 255, 1]);
      instance.uniformScale(row.modelScale);
    }

    this.row = row;
    this.instance = instance;
  }
}
