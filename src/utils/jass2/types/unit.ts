import { base256ToString } from '../../../common/typecast';
import MdxModel from '../../../viewer/handlers/mdx/model';
import MdxModelInstance from '../../../viewer/handlers/mdx/modelinstance';
import Context from '../context';
import JassWidget from './widget';
import JassPlayer from './player';

/**
 * type unit
 */
export default class JassUnit extends JassWidget {
  player: JassPlayer;
  unitId: string;
  x: number;
  y: number;
  face: number;
  acquireRange: number = 500;
  instance?: MdxModelInstance;

  constructor(C: Context, player: JassPlayer, unitId: number, x: number, y: number, face: number) {
    super();

    this.player = player;
    this.unitId = base256ToString(unitId);
    this.x = x;
    this.y = y;
    this.face = face;

    if (C.viewer) {
      let viewer = C.viewer;
      let row = viewer.unitsData.getRow(this.unitId);
      let file = <string>row.file;

      if (file.endsWith('.mdl')) {
        file = `${file.slice(0, -1)}x`;
      }

      if (!file.endsWith('.mdx')) {
        file = `${file}.mdx`;
      }

      viewer.load(file)
        .then((model) => {
          if (model) {
            let instance = (<MdxModel>model).addInstance();

            instance.setLocation([this.x, this.y, 0]);
            instance.setScene(viewer.worldScene);
          }
        });
    }

    // if (balanceRow) {
    //   this.balanceRow = balanceRow;
    //   this.health = balanceRow.realHP;
    //   this.maxHealth = this.health;
    //   this.mana = parseFloat(balanceRow.realM) || 0;
    //   this.maxMana = this.mana;
    // } else if (jass.debugMode) {
    //   console.log('Unknown unitid', unitId);
    // }
  }
}
