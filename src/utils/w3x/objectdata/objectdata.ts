import War3MapW3u from '../../../parsers/w3x/w3u/file';
import { MappedData } from '../../mappeddata';
import { OEItemContainer } from './containers/itemcontainer';
import { OEUnitContainer } from './containers/unitcontainer';

export interface ModificationFiles {
  w3u?: War3MapW3u,
  w3t?: War3MapW3u,
}

export class ObjectData {
  units: OEUnitContainer;
  items: OEItemContainer;

  constructor(unitAndItemMeta: MappedData, unitData: MappedData, itemData: MappedData) {
    this.units = new OEUnitContainer(unitAndItemMeta, unitData);
    this.items = new OEItemContainer(unitAndItemMeta, itemData);
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
