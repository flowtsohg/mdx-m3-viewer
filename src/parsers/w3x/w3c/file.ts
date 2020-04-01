import BinaryStream from '../../../common/binarystream';
import Camera from './camera';

/**
 * war3map.w3c - the camera file.
 */
export default class War3MapW3c {
  version: number = 0;
  cameras: Camera[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let camera = new Camera();

      camera.load(stream);

      this.cameras[i] = camera;
    }
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeUint32(this.cameras.length);

    for (let camera of this.cameras) {
      camera.save(stream);
    }

    return buffer;
  }

  getByteLength() {
    let size = 8;

    for (let camera of this.cameras) {
      size += camera.getByteLength();
    }

    return size;
  }
}
