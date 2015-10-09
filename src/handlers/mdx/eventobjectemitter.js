Mdx.EventObjectEmitter = function (eventObject, model, instance, context, pathSolver) {
    var node = instance.skeleton.nodes[eventObject.node.index];
    var name = node.nodeImpl.name;
    var type = name.substring(0, 3);
    var path = name.substring(4);
    
    if (type === "FPT") {
        type = "SPL";
    }
    
    this.model = model;
    this.instance = instance;
    this.type = type;
    this.node = node;
    this.globalSequenceId = eventObject.globalSequenceId;
    this.globalSequences = model.globalSequences;
    this.sequences = model.sequences;
    this.tracks = eventObject.tracks;
    this.lastTrack = vec3.create();
    this.eventObjects = [];
    this.context = context;
    this.pathSolver = pathSolver;

    if (type === "SPN") {
        this.ready = 1;
        
        this.path = eventObjectPaths[type][path];
    } else if (type === "SPL") {
        var slkLine = eventObjectPaths[type][path];
        
        if (slkLine) {
            this.ready = 1;
            
            this.texture = pathSolver("replaceabletextures/splats/splat01mature.blp");
            this.rows = slkLine[0];
            this.columns = slkLine[1];
            this.blendMode = slkLine[2];
            this.scale = slkLine[3];
            this.firstIntervalTime = slkLine[4];
            this.secondIntervalTime = slkLine[5];
            this.firstInterval = [slkLine[6], slkLine[7], slkLine[8]];
            this.secondInterval = [slkLine[9], slkLine[10], slkLine[11]];
            this.colors = [[slkLine[12], slkLine[13], slkLine[14], slkLine[15]], [slkLine[16], slkLine[17], slkLine[18], slkLine[19]], [slkLine[20], slkLine[21], slkLine[22], slkLine[23]]];
            
            this.dimensions = [this.columns, this.rows];
            
            this.texture = context.loadTexture(this.texture, ".blp");
        }
    } else if (type === "UBR") {
        var slkLine = eventObjectPaths[type][path];
        
        if (slkLine) {
            this.ready = 1;
            
            this.texture = pathSolver("replaceabletextures/splats/" + slkLine[0] + ".blp");
            this.blendMode = slkLine[1];
            this.scale = slkLine[2];
            this.firstIntervalTime = slkLine[3];
            this.secondIntervalTime = slkLine[4];
            this.thirdIntervalTime = slkLine[5];
            this.colors = [[slkLine[6], slkLine[7], slkLine[8], slkLine[9]], [slkLine[10], slkLine[11], slkLine[12], slkLine[13]], [slkLine[14], slkLine[15], slkLine[16], slkLine[17]]];
            
            this.dimensions = [1, 1];
            this.columns = 1;
            
            this.texture = context.loadTexture(this.texture, ".blp");
        }
    }
    
    this.track = vec3.create();
};

Mdx.EventObjectEmitter.prototype = {
    update: function (allowCreate, sequence, frame, counter, context) {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            var eventObject;
            var track = this.getValue(sequence, frame, counter, this.track);
            
            if (track[0] === 1 && (track[0] !== this.lastTrack[0] || track[1] !== this.lastTrack[1])) {
                switch (this.type) {
                    case "SPN":
                        eventObject = new Mdx.EventObjectSpn(this);
                        break;
                    case "SPL":
                        eventObject = new Mdx.EventObjectSpl(this);
                        break;
                    case "UBR":
                        eventObject = new Mdx.EventObjectUbr(this);
                        break;
                }
                
                eventObjects.push(eventObject);
            }
            
            this.lastTrack[0] = track[0];
            this.lastTrack[1] = track[1];
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].update(this);
            }
            
            if (eventObjects.length) {
                if (eventObjects[0].ended()) {
                    eventObjects.shift();
                }
            }
        }
    },

    render: function () {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].render(this);
            }
        }
    },
    
    renderEmitters: function () {
        if (this.ready) {
            var eventObjects = this.eventObjects;
            
            for (var i = 0, l = eventObjects.length; i < l; i++) {
                eventObjects[i].renderEmitters(this);
            }
        }
    },
    
    getValue: function (sequence, frame, counter, out) {
        if (this.globalSequenceId !== -1 && this.globalSequences) {
            var duration = this.globalSequences[this.globalSequenceId];

            return this.getValueAtTime(counter % duration , 0, duration, out);
        } else if (sequence !== -1) {
            var interval = this.sequences[sequence].interval;

            return this.getValueAtTime(frame, interval[0], interval[1], out);
        } else {
            out[0] = 0;
            out[1] = 0;
            return out;
        }
    },
    
    getValueAtTime: function (frame, start, end, out) {
        var tracks = this.tracks;
        
        if (frame < start || frame > end) {
            out[0] = 0;
            out[1] = 0;
            return out;
        }
        
        for (var i = tracks.length - 1; i > -1; i--) {
            if (tracks[i] < start) {
                out[0] = 0;
                out[1] = i;
                return out;
            } else if (tracks[i] <= frame) {
                out[0] = 1;
                out[1] = i;
                return out;
            }
        }
        
        out[0] = 0;
        out[1] = 0;
        return out;
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
        //INIT: [16, 16, 0, 25, 2, 120, 0, 3, 1, 3, 3, 1, 255, 255, 255, 255, 255, 255, 255, 255, 100, 100, 100, 0],
        DBL0: [16, 16, 1, 50, 2, 120, 0, 15, 1, 15, 15, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBL1: [16, 16, 1, 50, 2, 120, 16, 31, 1, 31, 31, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBL2: [16, 16, 1, 50, 2, 120, 32, 47, 1, 47, 47, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBL3: [16, 16, 1, 50, 2, 120, 48, 63, 1, 63, 63, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBS0: [16, 16, 1, 25, 2, 120, 0, 15, 1, 15, 15, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBS1: [16, 16, 1, 25, 2, 120, 16, 31, 1, 31, 31, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBS2: [16, 16, 1, 25, 2, 120, 32, 47, 1, 47, 47, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        DBS3: [16, 16, 1, 25, 2, 120, 48, 63, 1, 63, 63, 1, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        EBL0: [16, 16, 0, 50, 2, 120, 0, 15, 1, 15, 15, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBL1: [16, 16, 0, 50, 2, 120, 16, 31, 1, 31, 31, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBL2: [16, 16, 0, 50, 2, 120, 32, 47, 1, 47, 47, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBL3: [16, 16, 0, 50, 2, 120, 48, 63, 1, 63, 63, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBS0: [16, 16, 0, 25, 2, 120, 0, 15, 1, 15, 15, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBS1: [16, 16, 0, 25, 2, 120, 16, 31, 1, 31, 31, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBS2: [16, 16, 0, 25, 2, 120, 32, 47, 1, 47, 47, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        EBS3: [16, 16, 0, 25, 2, 120, 48, 63, 1, 63, 63, 1, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        FAL0: [16, 16, 0, 14, 2, 5, 88, 88, 1, 88, 88, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAL1: [16, 16, 0, 20, 2, 5, 88, 88, 1, 88, 88, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAL2: [16, 16, 0, 32, 2, 5, 88, 88, 1, 88, 88, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAL3: [16, 16, 0, 48, 2, 5, 88, 88, 1, 88, 88, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAR0: [16, 16, 0, 14, 2, 5, 89, 89, 1, 89, 89, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAR1: [16, 16, 0, 20, 2, 5, 89, 89, 1, 89, 89, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAR2: [16, 16, 0, 32, 2, 5, 89, 89, 1, 89, 89, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FAR3: [16, 16, 0, 48, 2, 5, 89, 89, 1, 89, 89, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBL0: [16, 16, 0, 14, 2, 5, 80, 80, 1, 80, 80, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBL1: [16, 16, 0, 20, 2, 5, 80, 80, 1, 80, 80, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBL2: [16, 16, 0, 14, 2, 5, 82, 82, 1, 82, 82, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBL3: [16, 16, 0, 20, 2, 5, 82, 82, 1, 82, 82, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBL4: [16, 16, 0, 32, 2, 5, 82, 82, 1, 82, 82, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBR0: [16, 16, 0, 14, 2, 5, 81, 81, 1, 81, 81, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBR1: [16, 16, 0, 20, 2, 5, 81, 81, 1, 81, 81, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBR2: [16, 16, 0, 14, 2, 5, 83, 83, 1, 83, 83, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBR3: [16, 16, 0, 20, 2, 5, 83, 83, 1, 83, 83, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FBR4: [16, 16, 0, 32, 2, 5, 83, 83, 1, 83, 83, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCR0: [16, 16, 0, 12, 2, 5, 87, 87, 1, 87, 87, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCL0: [16, 16, 0, 12, 2, 5, 86, 86, 1, 86, 86, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCL1: [16, 16, 0, 28, 2, 5, 86, 86, 1, 86, 86, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCR1: [16, 16, 0, 28, 2, 5, 87, 87, 1, 87, 87, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCL3: [16, 16, 0, 36, 2, 5, 86, 86, 1, 86, 86, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCR3: [16, 16, 0, 36, 2, 5, 87, 87, 1, 87, 87, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCL2: [16, 16, 0, 6, 2, 5, 86, 86, 1, 86, 86, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FCR2: [16, 16, 0, 6, 2, 5, 87, 87, 1, 87, 87, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FHL0: [16, 16, 0, 12, 2, 5, 84, 84, 1, 84, 84, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FHL1: [16, 16, 0, 20, 2, 5, 84, 84, 1, 84, 84, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FHR0: [16, 16, 0, 12, 2, 5, 85, 85, 1, 85, 85, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FHR1: [16, 16, 0, 20, 2, 5, 85, 85, 1, 85, 85, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FPL0: [16, 16, 0, 12, 2, 5, 93, 93, 1, 93, 93, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FPL1: [16, 16, 0, 20, 2, 5, 93, 93, 1, 93, 93, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FPR0: [16, 16, 0, 12, 2, 5, 92, 92, 1, 92, 92, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FPR1: [16, 16, 0, 20, 2, 5, 92, 92, 1, 92, 92, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FRL0: [16, 16, 0, 48, 2, 5, 100, 100, 1, 100, 100, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FRR0: [16, 16, 0, 48, 2, 5, 101, 101, 1, 101, 101, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FRL1: [16, 16, 0, 24, 2, 5, 100, 100, 1, 100, 100, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FRR1: [16, 16, 0, 24, 2, 5, 101, 101, 1, 101, 101, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FTL0: [16, 16, 0, 22, 2, 5, 90, 90, 1, 90, 90, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FTR0: [16, 16, 0, 22, 2, 5, 91, 91, 1, 91, 91, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FWL0: [16, 16, 0, 30, 2, 5, 97, 97, 1, 97, 97, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FWR0: [16, 16, 0, 30, 2, 5, 96, 96, 1, 96, 96, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FWL1: [16, 16, 0, 30, 2, 5, 99, 99, 1, 99, 99, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FWR1: [16, 16, 0, 30, 2, 5, 98, 98, 1, 98, 98, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FML0: [16, 16, 0, 20, 2, 5, 104, 104, 1, 104, 104, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FMR0: [16, 16, 0, 20, 2, 5, 105, 105, 1, 105, 105, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FPL2: [16, 16, 0, 30, 2, 5, 102, 102, 1, 102, 102, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FPR2: [16, 16, 0, 30, 2, 5, 103, 103, 1, 103, 103, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSL0: [16, 16, 0, 18, 2, 5, 106, 106, 1, 106, 106, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSR0: [16, 16, 0, 18, 2, 5, 107, 107, 1, 107, 107, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSL1: [16, 16, 0, 30, 2, 5, 106, 106, 1, 106, 106, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSR1: [16, 16, 0, 30, 2, 5, 107, 107, 1, 107, 107, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FFL0: [16, 16, 0, 14, 2, 5, 108, 108, 5, 108, 108, 15, 255, 255, 255, 128, 255, 150, 50, 128, 0, 0, 0, 0],
        FFR0: [16, 16, 0, 14, 2, 5, 109, 109, 5, 109, 109, 15, 255, 255, 255, 128, 255, 150, 50, 128, 0, 0, 0, 0],
        FFL1: [16, 16, 0, 35, 2, 5, 108, 108, 5, 108, 108, 15, 255, 255, 255, 128, 255, 150, 50, 128, 0, 0, 0, 0],
        FFR1: [16, 16, 0, 35, 2, 5, 109, 109, 5, 109, 109, 15, 255, 255, 255, 128, 255, 150, 50, 128, 0, 0, 0, 0],
        FKL0: [16, 16, 0, 18, 2, 5, 110, 110, 1, 110, 110, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FKR0: [16, 16, 0, 18, 2, 5, 111, 111, 1, 111, 111, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FKL1: [16, 16, 0, 32, 2, 5, 110, 110, 1, 110, 110, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FKR1: [16, 16, 0, 32, 2, 5, 111, 111, 1, 111, 111, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FKL2: [16, 16, 0, 50, 2, 5, 110, 110, 1, 110, 110, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FKR2: [16, 16, 0, 50, 2, 5, 111, 111, 1, 111, 111, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FLSL: [16, 16, 0, 16, 2, 5, 112, 112, 1, 112, 112, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FLSR: [16, 16, 0, 16, 2, 5, 113, 113, 1, 113, 113, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FLLL: [16, 16, 0, 28, 2, 5, 112, 112, 1, 112, 112, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FLLR: [16, 16, 0, 28, 2, 5, 113, 113, 1, 113, 113, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSSL: [16, 16, 0, 40, 2, 5, 114, 114, 1, 114, 114, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSSR: [16, 16, 0, 40, 2, 5, 115, 115, 1, 115, 115, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSLL: [16, 16, 0, 64, 2, 5, 114, 114, 1, 114, 114, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FSLR: [16, 16, 0, 64, 2, 5, 115, 115, 1, 115, 115, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FDSL: [16, 16, 0, 32, 2, 5, 116, 116, 1, 116, 116, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FDSR: [16, 16, 0, 32, 2, 5, 117, 117, 1, 117, 117, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FDLL: [16, 16, 0, 55, 2, 5, 116, 116, 1, 116, 116, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        FDLR: [16, 16, 0, 55, 2, 5, 117, 117, 1, 117, 117, 1, 255, 255, 255, 128, 255, 255, 255, 128, 255, 255, 255, 0],
        HBL0: [16, 16, 0, 50, 2, 120, 0, 15, 1, 15, 15, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBL1: [16, 16, 0, 50, 2, 120, 16, 31, 1, 31, 31, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBL2: [16, 16, 0, 50, 2, 120, 32, 47, 1, 47, 47, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBS0: [16, 16, 0, 25, 2, 120, 48, 63, 1, 63, 63, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBS1: [16, 16, 0, 25, 2, 120, 0, 15, 1, 15, 15, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBS2: [16, 16, 0, 25, 2, 120, 16, 31, 1, 31, 31, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBS3: [16, 16, 0, 25, 2, 120, 32, 47, 1, 47, 47, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        HBL3: [16, 16, 0, 50, 2, 120, 48, 63, 1, 63, 63, 1, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        OBL0: [16, 16, 0, 50, 2, 120, 48, 63, 1, 63, 63, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBL1: [16, 16, 0, 50, 2, 120, 0, 15, 1, 15, 15, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBL2: [16, 16, 0, 50, 2, 120, 16, 31, 1, 31, 31, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBL3: [16, 16, 0, 50, 2, 120, 32, 47, 1, 47, 47, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBS0: [16, 16, 0, 25, 2, 120, 48, 63, 1, 63, 63, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBS1: [16, 16, 0, 25, 2, 120, 0, 15, 1, 15, 15, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBS2: [16, 16, 0, 25, 2, 120, 16, 31, 1, 31, 31, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        OBS3: [16, 16, 0, 25, 2, 120, 32, 47, 1, 47, 47, 1, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        UBL0: [16, 16, 0, 50, 2, 120, 0, 15, 1, 15, 15, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBL1: [16, 16, 0, 50, 2, 120, 16, 31, 1, 31, 31, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBL2: [16, 16, 0, 50, 2, 120, 32, 47, 1, 47, 47, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBL3: [16, 16, 0, 50, 2, 120, 48, 63, 1, 63, 63, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBS0: [16, 16, 0, 25, 2, 120, 0, 15, 1, 15, 15, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBS1: [16, 16, 0, 25, 2, 120, 16, 31, 1, 31, 31, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBS2: [16, 16, 0, 25, 2, 120, 32, 47, 1, 47, 47, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        UBS3: [16, 16, 0, 25, 2, 120, 48, 63, 1, 63, 63, 1, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        WSL0: [16, 16, 0, 60, 0.5, 0.5, 128, 135, 1, 136, 143, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0],
        WSL1: [16, 16, 0, 60, 0.5, 0.5, 144, 151, 1, 152, 159, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0],
        WSS0: [16, 16, 0, 35, 0.5, 0.5, 128, 135, 1, 136, 143, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0],
        WSS1: [16, 16, 0, 35, 0.5, 0.5, 144, 151, 1, 152, 159, 1, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 0],
        WHL0: [16, 16, 0, 100, 2, 30, 160, 169, 1, 170, 175, 60, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        WHL1: [16, 16, 0, 100, 2, 30, 176, 185, 1, 186, 191, 60, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        WHS0: [16, 16, 0, 60, 2, 30, 160, 169, 1, 170, 175, 60, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        WHS1: [16, 16, 0, 60, 2, 30, 176, 185, 1, 186, 191, 60, 200, 10, 10, 255, 190, 10, 10, 200, 120, 10, 10, 0],
        WOL0: [16, 16, 0, 100, 2, 30, 160, 169, 1, 170, 175, 60, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        WOL1: [16, 16, 0, 100, 2, 30, 176, 185, 1, 186, 191, 60, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        WOS0: [16, 16, 0, 60, 2, 30, 160, 169, 1, 170, 175, 60, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        WOS1: [16, 16, 0, 60, 2, 30, 176, 185, 1, 186, 191, 60, 60, 3, 3, 255, 60, 3, 3, 200, 60, 3, 3, 0],
        WEL0: [16, 16, 0, 100, 2, 30, 160, 169, 1, 170, 175, 60, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        WEL1: [16, 16, 0, 100, 2, 30, 176, 185, 1, 186, 191, 60, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        WES0: [16, 16, 0, 60, 2, 30, 160, 169, 1, 170, 175, 60, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        WES1: [16, 16, 0, 60, 2, 30, 176, 185, 1, 186, 191, 60, 60, 3, 35, 255, 60, 3, 35, 200, 60, 3, 35, 0],
        WUL0: [16, 16, 0, 100, 2, 30, 160, 169, 1, 170, 175, 60, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        WUL1: [16, 16, 0, 100, 2, 30, 176, 185, 1, 186, 191, 60, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        WUS0: [16, 16, 0, 60, 2, 30, 160, 169, 1, 170, 175, 60, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        WUS1: [16, 16, 0, 60, 2, 30, 176, 185, 1, 186, 191, 60, 100, 0, 30, 255, 20, 0, 30, 200, 20, 0, 30, 0],
        WDL0: [16, 16, 1, 100, 2, 30, 160, 169, 1, 170, 175, 60, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        WDL1: [16, 16, 1, 100, 2, 30, 176, 185, 1, 186, 191, 60, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        WDS0: [16, 16, 1, 60, 2, 30, 160, 169, 1, 170, 175, 60, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        WDS1: [16, 16, 1, 60, 2, 30, 176, 185, 1, 186, 191, 60, 60, 120, 20, 255, 60, 120, 20, 200, 60, 120, 20, 0],
        WSX0: [16, 16, 0, 1, 1, 1, 106, 106, 1, 106, 106, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        WSX1: [16, 16, 0, 1, 1, 1, 107, 107, 1, 107, 107, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    
    UBR: {
        //INIT: ["TEST", 0, 1, 1, 50, 10, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        TEST: ["TestUberSplat", 0, 100, 1, 5, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        LSDS: ["DirtUberSplat", 0, 110, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        LSDM: ["DirtUberSplat", 0, 200, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        LSDL: ["DirtUberSplat", 0, 240, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HCRT: ["CraterUberSplat", 0, 75, 0.2, 7, 6, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        UDSU: ["DarkSummonSpecial", 0, 200, 1, 0, 5, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DNCS: ["ScorchedUberSplat", 0, 200, 0.2, 300, 600, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HMTP: ["TeleportTarget", 0, 200, 0.2, 0, 5, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        SCTP: ["TeleportTarget", 0, 200, 0.2, 0, 5, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        AMRC: ["TeleportTarget", 0, 200, 0.2, 0, 5, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DRKC: ["AuraRune9b", 0, 100, 0.2, 0, 5, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DOSB: ["ScorchedUberSplat", 0, 130, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DOMB: ["ScorchedUberSplat", 0, 200, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DOLB: ["ScorchedUberSplat", 0, 300, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DHSB: ["ScorchedUberSplat", 0, 130, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DHMB: ["ScorchedUberSplat", 0, 200, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DHLB: ["ScorchedUberSplat", 0, 300, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DUSB: ["ScorchedUberSplat", 0, 130, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DUMB: ["ScorchedUberSplat", 0, 200, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DULB: ["ScorchedUberSplat", 0, 300, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DNSB: ["ScorchedUberSplat", 0, 130, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DNMB: ["ScorchedUberSplat", 0, 200, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DNSA: ["ScorchedUberSplat", 0, 130, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DNMA: ["ScorchedUberSplat", 0, 200, 0.2, 5, 20, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HSMA: ["HumanUberSplat", 0, 110, 1, 0, 10, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HMED: ["HumanUberSplat", 0, 190, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HLAR: ["HumanUberSplat", 0, 230, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        OSMA: ["OrcUberSplat", 0, 110, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        OMED: ["OrcUberSplat", 0, 200, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        OLAR: ["OrcUberSplat", 0, 240, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        USMA: ["UndeadUberSplat", 0, 170, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        UMED: ["UndeadUberSplat", 0, 200, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        ULAR: ["UndeadUberSplat", 0, 240, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        ESMA: ["AncientUberSplat", 0, 120, 5, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        EMDA: ["AncientUberSplat", 0, 200, 5, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        ESMB: ["NightElfUberSplat", 0, 110, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        EMDB: ["NightElfUberSplat", 0, 180, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HTOW: ["HumanTownHallUberSplat", 0, 230, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HCAS: ["HumanCastleUberSplat", 0, 230, 0.2, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        NGOL: ["GoldmineUberSplat", 0, 180, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        THND: ["ThunderClapUbersplat", 1, 280, 0.2, 2, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        NDGS: ["DemonGateUberSplat", 1, 375, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        CLTS: ["ThornyShieldUberSplat", 0, 200, 0.5, 30, 10, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        HFS1: ["FlameStrike1", 1, 300, 0.25, 0.1, 0.9, 255, 128, 128, 0, 255, 255, 192, 256, 256, 0, 0, 0],
        HFS2: ["FlameStrike2", 1, 300, 0.25, 0.1, 0.9, 0, 255, 128, 0, 128, 255, 192, 255, 256, 0, 0, 0],
        USBR: ["BurrowSplat", 0, 100, 0.5, 30, 10, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        NLAR: ["NagaTownHallUberSplat", 0, 230, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        NMED: ["NagaTownHallUberSplat", 0, 180, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DPSW: ["DarkPortalUberSplatSW", 0, 400, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0],
        DPSE: ["DarkPortalUberSplatSE", 0, 400, 1, 0, 2, 255, 255, 255, 0, 255, 255, 255, 255, 255, 255, 255, 0]
    }
};
