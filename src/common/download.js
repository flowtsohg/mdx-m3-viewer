/**
 * @param {URL} url
 * @param {string} name
 */
export function downloadUrl(url, name) {
  let a = document.createElement('a');

  a.href = url;
  a.download = name;

  a.dispatchEvent(new MouseEvent('click'));
}

/**
 * @param {Blob} blob
 * @param {string} name
 */
export function downloadBlob(blob, name) {
  let url = URL.createObjectURL(blob);

  downloadUrl(url, name);

  URL.revokeObjectURL(url);
}

/**
 * @param {ArrayBuffer} arrayBuffer
 * @param {string} name
 */
export function downloadBuffer(arrayBuffer, name) {
  downloadBlob(new Blob([arrayBuffer], {type: 'application/octet-stream'}), name);
}
