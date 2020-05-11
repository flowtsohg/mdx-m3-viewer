import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import GenericObject from './genericobject';

/**
 * A collision shape.
 */
export default class CollisionShape extends GenericObject {
  type: number = -1;
  vertices: Float32Array[] = [new Float32Array(3), new Float32Array(3)]
  boundsRadius: number = 0;

  constructor() {
    super(0x2000);
  }

  readMdx(stream: BinaryStream) {
    super.readMdx(stream);

    this.type = stream.readUint32();

    stream.readFloat32Array(this.vertices[0]);

    if (this.type !== 2) {
      stream.readFloat32Array(this.vertices[1]);
    }

    if (this.type === 2 || this.type === 3) {
      this.boundsRadius = stream.readFloat32();
    }
  }

  writeMdx(stream: BinaryStream) {
    super.writeMdx(stream);

    stream.writeUint32(this.type);
    stream.writeFloat32Array(this.vertices[0]);

    if (this.type !== 2) {
      stream.writeFloat32Array(this.vertices[1]);
    }

    if (this.type === 2 || this.type === 3) {
      stream.writeFloat32(this.boundsRadius);
    }
  }

  readMdl(stream: TokenStream) {
    for (let token of super.readGenericBlock(stream)) {
      if (token === 'Box') {
        this.type = 0;
      } else if (token === 'Plane') {
        this.type = 1;
      } else if (token === 'Sphere') {
        this.type = 2;
      } else if (token === 'Cylinder') {
        this.type = 3;
      } else if (token === 'Vertices') {
        let count = stream.readInt();

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

  writeMdl(stream: TokenStream) {
    stream.startObjectBlock('CollisionShape', this.name);
    this.writeGenericHeader(stream);

    let type = '';
    let vertices = 2;
    let boundsRadius = false;

    if (this.type === 0) {
      type = 'Box';
    } else if (this.type === 1) {
      type = 'Plane';
    } else if (this.type === 2) {
      type = 'Sphere';
      vertices = 1;
      boundsRadius = true;
    } else if (this.type === 3) {
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

  getByteLength() {
    let size = 16 + super.getByteLength();

    if (this.type !== 2) {
      size += 12;
    }

    if (this.type === 2 || this.type === 3) {
      size += 4;
    }

    return size;
  }
}
