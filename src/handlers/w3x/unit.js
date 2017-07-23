import { vec3, quat } from "gl-matrix";

function sequenceSorter(a, b) {
    return a.rarity < b.rarity;
}

function filterSequences(type, sequences) {
    var filtered = [];

    for (var i = 0, l = sequences.length; i < l; i++) {
        var sequence = sequences[i],
            name = sequence.name.split("-")[0].replace(/\d/g, "").trim().toLowerCase();

        if (name === type) {
            filtered.push(sequence);
        }
    }

    return filtered;
}

function selectSequence(type, sequences) {
    sequences = filterSequences(type, sequences);

    sequences.sort(sequenceSorter);

    for (var i = 0, l = sequences.length; i < l; i++) {
        var sequence = sequences[i];
        var rarity = sequence.rarity;

        if (rarity === 0) {
            break;
        }

        if (Math.random() * 10 > rarity) {
            return sequence;
        }
    }

    var sequencesLeft = sequences.length - i;
    var random = i + Math.floor(Math.random() * sequencesLeft);
    var sequence = sequences[random]

    return sequence;
}

function standSequence(target) {
    // This function is registered both with whenLoaded, and with addEventListener.
    // The former sends the object directly, while the latter passes an event object, so take care of this difference here.
    if (target.target) {
        target = target.target;
    }

    if (target.model.sequences) {
        var sequences = target.model.sequences;
        var standSequence = selectSequence("stand", sequences);

        if (standSequence) {
            target.setSequence(standSequence.index);
        }
    }
}


/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xDroppedItem(reader) {
    this.id = reader.read(4);
    this.chance = reader.readInt32();
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xDroppedItemSet(reader) {
    this.items = [];

    for (var i = 0, l = reader.readInt32() ; i < l; i++) {
        this.items[i] = new W3xDroppedItem(reader);
    }
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xModifiedAbility(reader) {
    this.id = reader.read(4);
    this.activeForAutocast = reader.readInt32();
    this.heroLevel = reader.readInt32();
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xInventoryItem(reader) {
    this.slot = reader.readInt32();
    this.id = reader.read(4);
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xRandomUnit(reader) {
    this.id = reader.read(4);
    this.chance = reader.readUint32();
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {W3xMap} map
 */
function W3xUnit(reader, version, map) {
    this.map = map;

    var id = reader.read(4);
    var variation = reader.readInt32();
    this.location = reader.readFloat32Array(3);
    this.angle = reader.readFloat32();
    this.scale = reader.readFloat32Array(3);
    var flags = reader.readUint8();
    this.player = reader.readInt32();
    reader.skip(2); // ?
    var hitpoints = reader.readInt32();
    var mana = reader.readInt32();

    if (version > 7) {
        var droppedItemTable = reader.readInt32();
    }

    var droppedItemSetsCount = reader.readInt32();
    var droppedItemSets = [];
    for (var i = 0; i < droppedItemSetsCount; i++) {
        droppedItemSets[i] = new W3xDroppedItemSet(reader);
    }

    var goldAmount = reader.readInt32();
    var targetAcquisition = reader.readFloat32();
    var heroLevel = reader.readInt32();

    if (version > 7) {
        var heroStrength = reader.readInt32();
        var heroAgility = reader.readInt32();
        var heroIntelligence = reader.readInt32();
    }

    var itemsInInventoryCount = reader.readInt32();
    var itemsInInventory = [];
    for (var i = 0; i < itemsInInventoryCount; i++) {
        itemsInInventory[i] = new W3xInventoryItem(reader);
    }

    var modifiedAbilitiesCount = reader.readInt32();
    var modifiedAbilities = [];
    for (var i = 0; i < modifiedAbilitiesCount; i++) {
        modifiedAbilities[i] = new W3xModifiedAbility(reader);
    }

    var randomUnitTable = [];
    var randomFlag = reader.readInt32();
    if (randomFlag === 0) {
        var level = reader.read(3); // 24bit number
        var itemClass = reader.readUint8();
    } else if (randomFlag === 1) {
        var unitGroup = reader.readUint8();
        var positionInGroup = reader.readUint8();
    } else if (randomFlag === 2) {
        var randomUnits = reader.readInt32();
        for (let i = 0; i < randomUnits; i++) {
            randomUnitTable[i] = new W3xRandomUnit(reader);
        }

        console.log(randomUnitTable)
        /// TODO: implement random selection
        id = randomUnitTable[0].id;
    }

    var customTeamColor = reader.readInt32();
    var waygate = reader.readInt32();
    var creationNumber = reader.readInt32();

    var row = map.slkFiles.unitdata.map[id] || map.slkFiles.itemdata.map[id];
    if (row) {
        var path;

        // Items have a file field, units don't...
        if (row.file) {
            path = row.file.replace(".mdl", ".mdx");

            if (!path.endsWith(".mdx")) {
                path += ".mdx";
            }
        } else {
            this.location[2] += row.moveHeight;

            row = map.slkFiles.unitui.map[id];

            if (!row) {
                console.log("Unknown unit ID", id);
                return;
            }

            

            path = row.file + ".mdx";

            vec3.scale(this.scale, this.scale, row.modelScale);
        }

        this.path = path;
    } else {
        if (id === "sloc") {
            this.path = "Objects/StartLocation/StartLocation.mdx";
        } 
    }

    if (this.path) {
        this.addInstance();
    } else {
        console.log("Unknown unit/item ID", id, randomUnitTable)
    }
}

W3xUnit.prototype = {
    addInstance() {
        if (!this.model) {
            this.model = this.map.loadFiles(this.path);
        }

        let instance = this.model.addInstance();

        this.map.scene.addInstance(instance);

        instance.setLocation(this.location);
        instance.setRotation(quat.setAxisAngle(quat.create(), vec3.UNIT_Z, this.angle));
        instance.setScale(this.scale);
        instance.setTeamColor(this.player);

        // Select a random stand sequence when the instance is loaded
        instance.whenLoaded(standSequence);

        // And select a random stand sequence every time a sequence ends
        instance.addEventListener("seqend", standSequence);

        this.instance = instance;
    }
};

export default W3xUnit;
