
/**
 * Returns a promise that will resolve with the data from the given path.
 * The data type determines the returned object:
 *     "image" => Image
 *     "text" => string
 *     "arrayBuffer" => ArrayBuffer
 *     "blob" => Blob
 *
 * @param {string} path
 * @param {string} dataType
 * @return {Promise<Object>}
 */
export default async function fetchDataType(path, dataType) {
  if (dataType === 'image') {
    // Promise wrapper for an image load.
    return new Promise((resolve) => {
      let image = new Image();

      image.onload = () => {
        resolve({type: 'image', data: image});
      };

      image.onerror = (e) => {
        resolve({type: 'error', error: 'ImageError', data: e});
      };

      image.src = path;
    });
  } else {
    let response;

    // Fetch.
    try {
      response = await fetch(path);
    } catch (e) {
      return {type: 'error', error: 'NetworkError', data: e};
    }

    // Fetch went ok?
    if (!response.ok) {
      return {type: 'error', error: 'HttpError', data: response};
    }

    let data;

    // Try to get the requested data type.
    try {
      if (dataType === 'text') {
        data = await response.text();
      } else if (dataType === 'arrayBuffer') {
        data = await response.arrayBuffer();
      } else if (dataType === 'blob') {
        data = await response.blob();
      }
    } catch (e) {
      return {type: 'error', error: 'DataError', data: e};
    }

    return {type: dataType, data};
  }
}
