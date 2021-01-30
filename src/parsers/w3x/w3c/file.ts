import BinaryStream from '../../../common/binarystream';
import Camera from './camera';

/**
 * war3map.w3c - the camera file.
 */
export default class War3MapW3c {
  version: number = 0;
  cameras: Camera[] = [];

  load(buffer: ArrayBuffer | Uint8Array) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let camera = new Camera();

      camera.load(stream);

      this.cameras[i] = camera;
    }
  }

  save() {
    let stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);
    stream.writeUint32(this.cameras.length);

    for (let camera of this.cameras) {
      camera.save(stream);
    }

    return stream.uint8array;
  }

  getByteLength() {
    let size = 8;

    for (let camera of this.cameras) {
      size += camera.getByteLength();
    }

    return size;
  }
}
