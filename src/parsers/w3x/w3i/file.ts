import BinaryStream from '../../../common/binarystream';
import { byteLengthUtf8 } from '../../../common/utf8';
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
  version = 0;
  saves = 0;
  editorVersion = 0;
  buildVersion = new Uint32Array(4);
  name = '';
  author = '';
  description = '';
  recommendedPlayers = '';
  cameraBounds = new Float32Array(8);
  cameraBoundsComplements = new Int32Array(4);
  playableSize = new Int32Array(2);
  flags = 0;
  tileset = 'A';
  campaignBackground = 0;
  loadingScreenModel = '';
  loadingScreenText = '';
  loadingScreenTitle = '';
  loadingScreenSubtitle = '';
  loadingScreen = 0;
  prologueScreenModel = '';
  prologueScreenText = '';
  prologueScreenTitle = '';
  prologueScreenSubtitle = '';
  useTerrainFog = 0;
  fogHeight = new Float32Array(2);
  fogDensity = 0;
  fogColor = new Uint8Array(4);
  globalWeather = 0;
  soundEnvironment = '';
  lightEnvironmentTileset = '\0';
  waterVertexColor = new Uint8Array(4);
  scriptMode = 0;
  graphicsMode = 0;
  players: Player[] = [];
  forces: Force[] = [];
  upgradeAvailabilityChanges: UpgradeAvailabilityChange[] = [];
  techAvailabilityChanges: TechAvailabilityChange[] = [];
  randomUnitTables: RandomUnitTable[] = [];
  randomItemTables: RandomItemTable[] = [];
  unknown1 = 0;

  load(buffer: ArrayBuffer | Uint8Array): void {
    const stream = new BinaryStream(buffer);

    this.version = stream.readInt32();
    this.saves = stream.readInt32();
    this.editorVersion = stream.readInt32();

    if (this.version > 27) {
      stream.readUint32Array(this.buildVersion);
    }

    this.name = stream.readNull();
    this.author = stream.readNull();
    this.description = stream.readNull();
    this.recommendedPlayers = stream.readNull();
    stream.readFloat32Array(this.cameraBounds);
    stream.readInt32Array(this.cameraBoundsComplements);
    stream.readInt32Array(this.playableSize);
    this.flags = stream.readUint32();
    this.tileset = stream.readBinary(1);
    this.campaignBackground = stream.readInt32();

    if (this.version > 24) {
      this.loadingScreenModel = stream.readNull();
    }

    this.loadingScreenText = stream.readNull();
    this.loadingScreenTitle = stream.readNull();
    this.loadingScreenSubtitle = stream.readNull();
    this.loadingScreen = stream.readInt32();

    if (this.version > 24) {
      this.prologueScreenModel = stream.readNull();
    }

    this.prologueScreenText = stream.readNull();
    this.prologueScreenTitle = stream.readNull();
    this.prologueScreenSubtitle = stream.readNull();

    if (this.version > 24) {
      this.useTerrainFog = stream.readInt32();
      stream.readFloat32Array(this.fogHeight);
      this.fogDensity = stream.readFloat32();
      stream.readUint8Array(this.fogColor);
      this.globalWeather = stream.readInt32();
      this.soundEnvironment = stream.readNull();
      this.lightEnvironmentTileset = stream.readBinary(1);
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
      const player = new Player();

      player.load(stream, this.version);

      this.players[i] = player;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const force = new Force();

      force.load(stream);

      this.forces[i] = force;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const upgradeAvailabilityChange = new UpgradeAvailabilityChange();

      upgradeAvailabilityChange.load(stream);

      this.upgradeAvailabilityChanges[i] = upgradeAvailabilityChange;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const techAvailabilityChange = new TechAvailabilityChange();

      techAvailabilityChange.load(stream);

      this.techAvailabilityChanges[i] = techAvailabilityChange;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const randomUnitTable = new RandomUnitTable();

      randomUnitTable.load(stream);

      this.randomUnitTables[i] = randomUnitTable;
    }

    if (this.version > 24) {
      for (let i = 0, l = stream.readInt32(); i < l; i++) {
        const randomItemTable = new RandomItemTable();

        randomItemTable.load(stream);

        this.randomItemTables[i] = randomItemTable;
      }
    }
  }

  save(): Uint8Array {
    const stream = new BinaryStream(new ArrayBuffer(this.getByteLength()));

    stream.writeInt32(this.version);
    stream.writeInt32(this.saves);
    stream.writeInt32(this.editorVersion);

    if (this.version > 27) {
      stream.writeUint32Array(this.buildVersion);
    }

    stream.writeNull(this.name);
    stream.writeNull(this.author);
    stream.writeNull(this.description);
    stream.writeNull(this.recommendedPlayers);
    stream.writeFloat32Array(this.cameraBounds);
    stream.writeInt32Array(this.cameraBoundsComplements);
    stream.writeInt32Array(this.playableSize);
    stream.writeUint32(this.flags);
    stream.writeBinary(this.tileset);
    stream.writeInt32(this.campaignBackground);

    if (this.version > 24) {
      stream.writeNull(this.loadingScreenModel);
    }

    stream.writeNull(this.loadingScreenText);
    stream.writeNull(this.loadingScreenTitle);
    stream.writeNull(this.loadingScreenSubtitle);
    stream.writeInt32(this.loadingScreen);

    if (this.version > 24) {
      stream.writeNull(this.prologueScreenModel);
    }

    stream.writeNull(this.prologueScreenText);
    stream.writeNull(this.prologueScreenTitle);
    stream.writeNull(this.prologueScreenSubtitle);

    if (this.version > 24) {
      stream.writeInt32(this.useTerrainFog);
      stream.writeFloat32Array(this.fogHeight);
      stream.writeFloat32(this.fogDensity);
      stream.writeUint8Array(this.fogColor);
      stream.writeInt32(this.globalWeather);
      stream.writeNull(this.soundEnvironment);
      stream.writeBinary(this.lightEnvironmentTileset);
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

    for (const player of this.players) {
      player.save(stream, this.version);
    }

    stream.writeUint32(this.forces.length);

    for (const force of this.forces) {
      force.save(stream);
    }

    stream.writeUint32(this.upgradeAvailabilityChanges.length);

    for (const change of this.upgradeAvailabilityChanges) {
      change.save(stream);
    }

    stream.writeUint32(this.techAvailabilityChanges.length);

    for (const change of this.techAvailabilityChanges) {
      change.save(stream);
    }

    stream.writeUint32(this.randomUnitTables.length);

    for (const table of this.randomUnitTables) {
      table.save(stream);
    }

    if (this.version > 24) {
      stream.writeUint32(this.randomItemTables.length);

      for (const table of this.randomItemTables) {
        table.save(stream);
      }
    }

    return stream.uint8array;
  }

  getByteLength(): number {
    let size = 111 + byteLengthUtf8(this.name) + byteLengthUtf8(this.author) + byteLengthUtf8(this.description) + byteLengthUtf8(this.recommendedPlayers) + byteLengthUtf8(this.loadingScreenText) + byteLengthUtf8(this.loadingScreenTitle) + byteLengthUtf8(this.loadingScreenSubtitle) + byteLengthUtf8(this.prologueScreenText) + byteLengthUtf8(this.prologueScreenTitle) + byteLengthUtf8(this.prologueScreenSubtitle);

    for (const player of this.players) {
      size += player.getByteLength(this.version);
    }

    for (const force of this.forces) {
      size += force.getByteLength();
    }

    size += this.upgradeAvailabilityChanges.length * 16;

    size += this.techAvailabilityChanges.length * 8;

    for (const table of this.randomUnitTables) {
      size += table.getByteLength();
    }

    if (this.version > 24) {
      size += 36 + byteLengthUtf8(this.loadingScreenModel) + byteLengthUtf8(this.prologueScreenModel) + byteLengthUtf8(this.soundEnvironment);

      for (const table of this.randomItemTables) {
        size += table.getByteLength();
      }
    }

    if (this.version > 27) {
      size += 20;
    }

    if (this.version > 30) {
      size += 8;
    }

    return size;
  }

  /**
   * Returns the build version as major+minor.
   * 
   * For example version 1.31.X will return 131.
   * 
   * Note that this will always return 0 for any version below 1.31.
   */
  getBuildVersion(): number {
    return this.buildVersion[0] * 100 + this.buildVersion[1];
  }
}
