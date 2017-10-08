/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {boolean} useOptionalInts
 */
function W3xParserModification(reader, useOptionalInts) {
    this.id = reader.read(4);

    var variableType = reader.readInt32();

    if (useOptionalInts) {
        this.levelOrVariation = reader.readInt32();
        this.dataPointer = reader.readInt32();
    }

    if (variableType === 0) {
        this.value = reader.readInt32();
    } else if (variableType === 1 || variableType === 2) {
        this.value = reader.readFloat32();
    } else if (variableType === 3) {
        this.value = reader.readUntilNull();
    } else {
        console.log('W3xParserModification: unknown variable type', variableType);
    }

    var endModification = reader.read(4);
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {boolean} useOptionalInts
 */
function W3xParserModifiedObject(reader, useOptionalInts) {
    this.oldID = reader.read(4);
    this.newID = reader.read(4);

    this.modifications = [];

    for (var i = 0, l = reader.readInt32() ; i < l; i++) {
        this.modifications[i] = new W3xParserModification(reader, useOptionalInts);
    }
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {boolean} useOptionalInts
 */
function W3xParserModificationTable(reader, useOptionalInts) {
    this.objects = [];

    for (var i = 0, l = reader.readInt32(); i < l; i++) {
        this.objects[i] = new W3xParserModifiedObject(reader, useOptionalInts);
    }
}

export default W3xParserModificationTable;
