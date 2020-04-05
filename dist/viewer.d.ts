declare module 'version' {
	export const version = "5.0.0-beta.21";

}
declare module 'common/gl-matrix-addon' {
	import { vec3, vec4, quat, mat4 } from 'gl-matrix';
	export const VEC3_UNIT_X: vec3;
	export const VEC3_UNIT_Y: vec3;
	export const VEC3_UNIT_Z: vec3;
	export const VEC3_ZERO: vec3;
	export const VEC3_ONE: vec3;
	export const QUAT_ZERO: vec4;
	export const QUAT_DEFAULT: quat;
	export function unproject(out: vec3, v: vec3, inverseMatrix: mat4, viewport: vec4): vec3;
	/**
	 * Get the distance of a point from a plane.
	 *
	 *     dot(plane, vec4(point, 1))
	 */
	export function distanceToPlane(plane: vec4, point: vec3): number;
	/**
	 * Get the distance of a point from a plane.
	 *
	 *     dot(plane, vec4(x, y, 0, 1))
	 */
	export function distanceToPlane2(plane: vec4, x: number, y: number): number;
	/**
	 * Get the distance of a point from a plane.
	 *
	 *     dot(plane, vec4(x, y, z, 1))
	 */
	export function distanceToPlane3(plane: vec4, x: number, y: number, z: number): number;
	/**
	 * Test it a sphere with the given center and radius intersects the given planes.
	 * If it doesn't, the index of the first plane that proved this is returned.
	 * Otherwise returns -1.
	 *
	 * If first is given, the test will begin from the plane at that index.
	 */
	export function testSphere(planes: vec4[], x: number, y: number, z: number, r: number, first: number): number;
	/**
	 * Test if a cell with the given coordinates intersects the given planes.
	 * If it doesn't, the index of the first plane that proved this is returned.
	 * Otherwise returns -1.
	 *
	 * If first is given, the test will begin from the plane at that index.
	 */
	export function testCell(planes: vec4[], left: number, right: number, bottom: number, top: number, first: number): number;
	export function planeLength(plane: vec4): number;
	/**
	 * Normalize a plane.
	 *
	 * Note that this is not the same as normalizing a vec4.
	 */
	export function normalizePlane(out: vec4, plane: vec4): void;
	/**
	 * Unpacks a matrix's planes.
	 */
	export function unpackPlanes(planes: vec4[], m: mat4): void;
	/**
	 * A look-at matrix, but for quaternions.
	 *
	 * See https://stackoverflow.com/a/52551983/2503048
	 */
	export function quatLookAt(out: quat, from: vec3, to: vec3, worldUp: vec3): quat;

}
declare module 'common/math' {
	/**
	 * Convert from degrees to radians.
	 */
	export function degToRad(degrees: number): number;
	/**
	 * Convert from radians to degrees.
	 */
	export function radToDeg(radians: number): number;
	/**
	 * Gets a random number between a range.
	 */
	export function randomInRange(a: number, b: number): number;
	/**
	 * Clamp a number in a range.
	 */
	export function clamp(x: number, minVal: number, maxVal: number): number;
	/**
	 * Linear interpolation.
	 */
	export function lerp(a: number, b: number, t: number): number;
	/**
	 * Hermite interpolation.
	 */
	export function hermite(a: number, b: number, c: number, d: number, t: number): number;
	/**
	 * Bezier interpolation.
	 */
	export function bezier(a: number, b: number, c: number, d: number, t: number): number;
	/**
	 * Copies the sign of one number onto another.
	 */
	export function copysign(x: number, y: number): number;
	/**
	 * Gets the closest power of two bigger or equal to the given number.
	 */
	export function powerOfTwo(x: number): number;
	/**
	 * Is this number a power of two?
	 */
	export function isPowerOfTwo(x: number): boolean;

}
declare module 'common/canvas' {
	export function blobToImage(blob: Blob): Promise<HTMLImageElement>;
	export function blobToImageData(blob: Blob): Promise<unknown>;
	export function imageDataToBlob(imageData: ImageData): Promise<Blob | null>;
	export function imageDataToDataUrl(imageData: ImageData): string;
	export function imageDataToImage(imageData: ImageData): HTMLImageElement;
	export function imageToImageData(image: TexImageSource): ImageData;
	export function scaleNPOT(imageData: ImageData): ImageData;
	export function resizeImageData(data: ImageData, width: number, height: number): ImageData;

}
declare module 'common/geometry' {
	/**
	 * Creates a rectangle geometry object.
	 */
	export function createRectangle(w: number, d: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array;
	    edges: Uint8Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a unit rectangle geometry object.
	 */
	export function createUnitRectangle(): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array;
	    edges: Uint8Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a cube geometry object.
	 */
	export function createCube(w: number, d: number, h: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array;
	    edges: Uint8Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a unit cube geometry object.
	 */
	export function createUnitCube(): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array;
	    edges: Uint8Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a sphere geometry object.
	 */
	export function createSphere(radius: number, stacks: number, slices: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array | Uint16Array | Uint32Array;
	    edges: Uint8Array | Uint16Array | Uint32Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a unit sphere geometry object.
	 */
	export function createUnitSphere(stacks: number, slices: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array | Uint16Array | Uint32Array;
	    edges: Uint8Array | Uint16Array | Uint32Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a cylinder geometry object.
	 */
	export function createCylinder(radius: number, height: number, slices: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array | Uint16Array | Uint32Array;
	    edges: Uint8Array | Uint16Array | Uint32Array;
	    boundingRadius: number;
	};
	/**
	 * Creates a unit cylinder geometry object.
	 */
	export function createUnitCylinder(slices: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array | Uint16Array | Uint32Array;
	    edges: Uint8Array | Uint16Array | Uint32Array;
	    boundingRadius: number;
	};
	/**
	 * Create a furstum geometry.
	 */
	export function createFrustum(fieldOfView: number, aspectRatio: number, nearClipPlane: number, farClipPlane: number): {
	    vertices: Float32Array;
	    uvs: Float32Array;
	    faces: Uint8Array;
	    edges: Uint8Array;
	    boundingRadius: number;
	};

}
declare module 'common/typecast' {
	/**
	 * Typecast a 8 bit unsigned integer to a 8 bits signed integer.
	 */
	export function uint8ToInt8(a: number): number;
	/**
	 * Typecast two 8 bit unsigned integers to a 16 bits signed integer.
	 */
	export function uint8ToInt16(a: number, b: number): number;
	/**
	 * Typecast three 8 bit unsigned integers to a 24 bits signed integer.
	 */
	export function uint8ToInt24(a: number, b: number, c: number): number;
	/**
	 * Typecast four 8 bit unsigned integers to a 32 bits signed integer.
	 */
	export function uint8ToInt32(a: number, b: number, c: number, d: number): number;
	/**
	 * Typecast two 8 bit unsigned integers to a 16 bits unsigned integer.
	 */
	export function uint8ToUint16(a: number, b: number): number;
	/**
	 * Typecast three 8 bit unsigned integers to a 24 bits unsigned integer.
	 */
	export function uint8ToUint24(a: number, b: number, c: number): number;
	/**
	 * Typecast four 8 bit unsigned integers to a 32 bits unsigned integer.
	 */
	export function uint8ToUint32(a: number, b: number, c: number, d: number): number;
	/**
	 * Typecast four 8 bit unsigned integers to a 32 bits IEEE float.
	 */
	export function uint8ToFloat32(a: number, b: number, c: number, d: number): number;
	/**
	 * Typecast eight 8 bit unsigned integers to a 64 bits IEEE float.
	 */
	export function uint8ToFloat64(a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number): number;
	/**
	 * Typecast a 8 bit signed integer to a 8 bit unsigned integer.
	 */
	export function int8ToUint8(a: number): number;
	/**
	 * Typecast a 16 bit signed integer to two 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function int16ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 24 bit signed integer to three 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function int24ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 32 bit signed integer to four 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function int32ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 16 bit unsigned integer to two 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function uint16ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 24 bit unsigned integer to three 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function uint24ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 32 bit unsigned integer to four 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function uint32ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 32 bit IEEE float to four 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function float32ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a 64 bit IEEE float to eight 8 bit unsigned integers.
	 *
	 * The result is stored in out.
	 */
	export function float64ToUint8(out: Uint8Array, a: number): Uint8Array;
	/**
	 * Typecast a normal JavaScript number to a 32 bits unsigned integer.
	 */
	export function numberToUint32(number: number): number;
	/**
	 * Interperts a string as a base 256 number.
	 */
	export function stringToBase256(string: string): number;
	/**
	 * Interperts a number as a base 256 string.
	 */
	export function base256ToString(number: number): string;

}
declare module 'common/binarystream' {
	/// <reference types="./src/types" />
	/**
	 * A binary stream.
	 */
	export default class BinaryStream {
	    buffer: ArrayBuffer;
	    uint8array: Uint8Array;
	    index: number;
	    byteLength: number;
	    constructor(buffer: ArrayBuffer | TypedArray, byteOffset?: number, byteLength?: number);
	    /**
	     * Create a subreader of this reader, at its position, with the given byte length.
	     */
	    substream(byteLength: number): BinaryStream;
	    /**
	     * Get the remaining bytes.
	     */
	    remaining(): number;
	    /**
	     * Skip a number of bytes.
	     */
	    skip(bytes: number): void;
	    /**
	     * Set the reader's index.
	     */
	    seek(index: number): void;
	    /**
	     * Get the reader's index.
	     */
	    tell(): number;
	    /**
	     * Peek a string.
	     */
	    peek(size: number, allowNulls?: boolean): string;
	    /**
	     * Read a string.
	     */
	    read(size: number, allowNulls?: boolean): string;
	    /**
	     * Peeks a string until finding a null byte.
	     */
	    peekUntilNull(): string;
	    /**
	     * Read a string until finding a null byte.
	     */
	    readUntilNull(): string;
	    /**
	     * Peek a character array.
	     */
	    peekCharArray(size: number): string[];
	    /**
	     * Read a character array.
	     */
	    readCharArray(size: number): string[];
	    /**
	     * Read a 8 bit signed integer.
	     */
	    readInt8(): number;
	    /**
	     * Read a 16 bit signed integer.
	     */
	    readInt16(): number;
	    /**
	     * Read a 32 bit signed integer.
	     */
	    readInt32(): number;
	    /**
	     * Read a 8 bit unsigned integer.
	     */
	    readUint8(): number;
	    /**
	     * Read a 16 bit unsigned integer.
	     */
	    readUint16(): number;
	    /**
	     * Read a 32 bit unsigned integer.
	     */
	    readUint32(): number;
	    /**
	     * Read a 32 bit float.
	     */
	    readFloat32(): number;
	    /**
	     * Read a 64 bit float.
	     */
	    readFloat64(): number;
	    /**
	     * Read an array of 8 bit signed integers.
	     */
	    readInt8Array(view: number | Int8Array): Int8Array;
	    /**
	     * Read an array of 16 bit signed integers.
	     */
	    readInt16Array(view: number | Int16Array): Int16Array;
	    /**
	     * Read an array of 32 bit signed integers.
	     */
	    readInt32Array(view: number | Int32Array): Int32Array;
	    /**
	     * Read an array of 8 bit unsigned integers.
	     */
	    readUint8Array(view: number | Uint8Array): Uint8Array;
	    /**
	     * Read an array of 16 bit unsigned integers.
	     */
	    readUint16Array(view: number | Uint16Array): Uint16Array;
	    /**
	     * Read an array of 32 bit unsigned integers.
	     */
	    readUint32Array(view: number | Uint32Array): Uint32Array;
	    /**
	     * Read an array of 32 bit floats.
	     */
	    readFloat32Array(view: number | Float32Array): Float32Array;
	    /**
	     * Read an array of 64 bit floats.
	     */
	    readFloat64Array(view: number | Float64Array): Float64Array;
	    /**
	     * Read into any typed array.
	     *
	     * Note that this is slower than the typed reading functions.
	     */
	    readTypedArray(view: TypedArray): TypedArray;
	    /**
	     * Write a string.
	     */
	    write(value: string): void;
	    /**
	     * Write a 8 bit signed integer.
	     */
	    writeInt8(value: number): void;
	    /**
	     * Write a 16 bit signed integer.
	     */
	    writeInt16(value: number): void;
	    /**
	     * Write a 32 bit signed integer.
	     */
	    writeInt32(value: number): void;
	    /**
	     * Write a 8 bit unsigned integer.
	     */
	    writeUint8(value: number): void;
	    /**
	     * Write a 16 bit unsigned integer.
	     */
	    writeUint16(value: number): void;
	    /**
	     * Write a 32 bit unsigned integer.
	     */
	    writeUint32(value: number): void;
	    /**
	     * Write a 32 bit float.
	     */
	    writeFloat32(value: number): void;
	    /**
	     * Write a 64 bit float.
	     */
	    writeFloat64(value: number): void;
	    /**
	     * Write an array of 8 bit signed integers.
	     */
	    writeInt8Array(view: Int8Array): void;
	    /**
	     * Write an array of 16 bit signed integers.
	     */
	    writeInt16Array(view: Int16Array): void;
	    /**
	     * Write an array of 32 bit signed integers.
	     */
	    writeInt32Array(view: Int32Array): void;
	    /**
	     * Write an array of 8 bit unsigned integers.
	     */
	    writeUint8Array(view: Uint8Array): void;
	    /**
	     * Write an array of 16 bit unsigned integers.
	     */
	    writeUint16Array(view: Uint16Array): void;
	    /**
	     * Write an array of 32 bit unsigned integers.
	     */
	    writeUint32Array(view: Uint32Array): void;
	    /**
	     * Write an array of 32 bit floats.
	     */
	    writeFloat32Array(view: Float32Array): void;
	    /**
	     * Write an array of 64 bit floats.
	     */
	    writeFloat64Array(view: Float64Array): void;
	    /**
	     * Write any typed array.
	     *
	     * Note that this is slower than the typed writing functions.
	     */
	    writeTypedArray(view: TypedArray): void;
	}

}
declare module 'common/bitstream' {
	/// <reference types="./src/types" />
	/**
	 * A bit stream.
	 */
	export default class BitStream {
	    buffer: ArrayBuffer;
	    uint8array: Uint8Array;
	    index: number;
	    byteLength: number;
	    bitBuffer: number;
	    bits: number;
	    constructor(buffer: ArrayBuffer | TypedArray, byteOffset?: number, byteLength?: number);
	    /**
	     * Peek a number of bits.
	     */
	    peekBits(bits: number): number;
	    /**
	     * Read a number of bits.
	     */
	    readBits(bits: number): number;
	    /**
	     * Skip a number of bits.
	     */
	    skipBits(bits: number): void;
	    /**
	     * Load more bits into the buffer.
	     */
	    loadBits(bits: number): void;
	}

}
declare module 'common/urlwithparams' {
	/**
	 * Appends url parameters given in params to the url given in src.
	 *
	 * The source url can have url parameters already in it.
	 */
	export default function urlWithParams(src: string, params: object): string;

}
declare module 'common/index' {
	import * as glMatrix from 'gl-matrix';
	import * as glMatrixAddon from 'common/gl-matrix-addon';
	import * as math from 'common/math';
	import * as canvas from 'common/canvas';
	import * as geometry from 'common/geometry';
	import BinaryStream from 'common/binarystream';
	import BitStream from 'common/bitstream';
	import urlWithParams from 'common/urlwithparams'; const _default: {
	    glMatrix: typeof glMatrix;
	    glMatrixAddon: typeof glMatrixAddon;
	    math: typeof math;
	    canvas: typeof canvas;
	    geometry: typeof geometry;
	    BinaryStream: typeof BinaryStream;
	    BitStream: typeof BitStream;
	    urlWithParams: typeof urlWithParams;
	};
	export default _default;

}
declare module 'parsers/ini/file' {
	/**
	 * An INI file.
	 */
	export default class IniFile {
	    properties: Map<string, string>;
	    sections: Map<string, Map<string, string>>;
	    constructor(buffer?: string);
	    load(buffer: string): void;
	    save(): string;
	    getSection(name: string): Map<string, string> | undefined;
	}

}
declare module 'parsers/ini/index' {
	import File from 'parsers/ini/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/slk/file' {
	/**
	 * A SLK table file.
	 */
	export default class SlkFile {
	    rows: (string | number | boolean)[][];
	    constructor(buffer?: string);
	    load(buffer: string): void;
	}

}
declare module 'parsers/slk/index' {
	import File from 'parsers/slk/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'common/stringreverse' {
	/**
	 * Reverses a string.
	 */
	export default function reverse(s: string): string;

}
declare module 'parsers/m3/reference' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	/**
	 * A reference.
	 */
	export default class M3ParserReference {
	    index: IndexEntry[];
	    entries: number;
	    id: number;
	    flags: number;
	    constructor(reader: BinaryStream, index: IndexEntry[]);
	    /**
	     * Get the entries this index entry references.
	     */
	    getAll(): any[] | Float32Array | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array | Float64Array | Uint8ClampedArray;
	    /**
	     * Get the first entry this index entry references.
	     */
	    get(): any;
	}

}
declare module 'parsers/m3/md34' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * The M3 header.
	 */
	export default class M3ParserMd34 {
	    version: number;
	    tag: string;
	    offset: number;
	    entries: number;
	    model: Reference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/boundingsphere' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A bounding sphere.
	 */
	export default class M3ParserBoundingSphere {
	    min: Float32Array;
	    max: Float32Array;
	    radius: number;
	    constructor(reader: BinaryStream);
	}

}
declare module 'parsers/m3/boundingshape' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A bounding shape.
	 */
	export default class M3ParserBoundingShape {
	    shape: number;
	    bone: number;
	    unknown0: number;
	    matrix: Float32Array;
	    unknown1: number;
	    unknown2: number;
	    unknown3: number;
	    unknown4: number;
	    unknown5: number;
	    unknown6: number;
	    size: Float32Array;
	    constructor(reader: BinaryStream);
	}

}
declare module 'parsers/m3/modelheader' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	import BoundingSphere from 'parsers/m3/boundingsphere';
	import BoundingShape from 'parsers/m3/boundingshape';
	/**
	 * The model information structure.
	 */
	export default class M3ParserModel {
	    version: number;
	    modelName: Reference;
	    flags: number;
	    sequences: Reference;
	    stc: Reference;
	    stg: Reference;
	    unknown0: number;
	    unknown1: number;
	    unknown2: number;
	    unknown3: number;
	    sts: Reference;
	    bones: Reference;
	    numberOfBonesToCheckForSkin: number;
	    vertexFlags: number;
	    vertices: Reference;
	    divisions: Reference;
	    boneLookup: Reference;
	    boundings: BoundingSphere;
	    unknown4To20: Uint32Array;
	    attachmentPoints: Reference;
	    attachmentPointAddons: Reference;
	    ligts: Reference;
	    shbxData: Reference;
	    cameras: Reference;
	    unknown21: Reference;
	    materialReferences: Reference;
	    materials: Reference[];
	    particleEmitters: Reference;
	    particleEmitterCopies: Reference;
	    ribbonEmitters: Reference;
	    projections: Reference;
	    forces: Reference;
	    warps: Reference;
	    unknown22: Reference;
	    rigidBodies: Reference;
	    unknown23: Reference;
	    physicsJoints: Reference;
	    clothBehavior: Reference | null;
	    unknown24: Reference;
	    ikjtData: Reference;
	    unknown25: Reference;
	    unknown26: Reference | null;
	    partsOfTurrentBehaviors: Reference;
	    turrentBehaviors: Reference;
	    absoluteInverseBoneRestPositions: Reference;
	    tightHitTest: BoundingShape;
	    fuzzyHitTestObjects: Reference;
	    attachmentVolumes: Reference;
	    attachmentVolumesAddon0: Reference;
	    attachmentVolumesAddon1: Reference;
	    billboardBehaviors: Reference;
	    tmdData: Reference;
	    unknown27: number;
	    unknown28: Reference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/sequence' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	import BoundingSphere from 'parsers/m3/boundingsphere';
	/**
	 * A sequence.
	 */
	export default class M3ParserSequence {
	    version: number;
	    name: Reference;
	    interval: Uint32Array;
	    movementSpeed: number;
	    flags: number;
	    frequency: number;
	    boundingSphere: BoundingSphere;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/stc' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * An animation timeline.
	 */
	export default class M3ParserStc {
	    version: number;
	    name: Reference;
	    runsConcurrent: number;
	    priority: number;
	    stsIndex: number;
	    stsIndexCopy: number;
	    animIds: Reference;
	    animRefs: Reference;
	    sd: Reference[];
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/stg' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * An animation getter.
	 */
	export default class M3ParserStg {
	    version: number;
	    name: Reference;
	    stcIndices: Reference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/sts' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * An animation validator.
	 */
	export default class M3ParserSts {
	    version: number;
	    animIds: Reference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/animationreference' {
	import BinaryStream from 'common/binarystream';
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
	    constructor(reader: BinaryStream);
	}
	/**
	 * A pixel animation reference.
	 */
	export class M3ParserPixelAnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}
	/**
	 * A uint16 animation reference.
	 */
	export class M3ParserUint16AnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}
	/**
	 * A uint32 animation reference.
	 */
	export class M3ParserUint32AnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}
	/**
	 * A float32 animation reference.
	 */
	export class M3ParserFloat32AnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}
	/**
	 * A vec2 animation reference.
	 */
	export class M3ParserVector2AnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}
	/**
	 * A vec3 animation reference.
	 */
	export class M3ParserVector3AnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}
	/**
	 * A quat animation reference.
	 */
	export class M3ParserVector4AnimationReference extends M3ParserAnimationReference {
	    readInitNullValues(reader: BinaryStream): void;
	}

}
declare module 'parsers/m3/bone' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	import { M3ParserUint32AnimationReference, M3ParserVector3AnimationReference, M3ParserVector4AnimationReference } from 'parsers/m3/animationreference';
	/**
	 * A bone.
	 */
	export default class M3ParserBone {
	    version: number;
	    unknown0: number;
	    name: Reference;
	    flags: number;
	    parent: number;
	    unknown1: number;
	    location: M3ParserVector3AnimationReference;
	    rotation: M3ParserVector4AnimationReference;
	    scale: M3ParserVector3AnimationReference;
	    visibility: M3ParserUint32AnimationReference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/division' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * A division.
	 */
	export default class M3ParserDivision {
	    version: number;
	    triangles: Reference;
	    regions: Reference;
	    batches: Reference;
	    MSEC: Reference;
	    unknown0: number;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/region' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	/**
	 * A region.
	 */
	export default class M3ParserRegion {
	    version: number;
	    unknown0: number;
	    unknown1: number;
	    firstVertexIndex: number;
	    verticesCount: number;
	    firstTriangleIndex: number;
	    triangleIndicesCount: number;
	    bonesCount: number;
	    firstBoneLookupIndex: number;
	    boneLookupIndicesCount: number;
	    unknown2: number;
	    boneWeightPairsCount: number;
	    unknown3: number;
	    rootBoneIndex: number;
	    unknown4: number;
	    unknown5: Uint8Array | null;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/batch' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	/**
	 * A batch.
	 */
	export default class M3ParserBatch {
	    version: number;
	    unknown0: number;
	    regionIndex: number;
	    unknown1: number;
	    materialReferenceIndex: number;
	    unknown2: number;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/materialreference' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	/**
	 * A material reference.
	 */
	export default class M3ParserMaterialReference {
	    version: number;
	    materialType: number;
	    materialIndex: number;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/standardmaterial' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	import { M3ParserFloat32AnimationReference, M3ParserUint32AnimationReference } from 'parsers/m3/animationreference';
	/**
	 * A standard material.
	 */
	export default class M3ParserStandardMaterial {
	    version: number;
	    name: Reference;
	    additionalFlags: number;
	    flags: number;
	    blendMode: number;
	    priority: number;
	    usedRTTChannels: number;
	    specularity: number;
	    depthBlendFalloff: number;
	    cutoutThreshold: number;
	    unknown1: number;
	    unknown2: number;
	    unknown3: number;
	    specMult: number;
	    emisMult: number;
	    diffuseLayer: Reference;
	    decalLayer: Reference;
	    specularLayer: Reference;
	    glossLayer: Reference | null;
	    emissiveLayer: Reference;
	    emissive2Layer: Reference;
	    evioLayer: Reference;
	    evioMaskLayer: Reference;
	    alphaMaskLayer: Reference;
	    alphaMask2Layer: Reference;
	    normalLayer: Reference;
	    heightLayer: Reference;
	    lightMapLayer: Reference;
	    ambientOcclusionLayer: Reference;
	    unknown4: Reference | null;
	    unknown5: Reference | null;
	    unknown6: Reference | null;
	    unknown7: Reference | null;
	    unknown8: number;
	    layerBlendType: number;
	    emisBlendType: number;
	    emisMode: number;
	    specType: number;
	    unknown9: M3ParserFloat32AnimationReference;
	    unknown10: M3ParserUint32AnimationReference;
	    unknown11: Uint8Array | null;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/layer' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	import { M3ParserPixelAnimationReference, M3ParserUint16AnimationReference, M3ParserUint32AnimationReference, M3ParserFloat32AnimationReference, M3ParserVector2AnimationReference, M3ParserVector3AnimationReference } from 'parsers/m3/animationreference';
	/**
	 * A layer.
	 */
	export default class M3ParserLayer {
	    version: number;
	    unknown0: number;
	    imagePath: Reference;
	    color: M3ParserPixelAnimationReference;
	    flags: number;
	    uvSource: number;
	    colorChannelSetting: number;
	    brightMult: M3ParserFloat32AnimationReference;
	    midtoneOffset: M3ParserFloat32AnimationReference;
	    unknown1: number;
	    noiseAmp: number;
	    noiseFreq: number;
	    rttChannel: number;
	    videoFrameRate: number;
	    videoStartFrame: number;
	    videoEndFrame: number;
	    videoMode: number;
	    videoSyncTiming: number;
	    videoPlay: M3ParserUint32AnimationReference;
	    videoRestart: M3ParserUint32AnimationReference;
	    flipBookRows: number;
	    flipBookColumns: number;
	    flipBookFrame: M3ParserUint16AnimationReference;
	    uvOffset: M3ParserVector2AnimationReference;
	    uvAngle: M3ParserVector3AnimationReference;
	    uvTiling: M3ParserVector2AnimationReference;
	    unknown2: M3ParserUint32AnimationReference;
	    unknown3: M3ParserFloat32AnimationReference;
	    brightness: M3ParserFloat32AnimationReference;
	    triPlanarOffset: M3ParserVector3AnimationReference | null;
	    triPlanarScale: M3ParserVector3AnimationReference | null;
	    unknown4: number;
	    fresnelType: number;
	    fresnelExponent: number;
	    fresnelMin: number;
	    fresnelMaxOffset: number;
	    unknown5: number;
	    unknown6: Uint8Array | null;
	    fresnelInvertedMaskX: number;
	    fresnelInvertedMaskY: number;
	    fresnelInvertedMaskZ: number;
	    fresnelRotationYaw: number;
	    fresnelRotationPitch: number;
	    unknown7: number;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/event' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * An event.
	 */
	export default class M3ParserEvent {
	    version: number;
	    name: Reference;
	    unknown0: number;
	    unknown1: number;
	    unknown2: number;
	    matrix: Float32Array;
	    unknown3: number;
	    unknown4: number;
	    unknown5: number;
	    unknown6: number;
	    unknown7: number;
	    unknown8: number;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/attachmentpoint' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * An attachment point.
	 */
	export default class M3ParserAttachmentPoint {
	    version: number;
	    unknown: number;
	    name: Reference;
	    bone: number;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/camera' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	import { M3ParserFloat32AnimationReference } from 'parsers/m3/animationreference';
	/**
	 * A camera.
	 */
	export default class M3ParserCamera {
	    version: number;
	    bone: number;
	    name: Reference;
	    fieldOfView: M3ParserFloat32AnimationReference;
	    unknown0: number;
	    farClip: M3ParserFloat32AnimationReference;
	    nearClip: M3ParserFloat32AnimationReference;
	    clip2: M3ParserFloat32AnimationReference;
	    focalDepth: M3ParserFloat32AnimationReference;
	    falloffStart: M3ParserFloat32AnimationReference;
	    falloffEnd: M3ParserFloat32AnimationReference;
	    depthOfField: M3ParserFloat32AnimationReference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/sd' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import Reference from 'parsers/m3/reference';
	/**
	 * Sequence data.
	 */
	export default class M3ParserSd {
	    version: number;
	    keys: Reference;
	    flags: number;
	    biggestKey: number;
	    values: Reference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/unsupportedentry' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	/**
	 * An unsupported entry.
	 *
	 * This is used for entries that have known structures (or at least sizes), but this parser isn't going to actually parse.
	 * The entry will contain its own reader and version, in case the client code wants to do anything with it.
	 */
	export default class M3ParserUnsupportedEntry {
	    reader: BinaryStream;
	    version: number;
	    index: IndexEntry[];
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/indexentry' {
	/// <reference types="./src/types" />
	import BinaryStream from 'common/binarystream';
	/**
	 * An index entry.
	 */
	export default class IndexEntry {
	    index: IndexEntry[];
	    tag: string;
	    offset: number;
	    version: number;
	    entries: any[] | TypedArray;
	    constructor(reader: BinaryStream, index: IndexEntry[]);
	}

}
declare module 'parsers/m3/model' {
	import IndexEntry from 'parsers/m3/indexentry';
	import ModelHeader from 'parsers/m3/modelheader';
	/**
	 * A model.
	 */
	export default class Model {
	    entries: IndexEntry[];
	    model: ModelHeader | null;
	    constructor(src: ArrayBuffer);
	}

}
declare module 'parsers/m3/index' {
	import Model from 'parsers/m3/model'; const _default: {
	    Model: typeof Model;
	};
	export default _default;

}
declare module 'parsers/mdlx/tokenstream' {
	/// <reference types="./src/types" />
	/**
	 * Used to read and write structured text formats.
	 */
	export default class TokenStream {
	    buffer: string;
	    index: number;
	    ident: number;
	    fractionDigits: number;
	    constructor(buffer?: string);
	    /**
	     * Reads the next token in the stream.
	     * Whitespaces are ignored outside of strings in the form of "".
	     * Comments in the form of // are ignored.
	     * Commas and colons are ignored as well.
	     * Curly braces are used as separators, generally to denote text blocks.
	     *
	     * For example, given the following string:
	     *
	     *     Header "A String" {
	     *         Name Value, // A Comment
	     *     }
	     *
	     * Read will return the values in order:
	     *
	     *     Header
	     *     "A String"
	     *     {
	     *     Name
	     *     Value
	     *     }
	     *
	     * There are wrappers around read, below, that help to read structured code, check them out!
	     */
	    read(): string | undefined;
	    /**
	     * Reads the next token without advancing the stream.
	     */
	    peek(): string | undefined;
	    /**
	     * Same as read, but if the end of the stream was encountered, an error will be raised.
	     */
	    readSafe(): string;
	    /**
	     * Reads the next token, and parses it as an integer.
	     */
	    readInt(): number;
	    /**
	     * Reads the next token, and parses it as a float.
	     */
	    readFloat(): number;
	    /**
	     * Read an MDL keyframe value.
	     * If the value is a scalar, it us just the number.
	     * If the value is a vector, it is enclosed with curly braces.
	     */
	    readKeyframe(value: Uint32Array | Float32Array): Float32Array | Uint32Array;
	    /**
	     * Reads an array of integers in the form:
	     *     { Value1, Value2, ..., ValueN }
	     */
	    readIntArray(view: Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array): Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array;
	    /**
	     * Reads an array of floats in the form:
	     *     { Value1, Value2, ..., ValueN }
	     */
	    readFloatArray(view: Float32Array): Float32Array;
	    /**
	     * Reads into a uint or float typed array.
	     */
	    readTypedArray(view: Uint32Array | Float32Array): void;
	    /**
	     * Reads a color in the form:
	     *
	     *      { R, G, B }
	     *
	     * The color is sizzled to BGR.
	     */
	    readColor(view: Float32Array): void;
	    /**
	     * {
	     *     { Value1, Value2, ..., ValueSize },
	     *     { Value1, Value2, ..., ValueSize },
	     *     ...
	     * }
	     */
	    readVectorArray(view: Float32Array, size: number): Float32Array;
	    /**
	     * Helper generator for block reading.
	     * Let's say we have a block like so:
	     *     {
	     *         Key1 Value1
	     *         Key2 Value2
	     *         ...
	     *         KeyN ValueN
	     *     }
	     * The generator yields the keys one by one, and the caller needs to read the values based on the keys.
	     * It is used for most MDL blocks.
	     */
	    readBlock(): Generator<string | undefined, void, unknown>;
	    /**
	     * Same as readBlock, but throws an error if the end of the stream is reached.
	     */
	    readBlockSafe(): Generator<string, void, unknown>;
	    /**
	     * Writes a color in the form:
	     *
	     *      { B, G, R }
	     *
	     * The color is sizzled to RGB.
	     * The name can be either "Color" or "static Color", depending on the context.
	     */
	    writeColor(name: string, view: Float32Array): void;
	    /**
	     * Flag,
	     */
	    writeFlag(flag: string): void;
	    /**
	     * Name Value,
	     */
	    writeAttrib(name: string, value: number | string): void;
	    /**
	     * Same as writeAttrib, but formats the given number.
	     */
	    writeFloatAttrib(name: string, value: number): void;
	    /**
	     * Name "Value",
	     */
	    writeStringAttrib(name: string, value: string): void;
	    /**
	     * Name { Value0, Value1, ..., ValueN },
	     */
	    writeArrayAttrib(name: string, value: TypedArray): void;
	    /**
	     * Name { Value0, Value1, ..., ValueN },
	     */
	    writeFloatArrayAttrib(name: string, value: Float32Array): void;
	    /**
	     * Write an array of integers or floats.
	     */
	    writeTypedArrayAttrib(name: string, value: Uint32Array | Float32Array): void;
	    /**
	     * Write an MDL keyframe.
	     */
	    writeKeyframe(start: string, value: Uint32Array | Float32Array): void;
	    /**
	     * { Value0, Value1, ..., ValueN },
	     */
	    writeArray(value: TypedArray): void;
	    /**
	     * { Value0, Value1, ..., ValueN },
	     */
	    writeFloatArray(value: Float32Array): void;
	    /**
	     * Name Entries {
	     *     { Value1, Value2, ..., valueSize },
	     *     { Value1, Value2, ..., valueSize },
	     *     ...
	     * }
	     */
	    writeVectorArray(name: string, view: Float32Array, size: number): void;
	    /**
	     * Adds the given string to the buffer.
	     */
	    write(s: string): void;
	    /**
	     * Adds the given string to the buffer.
	     * The current indentation level is prepended, and the stream goes to the next line after the write.
	     */
	    writeLine(line: string): void;
	    /**
	     * Starts a new block in the form:
	     *
	     *      Header1 Header2 ... HeaderN {
	     *          ...
	     *      }
	     */
	    startBlock(...headers: (string | number)[]): void;
	    /**
	     * Starts a new block in the form:
	     *
	     *      Header "Name" {
	     *          ...
	     *      }
	     */
	    startObjectBlock(header: string, name: string): void;
	    /**
	     * Ends a previously started block, and handles the indentation.
	     */
	    endBlock(): void;
	    /**
	     * Ends a previously started block, and handles the indentation.
	     * Adds a comma after the block end.
	     */
	    endBlockComma(): void;
	    /**
	     * Increases the indentation level for following line writes.
	     */
	    indent(): void;
	    /**
	     * Decreases the indentation level for following line writes.
	     */
	    unindent(): void;
	    /**
	     * Formats a given float to the shorter of either its string representation, or its fixed point representation with the stream's fraction digits.
	     */
	    formatFloat(value: number): string;
	    /**
	     * Uses formatFloat to format a whole array, and returns it as a comma separated string.
	     */
	    formatFloatArray(value: Float32Array): string;
	}

}
declare module 'parsers/mdlx/extent' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	/**
	 * An extent.
	 */
	export default class Extent {
	    boundsRadius: number;
	    min: Float32Array;
	    max: Float32Array;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    writeMdl(stream: TokenStream): void;
	}

}
declare module 'parsers/mdlx/sequence' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import Extent from 'parsers/mdlx/extent';
	/**
	 * A sequence.
	 */
	export default class Sequence {
	    name: string;
	    interval: Uint32Array;
	    moveSpeed: number;
	    flags: number;
	    rarity: number;
	    syncPoint: number;
	    extent: Extent;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	}

}
declare module 'parsers/mdlx/animations' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
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
	    abstract readMdxValue(stream: BinaryStream): Uint32Array | Float32Array;
	    abstract readMdlValue(stream: TokenStream): Uint32Array | Float32Array;
	    readMdx(stream: BinaryStream, name: string): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream, name: string): void;
	    writeMdl(stream: TokenStream, name: string): void;
	    getByteLength(): number;
	}
	/**
	 * A uint animation.
	 */
	export class UintAnimation extends Animation {
	    readMdxValue(stream: BinaryStream): Uint32Array;
	    readMdlValue(stream: TokenStream): Float32Array | Uint32Array;
	}
	/**
	 * A float animation
	 */
	export class FloatAnimation extends Animation {
	    readMdxValue(stream: BinaryStream): Float32Array;
	    readMdlValue(stream: TokenStream): Float32Array | Uint32Array;
	}
	/**
	 * A vector 3 animation.
	 */
	export class Vector3Animation extends Animation {
	    readMdxValue(stream: BinaryStream): Float32Array;
	    readMdlValue(stream: TokenStream): Float32Array | Uint32Array;
	}
	/**
	 * A vector 4 animation.
	 */
	export class Vector4Animation extends Animation {
	    readMdxValue(stream: BinaryStream): Float32Array;
	    readMdlValue(stream: TokenStream): Float32Array | Uint32Array;
	}

}
declare module 'parsers/mdlx/animationmap' {
	import { UintAnimation, FloatAnimation, Vector3Animation, Vector4Animation } from 'parsers/mdlx/animations'; const _default: {
	    KMTF: (string | typeof UintAnimation)[];
	    KMTA: (string | typeof FloatAnimation)[];
	    KMTE: (string | typeof FloatAnimation)[];
	    KFC3: (string | typeof Vector3Animation)[];
	    KFCA: (string | typeof FloatAnimation)[];
	    KFTC: (string | typeof FloatAnimation)[];
	    KTAT: (string | typeof Vector3Animation)[];
	    KTAR: (string | typeof Vector4Animation)[];
	    KTAS: (string | typeof Vector3Animation)[];
	    KGAO: (string | typeof FloatAnimation)[];
	    KGAC: (string | typeof Vector3Animation)[];
	    KGTR: (string | typeof Vector3Animation)[];
	    KGRT: (string | typeof Vector4Animation)[];
	    KGSC: (string | typeof Vector3Animation)[];
	    KLAS: (string | typeof FloatAnimation)[];
	    KLAE: (string | typeof FloatAnimation)[];
	    KLAC: (string | typeof Vector3Animation)[];
	    KLAI: (string | typeof FloatAnimation)[];
	    KLBI: (string | typeof FloatAnimation)[];
	    KLBC: (string | typeof Vector3Animation)[];
	    KLAV: (string | typeof FloatAnimation)[];
	    KATV: (string | typeof FloatAnimation)[];
	    KPEE: (string | typeof FloatAnimation)[];
	    KPEG: (string | typeof FloatAnimation)[];
	    KPLN: (string | typeof FloatAnimation)[];
	    KPLT: (string | typeof FloatAnimation)[];
	    KPEL: (string | typeof FloatAnimation)[];
	    KPES: (string | typeof FloatAnimation)[];
	    KPEV: (string | typeof FloatAnimation)[];
	    KP2S: (string | typeof FloatAnimation)[];
	    KP2R: (string | typeof FloatAnimation)[];
	    KP2L: (string | typeof FloatAnimation)[];
	    KP2G: (string | typeof FloatAnimation)[];
	    KP2E: (string | typeof FloatAnimation)[];
	    KP2N: (string | typeof FloatAnimation)[];
	    KP2W: (string | typeof FloatAnimation)[];
	    KP2V: (string | typeof FloatAnimation)[];
	    KRHA: (string | typeof FloatAnimation)[];
	    KRHB: (string | typeof FloatAnimation)[];
	    KRAL: (string | typeof FloatAnimation)[];
	    KRCO: (string | typeof Vector3Animation)[];
	    KRTX: (string | typeof UintAnimation)[];
	    KRVS: (string | typeof FloatAnimation)[];
	    KCTR: (string | typeof Vector3Animation)[];
	    KTTR: (string | typeof Vector3Animation)[];
	    KCRL: (string | typeof UintAnimation)[];
	    KPPA: (string | typeof FloatAnimation)[];
	    KPPC: (string | typeof Vector3Animation)[];
	    KPPE: (string | typeof FloatAnimation)[];
	    KPPL: (string | typeof FloatAnimation)[];
	    KPPS: (string | typeof FloatAnimation)[];
	    KPPV: (string | typeof FloatAnimation)[];
	};
	export default _default;

}
declare module 'parsers/mdlx/animatedobject' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import { Animation } from 'parsers/mdlx/animations';
	/**
	 * The parent class for all objects that have animated data in them.
	 */
	export default class AnimatedObject {
	    animations: Animation[];
	    readAnimations(stream: BinaryStream, size: number): void;
	    writeAnimations(stream: BinaryStream): void;
	    /**
	     * A wrapper around readBlock() which merges static tokens.
	     * E.g.: static Color
	     * This makes the condition blocks in the parent objects linear and simple.
	     */
	    readAnimatedBlock(stream: TokenStream): Generator<string, void, unknown>;
	    readAnimation(stream: TokenStream, name: string): void;
	    writeAnimation(stream: TokenStream, name: string): boolean;
	    /**
	     * AnimatedObject itself doesn't care about versions, however objects that inherit it do.
	     */
	    getByteLength(version?: number): number;
	}

}
declare module 'parsers/mdlx/layer' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import AnimatedObject from 'parsers/mdlx/animatedobject';
	/**
	 * A layer.
	 */
	export default class Layer extends AnimatedObject {
	    filterMode: number;
	    flags: number;
	    textureId: number;
	    textureAnimationId: number;
	    coordId: number;
	    alpha: number;
	    /**
	     * @since 900
	     */
	    emissiveGain: number;
	    /**
	     * @since 1000
	     */
	    fresnelColor: Float32Array;
	    /**
	     * @since 1000
	     */
	    fresnelOpacity: number;
	    /**
	     * @since 1000
	     */
	    fresnelTeamColor: number;
	    readMdx(stream: BinaryStream, version: number): void;
	    writeMdx(stream: BinaryStream, version: number): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/mdlx/material' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import Layer from 'parsers/mdlx/layer';
	/**
	 * A material.
	 */
	export default class Material {
	    priorityPlane: number;
	    flags: number;
	    /**
	     * @since 900
	     */
	    shader: string;
	    layers: Layer[];
	    readMdx(stream: BinaryStream, version: number): void;
	    writeMdx(stream: BinaryStream, version: number): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/mdlx/texture' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	/**
	 * A texture.
	 */
	export default class Texture {
	    replaceableId: number;
	    path: string;
	    flags: number;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	}

}
declare module 'parsers/mdlx/textureanimation' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import AnimatedObject from 'parsers/mdlx/animatedobject';
	/**
	 * A texture animation.
	 */
	export default class TextureAnimation extends AnimatedObject {
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/geoset' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import Extent from 'parsers/mdlx/extent';
	/**
	 * A geoset.
	 */
	export default class Geoset {
	    vertices: Float32Array;
	    normals: Float32Array;
	    faceTypeGroups: Uint32Array;
	    faceGroups: Uint32Array;
	    faces: Uint16Array;
	    vertexGroups: Uint8Array;
	    matrixGroups: Uint32Array;
	    matrixIndices: Uint32Array;
	    materialId: number;
	    selectionGroup: number;
	    selectionFlags: number;
	    /**
	     * @since 900
	     */
	    lod: number;
	    /**
	     * @since 900
	     */
	    lodName: string;
	    extent: Extent;
	    sequenceExtents: Extent[];
	    /**
	     * @since 900
	     */
	    tangents: Float32Array;
	    /**
	     * An array of bone indices and weights.
	     * Every 8 consecutive elements describe the following:
	     *    [B0, B1, B2, B3, W0, W1, W2, W3]
	     * Where:
	     *     Bn is a bone index.
	     *     Wn is a weight, which can be normalized with Wn/255.
	     *
	     * @since 900
	     */
	    skin: Uint8Array;
	    uvSets: Float32Array[];
	    readMdx(stream: BinaryStream, version: number): void;
	    writeMdx(stream: BinaryStream, version: number): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/mdlx/geosetanimation' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import AnimatedObject from 'parsers/mdlx/animatedobject';
	/**
	 * A geoset animation.
	 */
	export default class GeosetAnimation extends AnimatedObject {
	    alpha: number;
	    flags: number;
	    color: Float32Array;
	    geosetId: number;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/genericobject' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import AnimatedObject from 'parsers/mdlx/animatedobject';
	/**
	 * A generic object.
	 *
	 * The parent class for all objects that exist in the world, and may contain spatial animations.
	 * This includes bones, particle emitters, and many other things.
	 */
	export default abstract class GenericObject extends AnimatedObject {
	    name: string;
	    objectId: number;
	    parentId: number;
	    flags: number;
	    constructor(flags?: number);
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    writeNonGenericAnimationChunks(stream: BinaryStream): void;
	    readGenericBlock(stream: TokenStream): Generator<string, void, unknown>;
	    writeGenericHeader(stream: TokenStream): void;
	    writeGenericAnimations(stream: TokenStream): void;
	    /**
	     * Allows to easily iterate either the GenericObject animations or the parent object animations.
	     */
	    eachAnimation(wantGeneric: boolean): Generator<import("./animations").Animation, void, unknown>;
	    /**
	     * Gets the byte length of the GenericObject part of whatever this object this.
	     *
	     * This is needed because only the KGTR, KGRT, and KGSC animations actually belong to it.
	     */
	    getGenericByteLength(): number;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/bone' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A bone.
	 */
	export default class Bone extends GenericObject {
	    geosetId: number;
	    geosetAnimationId: number;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/light' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A light.
	 */
	export default class Light extends GenericObject {
	    type: number;
	    attenuation: Float32Array;
	    color: Float32Array;
	    intensity: number;
	    ambientColor: Float32Array;
	    ambientIntensity: number;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/helper' {
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A helper.
	 */
	export default class Helper extends GenericObject {
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	}

}
declare module 'parsers/mdlx/attachment' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * An attachment.
	 */
	export default class Attachment extends GenericObject {
	    path: string;
	    attachmentId: number;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/particleemitter' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A particle emitter.
	 */
	export default class ParticleEmitter extends GenericObject {
	    emissionRate: number;
	    gravity: number;
	    longitude: number;
	    latitude: number;
	    path: string;
	    lifeSpan: number;
	    speed: number;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/particleemitter2' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A particle emitter type 2.
	 */
	export default class ParticleEmitter2 extends GenericObject {
	    speed: number;
	    variation: number;
	    latitude: number;
	    gravity: number;
	    lifeSpan: number;
	    emissionRate: number;
	    width: number;
	    length: number;
	    filterMode: number;
	    rows: number;
	    columns: number;
	    headOrTail: number;
	    tailLength: number;
	    timeMiddle: number;
	    segmentColors: Float32Array[];
	    segmentAlphas: Uint8Array;
	    segmentScaling: Float32Array;
	    headIntervals: Uint32Array[];
	    tailIntervals: Uint32Array[];
	    textureId: number;
	    squirt: number;
	    priorityPlane: number;
	    replaceableId: number;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/ribbonemitter' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A ribbon emitter.
	 */
	export default class RibbonEmitter extends GenericObject {
	    heightAbove: number;
	    heightBelow: number;
	    alpha: number;
	    color: Float32Array;
	    lifeSpan: number;
	    textureSlot: number;
	    emissionRate: number;
	    rows: number;
	    columns: number;
	    materialId: number;
	    gravity: number;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/camera' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import AnimatedObject from 'parsers/mdlx/animatedobject';
	/**
	 * A camera.
	 */
	export default class Camera extends AnimatedObject {
	    name: string;
	    position: Float32Array;
	    fieldOfView: number;
	    farClippingPlane: number;
	    nearClippingPlane: number;
	    targetPosition: Float32Array;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/eventobject' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * An event object.
	 */
	export default class EventObject extends GenericObject {
	    globalSequenceId: number;
	    tracks: Uint32Array;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/collisionshape' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A collision shape.
	 */
	export default class CollisionShape extends GenericObject {
	    type: number;
	    vertices: Float32Array[];
	    boundsRadius: number;
	    constructor();
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    readMdl(stream: TokenStream): void;
	    writeMdl(stream: TokenStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/corn' {
	import BinaryStream from 'common/binarystream';
	import GenericObject from 'parsers/mdlx/genericobject';
	/**
	 * A corn.
	 * Corns are particle emitters that reference pkfx files, which are used by the PopcornFX runtime.
	 *
	 * @since 900
	 */
	export default class Corn extends GenericObject {
	    lifeSpan: number;
	    emissionRate: number;
	    speed: number;
	    color: Float32Array;
	    replaceableId: number;
	    path: string;
	    options: string;
	    readMdx(stream: BinaryStream): void;
	    writeMdx(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/unknownchunk' {
	import BinaryStream from 'common/binarystream';
	/**
	 * An unknown chunk.
	 */
	export default class UnknownChunk {
	    tag: string;
	    chunk: Uint8Array;
	    constructor(stream: BinaryStream, size: number, tag: string);
	    writeMdx(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/mdlx/model' {
	import BinaryStream from 'common/binarystream';
	import TokenStream from 'parsers/mdlx/tokenstream';
	import Extent from 'parsers/mdlx/extent';
	import Sequence from 'parsers/mdlx/sequence';
	import Material from 'parsers/mdlx/material';
	import Texture from 'parsers/mdlx/texture';
	import TextureAnimation from 'parsers/mdlx/textureanimation';
	import Geoset from 'parsers/mdlx/geoset';
	import GeosetAnimation from 'parsers/mdlx/geosetanimation';
	import GenericObject from 'parsers/mdlx/genericobject';
	import Bone from 'parsers/mdlx/bone';
	import Light from 'parsers/mdlx/light';
	import Helper from 'parsers/mdlx/helper';
	import Attachment from 'parsers/mdlx/attachment';
	import ParticleEmitter from 'parsers/mdlx/particleemitter';
	import ParticleEmitter2 from 'parsers/mdlx/particleemitter2';
	import RibbonEmitter from 'parsers/mdlx/ribbonemitter';
	import Camera from 'parsers/mdlx/camera';
	import EventObject from 'parsers/mdlx/eventobject';
	import CollisionShape from 'parsers/mdlx/collisionshape';
	import Corn from 'parsers/mdlx/corn';
	import UnknownChunk from 'parsers/mdlx/unknownchunk';
	/**
	 * A Warcraft 3 model.
	 * Supports loading from and saving to both the binary MDX and text MDL file formats.
	 */
	export default class Model {
	    /**
	     * 800 for Warcraft 3: RoC and TFT.
	     * >800 for Warcraft 3: Reforged.
	     */
	    version: number;
	    name: string;
	    /**
	     * To the best of my knowledge, this should always be left empty.
	     */
	    animationFile: string;
	    extent: Extent;
	    /**
	     * This is only used by the now-defunct previewer that came with Art Tools.
	     */
	    blendTime: number;
	    sequences: Sequence[];
	    globalSequences: number[];
	    materials: Material[];
	    textures: Texture[];
	    textureAnimations: TextureAnimation[];
	    geosets: Geoset[];
	    geosetAnimations: GeosetAnimation[];
	    bones: Bone[];
	    lights: Light[];
	    helpers: Helper[];
	    attachments: Attachment[];
	    pivotPoints: Float32Array[];
	    particleEmitters: ParticleEmitter[];
	    particleEmitters2: ParticleEmitter2[];
	    ribbonEmitters: RibbonEmitter[];
	    cameras: Camera[];
	    eventObjects: EventObject[];
	    collisionShapes: CollisionShape[];
	    /**
	     * @since 900
	     */
	    bindPose: Float32Array[];
	    /**
	     * @since 900
	     */
	    corns: Corn[];
	    /**
	     * @since 900
	     */
	    faceEffectTarget: string;
	    /**
	     * A path to a face effect file, which is used by the FaceFX runtime
	     *
	     * @since 900
	     */
	    faceEffect: string;
	    /**
	     * The MDX format is chunk based, and Warcraft 3 does not mind there being unknown chunks in there.
	     * Some 3rd party tools use this to attach metadata to models.
	     * When an unknown chunk is encountered, it will be added here.
	     * These chunks will be saved when saving as MDX.
	     */
	    unknownChunks: UnknownChunk[];
	    constructor(buffer?: ArrayBuffer | string);
	    /**
	     * Load the model from MDX or MDL.
	     * The format is detected by the buffer type: ArrayBuffer for MDX, and string for MDL.
	     */
	    load(buffer: ArrayBuffer | string): void;
	    /**
	     * Load the model from MDX.
	     */
	    loadMdx(buffer: ArrayBuffer): void;
	    loadVersionChunk(stream: BinaryStream): void;
	    loadModelChunk(stream: BinaryStream): void;
	    loadStaticObjects(out: any[], constructor: typeof Sequence | typeof Texture, stream: BinaryStream, count: number): void;
	    loadGlobalSequenceChunk(stream: BinaryStream, size: number): void;
	    loadDynamicObjects(out: any[], constructor: typeof Material | typeof TextureAnimation | typeof Geoset | typeof GeosetAnimation | typeof Bone | typeof Light | typeof Helper | typeof Attachment | typeof ParticleEmitter | typeof ParticleEmitter2 | typeof RibbonEmitter | typeof Camera | typeof EventObject | typeof CollisionShape | typeof Corn, stream: BinaryStream, size: number): void;
	    loadPivotPointChunk(stream: BinaryStream, size: number): void;
	    loadBindPoseChunk(stream: BinaryStream, size: number): void;
	    loadFaceEffectChunk(stream: BinaryStream, size: number): void;
	    /**
	     * Save the model as MDX.
	     */
	    saveMdx(): ArrayBuffer;
	    /**
	     *
	     */
	    saveVersionChunk(stream: BinaryStream): void;
	    saveModelChunk(stream: BinaryStream): void;
	    saveStaticObjectChunk(stream: BinaryStream, name: string, objects: (Sequence | Texture)[], size: number): void;
	    saveGlobalSequenceChunk(stream: BinaryStream): void;
	    saveDynamicObjectChunk(stream: BinaryStream, name: string, objects: (Material | TextureAnimation | Geoset | GeosetAnimation | GenericObject | Camera)[]): void;
	    savePivotPointChunk(stream: BinaryStream): void;
	    saveBindPoseChunk(stream: BinaryStream): void;
	    saveFaceEffectChunk(stream: BinaryStream): void;
	    /**
	     * Load the model from MDL.
	     */
	    loadMdl(buffer: string): void;
	    loadVersionBlock(stream: TokenStream): void;
	    loadModelBlock(stream: TokenStream): void;
	    loadNumberedObjectBlock(out: any[], constructor: typeof Sequence | typeof Texture | typeof Material | typeof TextureAnimation, name: string, stream: TokenStream): void;
	    loadGlobalSequenceBlock(stream: TokenStream): void;
	    loadObject(out: any[], constructor: typeof Geoset | typeof GeosetAnimation | typeof Bone | typeof Light | typeof Helper | typeof Attachment | typeof ParticleEmitter | typeof ParticleEmitter2 | typeof RibbonEmitter | typeof Camera | typeof EventObject | typeof CollisionShape, stream: TokenStream): void;
	    loadPivotPointBlock(stream: TokenStream): void;
	    /**
	     * Save the model as MDL.
	     */
	    saveMdl(): string;
	    saveVersionBlock(stream: TokenStream): void;
	    saveModelBlock(stream: TokenStream): void;
	    saveStaticObjectsBlock(stream: TokenStream, name: string, objects: (Sequence | Texture | Material | TextureAnimation)[]): void;
	    saveGlobalSequenceBlock(stream: TokenStream): void;
	    saveObjects(stream: TokenStream, objects: (Geoset | GeosetAnimation | Bone | Light | Helper | Attachment | ParticleEmitter | ParticleEmitter2 | RibbonEmitter | Camera | EventObject | CollisionShape)[]): void;
	    savePivotPointBlock(stream: TokenStream): void;
	    /**
	     * Calculate the size of the model as MDX.
	     */
	    getByteLength(): number;
	    getObjectsByteLength(objects: (Material | TextureAnimation | Geoset | GeosetAnimation | GenericObject | Camera | UnknownChunk)[]): number;
	    getDynamicObjectsChunkByteLength(objects: (Material | TextureAnimation | Geoset | GeosetAnimation | GenericObject | Camera | UnknownChunk)[]): number;
	    getStaticObjectsChunkByteLength(objects: (Sequence | number | Texture | Float32Array)[], size: number): number;
	    getBindPoseChunkByteLength(): number;
	    getFaceEffectChunkByteLength(): 0 | 348;
	}

}
declare module 'parsers/mdlx/index' {
	import Model from 'parsers/mdlx/model'; const _default: {
	    Model: typeof Model;
	};
	export default _default;

}
declare module 'parsers/mpq/block' {
	/**
	 * A block.
	 */
	export default class Block {
	    offset: number;
	    compressedSize: number;
	    normalSize: number;
	    flags: number;
	    load(typedArray: Uint32Array): void;
	    save(typedArray: Uint32Array): void;
	}

}
declare module 'parsers/mpq/constants' {
	export const MAGIC = 441536589;
	export const HASH_TABLE_KEY = 3283040112;
	export const HASH_TABLE_INDEX = 0;
	export const HASH_NAME_A = 1;
	export const HASH_NAME_B = 2;
	export const HASH_FILE_KEY = 3;
	export const HASH_ENTRY_DELETED = 4294967294;
	export const HASH_ENTRY_EMPTY = 4294967295;
	export const BLOCK_TABLE_KEY = 3968054179;
	export const FILE_IMPLODE = 256;
	export const FILE_COMPRESSED = 512;
	export const FILE_ENCRYPTED = 65536;
	export const FILE_OFFSET_ADJUSTED_KEY = 131072;
	export const FILE_PATCH_FILE = 1048576;
	export const FILE_SINGLE_UNIT = 16777216;
	export const FILE_DELETE_MARKER = 33554432;
	export const FILE_SECTOR_CRC = 67108864;
	export const FILE_EXISTS = 2147483648;
	export const COMPRESSION_HUFFMAN = 1;
	export const COMPRESSION_DEFLATE = 2;
	export const COMPRESSION_IMPLODE = 8;
	export const COMPRESSION_BZIP2 = 16;
	export const COMPRESSION_ADPCM_MONO = 64;
	export const COMPRESSION_ADPCM_STEREO = 128;

}
declare module 'parsers/mpq/crypto' {
	/// <reference types="./src/types" />
	import MpqBlock from 'parsers/mpq/block';
	/**
	 * MPQ crypto.
	 */
	export default class MpqCrypto {
	    cryptTable: Uint32Array;
	    constructor();
	    hash(name: string, key: number): number;
	    decryptBlock(data: TypedArray, key: number): TypedArray;
	    encryptBlock(data: ArrayBuffer | TypedArray, key: number): Float32Array | Uint8Array | Uint16Array | Uint32Array | ArrayBuffer | Int8Array | Int16Array | Int32Array | Float64Array | Uint8ClampedArray;
	    computeFileKey(name: string, block: MpqBlock): number;
	}

}
declare module 'parsers/mpq/blocktable' {
	import MpqCrypto from 'parsers/mpq/crypto';
	import MpqBlock from 'parsers/mpq/block';
	/**
	 * A block table.
	 */
	export default class BlockTable {
	    c: MpqCrypto;
	    entries: MpqBlock[];
	    constructor(c: MpqCrypto);
	    add(buffer: ArrayBuffer): MpqBlock;
	    clear(): void;
	    addEmpties(howMany: number): void;
	    load(typedArray: Uint8Array): void;
	    save(typedArray: Uint8Array): void;
	}

}
declare module 'parsers/mpq/hash' {
	/**
	 * A MPQ hash.
	 */
	export default class MpqHash {
	    nameA: number;
	    nameB: number;
	    locale: number;
	    platform: number;
	    blockIndex: number;
	    load(typedArray: Uint32Array): void;
	    copy(hash: MpqHash): void;
	    save(typedArray: Uint32Array): void;
	    delete(): void;
	}

}
declare module 'parsers/mpq/isarchive' {
	/**
	 * Search for the MPQ header - MPQ\x1A.
	 * The header can be on any 512 bytes boundry offset.
	 */
	export function searchHeader(typedArray: Uint8Array): number;
	/**
	 * Checks whether the given buffer is either a Warcraft 3 map or otherwise a generic MPQ archive.
	 */
	export function isArchive(typedArray: Uint8Array): boolean;

}
declare module 'parsers/mpq/file' {
	import MpqArchive from 'parsers/mpq/archive';
	import MpqBlock from 'parsers/mpq/block';
	import MpqCrypto from 'parsers/mpq/crypto';
	import MpqHash from 'parsers/mpq/hash';
	/**
	 * A MPQ file.
	 */
	export default class MpqFile {
	    archive: MpqArchive;
	    c: MpqCrypto;
	    name: string;
	    nameResolved: boolean;
	    hash: MpqHash;
	    block: MpqBlock;
	    rawBuffer: ArrayBuffer | null;
	    buffer: ArrayBuffer | null;
	    constructor(archive: MpqArchive, hash: MpqHash, block: MpqBlock, rawBuffer: ArrayBuffer | null, buffer: ArrayBuffer | null);
	    /**
	     * Gets this file's data as an ArrayBuffer.
	     *
	     * Decodes the file if needed.
	     *
	     * If the file could not be decoded, null is returned.
	     */
	    arrayBuffer(): ArrayBuffer | null;
	    /**
	     * Gets this file's data as a string.
	     *
	     * Decodes the file if needed.
	     *
	     * If the file could not be decoded, null is returned.
	     */
	    text(): string | null;
	    save(typedArray: Uint8Array): void;
	    /**
	     * Changes the buffer of this file.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    set(buffer: ArrayBuffer): boolean;
	    /**
	     * Deletes this file.
	     *
	     * Using the file after it was deleted will result in undefined behavior.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    delete(): boolean;
	    /**
	     * Renames this file.
	     *
	     * Note that this sets the current file's hash's status to being deleted, rather than removing it.
	     * This is due to the way the search algorithm works.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    rename(newName: string): boolean;
	    /**
	     * Decode this file.
	     */
	    decode(): boolean | undefined;
	    decompressSector(typedArray: Uint8Array, decompressedSize: number): Uint8Array | null;
	    /**
	     * Encode this file.
	     * Archives (maps or generic MPQs) are stored uncompressed in one chunk.
	     * Other files are always stored in sectors, except when a file is smaller than a sector.
	     * Sectors themselves are always compressed, except when the result is smaller than the uncompressed data.
	     * This can only happen in the last sector when there are multiple sectors.
	     */
	    encode(): void;
	    /**
	     * Decrypt this file and encrypt it back, with a new offset in the archive.
	     * This is used for files that use FILE_OFFSET_ADJUSTED_KEY, which are encrypted with a key that depends on their offset.
	     */
	    reEncrypt(offset: number): boolean;
	    /**
	     * The offset of the file has been recalculated.
	     * If the offset is different, and this file uses FILE_OFFSET_ADJUSTED_KEY encryption, it must be re-encrypted with the new offset.
	     */
	    offsetChanged(offset: number): boolean;
	}

}
declare module 'parsers/mpq/hashtable' {
	import MpqCrypto from 'parsers/mpq/crypto';
	import MpqHash from 'parsers/mpq/hash';
	/**
	 * A MPQ hash table.
	 */
	export default class MpqHashTable {
	    c: MpqCrypto;
	    entries: MpqHash[];
	    constructor(c: MpqCrypto);
	    clear(): void;
	    addEmpties(howMany: number): void;
	    getInsertionIndex(name: string): number;
	    add(name: string, blockIndex: number): MpqHash | undefined;
	    load(typedArray: Uint8Array): void;
	    save(typedArray: Uint8Array): void;
	    get(name: string): MpqHash | null;
	}

}
declare module 'parsers/mpq/archive' {
	import MpqBlockTable from 'parsers/mpq/blocktable';
	import MpqCrypto from 'parsers/mpq/crypto';
	import MpqFile from 'parsers/mpq/file';
	import MpqHashTable from 'parsers/mpq/hashtable';
	/**
	 * MoPaQ archive (MPQ) version 0.
	 */
	export default class MpqArchive {
	    headerOffset: number;
	    sectorSize: number;
	    c: MpqCrypto;
	    hashTable: MpqHashTable;
	    blockTable: MpqBlockTable;
	    files: MpqFile[];
	    readonly: boolean;
	    constructor(buffer?: ArrayBuffer, readonly?: boolean);
	    /**
	     * Load an existing archive.
	     *
	     * Note that this clears the archive from whatever it had in it before.
	     */
	    load(buffer: ArrayBuffer): boolean;
	    /**
	     * Save this archive.
	     *
	     * Returns null when...
	     *
	     *     1) The archive is in readonly mode.
	     *     2) The offset of a file encrypted with FILE_OFFSET_ADJUSTED_KEY changed, and the file name is unknown.
	     */
	    save(): ArrayBuffer | null;
	    /**
	     * Some MPQs have empty memory chunks in them, left over from files that were deleted.
	     * This function searches for such chunks, and removes them.
	     *
	     * Note that it is called automatically by save().
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    saveMemory(): number;
	    removeBlock(blockIndex: number): void;
	    /**
	     * Gets a list of the file names in the archive.
	     *
	     * Note that files loaded from an existing archive, without resolved names, will be named FileXXXXXXXX.
	     */
	    getFileNames(): string[];
	    /**
	     * Sets the list file with all of the resolved file names.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    setListFile(): boolean;
	    /**
	     * Adds a file to this archive.
	     * If the file already exists, its buffer will be set.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    set(name: string, buffer: ArrayBuffer | string): boolean;
	    /**
	     * Gets a file from this archive.
	     * If the file doesn't exist, null is returned.
	     */
	    get(name: string): MpqFile | null;
	    /**
	     * Checks if a file exists.
	     *
	     * Prefer to use get() if you are going to use get() afterwards anyway.
	     */
	    has(name: string): boolean;
	    /**
	     * Deletes a file from this archive.
	     *
	     * Does nothing if...
	     *
	     *     1) The archive is in readonly mode.
	     *     2) The file does not exist.
	     */
	    delete(name: string): boolean;
	    /**
	     * Renames a file.
	     *
	     * Does nothing if...
	     *
	     *     1) The archive is in readonly mode.
	     *     2) The file does not exist.
	     *
	     * Note that this sets the current file's hash's status to being deleted, rather than removing it.
	     * This is due to the way the search algorithm works.
	     */
	    rename(name: string, newName: string): boolean;
	    /**
	     * Resizes the hashtable to the nearest power of two equal to or bigger than the given size.
	     *
	     * Generally speaking, the bigger the hashtable is, the quicker insertions/searches are, at the cost of added memory.
	     *
	     * Does nothing if...
	     *
	     *     1) The archive is in readonly mode.
	     *     2) The calculated size is smaller than the amount of files in the archive.
	     *     3) Not all of the file names in the archive are resolved.
	     */
	    resizeHashtable(size: number): boolean;
	}

}
declare module 'parsers/mpq/index' {
	import Archive from 'parsers/mpq/archive'; const _default: {
	    Archive: typeof Archive;
	};
	export default _default;

}
declare module 'parsers/w3x/doo/randomitem' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A random item.
	 */
	export default class RandomItem {
	    id: string;
	    chance: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/doo/randomitemset' {
	import RandomItem from 'parsers/w3x/doo/randomitem';
	import BinaryStream from 'common/binarystream';
	/**
	 * A random item set.
	 */
	export default class RandomItemSet {
	    items: RandomItem[];
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/doo/doodad' {
	import BinaryStream from 'common/binarystream';
	import RandomItemSet from 'parsers/w3x/doo/randomitemset';
	/**
	 * A doodad.
	 */
	export default class Doodad {
	    id: string;
	    variation: number;
	    location: Float32Array;
	    angle: number;
	    scale: Float32Array;
	    flags: number;
	    life: number;
	    itemTable: number;
	    itemSets: RandomItemSet[];
	    editorId: number;
	    u1: Uint8Array;
	    load(stream: BinaryStream, version: number): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/doo/terraindoodad' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A terrain doodad.
	 *
	 * This type of doodad works much like cliffs.
	 * It uses the height of the terrain, and gets affected by the ground heightmap.
	 * It cannot be manipulated in any way in the World Editor once placed.
	 * Indeed, the only way to change it is to remove it by changing cliffs around it.
	 */
	export default class TerrainDoodad {
	    id: string;
	    u1: number;
	    location: Uint32Array;
	    load(stream: BinaryStream, version: number): void;
	    save(stream: BinaryStream, version: number): void;
	}

}
declare module 'parsers/w3x/doo/file' {
	import Doodad from 'parsers/w3x/doo/doodad';
	import TerrainDoodad from 'parsers/w3x/doo/terraindoodad';
	/**
	 * war3map.doo - the doodad and destructible file.
	 */
	export default class War3MapDoo {
	    version: number;
	    u1: Uint8Array;
	    doodads: Doodad[];
	    u2: Uint8Array;
	    terrainDoodads: TerrainDoodad[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): boolean;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/imp/import' {
	import BinaryStream from 'common/binarystream';
	/**
	 * An import.
	 */
	export default class Import {
	    isCustom: number;
	    path: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/imp/file' {
	import Import from 'parsers/w3x/imp/import';
	/**
	 * war3map.imp - the import file.
	 */
	export default class War3MapImp {
	    version: number;
	    entries: Map<string, Import>;
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	    set(path: string): boolean;
	    has(path: string): boolean;
	    delete(path: string): boolean;
	    rename(path: string, newPath: string): boolean;
	}

}
declare module 'parsers/w3x/w3u/modification' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A modification.
	 */
	export default class Modification {
	    id: string;
	    variableType: number;
	    levelOrVariation: number;
	    dataPointer: number;
	    value: number | string;
	    u1: number;
	    load(stream: BinaryStream, useOptionalInts: boolean): void;
	    save(stream: BinaryStream, useOptionalInts: boolean): void;
	    getByteLength(useOptionalInts: boolean): number;
	}

}
declare module 'parsers/w3x/w3u/modifiedobject' {
	import BinaryStream from 'common/binarystream';
	import Modification from 'parsers/w3x/w3u/modification';
	/**
	 * A modified object.
	 */
	export default class ModifiedObject {
	    oldId: string;
	    newId: string;
	    modifications: Modification[];
	    load(stream: BinaryStream, useOptionalInts: boolean): void;
	    save(stream: BinaryStream, useOptionalInts: boolean): void;
	    getByteLength(useOptionalInts: boolean): number;
	}

}
declare module 'parsers/w3x/w3u/modificationtable' {
	import BinaryStream from 'common/binarystream';
	import ModifiedObject from 'parsers/w3x/w3u/modifiedobject';
	/**
	 * A modification table.
	 */
	export default class ModificationTable {
	    objects: ModifiedObject[];
	    load(stream: BinaryStream, useOptionalInts: boolean): void;
	    save(stream: BinaryStream, useOptionalInts: boolean): void;
	    getByteLength(useOptionalInts: boolean): number;
	}

}
declare module 'parsers/w3x/w3d/file' {
	import BinaryStream from 'common/binarystream';
	import ModificationTable from 'parsers/w3x/w3u/modificationtable';
	/**
	 * war3map.w3d - the doodad modification file.
	 *
	 * Also used for war3map.w3a (abilities), and war3map.w3q (upgrades).
	 */
	export default class War3MapW3d {
	    version: number;
	    originalTable: ModificationTable;
	    customTable: ModificationTable;
	    constructor(bufferOrStream?: ArrayBuffer | BinaryStream);
	    load(bufferOrStream: ArrayBuffer | BinaryStream): void;
	    save(stream?: BinaryStream): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3e/corner' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A tile corner.
	 */
	export default class Corner {
	    groundHeight: number;
	    waterHeight: number;
	    mapEdge: number;
	    ramp: number;
	    blight: number;
	    water: number;
	    boundary: number;
	    groundTexture: number;
	    cliffVariation: number;
	    groundVariation: number;
	    cliffTexture: number;
	    layerHeight: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/w3e/file' {
	import Corner from 'parsers/w3x/w3e/corner';
	/**
	 * war3map.w3e - the environment file.
	 */
	export default class War3MapW3e {
	    version: number;
	    tileset: string;
	    haveCustomTileset: number;
	    groundTilesets: string[];
	    cliffTilesets: string[];
	    mapSize: Int32Array;
	    centerOffset: Float32Array;
	    corners: Corner[][];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): boolean;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3i/force' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A force.
	 */
	export default class Force {
	    flags: number;
	    playerMasks: number;
	    name: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3i/player' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A player.
	 */
	export default class Player {
	    id: number;
	    type: number;
	    race: number;
	    isFixedStartPosition: number;
	    name: string;
	    startLocation: Float32Array;
	    allyLowPriorities: number;
	    allyHighPriorities: number;
	    unknown1: Uint8Array;
	    load(stream: BinaryStream, version: number): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/w3i/randomitem' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A random item.
	 */
	export default class RandomItem {
	    chance: number;
	    id: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/w3i/randomitemset' {
	import BinaryStream from 'common/binarystream';
	import RandomItem from 'parsers/w3x/w3i/randomitem';
	/**
	 * A random item set.
	 */
	export default class RandomItemSet {
	    items: RandomItem[];
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3i/randomitemtable' {
	import BinaryStream from 'common/binarystream';
	import RandomItemSet from 'parsers/w3x/w3i/randomitemset';
	/**
	 * A random item table.
	 */
	export default class RandomItemTable {
	    id: number;
	    name: string;
	    sets: RandomItemSet[];
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3i/randomunit' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A random unit.
	 */
	export default class RandomUnit {
	    chance: number;
	    ids: string[];
	    load(stream: BinaryStream, positions: number): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/w3i/randomunittable' {
	import BinaryStream from 'common/binarystream';
	import RandomUnit from 'parsers/w3x/w3i/randomunit';
	/**
	 * A random unit table.
	 */
	export default class RandomUnitTable {
	    id: number;
	    name: string;
	    positions: number;
	    columnTypes: Int32Array;
	    units: RandomUnit[];
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3i/techavailabilitychange' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A tech availablity change.
	 */
	export default class TechAvailabilityChange {
	    playerFlags: number;
	    id: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/w3i/upgradeavailabilitychange' {
	import BinaryStream from 'common/binarystream';
	/**
	 * An upgrade availability change.
	 */
	export default class UpgradeAvailabilityChange {
	    playerFlags: number;
	    id: string;
	    levelAffected: number;
	    availability: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/w3i/file' {
	import Force from 'parsers/w3x/w3i/force';
	import Player from 'parsers/w3x/w3i/player';
	import RandomItemTable from 'parsers/w3x/w3i/randomitemtable';
	import RandomUnitTable from 'parsers/w3x/w3i/randomunittable';
	import TechAvailabilityChange from 'parsers/w3x/w3i/techavailabilitychange';
	import UpgradeAvailabilityChange from 'parsers/w3x/w3i/upgradeavailabilitychange';
	/**
	 * war3map.w3i - the general information file.
	 */
	export default class War3MapW3i {
	    version: number;
	    saves: number;
	    editorVersion: number;
	    buildVersion: Uint32Array;
	    name: string;
	    author: string;
	    description: string;
	    recommendedPlayers: string;
	    cameraBounds: Float32Array;
	    cameraBoundsComplements: Int32Array;
	    playableSize: Int32Array;
	    flags: number;
	    tileset: string;
	    campaignBackground: number;
	    loadingScreenModel: string;
	    loadingScreenText: string;
	    loadingScreenTitle: string;
	    loadingScreenSubtitle: string;
	    loadingScreen: number;
	    prologueScreenModel: string;
	    prologueScreenText: string;
	    prologueScreenTitle: string;
	    prologueScreenSubtitle: string;
	    useTerrainFog: number;
	    fogHeight: Float32Array;
	    fogDensity: number;
	    fogColor: Uint8Array;
	    globalWeather: number;
	    soundEnvironment: string;
	    lightEnvironmentTileset: string;
	    waterVertexColor: Uint8Array;
	    scriptMode: number;
	    graphicsMode: number;
	    players: Player[];
	    forces: Force[];
	    upgradeAvailabilityChanges: UpgradeAvailabilityChange[];
	    techAvailabilityChanges: TechAvailabilityChange[];
	    randomUnitTables: RandomUnitTable[];
	    randomItemTables: RandomItemTable[];
	    unknown1: number;
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3u/file' {
	import BinaryStream from 'common/binarystream';
	import ModificationTable from 'parsers/w3x/w3u/modificationtable';
	/**
	 * war3map.w3u - the unit modification file.
	 *
	 * Also used for war3map.w3t (items), war3map.w3b (destructibles), and war3map.w3h (buffs).
	 */
	export default class War3MapW3u {
	    version: number;
	    originalTable: ModificationTable;
	    customTable: ModificationTable;
	    constructor(bufferOrStream?: ArrayBuffer | BinaryStream);
	    load(bufferOrStream: ArrayBuffer | BinaryStream): void;
	    save(stream?: BinaryStream): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/wct/customtexttrigger' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A custom text trigger.
	 */
	export default class CustomTextTrigger {
	    text: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/wct/file' {
	import CustomTextTrigger from 'parsers/w3x/wct/customtexttrigger';
	/**
	 * war3map.wct - the custom text (jass) trigger file.
	 */
	export default class War3MapWct {
	    version: number;
	    comment: string;
	    trigger: CustomTextTrigger;
	    triggers: CustomTextTrigger[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/wtg/triggercategory' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A Trigger category.
	 *
	 * Used to scope triggers together in a Folder-like hierarchy.
	 */
	export default class TriggerCategory {
	    id: number;
	    name: string;
	    isComment: number;
	    load(stream: BinaryStream, version: number): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/wtg/variable' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A global variable.
	 */
	export default class Variable {
	    name: string;
	    type: string;
	    u1: number;
	    isArray: number;
	    arraySize: number;
	    isInitialized: number;
	    initialValue: string;
	    load(stream: BinaryStream, version: number): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/wtg/triggerdata' {
	 type FunctionObject = {
	    [key: string]: {
	        args: string[];
	        scriptName: string | null;
	    };
	};
	/**
	 * Trigger data needed to load a WTG file.
	 */
	export default class TriggerData {
	    types: StringObject;
	    functions: FunctionObject[];
	    presets: StringObject;
	    externalTypes: StringObject;
	    externalFunctions: FunctionObject[];
	    externalPresets: StringObject;
	    addTriggerData(buffer: string, isExternal: boolean): void;
	    addTriggerTypes(types: StringObject, section: Map<string, string>): void;
	    addTriggerDataFunctions(functions: FunctionObject, section: Map<string, string>, skipped: number): void;
	    addTriggerDataPresets(presets: StringObject, section: Map<string, string>): void;
	    /**
	     * Given a type, return its base type.
	     *
	     * Returns the given type if its not a child type.
	     */
	    getBaseType(type: string): string;
	    isBaseFunction(type: number, name: string): boolean;
	    /**
	     * Gets the signature of the given function.
	     */
	    getFunction(type: number, name: string): {
	        args: string[];
	        scriptName: string | null;
	    };
	    /**
	     * Gets a preset value.
	     */
	    getPreset(name: string): string;
	    /**
	     * Is the given preset a custom or standard one?
	     */
	    isCustomPreset(name: string): boolean;
	}
	export {};

}
declare module 'parsers/w3x/wtg/subparameters' {
	import BinaryStream from 'common/binarystream';
	import Parameter from 'parsers/w3x/wtg/parameter';
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	/**
	 * A function call in an expression.
	 */
	export default class SubParameters {
	    type: number;
	    name: string;
	    beginParameters: number;
	    parameters: Parameter[];
	    load(stream: BinaryStream, version: number, triggerData: TriggerData): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/wtg/parameter' {
	import BinaryStream from 'common/binarystream';
	import SubParameters from 'parsers/w3x/wtg/subparameters';
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	/**
	 * A function parameter. Can be a function itself, in which case it will have a SubParameters structure.
	 */
	export default class Parameter {
	    type: number;
	    value: string;
	    subParameters: SubParameters | null;
	    u1: number;
	    isArray: number;
	    arrayIndex: Parameter | null;
	    load(stream: BinaryStream, version: number, triggerData: TriggerData): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/wtg/eca' {
	import BinaryStream from 'common/binarystream';
	import Parameter from 'parsers/w3x/wtg/parameter';
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	/**
	 * An Event/Condition/Action.
	 */
	export default class ECA {
	    type: number;
	    group: number;
	    name: string;
	    isEnabled: number;
	    parameters: Parameter[];
	    ecas: ECA[];
	    load(stream: BinaryStream, version: number, isChildECA: boolean, triggerData: TriggerData): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/wtg/trigger' {
	import BinaryStream from 'common/binarystream';
	import ECA from 'parsers/w3x/wtg/eca';
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	/**
	 * A GUI Trigger.
	 */
	export default class Trigger {
	    name: string;
	    description: string;
	    isComment: number;
	    isEnabled: number;
	    isCustom: number;
	    isInitiallyOff: number;
	    runOnInitialization: number;
	    category: number;
	    ecas: ECA[];
	    load(stream: BinaryStream, version: number, triggerData: TriggerData): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/wtg/file' {
	import TriggerCategory from 'parsers/w3x/wtg/triggercategory';
	import Variable from 'parsers/w3x/wtg/variable';
	import Trigger from 'parsers/w3x/wtg/trigger';
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	/**
	 * war3map.wtg - the trigger file.
	 */
	export default class War3MapWtg {
	    version: number;
	    categories: TriggerCategory[];
	    u1: number;
	    variables: Variable[];
	    triggers: Trigger[];
	    constructor(buffer?: ArrayBuffer, triggerData?: TriggerData);
	    load(buffer: ArrayBuffer, triggerData: TriggerData): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/wts/file' {
	/**
	 * war3map.wts - the string table file.
	 *
	 * Contains a map of number->string.
	 * When other map data like triggers use the string TRIGSTR_XXX, where XXX is a number, the value will be fetched from the table.
	 */
	export default class War3MapWts {
	    stringMap: Map<number, string>;
	    constructor(buffer?: string);
	    load(buffer: string): void;
	    save(): string;
	}

}
declare module 'parsers/w3x/unitsdoo/droppeditem' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A dropped item.
	 */
	export default class DroppedItem {
	    id: string;
	    chance: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/unitsdoo/droppeditemset' {
	import BinaryStream from 'common/binarystream';
	import DroppedItem from 'parsers/w3x/unitsdoo/droppeditem';
	/**
	 * A dropped item set.
	 */
	export default class DroppedItemSet {
	    items: DroppedItem[];
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/unitsdoo/inventoryitem' {
	import BinaryStream from 'common/binarystream';
	/**
	 * An inventory item.
	 */
	export default class InventoryItem {
	    slot: number;
	    id: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/unitsdoo/modifiedability' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A modified ability.
	 */
	export default class ModifiedAbility {
	    id: string;
	    activeForAutocast: number;
	    heroLevel: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/unitsdoo/randomunit' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A random unit.
	 */
	export default class RandomUnit {
	    id: string;
	    chance: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/unitsdoo/unit' {
	import BinaryStream from 'common/binarystream';
	import DroppedItemSet from 'parsers/w3x/unitsdoo/droppeditemset';
	import InventoryItem from 'parsers/w3x/unitsdoo/inventoryitem';
	import ModifiedAbility from 'parsers/w3x/unitsdoo/modifiedability';
	import RandomUnit from 'parsers/w3x/unitsdoo/randomunit';
	/**
	 * A unit.
	 */
	export default class Unit {
	    id: string;
	    variation: number;
	    location: Float32Array;
	    angle: number;
	    scale: Float32Array;
	    flags: number;
	    player: number;
	    unknown: number;
	    hitpoints: number;
	    mana: number;
	    /**
	     * @since 8
	     */
	    droppedItemTable: number;
	    droppedItemSets: DroppedItemSet[];
	    goldAmount: number;
	    targetAcquisition: number;
	    heroLevel: number;
	    /**
	     * @since 8
	     */
	    heroStrength: number;
	    /**
	     * @since 8
	     */
	    heroAgility: number;
	    /**
	     * @since 8
	     */
	    heroIntelligence: number;
	    itemsInInventory: InventoryItem[];
	    modifiedAbilities: ModifiedAbility[];
	    randomFlag: number;
	    level: Uint8Array;
	    itemClass: number;
	    unitGroup: number;
	    positionInGroup: number;
	    randomUnitTables: RandomUnit[];
	    customTeamColor: number;
	    waygate: number;
	    creationNumber: number;
	    load(stream: BinaryStream, version: number): void;
	    save(stream: BinaryStream, version: number): void;
	    getByteLength(version: number): number;
	}

}
declare module 'parsers/w3x/unitsdoo/file' {
	import Unit from 'parsers/w3x/unitsdoo/unit';
	/**
	 * war3mapUnits.doo - the units and items file.
	 */
	export default class War3MapUnitsDoo {
	    version: number;
	    unknown: number;
	    units: Unit[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): boolean;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/map' {
	import MpqArchive from 'parsers/mpq/archive';
	import War3MapDoo from 'parsers/w3x/doo/file';
	import War3MapImp from 'parsers/w3x/imp/file';
	import War3MapW3d from 'parsers/w3x/w3d/file';
	import War3MapW3e from 'parsers/w3x/w3e/file';
	import War3MapW3i from 'parsers/w3x/w3i/file';
	import War3MapW3u from 'parsers/w3x/w3u/file';
	import War3MapWct from 'parsers/w3x/wct/file';
	import War3MapWtg from 'parsers/w3x/wtg/file';
	import War3MapWts from 'parsers/w3x/wts/file';
	import War3MapUnitsDoo from 'parsers/w3x/unitsdoo/file';
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	interface War3MapModifications {
	    w3a?: War3MapW3d;
	    w3b?: War3MapW3u;
	    w3d?: War3MapW3d;
	    w3h?: War3MapW3u;
	    w3q?: War3MapW3d;
	    w3t?: War3MapW3u;
	    w3u?: War3MapW3u;
	}
	/**
	 * Warcraft 3 map (W3X and W3M).
	 */
	export default class War3Map {
	    unknown: number;
	    name: string;
	    flags: number;
	    maxPlayers: number;
	    archive: MpqArchive;
	    imports: War3MapImp;
	    readonly: boolean;
	    u1: number;
	    /**
	     * If buffer is given, it will be loaded instantly.
	     *
	     * If readonly is true, the map and internal archive won't be editable or saveable, which allows to optimize some operations.
	     */
	    constructor(buffer?: ArrayBuffer | undefined, readonly?: boolean);
	    /**
	     * Load an existing map.
	     *
	     * Note that this clears the map from whatever it had in it before.
	     */
	    load(buffer: ArrayBuffer): boolean;
	    /**
	     * Save this map.
	     * If the archive is in readonly mode, returns null.
	     */
	    save(): ArrayBuffer | null;
	    /**
	     * A shortcut to the internal archive function.
	     */
	    getFileNames(): string[];
	    /**
	     * Gets a list of the file names imported in this map.
	     */
	    getImportNames(): string[];
	    /**
	     * Sets the imports file with all of the imports.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    setImportsFile(): boolean;
	    /**
	     * Imports a file to this archive.
	     *
	     * If the file already exists, its buffer will be set.
	     *
	     * Files added to the archive but not to the imports list will be deleted by the World Editor automatically.
	     * This of course doesn't apply to internal map files.
	     *
	     * Does nothing if the archive is in readonly mode.
	     */
	    import(name: string, buffer: ArrayBuffer | string): boolean;
	    /**
	     * A shortcut to the internal archive function.
	     */
	    set(name: string, buffer: ArrayBuffer | string): boolean;
	    /**
	     * A shortcut to the internal archive function.
	     */
	    get(name: string): import("../mpq/file").default | null;
	    /**
	     * Get the map's script.
	     */
	    getScriptFile(): import("../mpq/file").default | null;
	    /**
	     * A shortcut to the internal archive function.
	     */
	    has(name: string): boolean;
	    /**
	     * Deletes a file from the internal archive.
	     *
	     * Note that if the file is in the imports list, it will be removed from it too.
	     *
	     * Use this rather than the internal archive's delete.
	     */
	    delete(name: string): boolean;
	    /**
	     * A shortcut to the internal archive function.
	     */
	    rename(name: string, newName: string): boolean;
	    /**
	     * Read the imports file.
	     */
	    readImports(): void;
	    /**
	     * Read the map information file.
	     */
	    readMapInformation(): War3MapW3i | undefined;
	    /**
	     * Read the environment file.
	     */
	    readEnvironment(): War3MapW3e | undefined;
	    /**
	     * Read and parse the doodads file.
	     */
	    readDoodads(): War3MapDoo | undefined;
	    /**
	     * Read and parse the units file.
	     */
	    readUnits(): War3MapUnitsDoo | undefined;
	    /**
	     * Read and parse the trigger file.
	     */
	    readTriggers(triggerData: TriggerData): War3MapWtg | undefined;
	    /**
	     * Read and parse the custom text trigger file.
	     */
	    readCustomTextTriggers(): War3MapWct | undefined;
	    /**
	     * Read and parse the string table file.
	     */
	    readStringTable(): War3MapWts | undefined;
	    /**
	     * Read and parse all of the modification tables.
	     */
	    readModifications(): War3MapModifications;
	}
	export {};

}
declare module 'parsers/w3x/doo/index' {
	import File from 'parsers/w3x/doo/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/imp/index' {
	import File from 'parsers/w3x/imp/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/mmp/minimapicon' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A minimap icon.
	 */
	export default class MinimapIcon {
	    type: number;
	    location: Int32Array;
	    /**
	     * Stored as BGRA.
	     */
	    color: Uint8Array;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	}

}
declare module 'parsers/w3x/mmp/file' {
	import MinimapIcon from 'parsers/w3x/mmp/minimapicon';
	/**
	 * war3map.mmp - the minimap icon file.
	 */
	export default class War3MapMmp {
	    u1: number;
	    icons: MinimapIcon[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/mmp/index' {
	import File from 'parsers/w3x/mmp/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/shd/file' {
	/**
	 * war3map.shd - the shadow file.
	 */
	export default class War3MapShd {
	    shadows: Uint8Array;
	    constructor(buffer?: ArrayBuffer, width?: number, height?: number);
	    load(buffer: ArrayBuffer, width: number, height: number): void;
	    save(): ArrayBuffer | SharedArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/shd/index' {
	import File from 'parsers/w3x/shd/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3c/camera' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A camera.
	 */
	export default class Camera {
	    targetLocation: Float32Array;
	    rotation: number;
	    angleOfAttack: number;
	    distance: number;
	    roll: number;
	    fieldOfView: number;
	    farClippingPlane: number;
	    nearClippingPlane: number;
	    cinematicName: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3c/file' {
	import Camera from 'parsers/w3x/w3c/camera';
	/**
	 * war3map.w3c - the camera file.
	 */
	export default class War3MapW3c {
	    version: number;
	    cameras: Camera[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3c/index' {
	import File from 'parsers/w3x/w3c/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3d/index' {
	import File from 'parsers/w3x/w3d/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3e/index' {
	import File from 'parsers/w3x/w3e/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3i/index' {
	import File from 'parsers/w3x/w3i/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3o/file' {
	import War3MapW3u from 'parsers/w3x/w3u/file';
	import War3MapW3d from 'parsers/w3x/w3d/file';
	/**
	 * war3map.w3o - the combined modification file.
	 *
	 * Contains all of the modifications of a map.
	 * Can be exported and imported via the World Editor.
	 */
	export default class War3MapW3o {
	    version: number;
	    units: War3MapW3u | null;
	    items: War3MapW3u | null;
	    destructables: War3MapW3u | null;
	    doodads: War3MapW3d | null;
	    abilities: War3MapW3d | null;
	    buffs: War3MapW3u | null;
	    upgrades: War3MapW3d | null;
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3o/index' {
	import File from 'parsers/w3x/w3o/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3r/region' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A region.
	 */
	export default class Region {
	    left: number;
	    right: number;
	    bottom: number;
	    top: number;
	    name: string;
	    creationNumber: number;
	    weatherEffectId: string;
	    ambientSound: string;
	    color: Uint8Array;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3r/file' {
	import Region from 'parsers/w3x/w3r/region';
	/**
	 * war3map.w3r - the region file.
	 */
	export default class War3MapW3r {
	    version: number;
	    regions: Region[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3r/index' {
	import File from 'parsers/w3x/w3r/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3s/sound' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A sound.
	 */
	export default class Sound {
	    name: string;
	    file: string;
	    eaxEffect: string;
	    flags: number;
	    fadeInRate: number;
	    fadeOutRate: number;
	    volume: number;
	    pitch: number;
	    u1: number;
	    u2: number;
	    channel: number;
	    minDistance: number;
	    maxDistance: number;
	    distanceCutoff: number;
	    u3: number;
	    u4: number;
	    u5: number;
	    u6: number;
	    u7: number;
	    u8: number;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3s/file' {
	import Sound from 'parsers/w3x/w3s/sound';
	/**
	 * war3map.w3s - the sound file.
	 */
	export default class War3MapW3s {
	    version: number;
	    sounds: Sound[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3s/index' {
	import File from 'parsers/w3x/w3s/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3u/index' {
	import File from 'parsers/w3x/w3u/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/wct/index' {
	import File from 'parsers/w3x/wct/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/wpm/file' {
	/**
	 * war3map.wpm - the pathing file.
	 */
	export default class War3MapWpm {
	    version: number;
	    size: Int32Array;
	    pathing: Uint8Array;
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): boolean;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/wpm/index' {
	import File from 'parsers/w3x/wpm/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/wtg/index' {
	import File from 'parsers/w3x/wtg/file';
	import TriggerData from 'parsers/w3x/wtg/triggerdata'; const _default: {
	    File: typeof File;
	    TriggerData: typeof TriggerData;
	};
	export default _default;

}
declare module 'parsers/w3x/wts/index' {
	import File from 'parsers/w3x/wts/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/unitsdoo/index' {
	import File from 'parsers/w3x/unitsdoo/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/w3f/maptitle' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A map title.
	 */
	export default class MapTitle {
	    visible: number;
	    chapterTitle: string;
	    mapTitle: string;
	    path: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3f/maporder' {
	import BinaryStream from 'common/binarystream';
	/**
	 * A map order.
	 */
	export default class MapOrder {
	    u1: number;
	    path: string;
	    load(stream: BinaryStream): void;
	    save(stream: BinaryStream): void;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3f/file' {
	import MapTitle from 'parsers/w3x/w3f/maptitle';
	import MapOrder from 'parsers/w3x/w3f/maporder';
	/**
	 * war3campaign.w3f - the campaign information file.
	 */
	export default class War3CampaignW3f {
	    version: number;
	    campaignVersion: number;
	    editorVersion: number;
	    name: string;
	    difficulty: string;
	    author: string;
	    description: string;
	    mode: number;
	    backgroundScreen: number;
	    backgroundScreenPath: string;
	    minimapImagePath: string;
	    ambientSound: number;
	    ambientSoundPath: string;
	    terrainFog: number;
	    fogStartZ: number;
	    fogEndZ: number;
	    fogDensity: number;
	    fogColor: Uint8Array;
	    userInterface: number;
	    mapTitles: MapTitle[];
	    mapOrders: MapOrder[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    save(): ArrayBuffer;
	    getByteLength(): number;
	}

}
declare module 'parsers/w3x/w3f/index' {
	import File from 'parsers/w3x/w3f/file'; const _default: {
	    File: typeof File;
	};
	export default _default;

}
declare module 'parsers/w3x/index' {
	import Map from 'parsers/w3x/map'; const _default: {
	    Map: typeof Map;
	    doo: {
	        File: typeof import("./doo/file").default;
	    };
	    imp: {
	        File: typeof import("./imp/file").default;
	    };
	    mmp: {
	        File: typeof import("./mmp/file").default;
	    };
	    shd: {
	        File: typeof import("./shd/file").default;
	    };
	    w3c: {
	        File: typeof import("./w3c/file").default;
	    };
	    w3d: {
	        File: typeof import("./w3d/file").default;
	    };
	    w3e: {
	        File: typeof import("./w3e/file").default;
	    };
	    w3i: {
	        File: typeof import("./w3i/file").default;
	    };
	    w3o: {
	        File: typeof import("./w3o/file").default;
	    };
	    w3r: {
	        File: typeof import("./w3r/file").default;
	    };
	    w3s: {
	        File: typeof import("./w3s/file").default;
	    };
	    w3u: {
	        File: typeof import("./w3u/file").default;
	    };
	    wct: {
	        File: typeof import("./wct/file").default;
	    };
	    wpm: {
	        File: typeof import("./wpm/file").default;
	    };
	    wtg: {
	        File: typeof import("./wtg/file").default;
	        TriggerData: typeof import("./wtg/triggerdata").default;
	    };
	    wts: {
	        File: typeof import("./wts/file").default;
	    };
	    unitsdoo: {
	        File: typeof import("./unitsdoo/file").default;
	    };
	    w3f: {
	        File: typeof import("./w3f/file").default;
	    };
	};
	export default _default;

}
declare module 'common/convertbitrange' {
	/**
	 * Returns a number, which when multiplied with a number of fromBits bits, will convert it to a toBits bits number.
	 *
	 * For example, 7 * convertBitRange(3, 8) == 255.
	 *
	 * In other words, if we look at the bits, 111 is the same to 3 bits as 11111111 is to 8 bits.
	 */
	export default function convertBitRange(fromBits: number, toBits: number): number;

}
declare module 'parsers/blp/image' {
	/**
	 * A BLP1 texture.
	 */
	export default class BlpImage {
	    content: number;
	    alphaBits: number;
	    width: number;
	    height: number;
	    type: number;
	    hasMipmaps: boolean;
	    mipmapOffsets: Uint32Array;
	    mipmapSizes: Uint32Array;
	    uint8array: Uint8Array | null;
	    /**
	     * Used for JPG images.
	     */
	    jpgHeader: Uint8Array | null;
	    /**
	     * Used for indexed images.
	     */
	    pallete: Uint8Array | null;
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    getMipmap(level: number): ImageData;
	    mipmaps(): number;
	}

}
declare module 'parsers/blp/index' {
	import Image from 'parsers/blp/image'; const _default: {
	    Image: typeof Image;
	};
	export default _default;

}
declare module 'common/dxt' {
	/**
	 * Decodes DXT1 data to a Uint16Array typed array with 5-6-5 RGB bits.
	 *
	 * DXT1 is also known as BC1.
	 */
	export function decodeDxt1(src: Uint8Array, width: number, height: number): Uint16Array;
	/**
	 * Decodes DXT3 data to a Uint8Array typed array with 8-8-8-8 RGBA bits.
	 *
	 * DXT3 is also known as BC2.
	 */
	export function decodeDxt3(src: Uint8Array, width: number, height: number): Uint8Array;
	/**
	 * Decodes DXT5 data to a Uint8Array typed array with 8-8-8-8 RGBA bits.
	 *
	 * DXT5 is also known as BC3.
	 */
	export function decodeDxt5(src: Uint8Array, width: number, height: number): Uint8Array;
	/**
	 * Decodes RGTC data to a Uint8Array typed array with 8-8 RG bits.
	 *
	 * RGTC is also known as BC5, ATI2, and 3Dc.
	 */
	export function decodeRgtc(src: Uint8Array, width: number, height: number): Uint8Array;

}
declare module 'parsers/dds/image' {
	export const FOURCC_DXT1 = 827611204;
	export const FOURCC_DXT3 = 861165636;
	export const FOURCC_DXT5 = 894720068;
	export const FOURCC_ATI2 = 843666497;
	/**
	 * A DDS texture.
	 */
	export class DdsImage {
	    width: number;
	    height: number;
	    format: number;
	    mipmapWidths: number[];
	    mipmapHeights: number[];
	    mipmapDatas: Uint8Array[];
	    constructor(buffer?: ArrayBuffer);
	    load(buffer: ArrayBuffer): void;
	    mipmaps(): number;
	    getMipmap(level: number, raw?: boolean): {
	        width: number;
	        height: number;
	        data: Uint8Array | Uint16Array;
	    };
	}

}
declare module 'parsers/dds/index' {
	import { DdsImage as Image } from 'parsers/dds/image'; const _default: {
	    Image: typeof Image;
	    FOURCC_DXT1: number;
	    FOURCC_DXT3: number;
	    FOURCC_DXT5: number;
	    FOURCC_ATI2: number;
	};
	export default _default;

}
declare module 'parsers/index' {
	 const _default: {
	    ini: {
	        File: typeof import("./ini/file").default;
	    };
	    slk: {
	        File: typeof import("./slk/file").default;
	    };
	    m3: {
	        Model: typeof import("./m3/model").default;
	    };
	    mdlx: {
	        Model: typeof import("./mdlx/model").default;
	    };
	    mpq: {
	        Archive: typeof import("./mpq/archive").default;
	    };
	    w3x: {
	        Map: typeof import("./w3x/map").default;
	        doo: {
	            File: typeof import("./w3x/doo/file").default;
	        };
	        imp: {
	            File: typeof import("./w3x/imp/file").default;
	        };
	        mmp: {
	            File: typeof import("./w3x/mmp/file").default;
	        };
	        shd: {
	            File: typeof import("./w3x/shd/file").default;
	        };
	        w3c: {
	            File: typeof import("./w3x/w3c/file").default;
	        };
	        w3d: {
	            File: typeof import("./w3x/w3d/file").default;
	        };
	        w3e: {
	            File: typeof import("./w3x/w3e/file").default;
	        };
	        w3i: {
	            File: typeof import("./w3x/w3i/file").default;
	        };
	        w3o: {
	            File: typeof import("./w3x/w3o/file").default;
	        };
	        w3r: {
	            File: typeof import("./w3x/w3r/file").default;
	        };
	        w3s: {
	            File: typeof import("./w3x/w3s/file").default;
	        };
	        w3u: {
	            File: typeof import("./w3x/w3u/file").default;
	        };
	        wct: {
	            File: typeof import("./w3x/wct/file").default;
	        };
	        wpm: {
	            File: typeof import("./w3x/wpm/file").default;
	        };
	        wtg: {
	            File: typeof import("./w3x/wtg/file").default;
	            TriggerData: typeof import("./w3x/wtg/triggerdata").default;
	        };
	        wts: {
	            File: typeof import("./w3x/wts/file").default;
	        };
	        unitsdoo: {
	            File: typeof import("./w3x/unitsdoo/file").default;
	        };
	        w3f: {
	            File: typeof import("./w3x/w3f/file").default;
	        };
	    };
	    blp: {
	        Image: typeof import("./blp/image").default;
	    };
	    dds: {
	        Image: typeof import("./dds/image").DdsImage;
	        FOURCC_DXT1: number;
	        FOURCC_DXT3: number;
	        FOURCC_DXT5: number;
	        FOURCC_ATI2: number;
	    };
	};
	export default _default;

}
declare module 'common/fetchdatatype' {
	/**
	 * The valid data type names for resource fetches.
	 */
	export type FetchDataTypeName = 'image' | 'text' | 'arrayBuffer' | 'blob';
	/**
	 * The valid data types for resource fetches.
	 */
	export type FetchDataType = HTMLImageElement | string | ArrayBuffer | Blob;
	/**
	 * The structure that the promise returned by fetchDataType is resolved to.
	 */
	export interface FetchResult {
	    ok: boolean;
	    data: FetchDataType | Response | Event;
	    error?: string;
	}
	/**
	 * Returns a promise that will resolve with the data from the given path.
	 *
	 * The data type determines the returned object:
	 *
	 *     "image" => Image
	 *     "text" => string
	 *     "arrayBuffer" => ArrayBuffer
	 *     "blob" => Blob
	 */
	export function fetchDataType(path: string, dataType: FetchDataTypeName): Promise<FetchResult>;

}
declare module 'common/mapequals' {
	/**
	 * Compares two Map objects, and returns whether they are equal or not.
	 * Equal in this context means their keys and values are the same.
	 */
	export default function equals(a: Map<any, any>, b: Map<any, any>): boolean;

}
declare module 'viewer/resource' {
	/// <reference types="node" />
	import { EventEmitter } from 'events';
	import ModelViewer from 'viewer/viewer';
	/**
	 * The data sent to every resource as a part of the loading process.
	 */
	export type ResourceData = {
	    viewer: ModelViewer;
	    extension?: string;
	    fetchUrl?: string;
	};
	/**
	 * A viewer resource.
	 *
	 * Generally speaking resources are created via viewer.load(), or viewer.loadGeneric().
	 */
	export abstract class Resource extends EventEmitter {
	    viewer: ModelViewer;
	    extension: string;
	    fetchUrl: string;
	    ok: boolean;
	    loaded: boolean;
	    constructor(resourceData: ResourceData);
	    /**
	     * Called when the data for this resource is ready.
	     *
	     * If a promise is returned, the resource waits for it to resolve before finalizing.
	     */
	    abstract load(src?: any): void;
	    /**
	     * Will be called when the data for this resource is ready.
	     *
	     * If it was loaded from memory, it will be called instantly.
	     *
	     * Otherwise it will be called when the server fetch finishes, assuming it succeeded.
	     */
	    loadData(src?: any): void;
	    /**
	     * Remove this resource from its viewer's cache.
	     *
	     * Equivalent to viewer.unload(resource).
	     */
	    detach(): boolean;
	    /**
	     * This is used by models to finalize instances of them that were created before they finished loading.
	     */
	    lateLoad(): void;
	    /**
	     * Called when an error happens while loading the resource.
	     */
	    error(error: string, reason: any): void;
	    /**
	     * Wait for this resource to load.
	     *
	     * Similar to attaching an event listener to the 'loadend' event, but handles the case where the resource already loaded, and code should still run.
	     *
	     * If a callback is given, it will be called, otherwise a promise is returned.
	     */
	    whenLoaded(callback?: (resource: Resource) => void): Promise<Resource> | undefined;
	}

}
declare module 'viewer/handlerresource' {
	import { ResourceData, Resource } from 'viewer/resource';
	/**
	 * A path solver used for resolving fetch paths.
	 */
	export type PathSolver = (src: any, params?: any) => [any, string?, boolean?];
	/**
	 * The data sent to every handler resource as part of the loading process.
	 */
	export type HandlerResourceData = ResourceData & {
	    pathSolver: PathSolver;
	};
	/**
	 * A viewer handler resource.
	 *
	 * Generally speaking handler resources are created via viewer.load().
	 */
	export abstract class HandlerResource extends Resource {
	    pathSolver: PathSolver;
	    constructor(resourceData: HandlerResourceData);
	}

}
declare module 'viewer/texture' {
	import { HandlerResource } from 'viewer/handlerresource';
	/**
	 * A texture.
	 */
	export default abstract class Texture extends HandlerResource {
	    webglResource: WebGLTexture | null;
	    width: number;
	    height: number;
	    wrapS: number;
	    wrapT: number;
	    magFilter: number;
	    minFilter: number;
	    /**
	     * Automatically apply the wrap and filter modes.
	     */
	    lateLoad(): void;
	    /**
	     * Bind this texture to the given texture unit.
	     */
	    bind(unit: number): void;
	    /**
	     * Update this texture with `src`, overriding whatever texture data it contains.
	     */
	    update(src: TexImageSource): void;
	}

}
declare module 'viewer/cubemap' {
	import Texture from 'viewer/texture';
	/**
	 * A cube map.
	 */
	export default class CubeMap extends Texture {
	    load(planes: TexImageSource[]): void;
	    /**
	     * Bind this texture to the given texture unit.
	     */
	    bind(unit: number): void;
	}

}
declare module 'viewer/gl/shader' {
	/**
	 * A wrapper around a WebGL shader unit.
	 */
	export default class ShaderUnit {
	    ok: boolean;
	    webglResource: WebGLShader;
	    src: string;
	    shaderType: number;
	    constructor(gl: WebGLRenderingContext, src: string, type: number);
	}

}
declare module 'viewer/gl/program' {
	/// <reference types="./src/types" />
	import WebGL from 'viewer/gl/gl';
	import ShaderUnit from 'viewer/gl/shader';
	/**
	 * A wrapper around a WebGL shader program.
	 */
	export default class ShaderProgram {
	    ok: boolean;
	    webgl: WebGL;
	    webglResource: WebGLProgram;
	    shaders: ShaderUnit[];
	    uniforms: {
	        [key: string]: WebGLUniformLocation;
	    };
	    attribs: NumberObject;
	    attribsCount: number;
	    constructor(webgl: WebGL, vertexShader: ShaderUnit, fragmentShader: ShaderUnit);
	    use(): void;
	}

}
declare module 'viewer/gl/gl' {
	import Texture from 'viewer/texture';
	import CubeMap from 'viewer/cubemap';
	import ShaderUnit from 'viewer/gl/shader';
	import ShaderProgram from 'viewer/gl/program';
	/**
	 * A small WebGL utility class.
	 * Makes it easier to generate shaders, textures, etc.
	 */
	export default class WebGL {
	    gl: WebGLRenderingContext;
	    shaderUnits: Map<string, ShaderUnit>;
	    shaderPrograms: Map<string, ShaderProgram>;
	    currentShaderProgram: ShaderProgram | null;
	    emptyTexture: WebGLTexture;
	    emptyCubeMap: WebGLTexture;
	    extensions: {
	        [key: string]: any;
	    };
	    constructor(canvas: HTMLCanvasElement, options?: object);
	    /**
	     * Ensures that an extension is available.
	     *
	     * If it is, it will be added to `extensions`.
	     */
	    ensureExtension(name: string): boolean;
	    /**
	     * Create a new shader unit. Uses caching.
	     */
	    createShaderUnit(src: string, type: number): ShaderUnit;
	    /**
	     * Create a new shader program. Uses caching.
	     */
	    createShaderProgram(vertexSrc: string, fragmentSrc: string): ShaderProgram | null;
	    /**
	     * Enables all vertex attribs between [start, end], including start and discluding end.
	     */
	    enableVertexAttribs(start: number, end: number): void;
	    /**
	     * Disables all vertex attribs between [start, end], including start and discluding end.
	     */
	    disableVertexAttribs(start: number, end: number): void;
	    /**
	     * Use a shader program.
	     */
	    useShaderProgram(shaderProgram: ShaderProgram): void;
	    /**
	     * Bind a texture.
	     *
	     * If the given texture is invalid, a 2x2 black texture will be bound instead.
	     */
	    bindTexture(texture: Texture | null, unit: number): void;
	    /**
	     * Bind a cube map texture.
	     *
	     * If the given texture is invalid, a 2x2 black texture will be bound instead.
	     */
	    bindCubeMap(cubeMap: CubeMap | null, unit: number): void;
	    /**
	     * Set the texture wrap and filter values.
	     */
	    setTextureMode(wrapS: number, wrapT: number, magFilter: number, minFilter: number): void;
	}

}
declare module 'viewer/promiseresource' {
	import { Resource } from 'viewer/resource';
	/**
	 * This object is used to promise about future resource loads, in case they are not yet known.
	 * It is needed to stop the viewer from preemtively calling whenAllLoaded.
	 *
	 * An example of this is MDX event objects.
	 * First the SLK their data is contained in needs to be loaded, and only then can the actual objects be loaded.
	 * Once the SLK loads, the viewer thinks it finished loading and calls whenAllLoaded, before starting to load the objects.
	 * Adding a promise in this case acts as a barrier, which is removed by resolving the promise after the objects start loading.
	 *
	 * Note that you can create a promise resource with viewer.promise(), which returns an already active promise.
	 */
	export default class PromiseResource extends Resource {
	    /**
	     * Does nothing.
	     */
	    load(): void;
	    /**
	     * Immitates a promise.
	     */
	    promise(): void;
	    /**
	     * Immitates promise resolution.
	     */
	    resolve(): void;
	}

}
declare module 'viewer/camera' {
	import { vec3, vec4, quat, mat4 } from 'gl-matrix';
	/**
	 * A camera.
	 */
	export default class Camera {
	    /**
	     * The rendered viewport.
	     */
	    viewport: vec4;
	    isPerspective: boolean;
	    fov: number;
	    aspect: number;
	    isOrtho: boolean;
	    leftClipPlane: number;
	    rightClipPlane: number;
	    bottomClipPlane: number;
	    topClipPlane: number;
	    nearClipPlane: number;
	    farClipPlane: number;
	    location: vec3;
	    rotation: quat;
	    inverseRotation: quat;
	    /**
	     * World -> View.
	     */
	    viewMatrix: mat4;
	    /**
	     * View -> Clip.
	     */
	    projectionMatrix: mat4;
	    /**
	     * World -> Clip.
	     */
	    viewProjectionMatrix: mat4;
	    /**
	     * View -> World.
	     */
	    inverseViewMatrix: mat4;
	    /**
	     * Clip -> World.
	     */
	    inverseViewProjectionMatrix: mat4;
	    /**
	     * The X axis in camera space.
	     */
	    directionX: vec3;
	    /**
	     * The Y axis in camera space.
	     */
	    directionY: vec3;
	    /**
	     * The Z axis in camera space.
	     */
	    directionZ: vec3;
	    /**
	     * The four corners of a 2x2 rectangle.
	     */
	    vectors: vec3[];
	    /**
	     * Same as vectors, however these are all billboarded to the camera.
	     */
	    billboardedVectors: vec3[];
	    /**
	     * The camera frustum planes in this order: left, right, top, bottom, near, far.
	     */
	    planes: vec4[];
	    dirty: boolean;
	    /**
	     * Set the camera to perspective projection mode.
	     */
	    perspective(fov: number, aspect: number, near: number, far: number): void;
	    /**
	     * Set the camera to orthogonal projection mode.
	     */
	    ortho(left: number, right: number, bottom: number, top: number, near: number, far: number): void;
	    /**
	     * Set the camera's viewport.
	     */
	    setViewport(x: number, y: number, width: number, height: number): void;
	    /**
	     * Set the camera location in world coordinates.
	     */
	    setLocation(location: vec3): void;
	    /**
	     * Move the camera by the given offset in world coordinates.
	     */
	    move(offset: vec3): void;
	    /**
	     * Set the camera rotation.
	     */
	    setRotation(rotation: quat): void;
	    /**
	     * Rotate the camera by the given rotation.
	     */
	    rotate(rotation: quat): void;
	    /**
	     * Look at `to`.
	     */
	    face(to: vec3, worldUp: vec3): void;
	    /**
	     * Move to `from` and look at `to`.
	     */
	    moveToAndFace(from: vec3, to: vec3, worldUp: vec3): void;
	    /**
	     * Reset the location and angles.
	     */
	    reset(): void;
	    /**
	     * Recalculate the camera's transformation.
	     */
	    update(): void;
	    /**
	     * Given a vector in camera space, return the vector transformed to world space.
	     */
	    cameraToWorld(out: vec3, v: vec3): vec3;
	    /**
	     * Given a vector in world space, return the vector transformed to camera space.
	     */
	    worldToCamera(out: vec3, v: vec3): vec3;
	    /**
	     * Given a vector in world space, return the vector transformed to screen space.
	     */
	    worldToScreen(out: Float32Array, v: Float32Array): Float32Array;
	    /**
	     * Given a vector in screen space, return a ray from the near plane to the far plane.
	     */
	    screenToWorldRay(out: Float32Array, v: Float32Array): Float32Array;
	}

}
declare module 'viewer/node' {
	import { vec3, quat, mat4 } from 'gl-matrix';
	import Scene from 'viewer/scene';
	/**
	 * A node.
	 */
	export class Node {
	    pivot: vec3;
	    localLocation: vec3;
	    localRotation: quat;
	    localScale: vec3;
	    worldLocation: vec3;
	    worldRotation: quat;
	    worldScale: vec3;
	    inverseWorldLocation: vec3;
	    inverseWorldRotation: quat;
	    inverseWorldScale: vec3;
	    localMatrix: mat4;
	    worldMatrix: mat4;
	    parent: Node | SkeletalNode | null;
	    children: Node[];
	    dontInheritTranslation: boolean;
	    dontInheritRotation: boolean;
	    dontInheritScaling: boolean;
	    visible: boolean;
	    wasDirty: boolean;
	    dirty: boolean;
	    constructor();
	    /**
	     * Sets the node's pivot.
	     */
	    setPivot(pivot: vec3): this;
	    /**
	     * Sets the node's local location.
	     */
	    setLocation(location: vec3): this;
	    /**
	     * Sets the node's local rotation.
	     */
	    setRotation(rotation: quat): this;
	    /**
	     * Sets the node's local scale.
	     */
	    setScale(varying: vec3): this;
	    /**
	     * Sets the node's local scale uniformly.
	     */
	    setUniformScale(uniform: number): this;
	    /**
	     * Sets the node's local location, rotation, and scale.
	     */
	    setTransformation(location: vec3, rotation: quat, scale: vec3): this;
	    /**
	     * Resets the node's local location, pivot, rotation, and scale, to the default values.
	     */
	    resetTransformation(): this;
	    /**
	     * Moves the node's pivot.
	     */
	    movePivot(offset: vec3): this;
	    /**
	     * Moves the node's local location.
	     */
	    move(offset: vec3): this;
	    /**
	     * Rotates the node's local rotation in world space.
	     */
	    rotate(rotation: quat): this;
	    /**
	     * Rotates the node's local rotation in local space.
	     */
	    rotateLocal(rotation: quat): this;
	    /**
	     * Scales the node.
	     */
	    scale(scale: vec3): this;
	    /**
	     * Scales the node uniformly.
	     */
	    uniformScale(scale: number): this;
	    face(to: vec3, worldUp: vec3): void;
	    /**
	     * Sets the node's parent.
	     */
	    setParent(parent?: Node | SkeletalNode): this;
	    /**
	     * Recalculate this node's transformation data.
	     */
	    recalculateTransformation(): void;
	    /**
	     * Update this node, and continue down the node hierarchy.
	     *
	     * Also updates the object part of this node, if there is any (e.g. model instances).
	     */
	    update(dt: number, scene: Scene): void;
	    /**
	     * Update the object part of this node.
	     *
	     * Used by model instances.
	     */
	    updateObject(dt: number, scene: Scene): void;
	    /**
	     * Update this node's children and continue the update hierarchy.
	     */
	    updateChildren(dt: number, scene: Scene): void;
	}
	/**
	 * A skeletal node used for skeletons.
	 *
	 * Expected to be created with createSharedNodes() below.
	 */
	export class SkeletalNode {
	    pivot: vec3;
	    localLocation: vec3;
	    localRotation: quat;
	    localScale: vec3;
	    worldLocation: vec3;
	    worldRotation: quat;
	    worldScale: vec3;
	    inverseWorldLocation: vec3;
	    inverseWorldRotation: quat;
	    inverseWorldScale: vec3;
	    localMatrix: mat4;
	    worldMatrix: mat4;
	    dontInheritTranslation: boolean;
	    dontInheritRotation: boolean;
	    dontInheritScaling: boolean;
	    parent: SkeletalNode | Node | null;
	    children: Node[];
	    visible: boolean;
	    wasDirty: boolean;
	    /**
	     * The object associated with this node, if there is any.
	     */
	    object: any;
	    dirty: boolean;
	    billboarded: boolean;
	    billboardedX: boolean;
	    billboardedY: boolean;
	    billboardedZ: boolean;
	    /**
	     *
	     */
	    constructor(shared: Float32Array[]);
	    /**
	     * Recalculate this skeletal node.
	     */
	    recalculateTransformation(scene: Scene): void;
	    /**
	     * Update this skeletal node's children.
	     *
	     * Note that this does not update other skeletal nodes!
	     */
	    updateChildren(dt: number, scene: Scene): void;
	    /**
	     * Allows inherited node classes to run extra transformations when billboarding.
	     *
	     * This is needed because the different model formats are in different vector spaces.
	     */
	    convertBasis(rotation: quat): void;
	}
	/**
	 * Creates an array of skeletal nodes with shared memory.
	 *
	 * The returned object contains the node array itself, the backing buffer, and all of the different shared arrays.
	 */
	export function createSkeletalNodes(count: number, Node?: typeof SkeletalNode): {
	    data: Float32Array;
	    nodes: SkeletalNode[];
	    pivots: Float32Array;
	    localLocations: Float32Array;
	    localRotations: Float32Array;
	    localScales: Float32Array;
	    worldLocations: Float32Array;
	    worldRotations: Float32Array;
	    worldScales: Float32Array;
	    inverseWorldLocations: Float32Array;
	    invereseWorldRotations: Float32Array;
	    inverseWorldScales: Float32Array;
	    localMatrices: Float32Array;
	    worldMatrices: Float32Array;
	};

}
declare module 'viewer/bounds' {
	/**
	 * An object representing both a sphere and an AABB, which is used for culling of all instances.
	 *
	 * By default, the size of the bounds is 0, and thus point-culling is done.
	 */
	export default class Bounds {
	    x: number;
	    y: number;
	    z: number;
	    r: number;
	    fromExtents(min: Float32Array, max: Float32Array): void;
	}

}
declare module 'viewer/model' {
	import { HandlerResource } from 'viewer/handlerresource';
	import Bounds from 'viewer/bounds';
	import ModelInstance from 'viewer/modelinstance';
	/**
	 * A model.
	 */
	export default abstract class Model extends HandlerResource {
	    /**
	     * An array of instances that were created before the model loaded.
	     *
	     * When the model loads, the instances are loaded, and the array is cleared.
	     */
	    preloadedInstances: ModelInstance[];
	    bounds: Bounds;
	    /**
	     * Create the actual instance object and return it.
	     *
	     * The given type can be used to select between instance classes, if there are more than one.
	     */
	    abstract createInstance(type: number): ModelInstance;
	    /**
	     * Adds a new instance to this model, and returns it.
	     */
	    addInstance(type?: number): ModelInstance;
	    lateLoad(): void;
	}

}
declare module 'viewer/texturemapper' {
	import Model from 'viewer/model';
	import Texture from 'viewer/texture';
	/**
	 * A texture mapper.
	 */
	export default class TextureMapper {
	    model: Model;
	    textures: Map<any, Texture>;
	    constructor(model: Model, textures?: Map<any, Texture>);
	    get(key: any): Texture | undefined;
	}

}
declare module 'viewer/modelinstance' {
	import { Node } from 'viewer/node';
	import Model from 'viewer/model';
	import Scene from 'viewer/scene';
	import TextureMapper from 'viewer/texturemapper';
	import Texture from 'viewer/texture';
	import Camera from 'viewer/camera';
	/**
	 * A model instance.
	 */
	export default abstract class ModelInstance extends Node {
	    scene: Scene | null;
	    left: number;
	    right: number;
	    bottom: number;
	    top: number;
	    plane: number;
	    depth: number;
	    updateFrame: number;
	    cullFrame: number;
	    model: Model;
	    textureMapper: TextureMapper;
	    /**
	     * If true, this instance won't be updated.
	     */
	    paused: boolean;
	    /**
	     * If false, this instance won't be rendered.
	     *
	     * When working with Warcraft 3 instances, it is preferable to use hide() and show().
	     * These hide and show also internal instances of this instance.
	     */
	    rendered: boolean;
	    constructor(model: Model);
	    /**
	     * Set the texture at the given key to the given texture.
	     *
	     * If a texture isn't given, the key is deleted instead.
	     */
	    setTexture(key: any, texture?: Texture): void;
	    /**
	     * This instance should be shown.
	     */
	    show(): void;
	    /**
	     * This instance should be hidden.
	     */
	    hide(): void;
	    /**
	     * Should the instance be shown?
	     */
	    shown(): boolean;
	    /**
	     * Should the instance be hidden?
	     */
	    hidden(): boolean;
	    /**
	     * Detach this instance from the scene it's in.
	     *
	     * Equivalent to scene.removeInstance(instance).
	     */
	    detach(): boolean;
	    /**
	     * Called once the model is loaded, or immediately if the model was already loaded.
	     */
	    load(): void;
	    /**
	     * Called if the instance is shown and not culled.
	     */
	    updateAnimations(dt: number): void;
	    /**
	     * Clears any objects that were emitted by this instance.
	     */
	    clearEmittedObjects(): void;
	    /**
	     * Update this model instance.
	     *
	     * Called automatically by the scene that owns this model instance.
	     */
	    updateObject(dt: number, scene: Scene): void;
	    /**
	     * Sets the scene of this instance.
	     *
	     * This is equivalent to scene.addInstance(instance).
	     */
	    setScene(scene: Scene): boolean;
	    recalculateTransformation(): void;
	    renderOpaque(): void;
	    renderTranslucent(): void;
	    isVisible(camera: Camera): boolean;
	    isBatched(): boolean;
	}

}
declare module 'viewer/cell' {
	import Camera from 'viewer/camera';
	import ModelInstance from 'viewer/modelinstance';
	/**
	 * A grid cell.
	 */
	export default class Cell {
	    left: number;
	    right: number;
	    bottom: number;
	    top: number;
	    plane: number;
	    instances: ModelInstance[];
	    visible: boolean;
	    constructor(left: number, right: number, bottom: number, top: number);
	    add(instance: ModelInstance): void;
	    remove(instance: ModelInstance): void;
	    /**
	     * Remove all of the instances from this cell.
	     */
	    clear(): void;
	    isVisible(camera: Camera): boolean;
	}

}
declare module 'viewer/grid' {
	import Cell from 'viewer/cell';
	import ModelInstance from 'viewer/modelinstance';
	/**
	 * A grid.
	 */
	export default class Grid {
	    x: number;
	    y: number;
	    width: number;
	    depth: number;
	    cellWidth: number;
	    cellDepth: number;
	    columns: number;
	    rows: number;
	    cells: Cell[];
	    constructor(x: number, y: number, width: number, depth: number, cellWidth: number, cellDepth: number);
	    add(instance: ModelInstance): void;
	    remove(instance: ModelInstance): void;
	    moved(instance: ModelInstance): void;
	    /**
	     * Removes all of the instances from this grid.
	     */
	    clear(): void;
	}

}
declare module 'viewer/renderbatch' {
	import Scene from 'viewer/scene';
	import TextureMapper from 'viewer/texturemapper';
	import Model from 'viewer/model';
	import ModelInstance from 'viewer/modelinstance';
	/**
	 * A render batch.
	 */
	export default abstract class RenderBatch {
	    scene: Scene;
	    model: Model;
	    textureMapper: TextureMapper;
	    instances: ModelInstance[];
	    count: number;
	    abstract render(): void;
	    constructor(scene: Scene, model: Model, textureMapper: TextureMapper);
	    clear(): void;
	    add(instance: ModelInstance): void;
	}

}
declare module 'viewer/batchedinstance' {
	import ModelInstance from 'viewer/modelinstance';
	import RenderBatch from 'viewer/renderbatch';
	import TextureMapper from 'viewer/texturemapper';
	/**
	 * A batched model instance.
	 */
	export default abstract class BatchedInstance extends ModelInstance {
	    /**
	     * Get a concrete RenderBatch object.
	     */
	    abstract getBatch(textureMapper: TextureMapper): RenderBatch;
	    isBatched(): boolean;
	}

}
declare module 'viewer/emitter' {
	import ModelInstance from 'viewer/modelinstance';
	import EmittedObject from 'viewer/emittedobject';
	/**
	 * An emitter.
	 */
	export default abstract class Emitter {
	    instance: ModelInstance;
	    objects: EmittedObject[];
	    alive: number;
	    currentEmission: number;
	    abstract createObject(): EmittedObject;
	    abstract updateEmission(dt: number): void;
	    abstract emit(): void;
	    constructor(instance: ModelInstance);
	    /**
	     * Update this emitter.
	     */
	    update(dt: number): void;
	    /**
	     * Clear any emitted objects.
	     */
	    clear(): void;
	    emitObject(emitData?: any): EmittedObject;
	    kill(object: EmittedObject): void;
	}

}
declare module 'viewer/emittedobject' {
	import Emitter from 'viewer/emitter';
	/**
	 * An emitted object.
	 */
	export default abstract class EmittedObject {
	    emitter: Emitter;
	    index: number;
	    health: number;
	    abstract bind(emitData?: any): void;
	    abstract update(dt: number): void;
	    constructor(emitter: Emitter);
	}

}
declare module 'viewer/emittedobjectupdater' {
	import EmittedObject from 'viewer/emittedobject';
	/**
	 * An emitted object updater.
	 */
	export default class EmittedObjectUpdater {
	    objects: EmittedObject[];
	    alive: number;
	    add(object: EmittedObject): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/scene' {
	import ModelViewer from 'viewer/viewer';
	import Camera from 'viewer/camera';
	import Grid from 'viewer/grid';
	import ModelInstance from 'viewer/modelinstance';
	import BatchedInstance from 'viewer/batchedinstance';
	import TextureMapper from 'viewer/texturemapper';
	import RenderBatch from 'viewer/renderbatch';
	import EmittedObjectUpdater from 'viewer/emittedobjectupdater';
	/**
	 * A scene.
	 *
	 * Every scene has its own list of model instances, and its own camera and viewport.
	 *
	 * In addition, every scene may have its own AudioContext if enableAudio() is called.
	 * If audo is enabled, the AudioContext's listener's location will be updated automatically.
	 * Note that due to browser policies, this may be done only after user interaction with the web page.
	 */
	export default class Scene {
	    viewer: ModelViewer;
	    camera: Camera;
	    grid: Grid;
	    visibleCells: number;
	    visibleInstances: number;
	    updatedParticles: number;
	    audioEnabled: boolean;
	    audioContext: AudioContext | null;
	    instances: ModelInstance[];
	    currentInstance: number;
	    batchedInstances: BatchedInstance[];
	    currentBatchedInstance: number;
	    batches: Map<TextureMapper, RenderBatch>;
	    emittedObjectUpdater: EmittedObjectUpdater;
	    /**
	     * Similar to WebGL's own `alpha` parameter.
	     *
	     * If false, the scene will be cleared before rendering, meaning that scenes behind it won't be visible through it.
	     *
	     * If true, alpha works as usual.
	     */
	    alpha: boolean;
	    constructor(viewer: ModelViewer);
	    /**
	     * Creates an AudioContext if one wasn't created already, and resumes it if needed.
	     *
	     * The returned promise will resolve to whether it is actually running or not.
	     *
	     * It may stay in suspended state indefinitly until the user interacts with the page, due to browser policies.
	     */
	    enableAudio(): Promise<boolean>;
	    /**
	     * Suspend the audio context.
	     */
	    disableAudio(): void;
	    /**
	     * Sets the scene of the given instance.
	     *
	     * Equivalent to instance.setScene(scene).
	     */
	    addInstance(instance: ModelInstance): boolean;
	    /**
	     * Remove the given instance from this scene.
	     *
	     * Equivalent to ModelInstance.detach().
	     */
	    removeInstance(instance: ModelInstance): boolean;
	    /**
	     * Clear this scene.
	     */
	    clear(): void;
	    /**
	     * Detach this scene from the viewer.
	     *
	     * Equivalent to viewer.removeScene(scene).
	     */
	    detach(): boolean;
	    addToBatch(instance: BatchedInstance): void;
	    /**
	     * Update this scene.
	     */
	    update(dt: number): void;
	    /**
	     * Use the scene's viewport.
	     *
	     * Should be called before `renderOpaque()` and `renderTranslucent()`.
	     *
	     * Called automatically by `render()`.
	     */
	    startFrame(): void;
	    /**
	     * Render all opaque things in this scene.
	     */
	    renderOpaque(): void;
	    /**
	     * Renders all translucent things in this scene.
	     */
	    renderTranslucent(): void;
	    /**
	     * Render this scene.
	     */
	    render(): void;
	    /**
	     * Clear all of the emitted objects in this scene.
	     */
	    clearEmittedObjects(): void;
	}

}
declare module 'viewer/genericresource' {
	import { Resource } from 'viewer/resource';
	/**
	 * A generic resource.
	 */
	export default class GenericResource extends Resource {
	    data: any;
	    load(data: any): void;
	}

}
declare module 'viewer/gl/clientbuffer' {
	/**
	 * A buffer.
	 */
	export default class ClientBuffer {
	    gl: WebGLRenderingContext;
	    buffer: WebGLBuffer;
	    size: number;
	    arrayBuffer: ArrayBuffer | null;
	    byteView: Uint8Array | null;
	    floatView: Float32Array | null;
	    constructor(gl: WebGLRenderingContext, size?: number);
	    reserve(size: number): void;
	    bindAndUpdate(size?: number): void;
	}

}
declare module 'viewer/imagetexture' {
	import Texture from 'viewer/texture';
	/**
	 * Checks if the given source is a supported image texture source.
	 */
	export function isImageSource(src: any): boolean;
	/**
	 * Checks if the given extension is a supported image texture extension.
	 */
	export function isImageExtension(ext: string): boolean;
	/**
	 * A texture handler for image sources.
	 */
	export class ImageTexture extends Texture {
	    load(src: TexImageSource): void;
	}

}
declare module 'viewer/viewer' {
	/// <reference types="node" />
	import { EventEmitter } from 'events';
	import { FetchDataTypeName, FetchDataType } from 'common/fetchdatatype';
	import WebGL from 'viewer/gl/gl';
	import PromiseResource from 'viewer/promiseresource';
	import Scene from 'viewer/scene';
	import { Resource } from 'viewer/resource';
	import { PathSolver, HandlerResourceData, HandlerResource } from 'viewer/handlerresource';
	import GenericResource from 'viewer/genericresource';
	import ClientBuffer from 'viewer/gl/clientbuffer';
	import Model from 'viewer/model';
	import ModelInstance from 'viewer/modelinstance';
	import TextureMapper from 'viewer/texturemapper';
	import Texture from 'viewer/texture';
	import { ImageTexture } from 'viewer/imagetexture';
	import CubeMap from 'viewer/cubemap';
	/**
	 * The minimal structure of handlers.
	 *
	 * Additional data can be added to them for the purposes of the implementation.
	 */
	export interface Handler {
	    extensions: string[][];
	    load?: (viewer: ModelViewer) => boolean;
	    resource: new (resourceData: HandlerResourceData) => HandlerResource;
	}
	/**
	 * A model viewer.
	 */
	export default class ModelViewer extends EventEmitter {
	    resources: Resource[];
	    /**
	     * A cache of resources that were fetched.
	     */
	    fetchCache: Map<string, Resource>;
	    resourcesLoading: Set<Resource>;
	    handlers: Set<Handler>;
	    frameTime: number;
	    canvas: HTMLCanvasElement;
	    webgl: WebGL;
	    gl: WebGLRenderingContext;
	    scenes: Scene[];
	    visibleCells: number;
	    visibleInstances: number;
	    updatedParticles: number;
	    frame: number;
	    /**
	     * A simple buffer containing the bytes [0, 1, 2, 0, 2, 3].
	     *
	     * These are used as vertices in all geometry shaders.
	     */
	    rectBuffer: WebGLBuffer;
	    /**
	     * A resizeable buffer that can be used by any part of the library.
	     *
	     * The data it contains is temporary, and can be overwritten at any time.
	     */
	    buffer: ClientBuffer;
	    /**
	     * A viewer-wide flag.
	     *
	     * If it is false, not only will audio not run, but in fact audio files won't even be fetched in the first place.
	     *
	     * If audio is desired, this should be set to true before loading models that use audio.
	     *
	     * Note that it is preferable to call enableAudio(), which checks for the existence of AudioContext.
	     */
	    audioEnabled: boolean;
	    textureMappers: Map<Model, TextureMapper[]>;
	    /**
	     * A cache of arbitrary data, shared between all of the handlers.
	     */
	    sharedCache: Map<any, any>;
	    constructor(canvas: HTMLCanvasElement, options?: object);
	    /**
	     * Enable audio if AudioContext is available.
	     */
	    enableAudio(): boolean;
	    /**
	     * Add an handler.
	     */
	    addHandler(handler: Handler): boolean;
	    /**
	     * Add a scene.
	     */
	    addScene(): Scene;
	    /**
	     * Remove a scene.
	     */
	    removeScene(scene: Scene): boolean;
	    /**
	     * Removes all of the scenes in the viewer.
	     */
	    clear(): void;
	    /**
	     * Look for a handler matching the given extension.
	     */
	    findHandler(ext: string): (string | Handler)[] | undefined;
	    /**
	     * Load something.
	     *
	     * If `src` is an image texture source (e.g. an image or a canvas), it will be loaded directly.
	     *
	     * Otherwise, `pathSolver` is called with `src` and `solverParams`, and must return an array of values:
	     *
	     *     [finalSrc, extension, isFetch]
	     *
	     * If `finalSrc` is an image texture source, it will be loaded directly.
	     *
	     * If `extension` is an image texture source extension (.png/.jpg/.gif), it will be fetched and loaded directly.
	     *
	     * Otherwise, `extension` is used to select the handler.\
	     * If `isFetch` is true, `finalSrc` is the url from which to fetch.\
	     * If `isFetch` is false, `finalSrc` is whatever the handler expects, typically an ArrayBuffer or a string.
	     *
	     * If the resource being loaded has internal resources (e.g. a model that loads its own textures), `pathSolver` will be called for them as well.
	     *
	     * A resource is always returned, except for when `pathSolver` isn't given but `src` isn't an image texture source, or when the handler couldn't be resolved.
	     */
	    load(src: any, pathSolver?: PathSolver, solverParams?: any): Resource | undefined;
	    /**
	     * Check whether the given string maps to a resource in the cache.
	     */
	    has(key: string): boolean;
	    /**
	     * Get a resource from the cache.
	     */
	    get(key: string): Resource | undefined;
	    /**
	     * Load something generic.
	     *
	     * Unlike load(), this does not use handlers or construct any internal objects.
	     *
	     * `dataType` can be one of: `"image"`, `"string"`, `"arrayBuffer"`, `"blob"`.
	     *
	     * If `callback` isn't given, the resource's `data` is the fetch data, according to `dataType`.
	     *
	     * If `callback` is given, the resource's `data` is the value returned by it when called with the fetch data.
	     *
	     * If `callback` returns a promise, the resource's `data` will be whatever the promise resolved to.
	     */
	    loadGeneric(path: string, dataType: FetchDataTypeName, callback?: (data: FetchDataType) => any): GenericResource;
	    /**
	     * Load an image texture.
	     *
	     * `pathSolver` must return an array of values like all path solvers.\
	     * If the first array element is an image texture source, it will be used.\
	     * Otherwise, it will always try to fetch an image.\
	     * Any other array elements are ignored.
	     *
	     * Note that this is usually called by the viewer itself.\
	     * For example, if you want to load an image directly, the following is recommended:
	     *
	     *     viewer.load(image)
	     */
	    loadImageTexture(pathSolver: PathSolver): ImageTexture;
	    /**
	     * Load a cube map texture.
	     *
	     * `pathSolver` will be called 6 times, each time with a number refering to one of the textures:
	     *
	     *     0 = Positive X
	     *     1 = Negative X
	     *     2 = Positive Y
	     *     3 = Negative Y
	     *     4 = Positive Z
	     *     5 = Negative Z
	     *
	     * `pathSolver` must return an array of values like all path solvers.\
	     * If the first array element is an image texture source, it will be used.\
	     * Otherwise, it will always try to fetch an image.\
	     * Any other array elements are ignored.
	     */
	    loadCubeMap(pathSolver: PathSolver): CubeMap;
	    /**
	     * Unload a resource.
	     * Note that this only removes the resource from the viewer's cache.
	     * If it's being referenced and used e.g. by a scene, it will not be garbage collected.
	     */
	    unload(resource: Resource): boolean;
	    /**
	     * Starts loading a new empty resource, and returns it.
	     * This empty resource will block the "idle" event (and thus whenAllLoaded) until it's resolved.
	     * This is used when a resource might get loaded in the future, but it is not known what it is yet.
	     */
	    promise(): PromiseResource;
	    /**
	     * Wait for a group of resources to load.
	     * If a callback is given, it will be called.
	     * Otherwise a promise is returned.
	     */
	    whenLoaded(resources: Iterable<Resource>, callback?: (resources: Resource[]) => void): Promise<Resource[]> | undefined;
	    /**
	     * Wait for all of the resources to load.
	     *
	     * If a callback is given, it will be called, otherwise, a promise is returned.
	     */
	    whenAllLoaded(callback?: (viewer: ModelViewer) => void): Promise<ModelViewer> | undefined;
	    /**
	     * Get a blob representing the contents of the viewer's canvas.
	     *
	     * If a callback is given, it will be called, otherwise, a promise is returned.
	     */
	    toBlob(callback?: BlobCallback): Promise<Blob | null> | undefined;
	    /**
	     * Update and render a frame.
	     */
	    updateAndRender(): void;
	    /**
	     * Update all of the scenes, which includes updating their cameras, audio context if one exists, and all of the instances they hold.
	     */
	    update(): void;
	    /**
	     * Clears the WebGL buffer.
	     *
	     * Called automatically by updateAndRender().
	     *
	     * Call this at some point before render() if you need more control.
	     */
	    startFrame(): void;
	    /**
	     * Render.
	     */
	    render(): void;
	    /**
	     * Clear all of the emitted objects in this viewer.
	     */
	    clearEmittedObjects(): void;
	    registerEvents(resource: Resource): void;
	    baseTextureMapper(model: Model): TextureMapper;
	    changeTextureMapper(instance: ModelInstance, key: any, texture?: Texture): TextureMapper;
	}

}
declare module 'viewer/handlers/blp/texture' {
	import BlpImage from 'parsers/blp/image';
	import Texture from 'viewer/texture';
	/**
	 * A BLP texure handler.
	 */
	export default class BlpTexture extends Texture {
	    load(bufferOrImage: ArrayBuffer | BlpImage): void;
	}

}
declare module 'viewer/handlers/blp/handler' {
	import Texture from 'viewer/handlers/blp/texture'; const _default: {
	    extensions: string[][];
	    resource: typeof Texture;
	};
	export default _default;

}
declare module 'viewer/handlers/dds/texture' {
	import { DdsImage } from 'parsers/dds/image';
	import Texture from 'viewer/texture';
	/**
	 * A DDS texture handler.
	 */
	export default class DdsTexture extends Texture {
	    load(bufferOrImage: ArrayBuffer | DdsImage): void;
	}

}
declare module 'viewer/handlers/dds/handler' {
	import ModelViewer from 'viewer/viewer';
	import Texture from 'viewer/handlers/dds/texture'; const _default: {
	    load(viewer: ModelViewer): boolean;
	    extensions: string[][];
	    resource: typeof Texture;
	};
	export default _default;

}
declare module 'viewer/handlers/geo/renderbatch' {
	import ClientBuffer from 'viewer/gl/clientbuffer';
	import RenderBatch from 'viewer/renderbatch';
	/**
	 * A render batch.
	 */
	export default class GeoRenderBatch extends RenderBatch {
	    bindAndUpdateBuffer(buffer: ClientBuffer): void;
	    render(): void;
	}

}
declare module 'viewer/handlers/geo/modelinstance' {
	import TextureMapper from 'viewer/texturemapper';
	import BatchedInstance from 'viewer/batchedinstance';
	import GeoRenderBatch from 'viewer/handlers/geo/renderbatch';
	/**
	 * A GEO model instance.
	 */
	export default class GeometryModelInstance extends BatchedInstance {
	    faceColor: Uint8Array;
	    edgeColor: Uint8Array;
	    load(): void;
	    setFaceColor(color: Uint8Array): this;
	    setEdgeColor(color: Uint8Array): this;
	    getBatch(textureMapper: TextureMapper): GeoRenderBatch;
	}

}
declare module 'viewer/handlers/geo/model' {
	import Model from 'viewer/model';
	import Texture from 'viewer/texture';
	import GeometryModelInstance from 'viewer/handlers/geo/modelinstance';
	/**
	 * The structure of a source map node.
	 */
	interface GeometryObject {
	    geometry: {
	        vertices: Float32Array;
	        uvs: Float32Array;
	        faces: Uint8Array | Uint16Array | Uint32Array;
	        edges: Uint8Array | Uint16Array | Uint32Array;
	        boundingRadius: number;
	    };
	    material: {
	        texture?: Texture;
	        twoSided?: boolean;
	        faceColor?: Uint8Array;
	        edgeColor?: Uint8Array;
	        renderMode?: number;
	        sizzle?: boolean;
	    };
	}
	/**
	 * A geometry model.
	 *
	 * Used to render simple geometric shapes.
	 */
	export default class GeometryModel extends Model {
	    vertexBuffer: WebGLBuffer | null;
	    uvBuffer: WebGLBuffer | null;
	    faceBuffer: WebGLBuffer | null;
	    edgeBuffer: WebGLBuffer | null;
	    faceIndexType: number;
	    edgeIndexType: number;
	    faceElements: number;
	    edgeElements: number;
	    texture: Texture | null;
	    twoSided: boolean;
	    faceColor: Uint8Array;
	    edgeColor: Uint8Array;
	    renderMode: number;
	    sizzle: boolean;
	    createInstance(type: number): GeometryModelInstance;
	    load(src: GeometryObject): void;
	}
	export {};

}
declare module 'viewer/handlers/geo/shaders/standard.vert' {
	 const shader = "\n uniform mat4 u_VP;\n\n// Instances\nattribute vec3 a_m0;\nattribute vec3 a_m1;\nattribute vec3 a_m2;\nattribute vec3 a_m3;\nattribute vec3 a_faceColor;\nattribute vec3 a_edgeColor;\n\n// Vertices\nattribute vec3 a_position;\nattribute vec2 a_uv;\n\nvarying vec2 v_uv;\nvarying vec3 v_faceColor;\nvarying vec3 v_edgeColor;\n\nvoid main() {\n  v_uv = a_uv;\n  v_faceColor = a_faceColor;\n  v_edgeColor = a_edgeColor;\n\n  gl_Position = u_VP * mat4(a_m0, 0.0, a_m1, 0.0, a_m2, 0.0, a_m3, 1.0) * vec4(a_position, 1.0);\n}\n";
	export default shader;

}
declare module 'viewer/handlers/geo/shaders/standard.frag' {
	 const shader = "\nprecision mediump float;\n    \nuniform sampler2D u_diffuseMap;\nuniform bool u_isEdge;\nuniform bool u_hasTexture;\nuniform bool u_sizzle;\n\nvarying vec2 v_uv;\nvarying vec3 v_faceColor;\nvarying vec3 v_edgeColor;\n\nvoid main() {\n  vec3 color;\n\n  if (u_isEdge) {\n    color = v_edgeColor;\n  } else {\n    color = v_faceColor;\n\n    if (u_hasTexture) {\n      vec4 texel = texture2D(u_diffuseMap, v_uv);\n\n      if (u_sizzle) {\n        texel = texel.bgra;\n      }\n\n      color *= texel.rgb;\n    }\n  }\n\n  gl_FragColor = vec4(color, 1.0);\n}\n";
	export default shader;

}
declare module 'viewer/handlers/geo/handler' {
	import ModelViewer from 'viewer/viewer';
	import Model from 'viewer/handlers/geo/model'; const _default: {
	    extensions: string[][];
	    load(viewer: ModelViewer): boolean;
	    resource: typeof Model;
	};
	export default _default;

}
declare module 'viewer/handlers/tga/texture' {
	import Texture from 'viewer/texture';
	/**
	 * A TGA texture handler.
	 */
	export default class TgaTexture extends Texture {
	    load(src: ArrayBuffer): void;
	}

}
declare module 'viewer/handlers/tga/handler' {
	import Texture from 'viewer/handlers/tga/texture'; const _default: {
	    extensions: string[][];
	    resource: typeof Texture;
	};
	export default _default;

}
declare module 'viewer/handlers/m3/layer' {
	import Reference from 'parsers/m3/reference';
	import Layer from 'parsers/m3/layer';
	import Texture from 'viewer/texture';
	import ShaderProgram from 'viewer/gl/program';
	import TextureMapper from 'viewer/texturemapper';
	import M3StandardMaterial from 'viewer/handlers/m3/standardmaterial';
	import M3Model from 'viewer/handlers/m3/model';
	/**
	 * An M3 layer.
	 */
	export default class M3Layer {
	    model: M3Model;
	    active: number;
	    layer: Layer | null;
	    gl: WebGLRenderingContext;
	    uniformMap: {
	        map: string;
	        enabled: string;
	        op: string;
	        channels: string;
	        teamColorMode: string;
	        invert: string;
	        clampResult: string;
	        uvCoordinate: string;
	    };
	    source: string;
	    texture: Texture | null;
	    flags: number;
	    colorChannels: number;
	    type: string;
	    op: number;
	    uvCoordinate: number;
	    textureUnit: number;
	    invert: number;
	    clampResult: number;
	    teamColorMode: number;
	    constructor(material: M3StandardMaterial, layerReference: Reference | null, type: string, op: number);
	    bind(shader: ShaderProgram, textureMapper: TextureMapper): void;
	    unbind(shader: ShaderProgram): void;
	}

}
declare module 'viewer/handlers/m3/standardmaterial' {
	import M3ParserStandardMaterial from 'parsers/m3/standardmaterial';
	import ShaderProgram from 'viewer/gl/program';
	import TextureMapper from 'viewer/texturemapper';
	import M3Model from 'viewer/handlers/m3/model';
	import M3Layer from 'viewer/handlers/m3/layer';
	/**
	 * An M3 standard material.
	 */
	export default class M3StandardMaterial {
	    model: M3Model;
	    gl: WebGLRenderingContext;
	    name: string;
	    flags: number;
	    blendMode: number;
	    priority: number;
	    specularity: number;
	    specMult: number;
	    emisMult: number;
	    layerBlendType: number;
	    emisBlendType: number;
	    emisMode: number;
	    doubleSided: number;
	    layers: M3Layer[];
	    constructor(model: M3Model, material: M3ParserStandardMaterial);
	    bindCommon(): void;
	    bind(shader: ShaderProgram, textureMapper: TextureMapper): void;
	    unbind(shader: ShaderProgram): void;
	}

}
declare module 'viewer/handlers/m3/bone' {
	import Bone from 'parsers/m3/bone';
	import { M3ParserUint32AnimationReference, M3ParserVector3AnimationReference, M3ParserVector4AnimationReference } from 'parsers/m3/animationreference';
	/**
	 * An M3 bone.
	 */
	export default class M3Bone {
	    name: string;
	    parent: number;
	    location: M3ParserVector3AnimationReference;
	    rotation: M3ParserVector4AnimationReference;
	    scale: M3ParserVector3AnimationReference;
	    visibility: M3ParserUint32AnimationReference;
	    inhertTranslation: number;
	    inheritScale: number;
	    inheritRotation: number;
	    billboard1: number;
	    billboard2: number;
	    twoDProjection: number;
	    animated: number;
	    inverseKinematics: number;
	    skinned: number;
	    real: number;
	    constructor(bone: Bone);
	}

}
declare module 'viewer/handlers/m3/sequence' {
	import M3ParserSequence from 'parsers/m3/sequence';
	import M3ParserBoundingSphere from 'parsers/m3/boundingsphere';
	/**
	 * An M3 sequence.
	 */
	export default class M3Sequence {
	    name: string;
	    interval: Uint32Array;
	    movementSpeed: number;
	    frequency: number;
	    boundingSphere: M3ParserBoundingSphere;
	    flags: number;
	    constructor(sequence: M3ParserSequence);
	}

}
declare module 'viewer/handlers/m3/sts' {
	import M3ParserSts from 'parsers/m3/sts';
	import { M3ParserAnimationReference } from 'parsers/m3/animationreference';
	/**
	 * M3 animation data validator.
	 */
	export default class M3Sts {
	    animIds: object;
	    constructor(sts: M3ParserSts);
	    hasData(animRef: M3ParserAnimationReference): boolean;
	}

}
declare module 'viewer/gl/datatexture' {
	/// <reference types="./src/types" />
	/**
	 * A data texture.
	 */
	export default class DataTexture {
	    gl: WebGLRenderingContext;
	    texture: WebGLTexture;
	    format: number;
	    width: number;
	    height: number;
	    constructor(gl: WebGLRenderingContext, channels?: number, width?: number, height?: number);
	    reserve(width: number, height: number): void;
	    bindAndUpdate(buffer: TypedArray, width?: number, height?: number): void;
	    bind(unit: number): void;
	}

}
declare module 'viewer/handlers/m3/node' {
	import { quat } from 'gl-matrix';
	import { SkeletalNode } from 'viewer/node';
	/**
	 * An M3 node.
	 */
	export default class M3Node extends SkeletalNode {
	    convertBasis(rotation: quat): void;
	}

}
declare module 'viewer/handlers/m3/stg' {
	import M3ParserStg from 'parsers/m3/stg';
	import { M3ParserAnimationReference } from 'parsers/m3/animationreference';
	import M3ModelInstance from 'viewer/handlers/m3/modelinstance';
	import M3Sts from 'viewer/handlers/m3/sts';
	import M3Stc from 'viewer/handlers/m3/stc';
	/**
	 * M3 animation data getter.
	 */
	export default class M3Stg {
	    name: string;
	    stcIndices: Uint32Array;
	    sts: M3Sts[];
	    stc: M3Stc[];
	    constructor(stg: M3ParserStg, sts: M3Sts[], stc: M3Stc[]);
	    getValueUnsafe(animRef: M3ParserAnimationReference, instance: M3ModelInstance): any;
	}

}
declare module 'viewer/handlers/m3/skeleton' {
	/// <reference types="./src/types" />
	import { M3ParserAnimationReference } from 'parsers/m3/animationreference';
	import Node from 'viewer/handlers/m3/node';
	import M3ModelInstance from 'viewer/handlers/m3/modelinstance';
	import M3Bone from 'viewer/handlers/m3/bone';
	import M3Sts from 'viewer/handlers/m3/sts';
	import M3Stc from 'viewer/handlers/m3/stc';
	import M3Stg from 'viewer/handlers/m3/stg';
	/**
	 * M3 skeleton.
	 */
	export default class M3Skeleton {
	    nodes: Node[];
	    worldMatrices: Float32Array;
	    instance: M3ModelInstance;
	    modelNodes: M3Bone[];
	    initialReference: Float32Array[];
	    sts: M3Sts[];
	    stc: M3Stc[];
	    stg: M3Stg[];
	    boneLookup: any;
	    constructor(instance: M3ModelInstance);
	    update(dt: number): void;
	    getValueUnsafe(animRef: M3ParserAnimationReference, instance: M3ModelInstance): any;
	    getValue(animRef: M3ParserAnimationReference, instance: M3ModelInstance): any;
	    getValue2(out: TypedArray, animRef: M3ParserAnimationReference, instance: M3ModelInstance): TypedArray;
	    getValue3(out: TypedArray, animRef: M3ParserAnimationReference, instance: M3ModelInstance): TypedArray;
	    getValue4(out: TypedArray, animRef: M3ParserAnimationReference, instance: M3ModelInstance): TypedArray;
	}

}
declare module 'viewer/handlers/m3/modelinstance' {
	import DataTexture from 'viewer/gl/datatexture';
	import ModelInstance from 'viewer/modelinstance';
	import M3Skeleton from 'viewer/handlers/m3/skeleton';
	/**
	 * An M3 model instance.
	 */
	export default class M3ModelInstance extends ModelInstance {
	    skeleton: M3Skeleton | null;
	    teamColor: number;
	    vertexColor: Float32Array;
	    sequence: number;
	    frame: number;
	    sequenceLoopMode: number;
	    sequenceEnded: boolean;
	    forced: boolean;
	    boneTexture: DataTexture | null;
	    load(): void;
	    updateSkeletonAndBoneTexture(dt: number): void;
	    renderOpaque(): void;
	    updateAnimations(dt: number): void;
	    setTeamColor(id: number): this;
	    setVertexColor(color: Uint8Array): this;
	    setSequence(id: number): this;
	    setSequenceLoopMode(mode: number): this;
	    getAttachment(id: number): import("./node").default | undefined;
	}

}
declare module 'viewer/handlers/m3/sd' {
	/// <reference types="./src/types" />
	import M3ParserSd from 'parsers/m3/sd'; class M3Sd {
	    keys: Int32Array;
	    values: TypedArray[] | number[];
	    biggestKey: number;
	    constructor(sd: M3ParserSd);
	}
	/**
	 * A sequence data container.
	 */
	export default class M3SdContainer {
	    sd: M3Sd[];
	    constructor(sd: M3ParserSd[]);
	    getValueUnsafe(index: number, animationReference: any, frame: number, runsConcurrent: number): any;
	}
	export {};

}
declare module 'viewer/handlers/m3/stc' {
	import M3ParserStc from 'parsers/m3/stc';
	import { M3ParserAnimationReference } from 'parsers/m3/animationreference';
	import M3ModelInstance from 'viewer/handlers/m3/modelinstance';
	import M3SdContainer from 'viewer/handlers/m3/sd';
	/**
	 * M3 sequence data.
	 */
	export default class M3Stc {
	    name: string;
	    runsConcurrent: number;
	    priority: number;
	    stsIndex: number;
	    animRefs: any[];
	    sd: M3SdContainer[];
	    constructor(stc: M3ParserStc);
	    getValueUnsafe(animRef: M3ParserAnimationReference, instance: M3ModelInstance): any;
	}

}
declare module 'viewer/handlers/m3/attachment' {
	import AttachmentPoint from 'parsers/m3/attachmentpoint';
	/**
	 * An M3 attachment.
	 */
	export default class M3Attachment {
	    name: string;
	    bone: number;
	    constructor(attachment: AttachmentPoint);
	}

}
declare module 'viewer/handlers/m3/camera' {
	import Camera from 'parsers/m3/camera';
	/**
	 * An M3 camera.
	 */
	export default class M3Camera {
	    bone: number;
	    name: string;
	    constructor(camera: Camera);
	}

}
declare module 'viewer/handlers/m3/region' {
	import M3ParserRegion from 'parsers/m3/region';
	import ShaderProgram from 'viewer/gl/program';
	import M3Model from 'viewer/handlers/m3/model';
	/**
	 * An M3 region.
	 */
	export default class M3Region {
	    gl: WebGLRenderingContext;
	    firstBoneLookupIndex: number;
	    boneWeightPairsCount: number;
	    offset: number;
	    verticesCount: number;
	    elements: number;
	    constructor(model: M3Model, region: M3ParserRegion, triangles: Uint16Array, elementArray: Uint16Array, offset: number);
	    render(shader: ShaderProgram): void;
	}

}
declare module 'viewer/handlers/m3/batch' {
	import M3Region from 'viewer/handlers/m3/region';
	import M3StandardMaterial from 'viewer/handlers/m3/standardmaterial';
	/**
	 * An M3 batch.
	 */
	export default class M3Batch {
	    region: M3Region;
	    material: M3StandardMaterial;
	    constructor(region: M3Region, material: M3StandardMaterial);
	}

}
declare module 'viewer/handlers/m3/model' {
	import Parser from 'parsers/m3/model';
	import M3ParserModel from 'parsers/m3/modelheader';
	import M3ParserDivision from 'parsers/m3/division';
	import Model from 'viewer/model';
	import M3Bone from 'viewer/handlers/m3/bone';
	import M3Sequence from 'viewer/handlers/m3/sequence';
	import M3Sts from 'viewer/handlers/m3/sts';
	import M3Stc from 'viewer/handlers/m3/stc';
	import M3Stg from 'viewer/handlers/m3/stg';
	import M3AttachmentPoint from 'viewer/handlers/m3/attachment';
	import M3Camera from 'viewer/handlers/m3/camera';
	import M3Region from 'viewer/handlers/m3/region';
	import M3ModelInstance from 'viewer/handlers/m3/modelinstance';
	import M3Batch from 'viewer/handlers/m3/batch';
	/**
	 * An M3 model.
	 */
	export default class M3Model extends Model {
	    name: string;
	    batches: M3Batch[];
	    materials: any[][];
	    materialMaps: any[];
	    bones: M3Bone[];
	    boneLookup: Uint16Array | null;
	    sequences: M3Sequence[];
	    sts: M3Sts[];
	    stc: M3Stc[];
	    stg: M3Stg[];
	    attachments: M3AttachmentPoint[];
	    cameras: M3Camera[];
	    regions: M3Region[];
	    initialReference: Float32Array[];
	    elementBuffer: WebGLBuffer | null;
	    arrayBuffer: WebGLBuffer | null;
	    vertexSize: number;
	    uvSetCount: number;
	    createInstance(type: number): M3ModelInstance;
	    load(bufferOrParser: ArrayBuffer | Parser): void;
	    setupGeometry(parser: M3ParserModel, div: M3ParserDivision): void;
	    mapMaterial(index: number): any;
	    addGlobalAnims(): void;
	}

}
declare module 'viewer/handlers/shaders/bonetexture.glsl' {
	 const shader = "\nuniform sampler2D u_boneMap;\nuniform float u_vectorSize;\nuniform float u_rowSize;\n\nmat4 fetchMatrix(float column, float row) {\n  column *= u_vectorSize * 4.0;\n  row *= u_rowSize;\n  // Add in half a texel, to sample in the middle of the texel.\n  // Otherwise, since the sample is directly on the boundary, floating point errors can cause the sample to get the wrong pixel.\n  // This is most noticeable with NPOT textures, which the bone maps are.\n  column += 0.5 * u_vectorSize;\n  row += 0.5 * u_rowSize;\n\n  return mat4(texture2D(u_boneMap, vec2(column, row)),\n              texture2D(u_boneMap, vec2(column + u_vectorSize, row)),\n              texture2D(u_boneMap, vec2(column + u_vectorSize * 2.0, row)),\n              texture2D(u_boneMap, vec2(column + u_vectorSize * 3.0, row)));\n}\n";
	export default shader;

}
declare module 'viewer/handlers/m3/shaders/standard.vert' {
	 const shader: string;
	export default shader;

}
declare module 'viewer/handlers/m3/shaders/layers.glsl' {
	 const shader = "\nvarying vec3 v_normal;\nvarying vec4 v_uv[2];\nvarying vec3 v_lightDir;\n// varying vec3 v_eyeVec;\nvarying vec3 v_halfVec;\nvarying vec3 v_teamColor;\nvarying vec4 v_vertexColor;\n\nstruct LayerSettings {\n  bool enabled;\n  float op;\n  float channels;\n  float teamColorMode;\n  // vec3 multAddAlpha;\n  // bool useAlphaFactor;\n  bool invert;\n  // bool multColor;\n  // bool addColor;\n  bool clampResult;\n  // bool useConstantColor;\n  // vec4 constantColor;\n  // float uvSource;\n  float uvCoordinate;\n  // float fresnelMode;\n  // float fresnelTransformMode;\n  // mat4 fresnelTransform;\n  // bool fresnelClamp;\n  // vec3 fresnelExponentBiasScale;\n};\n\nuniform float u_specularity;\nuniform float u_specMult;\nuniform float u_emisMult;\nuniform vec4 u_lightAmbient;\n\nuniform LayerSettings u_diffuseLayerSettings;\nuniform sampler2D u_diffuseMap;\nuniform LayerSettings u_decalLayerSettings;\nuniform sampler2D u_decalMap;\nuniform LayerSettings u_specularLayerSettings;\nuniform sampler2D u_specularMap;\nuniform LayerSettings u_glossLayerSettings;\nuniform sampler2D u_glossMap;\nuniform LayerSettings u_emissiveLayerSettings;\nuniform sampler2D u_emissiveMap;\nuniform LayerSettings u_emissive2LayerSettings;\nuniform sampler2D u_emissive2Map;\nuniform LayerSettings u_evioLayerSettings;\nuniform sampler2D u_evioMap;\nuniform LayerSettings u_evioMaskLayerSettings;\nuniform sampler2D u_evioMaskMap;\nuniform LayerSettings u_alphaLayerSettings;\nuniform sampler2D u_alphaMap;\nuniform LayerSettings u_alphaMaskLayerSettings;\nuniform sampler2D u_alphaMaskMap;\nuniform LayerSettings u_normalLayerSettings;\nuniform sampler2D u_normalMap;\nuniform LayerSettings u_heightLayerSettings;\nuniform sampler2D u_heightMap;\nuniform LayerSettings u_lightMapLayerSettings;\nuniform sampler2D u_lightMapMap;\nuniform LayerSettings u_aoLayerSettings;\nuniform sampler2D u_aoMap;\n\n#define SPECULAR_RGB 0.0\n#define SPECULAR_A_ONLY 1.0\n\n#define FRESNELMODE_NONE 0.0\n#define FRESNELMODE_STANDARD 1.0\n#define FRESNELMODE_INVERTED 2.0\n\n#define FRESNELTRANSFORM_NONE 0.0\n#define FRESNELTRANSFORM_SIMPLE 1.0\n#define FRESNELTRANSFORM_NORMALIZED 2.0\n\n#define UVMAP_EXPLICITUV0 0.0\n#define UVMAP_EXPLICITUV1 1.0\n#define UVMAP_REFLECT_CUBICENVIO 2.0\n#define UVMAP_REFLECT_SPHERICALENVIO 3.0\n#define UVMAP_PLANARLOCALZ 4.0\n#define UVMAP_PLANARWORLDZ 5.0\n#define UVMAP_PARTICLE_FLIPBOOK 6.0\n#define UVMAP_CUBICENVIO 7.0\n#define UVMAP_SPHERICALENVIO 8.0\n#define UVMAP_EXPLICITUV2 9.0\n#define UVMAP_EXPLICITUV3 10.0\n#define UVMAP_PLANARLOCALX 11.0\n#define UVMAP_PLANARLOCALY 12.0\n#define UVMAP_PLANARWORLDX 13.0\n#define UVMAP_PLANARWORLDY 14.0\n#define UVMAP_SCREENSPACE 15.0\n#define UVMAP_TRIPLANAR_LOCAL 16.0\n#define UVMAP_TRIPLANAR_WORLD 17.0\n#define UVMAP_TRIPLANAR_WORLD_LOCAL_Z 18.0\n\n#define CHANNELSELECT_RGB 0.0\n#define CHANNELSELECT_RGBA 1.0\n#define CHANNELSELECT_A 2.0\n#define CHANNELSELECT_R 3.0\n#define CHANNELSELECT_G 4.0\n#define CHANNELSELECT_B 5.0\n\n#define TEAMCOLOR_NONE 0.0\n#define TEAMCOLOR_DIFFUSE 1.0\n#define TEAMCOLOR_EMISSIVE 2.0\n\n#define LAYEROP_MOD 0.0\n#define LAYEROP_MOD2X 1.0\n#define LAYEROP_ADD 2.0\n#define LAYEROP_LERP 3.0\n#define LAYEROP_TEAMCOLOR_EMISSIVE_ADD 4.0\n#define LAYEROP_TEAMCOLOR_DIFFUSE_ADD 5.0\n#define LAYEROP_ADD_NO_ALPHA 6.0\n\n// float calculateFresnelTerm(vec3 normal, vec3 eyeToVertex, float exponent, mat4 fresnelTransform, float fresnelTransformMode, bool fresnelClamp) {\n//   vec3 fresnelDir = eyeToVertex;\n//   float result;\n\n//   if (fresnelTransformMode != FRESNELTRANSFORM_NONE) {\n//     fresnelDir = (fresnelTransform * vec4(fresnelDir, 1.0)).xyz;\n\n//     if (fresnelTransformMode == FRESNELTRANSFORM_NORMALIZED) {\n//       fresnelDir = normalize(fresnelDir);\n//     }\n//   }\n\n//   if (fresnelClamp) {\n//     result = 1.0 - clamp(-dot(normal, fresnelDir), 0.0, 1.0);\n//   } else {\n//     result = 1.0 - abs(dot(normal, fresnelDir));\n//   }\n\n//   result = max(result, 0.0000001);\n\n//   return pow(result, exponent);\n// }\n\nvec3 combineLayerColor(vec4 color, vec3 result, LayerSettings layerSettings) {\n  if (layerSettings.op == LAYEROP_MOD) {\n    result *= color.rgb;\n  } else if (layerSettings.op == LAYEROP_MOD2X) {\n    result *= color.rgb * 2.0;\n  } else if (layerSettings.op == LAYEROP_ADD) {\n    result += color.rgb * color.a;\n  } else if (layerSettings.op == LAYEROP_ADD_NO_ALPHA) {\n    result += color.rgb;\n  } else if (layerSettings.op == LAYEROP_LERP) {\n    result = mix(result, color.rgb, color.a);\n  } else if (layerSettings.op == LAYEROP_TEAMCOLOR_EMISSIVE_ADD) {\n    result += color.a * v_teamColor;\n  } else if (layerSettings.op == LAYEROP_TEAMCOLOR_DIFFUSE_ADD) {\n    result += color.a * v_teamColor;\n  }\n\n  return result;\n}\n\nvec4 chooseChannel(float channel, vec4 texel) {\n  if (channel == CHANNELSELECT_R) {\n    texel = texel.rrrr;\n  } else if (channel == CHANNELSELECT_G) {\n    texel = texel.gggg;\n  } else if (channel == CHANNELSELECT_B) {\n    texel = texel.bbbb;\n  } else if (channel == CHANNELSELECT_A) {\n    texel = texel.aaaa;\n  } else if (channel == CHANNELSELECT_RGB) {\n    texel.a = 1.0;\n  }\n\n  return texel;\n}\n\nvec2 getUV(LayerSettings layerSettings) {\n  if (layerSettings.uvCoordinate == 1.0) {\n    return v_uv[0].zw;\n  } else if (layerSettings.uvCoordinate == 2.0) {\n    return v_uv[1].xy;\n  } else if (layerSettings.uvCoordinate == 3.0) {\n    return v_uv[1].zw;\n  }\n\n  return v_uv[0].xy;\n}\n\nvec4 sampleLayer(sampler2D layer, LayerSettings layerSettings) {\n  // if (layerSettings.useConstantColor) {\n  //   return layerSettings.constantColor;\n  // }\n\n  return texture2D(layer, getUV(layerSettings));\n}\n\nvec4 computeLayerColor(sampler2D layer, LayerSettings layerSettings) {\n  vec4 color = sampleLayer(layer, layerSettings);\n\n  // if (layerSettings.useMask) {\n  //   result *= mask;\n  // }\n\n  vec4 result = chooseChannel(layerSettings.channels, color);\n\n  // if (layerSettings.useAlphaFactor) {\n  //   result.a *= layerSettings.multiplyAddAlpha.z;\n  // }\n\n  if (layerSettings.teamColorMode == TEAMCOLOR_DIFFUSE) {\n    result = vec4(mix(v_teamColor, result.rgb, color.a), 1.0);\n  } else if (layerSettings.teamColorMode == TEAMCOLOR_EMISSIVE) {\n    result = vec4(mix(v_teamColor, result.rgb, color.a), 1.0);\n  }\n\n  if (layerSettings.invert) {\n    result = vec4(1.0) - result;\n  }\n\n  // if (layerSettings.multiplyEnable) {\n  //   result *= layerSettings.multiplyAddAlpha.x;\n  // }\n\n  // if (layerSettings.addEnable) {\n  //   result += layerSettings.multiplyAddAlpha.y;\n  // }\n\n  if (layerSettings.clampResult) {\n    result = clamp(result, 0.0, 1.0);\n  }\n\n  // if (layerSettings.fresnelMode != FRESNELMODE_NONE) {\n  //   float fresnelTerm = calculateFresnelTerm(v_normal, v_eyeVec, layerSettings.fresnelExponentBiasScale.x, layerSettings.fresnelTransform, layerSettings.fresnelTransformMode, layerSettings.fresnelClamp);\n    \n  //   if (layerSettings.fresnelMode == FRESNELMODE_INVERTED) {\n  //     fresnelTerm = 1.0 - fresnelTerm;\n  //   }\n    \n  //   fresnelTerm = clamp(fresnelTerm * layerSettings.fresnelExponentBiasScale.z + layerSettings.fresnelExponentBiasScale.y, 0.0, 1.0);\n    \n  //   result *= fresnelTerm;\n  // }\n\n  return result;\n}\n\nvec3 decodeNormal(sampler2D map) {\n  vec4 texel = texture2D(map, v_uv[0].xy);\n  vec3 normal;\n\n  normal.xy = 2.0 * texel.wy - 1.0;\n  normal.z = sqrt(max(0.0, 1.0 - dot(normal.xy, normal.xy)));\n\n  return normal;\n}\n\nvec4 computeSpecular(sampler2D specularMap, LayerSettings layerSettings, float specularity, float specMult, vec3 normal) {\n  vec4 color;\n\n  if (layerSettings.enabled) {\n    color = computeLayerColor(specularMap, layerSettings);\n  } else {\n    color = vec4(0);\n  }\n\n  float factor = pow(max(-dot(v_halfVec, normal), 0.0), specularity) * specMult;\n\n  return color * factor;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/m3/shaders/standard.frag' {
	 const shader: string;
	export default shader;

}
declare module 'viewer/handlers/m3/handler' {
	import ModelViewer from 'viewer/viewer';
	import Model from 'viewer/handlers/m3/model'; const _default: {
	    extensions: string[][];
	    load(viewer: ModelViewer): boolean;
	    resource: typeof Model;
	};
	export default _default;

}
declare module 'viewer/handlers/mdx/sd' {
	import { vec3, quat } from 'gl-matrix';
	import { Animation } from 'parsers/mdlx/animations';
	import MdxModel from 'viewer/handlers/mdx/model'; class SdSequence {
	    sd: Sd;
	    start: number;
	    end: number;
	    frames: number[];
	    values: (Uint32Array | Float32Array)[];
	    inTans: (Uint32Array | Float32Array)[];
	    outTans: (Uint32Array | Float32Array)[];
	    constant: boolean;
	    constructor(sd: Sd, start: number, end: number, animation: Animation, isGlobal: boolean);
	    getValue(out: Uint32Array | Float32Array, frame: number): number;
	}
	/**
	 * Animated data.
	 */
	export abstract class Sd {
	    defval: Float32Array | Uint32Array;
	    model: MdxModel;
	    name: string;
	    globalSequence: SdSequence | null;
	    sequences: SdSequence[];
	    interpolationType: number;
	    abstract copy(out: Uint32Array | Float32Array | vec3 | quat, value: Uint32Array | Float32Array | vec3 | quat): void;
	    abstract interpolate(out: Uint32Array | Float32Array | vec3 | quat, values: (Uint32Array | Float32Array | vec3 | quat)[], inTans: (Uint32Array | Float32Array | vec3 | quat)[], outTans: (Uint32Array | Float32Array | vec3 | quat)[], start: number, end: number, t: number): void;
	    constructor(model: MdxModel, animation: Animation);
	    getValue(out: Uint32Array | Float32Array, sequence: number, frame: number, counter: number): number;
	    isVariant(sequence: number): boolean;
	}
	/**
	 * A scalar animation.
	 */
	export class ScalarSd extends Sd {
	    copy(out: Uint32Array | Float32Array, value: Uint32Array | Float32Array): void;
	    interpolate(out: Uint32Array | Float32Array, values: (Uint32Array | Float32Array)[], inTans: (Uint32Array | Float32Array)[], outTans: (Uint32Array | Float32Array)[], start: number, end: number, t: number): void;
	}
	/**
	 * A vector animation.
	 */
	export class VectorSd extends Sd {
	    copy(out: vec3, value: vec3): void;
	    interpolate(out: vec3, values: vec3[], inTans: vec3[], outTans: vec3[], start: number, end: number, t: number): void;
	}
	/**
	 * A quaternion animation.
	 */
	export class QuatSd extends Sd {
	    copy(out: quat, value: quat): void;
	    interpolate(out: quat, values: quat[], inTans: quat[], outTans: quat[], start: number, end: number, t: number): void;
	}
	export function createTypedSd(model: MdxModel, animation: Animation): ScalarSd | VectorSd | QuatSd;
	export {};

}
declare module 'viewer/handlers/mdx/animatedobject' {
	import MdlxAnimatedObject from 'parsers/mdlx/animatedobject';
	import MdxModel from 'viewer/handlers/mdx/model';
	import { Sd } from 'viewer/handlers/mdx/sd';
	/**
	 * An animation object.
	 */
	export default class AnimatedObject {
	    model: MdxModel;
	    animations: Map<string, Sd>;
	    variants: {
	        [key: string]: Uint8Array;
	    };
	    constructor(model: MdxModel, object: MdlxAnimatedObject);
	    getScalarValue(out: Uint32Array | Float32Array, name: string, sequence: number, frame: number, counter: number, defaultValue: number): number;
	    getVectorValue(out: Float32Array, name: string, sequence: number, frame: number, counter: number, defaultValue: Float32Array): number;
	    getQuatValue(out: Float32Array, name: string, sequence: number, frame: number, counter: number, defaultValue: Float32Array): number;
	    addVariants(name: string, variantName: string): void;
	    addVariantIntersection(names: string[], variantName: string): void;
	}

}
declare module 'viewer/handlers/mdx/textureanimation' {
	import MdlxTextureAnimation from 'parsers/mdlx/textureanimation';
	import AnimatedObject from 'viewer/handlers/mdx/animatedobject';
	import MdxModel from 'viewer/handlers/mdx/model';
	/**
	 * An MDX texture animation.
	 */
	export default class TextureAnimation extends AnimatedObject {
	    constructor(model: MdxModel, textureAnimation: MdlxTextureAnimation);
	    getTranslation(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getRotation(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getScale(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/filtermode' {
	export function layerFilterMode(filterMode: number, gl: WebGLRenderingContext): number[];
	export function emitterFilterMode(filterMode: number, gl: WebGLRenderingContext): number[];

}
declare module 'viewer/handlers/mdx/layer' {
	import MdlxLayer from 'parsers/mdlx/layer';
	import MdxModel from 'viewer/handlers/mdx/model';
	import AnimatedObject from 'viewer/handlers/mdx/animatedobject';
	import TextureAnimation from 'viewer/handlers/mdx/textureanimation';
	import ShaderProgram from 'viewer/gl/program';
	/**
	 * An MDX layer.
	 */
	export default class Layer extends AnimatedObject {
	    index: number;
	    priorityPlane: number;
	    filterMode: number;
	    textureId: number;
	    coordId: number;
	    alpha: number;
	    unshaded: number;
	    sphereEnvironmentMap: number;
	    twoSided: number;
	    unfogged: number;
	    noDepthTest: number;
	    noDepthSet: number;
	    depthMaskValue: boolean;
	    blendSrc: number;
	    blendDst: number;
	    blended: boolean;
	    textureAnimation: TextureAnimation | null;
	    constructor(model: MdxModel, layer: MdlxLayer, layerId: number, priorityPlane: number);
	    bind(shader: ShaderProgram): void;
	    getAlpha(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getTextureId(out: Uint32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/material' {
	import MdxModel from 'viewer/handlers/mdx/model';
	import Layer from 'viewer/handlers/mdx/layer';
	/**
	 * An MDX material.
	 */
	export default class Material {
	    model: MdxModel;
	    shader: string;
	    layers: Layer[];
	    constructor(model: MdxModel, shader: string, layers: Layer[]);
	}

}
declare module 'viewer/handlers/mdx/geosetanimation' {
	import { vec3 } from 'gl-matrix';
	import MdlxGeosetAnimation from 'parsers/mdlx/geosetanimation';
	import AnimatedObject from 'viewer/handlers/mdx/animatedobject';
	import MdxModel from 'viewer/handlers/mdx/model';
	/**
	 * A geoset animation.
	 */
	export default class GeosetAnimation extends AnimatedObject {
	    alpha: number;
	    color: vec3;
	    geosetId: number;
	    constructor(model: MdxModel, geosetAnimation: MdlxGeosetAnimation);
	    getAlpha(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getColor(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/replaceableids' {
	 const _default: {
	    1: string;
	    2: string;
	    11: string;
	    21: string;
	    31: string;
	    32: string;
	    33: string;
	    34: string;
	    35: string;
	    36: string;
	    37: string;
	};
	export default _default;

}
declare module 'viewer/handlers/mdx/genericobject' {
	import { vec3, quat } from 'gl-matrix';
	import MdlxGenericObject from 'parsers/mdlx/genericobject';
	import AnimatedObject from 'viewer/handlers/mdx/animatedobject';
	import MdxModel from 'viewer/handlers/mdx/model';
	/**
	 * An MDX generic object.
	 */
	export default class GenericObject extends AnimatedObject {
	    index: number;
	    name: string;
	    objectId: number;
	    parentId: number;
	    pivot: vec3;
	    dontInheritTranslation: number;
	    dontInheritRotation: number;
	    dontInheritScaling: number;
	    billboarded: number;
	    billboardedX: number;
	    billboardedY: number;
	    billboardedZ: number;
	    cameraAnchored: number;
	    emitterUsesMdlOrUnshaded: number;
	    emitterUsesTgaOrSortPrimitivesFarZ: number;
	    lineEmitter: number;
	    unfogged: number;
	    modelSpace: number;
	    xYQuad: number;
	    anyBillboarding: boolean;
	    constructor(model: MdxModel, object: MdlxGenericObject, index: number);
	    /**
	     * Give a consistent visibility getter for all generic objects.
	     *
	     * Many of the generic objects have animated visibilities, and will override this.
	     */
	    getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getTranslation(out: vec3, sequence: number, frame: number, counter: number): number;
	    getRotation(out: quat, sequence: number, frame: number, counter: number): number;
	    getScale(out: vec3, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/bone' {
	import MdlxBone from 'parsers/mdlx/bone';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	import GeosetAnimation from 'viewer/handlers/mdx/geosetanimation';
	/**
	 * An MDX bone.
	 */
	export default class Bone extends GenericObject {
	    geosetAnimation: GeosetAnimation;
	    constructor(model: MdxModel, bone: MdlxBone, index: number);
	    getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/light' {
	import MdlxLight from 'parsers/mdlx/light';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	/**
	 * An MDX light.
	 */
	export default class Light extends GenericObject {
	    type: number;
	    attenuation: Float32Array;
	    color: Float32Array;
	    intensity: number;
	    ambientColor: Float32Array;
	    ambientIntensity: number;
	    constructor(model: MdxModel, light: MdlxLight, index: number);
	    getAttenuationStart(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getAttenuationEnd(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getIntensity(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getColor(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getAmbientIntensity(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getAmbientColor(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/helper' {
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	/**
	 * An MDX helper.
	 */
	export default class Helper extends GenericObject {
	}

}
declare module 'viewer/handlers/mdx/attachment' {
	import MdlxAttachment from 'parsers/mdlx/attachment';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	import MdxModel from 'viewer/handlers/mdx/model';
	/**
	 * An MDX attachment.
	 */
	export default class Attachment extends GenericObject {
	    path: string;
	    attachmentId: number;
	    internalModel: MdxModel | null;
	    constructor(model: MdxModel, attachment: MdlxAttachment, index: number);
	    getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/particleemitterobject' {
	import ParticleEmitter from 'parsers/mdlx/particleemitter';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	/**
	 * An MDX particle emitter.
	 */
	export default class ParticleEmitterObject extends GenericObject {
	    internalModel: MdxModel;
	    speed: number;
	    latitude: number;
	    longitude: number;
	    lifeSpan: number;
	    gravity: number;
	    emissionRate: number;
	    /**
	     * No need to create instances of the internal model if it didn't load.
	     *
	     * Such instances won't actually render, and who knows if the model will ever load?
	     */
	    ok: boolean;
	    constructor(model: MdxModel, emitter: ParticleEmitter, index: number);
	    getSpeed(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getLatitude(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getLongitude(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getLifeSpan(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getGravity(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getEmissionRate(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/ribbonemitterobject' {
	import RibbonEmitter from 'parsers/mdlx/ribbonemitter';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	import Layer from 'viewer/handlers/mdx/layer';
	/**
	 * An MDX ribbon emitter.
	 */
	export default class RibbonEmitterObject extends GenericObject {
	    geometryEmitterType: number;
	    layer: Layer;
	    heightAbove: number;
	    heightBelow: number;
	    alpha: number;
	    color: Float32Array;
	    lifeSpan: number;
	    textureSlot: number;
	    emissionRate: number;
	    gravity: number;
	    columns: number;
	    rows: number;
	    /**
	     * Even if the internal texture isn't loaded, it's fine to run emitters based on this emitter object.
	     *
	     * The ribbons will simply be black.
	     */
	    ok: boolean;
	    constructor(model: MdxModel, emitter: RibbonEmitter, index: number);
	    getHeightBelow(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getHeightAbove(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getTextureSlot(out: Uint32Array, sequence: number, frame: number, counter: number): number;
	    getColor(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getAlpha(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'common/audio' {
	/**
	 * A context-less decodeAudioData().
	 */
	export function decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer> | undefined;

}
declare module 'utils/mappeddata' {
	/**
	 * A MappedData row.
	 */
	export type MappedDataRow = {
	    [key: string]: string | number | boolean;
	};
	/**
	 * A structure that holds mapped data from INI and SLK files.
	 *
	 * In the case of SLK files, the first row is expected to hold the names of the columns.
	 */
	export class MappedData {
	    map: {
	        [key: string]: MappedDataRow;
	    };
	    constructor(buffer?: string);
	    /**
	     * Load data from an SLK file or an INI file.
	     *
	     * Note that this may override previous properties!
	     */
	    load(buffer: string): void;
	    getRow(key: string): MappedDataRow;
	    getProperty(key: string, name: string): string | number | boolean;
	    setRow(key: string, values: MappedDataRow): void;
	}

}
declare module 'viewer/handlers/mdx/node' {
	import { quat } from 'gl-matrix';
	import { SkeletalNode } from 'viewer/node';
	/**
	 * An MDX node.
	 */
	export default class MdxNode extends SkeletalNode {
	    convertBasis(rotation: quat): void;
	}

}
declare module 'viewer/handlers/mdx/attachmentinstance' {
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	import Attachment from 'viewer/handlers/mdx/attachment';
	/**
	 * An attachment instance.
	 */
	export default class AttachmentInstance {
	    instance: MdxComplexInstance;
	    attachment: Attachment;
	    internalInstance: MdxComplexInstance;
	    constructor(instance: MdxComplexInstance, attachment: Attachment);
	    update(): void;
	}

}
declare module 'viewer/handlers/mdx/emitter' {
	import Emitter from 'viewer/emitter';
	import ParticleEmitterObject from 'viewer/handlers/mdx/particleemitterobject';
	import ParticleEmitter2Object from 'viewer/handlers/mdx/particleemitter2object';
	import RibbonEmitterObject from 'viewer/handlers/mdx/ribbonemitterobject';
	import EventObjectEmitterObject from 'viewer/handlers/mdx/eventobjectemitterobject';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	/**
	 * The base of all MDX emitters.
	 */
	export default abstract class MdxEmitter extends Emitter {
	    emitterObject: ParticleEmitterObject | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject;
	    constructor(instance: MdxComplexInstance, emitterObject: ParticleEmitterObject | ParticleEmitter2Object | RibbonEmitterObject | EventObjectEmitterObject);
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/particle' {
	import { vec3 } from 'gl-matrix';
	import EmittedObject from 'viewer/emittedobject';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	import ParticleEmitter from 'viewer/handlers/mdx/particleemitter';
	/**
	 * A spawned model particle.
	 */
	export default class Particle extends EmittedObject {
	    internalInstance: MdxComplexInstance;
	    velocity: vec3;
	    gravity: number;
	    constructor(emitter: ParticleEmitter);
	    bind(): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/particleemitter' {
	import MdxEmitter from 'viewer/handlers/mdx/emitter';
	import Particle from 'viewer/handlers/mdx/particle';
	/**
	 * An MDX particle emitter.
	 */
	export default class ParticleEmitter extends MdxEmitter {
	    updateEmission(dt: number): void;
	    emit(): void;
	    createObject(): Particle;
	}

}
declare module 'viewer/handlers/mdx/particle2' {
	import { vec3 } from 'gl-matrix';
	import EmittedObject from 'viewer/emittedobject';
	/**
	 * A type 2 particle.
	 */
	export default class Particle2 extends EmittedObject {
	    tail: number;
	    gravity: number;
	    location: vec3;
	    velocity: vec3;
	    scale: vec3;
	    bind(tail: number): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/particleemitter2' {
	import ParticleEmitter2Object from 'viewer/handlers/mdx/particleemitter2object';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	import MdxNode from 'viewer/handlers/mdx/node';
	import MdxEmitter from 'viewer/handlers/mdx/emitter';
	import Particle2 from 'viewer/handlers/mdx/particle2';
	/**
	 * An MDX particle emitter type 2.
	 */
	export default class ParticleEmitter2 extends MdxEmitter {
	    node: MdxNode;
	    lastEmissionKey: number;
	    constructor(instance: MdxComplexInstance, emitterObject: ParticleEmitter2Object);
	    updateEmission(dt: number): void;
	    emit(): void;
	    createObject(): Particle2;
	}

}
declare module 'viewer/handlers/mdx/ribbon' {
	import EmittedObject from 'viewer/emittedobject';
	/**
	 * A ribbon.
	 */
	export default class Ribbon extends EmittedObject {
	    vertices: Float32Array;
	    color: Uint8Array;
	    slot: number;
	    prev: Ribbon | null;
	    next: Ribbon | null;
	    bind(): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/ribbonemitter' {
	import MdxEmitter from 'viewer/handlers/mdx/emitter';
	import Ribbon from 'viewer/handlers/mdx/ribbon';
	/**
	 * A ribbon emitter.
	 */
	export default class RibbonEmitter extends MdxEmitter {
	    first: Ribbon | null;
	    last: Ribbon | null;
	    updateEmission(dt: number): void;
	    emit(): void;
	    kill(object: Ribbon): void;
	    createObject(): Ribbon;
	}

}
declare module 'viewer/handlers/mdx/eventobjectemitter' {
	import MdxEmitter from 'viewer/handlers/mdx/emitter';
	/**
	 * The abstract base MDX event object emitter.
	 */
	export default abstract class EventObjectEmitter extends MdxEmitter {
	    lastValue: number;
	    updateEmission(dt: number): void;
	    emit(): void;
	}

}
declare module 'viewer/handlers/mdx/eventobjectspn' {
	import EmittedObject from 'viewer/emittedobject';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	import EventObjectSpnEmitter from 'viewer/handlers/mdx/eventobjectspnemitter';
	/**
	 * An MDX spawned model object.
	 */
	export default class EventObjectSpn extends EmittedObject {
	    internalInstance: MdxComplexInstance;
	    constructor(emitter: EventObjectSpnEmitter);
	    bind(): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/eventobjectspnemitter' {
	import EventObjectEmitter from 'viewer/handlers/mdx/eventobjectemitter';
	import EventObjectSpn from 'viewer/handlers/mdx/eventobjectspn';
	/**
	 * An MDX model emitter.
	 */
	export default class EventObjectSpnEmitter extends EventObjectEmitter {
	    createObject(): EventObjectSpn;
	}

}
declare module 'viewer/handlers/mdx/eventobjectubremitter' {
	import EventObjectEmitter from 'viewer/handlers/mdx/eventobjectemitter';
	import EventObjectSplUbr from 'viewer/handlers/mdx/eventobjectsplubr';
	/**
	 * An MDX ubersplat emitter.
	 */
	export default class EventObjectUbrEmitter extends EventObjectEmitter {
	    createObject(): EventObjectSplUbr;
	}

}
declare module 'viewer/handlers/mdx/eventobjectsplubr' {
	import EmittedObject from 'viewer/emittedobject';
	/**
	 * An MDX splat or ubersplat object.
	 */
	export default class EventObjectSplUbr extends EmittedObject {
	    vertices: Float32Array;
	    bind(): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/eventobjectsplemitter' {
	import EventObjectEmitter from 'viewer/handlers/mdx/eventobjectemitter';
	/**
	 * An MDX splat emitter.
	 */
	export default class EventObjectSplEmitter extends EventObjectEmitter {
	    createObject(): any;
	}

}
declare module 'viewer/handlers/mdx/eventobjectsnd' {
	import EmittedObject from 'viewer/emittedobject';
	/**
	 * An MDX spawned sound object.
	 */
	export default class EventObjectSnd extends EmittedObject {
	    bind(): void;
	    update(dt: number): void;
	}

}
declare module 'viewer/handlers/mdx/eventobjectsndemitter' {
	import EventObjectEmitter from 'viewer/handlers/mdx/eventobjectemitter';
	import EventObjectSnd from 'viewer/handlers/mdx/eventobjectsnd';
	/**
	 * An MDX sound emitter.
	 */
	export default class EventObjectSndEmitter extends EventObjectEmitter {
	    createObject(): EventObjectSnd;
	}

}
declare module 'viewer/handlers/mdx/complexinstance' {
	import ModelInstance from 'viewer/modelinstance';
	import { SkeletalNode } from 'viewer/node';
	import AttachmentInstance from 'viewer/handlers/mdx/attachmentinstance';
	import ParticleEmitter from 'viewer/handlers/mdx/particleemitter';
	import ParticleEmitter2 from 'viewer/handlers/mdx/particleemitter2';
	import RibbonEmitter from 'viewer/handlers/mdx/ribbonemitter';
	import EventObjectSpnEmitter from 'viewer/handlers/mdx/eventobjectspnemitter';
	import EventObjectSplEmitter from 'viewer/handlers/mdx/eventobjectsplemitter';
	import EventObjectUbrEmitter from 'viewer/handlers/mdx/eventobjectubremitter';
	import EventObjectSndEmitter from 'viewer/handlers/mdx/eventobjectsndemitter';
	import DataTexture from 'viewer/gl/datatexture';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	/**
	 * An MDX model instance.
	 */
	export default class MdxComplexInstance extends ModelInstance {
	    attachments: AttachmentInstance[];
	    particleEmitters: ParticleEmitter[];
	    particleEmitters2: ParticleEmitter2[];
	    ribbonEmitters: RibbonEmitter[];
	    eventObjectEmitters: (EventObjectSpnEmitter | EventObjectSplEmitter | EventObjectUbrEmitter | EventObjectSndEmitter)[];
	    nodes: SkeletalNode[];
	    sortedNodes: SkeletalNode[];
	    frame: number;
	    counter: number;
	    sequence: number;
	    sequenceLoopMode: number;
	    sequenceEnded: boolean;
	    teamColor: number;
	    vertexColor: Float32Array;
	    allowParticleSpawn: boolean;
	    forced: boolean;
	    geosetColors: Float32Array[];
	    layerAlphas: number[];
	    layerTextures: number[];
	    uvAnims: Float32Array[];
	    worldMatrices: Float32Array | null;
	    boneTexture: DataTexture | null;
	    load(): void;
	    /**
	     * Clear all of the emitted objects that belong to this instance.
	     */
	    clearEmittedObjects(): void;
	    /**
	     * Initialize a skeletal node.
	     */
	    initNode(nodes: SkeletalNode[], node: SkeletalNode, genericObject: GenericObject, object?: any): void;
	    /**
	     * Overriden to hide also attachment models.
	     */
	    hide(): void;
	    /**
	     * Updates all of this instance internal nodes and objects.
	     * Nodes that are determined to not be visible will not be updated, nor will any of their children down the hierarchy.
	     */
	    updateNodes(dt: number, forced: boolean): void;
	    /**
	     * Update the batch data.
	     */
	    updateBatches(forced: boolean): void;
	    updateBoneTexture(): void;
	    renderOpaque(): void;
	    renderTranslucent(): void;
	    updateAnimations(dt: number): void;
	    /**
	     * Set the team color of this instance.
	     */
	    setTeamColor(id: number): this;
	    /**
	     * Set the vertex color of this instance.
	     */
	    setVertexColor(color: Float32Array | number[]): this;
	    /**
	     * Set the sequence of this instance.
	     */
	    setSequence(id: number): this;
	    /**
	     * Set the seuqnece loop mode.
	     * 0 to never loop, 1 to loop based on the model, and 2 to always loop.
	     */
	    setSequenceLoopMode(mode: number): this;
	    /**
	     * Get an attachment node.
	     */
	    getAttachment(id: number): SkeletalNode | undefined;
	    /**
	     * Event emitters depend on keyframe index changes to emit, rather than only values.
	     * To work, they need to check what the last keyframe was, and only if it's a different one, do something.
	     * When changing sequences, these states need to be reset, so they can immediately emit things if needed.
	     */
	    resetEventEmitters(): void;
	}

}
declare module 'viewer/handlers/mdx/eventobjectemitterobject' {
	import EventObject from 'parsers/mdlx/eventobject';
	import GenericResource from 'viewer/genericresource';
	import Texture from 'viewer/texture';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	/**
	 * An event object.
	 */
	export default class EventObjectEmitterObject extends GenericObject {
	    geometryEmitterType: number;
	    type: string;
	    id: string;
	    tracks: Uint32Array;
	    globalSequence: number;
	    defval: Uint32Array;
	    internalModel: MdxModel | null;
	    internalTexture: Texture | null;
	    colors: Float32Array[] | null;
	    intervalTimes: Float32Array | null;
	    scale: number;
	    columns: number;
	    rows: number;
	    lifeSpan: number;
	    blendSrc: number;
	    blendDst: number;
	    intervals: Float32Array[] | null;
	    distanceCutoff: number;
	    maxDistance: number;
	    minDistance: number;
	    pitch: number;
	    pitchVariance: number;
	    volume: number;
	    decodedBuffers: AudioBuffer[];
	    /**
	     * If this is an SPL/UBR emitter object, ok will be set to true if the tables are loaded.
	     *
	     * This is because, like the other geometry emitters, it is fine to use them even if the textures don't load.
	     *
	     * The particles will simply be black.
	     */
	    ok: boolean;
	    constructor(model: MdxModel, eventObject: EventObject, index: number);
	    load(tables: GenericResource[]): void;
	    getValue(out: Uint32Array, instance: MdxComplexInstance): number;
	    getValueAtTime(out: Uint32Array, frame: number, start: number, end: number): number;
	}

}
declare module 'viewer/handlers/mdx/geometryemitterfuncs' {
	import ShaderProgram from 'viewer/gl/program';
	import ParticleEmitter2 from 'viewer/handlers/mdx/particleemitter2';
	import RibbonEmitter from 'viewer/handlers/mdx/ribbonemitter';
	import EventObjectSplEmitter from 'viewer/handlers/mdx/eventobjectsplemitter';
	import EventObjectUbrEmitter from 'viewer/handlers/mdx/eventobjectubremitter';
	export const BYTES_PER_OBJECT = 60;
	export const FLOATS_PER_OBJECT: number;
	export const BYTE_OFFSET_P0 = 0;
	export const BYTE_OFFSET_P1 = 12;
	export const BYTE_OFFSET_P2 = 24;
	export const BYTE_OFFSET_P3 = 36;
	export const BYTE_OFFSET_HEALTH = 48;
	export const BYTE_OFFSET_COLOR = 52;
	export const BYTE_OFFSET_TAIL = 56;
	export const BYTE_OFFSET_LEFT_RIGHT_TOP = 57;
	export const FLOAT_OFFSET_P0: number;
	export const FLOAT_OFFSET_P1: number;
	export const FLOAT_OFFSET_P2: number;
	export const FLOAT_OFFSET_P3: number;
	export const FLOAT_OFFSET_HEALTH: number;
	export const BYTE_OFFSET_TEAM_COLOR = 57;
	export const HEAD = 0;
	export const TAIL = 1;
	export const EMITTER_PARTICLE2 = 0;
	export const EMITTER_RIBBON = 1;
	export const EMITTER_SPLAT = 2;
	export const EMITTER_UBERSPLAT = 3;
	export function renderEmitter(emitter: ParticleEmitter2 | RibbonEmitter | EventObjectSplEmitter | EventObjectUbrEmitter, shader: ShaderProgram): void;

}
declare module 'viewer/handlers/mdx/particleemitter2object' {
	import MdlxParticleEmitter2 from 'parsers/mdlx/particleemitter2';
	import Texture from 'viewer/texture';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	/**
	 * An MDX particle emitter type 2.
	 */
	export default class ParticleEmitter2Object extends GenericObject {
	    geometryEmitterType: number;
	    width: number;
	    length: number;
	    speed: number;
	    latitude: number;
	    gravity: number;
	    emissionRate: number;
	    squirt: number;
	    lifeSpan: number;
	    variation: number;
	    tailLength: number;
	    timeMiddle: number;
	    columns: number;
	    rows: number;
	    teamColored: number;
	    internalTexture: Texture | null;
	    replaceableId: number;
	    head: boolean;
	    tail: boolean;
	    cellWidth: number;
	    cellHeight: number;
	    colors: Float32Array[];
	    scaling: Float32Array;
	    intervals: Float32Array[];
	    blendSrc: number;
	    blendDst: number;
	    priorityPlane: number;
	    /**
	     * Even if the internal texture isn't loaded, it's fine to run emitters based on this emitter object.
	     *
	     * The particles will simply be black.
	     */
	    ok: boolean;
	    constructor(model: MdxModel, emitter: MdlxParticleEmitter2, index: number);
	    getWidth(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getLength(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getSpeed(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getLatitude(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getGravity(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getEmissionRate(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getVisibility(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getVariation(out: Float32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/camera' {
	import MdlxCamera from 'parsers/mdlx/camera';
	import AnimatedObject from 'viewer/handlers/mdx/animatedobject';
	import MdxModel from 'viewer/handlers/mdx/model';
	/**
	 * An MDX camera.
	 */
	export default class Camera extends AnimatedObject {
	    name: string;
	    position: Float32Array;
	    fieldOfView: number;
	    farClippingPlane: number;
	    nearClippingPlane: number;
	    targetPosition: Float32Array;
	    constructor(model: MdxModel, camera: MdlxCamera);
	    getPositionTranslation(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getTargetTranslation(out: Float32Array, sequence: number, frame: number, counter: number): number;
	    getRotation(out: Uint32Array, sequence: number, frame: number, counter: number): number;
	}

}
declare module 'viewer/handlers/mdx/collisionshape' {
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	/**
	 * A collision shape.
	 */
	export default class CollisionShape extends GenericObject {
	}

}
declare module 'viewer/handlers/mdx/geoset' {
	import ShaderProgram from 'viewer/gl/program';
	import MdxModel from 'viewer/handlers/mdx/model';
	import GeosetAnimation from 'viewer/handlers/mdx/geosetanimation';
	/**
	 * A geoset.
	 */
	export default class Geoset {
	    model: MdxModel;
	    index: number;
	    positionOffset: number;
	    normalOffset: number;
	    uvOffset: number;
	    skinOffset: number;
	    faceOffset: number;
	    vertices: number;
	    elements: number;
	    geosetAnimation: GeosetAnimation | null;
	    constructor(model: MdxModel, index: number, positionOffset: number, normalOffset: number, uvOffset: number, skinOffset: number, faceOffset: number, vertices: number, elements: number);
	    bind(shader: ShaderProgram, coordId: number): void;
	    bindExtended(shader: ShaderProgram, coordId: number): void;
	    render(): void;
	    bindSimple(shader: ShaderProgram): void;
	    renderSimple(instances: number): void;
	    bindHd(shader: ShaderProgram, coordId: number): void;
	}

}
declare module 'viewer/handlers/mdx/batch' {
	import Geoset from 'viewer/handlers/mdx/geoset';
	import Layer from 'viewer/handlers/mdx/layer';
	import Material from 'viewer/handlers/mdx/material';
	/**
	 * An MDX batch.
	 */
	export default class Batch {
	    index: number;
	    geoset: Geoset;
	    layer: Layer;
	    material: Material | null;
	    isExtended: boolean;
	    isHd: boolean;
	    constructor(index: number, geoset: Geoset, layerOrMaterial: Layer | Material, isExtended: boolean, isHd: boolean);
	}

}
declare module 'viewer/handlers/mdx/setupgeosets' {
	import MdlxGeoset from 'parsers/mdlx/geoset';
	import MdxModel from 'viewer/handlers/mdx/model';
	export default function setupGeosets(model: MdxModel, geosets: MdlxGeoset[]): void;

}
declare module 'viewer/handlers/mdx/batchgroup' {
	import MdxModel from 'viewer/handlers/mdx/model';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	/**
	 * A group of batches that are going to be rendered together.
	 */
	export default class BatchGroup {
	    model: MdxModel;
	    isExtended: boolean;
	    isHd: boolean;
	    objects: number[];
	    constructor(model: MdxModel, isExtended: boolean, isHd: boolean);
	    render(instance: MdxComplexInstance): void;
	}

}
declare module 'viewer/handlers/mdx/emittergroup' {
	import MdxModel from 'viewer/handlers/mdx/model';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	/**
	 * A group of emitters that are going to be rendered together.
	 */
	export default class EmitterGroup {
	    model: MdxModel;
	    objects: number[];
	    constructor(model: MdxModel);
	    render(instance: MdxComplexInstance): void;
	}

}
declare module 'viewer/handlers/mdx/setupgroups' {
	import MdxModel from 'viewer/handlers/mdx/model';
	export default function setupGroups(model: MdxModel): void;

}
declare module 'viewer/handlers/mdx/setupsimplegroups' {
	import MdxModel from 'viewer/handlers/mdx/model';
	export default function setupSimpleGroups(model: MdxModel): void;

}
declare module 'viewer/handlers/mdx/renderbatch' {
	import ClientBuffer from 'viewer/gl/clientbuffer';
	import RenderBatch from 'viewer/renderbatch';
	/**
	 * A render batch.
	 */
	export default class MdxRenderBatch extends RenderBatch {
	    bindAndUpdateBuffer(buffer: ClientBuffer): void;
	    render(): void;
	}

}
declare module 'viewer/handlers/mdx/simpleinstance' {
	import TextureMapper from 'viewer/texturemapper';
	import BatchedInstance from 'viewer/batchedinstance';
	import MdxRenderBatch from 'viewer/handlers/mdx/renderbatch';
	/**
	 * A simple model instance.
	 */
	export default class MdxSimpleInstance extends BatchedInstance {
	    getBatch(textureMapper: TextureMapper): MdxRenderBatch;
	}

}
declare module 'viewer/handlers/mdx/model' {
	import Parser from 'parsers/mdlx/model';
	import Sequence from 'parsers/mdlx/sequence';
	import Model from 'viewer/model';
	import Texture from 'viewer/texture';
	import TextureAnimation from 'viewer/handlers/mdx/textureanimation';
	import Layer from 'viewer/handlers/mdx/layer';
	import Material from 'viewer/handlers/mdx/material';
	import GeosetAnimation from 'viewer/handlers/mdx/geosetanimation';
	import Bone from 'viewer/handlers/mdx/bone';
	import Light from 'viewer/handlers/mdx/light';
	import Helper from 'viewer/handlers/mdx/helper';
	import Attachment from 'viewer/handlers/mdx/attachment';
	import ParticleEmitterObject from 'viewer/handlers/mdx/particleemitterobject';
	import ParticleEmitter2Object from 'viewer/handlers/mdx/particleemitter2object';
	import RibbonEmitterObject from 'viewer/handlers/mdx/ribbonemitterobject';
	import Camera from 'viewer/handlers/mdx/camera';
	import EventObjectEmitterObject from 'viewer/handlers/mdx/eventobjectemitterobject';
	import CollisionShape from 'viewer/handlers/mdx/collisionshape';
	import BatchGroup from 'viewer/handlers/mdx/batchgroup';
	import EmitterGroup from 'viewer/handlers/mdx/emittergroup';
	import GenericObject from 'viewer/handlers/mdx/genericobject';
	import Batch from 'viewer/handlers/mdx/batch';
	import Geoset from 'viewer/handlers/mdx/geoset';
	import MdxSimpleInstance from 'viewer/handlers/mdx/simpleinstance';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	/**
	 * An MDX model.
	 */
	export default class MdxModel extends Model {
	    reforged: boolean;
	    hd: boolean;
	    solverParams: {
	        reforged?: boolean;
	        hd?: boolean;
	    };
	    name: string;
	    sequences: Sequence[];
	    globalSequences: number[];
	    materials: Material[];
	    layers: Layer[];
	    replaceables: number[];
	    textures: Texture[];
	    textureAnimations: TextureAnimation[];
	    geosets: Geoset[];
	    geosetAnimations: GeosetAnimation[];
	    bones: Bone[];
	    lights: Light[];
	    helpers: Helper[];
	    attachments: Attachment[];
	    pivotPoints: Float32Array[];
	    particleEmitters: ParticleEmitterObject[];
	    particleEmitters2: ParticleEmitter2Object[];
	    ribbonEmitters: RibbonEmitterObject[];
	    cameras: Camera[];
	    eventObjects: EventObjectEmitterObject[];
	    collisionShapes: CollisionShape[];
	    hasLayerAnims: boolean;
	    hasGeosetAnims: boolean;
	    batches: Batch[];
	    genericObjects: GenericObject[];
	    sortedGenericObjects: GenericObject[];
	    hierarchy: number[];
	    opaqueGroups: BatchGroup[];
	    translucentGroups: (BatchGroup | EmitterGroup)[];
	    simpleGroups: BatchGroup[];
	    arrayBuffer: WebGLBuffer | null;
	    elementBuffer: WebGLBuffer | null;
	    createInstance(type: number): MdxSimpleInstance | MdxComplexInstance;
	    load(bufferOrParser: ArrayBuffer | string | Parser): void;
	    setupHierarchy(parent: number): void;
	}

}
declare module 'viewer/handlers/mdx/shaders/complex.vert' {
	 const shader: string;
	export default shader;

}
declare module 'viewer/handlers/shaders/quattransform.glsl' {
	 const shader = "\n// A 2D quaternion*vector.\n// q is the zw components of the original quaternion.\nvec2 quat_transform(vec2 q, vec2 v) {\n  vec2 uv = vec2(-q.x * v.y, q.x * v.x);\n  vec2 uuv = vec2(-q.x * uv.y, q.x * uv.x);\n\n  return v + 2.0 * (uv * q.y + uuv);\n}\n";
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/complex.frag' {
	 const shader: string;
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/particles.vert' {
	 const shader = "\n#define EMITTER_PARTICLE2 0\n#define EMITTER_RIBBON 1\n#define EMITTER_SPLAT 2\n#define EMITTER_UBERSPLAT 3\n#define HEAD 0.0\n\nuniform mat4 u_VP;\nuniform int u_emitter;\n\n// Shared\nuniform vec4 u_colors[3];\nuniform vec3 u_vertices[4];\nuniform vec3 u_intervals[4];\nuniform float u_lifeSpan;\nuniform float u_columns;\nuniform float u_rows;\n\n// Particle2\nuniform vec3 u_scaling;\nuniform vec3 u_cameraZ;\nuniform float u_timeMiddle;\nuniform bool u_teamColored;\n\n// Splat and Uber.\nuniform vec3 u_intervalTimes;\n\n// Vertices\nattribute float a_position;\n\n// Instances\nattribute vec3 a_p0;\nattribute vec3 a_p1;\nattribute vec3 a_p2;\nattribute vec3 a_p3;\nattribute float a_health;\nattribute vec4 a_color;\nattribute float a_tail;\nattribute vec3 a_leftRightTop;\n\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\n\nfloat getCell(vec3 interval, float factor) {\n  float start = interval[0];\n  float end = interval[1];\n  float repeat = interval[2];\n  float spriteCount = end - start;\n\n  if (spriteCount > 0.0) {\n    // Repeating speeds up the sprite animation, which makes it effectively run N times in its interval.\n    // E.g. if repeat is 4, the sprite animation will be seen 4 times, and thus also run 4 times as fast.\n    // The sprite index is limited to the number of actual sprites.\n    return min(start + mod(floor(spriteCount * repeat * factor), spriteCount), u_columns * u_rows - 1.0);\n  }\n\n  return 0.0;\n}\n\nvoid particle2() {\n  float factor = (u_lifeSpan - a_health) / u_lifeSpan;\n  int index = 0;\n\n  if (factor < u_timeMiddle) {\n    factor = factor / u_timeMiddle;\n    index = 0;\n  } else {\n    factor = (factor - u_timeMiddle) / (1.0 - u_timeMiddle);\n    index = 1;\n  }\n\n  factor = min(factor, 1.0);\n\n  float scale = mix(u_scaling[index], u_scaling[index + 1], factor);\n  vec4 color = mix(u_colors[index], u_colors[index + 1], factor);\n\n  float cell = 0.0;\n\n  if (u_teamColored) {\n    cell = a_leftRightTop[0];\n  } else {\n    vec3 interval;\n\n    if (a_tail == HEAD) {\n      interval = u_intervals[index];\n    } else {\n      interval = u_intervals[index + 2];\n    }\n\n    cell = getCell(interval, factor);\n  }\n\n  float left = floor(mod(cell, u_columns));\n  float top = floor(cell / u_columns);\n  float right = left + 1.0;\n  float bottom = top + 1.0;\n\n  left /= u_columns;\n  right /= u_columns;\n  top /= u_rows;\n  bottom /= u_rows;\n\n  if (a_position == 0.0) {\n    v_texcoord = vec2(right, top);\n  } else if (a_position == 1.0) {\n    v_texcoord = vec2(left, top);\n  } else if (a_position == 2.0) {\n    v_texcoord = vec2(left, bottom);\n  } else if (a_position == 3.0) {\n    v_texcoord = vec2(right, bottom);\n  }\n\n  v_color = color;\n  \n  if (a_tail == HEAD) {\n    gl_Position = u_VP * vec4(a_p0 + (u_vertices[int(a_position)] * scale), 1.0);\n  } else {\n    // Get the normal to the tail in camera space.\n    // This allows to build a 2D rectangle around the 3D tail.\n    vec3 normal = cross(u_cameraZ, normalize(a_p1 - a_p0));\n    vec3 boundary = normal * scale * a_p2[0];\n    vec3 position;\n\n    if (a_position == 0.0) {\n      position = a_p0 - boundary;\n    } else if (a_position == 1.0) {\n      position = a_p1 - boundary;\n    } else if (a_position == 2.0) {\n      position = a_p1 + boundary;\n    } else if (a_position == 3.0) {\n      position = a_p0 + boundary;\n    }\n\n    gl_Position = u_VP * vec4(position, 1.0);\n  }\n}\n\nvoid ribbon() {\n  vec3 position;\n  float left = a_leftRightTop[0] / 255.0;\n  float right = a_leftRightTop[1] / 255.0;\n  float top = a_leftRightTop[2] / 255.0;\n  float bottom = top + 1.0;\n\n  if (a_position == 0.0) {\n    v_texcoord = vec2(right, top);\n    position = a_p0;\n  } else if (a_position == 1.0) {\n    v_texcoord = vec2(right, bottom);\n    position = a_p1;\n  } else if (a_position == 2.0) {\n    v_texcoord = vec2(left, bottom);\n    position = a_p2;\n  } else if (a_position == 3.0) {\n    v_texcoord = vec2(left, top);\n    position = a_p3;\n  }\n\n  v_texcoord[0] /= u_columns;\n  v_texcoord[1] /= u_rows;\n\n  v_color = a_color;\n\n  gl_Position = u_VP * vec4(position, 1.0);\n}\n\nvoid splat() {\n  float factor = u_lifeSpan - a_health;\n  int index;\n\n  if (factor < u_intervalTimes[0]) {\n    factor = factor / u_intervalTimes[0];\n    index = 0;\n  } else {\n    factor = (factor - u_intervalTimes[0]) / u_intervalTimes[1];\n    index = 1;\n  }\n\n  float cell = getCell(u_intervals[index], factor);\n  float left = floor(mod(cell, u_columns));\n  float top = floor(cell / u_columns);\n  float right = left + 1.0;\n  float bottom = top + 1.0;\n  vec3 position;\n\n  if (a_position == 0.0) {\n    v_texcoord = vec2(left, top);\n    position = a_p0;\n  } else if (a_position == 1.0) {\n    v_texcoord = vec2(left, bottom);\n    position = a_p1;\n  } else if (a_position == 2.0) {\n    v_texcoord = vec2(right, bottom);\n    position = a_p2;\n  } else if (a_position == 3.0) {\n    v_texcoord = vec2(right, top);\n    position = a_p3;\n  }\n\n  v_texcoord[0] /= u_columns;\n  v_texcoord[1] /= u_rows;\n\n  v_color = mix(u_colors[index], u_colors[index + 1], factor) / 255.0;\n\n  gl_Position = u_VP * vec4(position, 1.0);\n}\n\nvoid ubersplat() {\n  float factor = u_lifeSpan - a_health;\n  vec4 color;\n\n  if (factor < u_intervalTimes[0]) {\n    color = mix(u_colors[0], u_colors[1], factor / u_intervalTimes[0]);\n  } else if (factor < u_intervalTimes[0] + u_intervalTimes[1]) {\n    color = u_colors[1];\n  } else {\n    color = mix(u_colors[1], u_colors[2], (factor - u_intervalTimes[0] - u_intervalTimes[1]) / u_intervalTimes[2]);\n  }\n\n  vec3 position;\n\n  if (a_position == 0.0) {\n    v_texcoord = vec2(0.0, 0.0);\n    position = a_p0;\n  } else if (a_position == 1.0) {\n    v_texcoord = vec2(0.0, 1.0);\n    position = a_p1;\n  } else if (a_position == 2.0) {\n    v_texcoord = vec2(1.0, 1.0);\n    position = a_p2;\n  } else if (a_position == 3.0) {\n    v_texcoord = vec2(1.0, 0.0);\n    position = a_p3;\n  }\n\n  v_color = color / 255.0;\n\n  gl_Position = u_VP * vec4(position, 1.0);\n}\n\nvoid main() {\n  if (u_emitter == EMITTER_PARTICLE2) {\n    particle2();\n  } else if (u_emitter == EMITTER_RIBBON) {\n    ribbon();\n  } else if (u_emitter == EMITTER_SPLAT) {\n    splat();\n  } else if (u_emitter == EMITTER_UBERSPLAT) {\n    ubersplat();\n  }\n}\n";
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/particles.frag' {
	 const shader = "\nprecision mediump float;\n\n#define EMITTER_RIBBON 1\n\nuniform sampler2D u_texture;\nuniform highp int u_emitter;\nuniform float u_filterMode;\n\nvarying vec2 v_texcoord;\nvarying vec4 v_color;\n\nvoid main() {\n  vec4 texel = texture2D(u_texture, v_texcoord);\n  vec4 color = texel * v_color;\n\n  // 1bit Alpha, used by ribbon emitters.\n  if (u_emitter == EMITTER_RIBBON && u_filterMode == 1.0 && color.a < 0.75) {\n    discard;\n  }\n\n  gl_FragColor = color;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/simple.vert' {
	 const shader = "\nuniform mat4 u_VP;\n\nattribute vec3 a_m0;\nattribute vec3 a_m1;\nattribute vec3 a_m2;\nattribute vec3 a_m3;\nattribute vec3 a_position;\nattribute vec2 a_uv;\n\nvarying vec2 v_uv;\n\nvoid main() {\n  v_uv = a_uv;\n\n  gl_Position = u_VP * mat4(a_m0, 0.0, a_m1, 0.0, a_m2, 0.0, a_m3, 1.0) * vec4(a_position, 1.0);\n}\n";
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/simple.frag' {
	 const shader = "\nprecision mediump float;\n\nuniform sampler2D u_texture;\nuniform float u_filterMode;\n\nvarying vec2 v_uv;\n\nvoid main() {\n  vec4 color = texture2D(u_texture, v_uv);\n\n  // 1bit Alpha\n  if (u_filterMode == 1.0 && color.a < 0.75) {\n    discard;\n  }\n\n  gl_FragColor = color;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/hd.vert' {
	 const shader: string;
	export default shader;

}
declare module 'viewer/handlers/mdx/shaders/hd.frag' {
	 const shader = "\nprecision mediump float;\n\nuniform sampler2D u_diffuseMap;\nuniform sampler2D u_ormMap;\nuniform sampler2D u_teamColorMap;\nuniform float u_filterMode;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying float v_layerAlpha;\n\nvoid main() {\n  vec4 texel = texture2D(u_diffuseMap, v_uv);\n  vec4 color = vec4(texel.rgb, texel.a * v_layerAlpha);\n\n  vec4 orma = texture2D(u_ormMap, v_uv);\n\n  if (orma.a > 0.1) {\n    color *= texture2D(u_teamColorMap, v_uv) * orma.a;\n  }\n\n  // 1bit Alpha\n  if (u_filterMode == 1.0 && color.a < 0.75) {\n    discard;\n  }\n\n  gl_FragColor = color;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/mdx/handler' {
	import ModelViewer from 'viewer/viewer';
	import Model from 'viewer/handlers/mdx/model'; const _default: {
	    extensions: string[][];
	    load(viewer: ModelViewer): boolean;
	    resource: typeof Model;
	};
	export default _default;

}
declare module 'common/arrayunique' {
	/**
	 * Returns an array that only contains unique values found in the source array.
	 */
	export default function unique(a: any[]): any[];

}
declare module 'viewer/handlers/w3x/variations' {
	export default function getCliffVariation(dir: string, tag: string, variation: number): number;

}
declare module 'viewer/handlers/w3x/terrainmodel' {
	import ShaderProgram from 'viewer/gl/program';
	import War3MapViewer from 'viewer/handlers/w3x/viewer';
	/**
	 * A static terrain model.
	 */
	export default class TerrainModel {
	    viewer: War3MapViewer;
	    vertexBuffer: WebGLBuffer;
	    faceBuffer: WebGLBuffer;
	    normalsOffset: number;
	    uvsOffset: number;
	    elements: number;
	    locationAndTextureBuffer: WebGLBuffer;
	    texturesOffset: number;
	    instances: number;
	    vao: WebGLVertexArrayObjectOES | null;
	    constructor(viewer: War3MapViewer, arrayBuffer: ArrayBuffer, locations: number[], textures: number[], shader: ShaderProgram);
	    render(shader: ShaderProgram): void;
	}

}
declare module 'viewer/handlers/w3x/standsequence' {
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	export default function randomStandSequence(target: MdxComplexInstance): void;

}
declare module 'viewer/handlers/w3x/unit' {
	import { MappedDataRow } from 'utils/mappeddata';
	import DooUnit from 'parsers/w3x/unitsdoo/unit';
	import MdxModel from 'viewer/handlers/mdx/model';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	import War3MapViewer from 'viewer/handlers/w3x/viewer';
	/**
	 * A unit.
	 */
	export default class Unit {
	    instance: MdxComplexInstance;
	    /**
	     * StartLocation.mdx (and others?) seems to be built-in, and has no row.
	     */
	    row: MappedDataRow | undefined;
	    constructor(map: War3MapViewer, model: MdxModel, row: MappedDataRow | undefined, unit: DooUnit);
	}

}
declare module 'viewer/handlers/w3x/doodad' {
	import { MappedDataRow } from 'utils/mappeddata';
	import DooDoodad from 'parsers/w3x/doo/doodad';
	import MdxModel from 'viewer/handlers/mdx/model';
	import MdxComplexInstance from 'viewer/handlers/mdx/complexinstance';
	import MdxSimpleInstance from 'viewer/handlers/mdx/simpleinstance';
	import War3MapViewer from 'viewer/handlers/w3x/viewer';
	/**
	 * A doodad.
	 */
	export default class Doodad {
	    instance: MdxSimpleInstance | MdxComplexInstance;
	    row: MappedDataRow;
	    constructor(map: War3MapViewer, model: MdxModel, row: MappedDataRow, doodad: DooDoodad);
	}

}
declare module 'viewer/handlers/w3x/terraindoodad' {
	import { MappedDataRow } from 'utils/mappeddata';
	import DooTerrainDoodad from 'parsers/w3x/doo/terraindoodad';
	import MdxModel from 'viewer/handlers/mdx/model';
	import MdxSimpleInstance from 'viewer/handlers/mdx/simpleinstance';
	import War3MapViewer from 'viewer/handlers/w3x/viewer';
	/**
	 * A cliff/terrain doodad.
	 */
	export default class TerrainDoodad {
	    instance: MdxSimpleInstance;
	    row: MappedDataRow;
	    constructor(map: War3MapViewer, model: MdxModel, row: MappedDataRow, doodad: DooTerrainDoodad);
	}

}
declare module 'viewer/handlers/w3x/shaders/ground.vert' {
	 const shader = "\nuniform mat4 u_VP;\nuniform sampler2D u_heightMap;\nuniform vec2 u_size;\nuniform vec2 u_offset;\nuniform bool u_extended[14];\nuniform float u_baseTileset;\n\nattribute vec2 a_position;\nattribute float a_InstanceID;\nattribute vec4 a_textures;\nattribute vec4 a_variations;\n\nvarying vec4 v_tilesets;\nvarying vec2 v_uv[4];\nvarying vec3 v_normal;\n\nvec2 getCell(float variation) {\n  if (variation < 16.0) {\n    return vec2(mod(variation, 4.0), floor(variation / 4.0));\n  } else {\n    variation -= 16.0;\n\n    return vec2(4.0 + mod(variation, 4.0), floor(variation / 4.0));\n  }\n}\n\nvec2 getUV(vec2 position, bool extended, float variation) {\n  vec2 cell = getCell(variation);\n  vec2 cellSize = vec2(extended ? 0.125 : 0.25, 0.25);\n  vec2 uv = vec2(position.x, 1.0 - position.y);\n  vec2 pixelSize = vec2(1.0 / 512.0, 1.0 / 256.0); /// Note: hardcoded to 512x256 for now.\n\n  return clamp((cell + uv) * cellSize, cell * cellSize + pixelSize, (cell + 1.0) * cellSize - pixelSize); \n}\n\nvoid main() {\n  vec4 textures = a_textures - u_baseTileset;\n  \n  if (textures[0] > 0.0 || textures[1] > 0.0 || textures[2] > 0.0 || textures[3] > 0.0) {\n    v_tilesets = textures;\n\n    v_uv[0] = getUV(a_position, u_extended[int(textures[0]) - 1], a_variations[0]);\n    v_uv[1] = getUV(a_position, u_extended[int(textures[1]) - 1], a_variations[1]);\n    v_uv[2] = getUV(a_position, u_extended[int(textures[2]) - 1], a_variations[2]);\n    v_uv[3] = getUV(a_position, u_extended[int(textures[3]) - 1], a_variations[3]);\n\n    vec2 corner = vec2(mod(a_InstanceID, u_size.x), floor(a_InstanceID / u_size.x));\n    vec2 base = corner + a_position;\n    float height = texture2D(u_heightMap, base / u_size).a;\n\n    float hL = texture2D(u_heightMap, vec2(base - vec2(1.0, 0.0)) / (u_size)).a;\n    float hR = texture2D(u_heightMap, vec2(base + vec2(1.0, 0.0)) / (u_size)).a;\n    float hD = texture2D(u_heightMap, vec2(base - vec2(0.0, 1.0)) / (u_size)).a;\n    float hU = texture2D(u_heightMap, vec2(base + vec2(0.0, 1.0)) / (u_size)).a;\n\n    v_normal = normalize(vec3(hL - hR, hD - hU, 2.0));\n\n    gl_Position = u_VP * vec4(base * 128.0 + u_offset, height * 128.0, 1.0);\n  } else {\n    v_tilesets = vec4(0.0);\n\n    v_uv[0] = vec2(0.0);\n    v_uv[1] = vec2(0.0);\n    v_uv[2] = vec2(0.0);\n    v_uv[3] = vec2(0.0);\n\n    v_normal = vec3(0.0);\n\n    gl_Position = vec4(0.0);\n  }\n}\n";
	export default shader;

}
declare module 'viewer/handlers/w3x/shaders/ground.frag' {
	 const shader = "\nprecision mediump float;\n\nuniform sampler2D u_tilesets[15];\n\nvarying vec4 v_tilesets;\nvarying vec2 v_uv[4];\nvarying vec3 v_normal;\n\nconst vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));\n\nvec4 sample(float tileset, vec2 uv) {\n  if (tileset == 0.0) {\n    return texture2D(u_tilesets[0], uv);\n  } else if (tileset == 1.0) {\n    return texture2D(u_tilesets[1], uv);\n  } else if (tileset == 2.0) {\n    return texture2D(u_tilesets[2], uv);\n  } else if (tileset == 3.0) {\n    return texture2D(u_tilesets[3], uv);\n  } else if (tileset == 4.0) {\n    return texture2D(u_tilesets[4], uv);\n  } else if (tileset == 5.0) {\n    return texture2D(u_tilesets[5], uv);\n  } else if (tileset == 6.0) {\n    return texture2D(u_tilesets[6], uv);\n  } else if (tileset == 7.0) {\n    return texture2D(u_tilesets[7], uv);\n  } else if (tileset == 8.0) {\n    return texture2D(u_tilesets[8], uv);\n  } else if (tileset == 9.0) {\n    return texture2D(u_tilesets[9], uv);\n  } else if (tileset == 10.0) {\n    return texture2D(u_tilesets[10], uv);\n  } else if (tileset == 11.0) {\n    return texture2D(u_tilesets[11], uv);\n  } else if (tileset == 12.0) {\n    return texture2D(u_tilesets[12], uv);\n  } else if (tileset == 13.0) {\n    return texture2D(u_tilesets[13], uv);\n  } else if (tileset == 14.0) {\n    return texture2D(u_tilesets[14], uv);\n  }\n}\n\nvec4 blend(vec4 color, float tileset, vec2 uv) {\n  vec4 texel = sample(tileset, uv);\n\n  return mix(color, texel, texel.a);\n}\n\nvoid main() {\n  vec4 color = sample(v_tilesets[0] - 1.0, v_uv[0]);\n\n  if (v_tilesets[1] > 0.5) {\n    color = blend(color, v_tilesets[1] - 1.0, v_uv[1]);\n  }\n\n  if (v_tilesets[2] > 0.5) {\n    color = blend(color, v_tilesets[2] - 1.0, v_uv[2]);\n  }\n\n  if (v_tilesets[3] > 0.5) {\n    color = blend(color, v_tilesets[3] - 1.0, v_uv[3]);\n  }\n\n  // color *= clamp(dot(v_normal, lightDirection) + 0.45, 0.0, 1.0);\n\n  gl_FragColor = color;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/w3x/shaders/water.vert' {
	 const shader = "\nuniform mat4 u_VP;\nuniform sampler2D u_heightMap;\nuniform sampler2D u_waterHeightMap;\nuniform vec2 u_size;\nuniform vec2 u_offset;\nuniform float u_offsetHeight;\nuniform vec4 u_minDeepColor;\nuniform vec4 u_maxDeepColor;\nuniform vec4 u_minShallowColor;\nuniform vec4 u_maxShallowColor;\n\nattribute vec2 a_position;\nattribute float a_InstanceID;\nattribute float a_isWater;\n\nvarying vec2 v_uv;\nvarying vec4 v_color;\n\nconst float minDepth = 10.0 / 128.0;\nconst float deepLevel = 64.0 / 128.0;\nconst float maxDepth = 72.0 / 128.0;\n\nvoid main() {\n  if (a_isWater > 0.5) {\n    v_uv = a_position;\n\n    vec2 corner = vec2(mod(a_InstanceID, u_size.x), floor(a_InstanceID / u_size.x));\n    vec2 base = corner + a_position;\n    float height = texture2D(u_heightMap, base / u_size).a;\n    float waterHeight = texture2D(u_waterHeightMap, base / u_size).a + u_offsetHeight;\n    float value = clamp(waterHeight - height, 0.0, 1.0);\n\n    if (value <= deepLevel) {\n      value = max(0.0, value - minDepth) / (deepLevel - minDepth);\n      v_color = mix(u_minShallowColor, u_maxShallowColor, value) / 255.0;\n    } else {\n      value = clamp(value - deepLevel, 0.0, maxDepth - deepLevel) / (maxDepth - deepLevel);\n      v_color = mix(u_minDeepColor, u_maxDeepColor, value) / 255.0;\n    }\n\n    gl_Position = u_VP * vec4(base * 128.0 + u_offset, waterHeight * 128.0, 1.0);\n  } else {\n    v_uv = vec2(0.0);\n    v_color = vec4(0.0);\n\n    gl_Position = vec4(0.0);\n  }\n}\n";
	export default shader;

}
declare module 'viewer/handlers/w3x/shaders/water.frag' {
	 const shader = "\nprecision mediump float;\n\nuniform sampler2D u_waterTexture;\n\nvarying vec2 v_uv;\nvarying vec4 v_color;\n\nvoid main() {\n  gl_FragColor = texture2D(u_waterTexture, v_uv) * v_color;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/w3x/shaders/cliffs.vert' {
	 const shader = "\nuniform mat4 u_VP;\nuniform sampler2D u_heightMap;\nuniform vec2 u_pixel;\nuniform vec2 u_centerOffset;\n\nattribute vec3 a_position;\nattribute vec3 a_normal;\nattribute vec2 a_uv;\nattribute vec3 a_instancePosition;\nattribute float a_instanceTexture;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying float v_texture;\nvarying vec3 v_position;\n\nvoid main() {\n  // Half of a pixel in the cliff height map.\n  vec2 halfPixel = u_pixel * 0.5;\n\n  // The bottom left corner of the map tile this vertex is on.\n  vec2 corner = floor((a_instancePosition.xy - vec2(1.0, 0.0) - u_centerOffset.xy) / 128.0);\n\n  // Get the 4 closest heights in the height map.\n  float bottomLeft = texture2D(u_heightMap, corner * u_pixel + halfPixel).a;\n  float bottomRight = texture2D(u_heightMap, (corner + vec2(1.0, 0.0)) * u_pixel + halfPixel).a;\n  float topLeft = texture2D(u_heightMap, (corner + vec2(0.0, 1.0)) * u_pixel + halfPixel).a;\n  float topRight = texture2D(u_heightMap, (corner + vec2(1.0, 1.0)) * u_pixel + halfPixel).a;\n  \n  // Do a bilinear interpolation between the heights to get the final value.\n  float bottom = mix(bottomRight, bottomLeft, -a_position.x / 128.0);\n  float top = mix(topRight, topLeft, -a_position.x / 128.0);\n  float height = mix(bottom, top, a_position.y / 128.0);\n\n  v_normal = a_normal;\n  v_uv = a_uv;\n  v_texture = a_instanceTexture;\n  v_position = a_position + vec3(a_instancePosition.xy, a_instancePosition.z + height * 128.0);\n\n  gl_Position = u_VP * vec4(v_position, 1.0);\n}\n";
	export default shader;

}
declare module 'viewer/handlers/w3x/shaders/cliffs.frag' {
	 const shader = "\n// #extension GL_OES_standard_derivatives : enable\n\nprecision mediump float;\n\nuniform sampler2D u_texture1;\nuniform sampler2D u_texture2;\n\nvarying vec3 v_normal;\nvarying vec2 v_uv;\nvarying float v_texture;\nvarying vec3 v_position;\n\n// const vec3 lightDirection = normalize(vec3(-0.3, -0.3, 0.25));\n\nvec4 sample(int texture, vec2 uv) {\n  if (texture == 0) {\n    return texture2D(u_texture1, uv);\n  } else {\n    return texture2D(u_texture2, uv);\n  }\n}\n\nvoid main() {\n  vec4 color = sample(int(v_texture), v_uv);\n\n  // vec3 faceNormal = cross(dFdx(v_position), dFdy(v_position));\n  // vec3 normal = normalize((faceNormal + v_normal) * 0.5);\n\n  // color *= clamp(dot(normal, lightDirection) + 0.45, 0.1, 1.0);\n\n  gl_FragColor = color;\n}\n";
	export default shader;

}
declare module 'viewer/handlers/w3x/viewer' {
	import { vec3 } from 'gl-matrix';
	import { FetchDataTypeName } from 'common/fetchdatatype';
	import { MappedData } from 'utils/mappeddata';
	import War3Map from 'parsers/w3x/map';
	import War3MapW3e from 'parsers/w3x/w3e/file';
	import Corner from 'parsers/w3x/w3e/corner';
	import ModelViewer from 'viewer/viewer';
	import ShaderProgram from 'viewer/gl/program';
	import Scene from 'viewer/scene';
	import { PathSolver } from 'viewer/handlerresource';
	import Texture from 'viewer/texture';
	import TerrainModel from 'viewer/handlers/w3x/terrainmodel';
	import Unit from 'viewer/handlers/w3x/unit';
	import Doodad from 'viewer/handlers/w3x/doodad';
	export default class War3MapViewer extends ModelViewer {
	    wc3PathSolver: PathSolver;
	    solverParams: {
	        tileset?: string;
	        reforged?: boolean;
	        hd?: boolean;
	    };
	    groundShader: ShaderProgram | null;
	    waterShader: ShaderProgram | null;
	    cliffShader: ShaderProgram | null;
	    worldScene: Scene;
	    waterIndex: number;
	    waterIncreasePerFrame: number;
	    waterHeightOffset: number;
	    waterTextures: Texture[];
	    maxDeepColor: Float32Array;
	    minDeepColor: Float32Array;
	    maxShallowColor: Float32Array;
	    minShallowColor: Float32Array;
	    anyReady: boolean;
	    terrainCliffsAndWaterLoaded: boolean;
	    terrainData: MappedData;
	    cliffTypesData: MappedData;
	    waterData: MappedData;
	    terrainReady: boolean;
	    cliffsReady: boolean;
	    doodadsAndDestructiblesLoaded: boolean;
	    doodadsData: MappedData;
	    doodadMetaData: MappedData;
	    destructableMetaData: MappedData;
	    doodads: Doodad[];
	    terrainDoodads: any[];
	    doodadsReady: boolean;
	    unitsAndItemsLoaded: boolean;
	    unitsData: MappedData;
	    unitMetaData: MappedData;
	    units: Unit[];
	    unitsReady: boolean;
	    tilesetTextures: Texture[];
	    cliffTextures: Texture[];
	    cliffModels: TerrainModel[];
	    mapMpq: War3Map | null;
	    mapPathSolver: PathSolver | null;
	    corners: Corner[][];
	    centerOffset: Float32Array;
	    mapSize: Int32Array;
	    tilesets: any[];
	    blightTextureIndex: number;
	    cliffTilesets: any[];
	    columns: number;
	    rows: number;
	    vertexBuffer: WebGLBuffer | null;
	    faceBuffer: WebGLBuffer | null;
	    instanceBuffer: WebGLBuffer | null;
	    textureBuffer: WebGLBuffer | null;
	    variationBuffer: WebGLBuffer | null;
	    waterBuffer: WebGLBuffer | null;
	    heightMap: WebGLTexture | null;
	    waterHeightMap: WebGLTexture | null;
	    cliffHeightMap: WebGLTexture | null;
	    constructor(canvas: HTMLCanvasElement, wc3PathSolver: PathSolver);
	    load(src: any): import("../../resource").Resource | undefined;
	    loadMapGeneric(path: string, dataType: FetchDataTypeName): import("../../genericresource").default;
	    /**
	     * Load a map from a buffer.
	     */
	    loadMap(buffer: ArrayBuffer): Promise<void>;
	    loadTerrainCliffsAndWater(w3e: War3MapW3e): Promise<void>;
	    loadDoodadsAndDestructibles(modifications: any): void;
	    loadUnitsAndItems(modifications: any): void;
	    /**
	     * Update the map.
	     */
	    update(): void;
	    /**
	     * Render the map.
	     */
	    render(): void;
	    renderGround(): void;
	    renderWater(): void;
	    renderCliffs(): void;
	    cliffFileName(bottomLeftLayer: number, bottomRightLayer: number, topLeftLayer: number, topRightLayer: number, base: number): string;
	    getVariation(groundTexture: number, variation: number): number;
	    /**
	     * Is the corner at the given column and row a cliff?
	     */
	    isCliff(column: number, row: number): boolean;
	    /**
	     * Is the tile at the given column and row water?
	     */
	    isWater(column: number, row: number): number;
	    /**
	     * Given a cliff index, get its ground texture index.
	     * This is an index into the tilset textures.
	     */
	    cliffGroundIndex(whichCliff: number): number | undefined;
	    /**
	     * Get the ground texture of a corner, whether it's normal ground, a cliff, or a blighted corner.
	     */
	    cornerTexture(column: number, row: number): number | undefined;
	    applyModificationFile(dataMap: MappedData, metadataMap: MappedData, modificationFile: any): void;
	    applyModificationTable(dataMap: MappedData, metadataMap: MappedData, modificationTable: any): void;
	    groundNormal(out: vec3, x: number, y: number): vec3;
	}

}
declare module 'viewer/handlers/index' {
	import War3MapViewer from 'viewer/handlers/w3x/viewer'; const _default: {
	    blp: {
	        extensions: string[][];
	        resource: typeof import("./blp/texture").default;
	    };
	    dds: {
	        load(viewer: import("../viewer").default): boolean;
	        extensions: string[][];
	        resource: typeof import("./dds/texture").default;
	    };
	    geo: {
	        extensions: string[][];
	        load(viewer: import("../viewer").default): boolean;
	        resource: typeof import("./geo/model").default;
	    };
	    m3: {
	        extensions: string[][];
	        load(viewer: import("../viewer").default): boolean;
	        resource: typeof import("./m3/model").default;
	    };
	    mdx: {
	        extensions: string[][];
	        load(viewer: import("../viewer").default): boolean;
	        resource: typeof import("./mdx/model").default;
	    };
	    tga: {
	        extensions: string[][];
	        resource: typeof import("./tga/texture").default;
	    };
	    War3MapViewer: typeof War3MapViewer;
	};
	export default _default;

}
declare module 'viewer/index' {
	import ModelViewer from 'viewer/viewer';
	import Scene from 'viewer/scene';
	import Camera from 'viewer/camera'; const _default: {
	    ModelViewer: typeof ModelViewer;
	    Scene: typeof Scene;
	    Camera: typeof Camera;
	    handlers: {
	        blp: {
	            extensions: string[][];
	            resource: typeof import("./handlers/blp/texture").default;
	        };
	        dds: {
	            load(viewer: ModelViewer): boolean;
	            extensions: string[][];
	            resource: typeof import("./handlers/dds/texture").default;
	        };
	        geo: {
	            extensions: string[][];
	            load(viewer: ModelViewer): boolean;
	            resource: typeof import("./handlers/geo/model").default;
	        };
	        m3: {
	            extensions: string[][];
	            load(viewer: ModelViewer): boolean;
	            resource: typeof import("./handlers/m3/model").default;
	        };
	        mdx: {
	            extensions: string[][];
	            load(viewer: ModelViewer): boolean;
	            resource: typeof import("./handlers/mdx/model").default;
	        };
	        tga: {
	            extensions: string[][];
	            resource: typeof import("./handlers/tga/texture").default;
	        };
	        War3MapViewer: typeof import("./handlers/w3x/viewer").default;
	    };
	};
	export default _default;

}
declare module 'common/seededrandom' {
	/**
	 * Return a function that works in the same exact way as Math.random(), but with the given seed.
	 * See http://indiegamr.com/generate-repeatable-random-numbers-in-js/
	 */
	export default function seededRandom(seed: number): () => number;

}
declare module 'utils/unittester' {
	import ModelViewer from 'viewer/viewer';
	import { Resource } from 'viewer/resource';
	import Scene from 'viewer/scene';
	import Camera from 'viewer/camera'; type TestLoader = (viewer: ModelViewer) => any; type TestHandler = (viewer: ModelViewer, scene: Scene, camera: Camera, data: any) => void;
	/**
	 * The recursive test structure passed to the unit tester.
	 *
	 * In reality either `load` and `test` should be defined, or `tests` should be defined.
	 */
	interface RecursiveTest {
	    name: string;
	    load?: TestLoader;
	    test?: TestHandler;
	    tests?: RecursiveTest[];
	}
	/**
	 * The internal type used by the tester.
	 */
	interface Test {
	    name: string;
	    test: RecursiveTest;
	}
	/**
	 * The result given to the callback when running the tests.
	 */
	interface TestResult {
	    done: boolean;
	    value?: {
	        name: string;
	        testImage?: HTMLImageElement;
	        comparisonImage?: HTMLImageElement;
	        result: number;
	    };
	}
	/**
	 * The result given to the callback when downloading the tests.
	 */
	interface DownloadResult {
	    done: boolean;
	    value?: {
	        name: string;
	        blob?: Blob;
	    };
	}
	/**
	 * A unit tester designed for the model viewer.
	 * The input of each test is a pre-defined scene, and the output is the rendered image.
	 * The image is then compared to another image generated from the same test, at a time when rendering it was considered "correct".
	 */
	export default class UnitTester {
	    viewer: ModelViewer;
	    mathRandom: () => number;
	    tests: Test[];
	    constructor();
	    /**
	     * Add a test or a hierarchy of tests.
	     */
	    add(test: RecursiveTest): void;
	    /**
	     * Run all of the tests that were added.
	     * The callback will be called with the result of each one.
	     * The results look like iterators: {done: true/false, value: undefine/result }.
	     */
	    test(callback: (testResult: TestResult) => void): Promise<void>;
	    /**
	     * Run all of the tests that were added, and download them.
	     * The tests are not compared against anything.
	     * This is used to update the "correct" results.
	     */
	    download(callback: (testResult: DownloadResult) => void): Promise<void>;
	    /**
	     * Is the given resource or array of resources ok?
	     */
	    isDataAGo(data: Resource | Resource[]): boolean;
	    /**
	     * Given a test, return a promise that will resolve to the blob that resulted from running the test.
	     */
	    getTestBlob(test: Test): Promise<Blob | null | undefined>;
	    /**
	     * Given a test, return a promise that will resolve to the comparison image of this test.
	     */
	    getComparisonBlob(test: Test): Promise<Blob | undefined>;
	    /**
	     * Adds tests from an hierarchy while appending their names.
	     * Called automatically by add() if needed.
	     */
	    addBaseName(tests: RecursiveTest[], baseName: string): void;
	}
	export {};

}
declare module 'utils/mdxsanitytest' {
	import Model from 'parsers/mdlx/model';
	interface WarningErrorDescriptor {
	    type: 'warning' | 'error';
	    message: string;
	}
	interface ObjectDescriptor {
	    type: 'object';
	    objectType: string;
	    warnings: number;
	    errors: number;
	    children: (ObjectDescriptor | WarningErrorDescriptor)[];
	    index?: number;
	    name?: string;
	    uses?: number;
	}
	/**
	 * Run a sanity test on the model and return the results.
	 */
	export default function sanityTest(model: Model): {
	    nodes: (WarningErrorDescriptor | ObjectDescriptor)[];
	    warnings: number;
	    errors: number;
	    unused: number;
	};
	export {};

}
declare module 'utils/blpsanitytest' {
	import BlpImage from 'parsers/blp/image';
	/**
	 * Tests for issues in BLP textures.
	 */
	export default function sanityTest(texture: BlpImage): string[];

}
declare module 'utils/weu' {
	import TriggerData from 'parsers/w3x/wtg/triggerdata';
	import War3Map from 'parsers/w3x/map';
	interface GeneratedFunctionDescriptor {
	    type: 'generatedfunction';
	    stack: string;
	    data: string;
	}
	interface InlineGUIDescriptor {
	    type: 'inlinegui';
	    stack: string;
	}
	interface GeneratedStringTableDescriptor {
	    type: 'generatedstringtable';
	    stack: string;
	    data: {
	        value: string;
	        callback: string;
	    };
	}
	interface SingleToMultipleDescriptor {
	    type: 'singletomultiple';
	    stack: string;
	}
	interface InlineCustomScriptDescriptor {
	    type: 'inlinecustomscript';
	    stack: string;
	    data: string;
	}
	interface ReferencesDescriptor {
	    type: 'references';
	    data: string[];
	}
	interface MissingStringDescriptor {
	    type: 'missingstring';
	    data: string;
	} type AnyDescriptor = GeneratedFunctionDescriptor | InlineGUIDescriptor | GeneratedStringTableDescriptor | SingleToMultipleDescriptor | InlineCustomScriptDescriptor | ReferencesDescriptor | MissingStringDescriptor;
	/**
	 * Convert extended GUI of a map back to something the World Editor can open.
	 * The conversion depends on the given TriggerData object, which must be filled by the caller.
	 * The conversion is in-place.
	 */
	export default function convertWeu(map: War3Map, triggerData: TriggerData, weTriggerData: TriggerData): {
	    ok: boolean;
	    error: string;
	    changes?: undefined;
	} | {
	    ok: boolean;
	    changes: AnyDescriptor[];
	    error?: undefined;
	};
	export {};

}
declare module 'utils/mdlsourcemap' {
	/**
	 * The structure of a source map node.
	 */
	interface SourceNode {
	    name: string;
	    ident: number;
	    start: number;
	    end: number;
	    data: string;
	    children: SourceNode[];
	    index?: number;
	    objectName?: string;
	}
	/**
	 * Generate a source map from MDL source.
	 */
	export default function mdlSourceMap(buffer: string): SourceNode;
	export {};

}
declare module 'utils/jass2/tokenstream' {
	export default class TokenStream {
	    buffer: string;
	    index: number;
	    constructor(buffer: string);
	    read(): string;
	    /**
	     * Reads the next token without advancing the stream.
	     */
	    peek(): string;
	    readSafe(): string;
	    readUntil(delimiter: string): string;
	}

}
declare module 'utils/jass2/jass2lua' {
	export default function jass2lua(jass: string): string;

}
declare module 'utils/jass2/types/handle' {
	/**
	 * type handle
	 */
	export default class JassHandle {
	    handleId: number;
	}

}
declare module 'utils/jass2/types/agent' {
	import JassHandle from 'utils/jass2/types/handle';
	/**
	 * type agent
	 */
	export default class JassAgent extends JassHandle {
	}

}
declare module 'utils/jass2/types/player' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type player
	 */
	export default class JassPlayer extends JassAgent {
	    index: number;
	    name: string;
	    team: number;
	    startLocation: number;
	    forcedStartLocation: number;
	    color: number;
	    racePreference: number;
	    raceSelectable: boolean;
	    controller: number;
	    alliances: Map<number, object>;
	    constructor(index: number, maxPlayers: number);
	}

}
declare module 'utils/jass2/types/widget' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type widget
	 */
	export default class JassWidget extends JassAgent {
	    health: number;
	    maxHealth: number;
	}

}
declare module 'utils/jass2/types/unit' {
	import JassWidget from 'utils/jass2/types/widget';
	import JassPlayer from 'utils/jass2/types/player';
	/**
	 * type unit
	 */
	export default class JassUnit extends JassWidget {
	    player: JassPlayer;
	    unitId: string;
	    x: number;
	    y: number;
	    face: number;
	    acquireRange: number;
	    constructor(player: JassPlayer, unitId: number, x: number, y: number, face: number);
	}

}
declare module 'utils/jass2/types/force' {
	import JassAgent from 'utils/jass2/types/agent';
	import JassPlayer from 'utils/jass2/types/player';
	/**
	 * type force
	 */
	export default class JassForce extends JassAgent {
	    players: Set<JassPlayer>;
	}

}
declare module 'utils/jass2/types/group' {
	import JassAgent from 'utils/jass2/types/agent';
	import JassUnit from 'utils/jass2/types/unit';
	/**
	 * type group
	 */
	export default class JassGroup extends JassAgent {
	    units: Set<JassUnit>;
	}

}
declare module 'utils/jass2/types/trigger' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type trigger
	 */
	export default class JassTrigger extends JassAgent {
	    events: number[];
	    conditions: number[];
	    actions: number[];
	    enabled: boolean;
	}

}
declare module 'utils/jass2/types/timer' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type timer
	 */
	export default class JassTimer extends JassAgent {
	    elapsed: number;
	    timeout: number;
	    periodic: boolean;
	    handlerFunc: number;
	}

}
declare module 'utils/jass2/types/location' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type location
	 */
	export default class JassLocation extends JassAgent {
	    x: number;
	    y: number;
	    z: number;
	    constructor(x: number, y: number);
	}

}
declare module 'utils/jass2/types/rect' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type rect
	 */
	export default class JassRect extends JassAgent {
	    center: Float32Array;
	    min: Float32Array;
	    max: Float32Array;
	    constructor(minx: number, miny: number, maxx: number, maxy: number);
	}

}
declare module 'utils/jass2/types/region' {
	import JassAgent from 'utils/jass2/types/agent';
	import JassRect from 'utils/jass2/types/rect';
	/**
	 * type region
	 */
	export default class JassRegion extends JassAgent {
	    rects: Set<JassRect>;
	}

}
declare module 'utils/jass2/types/enum' {
	import JassHandle from 'utils/jass2/types/handle';
	/**
	 * Parent class for all enum types.
	 */
	export default class JassEnum extends JassHandle {
	    id: number;
	    constructor(value: number);
	}

}
declare module 'utils/jass2/types/race' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type race
	 */
	export default class JassRace extends JassEnum {
	}

}
declare module 'utils/jass2/types/alliancetype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type alliancetype
	 */
	export default class JassAllianceType extends JassEnum {
	}

}
declare module 'utils/jass2/types/racepreference' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type racepreference
	 */
	export default class JassRacePreference extends JassEnum {
	}

}
declare module 'utils/jass2/types/gamestate' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type gamestate
	 */
	export default class JassGameState extends JassEnum {
	}

}
declare module 'utils/jass2/types/igamestate' {
	import JassGameState from 'utils/jass2/types/gamestate';
	/**
	 * type igamestate
	 */
	export default class JassIGameState extends JassGameState {
	}

}
declare module 'utils/jass2/types/fgamestate' {
	import JassGameState from 'utils/jass2/types/gamestate';
	/**
	 * type fgamestate
	 */
	export default class JassFGameState extends JassGameState {
	}

}
declare module 'utils/jass2/types/playerstate' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type playerstate
	 */
	export default class JassPlayerState extends JassEnum {
	}

}
declare module 'utils/jass2/types/playerscore' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type playerscore
	 */
	export default class JassPlayerScore extends JassEnum {
	}

}
declare module 'utils/jass2/types/playergameresult' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type playergameresult
	 */
	export default class JassPlayerGameResult extends JassEnum {
	}

}
declare module 'utils/jass2/types/unitstate' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type unitstate
	 */
	export default class JassUnitState extends JassEnum {
	}

}
declare module 'utils/jass2/types/aidifficulty' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type aidifficulty
	 */
	export default class JassAiDifficulty extends JassEnum {
	}

}
declare module 'utils/jass2/types/eventid' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type eventid
	 */
	export default class JassEventId extends JassEnum {
	}

}
declare module 'utils/jass2/types/gameevent' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type gameevent
	 */
	export default class JassGameEvent extends JassEventId {
	}

}
declare module 'utils/jass2/types/playerevent' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type playerevent
	 */
	export default class JassPlayerEvent extends JassEventId {
	}

}
declare module 'utils/jass2/types/playerunitevent' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type playerunitevent
	 */
	export default class JassPlayerUnitEvent extends JassEventId {
	}

}
declare module 'utils/jass2/types/unitevent' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type unitevent
	 */
	export default class JassUnitEvent extends JassEventId {
	}

}
declare module 'utils/jass2/types/limitop' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type limitop
	 */
	export default class JassLimitOp extends JassEventId {
	}

}
declare module 'utils/jass2/types/widgetevent' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type widgetevent
	 */
	export default class JassWidgetEvent extends JassEventId {
	}

}
declare module 'utils/jass2/types/dialogevent' {
	import JassEventId from 'utils/jass2/types/eventid';
	/**
	 * type dialogevent
	 */
	export default class JassDialogEvent extends JassEventId {
	}

}
declare module 'utils/jass2/types/unittype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type unittype
	 */
	export default class JassUnitType extends JassEnum {
	}

}
declare module 'utils/jass2/types/gamespeed' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type gamespeed
	 */
	export default class JassGameSpeed extends JassEnum {
	}

}
declare module 'utils/jass2/types/gamedifficulty' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type gamedifficulty
	 */
	export default class JassGameDifficulty extends JassEnum {
	}

}
declare module 'utils/jass2/types/gametype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type gametype
	 */
	export default class JassGameType extends JassEnum {
	}

}
declare module 'utils/jass2/types/mapflag' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type mapflag
	 */
	export default class JassMapFlag extends JassEnum {
	}

}
declare module 'utils/jass2/types/mapvisibility' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type mapvisibility
	 */
	export default class JassMapVisibility extends JassEnum {
	}

}
declare module 'utils/jass2/types/mapsetting' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type mapflag
	 */
	export default class JassMapFlag extends JassEnum {
	}

}
declare module 'utils/jass2/types/mapdensity' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type mapdensity
	 */
	export default class JassMapDensity extends JassEnum {
	}

}
declare module 'utils/jass2/types/mapcontrol' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type mapcontrol
	 */
	export default class JassMapControl extends JassEnum {
	}

}
declare module 'utils/jass2/types/playerslotstate' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type playerslotstate
	 */
	export default class JassPlayerSlotState extends JassEnum {
	}

}
declare module 'utils/jass2/types/volumegroup' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type volumegroup
	 */
	export default class JassVolumeGroup extends JassEnum {
	}

}
declare module 'utils/jass2/types/camerafield' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type camerafield
	 */
	export default class JassCameraField extends JassEnum {
	}

}
declare module 'utils/jass2/types/camerasetup' {
	import JassHandle from 'utils/jass2/types/handle';
	import JassLocation from 'utils/jass2/types/location';
	/**
	 * type camerasetup
	 */
	export default class JassCameraSetup extends JassHandle {
	    targetDistance: number;
	    farZ: number;
	    angleOfAttack: number;
	    fieldOfView: number;
	    roll: number;
	    rotation: number;
	    zOffset: number;
	    destPosition: JassLocation;
	}

}
declare module 'utils/jass2/types/playercolor' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type playercolor
	 */
	export default class JassPlayerColor extends JassEnum {
	}

}
declare module 'utils/jass2/types/placement' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type placement
	 */
	export default class JassPlacement extends JassEnum {
	}

}
declare module 'utils/jass2/types/startlocprio' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type startlocprio
	 */
	export default class JassStartLocPrio extends JassEnum {
	}

}
declare module 'utils/jass2/types/raritycontrol' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type raritycontrol
	 */
	export default class JassRarityControl extends JassEnum {
	}

}
declare module 'utils/jass2/types/blendmode' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type blendmode
	 */
	export default class JassBlendMode extends JassEnum {
	}

}
declare module 'utils/jass2/types/texmapflags' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type texmapflags
	 */
	export default class JassTexMapFlags extends JassEnum {
	}

}
declare module 'utils/jass2/types/effecttype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type effecttype
	 */
	export default class JassEffectType extends JassEnum {
	}

}
declare module 'utils/jass2/types/weathereffect' {
	import JassHandle from 'utils/jass2/types/handle';
	import JassRect from 'utils/jass2/types/rect';
	/**
	 * type weathereffect
	 */
	export default class JassWeatherEffect extends JassHandle {
	    whichRect: JassRect;
	    effectId: string;
	    enabled: boolean;
	    constructor(whichRect: JassRect, effectId: string);
	}

}
declare module 'utils/jass2/types/fogstate' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type fogstate
	 */
	export default class JassFogState extends JassEnum {
	}

}
declare module 'utils/jass2/types/version' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type version
	 */
	export default class JassVersion extends JassEnum {
	}

}
declare module 'utils/jass2/types/itemtype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type itemtype
	 */
	export default class JassItemType extends JassEnum {
	}

}
declare module 'utils/jass2/types/attacktype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type attacktype
	 */
	export default class JassAttackType extends JassEnum {
	}

}
declare module 'utils/jass2/types/damagetype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type damagetype
	 */
	export default class JassDamageType extends JassEnum {
	}

}
declare module 'utils/jass2/types/weapontype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type weapontype
	 */
	export default class JassWeaponType extends JassEnum {
	}

}
declare module 'utils/jass2/types/soundtype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type soundtype
	 */
	export default class JassSoundType extends JassEnum {
	}

}
declare module 'utils/jass2/types/pathingtype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type pathingtype
	 */
	export default class JassPathingType extends JassEnum {
	}

}
declare module 'utils/jass2/types/index' {
	import JassHandle from 'utils/jass2/types/handle';
	import JassAgent from 'utils/jass2/types/agent';
	import JassPlayer from 'utils/jass2/types/player';
	import JassWidget from 'utils/jass2/types/widget';
	import JassUnit from 'utils/jass2/types/unit';
	import JassForce from 'utils/jass2/types/force';
	import JassGroup from 'utils/jass2/types/group';
	import JassTrigger from 'utils/jass2/types/trigger';
	import JassTimer from 'utils/jass2/types/timer';
	import JassLocation from 'utils/jass2/types/location';
	import JassRegion from 'utils/jass2/types/region';
	import JassRect from 'utils/jass2/types/rect';
	import JassRace from 'utils/jass2/types/race';
	import JassAllianceType from 'utils/jass2/types/alliancetype';
	import JassRacePreference from 'utils/jass2/types/racepreference';
	import JassGameState from 'utils/jass2/types/gamestate';
	import JassIGameState from 'utils/jass2/types/igamestate';
	import JassFGameState from 'utils/jass2/types/fgamestate';
	import JassPlayerState from 'utils/jass2/types/playerstate';
	import JassPlayerScore from 'utils/jass2/types/playerscore';
	import JassPlayerGameResult from 'utils/jass2/types/playergameresult';
	import JassUnitState from 'utils/jass2/types/unitstate';
	import JassAiDifficulty from 'utils/jass2/types/aidifficulty';
	import JassEventId from 'utils/jass2/types/eventid';
	import JassGameEvent from 'utils/jass2/types/gameevent';
	import JassPlayerEvent from 'utils/jass2/types/playerevent';
	import JassPlayerUnitEvent from 'utils/jass2/types/playerunitevent';
	import JassUnitEvent from 'utils/jass2/types/unitevent';
	import JassLimitOp from 'utils/jass2/types/limitop';
	import JassWidgetEvent from 'utils/jass2/types/widgetevent';
	import JassDialogEvent from 'utils/jass2/types/dialogevent';
	import JassUnitType from 'utils/jass2/types/unittype';
	import JassGameSpeed from 'utils/jass2/types/gamespeed';
	import JassGameDifficulty from 'utils/jass2/types/gamedifficulty';
	import JassGameType from 'utils/jass2/types/gametype';
	import JassMapFlag from 'utils/jass2/types/mapflag';
	import JassMapVisibility from 'utils/jass2/types/mapvisibility';
	import JassMapSetting from 'utils/jass2/types/mapsetting';
	import JassMapDensity from 'utils/jass2/types/mapdensity';
	import JassMapControl from 'utils/jass2/types/mapcontrol';
	import JassPlayerSlotState from 'utils/jass2/types/playerslotstate';
	import JassVolumeGroup from 'utils/jass2/types/volumegroup';
	import JassCameraField from 'utils/jass2/types/camerafield';
	import JassCameraSetup from 'utils/jass2/types/camerasetup';
	import JassPlayerColor from 'utils/jass2/types/playercolor';
	import JassPlacement from 'utils/jass2/types/placement';
	import JassStartLocPrio from 'utils/jass2/types/startlocprio';
	import JassRarityControl from 'utils/jass2/types/raritycontrol';
	import JassBlendMode from 'utils/jass2/types/blendmode';
	import JassTexMapFlags from 'utils/jass2/types/texmapflags';
	import JassEffectType from 'utils/jass2/types/effecttype';
	import JassWeatherEffect from 'utils/jass2/types/weathereffect';
	import JassFogState from 'utils/jass2/types/fogstate';
	import JassVersion from 'utils/jass2/types/version';
	import JassItemType from 'utils/jass2/types/itemtype';
	import JassAttackType from 'utils/jass2/types/attacktype';
	import JassDamageType from 'utils/jass2/types/damagetype';
	import JassWeaponType from 'utils/jass2/types/weapontype';
	import JassSoundType from 'utils/jass2/types/soundtype';
	import JassPathingType from 'utils/jass2/types/pathingtype';
	export { JassHandle, JassAgent, JassPlayer, JassWidget, JassUnit, JassForce, JassGroup, JassTrigger, JassTimer, JassLocation, JassRegion, JassRect, JassRace, JassAllianceType, JassRacePreference, JassGameState, JassIGameState, JassFGameState, JassPlayerState, JassPlayerScore, JassPlayerGameResult, JassUnitState, JassAiDifficulty, JassEventId, JassGameEvent, JassPlayerEvent, JassPlayerUnitEvent, JassUnitEvent, JassLimitOp, JassWidgetEvent, JassDialogEvent, JassUnitType, JassGameSpeed, JassGameDifficulty, JassGameType, JassMapFlag, JassMapVisibility, JassMapSetting, JassMapDensity, JassMapControl, JassPlayerSlotState, JassVolumeGroup, JassCameraField, JassCameraSetup, JassPlayerColor, JassPlacement, JassStartLocPrio, JassRarityControl, JassBlendMode, JassTexMapFlags, JassEffectType, JassWeatherEffect, JassFogState, JassVersion, JassItemType, JassAttackType, JassDamageType, JassWeaponType, JassSoundType, JassPathingType, };

}
declare module 'utils/jass2/natives' {
	import Context from 'utils/jass2/context';
	export default function bindNatives(C: Context): void;

}
declare module 'utils/jass2/types/mousebuttontype' {
	import JassEnum from 'utils/jass2/types/enum';
	/**
	 * type buttontype
	 */
	export default class JassMouseButtonType extends JassEnum {
	}

}
declare module 'utils/jass2/constanthandles' {
	import JassPlayerColor from 'utils/jass2/types/playercolor';
	import JassRace from 'utils/jass2/types/race';
	import JassPlayerGameResult from 'utils/jass2/types/playergameresult';
	import JassAllianceType from 'utils/jass2/types/alliancetype';
	import JassVersion from 'utils/jass2/types/version';
	import JassAttackType from 'utils/jass2/types/attacktype';
	import JassDamageType from 'utils/jass2/types/damagetype';
	import JassWeaponType from 'utils/jass2/types/weapontype';
	import JassPathingType from 'utils/jass2/types/pathingtype';
	import JassMouseButtonType from 'utils/jass2/types/mousebuttontype';
	import JassRacePreference from 'utils/jass2/types/racepreference';
	import JassMapControl from 'utils/jass2/types/mapcontrol';
	import JassGameType from 'utils/jass2/types/gametype';
	import JassMapFlag from 'utils/jass2/types/mapflag';
	import JassPlacement from 'utils/jass2/types/placement';
	import JassStartLocPrio from 'utils/jass2/types/startlocprio';
	import JassMapDensity from 'utils/jass2/types/mapdensity';
	import JassGameDifficulty from 'utils/jass2/types/gamedifficulty';
	import JassGameSpeed from 'utils/jass2/types/gamespeed';
	import JassPlayerSlotState from 'utils/jass2/types/playerslotstate';
	import JassVolumeGroup from 'utils/jass2/types/volumegroup';
	import JassIGameState from 'utils/jass2/types/igamestate';
	import JassFGameState from 'utils/jass2/types/fgamestate';
	import JassPlayerState from 'utils/jass2/types/playerstate';
	import JassUnitState from 'utils/jass2/types/unitstate';
	import JassAiDifficulty from 'utils/jass2/types/aidifficulty';
	import JassPlayerScore from 'utils/jass2/types/playerscore';
	import JassGameEvent from 'utils/jass2/types/gameevent';
	import JassPlayerEvent from 'utils/jass2/types/playerevent';
	import JassPlayerUnitEvent from 'utils/jass2/types/playerunitevent';
	import JassUnitEvent from 'utils/jass2/types/unitevent';
	import JassWidgetEvent from 'utils/jass2/types/widgetevent';
	import JassDialogEvent from 'utils/jass2/types/dialogevent';
	import JassLimitOp from 'utils/jass2/types/limitop';
	import JassUnitType from 'utils/jass2/types/unittype';
	import JassItemType from 'utils/jass2/types/itemtype';
	import JassCameraField from 'utils/jass2/types/camerafield';
	import JassBlendMode from 'utils/jass2/types/blendmode';
	import JassRarityControl from 'utils/jass2/types/raritycontrol';
	import JassTexMapFlags from 'utils/jass2/types/texmapflags';
	import JassFogState from 'utils/jass2/types/fogstate';
	import JassEffectType from 'utils/jass2/types/effecttype';
	import JassSoundType from 'utils/jass2/types/soundtype';
	export default function constantHandles(): {
	    playerColors: JassPlayerColor[];
	    races: JassRace[];
	    playerGameResults: JassPlayerGameResult[];
	    allianceTypes: JassAllianceType[];
	    versions: JassVersion[];
	    attackTypes: JassAttackType[];
	    damageTypes: JassDamageType[];
	    weaponTypes: JassWeaponType[];
	    pathingTypes: JassPathingType[];
	    mouseButtonTypes: JassMouseButtonType[];
	    racePrefs: JassRacePreference[];
	    mapControls: JassMapControl[];
	    gameTypes: JassGameType[];
	    mapFlags: JassMapFlag[];
	    placements: JassPlacement[];
	    startLocPrios: JassStartLocPrio[];
	    mapDensities: JassMapDensity[];
	    gameDifficulties: JassGameDifficulty[];
	    gameSpeeds: JassGameSpeed[];
	    playerSlotStates: JassPlayerSlotState[];
	    volumeGroups: JassVolumeGroup[];
	    gameStates: (JassIGameState | JassFGameState)[];
	    playerStates: JassPlayerState[];
	    unitStates: JassUnitState[];
	    aiDifficulties: JassAiDifficulty[];
	    playerScores: JassPlayerScore[];
	    events: (JassGameEvent | JassPlayerEvent | JassPlayerUnitEvent | JassUnitEvent | JassWidgetEvent | JassDialogEvent)[];
	    limitOps: JassLimitOp[];
	    unitTypes: JassUnitType[];
	    itemTypes: JassItemType[];
	    cameraFields: JassCameraField[];
	    blendModes: JassBlendMode[];
	    rarityControls: JassRarityControl[];
	    texMapFlags: JassTexMapFlags[];
	    fogStates: JassFogState[];
	    effectTypes: JassEffectType[];
	    soundTypes: JassSoundType[];
	};

}
declare module 'utils/jass2/thread' {
	import { lua_State } from 'fengari/src/lua';
	import JassTrigger from 'utils/jass2/types/trigger';
	import JassTimer from 'utils/jass2/types/timer';
	import JassUnit from 'utils/jass2/types/unit';
	/**
	 * A thread.
	 */
	export default class Thread {
	    L: lua_State;
	    sleep: number;
	    expiredTimer: JassTimer | null;
	    triggerUnit: JassUnit | null;
	    triggeringTrigger: JassTrigger | null;
	    constructor(L: lua_State, data: {
	        expiredTimer?: JassTimer;
	        triggerUnit?: JassUnit;
	        triggeringTrigger?: JassTrigger;
	    });
	}

}
declare module 'utils/jass2/context' {
	/// <reference types="node" />
	import { EventEmitter } from 'events';
	import { lua_State } from 'fengari/src/lua';
	import JassPlayer from 'utils/jass2/types/player';
	import Thread from 'utils/jass2/thread';
	import War3Map from 'parsers/w3x/map';
	import JassHandle from 'utils/jass2/types/handle';
	import JassLocation from 'utils/jass2/types/location';
	import JassTimer from 'utils/jass2/types/timer';
	import { JassTrigger } from 'utils/jass2/types/index';
	/**
	 * A Jass2 context.
	 */
	export default class Context extends EventEmitter {
	    L: lua_State;
	    map: War3Map | null;
	    handle: number;
	    freeHandles: number[];
	    handles: (JassHandle | null)[];
	    name: string;
	    description: string;
	    players: JassPlayer[];
	    actualPlayers: number;
	    startLocations: JassLocation[];
	    constantHandles: {
	        playerColors: import("./types").JassPlayerColor[];
	        races: import("./types").JassRace[];
	        playerGameResults: import("./types").JassPlayerGameResult[];
	        allianceTypes: import("./types").JassAllianceType[];
	        versions: import("./types").JassVersion[];
	        attackTypes: import("./types").JassAttackType[];
	        damageTypes: import("./types").JassDamageType[];
	        weaponTypes: import("./types").JassWeaponType[];
	        pathingTypes: import("./types").JassPathingType[];
	        mouseButtonTypes: import("./types/mousebuttontype").default[];
	        racePrefs: import("./types").JassRacePreference[];
	        mapControls: import("./types").JassMapControl[];
	        gameTypes: import("./types").JassGameType[];
	        mapFlags: import("./types").JassMapFlag[];
	        placements: import("./types").JassPlacement[];
	        startLocPrios: import("./types").JassStartLocPrio[];
	        mapDensities: import("./types").JassMapDensity[];
	        gameDifficulties: import("./types").JassGameDifficulty[];
	        gameSpeeds: import("./types").JassGameSpeed[];
	        playerSlotStates: import("./types").JassPlayerSlotState[];
	        volumeGroups: import("./types").JassVolumeGroup[];
	        gameStates: (import("./types").JassIGameState | import("./types").JassFGameState)[];
	        playerStates: import("./types").JassPlayerState[];
	        unitStates: import("./types").JassUnitState[];
	        aiDifficulties: import("./types").JassAiDifficulty[];
	        playerScores: import("./types").JassPlayerScore[];
	        events: (import("./types").JassGameEvent | import("./types").JassPlayerEvent | import("./types").JassPlayerUnitEvent | import("./types").JassUnitEvent | import("./types").JassWidgetEvent | import("./types").JassDialogEvent)[];
	        limitOps: import("./types").JassLimitOp[];
	        unitTypes: import("./types").JassUnitType[];
	        itemTypes: import("./types").JassItemType[];
	        cameraFields: import("./types").JassCameraField[];
	        blendModes: import("./types").JassBlendMode[];
	        rarityControls: import("./types").JassRarityControl[];
	        texMapFlags: import("./types").JassTexMapFlags[];
	        fogStates: import("./types").JassFogState[];
	        effectTypes: import("./types").JassEffectType[];
	        soundTypes: import("./types").JassSoundType[];
	    };
	    timers: Set<JassTimer>;
	    triggers: Set<JassTrigger>;
	    threads: Set<Thread>;
	    currentThread: Thread | null;
	    enumUnit: JassHandle | null;
	    filterUnit: JassHandle | null;
	    enumPlayer: JassHandle | null;
	    t: number;
	    constructor();
	    start(): void;
	    step(): void;
	    addHandle(handle: JassHandle): JassHandle;
	    freeHandle(handle: JassHandle): void;
	    call(name?: string | number): void;
	    run(code: string, isJass: boolean): void;
	    open(map: War3Map): void;
	}

}
declare module 'utils/jass2/compilenatives' {
	export default function compileNatives(jass: string): string;

}
declare module 'utils/jass2/rebuild' {
	import War3Map from 'parsers/w3x/map';
	export default function rebuild(map: War3Map, commonj: string, blizzardj: string, callback: Function): void;

}
declare module 'utils/jass2/index' {
	import jass2lua from 'utils/jass2/jass2lua';
	import Context from 'utils/jass2/context';
	import compileNatives from 'utils/jass2/compilenatives';
	import bindNatives from 'utils/jass2/natives';
	import rebuild from 'utils/jass2/rebuild'; const _default: {
	    jass2lua: typeof jass2lua;
	    Context: typeof Context;
	    compileNatives: typeof compileNatives;
	    bindNatives: typeof bindNatives;
	    rebuild: typeof rebuild;
	};
	export default _default;

}
declare module 'utils/index' {
	import UnitTester from 'utils/unittester';
	import mdxSanityTest from 'utils/mdxsanitytest';
	import blpSanityTest from 'utils/blpsanitytest';
	import convertWeu from 'utils/weu';
	import mdlSourceMap from 'utils/mdlsourcemap';
	import { MappedData } from 'utils/mappeddata'; const _default: {
	    UnitTester: typeof UnitTester;
	    mdxSanityTest: typeof mdxSanityTest;
	    blpSanityTest: typeof blpSanityTest;
	    convertWeu: typeof convertWeu;
	    mdlSourceMap: typeof mdlSourceMap;
	    MappedData: typeof MappedData;
	    jass2: {
	        jass2lua: typeof import("./jass2/jass2lua").default;
	        Context: typeof import("./jass2/context").default;
	        compileNatives: typeof import("./jass2/compilenatives").default;
	        bindNatives: typeof import("./jass2/natives").default;
	        rebuild: typeof import("./jass2/rebuild").default;
	    };
	};
	export default _default;

}
declare module 'index' {
	 const _default: {
	    version: string;
	    common: {
	        glMatrix: typeof import("gl-matrix");
	        glMatrixAddon: typeof import("./common/gl-matrix-addon");
	        math: typeof import("./common/math");
	        canvas: typeof import("./common/canvas");
	        geometry: typeof import("./common/geometry");
	        BinaryStream: typeof import("./common/binarystream").default;
	        BitStream: typeof import("./common/bitstream").default;
	        urlWithParams: typeof import("./common/urlwithparams").default;
	    };
	    parsers: {
	        ini: {
	            File: typeof import("./parsers/ini/file").default;
	        };
	        slk: {
	            File: typeof import("./parsers/slk/file").default;
	        };
	        m3: {
	            Model: typeof import("./parsers/m3/model").default;
	        };
	        mdlx: {
	            Model: typeof import("./parsers/mdlx/model").default;
	        };
	        mpq: {
	            Archive: typeof import("./parsers/mpq/archive").default;
	        };
	        w3x: {
	            Map: typeof import("./parsers/w3x/map").default;
	            doo: {
	                File: typeof import("./parsers/w3x/doo/file").default;
	            };
	            imp: {
	                File: typeof import("./parsers/w3x/imp/file").default;
	            };
	            mmp: {
	                File: typeof import("./parsers/w3x/mmp/file").default;
	            };
	            shd: {
	                File: typeof import("./parsers/w3x/shd/file").default;
	            };
	            w3c: {
	                File: typeof import("./parsers/w3x/w3c/file").default;
	            };
	            w3d: {
	                File: typeof import("./parsers/w3x/w3d/file").default;
	            };
	            w3e: {
	                File: typeof import("./parsers/w3x/w3e/file").default;
	            };
	            w3i: {
	                File: typeof import("./parsers/w3x/w3i/file").default;
	            };
	            w3o: {
	                File: typeof import("./parsers/w3x/w3o/file").default;
	            };
	            w3r: {
	                File: typeof import("./parsers/w3x/w3r/file").default;
	            };
	            w3s: {
	                File: typeof import("./parsers/w3x/w3s/file").default;
	            };
	            w3u: {
	                File: typeof import("./parsers/w3x/w3u/file").default;
	            };
	            wct: {
	                File: typeof import("./parsers/w3x/wct/file").default;
	            };
	            wpm: {
	                File: typeof import("./parsers/w3x/wpm/file").default;
	            };
	            wtg: {
	                File: typeof import("./parsers/w3x/wtg/file").default;
	                TriggerData: typeof import("./parsers/w3x/wtg/triggerdata").default;
	            };
	            wts: {
	                File: typeof import("./parsers/w3x/wts/file").default;
	            };
	            unitsdoo: {
	                File: typeof import("./parsers/w3x/unitsdoo/file").default;
	            };
	            w3f: {
	                File: typeof import("./parsers/w3x/w3f/file").default;
	            };
	        };
	        blp: {
	            Image: typeof import("./parsers/blp/image").default;
	        };
	        dds: {
	            Image: typeof import("./parsers/dds/image").DdsImage;
	            FOURCC_DXT1: number;
	            FOURCC_DXT3: number;
	            FOURCC_DXT5: number;
	            FOURCC_ATI2: number;
	        };
	    };
	    viewer: {
	        ModelViewer: typeof import("./viewer/viewer").default;
	        Scene: typeof import("./viewer/scene").default;
	        Camera: typeof import("./viewer/camera").default;
	        handlers: {
	            blp: {
	                extensions: string[][];
	                resource: typeof import("./viewer/handlers/blp/texture").default;
	            };
	            dds: {
	                load(viewer: import("./viewer/viewer").default): boolean;
	                extensions: string[][];
	                resource: typeof import("./viewer/handlers/dds/texture").default;
	            };
	            geo: {
	                extensions: string[][];
	                load(viewer: import("./viewer/viewer").default): boolean;
	                resource: typeof import("./viewer/handlers/geo/model").default;
	            };
	            m3: {
	                extensions: string[][];
	                load(viewer: import("./viewer/viewer").default): boolean;
	                resource: typeof import("./viewer/handlers/m3/model").default;
	            };
	            mdx: {
	                extensions: string[][];
	                load(viewer: import("./viewer/viewer").default): boolean;
	                resource: typeof import("./viewer/handlers/mdx/model").default;
	            };
	            tga: {
	                extensions: string[][];
	                resource: typeof import("./viewer/handlers/tga/texture").default;
	            };
	            War3MapViewer: typeof import("./viewer/handlers/w3x/viewer").default;
	        };
	    };
	    utils: {
	        UnitTester: typeof import("./utils/unittester").default;
	        mdxSanityTest: typeof import("./utils/mdxsanitytest").default;
	        blpSanityTest: typeof import("./utils/blpsanitytest").default;
	        convertWeu: typeof import("./utils/weu").default;
	        mdlSourceMap: typeof import("./utils/mdlsourcemap").default;
	        MappedData: typeof import("./utils/mappeddata").MappedData;
	        jass2: {
	            jass2lua: typeof import("./utils/jass2/jass2lua").default;
	            Context: typeof import("./utils/jass2/context").default;
	            compileNatives: typeof import("./utils/jass2/compilenatives").default;
	            bindNatives: typeof import("./utils/jass2/natives").default;
	            rebuild: typeof import("./utils/jass2/rebuild").default;
	        };
	    };
	};
	export default _default;

}
/**
 * A shared type of all typed arrays.
 */
type TypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

/**
 * A standard object mapping strings to strings.
 */
type StringObject = { [key: string]: string };

/**
 * A standard object mapping strings to numbers.
 */
type NumberObject = { [key: string]: number };

/**
 * A standard object mapping strings to booleans.
 */
type BooleanObject = { [key: string]: boolean };
declare module 'common/sstrhash2' {
	/**
	 * A hash function used by Warcraft 3's Jass virtual machine.
	 *
	 * See http://burtleburtle.net/bob/hash/doobs.html
	 */
	export default function sstrhash2(key: string): number;

}
declare module 'parsers/m3/light' {
	import BinaryStream from 'common/binarystream';
	import IndexEntry from 'parsers/m3/indexentry';
	import { M3ParserFloat32AnimationReference, M3ParserVector3AnimationReference } from 'parsers/m3/animationreference';
	/**
	 * A light.
	 */
	export default class M3ParserLight {
	    version: number;
	    type: number;
	    unknown0: number;
	    bone: number;
	    flags: number;
	    unknown1: number;
	    unknown2: number;
	    lightColor: M3ParserVector3AnimationReference;
	    lightIntensity: M3ParserFloat32AnimationReference;
	    specularColor: M3ParserVector3AnimationReference;
	    specularIntensity: M3ParserFloat32AnimationReference;
	    attenuationFar: M3ParserFloat32AnimationReference;
	    unknown3: number;
	    attenuationNear: M3ParserFloat32AnimationReference;
	    hotSpot: M3ParserFloat32AnimationReference;
	    falloff: M3ParserFloat32AnimationReference;
	    constructor(reader: BinaryStream, version: number, index: IndexEntry[]);
	}

}
declare module 'utils/jass2/types/hashtable' {
	import JassAgent from 'utils/jass2/types/agent';
	/**
	 * type unit
	 */
	export default class JassHashTable extends JassAgent {
	    table: Map<number, Map<number, any>>;
	    save(parentKey: number, childKey: number, value: any): void;
	    load(parentKey: number, childKey: number, defaultValue?: number): any;
	    have(parentKey: number, childKey: number): boolean;
	    remove(parentKey: number, childKey: number): void;
	    flush(): void;
	    flushChild(parentKey: number): void;
	}

}
declare module 'viewer/gl/clientdatatexture' {
	/**
	 * A data texture.
	 */
	export default class ClientDataTexture {
	    gl: WebGLRenderingContext;
	    texture: WebGLTexture;
	    width: number;
	    height: number;
	    arrayBuffer: ArrayBuffer;
	    byteView: Uint8Array | null;
	    floatView: Float32Array | null;
	    constructor(gl: WebGLRenderingContext, width?: number, height?: number);
	    reserve(width: number, height: number): void;
	    bindAndUpdate(width?: number, height?: number): void;
	}

}
declare module 'viewer/handlers/m3/boundingshape' {
	import BoundingShape from 'parsers/m3/boundingshape';
	/**
	 * An M3 bounding shape.
	 */
	export default class M3BoundingShape {
	    bone: number;
	    matrix: Float32Array;
	    constructor(boundingshape: BoundingShape);
	}

}
