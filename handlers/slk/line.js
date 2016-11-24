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
