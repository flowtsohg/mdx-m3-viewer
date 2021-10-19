import ObjectModifications from './objectmodifications';

export default class UnitModifications extends ObjectModifications {
  get requiredAnimationNames(): string { return <string>this.get('uani'); }
  set requiredAnimationNames(value: string | undefined) { this.set('uani', value); }
  
  get iconGameInterface(): string { return <string>this.get('uico'); }
  set iconGameInterface(value: string | undefined) { this.set('uico', value); }
  
  get requiredAnimationNamesAttachments(): string { return <string>this.get('uaap'); }
  set requiredAnimationNamesAttachments(value: string | undefined) { this.set('uaap', value); }
  
  get requiredAttachmentLinkNames(): string { return <string>this.get('ualp'); }
  set requiredAttachmentLinkNames(value: string | undefined) { this.set('ualp', value); }
  
  get tooltipAwaken(): string { return <string>this.get('uawt'); }
  set tooltipAwaken(value: string | undefined) { this.set('uawt', value); }
  
  get requiredBoneNames(): string { return <string>this.get('ubpr'); }
  set requiredBoneNames(value: string | undefined) { this.set('ubpr', value); }
  
  get construction(): string { return <string>this.get('ubsl'); }
  set construction(value: string | undefined) { this.set('ubsl', value); }
  
  get structuresBuilt(): string { return <string>this.get('ubui'); }
  set structuresBuilt(value: string | undefined) { this.set('ubui', value); }
  
  get buttonPositionX(): number { return <number>this.get('ubpx'); }
  set buttonPositionX(value: number | undefined) { this.set('ubpx', value); }
  
  get buttonPositionY(): number { return <number>this.get('ubpy'); }
  set buttonPositionY(value: number | undefined) { this.set('ubpy', value); }
  
  get casterUpgradeArt(): string { return <string>this.get('ucua'); }
  set casterUpgradeArt(value: string | undefined) { this.set('ucua', value); }
  
  get casterUpgradeNames(): string { return <string>this.get('ucun'); }
  set casterUpgradeNames(value: string | undefined) { this.set('ucun', value); }
  
  get casterUpgradeTips(): string { return <string>this.get('ucut'); }
  set casterUpgradeTips(value: string | undefined) { this.set('ucut', value); }
  
  get dependencyEquivalents(): string { return <string>this.get('udep'); }
  set dependencyEquivalents(value: string | undefined) { this.set('udep', value); }
  
  get nameEditorSuffix(): string { return <string>this.get('unsf'); }
  set nameEditorSuffix(value: string | undefined) { this.set('unsf', value); }
  
  get hotkey(): string { return <string>this.get('uhot'); }
  set hotkey(value: string | undefined) { this.set('uhot', value); }
  
  get loopingFadeInRate(): number { return <number>this.get('ulfi'); }
  set loopingFadeInRate(value: number | undefined) { this.set('ulfi', value); }
  
  get loopingFadeOutRate(): number { return <number>this.get('ulfo'); }
  set loopingFadeOutRate(value: number | undefined) { this.set('ulfo', value); }
  
  get itemsMade(): string { return <string>this.get('umki'); }
  set itemsMade(value: string | undefined) { this.set('umki', value); }
  
  get attack1ProjectileArc(): number { return <number>this.get('uma1'); }
  set attack1ProjectileArc(value: number | undefined) { this.set('uma1', value); }
  
  get attack2ProjectileArc(): number { return <number>this.get('uma2'); }
  set attack2ProjectileArc(value: number | undefined) { this.set('uma2', value); }
  
  get attack1ProjectileArt(): string { return <string>this.get('ua1m'); }
  set attack1ProjectileArt(value: string | undefined) { this.set('ua1m', value); }
  
  get attack2ProjectileArt(): string { return <string>this.get('ua2m'); }
  set attack2ProjectileArt(value: string | undefined) { this.set('ua2m', value); }
  
  get attack1ProjectileHomingEnabled(): string { return <string>this.get('umh1'); }
  set attack1ProjectileHomingEnabled(value: string | undefined) { this.set('umh1', value); }
  
  get attack2ProjectileHomingEnabled(): string { return <string>this.get('umh2'); }
  set attack2ProjectileHomingEnabled(value: string | undefined) { this.set('umh2', value); }
  
  get attack1ProjectileSpeed(): number { return <number>this.get('ua1z'); }
  set attack1ProjectileSpeed(value: number | undefined) { this.set('ua1z', value); }
  
  get attack2ProjectileSpeed(): number { return <number>this.get('ua2z'); }
  set attack2ProjectileSpeed(value: number | undefined) { this.set('ua2z', value); }
  
  get movement(): string { return <string>this.get('umsl'); }
  set movement(value: string | undefined) { this.set('umsl', value); }
  
  get name(): string { return <string>this.get('unam'); }
  set name(value: string | undefined) { this.set('unam', value); }
  
  get properNames(): string { return <string>this.get('upro'); }
  set properNames(value: string | undefined) { this.set('upro', value); }
  
  get random(): string { return <string>this.get('ursl'); }
  set random(value: string | undefined) { this.set('ursl', value); }
  
  get requirementsTiersUsed(): number { return <number>this.get('urqc'); }
  set requirementsTiersUsed(value: number | undefined) { this.set('urqc', value); }
  
  get requirements(): string { return <string>this.get('ureq'); }
  set requirements(value: string | undefined) { this.set('ureq', value); }
  
  get requirementsTier2(): string { return <string>this.get('urq1'); }
  set requirementsTier2(value: string | undefined) { this.set('urq1', value); }
  
  get requirementsTier3(): string { return <string>this.get('urq2'); }
  set requirementsTier3(value: string | undefined) { this.set('urq2', value); }
  
  get requirementsTier4(): string { return <string>this.get('urq3'); }
  set requirementsTier4(value: string | undefined) { this.set('urq3', value); }
  
  get requirementsTier5(): string { return <string>this.get('urq4'); }
  set requirementsTier5(value: string | undefined) { this.set('urq4', value); }
  
  get requirementsTier6(): string { return <string>this.get('urq5'); }
  set requirementsTier6(value: string | undefined) { this.set('urq5', value); }
  
  get requirementsTier7(): string { return <string>this.get('urq6'); }
  set requirementsTier7(value: string | undefined) { this.set('urq6', value); }
  
  get requirementsTier8(): string { return <string>this.get('urq7'); }
  set requirementsTier8(value: string | undefined) { this.set('urq7', value); }
  
  get requirementsTier9(): string { return <string>this.get('urq8'); }
  set requirementsTier9(value: string | undefined) { this.set('urq8', value); }
  
  get requirementsLevels(): string { return <string>this.get('urqa'); }
  set requirementsLevels(value: string | undefined) { this.set('urqa', value); }
  
  get researchesAvailable(): string { return <string>this.get('ures'); }
  set researchesAvailable(value: string | undefined) { this.set('ures', value); }
  
  get revivesDeadHeroes(): string { return <string>this.get('urev'); }
  set revivesDeadHeroes(value: string | undefined) { this.set('urev', value); }
  
  get tooltipRevive(): string { return <string>this.get('utpr'); }
  set tooltipRevive(value: string | undefined) { this.set('utpr', value); }
  
  get iconScoreScreen(): string { return <string>this.get('ussi'); }
  set iconScoreScreen(value: string | undefined) { this.set('ussi', value); }
  
  get itemsSold(): string { return <string>this.get('usei'); }
  set itemsSold(value: string | undefined) { this.set('usei', value); }
  
  get unitsSold(): string { return <string>this.get('useu'); }
  set unitsSold(value: string | undefined) { this.set('useu', value); }
  
  get special(): string { return <string>this.get('uspa'); }
  set special(value: string | undefined) { this.set('uspa', value); }
  
  get target(): string { return <string>this.get('utaa'); }
  set target(value: string | undefined) { this.set('utaa', value); }
  
  get tooltipBasic(): string { return <string>this.get('utip'); }
  set tooltipBasic(value: string | undefined) { this.set('utip', value); }
  
  get unitsTrained(): string { return <string>this.get('utra'); }
  set unitsTrained(value: string | undefined) { this.set('utra', value); }
  
  get heroRevivalLocations(): string { return <string>this.get('urva'); }
  set heroRevivalLocations(value: string | undefined) { this.set('urva', value); }
  
  get tooltipExtended(): string { return <string>this.get('utub'); }
  set tooltipExtended(value: string | undefined) { this.set('utub', value); }
  
  get upgradesTo(): string { return <string>this.get('uupt'); }
  set upgradesTo(value: string | undefined) { this.set('uupt', value); }
  
  get normal(): string { return <string>this.get('uabi'); }
  set normal(value: string | undefined) { this.set('uabi', value); }
  
  get defaultActiveAbility(): string { return <string>this.get('udaa'); }
  set defaultActiveAbility(value: string | undefined) { this.set('udaa', value); }
  
  get hero(): string { return <string>this.get('uhab'); }
  set hero(value: string | undefined) { this.set('uhab', value); }
  
  get startingAgility(): number { return <number>this.get('uagi'); }
  set startingAgility(value: number | undefined) { this.set('uagi', value); }
  
  get agilityperLevel(): number { return <number>this.get('uagp'); }
  set agilityperLevel(value: number | undefined) { this.set('uagp', value); }
  
  get buildTime(): number { return <number>this.get('ubld'); }
  set buildTime(value: number | undefined) { this.set('ubld', value); }
  
  get goldBountyAwardedNumberofDice(): number { return <number>this.get('ubdi'); }
  set goldBountyAwardedNumberofDice(value: number | undefined) { this.set('ubdi', value); }
  
  get goldBountyAwardedBase(): number { return <number>this.get('ubba'); }
  set goldBountyAwardedBase(value: number | undefined) { this.set('ubba', value); }
  
  get goldBountyAwardedSidesperDie(): number { return <number>this.get('ubsi'); }
  set goldBountyAwardedSidesperDie(value: number | undefined) { this.set('ubsi', value); }
  
  get lumberBountyAwardedNumberofDice(): number { return <number>this.get('ulbd'); }
  set lumberBountyAwardedNumberofDice(value: number | undefined) { this.set('ulbd', value); }
  
  get lumberBountyAwardedBase(): number { return <number>this.get('ulba'); }
  set lumberBountyAwardedBase(value: number | undefined) { this.set('ulba', value); }
  
  get lumberBountyAwardedSidesperDie(): number { return <number>this.get('ulbs'); }
  set lumberBountyAwardedSidesperDie(value: number | undefined) { this.set('ulbs', value); }
  
  get collisionSize(): number { return <number>this.get('ucol'); }
  set collisionSize(value: number | undefined) { this.set('ucol', value); }
  
  get defenseBase(): number { return <number>this.get('udef'); }
  set defenseBase(value: number | undefined) { this.set('udef', value); }
  
  get defenseType(): string { return <string>this.get('udty'); }
  set defenseType(value: string | undefined) { this.set('udty', value); }
  
  get defenseUpgradeBonus(): number { return <number>this.get('udup'); }
  set defenseUpgradeBonus(value: number | undefined) { this.set('udup', value); }
  
  get foodProduced(): number { return <number>this.get('ufma'); }
  set foodProduced(value: number | undefined) { this.set('ufma', value); }
  
  get foodCost(): number { return <number>this.get('ufoo'); }
  set foodCost(value: number | undefined) { this.set('ufoo', value); }
  
  get goldCost(): number { return <number>this.get('ugol'); }
  set goldCost(value: number | undefined) { this.set('ugol', value); }
  
  get repairGoldCost(): number { return <number>this.get('ugor'); }
  set repairGoldCost(value: number | undefined) { this.set('ugor', value); }
  
  get hitPointsMaximumBase(): number { return <number>this.get('uhpm'); }
  set hitPointsMaximumBase(value: number | undefined) { this.set('uhpm', value); }
  
  get startingIntelligence(): number { return <number>this.get('uint'); }
  set startingIntelligence(value: number | undefined) { this.set('uint', value); }
  
  get intelligenceperLevel(): number { return <number>this.get('uinp'); }
  set intelligenceperLevel(value: number | undefined) { this.set('uinp', value); }
  
  get isaBuilding(): string { return <string>this.get('ubdg'); }
  set isaBuilding(value: string | undefined) { this.set('ubdg', value); }
  
  get level(): number { return <number>this.get('ulev'); }
  set level(value: number | undefined) { this.set('ulev', value); }
  
  get lumberCost(): number { return <number>this.get('ulum'); }
  set lumberCost(value: number | undefined) { this.set('ulum', value); }
  
  get repairLumberCost(): number { return <number>this.get('ulur'); }
  set repairLumberCost(value: number | undefined) { this.set('ulur', value); }
  
  get manaInitialAmount(): number { return <number>this.get('umpi'); }
  set manaInitialAmount(value: number | undefined) { this.set('umpi', value); }
  
  get manaMaximum(): number { return <number>this.get('umpm'); }
  set manaMaximum(value: number | undefined) { this.set('umpm', value); }
  
  get speedMaximum(): number { return <number>this.get('umas'); }
  set speedMaximum(value: number | undefined) { this.set('umas', value); }
  
  get speedMinimum(): number { return <number>this.get('umis'); }
  set speedMinimum(value: number | undefined) { this.set('umis', value); }
  
  get neutralBuildingValidAsRandomBuilding(): string { return <string>this.get('unbr'); }
  set neutralBuildingValidAsRandomBuilding(value: string | undefined) { this.set('unbr', value); }
  
  get sightRadiusNight(): number { return <number>this.get('usin'); }
  set sightRadiusNight(value: number | undefined) { this.set('usin', value); }
  
  get placementRequires(): string { return <string>this.get('upap'); }
  set placementRequires(value: string | undefined) { this.set('upap', value); }
  
  get primaryAttribute(): string { return <string>this.get('upra'); }
  set primaryAttribute(value: string | undefined) { this.set('upra', value); }
  
  get hitPointsRegenerationRate(): number { return <number>this.get('uhpr'); }
  set hitPointsRegenerationRate(value: number | undefined) { this.set('uhpr', value); }
  
  get manaRegeneration(): number { return <number>this.get('umpr'); }
  set manaRegeneration(value: number | undefined) { this.set('umpr', value); }
  
  get hitPointsRegenerationType(): string { return <string>this.get('uhrt'); }
  set hitPointsRegenerationType(value: string | undefined) { this.set('uhrt', value); }
  
  get repairTime(): number { return <number>this.get('urtm'); }
  set repairTime(value: number | undefined) { this.set('urtm', value); }
  
  get groupSeparationEnabled(): string { return <string>this.get('urpo'); }
  set groupSeparationEnabled(value: string | undefined) { this.set('urpo', value); }
  
  get groupSeparationGroupNumber(): number { return <number>this.get('urpg'); }
  set groupSeparationGroupNumber(value: number | undefined) { this.set('urpg', value); }
  
  get groupSeparationParameter(): number { return <number>this.get('urpp'); }
  set groupSeparationParameter(value: number | undefined) { this.set('urpp', value); }
  
  get groupSeparationPriority(): number { return <number>this.get('urpr'); }
  set groupSeparationPriority(value: number | undefined) { this.set('urpr', value); }
  
  get placementPreventedBy(): string { return <string>this.get('upar'); }
  set placementPreventedBy(value: string | undefined) { this.set('upar', value); }
  
  get sightRadiusDay(): number { return <number>this.get('usid'); }
  set sightRadiusDay(value: number | undefined) { this.set('usid', value); }
  
  get speedBase(): number { return <number>this.get('umvs'); }
  set speedBase(value: number | undefined) { this.set('umvs', value); }
  
  get stockMaximum(): number { return <number>this.get('usma'); }
  set stockMaximum(value: number | undefined) { this.set('usma', value); }
  
  get stockReplenishInterval(): number { return <number>this.get('usrg'); }
  set stockReplenishInterval(value: number | undefined) { this.set('usrg', value); }
  
  get stockStartDelay(): number { return <number>this.get('usst'); }
  set stockStartDelay(value: number | undefined) { this.set('usst', value); }
  
  get stockInitialAfterStartDelay(): number { return <number>this.get('usit'); }
  set stockInitialAfterStartDelay(value: number | undefined) { this.set('usit', value); }
  
  get startingStrength(): number { return <number>this.get('ustr'); }
  set startingStrength(value: number | undefined) { this.set('ustr', value); }
  
  get strengthperLevel(): number { return <number>this.get('ustp'); }
  set strengthperLevel(value: number | undefined) { this.set('ustp', value); }
  
  get tilesets(): string { return <string>this.get('util'); }
  set tilesets(value: string | undefined) { this.set('util', value); }
  
  get unitClassification(): string { return <string>this.get('utyp'); }
  set unitClassification(value: string | undefined) { this.set('utyp', value); }
  
  get upgradesUsed(): string { return <string>this.get('upgr'); }
  set upgradesUsed(value: string | undefined) { this.set('upgr', value); }
  
  get aIPlacementRadius(): number { return <number>this.get('uabr'); }
  set aIPlacementRadius(value: number | undefined) { this.set('uabr', value); }
  
  get aIPlacementType(): string { return <string>this.get('uabt'); }
  set aIPlacementType(value: string | undefined) { this.set('uabt', value); }
  
  get canBuildOn(): string { return <string>this.get('ucbo'); }
  set canBuildOn(value: string | undefined) { this.set('ucbo', value); }
  
  get canFlee(): string { return <string>this.get('ufle'); }
  set canFlee(value: string | undefined) { this.set('ufle', value); }
  
  get sleeps(): string { return <string>this.get('usle'); }
  set sleeps(value: string | undefined) { this.set('usle', value); }
  
  get transportedSize(): number { return <number>this.get('ucar'); }
  set transportedSize(value: number | undefined) { this.set('ucar', value); }
  
  get deathTimeseconds(): number { return <number>this.get('udtm'); }
  set deathTimeseconds(value: number | undefined) { this.set('udtm', value); }
  
  get deathType(): string { return <string>this.get('udea'); }
  set deathType(value: string | undefined) { this.set('udea', value); }
  
  get useExtendedLineofSight(): string { return <string>this.get('ulos'); }
  set useExtendedLineofSight(value: string | undefined) { this.set('ulos', value); }
  
  get formationRank(): number { return <number>this.get('ufor'); }
  set formationRank(value: number | undefined) { this.set('ufor', value); }
  
  get canBeBuiltOn(): string { return <string>this.get('uibo'); }
  set canBeBuiltOn(value: string | undefined) { this.set('uibo', value); }
  
  get heightMinimum(): number { return <number>this.get('umvf'); }
  set heightMinimum(value: number | undefined) { this.set('umvf', value); }
  
  get height(): number { return <number>this.get('umvh'); }
  set height(value: number | undefined) { this.set('umvh', value); }
  
  get type(): string { return <string>this.get('umvt'); }
  set type(value: string | undefined) { this.set('umvt', value); }
  
  get properNamesUsed(): number { return <number>this.get('upru'); }
  set properNamesUsed(value: number | undefined) { this.set('upru', value); }
  
  get orientationInterpolation(): number { return <number>this.get('uori'); }
  set orientationInterpolation(value: number | undefined) { this.set('uori', value); }
  
  get pathingMap(): string { return <string>this.get('upat'); }
  set pathingMap(value: string | undefined) { this.set('upat', value); }
  
  get pointValue(): number { return <number>this.get('upoi'); }
  set pointValue(value: number | undefined) { this.set('upoi', value); }
  
  get priority(): number { return <number>this.get('upri'); }
  set priority(value: number | undefined) { this.set('upri', value); }
  
  get propulsionWindowdegrees(): number { return <number>this.get('uprw'); }
  set propulsionWindowdegrees(value: number | undefined) { this.set('uprw', value); }
  
  get race(): string { return <string>this.get('urac'); }
  set race(value: string | undefined) { this.set('urac', value); }
  
  get placementRequiresWaterRadius(): number { return <number>this.get('upaw'); }
  set placementRequiresWaterRadius(value: number | undefined) { this.set('upaw', value); }
  
  get targetedas(): string { return <string>this.get('utar'); }
  set targetedas(value: string | undefined) { this.set('utar', value); }
  
  get turnRate(): number { return <number>this.get('umvr'); }
  set turnRate(value: number | undefined) { this.set('umvr', value); }
  
  get armorType(): string { return <string>this.get('uarm'); }
  set armorType(value: string | undefined) { this.set('uarm', value); }
  
  get animationBlendTimeseconds(): number { return <number>this.get('uble'); }
  set animationBlendTimeseconds(value: number | undefined) { this.set('uble', value); }
  
  get tintingColor3Blue(): number { return <number>this.get('uclb'); }
  set tintingColor3Blue(value: number | undefined) { this.set('uclb', value); }
  
  get shadowTextureBuilding(): string { return <string>this.get('ushb'); }
  set shadowTextureBuilding(value: string | undefined) { this.set('ushb', value); }
  
  get categorizationCampaign(): string { return <string>this.get('ucam'); }
  set categorizationCampaign(value: string | undefined) { this.set('ucam', value); }
  
  get allowCustomTeamColor(): string { return <string>this.get('utcc'); }
  set allowCustomTeamColor(value: string | undefined) { this.set('utcc', value); }
  
  get canDropItemsOnDeath(): string { return <string>this.get('udro'); }
  set canDropItemsOnDeath(value: string | undefined) { this.set('udro', value); }
  
  get elevationSamplePoints(): number { return <number>this.get('uept'); }
  set elevationSamplePoints(value: number | undefined) { this.set('uept', value); }
  
  get elevationSampleRadius(): number { return <number>this.get('uerd'); }
  set elevationSampleRadius(value: number | undefined) { this.set('uerd', value); }
  
  get modelFile(): string { return <string>this.get('umdl'); }
  set modelFile(value: string | undefined) { this.set('umdl', value); }
  
  get modelFileExtraVersions(): string { return <string>this.get('uver'); }
  set modelFileExtraVersions(value: string | undefined) { this.set('uver', value); }
  
  get fogofWarSampleRadius(): number { return <number>this.get('ufrd'); }
  set fogofWarSampleRadius(value: number | undefined) { this.set('ufrd', value); }
  
  get tintingColor2Green(): number { return <number>this.get('uclg'); }
  set tintingColor2Green(value: number | undefined) { this.set('uclg', value); }
  
  get displayasNeutralHostile(): string { return <string>this.get('uhos'); }
  set displayasNeutralHostile(value: string | undefined) { this.set('uhos', value); }
  
  get placeableInEditor(): string { return <string>this.get('uine'); }
  set placeableInEditor(value: string | undefined) { this.set('uine', value); }
  
  get maximumPitchAngledegrees(): number { return <number>this.get('umxp'); }
  set maximumPitchAngledegrees(value: number | undefined) { this.set('umxp', value); }
  
  get maximumRollAngledegrees(): number { return <number>this.get('umxr'); }
  set maximumRollAngledegrees(value: number | undefined) { this.set('umxr', value); }
  
  get scalingValue(): number { return <number>this.get('usca'); }
  set scalingValue(value: number | undefined) { this.set('usca', value); }
  
  get neutralBuildingShowsMinimapIcon(): string { return <string>this.get('unbm'); }
  set neutralBuildingShowsMinimapIcon(value: string | undefined) { this.set('unbm', value); }
  
  get heroHideHeroInterfaceIcon(): string { return <string>this.get('uhhb'); }
  set heroHideHeroInterfaceIcon(value: string | undefined) { this.set('uhhb', value); }
  
  get heroHideHeroMinimapDisplay(): string { return <string>this.get('uhhm'); }
  set heroHideHeroMinimapDisplay(value: string | undefined) { this.set('uhhm', value); }
  
  get heroHideHeroDeathMessage(): string { return <string>this.get('uhhd'); }
  set heroHideHeroDeathMessage(value: string | undefined) { this.set('uhhd', value); }
  
  get hideMinimapDisplay(): string { return <string>this.get('uhom'); }
  set hideMinimapDisplay(value: string | undefined) { this.set('uhom', value); }
  
  get occluderHeight(): number { return <number>this.get('uocc'); }
  set occluderHeight(value: number | undefined) { this.set('uocc', value); }
  
  get tintingColor1Red(): number { return <number>this.get('uclr'); }
  set tintingColor1Red(value: number | undefined) { this.set('uclr', value); }
  
  get animationRunSpeed(): number { return <number>this.get('urun'); }
  set animationRunSpeed(value: number | undefined) { this.set('urun', value); }
  
  get selectionScale(): number { return <number>this.get('ussc'); }
  set selectionScale(value: number | undefined) { this.set('ussc', value); }
  
  get scaleProjectiles(): string { return <string>this.get('uscb'); }
  set scaleProjectiles(value: string | undefined) { this.set('uscb', value); }
  
  get selectionCircleOnWater(): string { return <string>this.get('usew'); }
  set selectionCircleOnWater(value: string | undefined) { this.set('usew', value); }
  
  get selectionCircleHeight(): number { return <number>this.get('uslz'); }
  set selectionCircleHeight(value: number | undefined) { this.set('uslz', value); }
  
  get shadowImageHeight(): number { return <number>this.get('ushh'); }
  set shadowImageHeight(value: number | undefined) { this.set('ushh', value); }
  
  get hasWaterShadow(): string { return <string>this.get('ushr'); }
  set hasWaterShadow(value: string | undefined) { this.set('ushr', value); }
  
  get shadowImageWidth(): number { return <number>this.get('ushw'); }
  set shadowImageWidth(value: number | undefined) { this.set('ushw', value); }
  
  get shadowImageCenterX(): number { return <number>this.get('ushx'); }
  set shadowImageCenterX(value: number | undefined) { this.set('ushx', value); }
  
  get shadowImageCenterY(): number { return <number>this.get('ushy'); }
  set shadowImageCenterY(value: number | undefined) { this.set('ushy', value); }
  
  get categorizationSpecial(): string { return <string>this.get('uspe'); }
  set categorizationSpecial(value: string | undefined) { this.set('uspe', value); }
  
  get teamColor(): string { return <string>this.get('utco'); }
  set teamColor(value: string | undefined) { this.set('utco', value); }
  
  get hasTilesetSpecificData(): string { return <string>this.get('utss'); }
  set hasTilesetSpecificData(value: string | undefined) { this.set('utss', value); }
  
  get groundTexture(): string { return <string>this.get('uubs'); }
  set groundTexture(value: string | undefined) { this.set('uubs', value); }
  
  get shadowImageUnit(): string { return <string>this.get('ushu'); }
  set shadowImageUnit(value: string | undefined) { this.set('ushu', value); }
  
  get unitSoundSet(): string { return <string>this.get('usnd'); }
  set unitSoundSet(value: string | undefined) { this.set('usnd', value); }
  
  get useClickHelper(): string { return <string>this.get('uuch'); }
  set useClickHelper(value: string | undefined) { this.set('uuch', value); }
  
  get animationWalkSpeed(): number { return <number>this.get('uwal'); }
  set animationWalkSpeed(value: number | undefined) { this.set('uwal', value); }
  
  get acquisitionRange(): number { return <number>this.get('uacq'); }
  set acquisitionRange(value: number | undefined) { this.set('uacq', value); }
  
  get attack1AttackType(): string { return <string>this.get('ua1t'); }
  set attack1AttackType(value: string | undefined) { this.set('ua1t', value); }
  
  get attack2AttackType(): string { return <string>this.get('ua2t'); }
  set attack2AttackType(value: string | undefined) { this.set('ua2t', value); }
  
  get attack1AnimationBackswingPoint(): number { return <number>this.get('ubs1'); }
  set attack1AnimationBackswingPoint(value: number | undefined) { this.set('ubs1', value); }
  
  get attack2AnimationBackswingPoint(): number { return <number>this.get('ubs2'); }
  set attack2AnimationBackswingPoint(value: number | undefined) { this.set('ubs2', value); }
  
  get animationCastBackswing(): number { return <number>this.get('ucbs'); }
  set animationCastBackswing(value: number | undefined) { this.set('ucbs', value); }
  
  get animationCastPoint(): number { return <number>this.get('ucpt'); }
  set animationCastPoint(value: number | undefined) { this.set('ucpt', value); }
  
  get attack1CooldownTime(): number { return <number>this.get('ua1c'); }
  set attack1CooldownTime(value: number | undefined) { this.set('ua1c', value); }
  
  get attack2CooldownTime(): number { return <number>this.get('ua2c'); }
  set attack2CooldownTime(value: number | undefined) { this.set('ua2c', value); }
  
  get attack1DamageLossFactor(): number { return <number>this.get('udl1'); }
  set attack1DamageLossFactor(value: number | undefined) { this.set('udl1', value); }
  
  get attack2DamageLossFactor(): number { return <number>this.get('udl2'); }
  set attack2DamageLossFactor(value: number | undefined) { this.set('udl2', value); }
  
  get attack1DamageNumberofDice(): number { return <number>this.get('ua1d'); }
  set attack1DamageNumberofDice(value: number | undefined) { this.set('ua1d', value); }
  
  get attack2DamageNumberofDice(): number { return <number>this.get('ua2d'); }
  set attack2DamageNumberofDice(value: number | undefined) { this.set('ua2d', value); }
  
  get attack1DamageBase(): number { return <number>this.get('ua1b'); }
  set attack1DamageBase(value: number | undefined) { this.set('ua1b', value); }
  
  get attack2DamageBase(): number { return <number>this.get('ua2b'); }
  set attack2DamageBase(value: number | undefined) { this.set('ua2b', value); }
  
  get attack1AnimationDamagePoint(): number { return <number>this.get('udp1'); }
  set attack1AnimationDamagePoint(value: number | undefined) { this.set('udp1', value); }
  
  get attack2AnimationDamagePoint(): number { return <number>this.get('udp2'); }
  set attack2AnimationDamagePoint(value: number | undefined) { this.set('udp2', value); }
  
  get attack1DamageUpgradeAmount(): number { return <number>this.get('udu1'); }
  set attack1DamageUpgradeAmount(value: number | undefined) { this.set('udu1', value); }
  
  get attack2DamageUpgradeAmount(): number { return <number>this.get('udu2'); }
  set attack2DamageUpgradeAmount(value: number | undefined) { this.set('udu2', value); }
  
  get attack1AreaofEffectFullDamage(): number { return <number>this.get('ua1f'); }
  set attack1AreaofEffectFullDamage(value: number | undefined) { this.set('ua1f', value); }
  
  get attack2AreaofEffectFullDamage(): number { return <number>this.get('ua2f'); }
  set attack2AreaofEffectFullDamage(value: number | undefined) { this.set('ua2f', value); }
  
  get attack1AreaofEffectMediumDamage(): number { return <number>this.get('ua1h'); }
  set attack1AreaofEffectMediumDamage(value: number | undefined) { this.set('ua1h', value); }
  
  get attack2AreaofEffectMediumDamage(): number { return <number>this.get('ua2h'); }
  set attack2AreaofEffectMediumDamage(value: number | undefined) { this.set('ua2h', value); }
  
  get attack1DamageFactorMedium(): number { return <number>this.get('uhd1'); }
  set attack1DamageFactorMedium(value: number | undefined) { this.set('uhd1', value); }
  
  get attack2DamageFactorMedium(): number { return <number>this.get('uhd2'); }
  set attack2DamageFactorMedium(value: number | undefined) { this.set('uhd2', value); }
  
  get projectileImpactZSwimming(): number { return <number>this.get('uisz'); }
  set projectileImpactZSwimming(value: number | undefined) { this.set('uisz', value); }
  
  get projectileImpactZ(): number { return <number>this.get('uimz'); }
  set projectileImpactZ(value: number | undefined) { this.set('uimz', value); }
  
  get projectileLaunchZSwimming(): number { return <number>this.get('ulsz'); }
  set projectileLaunchZSwimming(value: number | undefined) { this.set('ulsz', value); }
  
  get projectileLaunchX(): number { return <number>this.get('ulpx'); }
  set projectileLaunchX(value: number | undefined) { this.set('ulpx', value); }
  
  get projectileLaunchY(): number { return <number>this.get('ulpy'); }
  set projectileLaunchY(value: number | undefined) { this.set('ulpy', value); }
  
  get projectileLaunchZ(): number { return <number>this.get('ulpz'); }
  set projectileLaunchZ(value: number | undefined) { this.set('ulpz', value); }
  
  get minimumAttackRange(): number { return <number>this.get('uamn'); }
  set minimumAttackRange(value: number | undefined) { this.set('uamn', value); }
  
  get attack1AreaofEffectSmallDamage(): number { return <number>this.get('ua1q'); }
  set attack1AreaofEffectSmallDamage(value: number | undefined) { this.set('ua1q', value); }
  
  get attack2AreaofEffectSmallDamage(): number { return <number>this.get('ua2q'); }
  set attack2AreaofEffectSmallDamage(value: number | undefined) { this.set('ua2q', value); }
  
  get attack1DamageFactorSmall(): number { return <number>this.get('uqd1'); }
  set attack1DamageFactorSmall(value: number | undefined) { this.set('uqd1', value); }
  
  get attack2DamageFactorSmall(): number { return <number>this.get('uqd2'); }
  set attack2DamageFactorSmall(value: number | undefined) { this.set('uqd2', value); }
  
  get attack1Range(): number { return <number>this.get('ua1r'); }
  set attack1Range(value: number | undefined) { this.set('ua1r', value); }
  
  get attack2Range(): number { return <number>this.get('ua2r'); }
  set attack2Range(value: number | undefined) { this.set('ua2r', value); }
  
  get attack1RangeMotionBuffer(): number { return <number>this.get('urb1'); }
  set attack1RangeMotionBuffer(value: number | undefined) { this.set('urb1', value); }
  
  get attack2RangeMotionBuffer(): number { return <number>this.get('urb2'); }
  set attack2RangeMotionBuffer(value: number | undefined) { this.set('urb2', value); }
  
  get attack1ShowUI(): string { return <string>this.get('uwu1'); }
  set attack1ShowUI(value: string | undefined) { this.set('uwu1', value); }
  
  get attack2ShowUI(): string { return <string>this.get('uwu2'); }
  set attack2ShowUI(value: string | undefined) { this.set('uwu2', value); }
  
  get attack1DamageSidesperDie(): number { return <number>this.get('ua1s'); }
  set attack1DamageSidesperDie(value: number | undefined) { this.set('ua1s', value); }
  
  get attack2DamageSidesperDie(): number { return <number>this.get('ua2s'); }
  set attack2DamageSidesperDie(value: number | undefined) { this.set('ua2s', value); }
  
  get attack1DamageSpillDistance(): number { return <number>this.get('usd1'); }
  set attack1DamageSpillDistance(value: number | undefined) { this.set('usd1', value); }
  
  get attack2DamageSpillDistance(): number { return <number>this.get('usd2'); }
  set attack2DamageSpillDistance(value: number | undefined) { this.set('usd2', value); }
  
  get attack1DamageSpillRadius(): number { return <number>this.get('usr1'); }
  set attack1DamageSpillRadius(value: number | undefined) { this.set('usr1', value); }
  
  get attack2DamageSpillRadius(): number { return <number>this.get('usr2'); }
  set attack2DamageSpillRadius(value: number | undefined) { this.set('usr2', value); }
  
  get attack1AreaofEffectTargets(): string { return <string>this.get('ua1p'); }
  set attack1AreaofEffectTargets(value: string | undefined) { this.set('ua1p', value); }
  
  get attack2AreaofEffectTargets(): string { return <string>this.get('ua2p'); }
  set attack2AreaofEffectTargets(value: string | undefined) { this.set('ua2p', value); }
  
  get attack1MaximumNumberofTargets(): number { return <number>this.get('utc1'); }
  set attack1MaximumNumberofTargets(value: number | undefined) { this.set('utc1', value); }
  
  get attack2MaximumNumberofTargets(): number { return <number>this.get('utc2'); }
  set attack2MaximumNumberofTargets(value: number | undefined) { this.set('utc2', value); }
  
  get attack1TargetsAllowed(): string { return <string>this.get('ua1g'); }
  set attack1TargetsAllowed(value: string | undefined) { this.set('ua1g', value); }
  
  get attack2TargetsAllowed(): string { return <string>this.get('ua2g'); }
  set attack2TargetsAllowed(value: string | undefined) { this.set('ua2g', value); }
  
  get attacksEnabled(): string { return <string>this.get('uaen'); }
  set attacksEnabled(value: string | undefined) { this.set('uaen', value); }
  
  get attack1WeaponType(): string { return <string>this.get('ua1w'); }
  set attack1WeaponType(value: string | undefined) { this.set('ua1w', value); }
  
  get attack2WeaponType(): string { return <string>this.get('ua2w'); }
  set attack2WeaponType(value: string | undefined) { this.set('ua2w', value); }
  
  get attack1WeaponSound(): string { return <string>this.get('ucs1'); }
  set attack1WeaponSound(value: string | undefined) { this.set('ucs1', value); }
  
  get attack2WeaponSound(): string { return <string>this.get('ucs2'); }
  set attack2WeaponSound(value: string | undefined) { this.set('ucs2', value); }
  
  get normalSkin(): string { return <string>this.get('uabs'); }
  set normalSkin(value: string | undefined) { this.set('uabs', value); }
  
  get heroSkin(): string { return <string>this.get('uhas'); }
  set heroSkin(value: string | undefined) { this.set('uhas', value); }  
}
