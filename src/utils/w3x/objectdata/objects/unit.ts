import { OEObject } from './object';

export class OEUnit extends OEObject {
  get requiredAnimationNames(): string { return this.string('uani'); }
  set requiredAnimationNames(value: string | undefined) { this.set('uani', value); }
  
  get iconGameInterface(): string { return this.string('uico'); }
  set iconGameInterface(value: string | undefined) { this.set('uico', value); }
  
  get requiredAnimationNamesAttachments(): string { return this.string('uaap'); }
  set requiredAnimationNamesAttachments(value: string | undefined) { this.set('uaap', value); }
  
  get requiredAttachmentLinkNames(): string { return this.string('ualp'); }
  set requiredAttachmentLinkNames(value: string | undefined) { this.set('ualp', value); }
  
  get tooltipAwaken(): string { return this.string('uawt'); }
  set tooltipAwaken(value: string | undefined) { this.set('uawt', value); }
  
  get requiredBoneNames(): string { return this.string('ubpr'); }
  set requiredBoneNames(value: string | undefined) { this.set('ubpr', value); }
  
  get construction(): string { return this.string('ubsl'); }
  set construction(value: string | undefined) { this.set('ubsl', value); }
  
  get structuresBuilt(): string { return this.string('ubui'); }
  set structuresBuilt(value: string | undefined) { this.set('ubui', value); }
  
  get buttonPositionX(): number { return this.number('ubpx'); }
  set buttonPositionX(value: number | undefined) { this.set('ubpx', value); }
  
  get buttonPositionY(): number { return this.number('ubpy'); }
  set buttonPositionY(value: number | undefined) { this.set('ubpy', value); }
  
  get casterUpgradeArt(): string { return this.string('ucua'); }
  set casterUpgradeArt(value: string | undefined) { this.set('ucua', value); }
  
  get casterUpgradeNames(): string { return this.string('ucun'); }
  set casterUpgradeNames(value: string | undefined) { this.set('ucun', value); }
  
  get casterUpgradeTips(): string { return this.string('ucut'); }
  set casterUpgradeTips(value: string | undefined) { this.set('ucut', value); }
  
  get dependencyEquivalents(): string { return this.string('udep'); }
  set dependencyEquivalents(value: string | undefined) { this.set('udep', value); }
  
  get nameEditorSuffix(): string { return this.string('unsf'); }
  set nameEditorSuffix(value: string | undefined) { this.set('unsf', value); }
  
  get hotkey(): string { return this.string('uhot'); }
  set hotkey(value: string | undefined) { this.set('uhot', value); }
  
  get loopingFadeInRate(): number { return this.number('ulfi'); }
  set loopingFadeInRate(value: number | undefined) { this.set('ulfi', value); }
  
  get loopingFadeOutRate(): number { return this.number('ulfo'); }
  set loopingFadeOutRate(value: number | undefined) { this.set('ulfo', value); }
  
  get itemsMade(): string { return this.string('umki'); }
  set itemsMade(value: string | undefined) { this.set('umki', value); }
  
  get attack1ProjectileArc(): number { return this.number('uma1'); }
  set attack1ProjectileArc(value: number | undefined) { this.set('uma1', value); }
  
  get attack2ProjectileArc(): number { return this.number('uma2'); }
  set attack2ProjectileArc(value: number | undefined) { this.set('uma2', value); }
  
  get attack1ProjectileArt(): string { return this.string('ua1m'); }
  set attack1ProjectileArt(value: string | undefined) { this.set('ua1m', value); }
  
  get attack2ProjectileArt(): string { return this.string('ua2m'); }
  set attack2ProjectileArt(value: string | undefined) { this.set('ua2m', value); }
  
  get attack1ProjectileHomingEnabled(): boolean { return this.boolean('umh1'); }
  set attack1ProjectileHomingEnabled(value: boolean | undefined) { this.set('umh1', value); }
  
  get attack2ProjectileHomingEnabled(): boolean { return this.boolean('umh2'); }
  set attack2ProjectileHomingEnabled(value: boolean | undefined) { this.set('umh2', value); }
  
  get attack1ProjectileSpeed(): number { return this.number('ua1z'); }
  set attack1ProjectileSpeed(value: number | undefined) { this.set('ua1z', value); }
  
  get attack2ProjectileSpeed(): number { return this.number('ua2z'); }
  set attack2ProjectileSpeed(value: number | undefined) { this.set('ua2z', value); }
  
  get movement(): string { return this.string('umsl'); }
  set movement(value: string | undefined) { this.set('umsl', value); }
  
  get name(): string { return this.string('unam'); }
  set name(value: string | undefined) { this.set('unam', value); }
  
  get properNames(): string { return this.string('upro'); }
  set properNames(value: string | undefined) { this.set('upro', value); }
  
  get random(): string { return this.string('ursl'); }
  set random(value: string | undefined) { this.set('ursl', value); }
  
  get requirementsTiersUsed(): number { return this.number('urqc'); }
  set requirementsTiersUsed(value: number | undefined) { this.set('urqc', value); }
  
  get requirements(): string { return this.string('ureq'); }
  set requirements(value: string | undefined) { this.set('ureq', value); }
  
  get requirementsTier2(): string { return this.string('urq1'); }
  set requirementsTier2(value: string | undefined) { this.set('urq1', value); }
  
  get requirementsTier3(): string { return this.string('urq2'); }
  set requirementsTier3(value: string | undefined) { this.set('urq2', value); }
  
  get requirementsTier4(): string { return this.string('urq3'); }
  set requirementsTier4(value: string | undefined) { this.set('urq3', value); }
  
  get requirementsTier5(): string { return this.string('urq4'); }
  set requirementsTier5(value: string | undefined) { this.set('urq4', value); }
  
  get requirementsTier6(): string { return this.string('urq5'); }
  set requirementsTier6(value: string | undefined) { this.set('urq5', value); }
  
  get requirementsTier7(): string { return this.string('urq6'); }
  set requirementsTier7(value: string | undefined) { this.set('urq6', value); }
  
  get requirementsTier8(): string { return this.string('urq7'); }
  set requirementsTier8(value: string | undefined) { this.set('urq7', value); }
  
  get requirementsTier9(): string { return this.string('urq8'); }
  set requirementsTier9(value: string | undefined) { this.set('urq8', value); }
  
  get requirementsLevels(): string { return this.string('urqa'); }
  set requirementsLevels(value: string | undefined) { this.set('urqa', value); }
  
  get researchesAvailable(): string { return this.string('ures'); }
  set researchesAvailable(value: string | undefined) { this.set('ures', value); }
  
  get revivesDeadHeroes(): boolean { return this.boolean('urev'); }
  set revivesDeadHeroes(value: boolean | undefined) { this.set('urev', value); }
  
  get tooltipRevive(): string { return this.string('utpr'); }
  set tooltipRevive(value: string | undefined) { this.set('utpr', value); }
  
  get iconScoreScreen(): string { return this.string('ussi'); }
  set iconScoreScreen(value: string | undefined) { this.set('ussi', value); }
  
  get itemsSold(): string { return this.string('usei'); }
  set itemsSold(value: string | undefined) { this.set('usei', value); }
  
  get unitsSold(): string { return this.string('useu'); }
  set unitsSold(value: string | undefined) { this.set('useu', value); }
  
  get special(): string { return this.string('uspa'); }
  set special(value: string | undefined) { this.set('uspa', value); }
  
  get target(): string { return this.string('utaa'); }
  set target(value: string | undefined) { this.set('utaa', value); }
  
  get tooltipBasic(): string { return this.string('utip'); }
  set tooltipBasic(value: string | undefined) { this.set('utip', value); }
  
  get unitsTrained(): string { return this.string('utra'); }
  set unitsTrained(value: string | undefined) { this.set('utra', value); }
  
  get heroRevivalLocations(): string { return this.string('urva'); }
  set heroRevivalLocations(value: string | undefined) { this.set('urva', value); }
  
  get tooltipExtended(): string { return this.string('utub'); }
  set tooltipExtended(value: string | undefined) { this.set('utub', value); }
  
  get upgradesTo(): string { return this.string('uupt'); }
  set upgradesTo(value: string | undefined) { this.set('uupt', value); }
  
  get normal(): string { return this.string('uabi'); }
  set normal(value: string | undefined) { this.set('uabi', value); }
  
  get defaultActiveAbility(): string { return this.string('udaa'); }
  set defaultActiveAbility(value: string | undefined) { this.set('udaa', value); }
  
  get hero(): string { return this.string('uhab'); }
  set hero(value: string | undefined) { this.set('uhab', value); }
  
  get startingAgility(): number { return this.number('uagi'); }
  set startingAgility(value: number | undefined) { this.set('uagi', value); }
  
  get agilityPerLevel(): number { return this.number('uagp'); }
  set agilityPerLevel(value: number | undefined) { this.set('uagp', value); }
  
  get buildTime(): number { return this.number('ubld'); }
  set buildTime(value: number | undefined) { this.set('ubld', value); }
  
  get goldBountyAwardedNumberOfDice(): number { return this.number('ubdi'); }
  set goldBountyAwardedNumberOfDice(value: number | undefined) { this.set('ubdi', value); }
  
  get goldBountyAwardedBase(): number { return this.number('ubba'); }
  set goldBountyAwardedBase(value: number | undefined) { this.set('ubba', value); }
  
  get goldBountyAwardedSidesPerDie(): number { return this.number('ubsi'); }
  set goldBountyAwardedSidesPerDie(value: number | undefined) { this.set('ubsi', value); }
  
  get lumberBountyAwardedNumberOfDice(): number { return this.number('ulbd'); }
  set lumberBountyAwardedNumberOfDice(value: number | undefined) { this.set('ulbd', value); }
  
  get lumberBountyAwardedBase(): number { return this.number('ulba'); }
  set lumberBountyAwardedBase(value: number | undefined) { this.set('ulba', value); }
  
  get lumberBountyAwardedSidesPerDie(): number { return this.number('ulbs'); }
  set lumberBountyAwardedSidesPerDie(value: number | undefined) { this.set('ulbs', value); }
  
  get collisionSize(): number { return this.number('ucol'); }
  set collisionSize(value: number | undefined) { this.set('ucol', value); }
  
  get defenseBase(): number { return this.number('udef'); }
  set defenseBase(value: number | undefined) { this.set('udef', value); }
  
  get defenseType(): string { return this.string('udty'); }
  set defenseType(value: string | undefined) { this.set('udty', value); }
  
  get defenseUpgradeBonus(): number { return this.number('udup'); }
  set defenseUpgradeBonus(value: number | undefined) { this.set('udup', value); }
  
  get foodProduced(): number { return this.number('ufma'); }
  set foodProduced(value: number | undefined) { this.set('ufma', value); }
  
  get foodCost(): number { return this.number('ufoo'); }
  set foodCost(value: number | undefined) { this.set('ufoo', value); }
  
  get goldCost(): number { return this.number('ugol'); }
  set goldCost(value: number | undefined) { this.set('ugol', value); }
  
  get repairGoldCost(): number { return this.number('ugor'); }
  set repairGoldCost(value: number | undefined) { this.set('ugor', value); }
  
  get hitPointsMaximumBase(): number { return this.number('uhpm'); }
  set hitPointsMaximumBase(value: number | undefined) { this.set('uhpm', value); }
  
  get startingIntelligence(): number { return this.number('uint'); }
  set startingIntelligence(value: number | undefined) { this.set('uint', value); }
  
  get intelligencePerLevel(): number { return this.number('uinp'); }
  set intelligencePerLevel(value: number | undefined) { this.set('uinp', value); }
  
  get isABuilding(): boolean { return this.boolean('ubdg'); }
  set isABuilding(value: boolean | undefined) { this.set('ubdg', value); }
  
  get level(): number { return this.number('ulev'); }
  set level(value: number | undefined) { this.set('ulev', value); }
  
  get lumberCost(): number { return this.number('ulum'); }
  set lumberCost(value: number | undefined) { this.set('ulum', value); }
  
  get repairLumberCost(): number { return this.number('ulur'); }
  set repairLumberCost(value: number | undefined) { this.set('ulur', value); }
  
  get manaInitialAmount(): number { return this.number('umpi'); }
  set manaInitialAmount(value: number | undefined) { this.set('umpi', value); }
  
  get manaMaximum(): number { return this.number('umpm'); }
  set manaMaximum(value: number | undefined) { this.set('umpm', value); }
  
  get speedMaximum(): number { return this.number('umas'); }
  set speedMaximum(value: number | undefined) { this.set('umas', value); }
  
  get speedMinimum(): number { return this.number('umis'); }
  set speedMinimum(value: number | undefined) { this.set('umis', value); }
  
  get neutralBuildingValidAsRandomBuilding(): boolean { return this.boolean('unbr'); }
  set neutralBuildingValidAsRandomBuilding(value: boolean | undefined) { this.set('unbr', value); }
  
  get sightRadiusNight(): number { return this.number('usin'); }
  set sightRadiusNight(value: number | undefined) { this.set('usin', value); }
  
  get placementRequires(): string { return this.string('upap'); }
  set placementRequires(value: string | undefined) { this.set('upap', value); }
  
  get primaryAttribute(): string { return this.string('upra'); }
  set primaryAttribute(value: string | undefined) { this.set('upra', value); }
  
  get hitPointsRegenerationRate(): number { return this.number('uhpr'); }
  set hitPointsRegenerationRate(value: number | undefined) { this.set('uhpr', value); }
  
  get manaRegeneration(): number { return this.number('umpr'); }
  set manaRegeneration(value: number | undefined) { this.set('umpr', value); }
  
  get hitPointsRegenerationType(): string { return this.string('uhrt'); }
  set hitPointsRegenerationType(value: string | undefined) { this.set('uhrt', value); }
  
  get repairTime(): number { return this.number('urtm'); }
  set repairTime(value: number | undefined) { this.set('urtm', value); }
  
  get groupSeparationEnabled(): boolean { return this.boolean('urpo'); }
  set groupSeparationEnabled(value: boolean | undefined) { this.set('urpo', value); }
  
  get groupSeparationGroupNumber(): number { return this.number('urpg'); }
  set groupSeparationGroupNumber(value: number | undefined) { this.set('urpg', value); }
  
  get groupSeparationParameter(): number { return this.number('urpp'); }
  set groupSeparationParameter(value: number | undefined) { this.set('urpp', value); }
  
  get groupSeparationPriority(): number { return this.number('urpr'); }
  set groupSeparationPriority(value: number | undefined) { this.set('urpr', value); }
  
  get placementPreventedBy(): string { return this.string('upar'); }
  set placementPreventedBy(value: string | undefined) { this.set('upar', value); }
  
  get sightRadiusDay(): number { return this.number('usid'); }
  set sightRadiusDay(value: number | undefined) { this.set('usid', value); }
  
  get speedBase(): number { return this.number('umvs'); }
  set speedBase(value: number | undefined) { this.set('umvs', value); }
  
  get stockMaximum(): number { return this.number('usma'); }
  set stockMaximum(value: number | undefined) { this.set('usma', value); }
  
  get stockReplenishInterval(): number { return this.number('usrg'); }
  set stockReplenishInterval(value: number | undefined) { this.set('usrg', value); }
  
  get stockStartDelay(): number { return this.number('usst'); }
  set stockStartDelay(value: number | undefined) { this.set('usst', value); }
  
  get stockInitialAfterStartDelay(): number { return this.number('usit'); }
  set stockInitialAfterStartDelay(value: number | undefined) { this.set('usit', value); }
  
  get startingStrength(): number { return this.number('ustr'); }
  set startingStrength(value: number | undefined) { this.set('ustr', value); }
  
  get strengthPerLevel(): number { return this.number('ustp'); }
  set strengthPerLevel(value: number | undefined) { this.set('ustp', value); }
  
  get tilesets(): string { return this.string('util'); }
  set tilesets(value: string | undefined) { this.set('util', value); }
  
  get unitClassification(): string { return this.string('utyp'); }
  set unitClassification(value: string | undefined) { this.set('utyp', value); }
  
  get upgradesUsed(): string { return this.string('upgr'); }
  set upgradesUsed(value: string | undefined) { this.set('upgr', value); }
  
  get aIPlacementRadius(): number { return this.number('uabr'); }
  set aIPlacementRadius(value: number | undefined) { this.set('uabr', value); }
  
  get aIPlacementType(): string { return this.string('uabt'); }
  set aIPlacementType(value: string | undefined) { this.set('uabt', value); }
  
  get canBuildOn(): boolean { return this.boolean('ucbo'); }
  set canBuildOn(value: boolean | undefined) { this.set('ucbo', value); }
  
  get canFlee(): boolean { return this.boolean('ufle'); }
  set canFlee(value: boolean | undefined) { this.set('ufle', value); }
  
  get sleeps(): boolean { return this.boolean('usle'); }
  set sleeps(value: boolean | undefined) { this.set('usle', value); }
  
  get transportedSize(): number { return this.number('ucar'); }
  set transportedSize(value: number | undefined) { this.set('ucar', value); }
  
  get deathTimeSeconds(): number { return this.number('udtm'); }
  set deathTimeSeconds(value: number | undefined) { this.set('udtm', value); }
  
  get deathType(): string { return this.string('udea'); }
  set deathType(value: string | undefined) { this.set('udea', value); }
  
  get useExtendedLineOfSight(): boolean { return this.boolean('ulos'); }
  set useExtendedLineOfSight(value: boolean | undefined) { this.set('ulos', value); }
  
  get formationRank(): number { return this.number('ufor'); }
  set formationRank(value: number | undefined) { this.set('ufor', value); }
  
  get canBeBuiltOn(): boolean { return this.boolean('uibo'); }
  set canBeBuiltOn(value: boolean | undefined) { this.set('uibo', value); }
  
  get heightMinimum(): number { return this.number('umvf'); }
  set heightMinimum(value: number | undefined) { this.set('umvf', value); }
  
  get height(): number { return this.number('umvh'); }
  set height(value: number | undefined) { this.set('umvh', value); }
  
  get type(): string { return this.string('umvt'); }
  set type(value: string | undefined) { this.set('umvt', value); }
  
  get properNamesUsed(): number { return this.number('upru'); }
  set properNamesUsed(value: number | undefined) { this.set('upru', value); }
  
  get orientationInterpolation(): number { return this.number('uori'); }
  set orientationInterpolation(value: number | undefined) { this.set('uori', value); }
  
  get pathingMap(): string { return this.string('upat'); }
  set pathingMap(value: string | undefined) { this.set('upat', value); }
  
  get pointValue(): number { return this.number('upoi'); }
  set pointValue(value: number | undefined) { this.set('upoi', value); }
  
  get priority(): number { return this.number('upri'); }
  set priority(value: number | undefined) { this.set('upri', value); }
  
  get propulsionWindowDegrees(): number { return this.number('uprw'); }
  set propulsionWindowDegrees(value: number | undefined) { this.set('uprw', value); }
  
  get race(): string { return this.string('urac'); }
  set race(value: string | undefined) { this.set('urac', value); }
  
  get placementRequiresWaterRadius(): number { return this.number('upaw'); }
  set placementRequiresWaterRadius(value: number | undefined) { this.set('upaw', value); }
  
  get targetedAs(): string { return this.string('utar'); }
  set targetedAs(value: string | undefined) { this.set('utar', value); }
  
  get turnRate(): number { return this.number('umvr'); }
  set turnRate(value: number | undefined) { this.set('umvr', value); }
  
  get armorType(): string { return this.string('uarm'); }
  set armorType(value: string | undefined) { this.set('uarm', value); }
  
  get animationBlendTimeSeconds(): number { return this.number('uble'); }
  set animationBlendTimeSeconds(value: number | undefined) { this.set('uble', value); }
  
  get tintingColor3Blue(): number { return this.number('uclb'); }
  set tintingColor3Blue(value: number | undefined) { this.set('uclb', value); }
  
  get shadowTextureBuilding(): string { return this.string('ushb'); }
  set shadowTextureBuilding(value: string | undefined) { this.set('ushb', value); }
  
  get categorizationCampaign(): boolean { return this.boolean('ucam'); }
  set categorizationCampaign(value: boolean | undefined) { this.set('ucam', value); }
  
  get allowCustomTeamColor(): boolean { return this.boolean('utcc'); }
  set allowCustomTeamColor(value: boolean | undefined) { this.set('utcc', value); }
  
  get canDropItemsOnDeath(): boolean { return this.boolean('udro'); }
  set canDropItemsOnDeath(value: boolean | undefined) { this.set('udro', value); }
  
  get elevationSamplePoints(): number { return this.number('uept'); }
  set elevationSamplePoints(value: number | undefined) { this.set('uept', value); }
  
  get elevationSampleRadius(): number { return this.number('uerd'); }
  set elevationSampleRadius(value: number | undefined) { this.set('uerd', value); }
  
  get modelFile(): string { return this.string('umdl'); }
  set modelFile(value: string | undefined) { this.set('umdl', value); }
  
  get modelFileExtraVersions(): string { return this.string('uver'); }
  set modelFileExtraVersions(value: string | undefined) { this.set('uver', value); }
  
  get fogOfWarSampleRadius(): number { return this.number('ufrd'); }
  set fogOfWarSampleRadius(value: number | undefined) { this.set('ufrd', value); }
  
  get tintingColor2Green(): number { return this.number('uclg'); }
  set tintingColor2Green(value: number | undefined) { this.set('uclg', value); }
  
  get displayAsNeutralHostile(): boolean { return this.boolean('uhos'); }
  set displayAsNeutralHostile(value: boolean | undefined) { this.set('uhos', value); }
  
  get placeableInEditor(): boolean { return this.boolean('uine'); }
  set placeableInEditor(value: boolean | undefined) { this.set('uine', value); }
  
  get maximumPitchAngleDegrees(): number { return this.number('umxp'); }
  set maximumPitchAngleDegrees(value: number | undefined) { this.set('umxp', value); }
  
  get maximumRollAngleDegrees(): number { return this.number('umxr'); }
  set maximumRollAngleDegrees(value: number | undefined) { this.set('umxr', value); }
  
  get scalingValue(): number { return this.number('usca'); }
  set scalingValue(value: number | undefined) { this.set('usca', value); }
  
  get neutralBuildingShowsMinimapIcon(): boolean { return this.boolean('unbm'); }
  set neutralBuildingShowsMinimapIcon(value: boolean | undefined) { this.set('unbm', value); }
  
  get heroHideHeroInterfaceIcon(): boolean { return this.boolean('uhhb'); }
  set heroHideHeroInterfaceIcon(value: boolean | undefined) { this.set('uhhb', value); }
  
  get heroHideHeroMinimapDisplay(): boolean { return this.boolean('uhhm'); }
  set heroHideHeroMinimapDisplay(value: boolean | undefined) { this.set('uhhm', value); }
  
  get heroHideHeroDeathMessage(): boolean { return this.boolean('uhhd'); }
  set heroHideHeroDeathMessage(value: boolean | undefined) { this.set('uhhd', value); }
  
  get hideMinimapDisplay(): boolean { return this.boolean('uhom'); }
  set hideMinimapDisplay(value: boolean | undefined) { this.set('uhom', value); }
  
  get occluderHeight(): number { return this.number('uocc'); }
  set occluderHeight(value: number | undefined) { this.set('uocc', value); }
  
  get tintingColor1Red(): number { return this.number('uclr'); }
  set tintingColor1Red(value: number | undefined) { this.set('uclr', value); }
  
  get animationRunSpeed(): number { return this.number('urun'); }
  set animationRunSpeed(value: number | undefined) { this.set('urun', value); }
  
  get selectionScale(): number { return this.number('ussc'); }
  set selectionScale(value: number | undefined) { this.set('ussc', value); }
  
  get scaleProjectiles(): boolean { return this.boolean('uscb'); }
  set scaleProjectiles(value: boolean | undefined) { this.set('uscb', value); }
  
  get selectionCircleOnWater(): boolean { return this.boolean('usew'); }
  set selectionCircleOnWater(value: boolean | undefined) { this.set('usew', value); }
  
  get selectionCircleHeight(): number { return this.number('uslz'); }
  set selectionCircleHeight(value: number | undefined) { this.set('uslz', value); }
  
  get shadowImageHeight(): number { return this.number('ushh'); }
  set shadowImageHeight(value: number | undefined) { this.set('ushh', value); }
  
  get hasWaterShadow(): boolean { return this.boolean('ushr'); }
  set hasWaterShadow(value: boolean | undefined) { this.set('ushr', value); }
  
  get shadowImageWidth(): number { return this.number('ushw'); }
  set shadowImageWidth(value: number | undefined) { this.set('ushw', value); }
  
  get shadowImageCenterX(): number { return this.number('ushx'); }
  set shadowImageCenterX(value: number | undefined) { this.set('ushx', value); }
  
  get shadowImageCenterY(): number { return this.number('ushy'); }
  set shadowImageCenterY(value: number | undefined) { this.set('ushy', value); }
  
  get categorizationSpecial(): boolean { return this.boolean('uspe'); }
  set categorizationSpecial(value: boolean | undefined) { this.set('uspe', value); }
  
  get teamColor(): string { return this.string('utco'); }
  set teamColor(value: string | undefined) { this.set('utco', value); }
  
  get hasTilesetSpecificData(): boolean { return this.boolean('utss'); }
  set hasTilesetSpecificData(value: boolean | undefined) { this.set('utss', value); }
  
  get groundTexture(): string { return this.string('uubs'); }
  set groundTexture(value: string | undefined) { this.set('uubs', value); }
  
  get shadowImageUnit(): string { return this.string('ushu'); }
  set shadowImageUnit(value: string | undefined) { this.set('ushu', value); }
  
  get unitSoundSet(): string { return this.string('usnd'); }
  set unitSoundSet(value: string | undefined) { this.set('usnd', value); }
  
  get useClickHelper(): boolean { return this.boolean('uuch'); }
  set useClickHelper(value: boolean | undefined) { this.set('uuch', value); }
  
  get animationWalkSpeed(): number { return this.number('uwal'); }
  set animationWalkSpeed(value: number | undefined) { this.set('uwal', value); }
  
  get acquisitionRange(): number { return this.number('uacq'); }
  set acquisitionRange(value: number | undefined) { this.set('uacq', value); }
  
  get attack1AttackType(): string { return this.string('ua1t'); }
  set attack1AttackType(value: string | undefined) { this.set('ua1t', value); }
  
  get attack2AttackType(): string { return this.string('ua2t'); }
  set attack2AttackType(value: string | undefined) { this.set('ua2t', value); }
  
  get attack1AnimationBackswingPoint(): number { return this.number('ubs1'); }
  set attack1AnimationBackswingPoint(value: number | undefined) { this.set('ubs1', value); }
  
  get attack2AnimationBackswingPoint(): number { return this.number('ubs2'); }
  set attack2AnimationBackswingPoint(value: number | undefined) { this.set('ubs2', value); }
  
  get animationCastBackswing(): number { return this.number('ucbs'); }
  set animationCastBackswing(value: number | undefined) { this.set('ucbs', value); }
  
  get animationCastPoint(): number { return this.number('ucpt'); }
  set animationCastPoint(value: number | undefined) { this.set('ucpt', value); }
  
  get attack1CooldownTime(): number { return this.number('ua1c'); }
  set attack1CooldownTime(value: number | undefined) { this.set('ua1c', value); }
  
  get attack2CooldownTime(): number { return this.number('ua2c'); }
  set attack2CooldownTime(value: number | undefined) { this.set('ua2c', value); }
  
  get attack1DamageLossFactor(): number { return this.number('udl1'); }
  set attack1DamageLossFactor(value: number | undefined) { this.set('udl1', value); }
  
  get attack2DamageLossFactor(): number { return this.number('udl2'); }
  set attack2DamageLossFactor(value: number | undefined) { this.set('udl2', value); }
  
  get attack1DamageNumberOfDice(): number { return this.number('ua1d'); }
  set attack1DamageNumberOfDice(value: number | undefined) { this.set('ua1d', value); }
  
  get attack2DamageNumberOfDice(): number { return this.number('ua2d'); }
  set attack2DamageNumberOfDice(value: number | undefined) { this.set('ua2d', value); }
  
  get attack1DamageBase(): number { return this.number('ua1b'); }
  set attack1DamageBase(value: number | undefined) { this.set('ua1b', value); }
  
  get attack2DamageBase(): number { return this.number('ua2b'); }
  set attack2DamageBase(value: number | undefined) { this.set('ua2b', value); }
  
  get attack1AnimationDamagePoint(): number { return this.number('udp1'); }
  set attack1AnimationDamagePoint(value: number | undefined) { this.set('udp1', value); }
  
  get attack2AnimationDamagePoint(): number { return this.number('udp2'); }
  set attack2AnimationDamagePoint(value: number | undefined) { this.set('udp2', value); }
  
  get attack1DamageUpgradeAmount(): number { return this.number('udu1'); }
  set attack1DamageUpgradeAmount(value: number | undefined) { this.set('udu1', value); }
  
  get attack2DamageUpgradeAmount(): number { return this.number('udu2'); }
  set attack2DamageUpgradeAmount(value: number | undefined) { this.set('udu2', value); }
  
  get attack1AreaOfEffectFullDamage(): number { return this.number('ua1f'); }
  set attack1AreaOfEffectFullDamage(value: number | undefined) { this.set('ua1f', value); }
  
  get attack2AreaOfEffectFullDamage(): number { return this.number('ua2f'); }
  set attack2AreaOfEffectFullDamage(value: number | undefined) { this.set('ua2f', value); }
  
  get attack1AreaOfEffectMediumDamage(): number { return this.number('ua1h'); }
  set attack1AreaOfEffectMediumDamage(value: number | undefined) { this.set('ua1h', value); }
  
  get attack2AreaOfEffectMediumDamage(): number { return this.number('ua2h'); }
  set attack2AreaOfEffectMediumDamage(value: number | undefined) { this.set('ua2h', value); }
  
  get attack1DamageFactorMedium(): number { return this.number('uhd1'); }
  set attack1DamageFactorMedium(value: number | undefined) { this.set('uhd1', value); }
  
  get attack2DamageFactorMedium(): number { return this.number('uhd2'); }
  set attack2DamageFactorMedium(value: number | undefined) { this.set('uhd2', value); }
  
  get projectileImpactZSwimming(): number { return this.number('uisz'); }
  set projectileImpactZSwimming(value: number | undefined) { this.set('uisz', value); }
  
  get projectileImpactZ(): number { return this.number('uimz'); }
  set projectileImpactZ(value: number | undefined) { this.set('uimz', value); }
  
  get projectileLaunchZSwimming(): number { return this.number('ulsz'); }
  set projectileLaunchZSwimming(value: number | undefined) { this.set('ulsz', value); }
  
  get projectileLaunchX(): number { return this.number('ulpx'); }
  set projectileLaunchX(value: number | undefined) { this.set('ulpx', value); }
  
  get projectileLaunchY(): number { return this.number('ulpy'); }
  set projectileLaunchY(value: number | undefined) { this.set('ulpy', value); }
  
  get projectileLaunchZ(): number { return this.number('ulpz'); }
  set projectileLaunchZ(value: number | undefined) { this.set('ulpz', value); }
  
  get minimumAttackRange(): number { return this.number('uamn'); }
  set minimumAttackRange(value: number | undefined) { this.set('uamn', value); }
  
  get attack1AreaOfEffectSmallDamage(): number { return this.number('ua1q'); }
  set attack1AreaOfEffectSmallDamage(value: number | undefined) { this.set('ua1q', value); }
  
  get attack2AreaOfEffectSmallDamage(): number { return this.number('ua2q'); }
  set attack2AreaOfEffectSmallDamage(value: number | undefined) { this.set('ua2q', value); }
  
  get attack1DamageFactorSmall(): number { return this.number('uqd1'); }
  set attack1DamageFactorSmall(value: number | undefined) { this.set('uqd1', value); }
  
  get attack2DamageFactorSmall(): number { return this.number('uqd2'); }
  set attack2DamageFactorSmall(value: number | undefined) { this.set('uqd2', value); }
  
  get attack1Range(): number { return this.number('ua1r'); }
  set attack1Range(value: number | undefined) { this.set('ua1r', value); }
  
  get attack2Range(): number { return this.number('ua2r'); }
  set attack2Range(value: number | undefined) { this.set('ua2r', value); }
  
  get attack1RangeMotionBuffer(): number { return this.number('urb1'); }
  set attack1RangeMotionBuffer(value: number | undefined) { this.set('urb1', value); }
  
  get attack2RangeMotionBuffer(): number { return this.number('urb2'); }
  set attack2RangeMotionBuffer(value: number | undefined) { this.set('urb2', value); }
  
  get attack1ShowUI(): boolean { return this.boolean('uwu1'); }
  set attack1ShowUI(value: boolean | undefined) { this.set('uwu1', value); }
  
  get attack2ShowUI(): boolean { return this.boolean('uwu2'); }
  set attack2ShowUI(value: boolean | undefined) { this.set('uwu2', value); }
  
  get attack1DamageSidesPerDie(): number { return this.number('ua1s'); }
  set attack1DamageSidesPerDie(value: number | undefined) { this.set('ua1s', value); }
  
  get attack2DamageSidesPerDie(): number { return this.number('ua2s'); }
  set attack2DamageSidesPerDie(value: number | undefined) { this.set('ua2s', value); }
  
  get attack1DamageSpillDistance(): number { return this.number('usd1'); }
  set attack1DamageSpillDistance(value: number | undefined) { this.set('usd1', value); }
  
  get attack2DamageSpillDistance(): number { return this.number('usd2'); }
  set attack2DamageSpillDistance(value: number | undefined) { this.set('usd2', value); }
  
  get attack1DamageSpillRadius(): number { return this.number('usr1'); }
  set attack1DamageSpillRadius(value: number | undefined) { this.set('usr1', value); }
  
  get attack2DamageSpillRadius(): number { return this.number('usr2'); }
  set attack2DamageSpillRadius(value: number | undefined) { this.set('usr2', value); }
  
  get attack1AreaOfEffectTargets(): string { return this.string('ua1p'); }
  set attack1AreaOfEffectTargets(value: string | undefined) { this.set('ua1p', value); }
  
  get attack2AreaOfEffectTargets(): string { return this.string('ua2p'); }
  set attack2AreaOfEffectTargets(value: string | undefined) { this.set('ua2p', value); }
  
  get attack1MaximumNumberOfTargets(): number { return this.number('utc1'); }
  set attack1MaximumNumberOfTargets(value: number | undefined) { this.set('utc1', value); }
  
  get attack2MaximumNumberOfTargets(): number { return this.number('utc2'); }
  set attack2MaximumNumberOfTargets(value: number | undefined) { this.set('utc2', value); }
  
  get attack1TargetsAllowed(): string { return this.string('ua1g'); }
  set attack1TargetsAllowed(value: string | undefined) { this.set('ua1g', value); }
  
  get attack2TargetsAllowed(): string { return this.string('ua2g'); }
  set attack2TargetsAllowed(value: string | undefined) { this.set('ua2g', value); }
  
  get attacksEnabled(): string { return this.string('uaen'); }
  set attacksEnabled(value: string | undefined) { this.set('uaen', value); }
  
  get attack1WeaponType(): string { return this.string('ua1w'); }
  set attack1WeaponType(value: string | undefined) { this.set('ua1w', value); }
  
  get attack2WeaponType(): string { return this.string('ua2w'); }
  set attack2WeaponType(value: string | undefined) { this.set('ua2w', value); }
  
  get attack1WeaponSound(): string { return this.string('ucs1'); }
  set attack1WeaponSound(value: string | undefined) { this.set('ucs1', value); }
  
  get attack2WeaponSound(): string { return this.string('ucs2'); }
  set attack2WeaponSound(value: string | undefined) { this.set('ucs2', value); }
  
  get normalSkin(): string { return this.string('uabs'); }
  set normalSkin(value: string | undefined) { this.set('uabs', value); }
  
  get heroSkin(): string { return this.string('uhas'); }
  set heroSkin(value: string | undefined) { this.set('uhas', value); }  
}
