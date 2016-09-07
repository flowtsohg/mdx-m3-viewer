function sequenceSorter(a, b) {
    return a.rarity < b.rarity;
}

function filterSequences(type, sequences) {
    var filtered = [];

    for (var i = 0, l = sequences.length; i < l; i++) {
        sequence = sequences[i];
        name = sequence.name.split("-")[0].replace(/\d/g, "").trim().toLowerCase();

        if (name === type) {
            filtered.push(sequence);
        }
    }

    return filtered;
}

function selectSequence(type, sequences) {
    var sequences = filterSequences(type, sequences);

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

function standSequence(e) {
    var target = e.target;

    if (target.model.sequences) {
        var sequences = target.model.sequences;
        var standSequence = selectSequence("stand", sequences);

        if (standSequence) {
            target.setSequence(standSequence.index);
        }
    }
}


W3xDroppedItem = function (reader) {
    this.id = read(reader, 4);
    this.chance = readInt32(reader);
};

W3xDroppedItemSet = function (reader) {
    this.items = [];

    for (var i = 0, l = readInt32(reader) ; i < l; i++) {
        this.items[i] = new W3xDroppedItem(reader);
    }
};

W3xModifiedAbility = function (reader) {
    this.id = read(reader, 4);
    this.activeForAutocast = readInt32(reader);
    this.heroLevel = readInt32(reader);
};

W3xInventoryItem = function (reader) {
    this.slot = readInt32(reader);
    this.id = read(reader, 4);
};

function W3xRandomUnit(reader) {
    this.id = read(reader, 4);
    this.chance = readUint32(reader);
}

function W3xUnit(reader, version, map) {
    this.map = map;

    var id = read(reader, 4);
    var variation = readInt32(reader);
    this.location = readVector3(reader);
    this.angle = readFloat32(reader);
    this.scale = readVector3(reader);
    var flags = readUint8(reader);
    this.player = readInt32(reader);
    skip(reader, 2); // ?
    var hitpoints = readInt32(reader);
    var mana = readInt32(reader);

    if (version > 7) {
        var droppedItemTable = readInt32(reader);
    }

    var droppedItemSetsCount = readInt32(reader);
    var droppedItemSets = [];
    for (var i = 0; i < droppedItemSetsCount; i++) {
        droppedItemSets[i] = new W3xDroppedItemSet(reader);
    }

    var goldAmount = readInt32(reader);
    var targetAcquisition = readFloat32(reader);
    var heroLevel = readInt32(reader);

    if (version > 7) {
        var heroStrength = readInt32(reader);
        var heroAgility = readInt32(reader);
        var heroIntelligence = readInt32(reader);
    }

    var itemsInInventoryCount = readInt32(reader);
    var itemsInInventory = [];
    for (var i = 0; i < itemsInInventoryCount; i++) {
        itemsInInventory[i] = new W3xInventoryItem(reader);
    }

    var modifiedAbilitiesCount = readInt32(reader);
    var modifiedAbilities = [];
    for (var i = 0; i < modifiedAbilitiesCount; i++) {
        modifiedAbilities[i] = new W3xModifiedAbility(reader);
    }

    var randomUnitTable = [];
    var randomFlag = readInt32(reader);
    if (randomFlag === 0) {
        var level = read(reader, 3); // 24bit number
        var itemClass = readUint8(reader);
    } else if (randomFlag === 1) {
        var unitGroup = readUint8(reader);
        var positionInGroup = readUint8(reader);
    } else if (randomFlag === 2) {
        var randomUnits = readInt32(reader);
        for (let i = 0; i < randomUnits; i++) {
            randomUnitTable[i] = new W3xRandomUnit(reader);
        }

        console.log(randomUnitTable)
        /// TODO: implement random selection
        id = randomUnitTable[0].id;
    }

    var customTeamColor = readInt32(reader);
    var waygate = readInt32(reader);
    var creationNumber = readInt32(reader);

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
        const model = this.map.loadFiles(this.path),
            instance = model.addInstance();

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

function W3xDoodad(reader, version, map) {
    this.map = map;

    var id = read(reader, 4);
    var variation = readInt32(reader);
    this.location = readVector3(reader);
    this.angle = readFloat32(reader);
    this.scale = readVector3(reader);
    var flags = readUint8(reader);
    var life = readUint8(reader);
    var editorId = readInt32(reader);

    if (version > 7) {
        read(reader, 8); // ?
    }

    var row = map.slkFiles.doodads.map[id] || map.slkFiles.destructabledata.map[id];
    if (row) {
        if (row.texFile) {
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
                path += variation;
            }

            path += ".mdx";
        }
        
        this.path = path;
    }

    if (this.path) {
        this.loadModel();
        this.addInstance();
    } else {
        console.log("Unknown doodad/destructable ID", id)
    }

}

W3xDoodad.prototype = {
    loadModel() {
        const model = this.map.loadFiles(this.path);

        // This is used by trees and other doodads that share a model, but override the texture
        if (this.texFile) {
            model.addEventListener("load", () => model.views[0].textures[0] = this.texFile);
        }

        this.model = model;
    },

    addInstance() {
        const instance = this.model.addInstance();

        instance.setLocation(this.location);
        instance.setRotation(quat.setAxisAngle(quat.create(), vec3.UNIT_Z, this.angle));
        instance.setScale(this.scale);
        instance.setSequence(0);

        this.instance = instance;
    }
};

W3xSpecialDoodad = function (reader, version, map) {
    var id = read(reader, 4);
    var z = readFloat32(reader);
    var x = readFloat32(reader);
    var y = readFloat32(reader);

    var row = map.slkFiles.doodads.map[id] || map.slkFiles.destructabledata.map[id];
    if (row) {
        var path = row.file;

        if (row.numVar > 1) {
            path += variation;
        }

        path += ".mdx";

        console.log("W3xSpecialDoodad", path)
        //var instance = viewer.load(path, mpqPaths);
        //instance.setLocation([x, y, z]);
    }
}

W3xModification = function (reader, useOptionalInts) {
    this.id = read(reader, 4);

    var variableType = readInt32(reader);

    if (useOptionalInts) {
        this.levelOrVariation = readInt32(reader);
        this.dataPointer = readInt32(reader);
    }

    if (variableType === 0) {
        this.value = readInt32(reader);
    } else if (variableType === 1 || variableType === 2) {
        this.value = readFloat32(reader);
    } else if (variableType === 3) {
        this.value = readUntilNull(reader);
    }

    var endModification = read(reader, 4);
};

W3xModifiedObject = function (reader, useOptionalInts) {
    this.oldID = read(reader, 4);
    this.newID = read(reader, 4);
    this.modifications = [];

    for (var i = 0, l = readInt32(reader) ; i < l; i++) {
        this.modifications[i] = new W3xModification(reader, useOptionalInts);

    }
};

W3xModificationTable = function (reader, useOptionalInts) {
    this.objects = [];

    for (var i = 0, l = readInt32(reader) ; i < l; i++) {
        this.objects[i] = new W3xModifiedObject(reader, useOptionalInts);
    }
};

W3xTilePoint = function (reader) {
    this.groundHeight = readInt16(reader);

    var short = readInt16(reader);

    this.waterLevel = short & 0x3FFF;
    this.mapEdge = short & 0xC000;

    var byte = readInt8(reader);

    this.groundTextureType = byte & 0x0F;

    var flags = byte & 0xF0;
    this.ramp = flags & 0x0010;
    this.blight = flags & 0x0020;
    this.water = flags & 0x0040;
    this.boundry = flags & 0x4000;

    this.textureDetails = readInt8(reader);

    byte = readInt8(reader);

    this.cliffTextureType = (byte & 0xF0) >> 4;
    this.layerHeight = byte & 0x0F;

    this.isCliff = false;
    this.cliffHeight = 0;
    this.cliffFlags = 0;

    //console.log(this.cliffTextureType)
};

W3xTilePoint.prototype = {
    getHeight() {
        return ((this.groundHeight - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4) / 128;
    },

    getCliffHeight() {
        return ((this.groundHeight - 0x2000 + (this.layerHeight - 2) * 0x0200) / 4 - this.cliffHeight * 64) / 128;
    }
};
