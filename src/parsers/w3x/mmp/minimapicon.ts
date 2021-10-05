import BinaryStream from '../../../common/binarystream';

/**
 * A minimap icon.
 */
export default class MinimapIcon {
  type = 0;
  location = new Int32Array(2);
  /**
   * Stored as BGRA.
   */
  color = new Uint8Array(4);

  load(stream: BinaryStream): void {
    this.type = stream.readInt32();
    stream.readInt32Array(this.location);
    stream.readUint8Array(this.color);
  }

  save(stream: BinaryStream): void {
    stream.writeInt32(this.type);
    stream.writeInt32Array(this.location);
    stream.writeUint8Array(this.color);
  }
}
