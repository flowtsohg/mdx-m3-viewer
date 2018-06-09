import BinaryStream from '../../../common/binarystream';
import Player from './player';
import Force from './force';
import UpgradeAvailabilityChange from './upgradeavailabilitychange';
import TechAvailabilityChange from './techavailabilitychange';
import RandomUnitTable from './randomunittable';
import RandomItemTable from './randomitemtable';

/**
 * war3map.w3i - the general information file.
 */
export default class War3MapW3i {
  /**
   * @param {?ArrayBuffer} buffer
   */
  constructor(buffer) {
    /** @member {number} */
    this.version = 0;
    /** @member {number} */
    this.saves = 0;
    /** @member {number} */
    this.editorVersion = 0;
    /** @member {string} */
    this.name = '';
    /** @member {string} */
    this.author = '';
    /** @member {string} */
    this.description = '';
    /** @member {string} */
    this.recommendedPlayers = '';
    /** @member {Float32Array} */
    this.cameraBounds = new Float32Array(8);
    /** @member {Int32Array} */
    this.cameraBoundsComplements = new Int32Array(4);
    /** @member {Int32Array} */
    this.playableSize = new Int32Array(2);
    /** @member {number} */
    this.flags = 0;
    /** @member {string} */
    this.tileset = '\0';
    /** @member {number} */
    this.campaignBackground = 0;
    /** @member {string} */
    this.loadingScreenModel = '';
    /** @member {string} */
    this.loadingScreenText = '';
    /** @member {string} */
    this.loadingScreenTitle = '';
    /** @member {string} */
    this.loadingScreenSubtitle = '';
    /** @member {number} */
    this.loadingScreen = 0;
    /** @member {string} */
    this.prologueScreenModel = '';
    /** @member {string} */
    this.prologueScreenText = '';
    /** @member {string} */
    this.prologueScreenTitle = '';
    /** @member {string} */
    this.prologueScreenSubtitle = '';
    /** @member {number} */
    this.useTerrainFog = 0;
    /** @member {Float32Array} */
    this.fogHeight = new Float32Array(2);
    /** @member {number} */
    this.fogDensity = 0;
    /** @member {Uint8Array} */
    this.fogColor = new Uint8Array(4);
    /** @member {number} */
    this.globalWeather = 0;
    /** @member {string} */
    this.soundEnvironment = '';
    /** @member {string} */
    this.lightEnvironmentTileset = '\0';
    /** @member {Uint8Array} */
    this.waterVertexColor = new Uint8Array(4);
    /** @member {Array<Player>} */
    this.players = [];
    /** @member {Array<Force>} */
    this.forces = [];
    /** @member {Array<UpgradeAvailabilityChange>} */
    this.upgradeAvailabilityChanges = [];
    /** @member {Array<TechAvailabilityChange>} */
    this.techAvailabilityChanges = [];
    /** @member {Array<RandomUnitTable>} */
    this.randomUnitTables = [];
    /** @member {Array<RandomItemTable>} */
    this.randomItemTables = [];

    if (buffer) {
      this.load(buffer);
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  load(buffer) {
    let stream = new BinaryStream(buffer);

    this.version = stream.readInt32();
    this.saves = stream.readInt32();
    this.editorVersion = stream.readInt32();
    this.name = stream.readUntilNull();
    this.author = stream.readUntilNull();
    this.description = stream.readUntilNull();
    this.recommendedPlayers = stream.readUntilNull();
    this.cameraBounds = stream.readFloat32Array(8);
    this.cameraBoundsComplements = stream.readInt32Array(4);
    this.playableSize = stream.readInt32Array(2);
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
      this.fogHeight = stream.readFloat32Array(2);
      this.fogDensity = stream.readFloat32();
      this.fogColor = stream.readUint8Array(4);
      this.globalWeather = stream.readInt32();
      this.soundEnvironment = stream.readUntilNull();
      this.lightEnvironmentTileset = stream.read(1, true);
      this.waterVertexColor = stream.readUint8Array(4);
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let player = new Player();

      player.load(stream);

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

  /**
   * @return {ArrayBuffer}
   */
  save() {
    let buffer = new ArrayBuffer(this.getByteLength());
    let stream = new BinaryStream(buffer);

    stream.writeInt32(this.version);
    stream.writeInt32(this.saves);
    stream.writeInt32(this.editorVersion);
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

    stream.writeUint32(this.players.length);

    for (let player of this.players) {
      player.save(stream);
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

  /**
   * @return {number}
   */
  getByteLength() {
    let size = 111 + this.name.length + this.author.length + this.description.length + this.recommendedPlayers.length + this.loadingScreenText.length + this.loadingScreenTitle.length + this.loadingScreenSubtitle.length + this.prologueScreenText.length + this.prologueScreenTitle.length + this.prologueScreenSubtitle.length;

    for (let player of this.players) {
      size += player.getByteLength();
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
