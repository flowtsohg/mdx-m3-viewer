import BinaryStream from '../../../common/binarystream';

/**
 * An inventory item.
 */
export default class InventoryItem {
  slot: number = 0;
  id: string = '\0\0\0\0';

  load(stream: BinaryStream) {
    this.slot = stream.readInt32();
    this.id = stream.read(4);
  }

  save(stream: BinaryStream) {
    stream.writeInt32(this.slot);
    stream.write(this.id);
  }
}
