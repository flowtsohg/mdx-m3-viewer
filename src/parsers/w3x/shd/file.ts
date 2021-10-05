/**
 * war3map.shd - the shadow file.
 */
export default class War3MapShd {
  shadows = new Uint8Array(0);

  load(buffer: ArrayBuffer | Uint8Array, width: number, height: number): void {
    this.shadows = new Uint8Array(buffer.slice(0, width * height * 16));
  }

  save(): Uint8Array {
    return this.shadows.slice();
  }

  getByteLength(): number {
    return this.shadows.length;
  }
}
