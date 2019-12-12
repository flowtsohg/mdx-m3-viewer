import BinaryStream from '../../../common/binarystream';
import ModificationTable from './modificationtable';

/**
 * war3map.w3u - the unit modification file.
 *
 * Also used for war3map.w3t (items), war3map.w3b (destructibles), and war3map.w3h (buffs).
 */
export default class War3MapW3u {
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
    this.originalTable.load(stream, false);
    this.customTable.load(stream, false);
  }

  save(stream?: BinaryStream) {
    if (!stream) {
      stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));
    }

    stream.writeInt32(this.version);
    this.originalTable.save(stream, false);
    this.customTable.save(stream, false);

    return stream.buffer;
  }

  getByteLength() {
    return 4 + this.originalTable.getByteLength(false) + this.customTable.getByteLength(false);
  }
}
