/**
 * The valid data type names for resource fetches.
 */
export type FetchDataTypeName = 'image' | 'text' | 'arrayBuffer' | 'bytes' | 'blob';

/**
 * The valid data types for resource fetches.
 */
export type FetchDataType = HTMLImageElement | string | ArrayBuffer | Uint8Array | Blob;

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
 *     "bytes" => Uint8Array
 *     "blob" => Blob
 */
export async function fetchDataType(path: string, dataType: FetchDataTypeName) {
  if (dataType === 'image') {
    // Promise wrapper for an image load.
    return new Promise((resolve: (data: FetchResult) => void) => {
      let image = new Image();

      image.onload = () => {
        resolve({ ok: true, data: image });
      };

      image.onerror = (e) => {
        resolve({ ok: false, error: 'Image Error', data: e });
      };

      image.src = path;
    });
  } else {
    let response: Response;

    // Fetch.
    try {
      response = await fetch(path);
    } catch (e) {
      return <FetchResult>{ ok: false, error: 'Network Error', data: e };
    }

    // Fetch went ok?
    if (!response.ok) {
      return <FetchResult>{ ok: false, error: 'Http Error', data: response };
    }

    // Try to get the requested data type.
    try {
      let data: string | ArrayBuffer | Blob | null = null;

      if (dataType === 'text') {
        data = await response.text();
      } else if (dataType === 'arrayBuffer' || dataType === 'bytes') {
        data = await response.arrayBuffer();
      } else if (dataType === 'blob') {
        data = await response.blob();
      }

      if (dataType === 'bytes') {
        data = new Uint8Array(<ArrayBuffer>data);
      }

      return <FetchResult>{ ok: true, data };
    } catch (e) {
      return <FetchResult>{ ok: false, error: 'Data Error', data: e };
    }
  }
}
