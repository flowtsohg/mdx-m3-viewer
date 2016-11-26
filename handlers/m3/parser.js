const M3Parser = (function () {
    function Event(reader, version, index) {
        this.version = version;
        this.name = new Reference(reader, index);
        this.unknown0 = readInt32(reader);
        this.unknown1 = readInt16(reader);
        this.unknown2 = readUint16(reader);
        this.matrix = readMatrix(reader);
        this.unknown3 = readInt32(reader);
        this.unknown4 = readInt32(reader);
        this.unknown5 = readInt32(reader);

        if (version > 0) {
            this.unknown6 = readInt32(reader);
            this.unknown7 = readInt32(reader);
        }

        if (version > 1) {
            this.unknown8 = readInt32(reader);
        }
    }

    function BoundingSphere(reader) {
        this.min = readVector3(reader);
        this.max = readVector3(reader);
        this.radius = readFloat32(reader);
    }

    function SD(reader, version, index) {
        this.keys = new Reference(reader, index);
        this.flags = readUint32(reader);
        this.biggestKey = readUint32(reader);
        this.values = new Reference(reader, index);
    }

    function AnimationReference(reader, Func) {
        this.interpolationType = readUint16(reader);
        this.animFlags = readUint16(reader);
        this.animId = readUint32(reader);
        this.initValue = Func(reader);
        this.nullValue = Func(reader);

        skip(reader, 4); // ?
    }

    function BoundingShape(reader) {
        this.shape = readUint32(reader); // 0 cube
                                         // 1 sphere
                                         // 2 cylinder
        this.bone = readInt16(reader);
        this.unknown0 = readUint16(reader);
        this.matrix = readMatrix(reader);
        this.unknown1 = readUint32(reader);
        this.unknown2 = readUint32(reader);
        this.unknown3 = readUint32(reader);
        this.unknown4 = readUint32(reader);
        this.unknown5 = readUint32(reader);
        this.unknown6 = readUint32(reader);
        this.size = readVector3(reader);
    }

    function Layer(reader, version, index) {
        this.version = version;
        this.unknown0 = readUint32(reader);
        this.imagePath = new Reference(reader, index);
        this.color = new AnimationReference(reader, readPixel);
        this.flags = readUint32(reader); // 0x4 textureWrapX
                                         // 0x8 textureWrapY
                                         // 0x10 invertColor
                                         // 0x20 clampColor
                                         // 0x100 useParticleFlipBook
                                         // 0x200 isVideo
                                         // 0x400 colorEnabled
                                         // 0x4000 ignoredFresnelFlag1
                                         // 0x8000 ignoredFresnelFlag2
                                         // 0x10000 fresnelLocalTransform
                                         // 0x20000 fresnelDoNotMirror
        this.uvSource = readUint32(reader);
        this.colorChannelSetting = readUint32(reader); // 0 RGB
                                                       // 1 RGBA
                                                       // 2 A
                                                       // 3 R
                                                       // 4 G
                                                       // 5 B
        this.brightMult = new AnimationReference(reader, readFloat32);
        this.midtoneOffset = new AnimationReference(reader, readFloat32);
        this.unknown1 = readUint32(reader);

        if (version > 23) {
            this.noiseAmp = readFloat32(reader);
            this.noiseFreq = readFloat32(reader);
        }

        this.rttChannel = readInt32(reader);
        this.videoFrameRate = readUint32(reader);
        this.videoStartFrame = readUint32(reader);
        this.videoEndFrame = readInt32(reader);
        this.videoMode = readUint32(reader);
        this.videoSyncTiming = readUint32(reader);
        this.videoPlay = new AnimationReference(reader, readUint32);
        this.videoRestart = new AnimationReference(reader, readUint32);
        this.flipBookRows = readUint32(reader);
        this.flipBookColumns = readUint32(reader);
        this.flipBookFrame = new AnimationReference(reader, readUint16);
        this.uvOffset = new AnimationReference(reader, readVector2);
        this.uvAngle = new AnimationReference(reader, readVector3);
        this.uvTiling = new AnimationReference(reader,  readVector2);
        this.unknown2 = new AnimationReference(reader, readUint32);
        this.unknown3 = new AnimationReference(reader, readFloat32);
        this.brightness = new AnimationReference(reader, readFloat32);

        if (version > 23) {
            this.triPlanarOffset = new AnimationReference(reader, readVector3);
            this.triPlanarScale = new AnimationReference(reader, readVector3);
        }

        this.unknown4 = readInt32(reader);
        this.fresnelType = readUint32(reader);
        this.fresnelExponent = readFloat32(reader);
        this.fresnelMin = readFloat32(reader);
        this.fresnelMaxOffset = readFloat32(reader);
        this.unknown5 = readFloat32(reader);

        if (version > 24) {
            this.unknown6 = read(reader, 8);
            this.fresnelInvertedMaskX = readFloat32(reader);
            this.fresnelInvertedMaskY = readFloat32(reader);
            this.fresnelInvertedMaskZ = readFloat32(reader);
            this.fresnelRotationYaw = readFloat32(reader);
            this.fresnelRotationPitch = readFloat32(reader);
            this.unknown7 = readUint32(reader);
        }
    }
    
    function StandardMaterial(reader, version, index) {
        this.version = version;
        this.name = new Reference(reader, index);
        this.additionalFlags = readUint32(reader); // 0x1 useDepthBlendFalloff
                                                   // 0x4 makesUseOfVertexColor
                                                   // 0x8 makesUseOfVertexAlpha
                                                   // 0x200 ?
        this.flags = readUint32(reader); // 0x1 useVertexColor
                                         // 0x2 useVertexAlpha
                                         // 0x4 unfogged
                                         // 0x8 twoSided
                                         // 0x10 unshaded
                                         // 0x20 noShadowsCast
                                         // 0x40 noHitTest
                                         // 0x80 noShadowsReceived
                                         // 0x100 depthPrepass
                                         // 0x200 useTerrainHDR
                                         // 0x400 ?
                                         // 0x800 splatUVfix
                                         // 0x1000 softBlending
                                         // 0x2000 ?
                                         // 0x4000 ?
                                         // 0x8000 decalLighting
                                         // 0x10000 transparency
                                         // 0x20000 ?
                                         // 0x40000 disableSoft
                                         // 0x80000 doubleLambert
                                         // 0x100000 hairLayerSorting
                                         // 0x200000 acceptSplatsOnly
                                         // 0x400000 decalRequiredOnLowEnd
                                         // 0x800000 emissiveRequiredOnLowEnd
                                         // 0x1000000 specularRequiredOnLowEnd
                                         // 0x2000000 acceptSplats
                                         // 0x4000000 backgroundObject
                                         // 0x10000000 zpFillRequiredOnLowEnd
                                         // 0x20000000 excludeFromHighlighting
                                         // 0x40000000 clampOutput
                                         // 0x80000000 geometryVisible
        this.blendMode = readUint32(reader); // 0 opaque
                                             // 1 blend
                                             // 2 additive
                                             // 3 probably addAlpha
                                             // 4 mod
                                             // 5 mod2x
        this.priority = readInt32(reader);
        this.usedRTTChannels = readUint32(reader); // 0x1 channel0
                                                   // 0x2 channel1
                                                   // 0x4 channel2
                                                   // 0x8 channel3
                                                   // 0x10 channel4
                                                   // 0x20 channel5
                                                   // 0x40 channel6
        this.specularity = readFloat32(reader);
        this.depthBlendFalloff = readFloat32(reader);
        this.cutoutThresh = readUint8(reader);
        this.unknown1 = readUint8(reader); // ?
        this.unknown2 = readUint8(reader); // ?
        this.unknown3 = readUint8(reader); // ?
        this.specMult = readFloat32(reader);
        this.emisMult = readFloat32(reader);
        this.diffuseLayer = new Reference(reader, index);
        this.decalLayer = new Reference(reader, index);
        this.specularLayer = new Reference(reader, index);

        if (version > 15) {
            this.glossLayer = new Reference(reader, index);
        } else {
            this.glossLayer = new FakeReference();
        }

        this.emissiveLayer = new Reference(reader, index);
        this.emissive2Layer = new Reference(reader, index);
        this.evioLayer = new Reference(reader, index);
        this.evioMaskLayer = new Reference(reader, index);
        this.alphaMaskLayer = new Reference(reader, index);
        this.alphaMask2Layer = new Reference(reader, index);
        this.normalLayer = new Reference(reader, index);
        this.heightLayer = new Reference(reader, index);
        this.lightMapLayer = new Reference(reader, index);
        this.ambientOcclusionLayer = new Reference(reader, index);

        if (version > 18) {
            this.unknown4 = new Reference(reader, index) // Unknown layer
            this.unknown5 = new Reference(reader, index) // Unknown layer
            this.unknown6 = new Reference(reader, index) // Unknown layer
            this.unknown7 = new Reference(reader, index) // Unknown layer
        }

        this.unknown8 = readUint32(reader); // ?
        this.layerBlendType = readUint32(reader);
        this.emisBlendType = readUint32(reader);
        this.emisMode = readUint32(reader);
        this.specType = readUint32(reader);

        this.unknown9 = new AnimationReference(reader, readFloat32); // ?
        this.unknown10 = new AnimationReference(reader, readUint32); // ?

        if (version > 18) {
            this.unknown11 = read(reader, 12); // ?
        }
    }

    function MaterialReference(reader, version, index) {
        this.materialType = readUint32(reader);
        this.materialIndex = readUint32(reader);
    }

    function Camera(reader, indexEntries, version) {
        this.version = version;
        this.bone = readUint32(reader);
        this.name = parseReferenceString(reader, indexEntries);
        this.fieldOfView = new AnimationReference(reader, readFloat32);
        this.unknown0 = readUint32(reader);
        this.farClip = new AnimationReference(reader, readFloat32);
        this.nearClip = new AnimationReference(reader, readFloat32);
        this.clip2 = new AnimationReference(reader, readFloat32);
        this.focalDepth = new AnimationReference(reader, readFloat32);
        this.falloffStart = new AnimationReference(reader, readFloat32);
        this.falloffEnd = new AnimationReference(reader, readFloat32);
        this.depthOfField = new AnimationReference(reader, readFloat32);
    }
    /*
    function SHBX(reader, indexEntries, version) {
    this.version = version;
    }
    */
    function Light(reader, indexEntries, version) {
        this.version = version;
        this.type = readUint8(reader);
        this.unknown0 = readUint8(reader);
        this.bone = readInt16(reader);
        this.flags = readUint32(reader); // 0x1 shadowCast
                                  // 0x2 specular
                                  // 0x4 unknown
                                  // 0x8 turnOn
        this.unknown1 = readUint32(reader);
        this.unknown2 = readInt32(reader);
        this.lightColor = new AnimationReference(reader, readVector3);
        this.lightIntensity = new AnimationReference(reader, readFloat32);
        this.specularColor = new AnimationReference(reader, readVector3);
        this.specularIntensity = new AnimationReference(reader, readFloat32);
        this.attenuationFar = new AnimationReference(reader, readFloat32);
        this.unknown3 = readFloat32(reader);
        this.attenuationNear = new AnimationReference(reader, readFloat32);
        this.hotSpot = new AnimationReference(reader, readFloat32);
        this.falloff = new AnimationReference(reader, readFloat32);
    }

    function AttachmentPoint(reader, version, index) {
        this.version = version;
        this.unknown = readInt32(reader);
        this.name = new Reference(reader, index);
        this.bone = readUint32(reader);
    }

    function MSEC(reader, version, index) {
        this.unknown0 = readUint32(reader);
        this.boundings = new AnimationReference(reader, BoundingSphere);
    }

    function Batch(reader, version, index) {
        this.unknown0 = readUint32(reader);
        this.regionIndex = readUint16(reader);
        this.unknown1 = readUint32(reader);
        this.materialReferenceIndex = readUint16(reader);
        this.unknown2 = readUint16(reader);
    }

    function Region(reader, version, index) {
        this.unknown0 = readUint32(reader);
        this.unknown1 = readUint32(reader);
        this.firstVertexIndex = readUint32(reader);
        this.verticesCount = readUint32(reader);
        this.firstTriangleIndex = readUint32(reader);
        this.triangleIndicesCount = readUint32(reader);
        this.bonesCount = readUint16(reader);
        this.firstBoneLookupIndex = readUint16(reader);
        this.boneLookupIndicesCount = readUint16(reader);
        this.unknown2 = readUint16(reader);
        this.boneWeightPairsCount = readUint8(reader);
        this.unknown3 = readUint8(reader);
        this.rootBoneIndex = readUint16(reader);

        if (version > 3) {
            this.unknown4 = readUint32(reader);
        }

        if (version > 4) {
            this.unknown5 = read(reader, 8);
        }
    }

    function Division(reader, version, index) {
        this.version = version;
        this.triangles = new Reference(reader, index);
        this.regions = new Reference(reader, index);
        this.batches = new Reference(reader, index);
        this.MSEC = new Reference(reader, index);
        this.unknown0 = readUint32(reader);
    }

    function Bone(reader, version, index) {
        this.version = version;
        this.unknown0 = readInt32(reader);
        this.name = new Reference(reader, index);
        this.flags = readUint32(reader); // 0x1 inheritTranslation
                                  // 0x2 inheritScale
                                  // 0x4 inheritRotation
                                  // 0x10 billboard1
                                  // 0x40 billboard2
                                  // 0x100 twoDProjection
                                  // 0x200 animated
                                  // 0x400 inverseKinematics
                                  // 0x800 skinned
                                  // 0x2000 real -- what does this mean?
        this.parent = readInt16(reader);
        this.unknown1 = readUint16(reader);
        this.location = new AnimationReference(reader, readVector3);
        this.rotation = new AnimationReference(reader, readVector4);
        this.scale = new AnimationReference(reader, readVector3);
        this.visibility = new AnimationReference(reader, readUint32);
    }

    function STS(reader, version, index) {
        this.version = version;
        this.animIds = new Reference(reader, index);

        skip(reader, 16); // ?
    }

    function STG(reader, version, index) {
        this.version = version;
        this.name = new Reference(reader, index);
        this.stcIndices = new Reference(reader, index);
    }

    function STC(reader, version, index) {
        this.version = version;
        this.name = new Reference(reader, index);
        this.runsConcurrent = readUint16(reader);
        this.priority = readUint16(reader);
        this.stsIndex = readUint16(reader);
        this.stsIndexCopy = readUint16(reader); // ?
        this.animIds = new Reference(reader, index);
        this.animRefs = new Reference(reader, index);

        skip(reader, 4); // ?

        this.sd = [
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index),
            new Reference(reader, index)
        ];
    }

    function Sequence(reader, version, index) {
        this.version = version;

        skip(reader, 8); // ?

        this.name = new Reference(reader, index);
        this.interval = readUint32Array(reader, 2);
        this.movementSpeed = readFloat32(reader);
        this.flags = readUint32(reader); // 0x1 notLooping
                                  // 0x2 alwaysGlobal
                                  // 0x8 globalInPreviewer
        this.frequency = readUint32(reader);

        skip(reader, 12); // ?

        if (version < 2) {
            skip(reader, 4); // ?
        }

        this.boundingSphere = BoundingSphere(reader);

        skip(reader, 12); // ?
    }

    function Model(reader, version, index) {
        this.version = version;
        this.modelName = new Reference(reader, index);
        this.flags = readUint32(reader); // 0x100000 hasMesh
        this.sequences = new Reference(reader, index);
        this.stc = new Reference(reader, index);
        this.stg = new Reference(reader, index);
        this.unknown0 = readFloat32(reader);
        this.unknown1 = readFloat32(reader);
        this.unknown2 = readFloat32(reader);
        this.unknown3 = readFloat32(reader);
        this.sts = new Reference(reader, index);
        this.bones = new Reference(reader, index);
        this.numberOfBonesToCheckForSkin = readUint32(reader);
        this.vertexFlags = readUint32(reader); // 0x200 hasVertexColors
                                               // 0x20000 hasVertices
                                               // 0x40000 useUVChannel1
                                               // 0x80000 useUVChannel2
                                               // 0x100000 useUVChannel3
        this.vertices = new Reference(reader, index);
        this.divisions = new Reference(reader, index);
        this.boneLookup = new Reference(reader, index);
        this.boundings = BoundingSphere(reader);
        this.unknown4To20 = readUint32Array(reader, 16);
        this.attachmentPoints = new Reference(reader, index);
        this.attachmentPointAddons = new Reference(reader, index);
        this.ligts = new Reference(reader, index);
        this.shbxData = new Reference(reader, index);
        this.cameras = new Reference(reader, index);
        this.unknown21 = new Reference(reader, index);
        this.materialReferences = new Reference(reader, index);
        this.materials = [
            new Reference(reader, index), // Standard
            new Reference(reader, index), // Displacement
            new Reference(reader, index), // Composite
            new Reference(reader, index), // Terrain
            new Reference(reader, index), // Volume
            new Reference(reader, index), // ?
            new Reference(reader, index)  // Creep
            
        ];

        if (version > 24) {
            this.materials.push(new Reference(reader, index)); // Volume noise
        }

        if (version > 25) {
            this.materials.push(new Reference(reader, index)); // Splat terrain bake
        }

        if (version > 27) {
            this.materials.push(new Reference(reader, index)); // ?
        }

        if (version > 28) {
            this.materials.push(new Reference(reader, index)); // Lens flare
        }

        this.particleEmitters = new Reference(reader, index);
        this.particleEmitterCopies = new Reference(reader, index);
        this.ribbonEmitters = new Reference(reader, index);
        this.projections = new Reference(reader, index);
        this.forces = new Reference(reader, index);
        this.warps = new Reference(reader, index);
        this.unknown22 = new Reference(reader, index); // ?
        this.rigidBodies = new Reference(reader, index);
        this.unknown23 = new Reference(reader, index); // ?
        this.physicsJoints = new Reference(reader, index);

        if (version > 27) {
            this.clothBehavior = new Reference(reader, index);
        }

        this.unknown24 = new Reference(reader, index); // ?
        this.ikjtData = new Reference(reader, index);
        this.unknown25 = new Reference(reader, index); // ?

        if (version > 24) {
            this.unknown26 = new Reference(reader, index); // ?
        }

        this.partsOfTurrentBehaviors = new Reference(reader, index);
        this.turrentBehaviors = new Reference(reader, index);
        this.absoluteInverseBoneRestPositions = new Reference(reader, index);
        this.tightHitTest = new BoundingShape(reader);
        this.fuzzyHitTestObjects = new Reference(reader, index);
        this.attachmentVolumes = new Reference(reader, index);
        this.attachmentVolumesAddon0 = new Reference(reader, index);
        this.attachmentVolumesAddon1 = new Reference(reader, index);
        this.billboardBehaviors = new Reference(reader, index);
        this.tmdData = new Reference(reader, index);
        this.unknown27 = readUint32(reader); // ?
        this.unknown28 = new Reference(reader, index); // ?

    }

    function MD34(reader, version, index) {
        this.tag = readUint32(reader);
        this.offset = readUint32(reader);
        this.entries = readUint32(reader);
        this.model = new Reference(reader, index);
    }

    function UnsupportedEntry(reader, version, index) {

    }

    function FakeReference() {

    }

    FakeReference.prototype = {
        getAll() {
            return [];
        },

        get() {
            
        }
    };

    function Reference(reader, index) {
        this.index = index;
        this.entries = readUint32(reader);
        this.id = readUint32(reader);
        this.flags = readUint32(reader);
    }

    Reference.prototype = {
        getAll() {
            let id = this.id;

            // For empty references (e.g. Layer.imagePath)
            if (id === 0 || this.entries === 0) {
                return [];
            }

            return this.index[id].entries;
        },

        get() {
            return this.getAll()[0];
        }
    };

    const TagMapping = {
        // Objects
        [TagToUint("MD34")]: [0, MD34, { 11: 24 }],
        [TagToUint("MODL")]: [0, Model, { 23: 784, 25: 808, 26: 820, 28: 844, 29: 856 }],
        [TagToUint("SEQS")]: [0, Sequence, { 1: 96, 2: 92 }],
        [TagToUint("STC_")]: [0, STC, { 4: 204 }],
        [TagToUint("STG_")]: [0, STG, { 0: 24 }],
        [TagToUint("STS_")]: [0, STS, { 0: 28 }],
        [TagToUint("BONE")]: [0, Bone, { 1: 160 }],
        [TagToUint("DIV_")]: [0, Division, { 2: 52 }],
        [TagToUint("REGN")]: [0, Region, { 3: 36, 4: 40, 5: 48 }],
        [TagToUint("BAT_")]: [0, Batch, { 1: 14 }],
        [TagToUint("MSEC")]: [0, MSEC, { 1: 72 }],
        [TagToUint("MATM")]: [0, MaterialReference, { 0: 8 }],
        [TagToUint("MAT_")]: [0, StandardMaterial, { 15: 268, 16: 280, 17: 280, 18: 280, 19: 340 }],
        [TagToUint("LAYR")]: [0, Layer, { 22: 356, 24: 436, 25: 468, 26: 464 }],
        [TagToUint("EVNT")]: [0, Event, { 0: 96, 1: 104, 2: 108 }],
        [TagToUint("BNDS")]: [0, BoundingSphere, { 0: 28 }],
        [TagToUint("SDEV")]: [0, SD, { 0: 32 }],
        [TagToUint("SDU6")]: [0, SD, { 0: 32 }],
        [TagToUint("SDFG")]: [0, SD, { 0: 32 }],
        [TagToUint("SDS6")]: [0, SD, { 0: 32 }],
        [TagToUint("SDR3")]: [0, SD, { 0: 32 }],
        [TagToUint("SD2V")]: [0, SD, { 0: 32 }],
        [TagToUint("SD3V")]: [0, SD, { 0: 32 }],
        [TagToUint("SD4Q")]: [0, SD, { 0: 32 }],
        [TagToUint("SDCC")]: [0, SD, { 0: 32 }],
        [TagToUint("SDMB")]: [0, SD, { 0: 32 }],
        [TagToUint("FLAG")]: [0, SD, { 0: 32 }],
        // Unsupported entries
        [TagToUint("ATT_")]: [0, null, { 1: 20 }],
        [TagToUint("LITE")]: [0, null, { 7: 212 }],
        [TagToUint("ATVL")]: [0, null, { 0: 116 }],
        [TagToUint("PATU")]: [0, null, { 4: 152 }],
        [TagToUint("TRGD")]: [0, null, { 0: 24 }],
        [TagToUint("DIS_")]: [0, null, { 4: 68 }],
        [TagToUint("CMS_")]: [0, null, { 0: 24 }],
        [TagToUint("CMP_")]: [0, null, { 2: 28 }],
        [TagToUint("TER_")]: [0, null, { 0: 24, 1: 28 }],
        [TagToUint("VOL_")]: [0, null, { 0: 84 }],
        [TagToUint("VON_")]: [0, null, { 0: 268 }],
        [TagToUint("CREP")]: [0, null, { 0: 24, 1: 28 }],
        [TagToUint("STBM")]: [0, null, { 0: 48 }],
        [TagToUint("LFSB")]: [0, null, { 2: 56 }],
        [TagToUint("LFLR")]: [0, null, { 2: 80, 3: 152 }],
        [TagToUint("PAR_")]: [0, null, { 12: 1316, 17: 1460, 18: 1464, 19: 1464, 21: 1464, 22: 1484, 23: 1492, 24: 1496 }],
        [TagToUint("PARC")]: [0, null, { 0: 40 }],
        [TagToUint("PROJ")]: [0, null, { 4: 388, 5: 382 }],
        [TagToUint("PHYJ")]: [0, null, { 0: 180 }],
        [TagToUint("PHCC")]: [0, null, { 0: 76 }],
        [TagToUint("PHAC")]: [0, null, { 0: 32 }],
        [TagToUint("PHCL")]: [0, null, { 2: 128 }],
        [TagToUint("FOR_")]: [0, null, { 1: 104, 2: 104 }],
        [TagToUint("DMSE")]: [0, null, { 0: 4 }],
        [TagToUint("PHSH")]: [0, null, { 1: 132, 3: 300 }],
        [TagToUint("PHRB")]: [0, null, { 2: 104, 4: 80 }],
        [TagToUint("SSGS")]: [0, null, { 1: 108 }],
        [TagToUint("BBSC")]: [0, null, { 0: 48 }],
        [TagToUint("SRIB")]: [0, null, { 0: 272 }],
        [TagToUint("RIB_")]: [0, null, { 6: 748, 8: 756, 9: 760 }],
        [TagToUint("IKJT")]: [0, null, { 0: 32 }],
        [TagToUint("SHBX")]: [0, null, { 0: 64 }],
        [TagToUint("CAM_")]: [0, null, { 3: 180, 5: 264 }],
        [TagToUint("WRP_")]: [0, null, { 1: 132 }],
        // Typed arrays
        [TagToUint("CHAR")]: [1, readCharArray],
        [TagToUint("SCHR")]: [1, readCharArray],
        [TagToUint("U8__")]: [1, readUint8Array],
        [TagToUint("U16_")]: [1, readUint16Array],
        [TagToUint("U32_")]: [1, readUint32Array],
        [TagToUint("I32_")]: [1, readInt32Array],
        [TagToUint("REAL")]: [1, readFloat32Array],
        [TagToUint("VEC2")]: [1, readVector2Array],
        [TagToUint("VEC3")]: [1, readVector3Array],
        [TagToUint("SVC3")]: [1, readVector3Array],
        [TagToUint("VEC4")]: [1, readVector4Array],
        [TagToUint("QUAT")]: [1, readVector4Array],
        [TagToUint("IREF")]: [1, readMatrixArray]
    };

    function IndexEntry(reader, index) {
        this.index = index;
        this.tag = readUint32(reader);
        this.offset = readUint32(reader);

        const entriesCount = readUint32(reader);

        this.version = readUint32(reader);

        const mapping = TagMapping[this.tag];

        if (mapping) {
            const readerOffset = tell(reader);

            seek(reader, this.offset);

            const isTypedArray = mapping[0],
                Func = mapping[1];

            if (isTypedArray) {
                this.entries = Func(reader, entriesCount);
            } else if (Func) {
                let entries = [],
                    entrySizes = mapping[2],
                    index = this.index,
                    version = this.version,
                    entrySize = entrySizes[version];

                if (!entrySize) {
                    throw new Error("Unsupported object version - tag " + UintToTag(this.tag) + " and version " + version);
                }

                for (let i = 0, l = entriesCount; i < l; i++) {
                    entries[i] = new Func(subreader(reader, entrySize), version, index);

                    skip(reader, entrySize);
                }

                this.entries = entries;
            }

            seek(reader, readerOffset);
        } else {
            throw new Error("Unsupported object tag - tag " + UintToTag(this.tag) + " and version " + this.version);
        }
    }

    return (function (reader) {
        const header = new MD34(reader);

        if (header.tag === TagToUint("MD34")) {
            const entries = [];

            seek(reader, header.offset);

            // Read the index entries
            for (let i = 0, l = header.entries; i < l; i++) {
                entries[i] = new IndexEntry(reader, entries);
            }

            return entries[header.model.id].entries[0];
        }
    });
}());
