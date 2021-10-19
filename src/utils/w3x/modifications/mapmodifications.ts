import War3Map from '../../../parsers/w3x/map';
import War3MapW3u from '../../../parsers/w3x/w3u/file';
import { MappedData } from '../../mappeddata';
import ItemMod from './itemmodifications';
import Objects from './objects';
import UnitModifications from './unitmodifications';

export default class MapModifications {
  units: Objects<UnitModifications>;
  items: Objects<ItemMod>;

  constructor(unitMeta: MappedData, unitData: MappedData) {
    this.units = new Objects(UnitModifications, unitMeta, unitData);
    this.items = new Objects(ItemMod, unitMeta, unitData);
  }

  load(map: War3Map): void {
    const { w3u, w3t } = map.readModifications();
  
    if (w3u) {
      this.units.load(w3u.originalTable, w3u.customTable);
    }

    if (w3t) {
      this.items.load(w3t.originalTable, w3t.customTable);
    }
  }

  save(map: War3Map): void {
    if (this.units.objects.size) {
      const file = new War3MapW3u();
      
      file.version = 2;
  
      this.units.save(file.originalTable, file.customTable);

      map.set('war3map.w3u', file.save());
    }
  }
}
