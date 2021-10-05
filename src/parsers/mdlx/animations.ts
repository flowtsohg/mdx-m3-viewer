import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';

export const enum InterpolationType {
  DontInterp = 0,
  Linear = 1,
  Hermite = 2,
  Bezier = 3,
}
/**
 * An animation.
 */
export abstract class Animation {
  name = '';
  interpolationType = InterpolationType.DontInterp;
  globalSequenceId = -1;
  frames: number[] = [];
  values: (Uint32Array | Float32Array)[] = [];
  inTans: (Uint32Array | Float32Array)[] = [];
  outTans: (Uint32Array | Float32Array)[] = [];

  abstract readMdxValue(stream: BinaryStream): Uint32Array | Float32Array;
  abstract writeMdxValue(stream: BinaryStream, value: Uint32Array | Float32Array): void;
  abstract readMdlValue(stream: TokenStream): Uint32Array | Float32Array;
  abstract writeMdlValue(stream: TokenStream, name: string, value: Uint32Array | Float32Array): void;

  readMdx(stream: BinaryStream, name: string): void {
    const frames = this.frames;
    const values = this.values;
    const inTans = this.inTans;
    const outTans = this.outTans;
    const tracksCount = stream.readUint32();
    const interpolationType = stream.readUint32();

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

  writeMdx(stream: BinaryStream): void {
    const interpolationType = this.interpolationType;
    const frames = this.frames;
    const values = this.values;
    const inTans = this.inTans;
    const outTans = this.outTans;
    const tracksCount = frames.length;

    stream.writeBinary(this.name);
    stream.writeUint32(tracksCount);
    stream.writeUint32(interpolationType);
    stream.writeInt32(this.globalSequenceId);

    for (let i = 0; i < tracksCount; i++) {
      stream.writeInt32(frames[i]);
      this.writeMdxValue(stream, values[i]);

      if (interpolationType > InterpolationType.Linear) {
        this.writeMdxValue(stream, inTans[i]);
        this.writeMdxValue(stream, outTans[i]);
      }
    }
  }

  readMdl(stream: TokenStream, name: string): void {
    const frames = this.frames;
    const values = this.values;
    const inTans = this.inTans;
    const outTans = this.outTans;

    this.name = name;

    const tracksCount = stream.readInt();

    stream.read(); // {

    let interpolationType = 0;
    const token = stream.read();

    if (token === 'DontInterp') {
      interpolationType = InterpolationType.DontInterp;
    } else if (token === 'Linear') {
      interpolationType = InterpolationType.Linear;
    } else if (token === 'Hermite') {
      interpolationType = InterpolationType.Hermite;
    } else if (token === 'Bezier') {
      interpolationType = InterpolationType.Bezier;
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

      if (interpolationType > InterpolationType.Linear) {
        stream.read(); // InTan
        inTans[i] = this.readMdlValue(stream);
        stream.read(); // OutTan
        outTans[i] = this.readMdlValue(stream);
      }
    }

    stream.read(); // }
  }

  writeMdl(stream: TokenStream, name: string): void {
    const interpolationType = this.interpolationType;
    const frames = this.frames;
    const values = this.values;
    const inTans = this.inTans;
    const outTans = this.outTans;
    const tracksCount = frames.length;

    stream.startBlock(name, this.frames.length);

    let token = '';

    if (this.interpolationType === InterpolationType.DontInterp) {
      token = 'DontInterp';
    } else if (this.interpolationType === InterpolationType.Linear) {
      token = 'Linear';
    } else if (this.interpolationType === InterpolationType.Hermite) {
      token = 'Hermite';
    } else if (this.interpolationType === InterpolationType.Bezier) {
      token = 'Bezier';
    }

    stream.writeFlag(token);

    if (this.globalSequenceId !== -1) {
      stream.writeNumberAttrib('GlobalSeqId', this.globalSequenceId);
    }

    for (let i = 0; i < tracksCount; i++) {
      this.writeMdlValue(stream, `${frames[i]}:`, values[i]);

      if (interpolationType > InterpolationType.Linear) {
        stream.indent();
        this.writeMdlValue(stream, 'InTan', inTans[i]);
        this.writeMdlValue(stream, 'OutTan', outTans[i]);
        stream.unindent();
      }
    }

    stream.endBlock();
  }

  getByteLength(): number {
    const tracksCount = this.frames.length;
    let size = 16;

    if (tracksCount) {
      const bytesPerValue = this.values[0].byteLength;
      let valuesPerTrack = 1;

      if (this.interpolationType > InterpolationType.Linear) {
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
  readMdxValue(stream: BinaryStream): Uint32Array {
    return stream.readUint32Array(1);
  }

  writeMdxValue(stream: BinaryStream, value: Uint32Array): void {
    stream.writeUint32(value[0]);
  }

  readMdlValue(stream: TokenStream): Uint32Array {
    return new Uint32Array([stream.readInt()]);
  }

  writeMdlValue(stream: TokenStream, name: string, value: Uint32Array): void {
    stream.writeNumberAttrib(name, value[0]);
  }
}

/**
 * A float animation
 */
export class FloatAnimation extends Animation {
  readMdxValue(stream: BinaryStream): Float32Array {
    return stream.readFloat32Array(1);
  }

  writeMdxValue(stream: BinaryStream, value: Float32Array): void {
    stream.writeFloat32(value[0]);
  }

  readMdlValue(stream: TokenStream): Float32Array {
    return new Float32Array([stream.readFloat()]);
  }

  writeMdlValue(stream: TokenStream, name: string, value: Float32Array): void {
    stream.writeNumberAttrib(name, value[0]);
  }
}

/**
 * A vector 3 animation.
 */
export class Vector3Animation extends Animation {
  readMdxValue(stream: BinaryStream): Float32Array {
    return stream.readFloat32Array(3);
  }

  writeMdxValue(stream: BinaryStream, value: Float32Array): void {
    stream.writeFloat32Array(value);
  }

  readMdlValue(stream: TokenStream): Float32Array {
    return stream.readVector(new Float32Array(3));
  }

  writeMdlValue(stream: TokenStream, name: string, value: Float32Array): void {
    stream.writeVectorAttrib(name, value);
  }
}

/**
 * A vector 4 animation.
 */
export class Vector4Animation extends Animation {
  readMdxValue(stream: BinaryStream): Float32Array {
    return stream.readFloat32Array(4);
  }

  writeMdxValue(stream: BinaryStream, value: Float32Array): void {
    stream.writeFloat32Array(value);
  }

  readMdlValue(stream: TokenStream): Float32Array {
    return stream.readVector(new Float32Array(4));
  }

  writeMdlValue(stream: TokenStream, name: string, value: Float32Array): void {
    stream.writeVectorAttrib(name, value);
  }
}
