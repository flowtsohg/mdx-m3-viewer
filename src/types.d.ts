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
