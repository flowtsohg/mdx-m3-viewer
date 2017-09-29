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
    let items = [];

    for (var i = 0, l = reader.readInt32() ; i < l; i++) {
        items[i] = new W3xDroppedItem(reader);
    }

    this.items = items;
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
function W3xModifiedAbility(reader) {
    this.id = reader.read(4);
    this.activeForAutocast = reader.readInt32();
    this.heroLevel = reader.readInt32();
}

/**
 * @constructor
 * @param {BinaryReader} reader
 */
function W3xRandomUnit(reader) {
    this.id = reader.read(4);
    this.chance = reader.readInt32();
}

/**
 * @constructor
 * @param {BinaryReader} reader
 * @param {number} version
 */
function W3xParserUnit(reader, version) {
    this.id = reader.read(4);
    this.variation = reader.readInt32();
    this.location = reader.readFloat32Array(3);
    this.angle = reader.readFloat32();
    this.scale = reader.readFloat32Array(3);
    this.flags = reader.readUint8();
    this.player = reader.readInt32();
    reader.skip(2); // ?
    this.hitpoints = reader.readInt32();
    this.mana = reader.readInt32();

    if (version > 7) {
        var droppedItemTable = reader.readInt32();

        if (droppedItemTable !== -1) {
            console.warn("Dropped item table, must not read dropped item sets");
        }
    }

    var droppedItemSets = [];
    for (var i = 0, l = reader.readInt32(); i < l; i++) {
        droppedItemSets[i] = new W3xDroppedItemSet(reader);
    }

    this.goldAmount = reader.readInt32();
    this.targetAcquisition = reader.readFloat32();
    this.heroLevel = reader.readInt32();

    if (version > 7) {
        this.heroStrength = reader.readInt32();
        this.heroAgility = reader.readInt32();
        this.heroIntelligence = reader.readInt32();
    }

    var itemsInInventory = [];
    for (var i = 0, l = reader.readInt32(); i < l; i++) {
        itemsInInventory[i] = new W3xInventoryItem(reader);
    }

    var modifiedAbilities = [];
    for (var i = 0, l = reader.readInt32(); i < l; i++) {
        modifiedAbilities[i] = new W3xModifiedAbility(reader);
    }

    var randomUnitTable = [];
    var randomFlag = reader.readInt32();
    
    if (randomFlag === 0) {
        var level = reader.read(3); // 24bit number
        var itemClass = reader.readUint8();
    } else if (randomFlag === 1) {
        var unitGroup = reader.readUint32();
        var positionInGroup = reader.readUint32();
    } else if (randomFlag === 2) {
        for (let i = 0, l = reader.readInt32(); i < l; i++) {
            randomUnitTable[i] = new W3xRandomUnit(reader);
        }
    }

    this.customTeamColor = reader.readInt32();
    this.waygate = reader.readInt32();
    this.creationNumber = reader.readInt32();
}

export default W3xParserUnit;
