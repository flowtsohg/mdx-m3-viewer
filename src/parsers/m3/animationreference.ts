import BinaryStream from '../../common/binarystream'

/**
 * The base class to all animation references.
 */
export abstract class AnimationReference {
  interpolationType: number = 0;
  animFlags: number = 0;
  animId: number = -1;
  initValue: any;
  nullValue: any;

  abstract readInitNullValues(stream: BinaryStream): void;

  load(stream: BinaryStream) {
    this.interpolationType = stream.readUint16();
    this.animFlags = stream.readUint16();
    this.animId = stream.readUint32();

    this.readInitNullValues(stream);

    stream.skip(4); // ?
  }
}

/**
 * A pixel animation reference.
 */
export class PixelAnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readUint8Array(4);
    this.nullValue = stream.readUint8Array(4);
  }
}

/**
 * A uint16 animation reference.
 */
export class Uint16AnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readUint16();
    this.nullValue = stream.readUint16();
  }
}

/**
 * A uint32 animation reference.
 */
export class Uint32AnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readUint32();
    this.nullValue = stream.readUint32();
  }
}

/**
 * A float32 animation reference.
 */
export class Float32AnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readFloat32();
    this.nullValue = stream.readFloat32();
  }
}

/**
 * A vec2 animation reference.
 */
export class Vector2AnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readFloat32Array(2);
    this.nullValue = stream.readFloat32Array(2);
  }
}

/**
 * A vec3 animation reference.
 */
export class Vector3AnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readFloat32Array(3);
    this.nullValue = stream.readFloat32Array(3);
  }
}

/**
 * A quat animation reference.
 */
export class Vector4AnimationReference extends AnimationReference {
  readInitNullValues(stream: BinaryStream) {
    this.initValue = stream.readFloat32Array(4);
    this.nullValue = stream.readFloat32Array(4);
  }
}
