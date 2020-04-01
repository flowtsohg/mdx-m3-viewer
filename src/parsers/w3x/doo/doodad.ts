import BinaryStream from '../../../common/binarystream';
import RandomItemSet from './randomitemset';

/**
 * A doodad.
 */
export default class Doodad {
  id: string = '\0\0\0\0';
  variation: number = 0;
  location: Float32Array = new Float32Array(3);
  angle: number = 0;
  scale: Float32Array = new Float32Array([1, 1, 1]);
  flags: number = 0;
  life: number = 0;
  itemTable: number = -1;
  itemSets: RandomItemSet[] = [];
  editorId: number = 0;
  u1: Uint8Array = new Uint8Array(8);

  load(stream: BinaryStream, version: number) {
    this.id = stream.read(4);
    this.variation = stream.readInt32();
    stream.readFloat32Array(this.location);
    this.angle = stream.readFloat32();
    stream.readFloat32Array(this.scale);
    this.flags = stream.readUint8();
    this.life = stream.readUint8();

    if (version > 7) {
      this.itemTable = stream.readUint32();

      for (let i = 0, l = stream.readUint32(); i < l; i++) {
        let itemSet = new RandomItemSet();

        itemSet.load(stream);

        this.itemSets.push(itemSet);
      }
    }

    this.editorId = stream.readInt32();
  }

  save(stream: BinaryStream, version: number) {
    stream.write(this.id);
    stream.writeInt32(this.variation);
    stream.writeFloat32Array(this.location);
    stream.writeFloat32(this.angle);
    stream.writeFloat32Array(this.scale);
    stream.writeUint8(this.flags);
    stream.writeUint8(this.life);

    if (version > 7) {
      stream.writeUint32(this.itemTable);
      stream.writeUint32(this.itemSets.length);

      for (let itemSet of this.itemSets) {
        itemSet.save(stream);
      }
    }

    stream.writeInt32(this.editorId);
  }

  getByteLength(version: number) {
    let size = 42;

    if (version > 7) {
      size += 8;

      for (let itemSet of this.itemSets) {
        size += itemSet.getByteLength();
      }
    }

    return size;
  }
}
