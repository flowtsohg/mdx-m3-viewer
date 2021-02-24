import { powerOfTwo } from './math';

const canvas = document.createElement('canvas');
const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
const canvas2 = document.createElement('canvas');
const ctx2 = <CanvasRenderingContext2D>canvas2.getContext('2d');

export function blobToImage(blob: Blob) {
  return new Promise((resolve: (image: HTMLImageElement) => void) => {
    let url = URL.createObjectURL(blob);
    let image = new Image();

    image.onload = () => {
      resolve(image);
    };

    image.onerror = () => {
      resolve(image);
    };

    image.src = url;
  });
}

export function blobToImageData(blob: Blob) {
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

export function imageDataToBlob(imageData: ImageData) {
  return new Promise((resolve: BlobCallback) => {
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}

export function imageDataToDataUrl(imageData: ImageData) {
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

export function imageDataToImage(imageData: ImageData) {
  let image = new Image();

  image.src = imageDataToDataUrl(imageData);

  return image;
}

export function imageToImageData(image: TexImageSource) {
  let width = image.width;
  let height = image.height;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(<CanvasImageSource>image, 0, 0);

  return ctx.getImageData(0, 0, width, height);
}

export function resizeImageData(data: TexImageSource, width: number, height: number) {
  if (data instanceof ImageData) {
    canvas.width = data.width;
    canvas.height = data.height;

    ctx.putImageData(data, 0, 0);

    canvas2.width = width;
    canvas2.height = height;

    ctx2.drawImage(canvas, 0, 0, width, height);

    return ctx2.getImageData(0, 0, width, height);
  } else {
    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(data, 0, 0, width, height);

    return ctx.getImageData(0, 0, width, height);
  }
}
