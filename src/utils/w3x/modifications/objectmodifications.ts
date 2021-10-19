import Modification from '../../../parsers/w3x/w3u/modification';
import Objects from './objects';

export default class ObjectModifications {
  parent: Objects<any>;
  oldId: string;
  newId: string;
  modifications = new Map<string, string | number>();

  constructor(parent: Objects<any>, oldId: string, newId: string, modifications: Modification[]) {
    this.parent = parent;
    this.oldId = oldId;
    this.newId = newId;

    for (const modification of modifications) {
      this.modifications.set(modification.id, modification.value);
    }
  }

  get(id: string): string | number {
    let value = this.modifications.get(id);

    if (value === undefined) {
      const name = <string>this.parent.metaData.getProperty(id, 'field');

      value = <string | number>this.parent.data.getProperty(this.oldId, name);
    }

    return value;
  }

  set(id: string, value: string | number | undefined): void {
    if (value === undefined) {
      this.modifications.delete(id);
    } else {
      this.modifications.set(id, value);  
    }
  }
}
