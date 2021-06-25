import { isPowerOfTwo } from '../../common/math';
import { DdsImage } from '../../parsers/dds/image';

/**
 * Tests for issues in DDS textures.
 */
export default function sanityTest(texture: DdsImage) {
  
  let nodes = [];
  let width = texture.width;
  let height = texture.height;
  let mipmaps = texture.mipmaps();
  let expectedMipmaps = Math.log2(Math.max(width, height));

  if (mipmaps < expectedMipmaps) {
    nodes.push({ type: 'warning', message: `Expected ${expectedMipmaps} mipmaps, but got ${mipmaps}` });
  }

  if (!isPowerOfTwo(width) || !isPowerOfTwo(height)) {
    nodes.push({ type: 'warning', message: `Expected the width and height to be powers of two, but got ${width}x${height}` });
  }

  for (let i = 0; i < mipmaps; i++) {
    try {
      texture.getMipmap(i);
    } catch (e) {
      nodes.push({ type: 'warning', message: `Mipmap ${i}: Decoding failed` });
    }
  }

  return { warnings: nodes.length, nodes };
}
