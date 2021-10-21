import { OEObject } from './object';

export interface FetchType {
  abilities: string,
  armorType: string,
  classification: string,
  tintingColor3Blue: number,
  tintingColor2Green: number,
  tintingColor1Red: number,
  cooldownGroup: string,
  droppedWhenCarrierDies: boolean,
  canBeDropped: boolean,
  modelUsed: string,
  goldCost: number,
  hitPoints: number,
  ignoreCooldown: boolean,
  level: number,
  lumberCost: number,
  validTargetForTransformation: boolean,
  levelUnclassified: number,
  perishable: boolean,
  includeAsRandomChoice: boolean,
  useAutomaticallyWhenAcquired: boolean,
  priority: number,
  scalingValue: number,
  selectionSizeEditor: number,
  canBeSoldByMerchants: boolean,
  canBeSoldToMerchants: boolean,
  stockMaximum: number,
  stockReplenishInterval: number,
  stockStartDelay: number,
  stockInitialAfterStartDelay: number,
  activelyUsed: boolean,
  numberOfCharges: number,
  maxStacks: number,
  interfaceIcon: string,
  description: string
}

export class OEItem extends OEObject<FetchType> {
  get abilities(): string { return this.string('iabi'); }
  set abilities(value: string | undefined) { this.set('iabi', value); }

  get armorType(): string { return this.string('iarm'); }
  set armorType(value: string | undefined) { this.set('iarm', value); }

  get classification(): string { return this.string('icla'); }
  set classification(value: string | undefined) { this.set('icla', value); }

  get tintingColor3Blue(): number { return this.number('iclb'); }
  set tintingColor3Blue(value: number | undefined) { this.set('iclb', value); }

  get tintingColor2Green(): number { return this.number('iclg'); }
  set tintingColor2Green(value: number | undefined) { this.set('iclg', value); }

  get tintingColor1Red(): number { return this.number('iclr'); }
  set tintingColor1Red(value: number | undefined) { this.set('iclr', value); }

  get cooldownGroup(): string { return this.string('icid'); }
  set cooldownGroup(value: string | undefined) { this.set('icid', value); }

  get droppedWhenCarrierDies(): boolean { return this.boolean('idrp'); }
  set droppedWhenCarrierDies(value: boolean | undefined) { this.set('idrp', value); }

  get canBeDropped(): boolean { return this.boolean('idro'); }
  set canBeDropped(value: boolean | undefined) { this.set('idro', value); }

  get modelUsed(): string { return this.string('ifil'); }
  set modelUsed(value: string | undefined) { this.set('ifil', value); }

  get goldCost(): number { return this.number('igol'); }
  set goldCost(value: number | undefined) { this.set('igol', value); }

  get hitPoints(): number { return this.number('ihtp'); }
  set hitPoints(value: number | undefined) { this.set('ihtp', value); }

  get ignoreCooldown(): boolean { return this.boolean('iicd'); }
  set ignoreCooldown(value: boolean | undefined) { this.set('iicd', value); }

  get level(): number { return this.number('ilev'); }
  set level(value: number | undefined) { this.set('ilev', value); }

  get lumberCost(): number { return this.number('ilum'); }
  set lumberCost(value: number | undefined) { this.set('ilum', value); }

  get validTargetForTransformation(): boolean { return this.boolean('imor'); }
  set validTargetForTransformation(value: boolean | undefined) { this.set('imor', value); }

  get levelUnclassified(): number { return this.number('ilvo'); }
  set levelUnclassified(value: number | undefined) { this.set('ilvo', value); }

  get perishable(): boolean { return this.boolean('iper'); }
  set perishable(value: boolean | undefined) { this.set('iper', value); }

  get includeAsRandomChoice(): boolean { return this.boolean('iprn'); }
  set includeAsRandomChoice(value: boolean | undefined) { this.set('iprn', value); }

  get useAutomaticallyWhenAcquired(): boolean { return this.boolean('ipow'); }
  set useAutomaticallyWhenAcquired(value: boolean | undefined) { this.set('ipow', value); }

  get priority(): number { return this.number('ipri'); }
  set priority(value: number | undefined) { this.set('ipri', value); }

  get scalingValue(): number { return this.number('isca'); }
  set scalingValue(value: number | undefined) { this.set('isca', value); }

  get selectionSizeEditor(): number { return this.number('issc'); }
  set selectionSizeEditor(value: number | undefined) { this.set('issc', value); }

  get canBeSoldByMerchants(): boolean { return this.boolean('isel'); }
  set canBeSoldByMerchants(value: boolean | undefined) { this.set('isel', value); }

  get canBeSoldToMerchants(): boolean { return this.boolean('ipaw'); }
  set canBeSoldToMerchants(value: boolean | undefined) { this.set('ipaw', value); }

  get stockMaximum(): number { return this.number('isto'); }
  set stockMaximum(value: number | undefined) { this.set('isto', value); }

  get stockReplenishInterval(): number { return this.number('istr'); }
  set stockReplenishInterval(value: number | undefined) { this.set('istr', value); }

  get stockStartDelay(): number { return this.number('isst'); }
  set stockStartDelay(value: number | undefined) { this.set('isst', value); }

  get stockInitialAfterStartDelay(): number { return this.number('isit'); }
  set stockInitialAfterStartDelay(value: number | undefined) { this.set('isit', value); }

  get activelyUsed(): boolean { return this.boolean('iusa'); }
  set activelyUsed(value: boolean | undefined) { this.set('iusa', value); }

  get numberOfCharges(): number { return this.number('iuse'); }
  set numberOfCharges(value: number | undefined) { this.set('iuse', value); }

  get maxStacks(): number { return this.number('ista'); }
  set maxStacks(value: number | undefined) { this.set('ista', value); }

  get interfaceIcon(): string { return this.string('iico'); }
  set interfaceIcon(value: string | undefined) { this.set('iico', value); }

  get description(): string { return this.string('ides'); }
  set description(value: string | undefined) { this.set('ides', value); }

  fetch(): FetchType { return { abilities: this.abilities, armorType: this.armorType, classification: this.classification, tintingColor3Blue: this.tintingColor3Blue, tintingColor2Green: this.tintingColor2Green, tintingColor1Red: this.tintingColor1Red, cooldownGroup: this.cooldownGroup, droppedWhenCarrierDies: this.droppedWhenCarrierDies, canBeDropped: this.canBeDropped, modelUsed: this.modelUsed, goldCost: this.goldCost, hitPoints: this.hitPoints, ignoreCooldown: this.ignoreCooldown, level: this.level, lumberCost: this.lumberCost, validTargetForTransformation: this.validTargetForTransformation, levelUnclassified: this.levelUnclassified, perishable: this.perishable, includeAsRandomChoice: this.includeAsRandomChoice, useAutomaticallyWhenAcquired: this.useAutomaticallyWhenAcquired, priority: this.priority, scalingValue: this.scalingValue, selectionSizeEditor: this.selectionSizeEditor, canBeSoldByMerchants: this.canBeSoldByMerchants, canBeSoldToMerchants: this.canBeSoldToMerchants, stockMaximum: this.stockMaximum, stockReplenishInterval: this.stockReplenishInterval, stockStartDelay: this.stockStartDelay, stockInitialAfterStartDelay: this.stockInitialAfterStartDelay, activelyUsed: this.activelyUsed, numberOfCharges: this.numberOfCharges, maxStacks: this.maxStacks, interfaceIcon: this.interfaceIcon, description: this.description }; }
}
