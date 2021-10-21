import Modification from '../../../../parsers/w3x/w3u/modification';
import { OEUnit } from '../objects/unit';
import { OEContainer } from './container';

export class OEUnitContainer extends OEContainer<OEUnit> {
  addObject(oldId: string, newId: string, modifications: Modification[]): OEUnit {
    return new OEUnit(this, oldId, newId, modifications);
  }
}

