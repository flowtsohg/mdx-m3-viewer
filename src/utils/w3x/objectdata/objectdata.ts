import War3MapW3u from '../../../parsers/w3x/w3u/file';
import { MappedData } from '../../mappeddata';
import { OEItems, OEUnits } from './containers';

interface ModificationFiles {
  w3u?: War3MapW3u,
  w3t?: War3MapW3u,
}

export default class ObjectData {
  units: OEUnits;
  items: OEItems;

  constructor(unitAndItemMeta: MappedData, unitData: MappedData, itemData: MappedData) {
    this.units = new OEUnits(unitAndItemMeta, unitData);
    this.items = new OEItems(unitAndItemMeta, itemData);
  }

  load({ w3u, w3t }: ModificationFiles): void {
    if (w3u) {
      this.units.load(w3u.originalTable, w3u.customTable);
    }

    if (w3t) {
      this.items.load(w3t.originalTable, w3t.customTable);
    }
  }

  save(): ModificationFiles {
    const modifications: ModificationFiles = {};

    if (this.units.hasModifications()) {
      const file = new War3MapW3u();

      file.version = 2;
  
      this.units.save(file.originalTable, file.customTable);

      modifications.w3u = file;
    }

    if (this.items.hasModifications()) {
      const file = new War3MapW3u();

      file.version = 2;
  
      this.items.save(file.originalTable, file.customTable);

      modifications.w3t = file;
    }

    return modifications;
  }
}
