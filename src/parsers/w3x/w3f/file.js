import BinaryStream from '../../../common/binarystream';
import MapTitle from './maptitle';
import MapOrder from './maporder';

/**
 * war3campaign.w3f - the campaign information file.
 */
export default class War3CampaignW3f {
  /**
   *
   */
  constructor() {
    this.version = 0;
    this.campaignVersion = 0;
    this.editorVersion = 0;
    this.name = '';
    this.difficulty = '';
    this.author = '';
    this.description = '';
    this.mode = -1; // 0: fixed difficulty, only w3m maps, 1: variable difficulty, only w3m maps, 1: fixed..., contains w3x maps, 2: variable..., contains w3xm maps.
    this.backgroundScreen = -1; // -1 = none or custom path
    this.backgroundScreenPath = '';
    this.minimapImagePath = '';
    this.ambientSound = 0; // -1 = imported, 0 = none, >0 = preset index
    this.ambientSoundPath = '';
    this.terrainFog = 0; // 0 = not used, >0 = index of terrain fog style
    this.fogStartZ = 0;
    this.fogEndZ = 0;
    this.fogDensity = 0;
    this.fogColor = new Uint8Array(4);
    this.userInterface = -1; // 0 = human
    this.mapTitles = [];
    this.mapOrders = [];
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();
    this.campaignVersion = stream.readInt32();
    this.editorVersion = stream.readInt32();
    this.name = stream.readUntilNull();
    this.difficulty = stream.readUntilNull();
    this.author = stream.readUntilNull();
    this.description = stream.readUntilNull();
    this.mode = stream.readInt32();
    this.backgroundScreen = stream.readInt32();
    this.backgroundScreenPath = stream.readUntilNull();
    this.minimapImagePath = stream.readUntilNull();
    this.ambientSound = stream.readInt32();
    this.ambientSoundPath = stream.readUntilNull();
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

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeInt32(this.campaignVersion);
    stream.writeInt32(this.editorVersion);
    stream.write(`${this.name}\0`);
    stream.write(`${this.difficulty}\0`);
    stream.write(`${this.author}\0`);
    stream.write(`${this.description}\0`);
    stream.writeInt32(this.mode);
    stream.writeInt32(this.backgroundScreen);
    stream.write(`${this.backgroundScreenPath}\0`);
    stream.write(`${this.minimapImagePath}\0`);
    stream.writeInt32(this.ambientSound);
    stream.write(`${this.ambientSoundPath}\0`);
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

    return buffer;
  }

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 63 + this.name.length + this.difficulty.length + this.author.length + this.description.length + this.backgroundScreenPath.length + this.minimapImagePath.length + this.ambientSoundPath.length;

    for (let title of this.mapTitles) {
      size += title.getByteLength();
    }

    for (let order of this.mapOrders) {
      size += order.getByteLength();
    }

    return size;
  }
}
