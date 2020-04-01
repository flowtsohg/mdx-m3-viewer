import BinaryStream from '../../../common/binarystream';
import Sound from './sound';

/**
 * war3map.w3s - the sound file.
 */
export default class War3MapW3s {
  version: number = 0;
  sounds: Sound[] = [];

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let sound = new Sound();

      sound.load(stream);

      this.sounds[i] = sound;
    }
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeUint32(this.sounds.length);

    for (let sound of this.sounds) {
      sound.save(stream);
    }

    return buffer;
  }

  getByteLength() {
    let size = 8;

    for (let sound of this.sounds) {
      size += sound.getByteLength();
    }

    return size;
  }
}
