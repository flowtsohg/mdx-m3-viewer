import { randomInRange } from '../../../../common/math';
import Modification from '../../../../parsers/w3x/w3u/modification';
import ModificationTable from '../../../../parsers/w3x/w3u/modificationtable';
import ModifiedObject from '../../../../parsers/w3x/w3u/modifiedobject';
import { MappedData } from '../../../mappeddata';
import { OEObject } from '../objects/object';

const NULL = '\0\0\0\0';
const GENERATE_ID_ATTEMPTS = 10000;

export abstract class OEContainer<T extends OEObject> {
  metaData: MappedData;
  data: MappedData;
  objects = new Map<string, T>();

  abstract addObject(oldId: string, newId: string, modifications: Modification[]): T;

  constructor(metaData: MappedData, data: MappedData) {
    this.metaData = metaData;
    this.data = data;
  }

  load(originalTable: ModificationTable, customTable: ModificationTable): void {
    for (const { oldId, newId, modifications } of originalTable.objects) {
      this.objects.set(oldId, this.addObject(oldId, newId, modifications));
    }

    for (const { oldId, newId, modifications } of customTable.objects) {
      this.objects.set(oldId, this.addObject(oldId, newId, modifications));
    }
  }

  save(originalTable: ModificationTable, customTable: ModificationTable): void {
    for (const object of this.objects.values()) {
      if (object.modifications.size) {
        const objectMod = new ModifiedObject();

        for (const [modId, modValue] of object.modifications) {
          const mod = new Modification();

          mod.id = modId;
          mod.value = modValue;

          if (typeof modValue === 'string') {
            mod.variableType = 3;
          } else if ((modValue | 0) !== modValue) {
            mod.variableType = 2;
          } else {
            mod.variableType = 0;
          }

          objectMod.modifications.push(mod);
        }

        objectMod.oldId = object.oldId;
        objectMod.newId = object.newId;
      
        if (object.newId === NULL) {
          originalTable.objects.push(objectMod);
        } else {
          customTable.objects.push(objectMod);
        }
      }
    }
  }

  /**
   * Given an object ID, get the object it refers to.
   * 
   * If a map's object data was loaded, it will be checked first.
   * 
   * If the object wasn't found, or map object data wasn't loaded, the base game data will be checked.
   */
  get(id: string): T | undefined {
    let object = this.objects.get(id);

    // If this object exists in the base data, get it and add it to the objects list in case it is modified by the caller.
    if (!object && !!this.data.getRow(id)) {
      object = this.addObject(id, NULL, []);

      this.objects.set(id, object);
    }

    return object;
  }

  /**
   * Checks if this collection has an object with the given ID.
   * 
   * Does not check the base game data.
   */
  has(id: string): boolean {
    return !!this.objects.get(id);
  }

  /**
   * Copy an existing object.
   * 
   * The source object can either be given as a string ID, or an object returned from previous get/copy calls.
   * 
   * If newId is supplied, it will be used as the new object's ID, otherwise a random ID is generated.
   * 
   * If a random ID is generated, its first letter will be capitalized if the base ID's first letter is capitalized, to support hero units.
   */
  copy(baseIdOrObject: string | T, newId?: string): T | undefined {
    let baseId;
    let modifications;

    if (typeof baseIdOrObject === 'string') {
      baseId = baseIdOrObject;

      const baseObject = this.objects.get(baseId);
      if (baseObject) {
        modifications = baseObject.modifications;
      }
    } else {
      baseId = baseIdOrObject.oldId;
      modifications = baseIdOrObject.modifications;
    }

    let id;

    if (newId) {
      id = newId;
    } else {
      id = this.generateId(baseId[0] === baseId[0].toUpperCase());
    }

    const object = this.addObject(baseId, id, []);

    if (modifications) {
      for (const [key, value] of modifications) {
        object.modifications.set(key, value);
      }
    }

    this.objects.set(id, object);

    return object;
  }

  generateId(capitalize: boolean): string {
    let first = 97;

    if (capitalize) {
      first = 65;
    }

    for (let i = 0; i < GENERATE_ID_ATTEMPTS; i++) {
      const id = String.fromCharCode(randomInRange(first, first + 25), randomInRange(97, 122), randomInRange(97, 122), randomInRange(97, 122));

      if (!this.has(id)) {
        return id;
      }
    }

    throw Error('FAILED TO GENERATE A UNIQUE ID');
  }

  hasModifications(): boolean {
    for (const object of this.objects.values()) {
      if (object.modifications.size > 0) {
        return true;
      }
    }

    return false;
  }
}
