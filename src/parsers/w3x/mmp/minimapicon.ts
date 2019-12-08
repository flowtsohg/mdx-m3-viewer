import BinaryStream from '../../../common/binarystream';

/**
 * A minimap icon.
 */
export default class MinimapIcon {
  type: number;
  location: Int32Array;
  /**
   * Stored as BGRA.
   */
  color: Uint8Array;

  constructor() {
    this.type = 0;
    this.location = new Int32Array(2);
    this.color = new Uint8Array(4);
  }

  load(stream: BinaryStream) {
    this.type = stream.readInt32();
    this.location = stream.readInt32Array(2);
    this.color = stream.readUint8Array(4);
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.type);
    stream.writeInt32Array(this.location);
    stream.writeUint8Array(this.color);
  }
}
