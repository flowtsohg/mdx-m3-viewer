declare module 'tga-js' {
  export default class TgaLoader {
    header: {
      idLength: number;
      colorMapType: number;
      imageType: number;
      colorMapIndex: number;
      colorMapLength: number;
      colorMapDepth: number;
      offsetX: number;
      offsetY: number;
      width: number;
      height: number;
      pixelDepth: number;
      flags: number;
    };

    open(path: string, callback: () => void): void;
    load(data: Uint8Array): void;
    getImageData(imageData: ImageData): ImageData;
    getCanvas(): HTMLCanvasElement;
    getDataUrl(type: string): string;
  }
}
