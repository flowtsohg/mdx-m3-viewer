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
    /**
     * @since 900
     * @member {string}
     */
    this.shader = '';
    /** @member {Array<Layer>} */
    this.layers = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  readMdx(stream, version) {
    stream.readUint32(); // Don't care about the size.

    this.priorityPlane = stream.readInt32();
    this.flags = stream.readUint32();

    if (version === 900) {
      this.shader = stream.read(80);
    }

    stream.skip(4); // LAYS

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let layer = new Layer();

      layer.readMdx(stream, version);

      this.layers.push(layer);
    }
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  writeMdx(stream, version) {
    stream.writeUint32(this.getByteLength());
    stream.writeUint32(this.priorityPlane);
    stream.writeUint32(this.flags);

    if (version === 900) {
      stream.write(this.shader);
      stream.skip(80 - this.shader.length);
    }

    stream.write('LAYS');
    stream.writeUint32(this.layers.length);

    for (let layer of this.layers) {
      layer.writeMdx(stream, version);
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
   * @param {number} version
   * @return {number}
   */
  getByteLength(version) {
    let size = 20;

    if (version === 900) {
      size += 80;
    }

    for (let layer of this.layers) {
      size += layer.getByteLength(version);
    }

    return size;
  }
}
