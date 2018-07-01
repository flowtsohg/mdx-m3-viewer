import SlkFile from '../parsers/slk/file';
import IniFile from '../parsers/ini/file';

/**
 * A structure that holds mapped data from INI and SLK files.
 * In the case of SLK files, the first row is expected to hold the names of the columns.
 */
export default class MappedData {
  /**
   * @param {?string} buffer
   */
  constructor(buffer) {
    /** @member {Object<string, Object<string, string>>} */
    this.map = {};

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * Load data from an SLK file or an INI file.
   * Note that this may override previous properties!
   *
   * @param {string} buffer
   */
  load(buffer) {
    if (buffer.startsWith('ID;')) {
      let file = new SlkFile(buffer);
      let rows = file.rows;
      let header = rows[0];
      let map = this.map;

      for (let i = 1, l = rows.length; i < l; i++) {
        let row = rows[i];
        let name = row[0];

        if (name) {
          name = name.toLowerCase();

          if (!map[name]) {
            map[name] = {};
          }

          let mapped = map[name];

          for (let j = 0, k = header.length; j < k; j++) {
            let key = header[j];

            // UnitBalance.slk doesn't define the name of one row.
            if (key === undefined) {
              key = `column${j}`;
            }

            mapped[key] = row[j];
          }
        }
      }
    } else {
      let file = new IniFile(buffer);
      let sections = file.sections;
      let map = this.map;

      for (let [row, properties] of sections.entries()) {
        if (!map[row]) {
          map[row] = {};
        }

        let mapped = map[row];

        for (let [name, property] of properties) {
          mapped[name] = property;
        }
      }
    }
  }

  /**
   * @param {string} key
   * @return {?Object<string, string>}
   */
  getRow(key) {
    return this.map[key.toLowerCase()];
  }

  /**
   * @param {string} key
   * @param {string} name
   * @return {?string}
   */
  getProperty(key, name) {
    return this.map[key.toLowerCase()][name];
  }

  /**
   * @param {string} key
   * @param {Object} values
   */
  setRow(key, values) {
    this.map[key.toLowerCase()] = values;
  }
}
