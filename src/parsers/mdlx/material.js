import Layer from './layer';

/**
 * A material.
 */
export default class Material {
  /**
   *
   */
  constructor() {
    /** @member {number} */
    this.priorityPlane = 0;
    /** @member {number} */
    this.flags = 0;
    /** @member {Array<Layer>} */
    this.layers = [];
  }

  /**
   * @param {BinaryStream} stream
   */
  readMdx(stream) {
    stream.readUint32(); // Don't care about the size.

    this.priorityPlane = stream.readUint32();
    this.flags = stream.readUint32();

    stream.skip(4); // LAYS

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let layer = new Layer();

      layer.readMdx(stream);

      this.layers.push(layer);
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    stream.writeUint32(this.getByteLength());
    stream.writeUint32(this.priorityPlane);
    stream.writeUint32(this.flags);
    stream.write('LAYS');
    stream.writeUint32(this.layers.length);

    for (let layer of this.layers) {
      layer.writeMdx(stream);
    }
  }

  /**
   * @param {TokenStream} stream
   */
  readMdl(stream) {
    for (let token of stream.readBlock()) {
      if (token === 'ConstantColor') {
        this.flags |= 0x1;
      } else if (token === 'SortPrimsNearZ') {
        this.flags |= 0x8;
      } else if (token === 'SortPrimsFarZ') {
        this.flags |= 0x10;
      } else if (token === 'FullResolution') {
        this.flags |= 0x20;
      } else if (token === 'PriorityPlane') {
        this.priorityPlane = stream.readInt();
      } else if (token === 'Layer') {
        let layer = new Layer();

        layer.readMdl(stream);

        this.layers.push(layer);
      } else {
        throw new Error(`Unknown token in Material: "${token}"`);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   */
  writeMdl(stream) {
    stream.startBlock('Material');

    if (this.flags & 0x1) {
      stream.writeFlag('ConstantColor');
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
      stream.writeAttrib('PriorityPlane', this.priorityPlane);
    }

    for (let layer of this.layers) {
      layer.writeMdl(stream);
    }

    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 20;

    for (let layer of this.layers) {
      size += layer.getByteLength();
    }

    return size;
  }
}
