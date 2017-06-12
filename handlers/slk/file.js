/**
 * @constructor
 * @classdesc An SLK file, used for table data by Warcraft 3.
 * @extends ViewerFile
 * @memberOf Slk
 * @param {ModelViewer} env
 * @param {function(?)} pathSolver
 */
function SlkFile(env, pathSolver) {
    ViewerFile.call(this, env, pathSolver);

    this.x = 0;
    this.y = 0;
    this.rows = [];
    this.mappedRows = [];
    this.map = {};
}

SlkFile.prototype = {
    get Handler() {
        return Slk;
    },

    initialize(src) {
        if (!src.startsWith("ID")) {
            this.onerror("InvalidSource", "WrongMagicNumber");
            return false;
        }

        this.parseRows(src);
        this.mapRows();
        this.mapByID();

        return true;
    },

    parseRows(src) {
        let lines = src.split("\n");

        for (let i = 0, l = lines.length; i < l; i++) {
            this.parseRow(lines[i]);
            
        }
    },

    parseRow(line) {
        // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
        // Therefore, just ignore it, since JavaScript arrays grow as they want either way
        if (line[0] !== "B") {
            let tokens = line.split(";"),
                rows = this.rows;

            for (let i = 1, l = tokens.length; i < l; i++) {
                let token = tokens[i],
                    value = token.substring(1);

                switch (token[0]) {
                    case "X":
                        this.x = parseInt(value, 10) - 1;
                        break;

                    case "Y":
                        this.y = parseInt(value, 10) - 1;
                        break;

                    case "K":
                        if (!rows[this.y]) {
                            rows[this.y] = [];
                        }

                        if (value[0] === "\"") {
                            rows[this.y][this.x] = value.trim().substring(1, value.length - 2);
                        } else {
                            rows[this.y][this.x] = parseFloat(value);
                        }

                        break;
                }
            }
        }
    },

    // This assumes the first row is a header that defines the names of the columns, which is how Blizzard SLKs are written
    mapRows() {
        var mappedRows = this.mappedRows,
            rows = this.rows,
            header = rows[0],
            mappedRow;

        // Hack to unify all the different ID strings
        header[0] = "ID";

        for (var i = 1, l = rows.length; i < l; i++) {
            mappedRows[i - 1] = this.mapRow(header, rows[i]);
        }
    },

    mapRow(header, row) {
        var mapped = {};

        for (var i = 0, l = header.length; i < l; i++) {

            mapped[header[i]] = row[i];
        }

        return mapped;
    },

    // This assumes that there is some ID to map every row against
    // It allows to get a row by its ID without an O(n) search
    mapByID() {
        var map = this.map,
            mappedRows = this.mappedRows,
            mappedRow;

        for (var i = 0, l = mappedRows.length; i < l; i++) {
            mappedRow = mappedRows[i];

            map[mappedRow.ID] = mappedRow;
        }
    },

    getRow(key) {
        return this.map[key];
    }
};

mix(SlkFile.prototype, ViewerFile.prototype);
