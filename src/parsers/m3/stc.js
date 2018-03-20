import M3ParserReference from './reference';

export default class M3ParserStc {
    /**
     * @param {BinaryReader} reader
     * @param {number} version
     * @param {Array<M3ParserIndexEntry>} index
     */
    constructor(reader, version, index) {
        /** @member {number} */
        this.version = version;
        /** @member {M3ParserReference} */
        this.name = new M3ParserReference(reader, index);
        /** @member {number} */
        this.runsConcurrent = reader.readUint16();
        /** @member {number} */
        this.priority = reader.readUint16();
        /** @member {number} */
        this.stsIndex = reader.readUint16();
        /** @member {number} */
        this.stsIndexCopy = reader.readUint16(); // ?
        /** @member {M3ParserReference} */
        this.animIds = new M3ParserReference(reader, index);
        /** @member {M3ParserReference} */
        this.animRefs = new M3ParserReference(reader, index);

        reader.skip(4); // ?

        /** @member {Array<M3ParserReference>} */
        this.sd = [
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index),
            new M3ParserReference(reader, index)
        ];
    }
};
