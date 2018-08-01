import UnitsDoo from '../../parsers/w3x/unitsdoo/file';
import Unit from '../../parsers/w3x/unitsdoo/unit';
import JassContext from './context';
import JassUnit from './types/unit';

/**
 * @param {War3Map} map
 * @param {string} commonj
 * @param {string} blizzardj
 * @param {function} callback
 */
export default function rebuild(map, commonj, blizzardj, callback) {
  let jass = new JassContext(map);
  let start = performance.now();

  function time(msg) {
    callback(`[${(performance.now() - start) | 0}] ${msg}`);
  }

  //jass.debugMode = true;

  time('Parsing common.j');
  let commonjJs = jass.recompile(commonj);
  time('Running common.j');
  jass.run(commonjJs);

  time('Parsing Blizzard.j');
  let blizzardjJs = jass.recompile(blizzardj);
  time('Running Blizzard.j');
  jass.run(blizzardjJs);

  time('Parsing war3map.j');
  let scriptJs = jass.recompile(jass.map.getScript());
  time('Running war3map.j');
  jass.run(scriptJs);

  // jass.on('nativedef', (e) => console.log(e));
  // jass.on('functiondef', (e) => console.log(e));
  // jass.on('localvardef', (e) => console.log(e));
  // jass.on('globalvardef', (e) => console.log(e));
  // jass.on('varset', (e) => console.log(e));
  // jass.on('arrayvarset', (e) => console.log(e));
  // jass.on('varget', (e) => console.log(e));
  // jass.on('arrayvarget', (e) => console.log(e));
  // jass.on('handlecreated', (e) => console.log(e));
  // jass.on('handledestroyed', (e) => console.log(e));
  // jass.on('refcreated', (e) => console.log(e));
  // jass.on('refdestroyed', (e) => console.log(e));
  // jass.on('call', (e) => console.log(e));

  time('Running config()');
  jass.call('config');

  time('Running main()');
  jass.call('main');

  time('Collecting handles');

  let unitsFile = new UnitsDoo();
  let units = unitsFile.units;

  for (let handle of jass.handles) {
    if (handle instanceof JassUnit) {
      let unit = new Unit();

      unit.id = handle.id;

      unit.location[0] = handle.location.x;
      unit.location[1] = handle.location.y;
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
