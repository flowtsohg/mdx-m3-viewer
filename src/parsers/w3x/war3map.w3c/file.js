import BinaryStream from '../../../common/binarystream';
import Camera from './camera';

/**
 * war3map.w3c - the camera file.
 */
export default class War3MapW3c {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {Array<Camera>} */
    this.cameras = [];

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let camera = new Camera();

      camera.load(stream);

      this.cameras[i] = camera;
    }
  }

  /**
   * @return {ArrayBuffer}
   */
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

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 8;

    for (let camera of this.cameras) {
      size += camera.getByteLength();
    }

    return size;
  }
}
