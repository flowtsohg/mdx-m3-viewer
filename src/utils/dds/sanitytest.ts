import { isPowerOfTwo } from '../../common/math';
import { DdsImage } from '../../parsers/dds/image';

export interface SanityTestNode {
  type: string;
  message: string;
}

export interface SanityTestResult {
  nodes: SanityTestNode[];
  warnings: number;
}

/**
 * Tests for issues in DDS textures.
 */
export default function sanityTest(texture: DdsImage): SanityTestResult {
  
  const nodes = [];
  const width = texture.width;
  const height = texture.height;
  const mipmaps = texture.mipmaps();
  const expectedMipmaps = Math.log2(Math.max(width, height));

  if (mipmaps < expectedMipmaps) {
    nodes.push({ type: 'warning', message: `Expected ${expectedMipmaps} mipmaps, but got ${mipmaps}` });
  }

  if ((width % 4 !== 0) || (height % 4 !== 0)) {
    nodes.push({ type: 'warning', message: `Expected the width and height to be multiples of four, but got ${width}x${height}` });
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

  return { nodes, warnings: nodes.length };
}
