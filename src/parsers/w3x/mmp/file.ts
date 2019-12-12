import BinaryStream from '../../../common/binarystream';
import MinimapIcon from './minimapicon';

/**
 * war3map.mmp - the minimap icon file.
 */
export default class War3MapMmp {
  u1: number = 0;
  icons: MinimapIcon[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.u1 = stream.readInt32();

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let icon = new MinimapIcon();

      icon.load(stream);

      this.icons[i] = icon;
    }
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.u1);
    stream.writeUint32(this.icons.length);

    for (let icon of this.icons) {
      icon.save(stream);
    }

    return buffer;
  }

  getByteLength() {
    return 8 + this.icons.length * 16;
  }
}
