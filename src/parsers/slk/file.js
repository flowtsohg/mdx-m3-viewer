export default class SlkFile {
    /**
     * @param {?string} src
     */
    constructor(src) {
        this.rows = [];
        this.map = {};

        if (typeof src === 'string') {
            this.load(src);
        }
    }

    load(src) {
        if (!src.startsWith('ID')) {
            throw new Error('WrongMagicNumber');
        }

        let rows = this.rows,
            x = 0,
            y = 0;
        
        for (let line of src.split('\n')) {
            // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
            // Therefore, just ignore it, since JavaScript arrays grow as they want either way
            if (line[0] !== 'B') {
                for (let token of line.split(';')) {
                    let op = token[0],
                        valueString = token.substring(1).trim(),
                        value;

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
                        }
                        
                        rows[y][x] = value;
                    }
                }
            }
        }

        let header = rows[0],
            map = this.map;
            
        for (let i = 1, l = rows.length; i < l; i++) {
            let row = rows[i],
                mapped = {};

            for (let j = 0, k = header.length; j < k; j++) {
                let key = header[j];

                // UnitBalance.slk doesn't define the name of one row.
                if (key === undefined) {
                    key = `column${j}`;
                }

                mapped[key] = row[j];
            }

            map[row[0]] = mapped;
        }
    }

    getRow(index) {
        return this.rows[index];
    }

    getRowByKey(key) {
        return this.map[key];
    }
};
