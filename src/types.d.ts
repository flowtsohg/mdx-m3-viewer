/**
 * A shared type of all typed arrays.
 */
type TypedArray = Int8Array | Int16Array | Int32Array | Uint8Array | Uint16Array | Uint32Array | Uint8ClampedArray | Float32Array | Float64Array;

/**
 * A path solver used for resolving fetch paths.
 */
type PathSolver = (src: any, params?: any) => [any, string, boolean];

/**
 * The data sent to every resource as a part of the loading process.
 */
type ResourceData = { viewer: any, handler: object, extension?: string, pathSolver?: PathSolver, fetchUrl?: string };
