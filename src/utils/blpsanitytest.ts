import BlpImage from '../parsers/blp/image';

/**
 * Some tools allow to setup fake mipmaps.
 * These are mipmaps that use the same JPG data as other mipmaps.
 * This is technically not valid, but can work properly in the game.
 * Not always though.
 * Sadly I don't quite know the rules.
 */
function isMipmapFake(whichMipmap: number, mipmapOffsets: Uint32Array) {
  let offset = mipmapOffsets[whichMipmap];

  for (let i = 0; i < whichMipmap; i++) {
    if (mipmapOffsets[i] === offset) {
      return true;
    }
  }

  return false;
}

/**
 * Tests for issues in BLP textures.
 */
export default function sanityTest(texture: BlpImage) {
  let messages = [];
  let content = texture.content;
  let alphaBits = texture.alphaBits;
  let mipmapOffsets = texture.mipmapOffsets;
  let mipmapSizes = texture.mipmapSizes;
  let width = texture.width;
  let height = texture.height;

  if (content !== 0 && content !== 1) {
    messages.push('Unknown content type');
  }

  if (alphaBits !== 0 && alphaBits !== 1 && alphaBits !== 4 && alphaBits !== 8) {
    messages.push(`Expected alpha bits to be 0, 1, 4, or 8, but got ${alphaBits}`);
  }

  if (width > 512 || height > 512) {
    messages.push(`Expected width and height up to 512, but got ${width}x${height}`);
  }

  if (content === 0) {
    const jpgHeader = <Uint8Array>texture.jpgHeader;

    if (jpgHeader.length > 624) {
      messages.push(`Expected the JPG header to be at most 624 bytes, but got ${jpgHeader.length}`);
    }
  }

  for (let i = 0; i < 16; i++) {
    if (mipmapSizes[i] > 0) {
      // This happens if this mipmap level supposedly exists, but we already passed the level that should have been last.
      if (width < 1 && height < 1) {
        messages.push(`Mipmap ${i}: this mipmap should not exist`);
      } else if (isMipmapFake(i, mipmapOffsets)) {
        messages.push(`Mipmap ${i}: this mipmap is fake`);
      } else {
        // In the case this is not a square texture, one dimension will get to size 1 before the other.
        width = Math.max(width, 1);
        height = Math.max(height, 1);

        if (content === 0) {
          try {
            let imageData = texture.getMipmap(i);


            if (imageData.width !== width || imageData.height !== height) {
              messages.push(`Mipmap ${i}: the JPG width (${imageData.width}) and height (${imageData.height}) do not match the mipmap width (${width}) and height (${height})`);
            }
          } catch (e) {
            messages.push(`Mipmap ${i}: JPG decoding failed`);
          }
        } else if (content === 1) {
          let pixels = width * height;
          let size = pixels + Math.ceil((pixels * alphaBits) / 8);

          if (size !== mipmapSizes[i]) {
            messages.push(`Mipmap ${i}: the declared size is ${mipmapSizes[i]}, but the real size is ${size}`);
          }
        }
      }
    }

    width >>= 1;
    height >>= 1;
  }

  return messages;
}
