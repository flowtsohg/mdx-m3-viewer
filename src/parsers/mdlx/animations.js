/**
 * An animation.
 */
class Animation {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.name = '';
    /** @member {number} */
    this.interpolationType = 0;
    /** @member {number} */
    this.globalSequenceId = -1;
    /** @member {Array<number>} */
    this.frames = [];
    /** @member {Array<Uint32Array|Float32Array>} */
    this.values = [];
    /** @member {Array<Uint32Array|Float32Array>} */
    this.inTans = [];
    /** @member {Array<Uint32Array|Float32Array>} */
    this.outTans = [];
  }

  /**
   * @param {BinaryStream} stream
   * @param {string} name
   */
  readMdx(stream, name) {
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = stream.readUint32();
    let interpolationType = stream.readUint32();

    this.name = name;
    this.interpolationType = interpolationType;
    this.globalSequenceId = stream.readInt32();

    for (let i = 0; i < tracksCount; i++) {
      frames.push(stream.readInt32());
      values.push(this.readMdxValue(stream));

      if (interpolationType > 1) {
        inTans.push(this.readMdxValue(stream));
        outTans.push(this.readMdxValue(stream));
      }
    }
  }

  /**
   * @param {BinaryStream} stream
   */
  writeMdx(stream) {
    let interpolationType = this.interpolationType;
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = frames.length;

    stream.write(this.name);
    stream.writeUint32(tracksCount);
    stream.writeUint32(interpolationType);
    stream.writeInt32(this.globalSequenceId);

    for (let i = 0; i < tracksCount; i++) {
      stream.writeInt32(frames[i]);
      stream.writeTypedArray(values[i]);

      if (interpolationType > 1) {
        stream.writeTypedArray(inTans[i]);
        stream.writeTypedArray(outTans[i]);
      }
    }
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   */
  readMdl(stream, name) {
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;

    this.name = name;

    let tracksCount = stream.readInt();

    stream.read(); // {

    let token = stream.read();

    if (token === 'DontInterp') {
      this.interpolationType = 0;
    } else if (token === 'Linear') {
      this.interpolationType = 1;
    } else if (token === 'Hermite') {
      this.interpolationType = 2;
    } else if (token === 'Bezier') {
      this.interpolationType = 3;
    }

    // GlobalSeqId only exists if it's not -1.
    if (stream.peek() === 'GlobalSeqId') {
      stream.read();

      this.globalSequenceId = stream.readInt();
    }

    for (let i = 0; i < tracksCount; i++) {
      frames[i] = stream.readInt();
      values[i] = this.readValueMdl(stream);

      if (interpolationType > 1) {
        stream.read(); // InTan
        inTans[i] = this.readValueMdl(stream);
        stream.read(); // OutTan
        outTans[i] = this.readValueMdl(stream);
      }
    }

    stream.read(); // }
  }

  /**
   * @param {TokenStream} stream
   * @param {string} name
   */
  writeMdl(stream, name) {
    let interpolationType = this.interpolationType;
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = frames.length;

    stream.startBlock(name, this.tracks.length);

    let token;

    if (this.interpolationType === 0) {
      token = 'DontInterp';
    } else if (this.interpolationType === 1) {
      token = 'Linear';
    } else if (this.interpolationType === 2) {
      token = 'Hermite';
    } else if (this.interpolationType === 3) {
      token = 'Bezier';
    }

    stream.writeFlag(token);

    if (this.globalSequenceId !== -1) {
      stream.writeAttrib('GlobalSeqId', this.globalSequenceId);
    }

    for (let i = 0; i < tracksCount; i++) {
      stream.writeKeyframe(`${frames[i]}:`, values[i]);

      if (interpolationType > 1) {
        stream.indent();
        stream.writeKeyframe('InTan', inTans[i]);
        stream.writeKeyframe('OutTan', outTans[i]);
        stream.unindent();
      }
    }

    stream.endBlock();
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let tracksCount = this.frames.length;
    let size = 16;

    if (tracksCount) {
      let bytesPerValue = this.values[i].byteLength;
      let valuesPerTrack = 1;

      if (this.interpolationType > 1) {
        valuesPerTrack = 3;
      }

      size += (4 + valuesPerTrack * bytesPerValue) * tracksCount;
    }

    return size;
  }
}

/**
 * A uint animation.
 */
export class UintAnimation extends Animation {
  /**
   * @param {BinaryStream} stream
   * @return {Uint32Array}
   */
  readMdxValue(stream) {
    return stream.readUint32Array(1);
  }

  /**
   * @param {TokenStream} stream
   * @return {Uint32Array}
   */
  readMdlValue(stream) {
    return stream.readKeyframe(new Uint32Array(1));
  }
}

/**
 * A float animation
 */
export class FloatAnimation extends Animation {
  /**
   * @param {BinaryStream} stream
   * @return {Float32Array}
   */
  readMdxValue(stream) {
    return stream.readFloat32Array(1);
  }

  /**
   * @param {TokenStream} stream
   * @return {Float32Array}
   */
  readMdlValue(stream) {
    return stream.readKeyframe(new Float32Array(1));
  }
}

/**
 * A vector 3 animation.
 */
export class Vector3Animation extends Animation {
  /**
   * @param {BinaryStream} stream
   * @return {Float32Array}
   */
  readMdxValue(stream) {
    return stream.readFloat32Array(3);
  }

  /**
   * @param {TokenStream} stream
   * @return {Float32Array}
   */
  readMdlValue(stream) {
    return stream.readKeyframe(new Float32Array(3));
  }
}

/**
 * A vector 4 animation.
 */
export class Vector4Animation extends Animation {
  /**
   * @param {BinaryStream} stream
   * @return {Float32Array}
   */
  readMdxValue(stream) {
    return stream.readFloat32Array(4);
  }

  /**
   * @param {TokenStream} stream
   * @return {Float32Array}
   */
  readMdlValue(stream) {
    return stream.readKeyframe(new Float32Array(4));
  }
}
