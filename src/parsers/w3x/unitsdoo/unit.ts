import BinaryStream from '../../../common/binarystream';
import DroppedItemSet from './droppeditemset';
import InventoryItem from './inventoryitem';
import ModifiedAbility from './modifiedability';
import RandomUnit from './randomunit';

/**
 * A unit.
 */
export default class Unit {
  id: string = '\0\0\0\0';
  variation: number = 0;
  location: Float32Array = new Float32Array(3);
  angle: number = 0;
  scale: Float32Array = new Float32Array([1, 1, 1]);
  flags: number = 0;
  player: number = 0;
  unknown: number = 0;
  hitpoints: number = -1;
  mana: number = -1;
  /**
   * @since 8
   */
  droppedItemTable: number = 0;
  droppedItemSets: DroppedItemSet[] = [];
  goldAmount: number = 0;
  targetAcquisition: number = 0;
  heroLevel: number = 0;
  /**
   * @since 8
   */
  heroStrength: number = 0;
  /**
   * @since 8
   */
  heroAgility: number = 0;
  /**
   * @since 8
   */
  heroIntelligence: number = 0;
  itemsInInventory: InventoryItem[] = [];
  modifiedAbilities: ModifiedAbility[] = [];
  randomFlag: number = 0;
  level: Uint8Array = new Uint8Array(3);
  itemClass: number = 0;
  unitGroup: number = 0;
  positionInGroup: number = 0;
  randomUnitTables: RandomUnit[] = [];
  customTeamColor: number = 0;
  waygate: number = 0;
  creationNumber: number = 0;

  load(stream: BinaryStream, version: number) {
    this.id = stream.read(4);
    this.variation = stream.readInt32();
    stream.readFloat32Array(this.location);
    this.angle = stream.readFloat32();
    stream.readFloat32Array(this.scale);
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
      stream.readUint8Array(this.level); // 24bit number
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

  save(stream: BinaryStream, version: number) {
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

  getByteLength(version: number) {
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
