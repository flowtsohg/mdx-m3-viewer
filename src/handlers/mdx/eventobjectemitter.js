function EventObjectEmitter(eventObject, model, instance, context) {
    var node = instance.skeleton.nodes[eventObject.node];
    var name = node.nodeImpl.name;
    var type = name.substring(0, 3);
    var path = name.substring(4);
    
    this.model = model;
    this.instance = instance;
    this.type = type;
    
    if (type === "SPN") {
        this.ready = 1;
        this.node = node;
        this.path = eventObjectPaths[type][path];
        this.globalSequenceId = eventObject.globalSequenceId;
        this.globalSequences = model.globalSequences;
        this.sequences = model.sequences;
        this.tracks = eventObject.tracks;
        this.lastTrack = 0;
    } else if (type === "SPL") {
        this.ready = 1;
        this.node = node;
        this.slkLine = eventObjectPaths[type][path];
        this.globalSequenceId = eventObject.globalSequenceId;
        this.globalSequences = model.globalSequences;
        this.sequences = model.sequences;
        this.tracks = eventObject.tracks;
        this.lastTrack = 0;
        
        var slkLine = this.slkLine;
        
        this.texture = context.urls.mpqFile(slkLine[1] + "/" + slkLine[2] + ".blp").toLowerCase();
        this.rows = slkLine[3];
        this.columns = slkLine[4];
        this.blendMode = slkLine[5];
        this.scale = slkLine[6];
        this.firstIntervalTime = slkLine[7];
        this.secondIntervalTime = slkLine[8];
        this.firstInterval = [slkLine[9], slkLine[10], slkLine[11]];
        this.secondInterval = [slkLine[12], slkLine[13], slkLine[14]];
        this.colors = [[slkLine[15], slkLine[16], slkLine[17], slkLine[18]], [slkLine[19], slkLine[20], slkLine[21], slkLine[22]], [slkLine[23], slkLine[24], slkLine[25], slkLine[26]]];
        
        this.dimensions = [this.columns, this.rows];
        
        context.gl.loadTexture(this.texture);
    }
    
    this.eventObjects = [];
}

EventObjectEmitter.prototype = {
    update: function (allowCreate, sequence, frame, counter, context) {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            var eventObject;
            var track = this.getValue(sequence, frame, counter);
            
            if (track !== this.lastTrack && track === 1) {
                switch (this.type) {
                    case "SPN":
                        eventObject = new EventObjectSpn(this, context);
                        break;
                    case "SPL":
                        eventObject = new EventObjectSpl(this, context);
                        break;
                }
                
                eventObjects.push(eventObject);
            }
            
            this.lastTrack = track;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].update(this, context);
            }
            
            if (eventObjects.length) {
                if (eventObjects[0].ended()) {
                    eventObjects.shift();
                }
            }
        }
    },

    render: function (context) {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].render(this, context);
            }
        }
    },
    
    renderEmitters: function (context) {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].renderEmitters(this, context);
            }
        }
    },
    
    getValue: function (sequence, frame, counter) {
        if (this.globalSequenceId !== -1 && this.globalSequences) {
            var duration = this.globalSequences[this.globalSequenceId];

            return this.getValueAtTime(counter % duration , 0, duration);
        } else if (sequence !== -1) {
            var interval = this.sequences[sequence].interval;

            return this.getValueAtTime(frame, interval[0], interval[1]);
        } else {
            return 0;
        }
    },
    
    getValueAtTime: function (frame, start, end) {
        var tracks = this.tracks;
        
        if (frame < start || frame > end) {
            return 0;
        }
        
        for (var i = tracks.length - 1; i > -1; i--) {
            if (tracks[i] < start) {
                return 0
            } else if (tracks[i] <= frame) {
                return 1;
            }
        }
        
        return 0;
    }
};

var eventObjectPaths = {
    SPN: {
        UEGG: "Objects/Spawnmodels/Undead/CryptFiendEggsack/CryptFiendEggsack.mdx",
        GCBL: "Objects/Spawnmodels/Undead/GargoyleCrumble/GargoyleCrumble.mdx",
        UDIS: "Objects/Spawnmodels/Undead/UndeadDissipate/UndeadDissipate.mdx",
        EDIS: "Objects/Spawnmodels/NightElf/NightelfDissipate/NightElfDissipate.mdx",
        DDIS: "Objects/Spawnmodels/Demon/DemonDissipate/DemonDissipate.mdx",
        ODIS: "Objects/Spawnmodels/Orc/OrcDissipate/OrcDissipate.mdx",
        HDIS: "Objects/Spawnmodels/Human/HumanDissipate/HumanDissipate.mdx",
        HBS0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodSmall0.mdx",
        HBS1: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodSmall1.mdx",
        HBL0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodLarge0.mdx",
        HBL1: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodLarge1.mdx",
        EENT: "Objects/Spawnmodels/NightElf/EntBirthTarget/EntBirthTarget.mdx",
        DNAM: "Objects/Spawnmodels/NightElf/NEDeathMedium/NEDeath.mdx",
        DNAS: "Objects/Spawnmodels/NightElf/NEDeathSmall/NEDeathSmall.mdx",
        DUME: "Objects/Spawnmodels/Undead/UDeathMedium/UDeath.mdx",
        DUSM: "Objects/Spawnmodels/Undead/UDeathSmall/UDeathSmall.mdx",
        INFR: "Objects/Spawnmodels/Demon/InfernalMeteor/InfernalMeteor.mdx",
        INFL: "Objects/Spawnmodels/Demon/InfernalMeteor/InfernalMeteor2.mdx",
        INFU: "Objects/Spawnmodels/Demon/InfernalMeteor/InfernalMeteor3.mdx",
        HBF0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodFootman.mdx",
        HBK0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodKnight.mdx",
        HBM0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodMortarTeam.mdx",
        HBP0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodPeasant.mdx",
        HBPR: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodPriest.mdx",
        HBR0: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodRifleman.mdx",
        HBSR: "Objects/Spawnmodels/Human/HumanBlood/HumanBloodSorceress.mdx",
        HBNE: "Objects/Spawnmodels/Undead/UndeadBlood/UndeadBloodNecromancer.mdx",
        NBVW: "Objects/Spawnmodels/Other/NPCBlood/NpcBloodVillagerWoman.mdx",
        OBHE: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodHeadhunter.mdx",
        OBHS: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodHellScream.mdx",
        OBFS: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodHeroFarSeer.mdx",
        OBTC: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodHeroTaurenChieftain.mdx",
        OBKB: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodKotoBeast.mdx",
        OBWD: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodWitchDoctor.mdx",
        OBWR: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodWolfrider.mdx",
        OBWY: "Objects/Spawnmodels/Orc/Orcblood/OrdBloodWyvernRider.mdx",
        OBWV: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodRiderlessWyvernRider.mdx",
        OBT0: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodTauren.mdx",
        OBG0: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodGrunt.mdx",
        OBP0: "Objects/Spawnmodels/Orc/Orcblood/OrcBloodPeon.mdx",
        OKBP: "Objects/Spawnmodels/Orc/KodoBeastPuke/KodoBeastPuke.mdx",
        UBGA: "Objects/Spawnmodels/Undead/UndeadBlood/UndeadBloodGargoyle.mdx",
        UBGH: "Objects/Spawnmodels/Undead/UndeadBlood/UndeadBloodGhoul.mdx",
        UBAB: "Objects/Spawnmodels/Undead/UndeadBlood/UndeadBloodAbomination.mdx",
        UBAC: "Objects/Spawnmodels/Undead/UndeadBlood/UndeadBloodAcolyte.mdx",
        DBCR: "Objects/Spawnmodels/Undead/UndeadBlood/UndeadBloodCryptFiend.mdx",
        NBAR: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodArcher.mdx",
        NBDC: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodDruidoftheClaw.mdx",
        NBDT: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodDruidoftheTalon.mdx",
        NBDR: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodDryad.mdx",
        NBHU: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodHuntress.mdx",
        NBDB: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodDruidBear.mdx",
        NBDA: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodDruidRaven.mdx",
        NBDH: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodHeroDemonHunter.mdx",
        NBKG: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodHeroKeeperoftheGrove.mdx",
        NBMP: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodHeroMoonPriestess.mdx",
        NBCH: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodChimaera.mdx",
        NBHG: "Objects/Spawnmodels/NightElf/NightElfBlood/NightElfBloodHippogryph.mdx",
        DBPT: "Objects/Spawnmodels/Demon/DemonBlood/DemonBloodPitlord.mdx",
        DNBL: "Objects/Spawnmodels/Other/NeutralBuildingExplosion/NeutralBuildingExplosion.mdx",
        CLID: "Objects/Spawnmodels/Undead/ImpaleTargetDust/ImpaleTargetDust.mdx",
        HFSS: "Objects/Spawnmodels/Human/SmallFlameSpawn/SmallFlameSpawn.mdx",
        UBSC: "Objects/Spawnmodels/Undead/UndeadBlood/ObsidianStatueCrumble.mdx",
        UBCC: "Objects/Spawnmodels/Undead/UndeadBlood/ObsidianStatueCrumble2.mdx",
        HBBM: "Objects/Spawnmodels/Human/HumanBlood/HeroBloodElfBlood.mdx",
        HBSB: "Objects/Spawnmodels/Human/HumanBlood/BloodElfSpellThiefBlood.mdx",
        NBMF: "Objects/Spawnmodels/NightElf/NightElfBlood/Blood/MALFurion_Blood.mdx",
        OBBT: "Objects/Spawnmodels/Orc/Orcblood/BattrollBlood.mdx",
        OBSH: "Objects/Spawnmodels/Orc/Orcblood/HeroShadowHunterBlood.mdx",
        DBPB: "Objects/Spawnmodels/Other/PandarenBrewmasterBlood/PandarenBrewmasterBlood.mdx",
        DBBM: "Objects/Spawnmodels/Other/BeastmasterBlood/BeastmasterBlood.mdx",
        PEFI: "Abilities/Spells/Other/ImmolationRed/ImmolationREDTarget.mdx",
        DNBD: "Objects/Spawnmodels/Naga/NagaDeath/NagaDeath.mdx",
        FTSO: "Objects/Spawnmodels/Other/FlameThrower/FlameThrowerSpawnObj.mdx",
        TOBO: "Objects/Spawnmodels/Other/ToonBoom/ToonBoom.mdx",
        CBAL: "Objects/Spawnmodels/Critters/Albatross/CritterBloodAlbatross.mdx",
        IFP0: "Objects/Spawnmodels/Other/IllidanFootprint/IllidanSpawnFootPrint0.mdx",
        IFP1: "Objects/Spawnmodels/Other/IllidanFootprint/IllidanSpawnFootPrint1.mdx",
        IFPW: "Objects/Spawnmodels/Other/IllidanFootprint/IllidanWaterSpawnFootPrint.mdx",
        HBCE: "Objects/Spawnmodels/Other/HumanBloodCinematicEffect/HumanBloodCinematicEffect.mdx",
        OBCE: "Objects/Spawnmodels/Other/OrcBloodCinematicEffect/OrcBloodCinematicEffect.mdx",
        FRBS: "Objects/Spawnmodels/Human/FragmentationShards/FragBoomSpawn.mdx",
        PBSX: "Objects/Spawnmodels/Other/PandarenBrewmasterExplosionUltimate/PandarenBrewmasterExplosionUltimate.mdx",
        GDCR: "UI/Feedback/GoldCredit/GoldCredit.mdx",
        NBWS: "Objects/Spawnmodels/Naga/NagaBlood/NagaBloodWindserpent.mdx"
    },
    
    SPL: {
        EBL1: ["NightElfBloodLarge1", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 50, 2, 120, 16, 31, 1, 31, 31, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0, "WEL0", "NULL"],
        EBL2: ["NightElfBloodLarge2", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 50, 2, 120, 32, 47, 1, 47, 47, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0, "WEL1", "NULL"],
        EBS1: ["NightElfBloodSmall1", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 25, 2, 120, 16, 31, 1, 31, 31, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0, "WES0", "NULL"],
        HBS0: ["HumanBloodSmall0", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 25, 2, 120, 48, 63, 1, 63, 63, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHS0", "NULL"],
        HBS1: ["HumanBloodSmall1", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 25, 2, 120, 0, 15, 1, 15, 15, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHS0", "NULL"],
        HBS2: ["HumanBloodSmall2", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 25, 2, 120, 16, 31, 1, 31, 31, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHS1", "NULL"],
        HBS3: ["HumanBloodSmall3", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 25, 2, 120, 32, 47, 1, 47, 47, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHS1", "NULL"],
        HBL1: ["HumanBloodLarge1", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 50, 2, 120, 16, 31, 1, 31, 31, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHL0", "NULL"],
        HBL2: ["HumanBloodLarge2", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 50, 2, 120, 32, 47, 1, 47, 47, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHL1", "NULL"],
        HBL3: ["HumanBloodLarge3", "ReplaceableTextures/Splats", "Splat01Mature", 16, 16, 0, 50, 2, 120, 48, 63, 1, 63, 63, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0, "WHL1", "NULL"]


    }
};