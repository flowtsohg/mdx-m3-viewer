import BinaryStream from '../../common/binarystream';
import M3ParserMd34 from './md34';
import M3ParserIndexEntry from './indexentry';

/**
 * @constructor
 * @param {ArrayBuffer} src
 */
function Model(src) {
    let reader = new BinaryStream(src),
        header = new M3ParserMd34(reader);

    /** @member {Array<M3ParserIndexEntry>} */
    this.entries = [];
    /** @member {?ModelHeader} */
    this.model = null;

    if (header.tag === 'MD34') {
        reader.seek(header.offset);

        // Read the index entries
        for (let i = 0, l = header.entries; i < l; i++) {
            this.entries[i] = new M3ParserIndexEntry(reader, this.entries);
        }

        this.model = this.entries[header.model.id].entries[0];
    } else {
        throw new Error('WrongMagicNumber');
    }
}

export default Model;
