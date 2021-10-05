import { isPowerOfTwo } from '../../common/math';
import { BlpImage } from '../../parsers/blp/image';

/**
 * Some tools allow to setup fake mipmaps.
 * These are mipmaps that use the same JPG data as other mipmaps.
 * This is technically not valid, but can work properly in the game.
 * Not always though.
 * Sadly I don't quite know the rules.
 */
function isMipmapFake(whichMipmap: number, mipmapOffsets: Uint32Array): boolean {
  const offset = mipmapOffsets[whichMipmap];

  for (let i = 0; i < whichMipmap; i++) {
    if (mipmapOffsets[i] === offset) {
      return true;
    }
  }

  return false;
}

export interface SanityTestNode {
  type: string;
  message: string;
}

export interface SanityTestResult {
  nodes: SanityTestNode[];
  warnings: number;
}

/**
 * Tests for issues in BLP textures.
 */
export default function sanityTest(texture: BlpImage): SanityTestResult {
  const nodes = [];
  const content = texture.content;
  const alphaBits = texture.alphaBits;
  const mipmapOffsets = texture.mipmapOffsets;
  const mipmapSizes = texture.mipmapSizes;
  let width = texture.width;
  let height = texture.height;

  if (content !== 0 && content !== 1) {
    nodes.push({ type: 'warning', message: 'Unknown content type' });
  }

  if (alphaBits !== 0 && alphaBits !== 1 && alphaBits !== 4 && alphaBits !== 8) {
    nodes.push({ type: 'warning', message: `Expected alpha bits to be 0, 1, 4, or 8, but got ${alphaBits}` });
  }

  if (width > 512 || height > 512) {
    nodes.push({ type: 'warning', message: `Expected width and height up to 512, but got ${width}x${height}` });
  }

  if (content === 0) {
    const jpgHeader = <Uint8Array>texture.jpgHeader;

    if (jpgHeader.length > 624) {
      nodes.push({ type: 'warning', message: `Expected the JPG header to be at most 624 bytes, but got ${jpgHeader.length}` });
    }
  }

  if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
    nodes.push({ type: 'warning', message: `Expected the width and height to be powers of two, but got ${width}x${height}` });
  }

  for (let i = 0; i < 16; i++) {
    if (mipmapSizes[i] > 0) {
      // This happens if this mipmap level supposedly exists, but we already passed the level that should have been last.
      if (width < 1 && height < 1) {
        nodes.push({ type: 'warning', message: `Mipmap ${i}: this mipmap should not exist` });
      } else if (isMipmapFake(i, mipmapOffsets)) {
        nodes.push({ type: 'warning', message: `Mipmap ${i}: this mipmap is fake` });
      } else {
        // In the case this is not a square texture, one dimension will get to size 1 before the other.
        width = Math.max(width, 1);
        height = Math.max(height, 1);

        let mipmapData;

        try {
          mipmapData = texture.getMipmap(i);
        } catch (e) {
          nodes.push({ type: 'warning', message: `Mipmap ${i}: Decoding failed` });
        }

        if (mipmapData) {
          if (content === 0) {
            if (mipmapData.width !== width || mipmapData.height !== height) {
              nodes.push({ type: 'warning', message: `Mipmap ${i}: the JPG width (${mipmapData.width}) and height (${mipmapData.height}) do not match the mipmap width (${width}) and height (${height})` });
            }
          } else if (content === 1) {
            const pixels = width * height;
            const size = pixels + Math.ceil((pixels * alphaBits) / 8);

            if (size !== mipmapSizes[i]) {
              nodes.push({ type: 'warning', message: `Mipmap ${i}: the declared size is ${mipmapSizes[i]}, but the real size is ${size}` });
            }
          }
        }
      }
    }

    width >>= 1;
    height >>= 1;
  }

  return { nodes, warnings: nodes.length };
}
