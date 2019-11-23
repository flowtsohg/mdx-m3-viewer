import {quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';

/**
 * A unit.
 */
export default class Unit {
  /**
   * @param {Map} map
   * @param {Object} object
   */
  constructor(map, object) {
    this.map = map;
    this.object = object;
    this.row = null;
    this.model = null;
    this.instance = null;

    let row;
    let path;

    // Hardcoded?
    if (object.id === 'sloc') {
      path = 'Objects\\StartLocation\\StartLocation.mdx';
    } else {
      row = map.unitsData.getRow(object.id);

      path = row.file;

      if (path.endsWith('.mdl')) {
        path = path.slice(0, -4);
      }

      path += '.mdx';
    }

    if (path) {
      this.row = row;
      this.model = map.load(path);
      this.instance = this.model.addInstance();

      //let normal = this.groundNormal([], unit.location[0], unit.location[1]);

      this.instance.move(object.location);
      this.instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, object.angle));
      this.instance.scale(object.scale);
      this.instance.setTeamColor(object.player);
      this.instance.setScene(map.scene);

      if (row) {
        this.instance.move([0, 0, row.moveHeight]);
        this.instance.setVertexColor([row.red / 255, row.green / 255, row.blue / 255, 1]);
        this.instance.uniformScale(row.modelScale);
      }
    } else {
      console.log('Unknown unit ID', object.id, object);
    }
  }
}
