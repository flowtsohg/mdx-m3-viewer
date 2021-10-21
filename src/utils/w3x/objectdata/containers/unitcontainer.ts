import Modification from '../../../../parsers/w3x/w3u/modification';
import { FetchType, OEUnit } from '../objects/unit';
import { OEContainer } from './container';

export class OEUnitContainer extends OEContainer<OEUnit, FetchType> {
  addObject(oldId: string, newId: string, modifications: Modification[]): OEUnit {
    return new OEUnit(this, oldId, newId, modifications);
  }
}

