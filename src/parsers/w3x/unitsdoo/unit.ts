import BinaryStream from '../../../common/binarystream';
import DroppedItemSet from './droppeditemset';
import InventoryItem from './inventoryitem';
import ModifiedAbility from './modifiedability';
import RandomUnit from './randomunit';

/**
 * A unit.
 */
export default class Unit {
  id = '\0\0\0\0';
  variation = 0;
  location = new Float32Array(3);
  angle = 0;
  scale = new Float32Array([1, 1, 1]);
  /**
   * @since Game version 1.32
   */
  skin = '\0\0\0\0';
  flags = 0;
  player = 0;
  unknown = 0;
  hitpoints = -1;
  mana = -1;
  /**
   * @since 8
   */
  droppedItemTable = 0;
  droppedItemSets: DroppedItemSet[] = [];
  goldAmount = 0;
  targetAcquisition = 0;
  heroLevel = 0;
  /**
   * @since 8
   */
  heroStrength = 0;
  /**
   * @since 8
   */
  heroAgility = 0;
  /**
   * @since 8
   */
  heroIntelligence = 0;
  itemsInInventory: InventoryItem[] = [];
  modifiedAbilities: ModifiedAbility[] = [];
  randomFlag = 0;
  level = new Uint8Array(3);
  itemClass = 0;
  unitGroup = 0;
  positionInGroup = 0;
  randomUnitTables: RandomUnit[] = [];
  customTeamColor = 0;
  waygate = 0;
  creationNumber = 0;

  load(stream: BinaryStream, version: number, subversion: number, buildVersion: number): void {
    this.id = stream.readBinary(4);
    this.variation = stream.readInt32();
    stream.readFloat32Array(this.location);
    this.angle = stream.readFloat32();
    stream.readFloat32Array(this.scale);

    if (buildVersion > 131) {
      this.skin = stream.readBinary(4);
    }

    this.flags = stream.readUint8();
    this.player = stream.readInt32();
    this.unknown = stream.readUint16();
    this.hitpoints = stream.readInt32();
    this.mana = stream.readInt32();

    if (subversion > 10) {
      this.droppedItemTable = stream.readInt32();
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const set = new DroppedItemSet();

      set.load(stream);

      this.droppedItemSets[i] = set;
    }

    this.goldAmount = stream.readInt32();
    this.targetAcquisition = stream.readFloat32();
    this.heroLevel = stream.readInt32();

    if (subversion > 10) {
      this.heroStrength = stream.readInt32();
      this.heroAgility = stream.readInt32();
      this.heroIntelligence = stream.readInt32();
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const item = new InventoryItem();

      item.load(stream);

      this.itemsInInventory[i] = item;
    }

    for (let i = 0, l = stream.readInt32(); i < l; i++) {
      const modifiedAbility = new ModifiedAbility();

      modifiedAbility.load(stream);

      this.modifiedAbilities[i] = modifiedAbility;
    }

    this.randomFlag = stream.readInt32();

    if (this.randomFlag === 0) {
      stream.readUint8Array(this.level); // 24bit number
      this.itemClass = stream.readUint8();
    } else if (this.randomFlag === 1) {
      this.unitGroup = stream.readUint32();
      this.positionInGroup = stream.readUint32();
    } else if (this.randomFlag === 2) {
      for (let i = 0, l = stream.readInt32(); i < l; i++) {
        const randomUnit = new RandomUnit();

        randomUnit.load(stream);

        this.randomUnitTables[i] = randomUnit;
      }
    }

    this.customTeamColor = stream.readInt32();
    this.waygate = stream.readInt32();
    this.creationNumber = stream.readInt32();
  }

  save(stream: BinaryStream, version: number, subversion: number, buildVersion: number): void {
    stream.writeBinary(this.id);
    stream.writeInt32(this.variation);
    stream.writeFloat32Array(this.location);
    stream.writeFloat32(this.angle);
    stream.writeFloat32Array(this.scale);

    if (buildVersion > 131) {
      stream.writeBinary(this.skin);
    }

    stream.writeUint8(this.flags);
    stream.writeInt32(this.player);
    stream.writeUint16(this.unknown);
    stream.writeInt32(this.hitpoints);
    stream.writeInt32(this.mana);

    if (subversion > 10) {
      stream.writeInt32(this.droppedItemTable);
    }

    stream.writeInt32(this.droppedItemSets.length);

    for (const droppedItemSet of this.droppedItemSets) {
      droppedItemSet.save(stream);
    }

    stream.writeInt32(this.goldAmount);
    stream.writeFloat32(this.targetAcquisition);
    stream.writeInt32(this.heroLevel);

    if (subversion > 10) {
      stream.writeInt32(this.heroStrength);
      stream.writeInt32(this.heroAgility);
      stream.writeInt32(this.heroIntelligence);
    }

    stream.writeInt32(this.itemsInInventory.length);

    for (const itemInInventory of this.itemsInInventory) {
      itemInInventory.save(stream);
    }

    stream.writeInt32(this.modifiedAbilities.length);

    for (const modifiedAbility of this.modifiedAbilities) {
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

      for (const randomUnitTable of this.randomUnitTables) {
        randomUnitTable.save(stream);
      }
    }

    stream.writeInt32(this.customTeamColor);
    stream.writeInt32(this.waygate);
    stream.writeInt32(this.creationNumber);
  }

  getByteLength(version: number, subversion: number, buildVersion: number): number {
    let size = 91;

    if (buildVersion > 131) {
      size += 4;
    }

    if (subversion > 10) {
      size += 16;
    }

    for (const droppedItemSet of this.droppedItemSets) {
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
