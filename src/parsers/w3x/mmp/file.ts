import BinaryStream from '../../../common/binarystream';
import MinimapIcon from './minimapicon';

/**
 * war3map.mmp - the minimap icon file.
 */
export default class War3MapMmp {
  u1: number = 0;
  icons: MinimapIcon[] = [];

  load(buffer: ArrayBuffer | Uint8Array) {
    let stream = new BinaryStream(buffer);

    this.u1 = stream.readInt32();

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let icon = new MinimapIcon();

      icon.load(stream);

      this.icons[i] = icon;
    }
  }

  save() {
    let stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.u1);
    stream.writeUint32(this.icons.length);

    for (let icon of this.icons) {
      icon.save(stream);
    }

    return stream.uint8array;
  }

  getByteLength() {
    return 8 + this.icons.length * 16;
  }
}
