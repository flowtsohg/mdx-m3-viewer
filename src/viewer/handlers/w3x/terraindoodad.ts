import { vec3, quat } from 'gl-matrix';
import { VEC3_UNIT_Z } from '../../../common/gl-matrix-addon';
import { degToRad } from '../../../common/math';
import { MappedDataRow } from '../../../utils/mappeddata';
import DooTerrainDoodad from '../../../parsers/w3x/doo/terraindoodad';
import MdxModel from '../mdx/model';
import MdxModelInstance from '../mdx/modelinstance';
import War3MapViewer from './viewer';


const locationHeap = vec3.create();
/**
 * A cliff/terrain doodad.
 */
export default class TerrainDoodad {
  instance: MdxModelInstance;
  row: MappedDataRow;

  constructor(map: War3MapViewer, model: MdxModel, row: MappedDataRow, doodad: DooTerrainDoodad) {
    let centeroffset = map.centerOffset;
    let instance = <MdxModelInstance>model.addInstance();

    locationHeap[0] = doodad.location[0] * 128 + centeroffset[0] + 128;
    locationHeap[1] = doodad.location[1] * 128 + centeroffset[1] + 128;

    instance.move(locationHeap);
    instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, degToRad(<number>row.fixedRot)));
    instance.setScene(map.worldScene);

    this.instance = instance;
    this.row = row;
  }
}
