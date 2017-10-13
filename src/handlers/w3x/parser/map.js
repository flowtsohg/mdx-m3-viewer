import BinaryReader from '../../../binaryreader';
import BinaryWriter from '../../../binarywriter';
import MpqArchive from '../../mpq/parser/archive';
import W3xEnvironment from './environment';
import W3xDoodads from './doodads';
import W3xUnits from './units';
import W3xModificationTables from './modificationtables';

/**
 * Warcraft 3 map (W3X and W3M).
 * 
 * @constructor
 * @param {?ArrayBuffer} buffer If given an ArrayBuffer, load() will be called immediately
 * @param {?boolean} readonly If true, disables editing and saving the map (and the internal archive), allowing to optimize other things
 */
function W3xMap(buffer, readonly) {
    /** @member {?} */
    this.unknown = 0;
    /** @member {string} */
    this.name = '';
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.maxPlayers = 0;
    /** @member {MpqArchive} */
    this.archive = new MpqArchive(null, readonly);
    /** @member {?Map<string, W3xModificationTables>} */
    this.modifications = null;
    /** @member {?W3xEnvironment} */
    this.environment = null;
    /** @member {?W3xDoodads} */
    this.doodads = null;
    /** @member {?W3xUnits} */
    this.units = null;
    /** @member {boolean} */
    this.readonly = !!readonly;

    if (buffer instanceof ArrayBuffer) {
        this.load(buffer);
    }
}

W3xMap.prototype = {
    /**
     * Load an existing map.
     * Note that this clears the map from whatever it had in it before.
     * 
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    load(buffer) {
        let reader = new BinaryReader(buffer);
    
        if (reader.read(4) !== 'HM3W') {
            throw new Error('WrongMagicNumber');
        }
    
        // Read the header.
        this.unknown = reader.readUint32(); // ?
        this.name = reader.readUntilNull();
        this.flags = reader.readUint32();
        this.maxPlayers = reader.readUint32();

        // Read the archive.
        this.archive.load(buffer);
    
        // Clear stuff that needs clearing.
        this.modifications = null;
        this.environment = null;
        this.doodads = null;
        this.units = null;
        
        return true;
    },

    /**
     * Save this map.
     * If the archive is in readonly mode, returns null.
     * 
     * @returns {?ArrayBuffer}
     */
    save() {
        if (this.readonly) {
            return null;
        }

        let headerSize = 512,
            archiveBuffer = this.archive.save(),
            buffer = new ArrayBuffer(headerSize + archiveBuffer.byteLength),
            typedArray = new Uint8Array(buffer),
            writer = new BinaryWriter(buffer);

        // Write the header.
        writer.write('HM3W');
        writer.writeUint32(this.unknown);
        writer.write(`${this.name}\0`);
        writer.writeUint32(this.flags);
        writer.writeUint32(this.maxPlayers);

        // Writer the archive.
        typedArray.set(new Uint8Array(archiveBuffer), 512)

        return buffer;
    },

    /**
     * Read and parse the environment file.
     */
    readTerrain() {
        let file = this.archive.get('war3map.w3e');

        if (file) {
            this.environment = new W3xEnvironment(new BinaryReader(file.arrayBuffer()));
        }
    },

    /**
     * Read and parse the doodads file.
     */
    readDoodads() {
        let file = this.archive.get('war3map.doo');

        if (file) {
            this.doodads = new W3xDoodads(new BinaryReader(file.arrayBuffer()));
        }
    },

    /**
     * Read and parse the units file.
     */
    readUnits() {
        let file = this.archive.get('war3mapUnits.doo');

        if (file) {
            this.units = new W3xUnits(new BinaryReader(file.arrayBuffer()));
        }
    },

    /**
     * Read and parse all of the modification tables.
     */
    readModifications() {
        this.modifications = new Map();

        // useOptionalInts:
        //      w3u: no (units)
        //      w3t: no (items)
        //      w3b: no (destructables)
        //      w3d: yes (doodads)
        //      w3a: yes (abilities)
        //      w3h: no (buffs)
        //      w3q: yes (upgrades)
        this.readModificationTable('units', 'war3map.w3u', false);
        this.readModificationTable('items', 'war3map.w3t', false);
        this.readModificationTable('destructables', 'war3map.w3b', false);
        this.readModificationTable('doodads', 'war3map.w3d', true);
        this.readModificationTable('abilities', 'war3map.w3a', true);
        this.readModificationTable('buffs', 'war3map.w3h', false);
        this.readModificationTable('upgrades', 'war3map.w3q', true);
    },

    readModificationTable(type, path, useOptionalInts) {
        let file = this.archive.get(path);

        if (file) {
            this.modifications.set(type, new W3xModificationTables(new BinaryReader(file.arrayBuffer()), useOptionalInts));
        }
    }
};

export default W3xMap;
