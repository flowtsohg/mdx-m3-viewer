import BinaryStream from '../../../common/binarystream';
import Unit from './unit';

/**
 * war3mapUnits.doo - the units and items file.
 */
export default class War3MapUnitsDoo {
  version = 8;
  subversion = 11;
  units: Unit[] = [];

  load(buffer: ArrayBuffer | Uint8Array, buildVersion: number): void {
    const stream = new BinaryStream(buffer);

    if (stream.readBinary(4) !== 'W3do') {
      throw new Error('Not a valid war3mapUnits.doo buffer');
    }

    this.version = stream.readInt32();
    this.subversion = stream.readUint32();

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const unit = new Unit();

      unit.load(stream, this.version, this.subversion, buildVersion);

      this.units[i] = unit;
    }
  }

  save(buildVersion: number): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength(buildVersion)));

    stream.writeBinary('W3do');
    stream.writeInt32(this.version);
    stream.writeUint32(this.subversion);
    stream.writeInt32(this.units.length);

    for (const unit of this.units) {
      unit.save(stream, this.version, this.subversion, buildVersion);
    }

    return stream.uint8array;
  }

  getByteLength(buildVersion: number): number {
    let size = 16;

    for (const unit of this.units) {
      size += unit.getByteLength(this.version, this.subversion, buildVersion);
    }

    return size;
  }
}
