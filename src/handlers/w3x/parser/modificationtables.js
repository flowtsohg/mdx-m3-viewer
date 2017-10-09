import W3xModificationTable from './modificationtable';

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xModificationTables(reader, useOptionalInts) {
    this.version = reader.readInt32();

    // Modifications to built-in objects
    this.originalTable = new W3xModificationTable(reader, useOptionalInts);

    // Declarations of user-defined objects
    this.customTable = new W3xModificationTable(reader, useOptionalInts);

}

export default W3xModificationTables;
