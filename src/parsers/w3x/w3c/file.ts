import BinaryStream from '../../../common/binarystream';
import Camera from './camera';

/**
 * war3map.w3c - the camera file.
 */
export default class War3MapW3c {
  version = 0;
  cameras: Camera[] = [];

  load(buffer: ArrayBuffer | Uint8Array, buildVersion: number): void {
    const stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const camera = new Camera();

      camera.load(stream, buildVersion);

      this.cameras[i] = camera;
    }
  }

  save(buildVersion: number): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength(buildVersion)));

    stream.writeInt32(this.version);
    stream.writeUint32(this.cameras.length);

    for (const camera of this.cameras) {
      camera.save(stream, buildVersion);
    }

    return stream.uint8array;
  }

  getByteLength(buildVersion: number): number {
    let size = 8;

    for (const camera of this.cameras) {
      size += camera.getByteLength(buildVersion);
    }

    return size;
  }
}
