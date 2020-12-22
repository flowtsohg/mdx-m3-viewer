import BinaryStream from '../../../common/binarystream';
import Unit from './unit';

/**
 * war3mapUnits.doo - the units and items file.
 */
export default class War3MapUnitsDoo {
  version: number = 8;
  subversion: number = 11;
  units: Unit[] = [];

  constructor(buffer?: ArrayBuffer, isReforged?: boolean) {
    if (buffer) {
      this.load(buffer, !!isReforged);
    }
  }

  load(buffer: ArrayBuffer, isReforged: boolean) {
    let stream = new BinaryStream(buffer);

    if (stream.read(4) !== 'W3do') {
      return false;
    }

    this.version = stream.readInt32();
    this.subversion = stream.readUint32();

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let unit = new Unit();

      unit.load(stream, this.version, this.subversion, isReforged);

      this.units[i] = unit;
    }

    return true;
  }

  save(isReforged: boolean) {
    let buffer = new ArrayBuffer(this.getByteLength(isReforged));
    let stream = new BinaryStream(buffer);

    stream.write('W3do');
    stream.writeInt32(this.version);
    stream.writeUint32(this.subversion);
    stream.writeInt32(this.units.length);

    for (let unit of this.units) {
      unit.save(stream, this.version, this.subversion, isReforged);
    }

    return buffer;
  }

  getByteLength(isReforged: boolean) {
    let size = 16;

    for (let unit of this.units) {
      size += unit.getByteLength(this.version, this.subversion, isReforged);
    }

    return size;
  }
}
