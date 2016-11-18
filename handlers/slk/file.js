function SlkLine(line) {
    var tokens = line.split(";"),
        token,
        value;

    // The B command is supposed to define the total number of columns and rows, however in UbetSplatData.slk it gives wrong information
    // Therefore, just ignore it, since JavaScript arrays grow as they want either way
    if (line[0] !== "B") {
        for (var i = 1, l = tokens.length; i < l; i++) {
            token = tokens[i];
            value = token.substring(1);

            switch (token[0]) {
                case "X":
                    this.x = parseInt(value, 10);
                    break;

                case "Y":
                    this.y = parseInt(value, 10);
                    break;

                case "K":
                    this.value = this.parseValue(value);
                    break;
            }
        }
    }
}

SlkLine.prototype = {
    parseValue(value) {
        if (value[0] === "\"") {
            return value.trim().substring(1, value.length - 2);
        }

        return parseFloat(value);
    }
}

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
        var rows = [],
            lines = src.split("\n"),
            line,
            x = 0,
            y = 0;

        for (var i = 0, l = lines.length; i < l; i++) {
            line = new SlkLine(lines[i]);

            if (line.y) {
                y = line.y - 1;

                // If this row doesn't exist yet, add it
                if (!rows[y]) {
                    rows[y] = [];
                }
            }

            if (line.x) {
                x = line.x - 1;
            }

            // Must check against undefined for 0 values
            if (line.value !== undefined) {
                // ...
                if (!rows[y]) {
                    rows[y] = [];
                }

                rows[y][x] = line.value;
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
