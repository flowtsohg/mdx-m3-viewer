import BinaryStream from '../../common/binarystream';
import GenericObject from './genericobject';

/**
 * A corn.
 * Corns are particle emitters that reference pkfx files, which are used by the PopcornFX runtime.
 *
 * @since 900
 */
export default class Corn extends GenericObject {
  lifeSpan: number = 0;
  emissionRate: number = 0;
  speed: number = 0;
  color: Float32Array = new Float32Array(4);
  replaceableId: number = 0;
  path: string = '';
  options: string = '';

  readMdx(stream: BinaryStream) {
    const start = stream.index;
    const size = stream.readUint32();

    super.readMdx(stream);

    this.lifeSpan = stream.readFloat32();
    this.emissionRate = stream.readFloat32();
    this.speed = stream.readFloat32();
    stream.readFloat32Array(this.color);
    this.replaceableId = stream.readUint32();
    this.path = stream.read(260);
    this.options = stream.read(260);

    this.readAnimations(stream, size - (stream.index - start));
  }

  writeMdx(stream: BinaryStream) {
    stream.writeUint32(this.getByteLength());

    super.writeMdx(stream);

    stream.writeFloat32(this.lifeSpan);
    stream.writeFloat32(this.emissionRate);
    stream.writeFloat32(this.speed);
    stream.writeFloat32Array(this.color);
    stream.writeUint32(this.replaceableId);
    stream.write(this.path);
    stream.skip(260 - this.path.length);
    stream.write(this.options);
    stream.skip(260 - this.options.length);

    this.writeNonGenericAnimationChunks(stream);
  }

  getByteLength() {
    return 556 + super.getByteLength();
  }
}

