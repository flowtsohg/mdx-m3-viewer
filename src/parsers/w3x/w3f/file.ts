import BinaryStream from '../../../common/binarystream';
import MapTitle from './maptitle';
import MapOrder from './maporder';
import { byteLengthUtf8 } from '../../../common/utf8';

/**
 * war3campaign.w3f - the campaign information file.
 */
export default class War3CampaignW3f {
  version: number = 0;
  campaignVersion: number = 0;
  editorVersion: number = 0;
  name: string = '';
  difficulty: string = '';
  author: string = '';
  description: string = '';
  mode: number = -1; // 0: fixed difficulty, only w3m maps, 1: variable difficulty, only w3m maps, 1: fixed..., contains w3x maps, 2: variable..., contains w3xm maps.
  backgroundScreen: number = -1; // -1 = none or custom path
  backgroundScreenPath: string = '';
  minimapImagePath: string = '';
  ambientSound: number = 0; // -1 = imported, 0 = none, >0 = preset index
  ambientSoundPath: string = '';
  terrainFog: number = 0; // 0 = not used, >0 = index of terrain fog style
  fogStartZ: number = 0;
  fogEndZ: number = 0;
  fogDensity: number = 0;
  fogColor: Uint8Array = new Uint8Array(4);
  userInterface: number = -1; // 0 = human
  mapTitles: MapTitle[] = [];
  mapOrders: MapOrder[] = [];

  load(buffer: ArrayBuffer | Uint8Array) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();
    this.campaignVersion = stream.readInt32();
    this.editorVersion = stream.readInt32();
    this.name = stream.readNull();
    this.difficulty = stream.readNull();
    this.author = stream.readNull();
    this.description = stream.readNull();
    this.mode = stream.readInt32();
    this.backgroundScreen = stream.readInt32();
    this.backgroundScreenPath = stream.readNull();
    this.minimapImagePath = stream.readNull();
    this.ambientSound = stream.readInt32();
    this.ambientSoundPath = stream.readNull();
    this.terrainFog = stream.readInt32();
    this.fogStartZ = stream.readFloat32();
    this.fogEndZ = stream.readFloat32();
    this.fogDensity = stream.readFloat32();
    stream.readUint8Array(this.fogColor);
    this.userInterface = stream.readInt32();

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let mapTitle = new MapTitle();

      mapTitle.load(stream);

      this.mapTitles[i] = mapTitle;
    }

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let mapOrder = new MapOrder();

      mapOrder.load(stream);

      this.mapOrders[i] = mapOrder;
    }
  }

  save() {
    let stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);
    stream.writeInt32(this.campaignVersion);
    stream.writeInt32(this.editorVersion);
    stream.writeNull(this.name);
    stream.writeNull(this.difficulty);
    stream.writeNull(this.author);
    stream.writeNull(this.description);
    stream.writeInt32(this.mode);
    stream.writeInt32(this.backgroundScreen);
    stream.writeNull(this.backgroundScreenPath);
    stream.writeNull(this.minimapImagePath);
    stream.writeInt32(this.ambientSound);
    stream.writeNull(this.ambientSoundPath);
    stream.writeInt32(this.terrainFog);
    stream.writeFloat32(this.fogStartZ);
    stream.writeFloat32(this.fogEndZ);
    stream.writeFloat32(this.fogDensity);
    stream.writeUint8Array(this.fogColor);
    stream.writeInt32(this.userInterface);
    stream.writeUint32(this.mapTitles.length);

    for (let title of this.mapTitles) {
      title.save(stream);
    }

    stream.writeUint32(this.mapOrders.length);

    for (let order of this.mapOrders) {
      order.save(stream);
    }

    return stream.uint8array;
  }

  getByteLength() {
    let size = 63 + byteLengthUtf8(this.name) + byteLengthUtf8(this.difficulty) + byteLengthUtf8(this.author) + byteLengthUtf8(this.description) + byteLengthUtf8(this.backgroundScreenPath) + byteLengthUtf8(this.minimapImagePath) + byteLengthUtf8(this.ambientSoundPath);

    for (let title of this.mapTitles) {
      size += title.getByteLength();
    }

    for (let order of this.mapOrders) {
      size += order.getByteLength();
    }

    return size;
  }
}
