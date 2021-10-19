import Modification from '../../../parsers/w3x/w3u/modification';
import ModificationTable from '../../../parsers/w3x/w3u/modificationtable';
import ModifiedObject from '../../../parsers/w3x/w3u/modifiedobject';
import { MappedData } from '../../mappeddata';
import ObjectMod from './objectmodifications';

export default class Objects<T extends ObjectMod> {
  type: new (...any: any) => T;
  metaData: MappedData;
  data: MappedData;
  objects = new Map<string, ObjectMod>();

  constructor(type: new (...any: any) => T, metaData: MappedData, data: MappedData) {
    this.type = type;
    this.metaData = metaData;
    this.data = data;
  }

  load(originalTable: ModificationTable, customTable: ModificationTable): void {
    for (const { oldId, newId, modifications } of originalTable.objects) {
      this.objects.set(oldId, new this.type(this, oldId, newId, modifications));
    }

    for (const { oldId, newId, modifications } of customTable.objects) {
      this.objects.set(oldId, new this.type(this, oldId, newId, modifications));
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
      
        if (object.newId === '\0\0\0\0') {
          originalTable.objects.push(objectMod);
        } else {
          customTable.objects.push(objectMod);
        }
      }
    }
  }

  copy(baseId: string): T | undefined {
    const id = 'asd1'; 
    const object = new this.type(this, baseId, id, []);

    // If the base object has any modifications, copy them over.
    const baseObject = <T | undefined>this.objects.get(id);
    if (baseObject) {
      for (const [key, value] of baseObject.modifications) {
        object.modifications.set(key, value);
      }
    }

    this.objects.set(id, object);

    return object;
  }

  get(id: string): T | undefined {
    let object = <T | undefined>this.objects.get(id);

    // If this object exists in the base data, get it and add it to the objects list in case it is modified.
    if (!object && !!this.data.getRow(id)) {
      object = new this.type(this, id, '\0\0\0\0', []);

      this.objects.set(id, object);
    }

    return object;
  }
}
