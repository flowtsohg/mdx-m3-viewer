import BinaryStream from '../../../common/binarystream';
import War3MapW3u from '../w3u/file';
import War3MapW3d from '../w3d/file';

/**
 * war3map.w3o - the combined modification file.
 *
 * Contains all of the modifications of a map.
 * Can be exported and imported via the World Editor.
 */
export default class War3MapW3o {
  version: number = 0;
  units: War3MapW3u | null = null;
  items: War3MapW3u | null = null;
  destructables: War3MapW3u | null = null;
  doodads: War3MapW3d | null = null;
  abilities: War3MapW3d | null = null;
  buffs: War3MapW3u | null = null;
  upgrades: War3MapW3d | null = null;

  load(buffer: ArrayBuffer | Uint8Array) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    if (stream.readInt32()) {
      this.units = new War3MapW3u();
      this.units.load(stream);
    }

    if (stream.readInt32()) {
      this.items = new War3MapW3u();
      this.items.load(stream);
    }

    if (stream.readInt32()) {
      this.destructables = new War3MapW3u();
      this.destructables.load(stream);
    }

    if (stream.readInt32()) {
      this.doodads = new War3MapW3d();
      this.doodads.load(stream);
    }

    if (stream.readInt32()) {
      this.abilities = new War3MapW3d();
      this.abilities.load(stream);
    }

    if (stream.readInt32()) {
      this.buffs = new War3MapW3u();
      this.buffs.load(stream);
    }

    if (stream.readInt32()) {
      this.upgrades = new War3MapW3d();
      this.upgrades.load(stream);
    }
  }

  save() {
    let stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);

    if (this.units) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.units.save());
    } else {
      stream.writeInt32(0);
    }

    if (this.items) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.items.save());
    } else {
      stream.writeInt32(0);
    }

    if (this.destructables) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.destructables.save());
    } else {
      stream.writeInt32(0);
    }

    if (this.doodads) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.doodads.save());
    } else {
      stream.writeInt32(0);
    }

    if (this.abilities) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.abilities.save());
    } else {
      stream.writeInt32(0);
    }

    if (this.buffs) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.buffs.save());
    } else {
      stream.writeInt32(0);
    }

    if (this.upgrades) {
      stream.writeInt32(1);
      stream.writeUint8Array(this.upgrades.save());
    } else {
      stream.writeInt32(0);
    }

    return stream.uint8array;
  }

  getByteLength() {
    let size = 32;

    if (this.units) {
      size += this.units.getByteLength();
    }

    if (this.items) {
      size += this.items.getByteLength();
    }

    if (this.destructables) {
      size += this.destructables.getByteLength();
    }

    if (this.doodads) {
      size += this.doodads.getByteLength();
    }

    if (this.abilities) {
      size += this.abilities.getByteLength();
    }

    if (this.buffs) {
      size += this.buffs.getByteLength();
    }

    if (this.upgrades) {
      size += this.upgrades.getByteLength();
    }

    return size;
  }
}
