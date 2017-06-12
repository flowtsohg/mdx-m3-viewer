/**
 * @constructor
 * @param {ArrayBuffer} src
 */
function M3Parser(src) {
    let reader = new M3ParserBinaryReader(src),
        header = new M3ParserMD34(reader);

    this.entries = [];
    this.model = null;

    if (header.tag === "MD34") {
        reader.seek(header.offset);

        // Read the index entries
        for (let i = 0, l = header.entries; i < l; i++) {
            this.entries[i] = new M3ParserIndexEntry(reader, this.entries);
        }

        this.model = this.entries[header.model.id].entries[0];
    } else {
        throw new Error("WrongMagicNumber");
    }
}
