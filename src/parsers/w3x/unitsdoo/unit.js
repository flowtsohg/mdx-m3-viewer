import DroppedItemSet from './droppeditemset';
import InventoryItem from './inventoryitem';
import ModifiedAbility from './modifiedability';
import RandomUnit from './randomunit';

/**
 * A unit.
 */
export default class Unit {
  /**
   *
   */
  constructor() {
    /** @member {string} */
    this.id = '\0\0\0\0';
    /** @member {number} */
    this.variation = 0;
    /** @member {Float32Array} */
    this.location = new Float32Array(3);
    /** @member {number} */
    this.angle = 0;
    /** @member {Float32Array} */
    this.scale = new Float32Array([1, 1, 1]);
    /** @member {number} */
    this.flags = 0;
    /** @member {number} */
    this.player = 0;
    /** @member {number} */
    this.unknown = 0;
    /** @member {number} */
    this.hitpoints = -1;
    /** @member {number} */
    this.mana = -1;
    /** @member {number} */
    this.droppedItemTable = 0; // VERSION 8
    /** @member {Array<DroppedItemSet>} */
    this.droppedItemSets = [];
    /** @member {number} */
    this.goldAmount = 0;
    /** @member {number} */
    this.targetAcquisition = 0;
    /** @member {number} */
    this.heroLevel = 0;
    /** @member {number} */
    this.heroStrength = 0; // VERSION 8
    /** @member {number} */
    this.heroAgility = 0; // VERSION 8
    /** @member {number} */
    this.heroIntelligence = 0; // VERSION 8
    /** @member {Array<InventoryItem>} */
    this.itemsInInventory = [];
    /** @member {Array<ModifiedAbility>} */
    this.modifiedAbilities = [];
    /** @member {number} */
    this.randomFlag = 0;
    /** @member {Uint8Array} */
    this.level = new Uint8Array(3);
    /** @member {number} */
    this.itemClass = 0;
    /** @member {number} */
    this.unitGroup = 0;
    /** @member {number} */
    this.positionInGroup = 0;
    /** @member {Array<RandomUnit>} */
    this.randomUnitTables = [];
    /** @member {number} */
    this.customTeamColor = 0;
    /** @member {number} */
    this.waygate = 0;
    /** @member {number} */
    this.creationNumber = 0;
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  load(stream, version) {
    this.id = stream.read(4);
    this.variation = stream.readInt32();
    this.location = stream.readFloat32Array(3);
    this.angle = stream.readFloat32();
    this.scale = stream.readFloat32Array(3);
    this.flags = stream.readUint8();
    this.player = stream.readInt32();
    this.unknown = stream.readUint16();
    this.hitpoints = stream.readInt32();
    this.mana = stream.readInt32();

    if (version > 7) {
      this.droppedItemTable = stream.readInt32();
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let set = new DroppedItemSet();

      set.load(stream);

      this.droppedItemSets[i] = set;
    }

    this.goldAmount = stream.readInt32();
    this.targetAcquisition = stream.readFloat32();
    this.heroLevel = stream.readInt32();

    if (version > 7) {
      this.heroStrength = stream.readInt32();
      this.heroAgility = stream.readInt32();
      this.heroIntelligence = stream.readInt32();
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let item = new InventoryItem();

      item.load(stream);

      this.itemsInInventory[i] = item;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      let modifiedAbility = new ModifiedAbility();

      modifiedAbility.load(stream);

      this.modifiedAbilities[i] = modifiedAbility;
    }

    this.randomFlag = stream.readInt32();

    if (this.randomFlag === 0) {
      this.level = stream.readUint8Array(3); // 24bit number
      this.itemClass = stream.readUint8();
    } else if (this.randomFlag === 1) {
      this.unitGroup = stream.readUint32();
      this.positionInGroup = stream.readUint32();
    } else if (this.randomFlag === 2) {
      for (let i = 0, l = stream.readInt32(); i < l; i++) {
        let randomUnit = new RandomUnit();

        randomUnit.load(stream);

        this.randomUnitTables[i] = randomUnit;
      }
    }

    this.customTeamColor = stream.readInt32();
    this.waygate = stream.readInt32();
    this.creationNumber = stream.readInt32();
  }

  /**
   * @param {BinaryStream} stream
   * @param {number} version
   */
  save(stream, version) {
    stream.write(this.id);
    stream.writeInt32(this.variation);
    stream.writeFloat32Array(this.location);
    stream.writeFloat32(this.angle);
    stream.writeFloat32Array(this.scale);
    stream.writeUint8(this.flags);
    stream.writeInt32(this.player);
    stream.writeUint16(this.unknown);
    stream.writeInt32(this.hitpoints);
    stream.writeInt32(this.mana);

    if (version > 7) {
      stream.writeInt32(this.droppedItemTable);
    }

    stream.writeInt32(this.droppedItemSets.length);

    for (let droppedItemSet of this.droppedItemSets) {
      droppedItemSet.save(stream);
    }

    stream.writeInt32(this.goldAmount);
    stream.writeFloat32(this.targetAcquisition);
    stream.writeInt32(this.heroLevel);

    if (version > 7) {
      stream.writeInt32(this.heroStrength);
      stream.writeInt32(this.heroAgility);
      stream.writeInt32(this.heroIntelligence);
    }

    stream.writeInt32(this.itemsInInventory.length);

    for (let itemInInventory of this.itemsInInventory) {
      itemInInventory.save(stream);
    }

    stream.writeInt32(this.modifiedAbilities.length);

    for (let modifiedAbility of this.modifiedAbilities) {
      modifiedAbility.save(stream);
    }

    stream.writeInt32(this.randomFlag);

    if (this.randomFlag === 0) {
      stream.writeUint8Array(this.level);
      stream.writeUint8(this.itemClass);
    } else if (this.randomFlag === 1) {
      stream.writeUint32(this.unitGroup);
      stream.writeUint32(this.positionInGroup);
    } else if (this.randomFlag === 2) {
      stream.writeInt32(this.randomUnitTables.length);

      for (let randomUnitTable of this.randomUnitTables) {
        randomUnitTable.save(stream);
      }
    }

    stream.writeInt32(this.customTeamColor);
    stream.writeInt32(this.waygate);
    stream.writeInt32(this.creationNumber);
  }

  /**
   * @param {number} version
   * @return {number}
   */
  getByteLength(version) {
    let size = 91;

    if (version > 7) {
      size += 16;
    }

    for (let droppedItemSet of this.droppedItemSets) {
      size += droppedItemSet.getByteLength();
    }

    size += this.itemsInInventory.length * 8;

    size += this.modifiedAbilities.length * 12;

    if (this.randomFlag === 0) {
      size += 4;
    } else if (this.randomFlag === 1) {
      size += 8;
    } else if (this.randomFlag === 2) {
      size += 4 + this.randomUnitTables.length * 8;
    }

    return size;
  }
}
