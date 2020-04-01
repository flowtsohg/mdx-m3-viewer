import BinaryStream from '../../common/binarystream'

/**
 * The base class to all animation references.
 */
export abstract class M3ParserAnimationReference {
  interpolationType: number;
  animFlags: number;
  animId: number;
  initValue: any;
  nullValue: any;

  abstract readInitNullValues(reader: BinaryStream): void;

  constructor(reader: BinaryStream) {
    this.interpolationType = reader.readUint16();
    this.animFlags = reader.readUint16();
    this.animId = reader.readUint32();

    this.readInitNullValues(reader);

    reader.skip(4); // ?
  }
}

/**
 * A pixel animation reference.
 */
export class M3ParserPixelAnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readUint8Array(4);
    this.nullValue = reader.readUint8Array(4);
  }
}

/**
 * A uint16 animation reference.
 */
export class M3ParserUint16AnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readUint16();
    this.nullValue = reader.readUint16();
  }
}

/**
 * A uint32 animation reference.
 */
export class M3ParserUint32AnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readUint32();
    this.nullValue = reader.readUint32();
  }
}

/**
 * A float32 animation reference.
 */
export class M3ParserFloat32AnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readFloat32();
    this.nullValue = reader.readFloat32();
  }
}

/**
 * A vec2 animation reference.
 */
export class M3ParserVector2AnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readFloat32Array(2);
    this.nullValue = reader.readFloat32Array(2);
  }
}

/**
 * A vec3 animation reference.
 */
export class M3ParserVector3AnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readFloat32Array(3);
    this.nullValue = reader.readFloat32Array(3);
  }
}

/**
 * A quat animation reference.
 */
export class M3ParserVector4AnimationReference extends M3ParserAnimationReference {
  readInitNullValues(reader: BinaryStream) {
    this.initValue = reader.readFloat32Array(4);
    this.nullValue = reader.readFloat32Array(4);
  }
}
