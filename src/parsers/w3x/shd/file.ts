/**
 * war3map.shd - the shadow file.
 */
export default class War3MapShd {
  shadows: Uint8Array = new Uint8Array(0);

  constructor(buffer?: ArrayBuffer, width?: number, height?: number) {
    if (buffer && width && height) {
      this.load(buffer, width, height);
    }
  }

  load(buffer: ArrayBuffer, width: number, height: number) {
    try {
      this.shadows = new Uint8Array(buffer.slice(0, width * height * 16));
    } catch (e) {
      console.warn('War3MapShd: Failed to fully parse', e);
    }
  }

  save() {
    return this.shadows.slice().buffer;
  }

  getByteLength() {
    return this.shadows.length;
  }
}
