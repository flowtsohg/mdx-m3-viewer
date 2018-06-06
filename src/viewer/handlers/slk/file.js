import Resource from '../../resource';
import SlkParser from '../../../parsers/slk/file';

/**
 * A mapped SLK implementation.
 */
export default class SlkFile extends Resource {
  /**
   * @param {Object} resourceData
   */
  constructor(resourceData) {
    super(resourceData);

    /** @member {Object<string, Object<string, string>>} */
    this.map = {};
  }

  /**
   * @param {string} buffer
   */
  load(buffer) {
    let parser = new SlkParser();

    parser.load(buffer);

    let rows = parser.rows;
    let header = rows[0];
    let map = this.map;

    for (let i = 1, l = rows.length; i < l; i++) {
      let row = rows[i];
      let name = row[0];

      // Supports both loading a new table, and also merging another table with this one.
      let mapped = map[name] || {};

      for (let j = 0, k = header.length; j < k; j++) {
        let key = header[j];

        // UnitBalance.slk doesn't define the name of one row.
        if (key === undefined) {
          key = `column${j}`;
        }

        mapped[key] = row[j];
      }

      map[name] = mapped;
    }
  }

  /**
   * @param {string} key
   * @return {Object<string, string>}
   */
  getRow(key) {
    return this.map[key];
  }

  /**
   * @param {string} key
   * @param {string} name
   * @return {string}
   */
  getProperty(key, name) {
    return this.map[key][name];
  }
}
