/**
 * @class
 * @classdesc An SLK file, used for table data by Warcraft 3.
 * @extends GenericFile
 * @memberOf Slk
 * @param {ModelViewer} env The model viewer object that this texture belongs to.
 * @param {function} pathSolver A function that solves paths. See more {@link PathSolver here}.
 */
function SlkFile(env, pathSolver) {
    GenericFile.call(this, env, pathSolver);
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
        let rows = [],
            lines = src.split("\n"),
            line,
            tokens,
            x = 0,
            y = 0;

        for (let i = 0, l = lines.length; i < l; i++) {
            line = lines[i];

            // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
            // Therefore, just ignore it, since JavaScript arrays grow as they want either way
            if (line[0] !== "B") {
                tokens = line.split(";")

                for (let i = 1, l = tokens.length; i < l; i++) {
                    token = tokens[i];
                    value = token.substring(1);

                    switch (token[0]) {
                        case "X":
                            x = parseInt(value, 10) - 1;
                            break;

                        case "Y":
                            y = parseInt(value, 10) - 1;
                            break;

                        case "K":
                            if (!rows[y]) {
                                rows[y] = [];
                            }

                            if (value[0] === "\"") {
                                rows[y][x] = value.trim().substring(1, value.length - 2);
                            } else {
                                rows[y][x] = parseFloat(value);
                            }

                            break;
                    }
                }
            }
        }

        this.rows = rows;
    },

    // This assumes the first row is a header that defines the names of the columns, which is how Blizzard SLKs are written
    mapRows() {
        var mappedRows = [],
            rows = this.rows,
            header = rows[0],
            mappedRow;

        // Hack to unify all the different ID strings
        header[0] = "ID";

        for (var i = 1, l = rows.length; i < l; i++) {
            mappedRows[i - 1] = this.mapRow(header, rows[i]);
        }

        this.mappedRows = mappedRows;
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
        var map = {},
            mappedRows = this.mappedRows,
            mappedRow;

        for (var i = 0, l = mappedRows.length; i < l; i++) {
            mappedRow = mappedRows[i];

            map[mappedRow.ID] = mappedRow;
        }

        this.map = map;
    },

    getRow(key) {
        return this.map[key];
    }
};

mix(SlkFile.prototype, GenericFile.prototype);
