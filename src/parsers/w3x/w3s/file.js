import BinaryStream from '../../../common/binarystream';
import Sound from './sound';

/**
 * war3map.w3s - the sound file.
 */
export default class War3MapW3s {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {Array<Sound>} */
    this.sounds = [];

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
      let sound = new Sound();

      sound.load(stream);

      this.sounds[i] = sound;
    }
  }

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.calcSize());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeUint32(this.sounds.length);

    for (let sound of this.sounds) {
      sound.save(stream);
    }

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 8;

    for (let sound of this.sounds) {
      size += sound.getByteLength();
    }

    return size;
  }
}
