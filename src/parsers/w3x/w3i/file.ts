import BinaryStream from '../../../common/binarystream';
import Force from './force';
import Player from './player';
import RandomItemTable from './randomitemtable';
import RandomUnitTable from './randomunittable';
import TechAvailabilityChange from './techavailabilitychange';
import UpgradeAvailabilityChange from './upgradeavailabilitychange';

/**
 * war3map.w3i - the general information file.
 */
export default class War3MapW3i {
  version: number = 0;
  saves: number = 0;
  editorVersion: number = 0;
  buildVersion: Uint32Array = new Uint32Array(4);
  name: string = '';
  author: string = '';
  description: string = '';
  recommendedPlayers: string = '';
  cameraBounds: Float32Array = new Float32Array(8);
  cameraBoundsComplements: Int32Array = new Int32Array(4);
  playableSize: Int32Array = new Int32Array(2);
  flags: number = 0;
  tileset: string = 'A';
  campaignBackground: number = 0;
  loadingScreenModel: string = '';
  loadingScreenText: string = '';
  loadingScreenTitle: string = '';
  loadingScreenSubtitle: string = '';
  loadingScreen: number = 0;
  prologueScreenModel: string = '';
  prologueScreenText: string = '';
  prologueScreenTitle: string = '';
  prologueScreenSubtitle: string = '';
  useTerrainFog: number = 0;
  fogHeight: Float32Array = new Float32Array(2);
  fogDensity: number = 0;
  fogColor: Uint8Array = new Uint8Array(4);
  globalWeather: number = 0;
  soundEnvironment: string = '';
  lightEnvironmentTileset: string = '\0';
  waterVertexColor: Uint8Array = new Uint8Array(4);
  scriptMode: number = 0;
  graphicsMode: number = 0;
  players: Player[] = [];
  forces: Force[] = [];
  upgradeAvailabilityChanges: UpgradeAvailabilityChange[] = [];
  techAvailabilityChanges: TechAvailabilityChange[] = [];
  randomUnitTables: RandomUnitTable[] = [];
  randomItemTables: RandomItemTable[] = [];
  unknown1: number = 0;

  constructor(buffer?: ArrayBuffer) {
    if (buffer) {
      this.load(buffer);
    }
  }

  load(buffer: ArrayBuffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();
    this.saves = stream.readInt32();
    this.editorVersion = stream.readInt32();

    if (this.version > 27) {
      stream.readUint32Array(this.buildVersion);
    }

    this.name = stream.readUntilNull();
    this.author = stream.readUntilNull();
    this.description = stream.readUntilNull();
    this.recommendedPlayers = stream.readUntilNull();
    stream.readFloat32Array(this.cameraBounds);
    stream.readInt32Array(this.cameraBoundsComplements);
    stream.readInt32Array(this.playableSize);
    this.flags = stream.readUint32();
    this.tileset = stream.read(1);
    this.campaignBackground = stream.readInt32();

    if (this.version > 24) {
      this.loadingScreenModel = stream.readUntilNull();
    }

    this.loadingScreenText = stream.readUntilNull();
    this.loadingScreenTitle = stream.readUntilNull();
    this.loadingScreenSubtitle = stream.readUntilNull();
    this.loadingScreen = stream.readInt32();

    if (this.version > 24) {
      this.prologueScreenModel = stream.readUntilNull();
    }

    this.prologueScreenText = stream.readUntilNull();
    this.prologueScreenTitle = stream.readUntilNull();
    this.prologueScreenSubtitle = stream.readUntilNull();

    if (this.version > 24) {
      this.useTerrainFog = stream.readInt32();
      stream.readFloat32Array(this.fogHeight);
      this.fogDensity = stream.readFloat32();
      stream.readUint8Array(this.fogColor);
      this.globalWeather = stream.readInt32();
      this.soundEnvironment = stream.readUntilNull();
      this.lightEnvironmentTileset = stream.read(1, true);
      stream.readUint8Array(this.waterVertexColor);
    }

    if (this.version > 27) {
      this.scriptMode = stream.readUint32();
    }

    if (this.version > 30) {
      this.graphicsMode = stream.readUint32();
      this.unknown1 = stream.readUint32();
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let player = new Player();

      player.load(stream, this.version);

      this.players[i] = player;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let force = new Force();

      force.load(stream);

      this.forces[i] = force;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let upgradeAvailabilityChange = new UpgradeAvailabilityChange();

      upgradeAvailabilityChange.load(stream);

      this.upgradeAvailabilityChanges[i] = upgradeAvailabilityChange;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let techAvailabilityChange = new TechAvailabilityChange();

      techAvailabilityChange.load(stream);

      this.techAvailabilityChanges[i] = techAvailabilityChange;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let randomUnitTable = new RandomUnitTable();

      randomUnitTable.load(stream);

      this.randomUnitTables[i] = randomUnitTable;
    }

    if (this.version > 24) {
      for (let i = 0, l = stream.readInt32(); i < l; i++) {
        let randomItemTable = new RandomItemTable();

        randomItemTable.load(stream);

        this.randomItemTables[i] = randomItemTable;
      }
    }
  }

  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeInt32(this.saves);
    stream.writeInt32(this.editorVersion);

    if (this.version > 27) {
      stream.writeUint32Array(this.buildVersion);
    }

    stream.write(`${this.name}\0`);
    stream.write(`${this.author}\0`);
    stream.write(`${this.description}\0`);
    stream.write(`${this.recommendedPlayers}\0`);
    stream.writeFloat32Array(this.cameraBounds);
    stream.writeInt32Array(this.cameraBoundsComplements);
    stream.writeInt32Array(this.playableSize);
    stream.writeUint32(this.flags);
    stream.write(this.tileset);
    stream.writeInt32(this.campaignBackground);

    if (this.version > 24) {
      stream.write(`${this.loadingScreenModel}\0`);
    }

    stream.write(`${this.loadingScreenText}\0`);
    stream.write(`${this.loadingScreenTitle}\0`);
    stream.write(`${this.loadingScreenSubtitle}\0`);
    stream.writeInt32(this.loadingScreen);

    if (this.version > 24) {
      stream.write(`${this.prologueScreenModel}\0`);
    }

    stream.write(`${this.prologueScreenText}\0`);
    stream.write(`${this.prologueScreenTitle}\0`);
    stream.write(`${this.prologueScreenSubtitle}\0`);

    if (this.version > 24) {
      stream.writeInt32(this.useTerrainFog);
      stream.writeFloat32Array(this.fogHeight);
      stream.writeFloat32(this.fogDensity);
      stream.writeUint8Array(this.fogColor);
      stream.writeInt32(this.globalWeather);
      stream.write(`${this.soundEnvironment}\0`);
      stream.write(this.lightEnvironmentTileset);
      stream.writeUint8Array(this.waterVertexColor);
    }

    if (this.version > 27) {
      stream.writeUint32(this.scriptMode);
    }

    if (this.version > 30) {
      stream.writeUint32(this.graphicsMode);
      stream.writeUint32(this.unknown1);
    }

    stream.writeUint32(this.players.length);

    for (let player of this.players) {
      player.save(stream, this.version);
    }

    stream.writeUint32(this.forces.length);

    for (let force of this.forces) {
      force.save(stream);
    }

    stream.writeUint32(this.upgradeAvailabilityChanges.length);

    for (let change of this.upgradeAvailabilityChanges) {
      change.save(stream);
    }

    stream.writeUint32(this.techAvailabilityChanges.length);

    for (let change of this.techAvailabilityChanges) {
      change.save(stream);
    }

    stream.writeUint32(this.randomUnitTables.length);

    for (let table of this.randomUnitTables) {
      table.save(stream);
    }

    if (this.version > 24) {
      stream.writeUint32(this.randomItemTables.length);

      for (let table of this.randomItemTables) {
        table.save(stream);
      }
    }

    return buffer;
  }

  getByteLength() {
    let size = 111 + this.name.length + this.author.length + this.description.length + this.recommendedPlayers.length + this.loadingScreenText.length + this.loadingScreenTitle.length + this.loadingScreenSubtitle.length + this.prologueScreenText.length + this.prologueScreenTitle.length + this.prologueScreenSubtitle.length;

    for (let player of this.players) {
      size += player.getByteLength(this.version);
    }

    for (let force of this.forces) {
      size += force.getByteLength();
    }

    size += this.upgradeAvailabilityChanges.length * 16;

    size += this.techAvailabilityChanges.length * 8;

    for (let table of this.randomUnitTables) {
      size += table.getByteLength();
    }

    if (this.version > 24) {
      size += 36 + this.loadingScreenModel.length + this.prologueScreenModel.length + this.soundEnvironment.length;

      for (let table of this.randomItemTables) {
        size += table.getByteLength();
      }
    }

    return size;
  }
}
