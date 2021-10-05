let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;
let canvas2: HTMLCanvasElement;
let ctx2: CanvasRenderingContext2D;

// Only create the canvases and contexts in browsers.
if (typeof window === 'object') {
  canvas = document.createElement('canvas');
  ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
  canvas2 = document.createElement('canvas');
  ctx2 = <CanvasRenderingContext2D>canvas2.getContext('2d');
}

export function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve,  reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = (): void => {
      resolve(image);
    };

    image.onerror = (e): void => {
      reject(e);
    };

    image.src = url;
  });
}

export function blobToImageData(blob: Blob): Promise<ImageData> {
  return new Promise<ImageData>((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const image = new Image();

    image.onload = (): void => {
      URL.revokeObjectURL(url);

      canvas.width = image.width;
      canvas.height = image.height;

      ctx.drawImage(image, 0, 0);

      resolve(ctx.getImageData(0, 0, image.width, image.height));
    };

    image.onerror = (e): void => {
      reject(e);
    };

    image.src = url;
  });
}

export function imageDataToBlob(imageData: ImageData): Promise<Blob | null> {
  return new Promise((resolve: BlobCallback) => {
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    canvas.toBlob((blob) => {
      resolve(blob);
    });
  });
}

export function imageDataToDataUrl(imageData: ImageData): string {
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

export function imageDataToImage(imageData: ImageData): HTMLImageElement {
  const image = new Image();

  image.src = imageDataToDataUrl(imageData);

  return image;
}

export function imageToImageData(image: TexImageSource): ImageData {
  const width = image.width;
  const height = image.height;

  canvas.width = width;
  canvas.height = height;

  ctx.drawImage(<CanvasImageSource>image, 0, 0);

  return ctx.getImageData(0, 0, width, height);
}

export function resizeImageData(data: TexImageSource, width: number, height: number): ImageData {
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
