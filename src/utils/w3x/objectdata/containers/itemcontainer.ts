import Modification from '../../../../parsers/w3x/w3u/modification';
import { FetchType, OEItem } from '../objects/item';
import { OEContainer } from './container';

export class OEItemContainer extends OEContainer<OEItem, FetchType> {
  addObject(oldId: string, newId: string, modifications: Modification[]): OEItem {
    return new OEItem(this, oldId, newId, modifications);
  }
}
