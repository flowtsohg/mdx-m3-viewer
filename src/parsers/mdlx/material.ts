import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import Layer from './layer';

/**
 * A material.
 */
export default class Material {
  priorityPlane: number = 0;
  flags: number = 0;
  /** 
   * @since 900
   */
  shader: string = '';
  layers: Layer[] = [];

  readMdx(stream: BinaryStream, version: number) {
    stream.readUint32(); // Don't care about the size.

    this.priorityPlane = stream.readInt32();
    this.flags = stream.readUint32();

    if (version > 800) {
      this.shader = stream.read(80);
    }

    stream.skip(4); // LAYS

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let layer = new Layer();

      layer.readMdx(stream, version);

      this.layers.push(layer);
    }
  }

  writeMdx(stream: BinaryStream, version: number) {
    stream.writeUint32(this.getByteLength(version));
    stream.writeInt32(this.priorityPlane);
    stream.writeUint32(this.flags);

    if (version > 800) {
      stream.write(this.shader);
      stream.skip(80 - this.shader.length);
    }

    stream.write('LAYS');
    stream.writeUint32(this.layers.length);

    for (let layer of this.layers) {
      layer.writeMdx(stream, version);
    }
  }

  readMdl(stream: TokenStream) {
    for (let token of stream.readBlock()) {
      if (token === 'ConstantColor') {
        this.flags |= 0x1;
      } else if (token === 'TwoSided') {
        this.flags |= 0x2;
      } else if (token === 'SortPrimsNearZ') {
        this.flags |= 0x8;
      } else if (token === 'SortPrimsFarZ') {
        this.flags |= 0x10;
      } else if (token === 'FullResolution') {
        this.flags |= 0x20;
      } else if (token === 'PriorityPlane') {
        this.priorityPlane = stream.readInt();
      } else if (token === 'Shader') {
        this.shader = stream.read();
      } else if (token === 'Layer') {
        let layer = new Layer();

        layer.readMdl(stream);

        this.layers.push(layer);
      } else {
        throw new Error(`Unknown token in Material: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream, version: number) {
    stream.startBlock('Material');

    if (this.flags & 0x1) {
      stream.writeFlag('ConstantColor');
    }

    if (version > 800) {
      if (this.flags & 0x2) {
        stream.writeFlag('TwoSided');
      }
    }

    if (this.flags & 0x8) {
      stream.writeFlag('SortPrimsNearZ');
    }

    if (this.flags & 0x10) {
      stream.writeFlag('SortPrimsFarZ');
    }

    if (this.flags & 0x20) {
      stream.writeFlag('FullResolution');
    }

    if (this.priorityPlane !== 0) {
      stream.writeNumberAttrib('PriorityPlane', this.priorityPlane);
    }

    if (version > 800) {
      stream.writeStringAttrib('Shader', this.shader)
    }

    for (let layer of this.layers) {
      layer.writeMdl(stream, version);
    }

    stream.endBlock();
  }

  getByteLength(version: number) {
    let size = 20;

    if (version > 800) {
      size += 80;
    }

    for (let layer of this.layers) {
      size += layer.getByteLength(version);
    }

    return size;
  }
}
