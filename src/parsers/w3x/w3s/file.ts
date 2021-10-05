import BinaryStream from '../../../common/binarystream';
import Sound from './sound';

/**
 * war3map.w3s - the sound file.
 */
export default class War3MapW3s {
  version = 0;
  sounds: Sound[] = [];

  load(buffer: ArrayBuffer | Uint8Array): void {
    const stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const sound = new Sound();

      sound.load(stream, this.version);

      this.sounds[i] = sound;
    }
  }

  save(): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);
    stream.writeUint32(this.sounds.length);

    for (const sound of this.sounds) {
      sound.save(stream, this.version);
    }

    return stream.uint8array;
  }

  getByteLength(): number {
    let size = 8;

    for (const sound of this.sounds) {
      size += sound.getByteLength(this.version);
    }

    return size;
  }
}
