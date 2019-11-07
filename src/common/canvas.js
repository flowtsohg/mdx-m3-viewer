import {powerOfTwo} from './math';

let canvas = document.createElement('canvas');
let ctx = canvas.getContext('2d');

let canvas2 = document.createElement('canvas');
let ctx2 = canvas2.getContext('2d');

/**
 * @param {Blob} blob
 * @return {Promise<Image>}
 */
export function blobToImage(blob) {
  return new Promise((resolve, reject) => {
    let url = URL.createObjectURL(blob);
    let image = new Image();

    image.onload = () => {
      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      resolve(image);
    };

    image.onerror = (e) => {
      reject(e);
    };

    image.src = url;
  });
}

/**
 * @param {Blob} blob
 * @return {Promise<ImageData>}
 */
export function blobToImageData(blob) {
  return new Promise((resolve, reject) => {
    let url = URL.createObjectURL(blob);
    let image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(url);

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      resolve(ctx.getImageData(0, 0, image.width, image.height));
    };

    image.onerror = (e) => {
      reject(e);
    };

    image.src = url;
  });
}

/**
 * @param {ImageData} imageData
 * @return {Promise<Blob>}
 */
export function imageDataToBlob(imageData) {
  return new Promise((resolve, reject) => {
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}

/**
 * @param {ImageData} imageData
 * @return {string}
 */
export function imageDataToDataUrl(imageData) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

/**
 * @param {ImageData} imageData
 * @return {Image}
 */
export function imageDataToImage(imageData) {
  let image = new Image();

  image.src = imageDataToDataUrl(imageData);

  return image;
}

/**
 * @param {Image} image
 * @return {ImageData}
 */
export function imageToImageData(image) {
  let width = image.width;
  let height = image.height;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(image, 0, 0);

  return ctx.getImageData(0, 0, width, height);
}

/**
 * @param {ImageData} imageData
 * @return {ImageData}
 */
export function scaleNPOT(imageData) {
  let width = imageData.width;
  let height = imageData.height;
  let potWidth = powerOfTwo(width);
  let potHeight = powerOfTwo(height);

  if (width !== potWidth || height !== potHeight) {
    return resizeImageData(imageData, potWidth, potHeight);
  }

  return imageData;
}

/**
 * @param {ImageData} data
 * @param {number} width
 * @param {number} height
 * @return {ImageData}
 */
export function resizeImageData(data, width, height) {
  let srcWidth = data.width;
  let srcHeight = data.height;

  // ImageData
  if (data instanceof ImageData) {
    canvas.width = srcWidth;
    canvas.height = srcHeight;

    ctx.putImageData(data, 0, 0);

    canvas2.width = width;
    canvas2.height = height;

    ctx2.drawImage(canvas, 0, 0, width, height);

    return ctx2.getImageData(0, 0, width, height);
    // Assumed to be Image
  } else {
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(data, 0, 0, width, height);

    return ctx.getImageData(0, 0, width, height);
  }
}
