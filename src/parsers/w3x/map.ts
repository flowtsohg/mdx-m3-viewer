import BinaryStream from '../../common/binarystream';
import MpqArchive from '../mpq/archive';
import War3MapDoo from './doo/file';
import War3MapImp from './imp/file';
// import War3MapMmp from './mmp/file';
// import War3MapShd from './shd/file';
// import War3MapW3c from './w3c/file';
import War3MapW3d from './w3d/file';
import War3MapW3e from './w3e/file';
import War3MapW3i from './w3i/file';
// import War3MapW3o from './w3o/file';
// import War3MapW3r from './w3r/file';
// import War3MapW3s from './w3s/file';
import War3MapW3u from './w3u/file';
import War3MapWct from './wct/file';
// import War3MapWpm from './wpm/file';
import War3MapWtg from './wtg/file';
import War3MapWts from './wts/file';
import War3MapUnitsDoo from './unitsdoo/file';
import TriggerData from './wtg/triggerdata';

type War3MapModificationNames = 'w3a' | 'w3b' | 'w3d' | 'w3h' | 'w3q' | 'w3t' | 'w3u';

interface War3MapModifications {
  w3a?: War3MapW3d;
  w3b?: War3MapW3u;
  w3d?: War3MapW3d;
  w3h?: War3MapW3u;
  w3q?: War3MapW3d;
  w3t?: War3MapW3u;
  w3u?: War3MapW3u;
}

/**
 * Warcraft 3 map (W3X and W3M).
 */
export default class War3Map {
  unknown: number = 0;
  name: string = '';
  flags: number = 0;
  maxPlayers: number = 0;
  archive: MpqArchive;
  imports: War3MapImp;
  readonly: boolean;
  u1: number = 0;

  /**
   * If buffer is given, it will be loaded instantly.
   * 
   * If readonly is true, the map and internal archive won't be editable or saveable, which allows to optimize some operations.
   */
  constructor(buffer: ArrayBuffer | undefined = undefined, readonly: boolean = false) {
    this.archive = new MpqArchive(undefined, readonly);
    this.imports = new War3MapImp();
    this.readonly = readonly;

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * Load an existing map.
   * 
   * Note that this clears the map from whatever it had in it before.
   */
  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    // The header no longer exists since some 1.3X.X patch?
    if (stream.read(4) === 'HM3W') {
      this.u1 = stream.readUint32();
      this.name = stream.readUntilNull();
      this.flags = stream.readUint32();
      this.maxPlayers = stream.readUint32();
    }

    // Read the archive.
    // If it failed to be read, abort.
    if (!this.archive.load(buffer)) {
      return false;
    }

    // Read in the imports file if there is one.
    this.readImports();

    return true;
  }

  /**
   * Save this map.
   * If the archive is in readonly mode, returns null.
   */
  save() {
    if (this.readonly) {
      return null;
    }

    // Update the imports if needed.
    this.setImportsFile();

    let headerSize = 512;
    let archiveBuffer = this.archive.save();

    if (!archiveBuffer) {
      return null;
    }

    let buffer = new ArrayBuffer(headerSize + archiveBuffer.byteLength);
    let typedArray = new Uint8Array(buffer);
    let stream = new BinaryStream(buffer);

    // Write the header.
    stream.write('HM3W');
    stream.writeUint32(this.u1);
    stream.write(`${this.name}\0`);
    stream.writeUint32(this.flags);
    stream.writeUint32(this.maxPlayers);

    // Write the archive.
    typedArray.set(new Uint8Array(archiveBuffer), headerSize);

    return buffer;
  }

  /**
   * A shortcut to the internal archive function.
   */
  getFileNames() {
    return this.archive.getFileNames();
  }

  /**
   * Gets a list of the file names imported in this map.
   */
  getImportNames() {
    let names = [];

    for (let entry of this.imports.entries.values()) {
      let isCustom = entry.isCustom;

      if (isCustom === 10 || isCustom === 13) {
        names.push(entry.path);
      } else {
        names.push(`war3mapImported\\${entry.path}`);
      }
    }

    return names;
  }

  /**
   * Sets the imports file with all of the imports.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  setImportsFile() {
    if (this.readonly) {
      return false;
    }

    if (this.imports.entries.size > 0) {
      return this.set('war3map.imp', this.imports.save());
    }

    return false;
  }

  /**
   * Imports a file to this archive.
   * 
   * If the file already exists, its buffer will be set.
   * 
   * Files added to the archive but not to the imports list will be deleted by the World Editor automatically.
   * This of course doesn't apply to internal map files.
   * 
   * Does nothing if the archive is in readonly mode.
   */
  import(name: string, buffer: ArrayBuffer | string) {
    if (this.readonly) {
      return false;
    }

    if (this.archive.set(name, buffer)) {
      this.imports.set(name);

      return true;
    }

    return false;
  }

  /**
   * A shortcut to the internal archive function.
   */
  set(name: string, buffer: ArrayBuffer | string) {
    if (this.readonly) {
      return false;
    }

    return this.archive.set(name, buffer);
  }

  /**
   * A shortcut to the internal archive function.
   */
  get(name: string) {
    return this.archive.get(name);
  }

  /**
   * Get the map's script.
   */
  getScriptFile() {
    return this.get('war3map.j') || this.get('scripts\\war3map.j') || this.get('war3map.lua') || this.get('scripts\\war3map.lua');
  }

  /**
   * A shortcut to the internal archive function.
   */
  has(name: string) {
    return this.archive.has(name);
  }

  /**
   * Deletes a file from the internal archive.
   * 
   * Note that if the file is in the imports list, it will be removed from it too.
   * 
   * Use this rather than the internal archive's delete.
   */
  delete(name: string) {
    if (this.readonly) {
      return false;
    }

    // If this file is in the import list, remove it.
    this.imports.delete(name);

    return this.archive.delete(name);
  }

  /**
   * A shortcut to the internal archive function.
   */
  rename(name: string, newName: string) {
    if (this.readonly) {
      return false;
    }

    if (this.archive.rename(name, newName)) {
      // If the file was actually renamed, and it is an import, rename also the import entry.
      this.imports.rename(name, newName);

      return true;
    }

    return false;
  }

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
  }

  /**
   * Read the map information file.
   */
  readMapInformation() {
    let file = this.archive.get('war3map.w3i');

    if (file) {
      let buffer = file.arrayBuffer();

      if (buffer) {
        return new War3MapW3i(buffer);
      }
    }
  }

  /**
   * Read the environment file.
   */
  readEnvironment() {
    let file = this.archive.get('war3map.w3e');

    if (file) {
      let buffer = file.arrayBuffer();

      if (buffer) {
        return new War3MapW3e(buffer);
      }
    }
  }

  /**
   * Read and parse the doodads file.
   */
  readDoodads() {
    let file = this.archive.get('war3map.doo');

    if (file) {
      let buffer = file.arrayBuffer();

      if (buffer) {
        return new War3MapDoo(buffer);
      }
    }
  }

  /**
   * Read and parse the units file.
   */
  readUnits() {
    let file = this.archive.get('war3mapUnits.doo');

    if (file) {
      let buffer = file.arrayBuffer();

      if (buffer) {
        return new War3MapUnitsDoo(buffer);
      }
    }
  }

  /**
   * Read and parse the trigger file.
   */
  readTriggers(triggerData: TriggerData) {
    let file = this.archive.get('war3map.wtg');

    if (file) {
      let buffer = file.arrayBuffer();

      if (buffer) {
        return new War3MapWtg(buffer, triggerData);
      }
    }
  }

  /**
   * Read and parse the custom text trigger file.
   */
  readCustomTextTriggers() {
    let file = this.archive.get('war3map.wct');

    if (file) {
      let buffer = file.arrayBuffer();

      if (buffer) {
        return new War3MapWct(buffer);
      }
    }
  }

  /**
   * Read and parse the string table file.
   */
  readStringTable() {
    let file = this.archive.get('war3map.wts');

    if (file) {
      let buffer = file.text();

      if (buffer) {
        return new War3MapWts(buffer);
      }
    }
  }

  /**
   * Read and parse all of the modification tables.
   */
  readModifications() {
    let modifications: War3MapModifications = {};

    // useOptionalInts:
    //      w3u: no (units)
    //      w3t: no (items)
    //      w3b: no (destructables)
    //      w3d: yes (doodads)
    //      w3a: yes (abilities)
    //      w3h: no (buffs)
    //      w3q: yes (upgrades)
    let fileNames: War3MapModificationNames[] = ['w3u', 'w3t', 'w3b', 'w3d', 'w3a', 'w3h', 'w3q'];
    let useOptionalInts = [false, false, false, true, true, false, true];

    for (let i = 0, l = fileNames.length; i < l; i++) {
      let file = this.archive.get(`war3map.${fileNames[i]}`);

      if (file) {
        let buffer = file.arrayBuffer();

        if (buffer) {
          let modification;

          if (useOptionalInts[i]) {
            modification = new War3MapW3d(buffer);
          } else {
            modification = new War3MapW3u(buffer);
          }

          modifications[fileNames[i]] = modification;
        }
      }
    }

    return modifications;
  }
}
