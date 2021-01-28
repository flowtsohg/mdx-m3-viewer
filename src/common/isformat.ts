/**
 * Detects if the given object is a PNG source.
 */
export function isPng(object: any) {
  if (object instanceof ArrayBuffer && object.byteLength > 8) {
    let bytes = new Uint8Array(object, 0, 8);

    // PNG starts with [89 50 4E 47 0D 0A 1A 0A]
    if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 &&
      bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a) {
      return true;
    }
  }

  return false;
}

/**
 * Detects if the given object is a JPG source.
 */
export function isJpeg(object: any) {
  if (object instanceof ArrayBuffer) {
    let bytes = new Uint8Array(object);
    let l = bytes.length;

    // JPG starts with [FF D8] and ends with [FF D9].
    if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[l - 2] === 0xff && bytes[l - 1] === 0xd9) {
      return true;
    }
  }

  return false;
}

/**
 * Detects if the given object is a GIF source.
 */
export function isGif(object: any) {
  if (object instanceof ArrayBuffer && object.byteLength > 6) {
    let bytes = new Uint8Array(object, 0, 6);

    // GIF starts with [47 49 46 38 37 61] or [47 49 46 38 39 61].
    if (bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x38 &&
      (bytes[4] === 0x37 || bytes[4] === 0x39) && bytes[5] === 0x61) {
      return true;
    }
  }

  return false;
}

/**
 * Detects if the given object is a WebP source.
 */
export function isWebP(object: any) {
  if (object instanceof ArrayBuffer && object.byteLength > 12) {
    let bytes = new Uint8Array(object, 0, 12);

    // WebP starts with [52 49 46 46] followed by the file size - 8 followed by [57 45 42 50].
    if (bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
      bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50) {
      return true;
    }
  }

  return false;
}
