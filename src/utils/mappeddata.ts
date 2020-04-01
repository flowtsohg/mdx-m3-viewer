import SlkFile from '../parsers/slk/file';
import IniFile from '../parsers/ini/file';

/**
 * A MappedData row.
 */
export type MappedDataRow = { [key: string]: string | number | boolean };

/**
 * A structure that holds mapped data from INI and SLK files.
 * 
 * In the case of SLK files, the first row is expected to hold the names of the columns.
 */
export class MappedData {
  map: { [key: string]: MappedDataRow } = {};

  constructor(buffer?: string) {
    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * Load data from an SLK file or an INI file.
   * 
   * Note that this may override previous properties!
   */
  load(buffer: string) {
    if (buffer.startsWith('ID;')) {
      let file = new SlkFile(buffer);
      let rows = file.rows;
      let header = rows[0];
      let map = this.map;

      for (let i = 1, l = rows.length; i < l; i++) {
        let row = rows[i];
        let name = <string>row[0];

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

            mapped[`${key}`] = row[j];
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

  getRow(key: string) {
    return this.map[key.toLowerCase()];
  }

  getProperty(key: string, name: string) {
    return this.map[key.toLowerCase()][name];
  }

  setRow(key: string, values: MappedDataRow) {
    this.map[key.toLowerCase()] = values;
  }
}
