import SlkFile from '../parsers/slk/file';
import { IniFile } from '../parsers/ini/file';

/**
 * A MappedData row.
 */
export class MappedDataRow {
  map: {[key: string]: string } = {};

  set(key: string, value: string | number): void {
    if (typeof value !== 'string') {
      value = value.toString();
    }

    this.map[key.toLowerCase()] = value;
  }

  string(key: string): string | undefined {
    return this.map[key.toLowerCase()];
  }

  number(key: string): number {
    const string = this.string(key);

    if (!string) {
      return 0;
    }
    
    return parseFloat(string);
  }
}

/**
 * A structure that holds mapped data from INI and SLK files.
 * 
 * In the case of SLK files, the first row is expected to hold the names of the columns.
 */
export class MappedData {
  map: {[key: string]: MappedDataRow } = {};

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
  load(buffer: string): void {
    if (buffer.startsWith('ID;')) {
      const file = new SlkFile();
      file.load(buffer);

      const rows = file.rows;
      const header = rows[0];
      const map = this.map;

      for (let i = 1, l = rows.length; i < l; i++) {
        const row = rows[i];

        // DialogueDemonBase.slk has an empty row.
        if (row) {
          const name = row[0];

          // DialogueDemonBase.slk also has rows containing only a single underline.
          if (name && name !== '_') {
            if (!map[name]) {
              map[name] = new MappedDataRow();
            }

            const mapped = map[name];

            for (let j = 0, k = header.length; j < k; j++) {
              let key = header[j];

              // UnitBalance.slk doesn't define the name of one column.
              if (key === undefined) {
                key = `column${j}`;
              }

              mapped.map[key.toLowerCase()] = row[j];
            }
          }
        }
      }
    } else {
      const file = new IniFile();
      file.load(buffer);

      const sections = file.sections;
      const map = this.map;

      for (const [row, properties] of sections.entries()) {
        if (!map[row]) {
          map[row] = new MappedDataRow();
        }

        const mapped = map[row];

        for (const [name, property] of properties) {
          mapped.map[name.toLowerCase()] = property;
        }
      }
    }
  }

  getRow(key: string): MappedDataRow | undefined {
    return this.map[key];
  }

  getProperty(key: string, name: string): string {
    return this.map[key].map[name];
  }

  setRow(key: string, values: MappedDataRow): void {
    this.map[key] = values;
  }

  findRow(key: string, expectedValue: string): MappedDataRow | undefined {
    for (const row of Object.values(this.map)) {
      if (row.string(key) === expectedValue) {
        return row;
      }
    }

    return;
  }
}
