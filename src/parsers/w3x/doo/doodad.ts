import BinaryStream from '../../../common/binarystream';
import RandomItemSet from './randomitemset';

/**
 * A doodad.
 */
export default class Doodad {
  id = '\0\0\0\0';
  variation = 0;
  location = new Float32Array(3);
  angle = 0;
  scale = new Float32Array([1, 1, 1]);
  /**
   * @since Game version 1.32
   */
  skin = '\0\0\0\0';
  flags = 0;
  life = 0;
  itemTable = -1;
  itemSets: RandomItemSet[] = [];
  editorId = 0;
  u1 = new Uint8Array(8);

  load(stream: BinaryStream, version: number, buildVersion: number): void {
    this.id = stream.readBinary(4);
    this.variation = stream.readInt32();
    stream.readFloat32Array(this.location);
    this.angle = stream.readFloat32();
    stream.readFloat32Array(this.scale);

    if (buildVersion > 131) {
      this.skin = stream.readBinary(4);
    }

    this.flags = stream.readUint8();
    this.life = stream.readUint8();

    if (version > 7) {
      this.itemTable = stream.readUint32();

      for (let i = 0, l = stream.readUint32(); i < l; i++) {
        const itemSet = new RandomItemSet();

        itemSet.load(stream);

        this.itemSets.push(itemSet);
      }
    }

    this.editorId = stream.readInt32();
  }

  save(stream: BinaryStream, version: number, buildVersion: number): void {
    stream.writeBinary(this.id);
    stream.writeInt32(this.variation);
    stream.writeFloat32Array(this.location);
    stream.writeFloat32(this.angle);
    stream.writeFloat32Array(this.scale);

    if (buildVersion > 131) {
      stream.writeBinary(this.skin);
    }

    stream.writeUint8(this.flags);
    stream.writeUint8(this.life);

    if (version > 7) {
      stream.writeUint32(this.itemTable);
      stream.writeUint32(this.itemSets.length);

      for (const itemSet of this.itemSets) {
        itemSet.save(stream);
      }
    }

    stream.writeInt32(this.editorId);
  }

  getByteLength(version: number, buildVersion: number): number {
    let size = 42;

    if (buildVersion > 131) {
      size += 4;
    }

    if (version > 7) {
      size += 8;

      for (const itemSet of this.itemSets) {
        size += itemSet.getByteLength();
      }
    }

    return size;
  }
}
