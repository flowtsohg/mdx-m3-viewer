import JassContext from './context';

/**
 * @param {War3Map} map
 * @param {string} commonj
 * @param {string} blizzardj
 * @param {string} unitbalanceslk
 */
export default function rebuild(map, commonj, blizzardj, unitbalanceslk) {
  let jassContext = new JassContext(map, commonj, blizzardj, unitbalanceslk);

  jassContext.debugMode = true;

  console.log('Parsing and running the global scope...');

  jassContext.start();

  console.log('Finished running global scope, running config()...');

  jassContext.call('config');

  console.log('Finished running config(), running main()...');

  jassContext.call('main');

  console.log('Finished running main()');

  window.jassContext = jassContext;
  // TO BE CONTINUED...
}
