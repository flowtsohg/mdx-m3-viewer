import { powerOfTwo } from './math';

let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

let canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');

export function blobToImage(blob) {
    return new Promise((resolve, reject) => {
        let url = URL.createObjectURL(blob),
            image = new Image();

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
};

export function blobToImageData(blob) {
    return new Promise((resolve, reject) => {
        let url = URL.createObjectURL(blob),
            image = new Image();

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
};

export function imageDataToBlob(imageData) {
    return new Promise((resolve, reject) => {
        canvas.width = imageData.width;
        canvas.height = imageData.height;

        ctx.putImageData(imageData, 0, 0);

        canvas.toBlob((blob) => {
            resolve(blob);
        });
    });
};

export function imageDataToDataUrl(imageData) {
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    return canvas.toDataURL();
};

export function imageToImageData(image) {
    let width = image.width,
        height = image.height;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0);

    return ctx.getImageData(0, 0, width, height);
};

export function scaleNPOT(imageData) {
    let width = imageData.width,
        height = imageData.height,
        potWidth = powerOfTwo(width),
        potHeight = powerOfTwo(height);

    if (width !== potWidth || height !== potHeight) {
        return resizeImageData(imageData, potWidth, potHeight);
    }

    return imageData;
}

// Resize an Image or ImageData object to the given dimensions.
export function resizeImageData(data, width, height) {
    let srcWidth = data.width,
        srcHeight = data.height;

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
};

export function drawImageData(dCanvas, imageData) {
    canvas.width = imageData.width;
    canvas.height = imageData.height;

    ctx.putImageData(imageData, 0, 0);

    dCanvas.getContext('2d').drawImage(canvas, 0, 0, dCanvas.width, dCanvas.height);
}

// Given an array of Image objects, constructs a texture atlas.
// The dimensions of each tile are the dimensions of the first Image object (that is, all images are assumed to have the same size!).
// The resulting texture atlas is always square, and power of two.
export function createTextureAtlas(src) {
    let width = src[0].width,
        height = src[0].height,
        texturesPerRow = powerOfTwo(Math.ceil(Math.sqrt(src.length))),
        rows = powerOfTwo(Math.ceil(src.length / texturesPerRow)),
        pixelsPerRow = texturesPerRow * width;

    canvas.width = width * texturesPerRow;
    canvas.height = height * rows;
    //canvas.height = canvas.width;

    for (let i = 0, l = src.length; i < l; i++) {
        ctx.putImageData(src[i], (i % texturesPerRow) * height, Math.floor(i / texturesPerRow) * height);
    }

    return { imageData: ctx.getImageData(0, 0, canvas.width, canvas.height), columns: texturesPerRow, rows: texturesPerRow };
};
