import BinaryStream from '../../../common/binarystream';
import Unit from './unit';

/**
 * war3mapUnits.doo - the units and items file.
 */
export default class War3MapUnitsDoo {
  version: number = 8;
  unknown: number = 11;
  units: Unit[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'W3do') {
      return false;
    }

    this.version = stream.readInt32();
    this.unknown = stream.readUint32();

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let unit = new Unit();

      unit.load(stream, this.version);

      this.units[i] = unit;
    }

    return true;
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.write('W3do');
    stream.writeInt32(this.version);
    stream.writeUint32(this.unknown);
    stream.writeInt32(this.units.length);

    for (let unit of this.units) {
      unit.save(stream, this.version);
    }

    return buffer;
  }

  getByteLength() {
    let size = 16;

    for (let unit of this.units) {
      size += unit.getByteLength(this.version);
    }

    return size;
  }
}
