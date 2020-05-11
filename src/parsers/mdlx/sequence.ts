import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import Extent from './extent';

/**
 * A sequence.
 */
export default class Sequence {
  name: string = '';
  interval: Uint32Array = new Uint32Array(2);
  moveSpeed: number = 0;
  flags: number = 0;
  rarity: number = 0;
  syncPoint: number = 0;
  extent: Extent = new Extent();

  readMdx(stream: BinaryStream) {
    this.name = stream.read(80);
    stream.readUint32Array(this.interval);
    this.moveSpeed = stream.readFloat32();
    this.flags = stream.readUint32();
    this.rarity = stream.readFloat32();
    this.syncPoint = stream.readUint32();
    this.extent.readMdx(stream);
  }

  writeMdx(stream: BinaryStream) {
    stream.write(this.name);
    stream.skip(80 - this.name.length);
    stream.writeUint32Array(this.interval);
    stream.writeFloat32(this.moveSpeed);
    stream.writeUint32(this.flags);
    stream.writeFloat32(this.rarity);
    stream.writeUint32(this.syncPoint);
    this.extent.writeMdx(stream);
  }

  readMdl(stream: TokenStream) {
    this.name = stream.read();

    for (let token of stream.readBlock()) {
      if (token === 'Interval') {
        stream.readVector(this.interval);
      } else if (token === 'NonLooping') {
        this.flags = 1;
      } else if (token === 'MoveSpeed') {
        this.moveSpeed = stream.readFloat();
      } else if (token === 'Rarity') {
        this.rarity = stream.readFloat();
      } else if (token === 'MinimumExtent') {
        stream.readVector(this.extent.min);
      } else if (token === 'MaximumExtent') {
        stream.readVector(this.extent.max);
      } else if (token === 'BoundsRadius') {
        this.extent.boundsRadius = stream.readFloat();
      } else {
        throw new Error(`Unknown token in Sequence: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('Anim', this.name);
    stream.writeVectorAttrib('Interval', this.interval);

    if (this.flags === 1) {
      stream.writeFlag('NonLooping');
    }

    if (this.moveSpeed !== 0) {
      stream.writeNumberAttrib('MoveSpeed', this.moveSpeed);
    }

    if (this.rarity !== 0) {
      stream.writeNumberAttrib('Rarity', this.rarity);
    }

    this.extent.writeMdl(stream);
    stream.endBlock();
  }
}
