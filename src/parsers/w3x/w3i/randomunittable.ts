import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';
import RandomUnit from './randomunit';

/**
 * A random unit table.
 */
export default class RandomUnitTable {
  id = 0;
  name = '';
  positions = 0;
  columnTypes = new Int32Array(0);
  units: RandomUnit[] = [];

  load(stream: BinaryStream): void {
    this.id = stream.readInt32();
    this.name = stream.readNull();
    this.positions = stream.readInt32();
    this.columnTypes = stream.readInt32Array(this.positions);

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const unit = new RandomUnit();

      unit.load(stream, this.positions);

      this.units[i] = unit;
    }
  }

  save(stream: BinaryStream): void {
    stream.writeInt32(this.id);
    stream.writeNull(this.name);
    stream.writeInt32(this.positions);
    stream.writeInt32Array(this.columnTypes);
    stream.writeUint32(this.units.length);

    for (const unit of this.units) {
      unit.save(stream);
    }
  }

  getByteLength(): number {
    return 13 + byteLengthUtf8(this.name) + this.columnTypes.byteLength + (this.units.length * (4 + 4 * this.positions));
  }
}
