import BinaryStream from '../../../common/binarystream';
import RandomItemSet from './randomitemset';

/**
 * A doodad.
 */
export default class Doodad {
  id: string;
  variation: number;
  location: Float32Array;
  angle: number;
  scale: Float32Array;
  flags: number;
  life: number;
  itemTable: number;
  itemSets: RandomItemSet[];
  editorId: number;
  u1: Uint8Array;

  constructor() {
    this.id = '\0\0\0\0';
    this.variation = 0;
    this.location = new Float32Array(3);
    this.angle = 0;
    this.scale = new Float32Array([1, 1, 1]);
    this.flags = 0;
    this.life = 0;
    this.itemTable = -1;
    this.itemSets = [];
    this.editorId = 0;
    this.u1 = new Uint8Array(8);
  }

  load(stream: BinaryStream, version: number) {
    this.id = stream.read(4);
    this.variation = stream.readInt32();
    this.location = stream.readFloat32Array(3);
    this.angle = stream.readFloat32();
    this.scale = stream.readFloat32Array(3);
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
