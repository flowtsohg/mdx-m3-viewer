import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import { MappedDataRow } from '../../../utils/mappeddata';
import DooUnit from '../../../parsers/w3x/unitsdoo/unit';
import MdxModel from '../mdx/model';
import MdxModelInstance from '../mdx/modelinstance';
import War3MapViewer from './viewer';

const heapZ = vec3.create();

/**
 * A unit.
 */
export default class Unit {
  instance: MdxModelInstance;
  /**
   * StartLocation.mdx (and others?) seems to be built-in, and has no row.
   */
  row: MappedDataRow | undefined;

  constructor(map: War3MapViewer, model: MdxModel, row: MappedDataRow | undefined, unit: DooUnit) {
    let instance = <MdxModelInstance>model.addInstance();

    //let normal = this.groundNormal([], unit.location[0], unit.location[1]);

    instance.move(<vec3>unit.location);
    instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, unit.angle));
    instance.scale(<vec3>unit.scale);
    instance.setTeamColor(unit.player);
    instance.setScene(map.worldScene);

    if (row) {
      heapZ[2] = <number>row.moveHeight;

      instance.move(heapZ);
      instance.setVertexColor([<number>row.red / 255, <number>row.green / 255, <number>row.blue / 255, 1]);
      instance.uniformScale(<number>row.modelScale);
    }

    this.instance = instance;
    this.row = row;
  }
}
