import W3xParserModificationTable from './modificationtable';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xParserModificationTables(reader, useOptionalInts) {
    this.version = reader.readInt32();

    // Modifications to built-in objects
    this.originalTable = new W3xParserModificationTable(reader, useOptionalInts);

    // Declarations of user-defined objects
    this.customTable = new W3xParserModificationTable(reader, useOptionalInts);

}

export default W3xParserModificationTables;
