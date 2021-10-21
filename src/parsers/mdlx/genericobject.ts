import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import AnimatedObject from './animatedobject';
import { Animation } from './animations';

export const enum Flags {
  None = 0x0,
  DontInheritTranslation = 0x1,
  DontInheritScaling = 0x2,
  DontInheritRotation = 0x4,
  Billboarded = 0x8,
  BillboardedLockX = 0x10,
  BillboardedLockY = 0x20,
  BillboardedLockZ = 0x40,
  CameraAnchored = 0x80,
}

/**
 * A generic object.
 *
 * The parent class for all objects that exist in the world, and may contain spatial animations.
 * This includes bones, particle emitters, and many other things.
 */
export default abstract class GenericObject extends AnimatedObject {
  name = '';
  objectId = -1;
  parentId = -1;
  flags: Flags;

  constructor(flags = Flags.None) {
    super();

    this.flags = flags;
  }

  readMdx(stream: BinaryStream): void {
    const size = stream.readUint32();

    this.name = stream.read(80);
    this.objectId = stream.readInt32();
    this.parentId = stream.readInt32();
    this.flags = stream.readUint32();

    this.readAnimations(stream, size - 96);
  }

  writeMdx(stream: BinaryStream): void {
    stream.writeUint32(this.getGenericByteLength());
    stream.skip(80 - stream.write(this.name));
    stream.writeInt32(this.objectId);
    stream.writeInt32(this.parentId);
    stream.writeUint32(this.flags);

    for (const animation of this.eachAnimation(true)) {
      animation.writeMdx(stream);
    }
  }

  writeNonGenericAnimationChunks(stream: BinaryStream): void {
    for (const animation of this.eachAnimation(false)) {
      animation.writeMdx(stream);
    }
  }

  * readGenericBlock(stream: TokenStream): Generator<string> {
    this.name = stream.read();

    for (let token of this.readAnimatedBlock(stream)) {
      if (token === 'ObjectId') {
        this.objectId = stream.readInt();
      } else if (token === 'Parent') {
        this.parentId = stream.readInt();
      } else if (token === 'BillboardedLockZ') {
        this.flags |= Flags.BillboardedLockZ;
      } else if (token === 'BillboardedLockY') {
        this.flags |= Flags.BillboardedLockY;
      } else if (token === 'BillboardedLockX') {
        this.flags |= Flags.BillboardedLockX;
      } else if (token === 'Billboarded') {
        this.flags |= Flags.Billboarded;
      } else if (token === 'CameraAnchored') {
        this.flags |= Flags.CameraAnchored;
      } else if (token === 'DontInherit') {
        for (token of stream.readBlock()) {
          if (token === 'Rotation') {
            this.flags |= Flags.DontInheritRotation;
          } else if (token === 'Translation') {
            this.flags |= Flags.DontInheritTranslation;
          } else if (token === 'Scaling') {
            this.flags |= Flags.DontInheritScaling;
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

  writeGenericHeader(stream: TokenStream): void {
    stream.writeNumberAttrib('ObjectId', this.objectId);

    if (this.parentId !== -1) {
      stream.writeNumberAttrib('Parent', this.parentId);
    }

    if (this.flags & Flags.BillboardedLockZ) {
      stream.writeFlag('BillboardedLockZ');
    }

    if (this.flags & Flags.BillboardedLockY) {
      stream.writeFlag('BillboardedLockY');
    }

    if (this.flags & Flags.BillboardedLockX) {
      stream.writeFlag('BillboardedLockX');
    }

    if (this.flags & Flags.Billboarded) {
      stream.writeFlag('Billboarded');
    }

    if (this.flags & Flags.CameraAnchored) {
      stream.writeFlag('CameraAnchored');
    }

    if (this.flags & Flags.DontInheritRotation) {
      stream.writeFlag(`DontInherit { Rotation }`);
    }

    if (this.flags & Flags.DontInheritTranslation) {
      stream.writeFlag(`DontInherit { Translation }`);
    }

    if (this.flags & Flags.DontInheritScaling) {
      stream.writeFlag(`DontInherit { Scaling }`);
    }
  }

  writeGenericAnimations(stream: TokenStream): void {
    this.writeAnimation(stream, 'KGTR');
    this.writeAnimation(stream, 'KGRT');
    this.writeAnimation(stream, 'KGSC');
  }

  /**
   * Allows to easily iterate either the GenericObject animations or the parent object animations.
   */
  * eachAnimation(wantGeneric: boolean): Generator<Animation> {
    for (const animation of this.animations) {
      const name = animation.name;
      const isGeneric = (name === 'KGTR' || name === 'KGRT' || name === 'KGSC');

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
  getGenericByteLength(): number {
    let size = 96;

    for (const animation of this.eachAnimation(true)) {
      size += animation.getByteLength();
    }

    return size;
  }

  override getByteLength(): number {
    return 96 + super.getByteLength();
  }
}
