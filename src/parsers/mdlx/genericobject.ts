import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import AnimatedObject from './animatedobject';

/**
 * A generic object.
 *
 * The parent class for all objects that exist in the world, and may contain spatial animations.
 * This includes bones, particle emitters, and many other things.
 */
export default abstract class GenericObject extends AnimatedObject {
  name: string = '';
  objectId: number = -1;
  parentId: number = -1;
  flags: number;

  constructor(flags: number = 0) {
    super();

    this.flags = flags;
  }

  readMdx(stream: BinaryStream) {
    let size = stream.readUint32();

    this.name = stream.read(80);
    this.objectId = stream.readInt32();
    this.parentId = stream.readInt32();
    this.flags = stream.readUint32();

    this.readAnimations(stream, size - 96);
  }

  writeMdx(stream: BinaryStream) {
    stream.writeUint32(this.getGenericByteLength());
    stream.write(this.name);
    stream.skip(80 - this.name.length);
    stream.writeInt32(this.objectId);
    stream.writeInt32(this.parentId);
    stream.writeUint32(this.flags);

    for (let animation of this.eachAnimation(true)) {
      animation.writeMdx(stream);
    }
  }

  writeNonGenericAnimationChunks(stream: BinaryStream) {
    for (let animation of this.eachAnimation(false)) {
      animation.writeMdx(stream);
    }
  }

  * readGenericBlock(stream: TokenStream) {
    this.name = stream.read();

    for (let token of this.readAnimatedBlock(stream)) {
      if (token === 'ObjectId') {
        this.objectId = stream.readInt();
      } else if (token === 'Parent') {
        this.parentId = stream.readInt();
      } else if (token === 'BillboardedLockZ') {
        this.flags |= 0x40;
      } else if (token === 'BillboardedLockY') {
        this.flags |= 0x20;
      } else if (token === 'BillboardedLockX') {
        this.flags |= 0x10;
      } else if (token === 'Billboarded') {
        this.flags |= 0x8;
      } else if (token === 'CameraAnchored') {
        this.flags |= 0x80;
      } else if (token === 'DontInherit') {
        for (token of stream.readBlock()) {
          if (token === 'Rotation') {
            this.flags |= 0x2;
          } else if (token === 'Translation') {
            this.flags |= 0x1;
          } else if (token === 'Scaling') {
            this.flags |= 0x4;
          }
        }
      } else if (token === 'Translation') {
        this.readAnimation(stream, 'KGTR');
      } else if (token === 'Rotation') {
        this.readAnimation(stream, 'KGRT');
      } else if (token === 'Scaling') {
        this.readAnimation(stream, 'KGSC');
      } else {
        yield token;
      }
    }
  }

  writeGenericHeader(stream: TokenStream) {
    stream.writeNumberAttrib('ObjectId', this.objectId);

    if (this.parentId !== -1) {
      stream.writeNumberAttrib('Parent', this.parentId);
    }

    if (this.flags & 0x40) {
      stream.writeFlag('BillboardedLockZ');
    }

    if (this.flags & 0x20) {
      stream.writeFlag('BillboardedLockY');
    }

    if (this.flags & 0x10) {
      stream.writeFlag('BillboardedLockX');
    }

    if (this.flags & 0x8) {
      stream.writeFlag('Billboarded');
    }

    if (this.flags & 0x80) {
      stream.writeFlag('CameraAnchored');
    }

    if (this.flags & 0x2) {
      stream.writeFlag(`DontInherit { Rotation }`);
    }

    if (this.flags & 0x1) {
      stream.writeFlag(`DontInherit { Translation }`);
    }

    if (this.flags & 0x4) {
      stream.writeFlag(`DontInherit { Scaling }`);
    }
  }

  writeGenericAnimations(stream: TokenStream) {
    this.writeAnimation(stream, 'KGTR');
    this.writeAnimation(stream, 'KGRT');
    this.writeAnimation(stream, 'KGSC');
  }

  /**
   * Allows to easily iterate either the GenericObject animations or the parent object animations.
   */
  * eachAnimation(wantGeneric: boolean) {
    for (let animation of this.animations) {
      let name = animation.name;
      let isGeneric = (name === 'KGTR' || name === 'KGRT' || name === 'KGSC');

      if ((wantGeneric && isGeneric) || (!wantGeneric && !isGeneric)) {
        yield animation;
      }
    }
  }

  /**
   * Gets the byte length of the GenericObject part of whatever this object this.
   * 
   * This is needed because only the KGTR, KGRT, and KGSC animations actually belong to it.
   */
  getGenericByteLength() {
    let size = 96;

    for (let animation of this.eachAnimation(true)) {
      size += animation.getByteLength();
    }

    return size;
  }

  getByteLength() {
    return 96 + super.getByteLength();
  }
}
