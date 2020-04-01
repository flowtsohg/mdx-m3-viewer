import UnitsDoo from '../../parsers/w3x/unitsdoo/file';
import Unit from '../../parsers/w3x/unitsdoo/unit';
import LuaContext from './context';
import JassUnit from './types/unit';
import War3Map from '../../parsers/w3x/map';

export default function rebuild(map: War3Map, commonj: string, blizzardj: string, callback: Function) {
  let context = new LuaContext();
  let start = performance.now();

  let time = (msg: string) => {
    callback(`[${(performance.now() - start) | 0}] ${msg}`);
  };

  time('Converting and running common.j');
  context.run(commonj, true);

  time('Converting and running Blizzard.j');
  context.run(blizzardj, true);

  time('Converting and running war3map.j');
  context.open(map);

  time('Running config()');
  context.call('config');

  time('Running main()');
  context.call('main');

  time('Collecting handles');

  let unitsFile = new UnitsDoo();
  let units = unitsFile.units;

  for (let handle of context.handles) {
    if (handle instanceof JassUnit) {
      let unit = new Unit();

      unit.id = handle.unitId;

      unit.location[0] = handle.x;
      unit.location[1] = handle.y;
      // For z need the height of the terrain!

      unit.angle = handle.face / 180 * Math.PI;

      unit.player = handle.player.index;

      unit.targetAcquisition = handle.acquireRange;

      units.push(unit);
    }
  }

  time(`Saving war3mapUnits.doo with ${units.length} objects`);

  map.set('war3mapUnits.doo', unitsFile.save());

  time('Finished');
}
