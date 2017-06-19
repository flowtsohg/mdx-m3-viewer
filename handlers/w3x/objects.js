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

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {W3xMap} map
 */
function W3xDoodad(reader, version, map) {
    this.map = map;

    var id = reader.read(4);
    var variation = reader.readInt32();
    this.location = reader.readFloat32Array(3);
    this.angle = reader.readFloat32();
    this.scale = reader.readFloat32Array(3);
    var flags = reader.readUint8();
    var life = reader.readUint8();
    var editorId = reader.readInt32();

    if (version > 7) {
        reader.read(8); // ?
    }

    var row = map.slkFiles.doodads.map[id] || map.slkFiles.destructabledata.map[id];
    if (row) {
        // What does it mean when texFile is underscore?
        if (row.texFile && row.texFile !== "_") {
            this.texFile = map.loadFiles(row.texFile + ".blp");
        }

        var path;
        var file = row.file;

        // Imported, keep the path but change the extension back to mdx
        if (file.endsWith(".mdl")) {
            path = file.replace(".mdl", ".mdx");
        // MPQ file, create the full path using the variation
        } else {
            // The SLK has two versions, one with "dir" and "file", the other just "file", both behave differently
            if (row.dir) {
                path = row.dir.replace(/\\/g, "/") + "/" + row.file + "/" + row.file;
            } else {
                path = row.file.replace(/\\/g, "/");
            }

            if (row.numVar > 1) {
                path += Math.floor((row.numVar - 1) * Math.random());
            }

            path += ".mdx";
        }
        
        this.path = path;
    }

    if (this.path) {
        this.addInstance();
    } else {
        console.log("Unknown doodad/destructable ID", id)
    }

}

W3xDoodad.prototype = {
    addInstance() {
        if (!this.model) {
            this.model = this.map.loadFiles(this.path);
        }

        let instance = this.model.addInstance();

        this.map.scene.addInstance(instance);

        // This is used by trees and other doodads that share a model, but override the texture
        if (this.texFile) {
            instance.setTexture(0, this.texFile);
        }

        instance.setLocation(this.location);
        instance.setRotation(quat.setAxisAngle(quat.create(), vec3.UNIT_Z, this.angle));
        instance.setScale(this.scale);
        instance.setSequence(0);

        this.instance = instance;
    }
};

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 * @param {W3xMap} map
 */
function W3xSpecialDoodad(reader, version, map) {
    var id = reader.read(4);
    var z = reader.readFloat32();
    var x = reader.readFloat32();
    var y = reader.readFloat32();

    var row = map.slkFiles.doodads.map[id] || map.slkFiles.destructabledata.map[id];
    if (row) {
        var path = row.file;

        if (row.numVar > 1) {
            path += row.variation;
        }

        path += ".mdx";

        console.log("W3xSpecialDoodad", path)
        //var instance = viewer.load(path, mpqPaths);
        //instance.setLocation([x, y, z]);
    }
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {boolean} useOptionalInts
 */
function W3xModification(reader, useOptionalInts) {
    this.id = reader.read(4);

    var variableType = reader.readInt32();

    if (useOptionalInts) {
        this.levelOrVariation = reader.readInt32();
        this.dataPointer = reader.readInt32();
    }

    if (variableType === 0) {
        this.value = reader.readInt32();
    } else if (variableType === 1 || variableType === 2) {
        this.value = reader.readFloat32();
    } else if (variableType === 3) {
        this.value = reader.readUntilNull();
    }

    var endModification = reader.read(4);
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {boolean} useOptionalInts
 */
function W3xModifiedObject(reader, useOptionalInts) {
    this.oldID = reader.read(4);
    this.newID = reader.read(4);
    this.modifications = [];

    for (var i = 0, l = reader.readInt32() ; i < l; i++) {
        this.modifications[i] = new W3xModification(reader, useOptionalInts);

    }
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {boolean} useOptionalInts
 */
function W3xModificationTable(reader, useOptionalInts) {
    this.objects = [];

    for (var i = 0, l = reader.readInt32() ; i < l; i++) {
        this.objects[i] = new W3xModifiedObject(reader, useOptionalInts);
    }
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xTilePoint(reader) {
    this.groundHeight = reader.readInt16();

    var short = reader.readInt16();

    this.waterLevel = short & 0x3FFF;
    this.mapEdge = short & 0xC000;

    var byte = reader.readInt8();

    this.groundTextureType = byte & 0x0F;

    var flags = byte & 0xF0;
    this.ramp = flags & 0x0010;
    this.blight = flags & 0x0020;
    this.water = flags & 0x0040;
    this.boundry = flags & 0x4000;
    
    byte = reader.readInt8();

    this.variation = byte & 31;

    // Values seen are 0, 1, and 2. What is this?
    this.whatIsThis = (byte & 224) >> 5;

    byte = reader.readInt8();

    this.cliffTextureType = (byte & 0xF0) >> 4;
    this.layerHeight = byte & 0x0F;
}

W3xTilePoint.prototype = {
    getWaterHeight() {
        return ((this.waterLevel - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4) / 128;

    },

    getHeight() {
        return ((this.groundHeight - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4) / 128;
    },

    getCliffHeight(cliffHeight) {
        return ((this.groundHeight - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4 - cliffHeight * 128) / 128;
    }
};
