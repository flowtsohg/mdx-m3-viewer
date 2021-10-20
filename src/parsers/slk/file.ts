/**
 * A SLK table file.
 */
export default class SlkFile {
  rows: string[][] = [];

  load(buffer: string): void {
    if (!buffer.startsWith('ID')) {
      throw new Error('WrongMagicNumber');
    }

    const rows = this.rows;
    let x = 0;
    let y = 0;

    for (const line of buffer.split('\n')) {
      // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
      // Therefore, just ignore it, since JavaScript arrays grow as they want either way
      if (line[0] !== 'B') {
        for (const token of line.split(';')) {
          const op = token[0];
          const valueString = token.substring(1).trim();
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
              value = valueString.slice(1, -1);
            } else {
              value = valueString;
            }

            rows[y][x] = value;
          }
        }
      }
    }
  }

  save(): string {
    const rows = this.rows;
    const rowCount = rows.length;
    const lines = [];
    let biggestColumn = 0;

    for (let y = 0; y < rowCount; y++) {
      const row = rows[y];
      const columnCount = row.length;

      if (columnCount > biggestColumn) {
        biggestColumn = columnCount;
      }

      let firstOfRow = true;

      for (let x = 0; x < columnCount; x++) {
        const value = row[x];

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
