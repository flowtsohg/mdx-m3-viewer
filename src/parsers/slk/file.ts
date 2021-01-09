/**
 * A SLK table file.
 */
export default class SlkFile {
  rows: (string | number | boolean)[][] = [];

  load(buffer: string) {
    if (!buffer.startsWith('ID')) {
      throw new Error('WrongMagicNumber');
    }

    let rows = this.rows;
    let x = 0;
    let y = 0;

    for (let line of buffer.split('\n')) {
      // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
      // Therefore, just ignore it, since JavaScript arrays grow as they want either way
      if (line[0] !== 'B') {
        for (let token of line.split(';')) {
          let op = token[0];
          let valueString = token.substring(1).trim();
          let value;

          if (op === 'X') {
            x = parseInt(valueString, 10) - 1;
          } else if (op === 'Y') {
            y = parseInt(valueString, 10) - 1;
          } else if (op === 'K') {
            if (!rows[y]) {
              rows[y] = [];
            }

            if (valueString[0] === '"') {
              value = valueString.substring(1, valueString.length - 1);
            } else if (valueString === 'TRUE') {
              value = true;
            } else if (valueString === 'FALSE') {
              value = false;
            } else {
              value = parseFloat(valueString);

              if (isNaN(value)) {
                value = valueString;
              }
            }

            rows[y][x] = value;
          }
        }
      }
    }
  }

  save() {
    let rows = this.rows;
    let rowCount = rows.length;
    let lines = [];
    let biggestColumn = 0;

    for (let y = 0; y < rowCount; y++) {
      let row = rows[y];
      let columnCount = row.length;

      if (columnCount > biggestColumn) {
        biggestColumn = columnCount;
      }

      let firstOfRow = true;

      for (let x = 0; x < columnCount; x++) {
        let value = row[x];

        if (value !== undefined) {
          let encoded;

          if (typeof value === 'string') {
            encoded = `"${value}"`;
          } else if (typeof value === 'boolean') {
            if (value) {
              encoded = 'TRUE';
            } else {
              encoded = 'FALSE';
            }
          } else {
            encoded = `${value}`;
          }

          if (firstOfRow) {
            firstOfRow = false;

            lines.push(`C;X${x + 1};Y${y + 1};K${encoded}`);
          } else {
            lines.push(`C;X${x + 1};K${encoded}`);
          }
        }
      }
    }

    return `ID;P\r\nB;X${biggestColumn};Y${rowCount}\r\n${lines.join('\r\n')}\r\nE`;
  }
}
