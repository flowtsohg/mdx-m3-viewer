import SlkFile from '../parsers/slk/file';
import IniFile from '../parsers/ini/file';

export type MappedDataValue = string | number | boolean;

/**
 * A MappedData row.
 */
export type MappedDataRow = { [key: string]: MappedDataValue };

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
      let file = new SlkFile();
      file.load(buffer);

      let rows = file.rows;
      let header = rows[0];
      let map = this.map;

      for (let i = 1, l = rows.length; i < l; i++) {
        let row = rows[i];

        // DialogueDemonBase.slk has an empty row.
        if (row) {
          let name = <string>row[0];

          // DialogueDemonBase.slk also has rows containing only a single underline.
          if (name && name !== '_') {
            name = name.toLowerCase();

            if (!map[name]) {
              map[name] = {};
            }

            let mapped = map[name];

            for (let j = 0, k = header.length; j < k; j++) {
              let key = header[j];

              // UnitBalance.slk doesn't define the name of one column.
              if (key === undefined) {
                key = `column${j}`;
              }

              mapped[`${key}`] = row[j];
            }
          }
        }
      }
    } else {
      let file = new IniFile();
      file.load(buffer);

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

  findRow(key: string, expectedValue: MappedDataValue) {
    for (let row of Object.values(this.map)) {
      if (row[key] === expectedValue) {
        return row;
      }
    }
  }
}
