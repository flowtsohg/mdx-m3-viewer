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
type ResourceData = { viewer: any, extension?: string, fetchUrl?: string };

/**
 * The data sent to every handler resource as part of the loading process.
 */
type HandlerResourceData = ResourceData & { pathSolver: PathSolver };

/**
 * The valid data type names for resource fetches.
 */
type FetchDataTypeNames = 'image' | 'text' | 'arrayBuffer' | 'blob';

/**
 * The valid data types for resource fetches.
 */
type FetchDataType = HTMLImageElement | string | ArrayBuffer | Blob;

/**
 * The structure that the promise returned by fetchDataType is resolved to.
 */
interface FetchResult {
  ok: boolean;
  data: FetchDataType | Response | Event;
  error?: string;
}

/**
 * The minimal structure of handlers.
 * 
 * Additional data can be added to them for the purposes of the implementation.
 */
interface Handler {
  extensions: string[][];
  load?: (viewer: any) => boolean;
  resource: any;
}

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

/**
 * A MappedData row.
 */
type MappedDataRow = { [key: string]: string | number | boolean };
