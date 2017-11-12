import BinaryStream from '../../../common/binarystream';
import Player from './player';
import Force from './force';
import UpgradeAvailabilityChange from './upgradeavailabilitychange';
import TechAvailabilityChange from './techavailabilitychange';
import RandomUnitTable from './randomunittable';
import RandomItemTable from './randomitemtable';

/**
 * @constructor
 * @param {?ArrayBuffer} buffer 
 */
function War3MapW3i(buffer) {
    this.version = 0;
    this.saves = 0;
    this.editorVersion = 0;
    this.name = '';
    this.author = '';
    this.description = '';
    this.recommendedPlayers = '';
    this.cameraBounds = new Float32Array(8);
    this.cameraBoundsComplements = new Int32Array(4);
    this.playableSize = new Int32Array(2);
    this.flags = 0;
    this.tileset = '\0';
    this.campaignBackground = 0;
    this.loadingScreenModel = '';
    this.loadingScreenText = '';
    this.loadingScreenTitle = '';
    this.loadingScreenSubtitle = '';
    this.loadingScreen = 0;
    this.prologueScreenModel = '';
    this.prologueScreenText = '';
    this.prologueScreenTitle = '';
    this.prologueScreenSubtitle = '';
    this.useTerrainFog = 0;
    this.fogHeight = new Float32Array(2);
    this.fogDensity = 0;
    this.fogColor = new Uint8Array(4);
    this.globalWeather = 0;
    this.soundEnvironment = '';
    this.lightEnvironmentTileset = '\0';
    this.waterVertexColor = new Uint8Array(4);
    this.players = [];
    this.forces = [];
    this.upgradeAvailabilityChanges = [];
    this.techAvailabilityChanges = [];
    this.randomUnitTables = [];
    this.randomItemTables = [];

    if (buffer) {
        this.load(buffer);
    }
}

War3MapW3i.prototype = {
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
            this.lightEnvironmentTileset = stream.read(1);
            this.waterVertexColor = stream.readUint8Array(4);
        }

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.players[i] = new Player(stream);
        }

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.forces[i] = new Force(stream);
        }

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.upgradeAvailabilityChanges[i] = new UpgradeAvailabilityChange(stream);
        }

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.techAvailabilityChanges[i] = new TechAvailabilityChange(stream);
        }

        for (let i = 0, l = stream.readInt32(); i < l; i++) {
            this.randomUnitTables[i] = new RandomUnitTable(stream);
        }

        if (this.version > 24) {
            for (let i = 0, l = stream.readInt32(); i < l; i++) {
                this.randomItemTables[i] = new RandomItemTable(stream);
            }
        }
    },

    save() {
        let buffer = new ArrayBuffer(this.calcSize()),
            stream = new BinaryStream(buffer);

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
    },

    calcSize() {
        let size = 111 + this.name.length + this.author.length + this.description.length + this.recommendedPlayers.length + this.loadingScreenText.length + this.loadingScreenTitle.length + this.loadingScreenSubtitle.length + this.prologueScreenText.length + this.prologueScreenTitle.length + this.prologueScreenSubtitle.length;

        for (let player of this.players) {
            size += player.calcSize();
        }

        for (let force of this.forces) {
            size += force.calcSize();
        }

        for (let change of this.upgradeAvailabilityChanges) {
            size += change.calcSize();
        }

        for (let change of this.techAvailabilityChanges) {
            size += change.calcSize();
        }

        for (let table of this.randomUnitTables) {
            size += table.calcSize();
        }

        if (this.version > 24) {
            size += 36 + this.loadingScreenModel.length + this.prologueScreenModel.length + this.soundEnvironment.length;

            for (let table of this.randomItemTables) {
                size += table.calcSize();
            }
        }

        return size;
    }
};

export default War3MapW3i;
