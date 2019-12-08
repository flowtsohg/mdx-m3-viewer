import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

/**
 * An animation.
 */
export abstract class Animation {
  name: string;
  interpolationType: number;
  globalSequenceId: number;
  frames: number[];
  values: (Uint32Array | Float32Array)[];
  inTans: (Uint32Array | Float32Array)[];
  outTans: (Uint32Array | Float32Array)[];

  constructor() {
    this.name = '';
    this.interpolationType = 0;
    this.globalSequenceId = -1;
    this.frames = [];
    this.values = [];
    this.inTans = [];
    this.outTans = [];
  }

  abstract readMdxValue(stream: BinaryStream): Uint32Array | Float32Array;
  abstract readMdlValue(stream: TokenStream): Uint32Array | Float32Array;

  readMdx(stream: BinaryStream, name: string) {
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

  writeMdx(stream: BinaryStream) {
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

  readMdl(stream: TokenStream, name: string) {
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;

    this.name = name;

    let tracksCount = stream.readInt();

    stream.read(); // {

    let interpolationType = 0;
    let token = stream.read();

    if (token === 'DontInterp') {
      interpolationType = 0;
    } else if (token === 'Linear') {
      interpolationType = 1;
    } else if (token === 'Hermite') {
      interpolationType = 2;
    } else if (token === 'Bezier') {
      interpolationType = 3;
    }

    this.interpolationType = interpolationType;

    // GlobalSeqId only exists if it's not -1.
    if (stream.peek() === 'GlobalSeqId') {
      stream.read();

      this.globalSequenceId = stream.readInt();
    }

    for (let i = 0; i < tracksCount; i++) {
      frames[i] = stream.readInt();
      values[i] = this.readMdlValue(stream);

      if (interpolationType > 1) {
        stream.read(); // InTan
        inTans[i] = this.readMdlValue(stream);
        stream.read(); // OutTan
        outTans[i] = this.readMdlValue(stream);
      }
    }

    stream.read(); // }
  }

  writeMdl(stream: TokenStream, name: string) {
    let interpolationType = this.interpolationType;
    let frames = this.frames;
    let values = this.values;
    let inTans = this.inTans;
    let outTans = this.outTans;
    let tracksCount = frames.length;

    stream.startBlock(name, this.frames.length);

    let token = '';

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

  getByteLength() {
    let tracksCount = this.frames.length;
    let size = 16;

    if (tracksCount) {
      let bytesPerValue = this.values[0].byteLength;
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
  readMdxValue(stream: BinaryStream) {
    return stream.readUint32Array(1);
  }

  readMdlValue(stream: TokenStream) {
    return stream.readKeyframe(new Uint32Array(1));
  }
}

/**
 * A float animation
 */
export class FloatAnimation extends Animation {
  readMdxValue(stream: BinaryStream) {
    return stream.readFloat32Array(1);
  }

  readMdlValue(stream: TokenStream) {
    return stream.readKeyframe(new Float32Array(1));
  }
}

/**
 * A vector 3 animation.
 */
export class Vector3Animation extends Animation {
  readMdxValue(stream: BinaryStream) {
    return stream.readFloat32Array(3);
  }

  readMdlValue(stream: TokenStream) {
    return stream.readKeyframe(new Float32Array(3));
  }
}

/**
 * A vector 4 animation.
 */
export class Vector4Animation extends Animation {
  readMdxValue(stream: BinaryStream) {
    return stream.readFloat32Array(4);
  }

  readMdlValue(stream: TokenStream) {
    return stream.readKeyframe(new Float32Array(4));
  }
}
