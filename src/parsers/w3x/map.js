import BinaryStream from '../../common/binarystream';
import MpqArchive from '../mpq/archive';
import War3MapDoo from './war3map.doo/file';
import War3MapImp from './war3map.imp/file';
import War3MapMmp from './war3map.mmp/file';
import War3MapShd from './war3map.shd/file';
import War3MapW3c from './war3map.w3c/file';
import War3MapW3d from './war3map.w3d/file';
import War3MapW3e from './war3map.w3e/file';
import War3MapW3i from './war3map.w3i/file';
import War3MapW3o from './war3map.w3o/file';
import War3MapW3r from './war3map.w3r/file';
import War3MapW3s from './war3map.w3s/file';
import War3MapW3u from './war3map.w3u/file';
import War3MapWct from './war3map.wct/file';
import War3MapWpm from './war3map.wpm/file';
import War3MapWtg from './war3map.wtg/file';
import War3MapUnitsDoo from './war3mapUnits.doo/file';

/**
 * Warcraft 3 map (W3X and W3M).
 * 
 * @constructor
 * @param {?ArrayBuffer} buffer If given an ArrayBuffer, load() will be called immediately
 * @param {?boolean} readonly If true, disables editing and saving the map (and the internal archive), allowing to optimize other things
 */
function War3Map(buffer, readonly) {
    /** @member {number} */
    this.unknown = 0;
    /** @member {string} */
    this.name = '';
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.maxPlayers = 0;
    /** @member {MpqArchive} */
    this.archive = new MpqArchive(null, readonly);
    /** @member {War3MapImp} */
    this.imports = new War3MapImp();
    /** @member {boolean} */
    this.readonly = !!readonly;

    if (buffer) {
        this.load(buffer);
    }
}

War3Map.prototype = {
    /**
     * Load an existing map.
     * Note that this clears the map from whatever it had in it before.
     * 
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    load(buffer) {
        let reader = new BinaryStream(buffer);
    
        if (reader.read(4) !== 'HM3W') {
            return false;
        }

        // Read the header.
        this.u1 = reader.readUint32();
        this.name = reader.readUntilNull();
        this.flags = reader.readUint32();
        this.maxPlayers = reader.readUint32();

        // Read the archive.
        // If it failed to be read, abort.
        if (!this.archive.load(buffer)) {
            return false;
        }
    
        // Read in the imports file if there is one.
        this.readImports();
        
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

        // Update the imports if needed.
        this.setImportsFile();

        let headerSize = 512,
            archiveBuffer = this.archive.save(),
            buffer = new ArrayBuffer(headerSize + archiveBuffer.byteLength),
            typedArray = new Uint8Array(buffer),
            writer = new BinaryStream(buffer);

        // Write the header.
        writer.write('HM3W');
        writer.writeUint32(this.u1);
        writer.write(`${this.name}\0`);
        writer.writeUint32(this.flags);
        writer.writeUint32(this.maxPlayers);

        // Writer the archive.
        typedArray.set(new Uint8Array(archiveBuffer), 512)

        return buffer;
    },

    /**
     * A shortcut to the internal archive function.
     * 
     * @returns {Array<string>}
     */
    getFileNames() {
        return this.archive.getFileNames();
    },

    /**
     * Gets a list of the file names imported in this map.
     * 
     * @returns {Array<string>}
     */
    getImportNames() {
        let names = [];
        
        for (let entry of this.imports.entries.values()) {
            names.push(entry.path);
        }

        return names;
    },

    /**
     * Sets the imports file with all of the imports.
     * Does nothing if the archive is in readonly mode.
     * 
     * @returns {boolean}
     */
    setImportsFile() {
        if (this.readonly) {
            return false;
        }

        if (this.imports.entries.size > 0) {
            return this.set('war3map.imp', this.imports.save());
        }

        return false;
    },

    /**
     * Imports a file to this archive.
     * If the file already exists, its buffer will be set.
     * Files added to the archive but not to the imports list will be deleted by the World Editor automatically.
     * This of course doesn't apply to internal map files.
     * Does nothing if the archive is in readonly mode.
     * 
     * @param {string} name
     * @param {ArrayBuffer} buffer
     * @returns {boolean}
     */
    import(name, buffer) {
        if (this.readonly) {
            return false;
        }

        if (this.archive.set(name, buffer)) {
            this.imports.set(name);

            return true;
        }
        
        return false;
    },

    /**
     * A shortcut to the internal archive function.
     * 
     * @returns {boolean}
     */
    set(name, buffer) {
        if (this.readonly) {
            return false;
        }

        return this.archive.set(name, buffer);
    },

    /**
     * A shortcut to the internal archive function.
     * 
     * @returns {?MpqFile}
     */
    get(name) {
        return this.archive.get(name);
    },

    /**
     * A shortcut to the internal archive function.
     * 
     * @returns {boolean}
     */
    has(name) {
        return this.archive.has(name);
    },

    /**
     * Deletes a file from the internal archive.
     * Note that if the file is in the imports list, it will be removed from it too.
     * Use this rather than the internal archive's delete.
     * 
     * @param {string} name
     * @returns {boolean}
     */
    delete(name) {
        if (this.readonly) {
            return false;
        }

        // If this file is in the import list, remove it.
        this.imports.delete(name);

        return this.archive.delete(name);
    },

    /**
     * A shortcut to the internal archive function.
     * 
     * @returns {boolean}
     */
    rename(name, newName) {
        if (this.readonly) {
            return false;
        }

        if (this.archive.rename(name, newName)) {
            // If the file was actually renamed, and it is an import, rename also the import entry.
            this.imports.rename(name, newName);

            return true;
        }

        return false;
    },

    /**
     * Read the imports file.
     */
    readImports() {
        let file = this.archive.get('war3map.imp');

        if (file) {
            let buffer = file.arrayBuffer();

            if (buffer) {
                this.imports.load(buffer);
            }
        }
    },

    /**
     * Read the environment file.
     */
    readEnvironment() {
        let file = this.archive.get('war3map.w3e');

        if (file) {
            return new War3MapW3e(file.arrayBuffer());
        }
    },

    /**
     * Read and parse the doodads file.
     */
    readDoodads() {
        let file = this.archive.get('war3map.doo');

        if (file) {
            return new War3MapDoo(file.arrayBuffer());
        }
    },

    /**
     * Read and parse the units file.
     */
    readUnits() {
        let file = this.archive.get('war3mapUnits.doo');

        if (file) {
            return new War3MapUnitsDoo(file.arrayBuffer());
        }
    },

    readTriggers() {
        let file = this.archive.get('war3map.wtg');
        
        if (file) {
            return new War3MapWtg(file.arrayBuffer(), this.argumentMap);
        }
    },

    /**
     * Read and parse all of the modification tables.
     */
    readModifications() {
        let modifications = new Map();

        // useOptionalInts:
        //      w3u: no (units)
        //      w3t: no (items)
        //      w3b: no (destructables)
        //      w3d: yes (doodads)
        //      w3a: yes (abilities)
        //      w3h: no (buffs)
        //      w3q: yes (upgrades)
        this.readModificationTable(modifications, 'units', 'war3map.w3u', false);
        this.readModificationTable(modifications, 'items', 'war3map.w3t', false);
        this.readModificationTable(modifications, 'destructables', 'war3map.w3b', false);
        this.readModificationTable(modifications, 'doodads', 'war3map.w3d', true);
        this.readModificationTable(modifications, 'abilities', 'war3map.w3a', true);
        this.readModificationTable(modifications, 'buffs', 'war3map.w3h', false);
        this.readModificationTable(modifications, 'upgrades', 'war3map.w3q', true);

        return modifications;
    },

    readModificationTable(modifications, type, path, useOptionalInts) {
        let file = this.archive.get(path);

        if (file) {
            if (useOptionalInts) {
                modifications.set(type, new War3MapW3d(file.arrayBuffer()));
            } else {
                modifications.set(type, new War3MapW3u(file.arrayBuffer()));
            }
        }
    },

    addTriggerDataSection(map, section, hasReturn) {
        for (let [key, value] of section) {
            // We don't care about metadata lines.
            if (key[0] !== '_') {
                let count = 0;

                for (let argument of value.split(',')) {
                    // We don't care about constants.
                    if (isNaN(argument) && argument !== 'nothing' && argument !== '') {
                        count += 1;
                    }
                }

                // The [TriggerCalls] section entries define trigger getters etc.
                // The last argument is the return type, rather than an argument.
                if (hasReturn) {
                    count -= 1;
                }

                map.set(key, count);
            }
        }
    },

    readTriggerData(triggerData) {
        let map = new Map();

        this.addTriggerDataSection(map, triggerData.getSection('TriggerActions'), false);
        this.addTriggerDataSection(map, triggerData.getSection('TriggerEvents'), false);
        this.addTriggerDataSection(map, triggerData.getSection('TriggerConditions'), false);
        this.addTriggerDataSection(map, triggerData.getSection('TriggerCalls'), true);

        return map;
    },

    rebuild() {
        // war3map.j - Map script.
        //if (this.rename('scripts\\war3map.j', 'war3map.j')) {
        //    console.log('Renamed scripts\\war3map.j to war3map.j');
        //}

        // war3map.w3i
        console.log('');

        // war3map.wtg - Triggers.
        if (!this.has('war3map.wtg')) {
            console.log('Need to rebuild war3map.wtg');
        }

        // war3map.w3c - Camera settings.
        if (!this.has('war3map.w3c')) {
            console.log('Need to rebuild war3map.w3c');
        }

        // war3map.w3s - World Editor sounds.
        if (!this.has('war3map.w3s')) {
            console.log('Need to rebuild war3map.w3s');
        }

        // war3map.w3r - Regions.
        if (!this.has('war3map.w3r')) {
            console.log('Need to rebuild war3map.w3r');
        }

        // war3mapUnits.doo - Units and items.
        if (!this.has('war3mapUnits.doo')) {
            console.log('Need to rebuild war3mapUnits.doo');
        }
    }
};

export default War3Map;
