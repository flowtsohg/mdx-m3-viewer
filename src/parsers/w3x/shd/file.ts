/**
 * war3map.shd - the shadow file.
 */
export default class War3MapShd {
  shadows: Uint8Array = new Uint8Array(0);

  load(buffer: ArrayBuffer | Uint8Array, width: number, height: number) {
    this.shadows = new Uint8Array(buffer.slice(0, width * height * 16));
  }

  save() {
    return this.shadows.slice();
  }

  getByteLength() {
    return this.shadows.length;
  }
}
