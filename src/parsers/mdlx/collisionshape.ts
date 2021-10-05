import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

export const enum Shape {
  Box = 0,
  Plane = 1,
  Sphere = 2,
  Cylinder = 3,
}

/**
 * A collision shape.
 */
export default class CollisionShape extends GenericObject {
  type = Shape.Box;
  vertices: Float32Array[] = [new Float32Array(3), new Float32Array(3)];
  boundsRadius = 0;

  constructor() {
    super(0x2000);
  }

  override readMdx(stream: BinaryStream): void {
    super.readMdx(stream);

    this.type = stream.readUint32();

    stream.readFloat32Array(this.vertices[0]);

    if (this.type !== Shape.Sphere) {
      stream.readFloat32Array(this.vertices[1]);
    }

    if (this.type === Shape.Sphere || this.type === Shape.Cylinder) {
      this.boundsRadius = stream.readFloat32();
    }
  }

  override writeMdx(stream: BinaryStream): void {
    super.writeMdx(stream);

    stream.writeUint32(this.type);
    stream.writeFloat32Array(this.vertices[0]);

    if (this.type !== Shape.Sphere) {
      stream.writeFloat32Array(this.vertices[1]);
    }

    if (this.type === Shape.Sphere || this.type === Shape.Cylinder) {
      stream.writeFloat32(this.boundsRadius);
    }
  }

  readMdl(stream: TokenStream): void {
    for (const token of super.readGenericBlock(stream)) {
      if (token === 'Box') {
        this.type = Shape.Box;
      } else if (token === 'Plane') {
        this.type = Shape.Plane;
      } else if (token === 'Sphere') {
        this.type = Shape.Sphere;
      } else if (token === 'Cylinder') {
        this.type = Shape.Cylinder;
      } else if (token === 'Vertices') {
        const count = stream.readInt();

        stream.read(); // {

        stream.readVector(this.vertices[0]);

        if (count === 2) {
          stream.readVector(this.vertices[1]);
        }

        stream.read(); // }
      } else if (token === 'BoundsRadius') {
        this.boundsRadius = stream.readFloat();
      } else {
        throw new Error(`Unknown token in CollisionShape: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream): void {
    stream.startObjectBlock('CollisionShape', this.name);
    this.writeGenericHeader(stream);

    let type = '';
    let vertices = 2;
    let boundsRadius = false;

    if (this.type === Shape.Box) {
      type = 'Box';
    } else if (this.type === Shape.Plane) {
      type = 'Plane';
    } else if (this.type === Shape.Sphere) {
      type = 'Sphere';
      vertices = 1;
      boundsRadius = true;
    } else if (this.type === Shape.Cylinder) {
      type = 'Cylinder';
      boundsRadius = true;
    }

    stream.writeFlag(type);
    stream.startBlock('Vertices', vertices);
    stream.writeVector(this.vertices[0]);

    if (vertices === 2) {
      stream.writeVector(this.vertices[1]);
    }

    stream.endBlock();

    if (boundsRadius) {
      stream.writeNumberAttrib('BoundsRadius', this.boundsRadius);
    }

    this.writeGenericAnimations(stream);
    stream.endBlock();
  }

  override getByteLength(): number {
    let size = 16 + super.getByteLength();

    if (this.type !== Shape.Sphere) {
      size += 12;
    }

    if (this.type === Shape.Sphere || this.type === Shape.Cylinder) {
      size += 4;
    }

    return size;
  }
}
