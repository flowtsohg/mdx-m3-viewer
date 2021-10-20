import Modification from '../../../parsers/w3x/w3u/modification';
import ModificationTable from '../../../parsers/w3x/w3u/modificationtable';
import ModifiedObject from '../../../parsers/w3x/w3u/modifiedobject';
import { MappedData } from '../../mappeddata';
import { OEItem } from './item';
import { OEObject } from './object';
import { OEUnit } from './unit';

const NULL = '\0\0\0\0';

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

  copy(baseIdOrObject: string | T): T | undefined {
    const id = 'asd1';
    let baseId;
    let modifications;

    if (typeof baseIdOrObject === 'string') {
      baseId = baseIdOrObject;

      const baseObject = this.objects.get(id);
      if (baseObject) {
        modifications = baseObject.modifications;
      }
    } else {
      baseId = baseIdOrObject.oldId;
      modifications = baseIdOrObject.modifications;
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

  get(id: string): T | undefined {
    let object = this.objects.get(id);

    // If this object exists in the base data, get it and add it to the objects list in case it is modified by the caller.
    if (!object && !!this.data.getRow(id)) {
      object = this.addObject(id, NULL, []);

      this.objects.set(id, object);
    }

    return object;
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

export class OEUnits extends OEContainer<OEUnit> {
  addObject(oldId: string, newId: string, modifications: Modification[]): OEUnit {
    return new OEUnit(this, oldId, newId, modifications);
  }
}

export class OEItems extends OEContainer<OEItem> {
  addObject(oldId: string, newId: string, modifications: Modification[]): OEItem {
    return new OEItem(this, oldId, newId, modifications);
  }
}
