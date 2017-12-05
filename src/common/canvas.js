import { powerOfTwo } from './math';

let canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d');

let canvas2 = document.createElement('canvas'),
    ctx2 = canvas2.getContext('2d');

export function getImageData(image) {
    let width = image.width,
        height = image.height;

    canvas.width = width;
    canvas.height = height;

    ctx.drawImage(image, 0, 0);

    return ctx.getImageData(0, 0, width, height);
};

// Resize an Image or ImageData object to the given dimensions.
export function resizeImageData(imageData, width, height) {
    let srcWidth = imageData.width,
        srcHeight = imageData.height;

    // ImageData
    if (imageData instanceof ImageData) {
        canvas.width = srcWidth;
        canvas.height = srcHeight;

        ctx.putImageData(imageData, 0, 0);

        canvas2.width = width;
        canvas2.height = height;

        ctx2.drawImage(canvas, 0, 0, width, height);

        return ctx2.getImageData(0, 0, width, height);
    // Assumed to be Image
    } else {
        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(image, 0, 0, width, height);

        return ctx.getImageData(0, 0, width, height);
    }
};

// Given an array of Image objects, constructs a texture atlas.
// The dimensions of each tile are the dimensions of the first Image object (that is, all images are assumed to have the same size!).
// The resulting texture atlas is always square, and power of two.
export function createTextureAtlas(src) {
    let width = src[0].width,
        height = src[0].height,
        texturesPerRow = powerOfTwo(Math.sqrt(src.length)),
        pixelsPerRow = texturesPerRow * width;

    canvas.width = canvas.height = width * texturesPerRow;

    for (let i = 0, l = src.length; i < l; i++) {
        ctx.putImageData(src[i], (i % texturesPerRow) * height, Math.floor(i / texturesPerRow) * height);
    }

    return { imageData: ctx.getImageData(0, 0, canvas.width, canvas.height), columns: texturesPerRow, rows: texturesPerRow };
};
