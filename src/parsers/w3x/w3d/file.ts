import BinaryStream from '../../../common/binarystream';
import ModificationTable from '../w3u/modificationtable';

/**
 * war3map.w3d - the doodad modification file.
 *
 * Also used for war3map.w3a (abilities), and war3map.w3q (upgrades).
 */
export default class War3MapW3d {
  version: number = 0;
  originalTable: ModificationTable = new ModificationTable();
  customTable: ModificationTable = new ModificationTable();

  constructor(bufferOrStream?: ArrayBuffer | BinaryStream) {
    if (bufferOrStream) {
      this.load(bufferOrStream);
    }
  }

  load(bufferOrStream: ArrayBuffer | BinaryStream) {
    let stream;

    if (bufferOrStream instanceof ArrayBuffer) {
      stream = new BinaryStream(bufferOrStream);
    } else {
      stream = bufferOrStream;
    }

    this.version = stream.readInt32();
    this.originalTable.load(stream, true);
    this.customTable.load(stream, true);
  }

  save(stream?: BinaryStream) {
    if (!stream) {
      stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));
    }

    stream.writeInt32(this.version);
    this.originalTable.save(stream, true);
    this.customTable.save(stream, true);

    return stream.buffer;
  }

  getByteLength() {
    return 4 + this.originalTable.getByteLength(true) + this.customTable.getByteLength(true);
  }
}
