import BinaryStream from '../../../common/binarystream';

/**
 * An inventory item.
 */
export default class InventoryItem {
  slot = 0;
  id = '\0\0\0\0';

  load(stream: BinaryStream) {
    this.slot = stream.readInt32();
    this.id = stream.readBinary(4);
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.slot);
    stream.writeBinary(this.id);
  }
}
