var MdxParser = (function () {
    // Mapping from track tags to their type and default value
    var tagToTrack = {
        // LAYS
        KMTF: [readUint32, 0],
        KMTA: [readFloat32, 1],
        // TXAN
        KTAT: [readVector3, new Float32Array([0, 0, 0])],
        KTAR: [readVector4, new Float32Array([0, 0, 0, 1])],
        KTAS: [readVector3, new Float32Array([1, 1, 1])],
        // GEOA
        KGAO: [readFloat32, 1],
        KGAC: [readVector3, new Float32Array([0, 0, 0])],
        // LITE
        KLAS: [readFloat32, 0],
        KLAE: [readFloat32, 0],
        KLAC: [readVector3, new Float32Array([0, 0, 0])],
        KLAI: [readFloat32, 0],
        KLBI: [readFloat32, 0],
        KLBC: [readVector3, new Float32Array([0, 0, 0])],
        KLAV: [readFloat32, 1],
        // ATCH
        KATV: [readFloat32, 1],
        // PREM
        KPEE: [readFloat32, 0],
        KPEG: [readFloat32, 0],
        KPLN: [readFloat32, 0],
        KPLT: [readFloat32, 0],
        KPEL: [readFloat32, 0],
        KPES: [readFloat32, 0],
        KPEV: [readFloat32, 1],
        // PRE2
        KP2S: [readFloat32, 0],
        KP2R: [readFloat32, 0],
        KP2L: [readFloat32, 0],
        KP2G: [readFloat32, 0],
        KP2E: [readFloat32, 0],
        KP2N: [readFloat32, 0],
        KP2W: [readFloat32, 0],
        KP2V: [readFloat32, 1],
        // RIBB
        KRHA: [readFloat32, 0],
        KRHB: [readFloat32, 0],
        KRAL: [readFloat32, 1],
        KRCO: [readVector3, new Float32Array([0, 0, 0])],
        KRTX: [readUint32, 0],
        KRVS: [readFloat32, 1],
        // CAMS
        KCTR: [readVector3, new Float32Array([0, 0, 0])],
        KTTR: [readVector3, new Float32Array([0, 0, 0])],
        KCRL: [readUint32, 0],
        // NODE
        KGTR: [readVector3, new Float32Array([0, 0, 0])],
        KGRT: [readVector4, new Float32Array([0, 0, 0, 1])],
        KGSC: [readVector3, new Float32Array([1, 1, 1])]
    };

    // Read elements with unknown sizes
    function readUnknownElements(reader, size, constructor, nodes) {
        var totalSize = 0,
            elements = [],
            element;
        
        while (totalSize !== size) {
            element = new constructor(reader, nodes, elements.length);

            totalSize += element.size;

            elements.push(element);
        }

        return elements;
    }

    // Read elements with known sizes
    function readKnownElements(reader, count, constructor) {
        var elements = [];

        for (var i = 0; i < count; i++) {
            elements[i] = new constructor(reader, i);
        }

        return elements;
    }

    // Read a node, and also push it to the nodes array
    function readNode(reader, nodes, object) {
        var node = new Node(reader, nodes.length, object);

        nodes.push(node);

        return node;
    }

    function Extent(reader) {
        this.radius = readFloat32(reader);
        this.min = readVector3(reader);
        this.max = readVector3(reader);
    }

    function Track(reader, interpolationType, Func) {
        this.frame = readInt32(reader);
        this.value = Func(reader);

        if (interpolationType > 1) {
            this.inTan = Func(reader);
            this.outTan = Func(reader);
        }
    }

    function SD(reader) {
        var tag = read(reader, 4),
            tracksCount = readUint32(reader),
            interpolationType = readUint32(reader),
            globalSequenceId = readInt32(reader),
            sdTrackInfo = tagToTrack[tag],
            constructor = sdTrackInfo[0],
            defval = sdTrackInfo[1],
            elementsPerTrack = 1 + (defval.length ? defval.length : 1) * (interpolationType > 1 ? 3 : 1),
            tracks = [];

        for (var i = 0; i < tracksCount; i++) {
            tracks[i] = new Track(reader, interpolationType, constructor)
        }

        this.tag = tag;
        this.interpolationType = interpolationType;
        this.globalSequenceId = globalSequenceId;
        this.tracks = tracks;
        this.defval = defval;
        this.size = 16 + tracksCount * elementsPerTrack * 4;
    }

    function SDContainer(reader, size) {
        var sd = readUnknownElements(reader, size, SD),
            map = {};

        for (var i = 0, l = sd.length; i < l; i++) {
            map[sd[i].tag] = sd[i];
        }

        this.sd = map;
    }

    function Node(reader, index, object) {
        this.index = index;
        this.object = object;
        this.size = readUint32(reader);
        this.name = read(reader, 80);
        this.objectId = readInt32(reader);
        this.parentId = readInt32(reader);
        this.flags = readUint32(reader);
        this.tracks = new SDContainer(reader, this.size - 96);

        var flags = this.flags;

        this.dontInheritTranslation = flags & 1;
        this.dontInheritRotation = flags & 2;
        this.dontInheritScaling = flags & 4;
        this.billboarded = flags & 8;
        this.billboardedX = flags & 16;
        this.billboardedY = flags & 32;
        this.billboardedZ = flags & 64;
        this.cameraAnchored = flags & 128;
        this.bone = flags & 256;
        this.light = flags & 512;
        this.eventObject = flags & 1024;
        this.attachment = flags & 2048;
        this.particleEmitter = flags & 4096;
        this.collisionShape = flags & 8192;
        this.ribbonEmitter = flags & 16384;
        this.emitterUsesMdlOrUnshaded = flags & 32768;
        this.emitterUsesTgaOrSortPrimitivesFarZ = flags & 65536;
        this.lineEmitter = flags & 131072;
        this.unfogged = flags & 262144;
        this.modelSpace = flags & 524288;
        this.xYQuad = flags & 1048576;
    }

    function VersionChunk(reader, tag, size, nodes) {
        this.version = readUint32(reader);
    }

    function ModelChunk(reader, tag, size, nodes) {
        this.name = read(reader, 80);
        this.animationPath = read(reader, 260);
        this.extent = new Extent(reader);
        this.blendTime = readUint32(reader);
    }

    function Sequence(reader, index) {
        this.index = index;
        this.name = read(reader, 80);
        this.interval = readUint32Array(reader, 2);
        this.moveSpeed = readFloat32(reader);
        this.flags = readUint32(reader);
        this.rarity = readFloat32(reader);
        this.syncPoint = readUint32(reader);
        this.extent = new Extent(reader);
    }

    function GlobalSequence(reader, index) {
        this.index = index;
        this.value = readUint32(reader);
    }

    function Texture(reader, index) {
        this.index = index;
        this.replaceableId = readUint32(reader);
        this.path = read(reader, 260);
        this.flags = readUint32(reader);
    }

    // Note: this chunk was reverse engineered from the game executable itself, but was never seen in any resource
    function SoundTrack(reader, index) {
        this.index = index;
        this.path = read(reader, 260);
        this.volume = readFloat32(reader);
        this.pitch = readFloat32(reader);
        this.flags = readUint32(reader);
    }
    
    function Layer(reader, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.filterMode = readUint32(reader);
        this.flags = readUint32(reader);
        this.textureId = readUint32(reader);
        this.textureAnimationId = readInt32(reader);
        this.coordId = readUint32(reader);
        this.alpha = readFloat32(reader);
        this.tracks = new SDContainer(reader, this.size - 28);

        var flags = this.flags;

        this.unshaded = flags & 1;
        this.sphereEnvironmentMap = flags & 2;
        this.twoSided = flags & 16;
        this.unfogged = flags & 32;
        this.noDepthTest = flags & 64;
        this.noDepthSet = flags & 128;
    }

    function Material(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.priorityPlane = readInt32(reader);
        this.flags = readUint32(reader);
        skip(reader, 4); // LAYS
        this.layers = readKnownElements(reader, readUint32(reader), Layer);
    }

    function TextureAnimation(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.tracks = new SDContainer(reader, this.size - 4);
    }

    function Geoset(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);

        skip(reader, 4); // VRTX
        this.vertices = readFloat32Array(reader, readUint32(reader) * 3);

        skip(reader, 4); // NRMS
        this.normals = readFloat32Array(reader, readUint32(reader) * 3);

        skip(reader, 4); // PTYP
        this.faceTypeGroups = readUint32Array(reader, readUint32(reader));

        skip(reader, 4); // PCNT
        this.faceGroups = readUint32Array(reader, readUint32(reader));

        skip(reader, 4); // PVTX
        this.faces = readUint16Array(reader, readUint32(reader));

        skip(reader, 4); // GNDX
        this.vertexGroups = readUint8Array(reader, readUint32(reader));

        skip(reader, 4); // MTGC
        this.matrixGroups = readUint32Array(reader, readUint32(reader));

        skip(reader, 4); // MATS
        this.matrixIndices = readUint32Array(reader, readUint32(reader));

        this.materialId = readUint32(reader);
        this.selectionGroup = readUint32(reader);
        this.selectionFlags = readUint32(reader);
        this.extent = new Extent(reader);
        this.extents = readKnownElements(reader, readUint32(reader), Extent);

        skip(reader, 4); // UVAS

        this.textureCoordinateSets = [];

        for (var i = 0, l = readUint32(reader); i < l; i++) {
            skip(reader, 4); // UVBS
            this.textureCoordinateSets[i] = readFloat32Array(reader, readUint32(reader) * 2);
        }
    }

    function GeosetAnimation(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.alpha = readFloat32(reader);
        this.flags = readUint32(reader);
        this.color = readVector3(reader);
        this.geosetId = readInt32(reader);
        this.tracks = new SDContainer(reader, this.size - 28);
    }

    function Bone(reader, nodes, index) {
        this.node = readNode(reader, nodes, this);
        this.geosetId = readInt32(reader); // Unsure if this is correct. What does it even mean for a bone to reference a geoset?
        this.geosetAnimationId = readInt32(reader); // Unsure if this is correct. What does it even mean for a bone to reference a geoset animation?
        this.size = this.node.size + 8;
    }

    function Light(reader, nodes, index) {
        var size = readUint32(reader),
            node = readNode(reader, nodes, this);

        this.index = index;
        this.size = size;
        this.node = node;
        this.type = readUint32(reader);
        this.attenuation = readFloat32Array(reader, 2);
        this.color = readVector3(reader);
        this.intensity = readFloat32(reader);
        this.ambientColor = readVector3(reader);
        this.ambientIntensity = readFloat32(reader);
        this.tracks = new SDContainer(reader, size - node.size - 48);
    }

    function Helper(reader, nodes, index) {
        this.index = index;
        this.node = readNode(reader, nodes, this);
        this.size = this.node.size;
    }

    function Attachment(reader, nodes, index) {
        var size = readUint32(reader),
            node = readNode(reader, nodes, this);

        this.index = index;
        this.size = size;
        this.node = node;
        this.path = read(reader, 260);
        this.attachmentId = readUint32(reader);
        this.tracks = new SDContainer(reader, size - node.size - 268);
    }

    function PivotPoint(reader, index) {
        this.index = index;
        this.value = readFloat32Array(reader, 3);
    }

    function ParticleEmitter(reader, nodes, index) {
        var size = readUint32(reader),
            node = readNode(reader, nodes, this);

        this.index = index;
        this.size = size;
        this.node = node;
        this.emissionRate = readFloat32(reader);
        this.gravity = readFloat32(reader);
        this.longitude = readFloat32(reader);
        this.latitude = readFloat32(reader);
        this.path = read(reader, 260);
        this.lifespan = readFloat32(reader);
        this.speed = readFloat32(reader);
        this.tracks = new SDContainer(reader, size - node.size - 288);
    }

    function ParticleEmitter2(reader, nodes, index) {
        var size = readUint32(reader),
            node = readNode(reader, nodes, this);

        this.index = index;
        this.size = size;
        this.node = node;
        this.speed = readFloat32(reader);
        this.variation = readFloat32(reader);
        this.latitude = readFloat32(reader);
        this.gravity = readFloat32(reader);
        this.lifespan = readFloat32(reader);
        this.emissionRate = readFloat32(reader);
        this.width = readFloat32(reader);
        this.length = readFloat32(reader);
        this.filterMode = readUint32(reader);
        this.rows = readUint32(reader);
        this.columns = readUint32(reader);
        this.headOrTail = readUint32(reader);
        this.tailLength = readFloat32(reader);
        this.timeMiddle = readFloat32(reader);
        this.segmentColor = readFloat32Matrix(reader, 3, 3);
        this.segmentAlpha = readUint8Array(reader, 3);
        this.segmentScaling = readFloat32Array(reader, 3);
        this.headInterval = readUint32Array(reader, 3);
        this.headDecayInterval = readUint32Array(reader, 3);
        this.tailInterval = readUint32Array(reader, 3);
        this.tailDecayInterval = readUint32Array(reader, 3);
        this.textureId = readUint32(reader);
        this.squirt = readUint32(reader);
        this.priorityPlane = readUint32(reader);
        this.replaceableId = readUint32(reader);
        this.tracks = new SDContainer(reader, size - node.size - 175);
    }

    function RibbonEmitter(reader, nodes, index) {
        var size = readUint32(reader),
            node = readNode(reader, nodes, this);

        this.index = index;
        this.size = size;
        this.node = node;
        this.heightAbove = readFloat32(reader);
        this.heightBelow = readFloat32(reader);
        this.alpha = readFloat32(reader);
        this.color = readVector3(reader);
        this.lifespan = readFloat32(reader);
        this.textureSlot = readUint32(reader);
        this.emissionRate = readUint32(reader);
        this.rows = readUint32(reader);
        this.columns = readUint32(reader);
        this.materialId = readUint32(reader);
        this.gravity = readFloat32(reader);
        this.tracks = new SDContainer(reader, size - node.size - 56);
    }

    function EventObject(reader, nodes, index) {
        var node = readNode(reader, nodes, this);

        this.index = index;
        this.node = node;

        skip(reader, 4); // KEVT

        var count = readUint32(reader);

        this.globalSequenceId = readInt32(reader);
        this.tracks = readUint32Array(reader, count);
        this.size = node.size + 12 + count * 4;
    }

    function Camera(reader, nodes, index) {
        var size = readUint32(reader);

        this.index = index;
        this.size = size;
        this.name = read(reader, 80);
        this.position = readVector3(reader);
        this.fieldOfView = readFloat32(reader);
        this.farClippingPlane = readFloat32(reader);
        this.nearClippingPlane = readFloat32(reader);
        this.targetPosition = readVector3(reader);
        this.tracks = new SDContainer(reader, size - 120);
    }
    
    function CollisionShape(reader, nodes, index) {
        this.index = index;
        this.node = readNode(reader, nodes, this);
        this.type = readUint32(reader);

        var type = this.type,
            size = this.node.size + 4,
            vertices;
        
        if (type === 0 || type === 1 || type === 3) {
            vertices = readFloat32Array(reader, 6);
            size += 24;
        } else if (type === 2) {
            vertices = readVector3(reader);
            size += 12;
        }

        this.vertices = vertices;

        if (type === 2 || type === 3) {
            this.radius = readFloat32(reader);
            size += 4;
        }

        this.size = size;
    }

    // This is used for chunks that are not supported (e.g. custom chunks injected by authoring tools).
    // The chunk will contain its own reader, in case the client code wants to do anything with it.
    function UnsupportedChunk(reader) {
        this.reader = reader;
    }

    // Chunks that have elements with known sizes
    var tagToKnownChunk = {
        SEQS: [Sequence, 132],
        GLBS: [GlobalSequence, 4],
        TEXS: [Texture, 268],
        SNDS: [SoundTrack, 272],
        PIVT: [PivotPoint, 12]
    };

    // Chunks that have elements with unknown sizes
    var tagToUnknownChunk = {
        MTLS: Material,
        TXAN: TextureAnimation,
        GEOS: Geoset,
        GEOA: GeosetAnimation,
        BONE: Bone,
        LITE: Light,
        HELP: Helper,
        ATCH: Attachment,
        PREM: ParticleEmitter,
        PRE2: ParticleEmitter2,
        RIBB: RibbonEmitter,
        EVTS: EventObject,
        CAMS: Camera,
        CLID: CollisionShape
    };

    function GenericKnownChunk(reader, tag, size, nodes) {
        var tagInfo = tagToKnownChunk[tag];

        this.elements = readKnownElements(reader, size / tagInfo[1], tagInfo[0]);

    }

    function GenericUnknownChunk(reader, tag, size, nodes) {
        this.elements = readUnknownElements(reader, size, tagToUnknownChunk[tag], nodes);
    }
    
    var tagToFunc = {
        VERS: VersionChunk,
        MODL: ModelChunk,
        SEQS: GenericKnownChunk,
        GLBS: GenericKnownChunk,
        TEXS: GenericKnownChunk,
        SNDS: GenericKnownChunk,
        MTLS: GenericUnknownChunk,
        TXAN: GenericUnknownChunk,
        GEOS: GenericUnknownChunk,
        GEOA: GenericUnknownChunk,
        BONE: GenericUnknownChunk,
        LITE: GenericUnknownChunk,
        HELP: GenericUnknownChunk,
        ATCH: GenericUnknownChunk,
        PIVT: GenericKnownChunk,
        PREM: GenericUnknownChunk,
        PRE2: GenericUnknownChunk,
        RIBB: GenericUnknownChunk,
        EVTS: GenericUnknownChunk,
        CAMS: GenericUnknownChunk,
        CLID: GenericUnknownChunk
    };

    function Parser(reader) {
        var chunks = {},
            nodes = [];

        while (remaining(reader) > 0) {
            var tag = read(reader, 4),
                size = readUint32(reader),
                constructor = tagToFunc[tag];

            if (constructor) {
                chunks[tag] = new constructor(reader, tag, size, nodes);
            } else {
                console.warn("MdxParser: Unsupported tag - " + tag);
                chunks[tag] = new UnsupportedChunk(subreader(reader, size));
                skip(reader, size);
            }
        }

        this.chunks = chunks;
        this.nodes = nodes;
    }

    return (function (reader) {
        if (read(reader, 4) === "MDLX") {
            return new Parser(reader);
        }

        throw new Error("WrongMagicNumber");
    });
}());
