import ObjectModifications from './objectmodifications';

export default class ItemModifications extends ObjectModifications {
  get abilities(): string { return <string>this.get('iabi'); }
  set abilities(value: string | undefined) { this.set('iabi', value); }
  
  get armorType(): string { return <string>this.get('iarm'); }
  set armorType(value: string | undefined) { this.set('iarm', value); }
  
  get classification(): string { return <string>this.get('icla'); }
  set classification(value: string | undefined) { this.set('icla', value); }
  
  get tintingColor3Blue(): number { return <number>this.get('iclb'); }
  set tintingColor3Blue(value: number | undefined) { this.set('iclb', value); }
  
  get tintingColor2Green(): number { return <number>this.get('iclg'); }
  set tintingColor2Green(value: number | undefined) { this.set('iclg', value); }
  
  get tintingColor1Red(): number { return <number>this.get('iclr'); }
  set tintingColor1Red(value: number | undefined) { this.set('iclr', value); }
  
  get cooldownGroup(): string { return <string>this.get('icid'); }
  set cooldownGroup(value: string | undefined) { this.set('icid', value); }
  
  get droppedWhenCarrierDies(): string { return <string>this.get('idrp'); }
  set droppedWhenCarrierDies(value: string | undefined) { this.set('idrp', value); }
  
  get canBeDropped(): string { return <string>this.get('idro'); }
  set canBeDropped(value: string | undefined) { this.set('idro', value); }
  
  get modelUsed(): string { return <string>this.get('ifil'); }
  set modelUsed(value: string | undefined) { this.set('ifil', value); }
  
  get goldCost(): number { return <number>this.get('igol'); }
  set goldCost(value: number | undefined) { this.set('igol', value); }
  
  get hitPoints(): number { return <number>this.get('ihtp'); }
  set hitPoints(value: number | undefined) { this.set('ihtp', value); }
  
  get ignoreCooldown(): string { return <string>this.get('iicd'); }
  set ignoreCooldown(value: string | undefined) { this.set('iicd', value); }
  
  get level(): number { return <number>this.get('ilev'); }
  set level(value: number | undefined) { this.set('ilev', value); }
  
  get lumberCost(): number { return <number>this.get('ilum'); }
  set lumberCost(value: number | undefined) { this.set('ilum', value); }
  
  get validTargetForTransformation(): string { return <string>this.get('imor'); }
  set validTargetForTransformation(value: string | undefined) { this.set('imor', value); }
  
  get levelUnclassified(): number { return <number>this.get('ilvo'); }
  set levelUnclassified(value: number | undefined) { this.set('ilvo', value); }
  
  get perishable(): string { return <string>this.get('iper'); }
  set perishable(value: string | undefined) { this.set('iper', value); }
  
  get includeAsRandomChoice(): string { return <string>this.get('iprn'); }
  set includeAsRandomChoice(value: string | undefined) { this.set('iprn', value); }
  
  get useAutomaticallyWhenAcquired(): string { return <string>this.get('ipow'); }
  set useAutomaticallyWhenAcquired(value: string | undefined) { this.set('ipow', value); }
  
  get priority(): number { return <number>this.get('ipri'); }
  set priority(value: number | undefined) { this.set('ipri', value); }
  
  get scalingValue(): number { return <number>this.get('isca'); }
  set scalingValue(value: number | undefined) { this.set('isca', value); }
  
  get selectionSizeEditor(): number { return <number>this.get('issc'); }
  set selectionSizeEditor(value: number | undefined) { this.set('issc', value); }
  
  get canBeSoldByMerchants(): string { return <string>this.get('isel'); }
  set canBeSoldByMerchants(value: string | undefined) { this.set('isel', value); }
  
  get canBeSoldToMerchants(): string { return <string>this.get('ipaw'); }
  set canBeSoldToMerchants(value: string | undefined) { this.set('ipaw', value); }
  
  get stockMaximum(): number { return <number>this.get('isto'); }
  set stockMaximum(value: number | undefined) { this.set('isto', value); }
  
  get stockReplenishInterval(): number { return <number>this.get('istr'); }
  set stockReplenishInterval(value: number | undefined) { this.set('istr', value); }
  
  get stockStartDelay(): number { return <number>this.get('isst'); }
  set stockStartDelay(value: number | undefined) { this.set('isst', value); }
  
  get stockInitialAfterStartDelay(): number { return <number>this.get('isit'); }
  set stockInitialAfterStartDelay(value: number | undefined) { this.set('isit', value); }
  
  get activelyUsed(): string { return <string>this.get('iusa'); }
  set activelyUsed(value: string | undefined) { this.set('iusa', value); }
  
  get numberofCharges(): number { return <number>this.get('iuse'); }
  set numberofCharges(value: number | undefined) { this.set('iuse', value); }
  
  get maxStacks(): number { return <number>this.get('ista'); }
  set maxStacks(value: number | undefined) { this.set('ista', value); }
  
  get interfaceIcon(): string { return <string>this.get('iico'); }
  set interfaceIcon(value: string | undefined) { this.set('iico', value); }
  
  get description(): string { return <string>this.get('ides'); }
  set description(value: string | undefined) { this.set('ides', value); }
}
