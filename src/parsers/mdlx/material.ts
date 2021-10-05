import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import Layer from './layer';

export const enum Flags {
  None = 0x0,
  ConstantColor = 0x1,
  TwoSided = 0x2,
  SortPrimsNearZ = 0x8,
  SortPrimsFarZ = 0x10,
  FullResolution = 0x20,
}

/**
 * A material.
 */
export default class Material {
  priorityPlane = 0;
  flags = Flags.None;
  /** 
   * @since 900
   */
  shader = '';
  layers: Layer[] = [];

  readMdx(stream: BinaryStream, version: number): void {
    stream.readUint32(); // Don't care about the size.

    this.priorityPlane = stream.readInt32();
    this.flags = stream.readUint32();

    if (version > 800) {
      this.shader = stream.read(80);
    }

    stream.skip(4); // LAYS

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      const layer = new Layer();

      layer.readMdx(stream, version);

      this.layers.push(layer);
    }
  }

  writeMdx(stream: BinaryStream, version: number): void {
    stream.writeUint32(this.getByteLength(version));
    stream.writeInt32(this.priorityPlane);
    stream.writeUint32(this.flags);

    if (version > 800) {
      stream.skip(80 - stream.write(this.shader));
    }

    stream.writeBinary('LAYS');
    stream.writeUint32(this.layers.length);

    for (const layer of this.layers) {
      layer.writeMdx(stream, version);
    }
  }

  readMdl(stream: TokenStream): void {
    for (const token of stream.readBlock()) {
      if (token === 'ConstantColor') {
        this.flags |= Flags.ConstantColor;
      } else if (token === 'TwoSided') {
        this.flags |= Flags.TwoSided;
      } else if (token === 'SortPrimsNearZ') {
        this.flags |= Flags.SortPrimsNearZ;
      } else if (token === 'SortPrimsFarZ') {
        this.flags |= Flags.SortPrimsFarZ;
      } else if (token === 'FullResolution') {
        this.flags |= Flags.FullResolution;
      } else if (token === 'PriorityPlane') {
        this.priorityPlane = stream.readInt();
      } else if (token === 'Shader') {
        this.shader = stream.read();
      } else if (token === 'Layer') {
        const layer = new Layer();

        layer.readMdl(stream);

        this.layers.push(layer);
      } else {
        throw new Error(`Unknown token in Material: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream, version: number): void {
    stream.startBlock('Material');

    if (this.flags & Flags.ConstantColor) {
      stream.writeFlag('ConstantColor');
    }

    if (version > 800) {
      if (this.flags & Flags.TwoSided) {
        stream.writeFlag('TwoSided');
      }
    }

    if (this.flags & Flags.SortPrimsNearZ) {
      stream.writeFlag('SortPrimsNearZ');
    }

    if (this.flags & Flags.SortPrimsFarZ) {
      stream.writeFlag('SortPrimsFarZ');
    }

    if (this.flags & Flags.FullResolution) {
      stream.writeFlag('FullResolution');
    }

    if (this.priorityPlane !== 0) {
      stream.writeNumberAttrib('PriorityPlane', this.priorityPlane);
    }

    if (version > 800) {
      stream.writeStringAttrib('Shader', this.shader);
    }

    for (const layer of this.layers) {
      layer.writeMdl(stream, version);
    }

    stream.endBlock();
  }

  getByteLength(version: number): number {
    let size = 20;

    if (version > 800) {
      size += 80;
    }

    for (const layer of this.layers) {
      size += layer.getByteLength(version);
    }

    return size;
  }
}
