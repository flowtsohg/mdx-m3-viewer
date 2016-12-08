let MdxParser = (function () {
    // Mapping from track tags to their type and default value
    var tagToTrack = {
        // LAYS
        KMTF: [readUint32, 0, 0],
        KMTA: [readFloat32, 1, 1],
        // TXAN
        KTAT: [readVector3, new Float32Array([0, 0, 0]), 2],
        KTAR: [readVector4, new Float32Array([0, 0, 0, 1]), 3],
        KTAS: [readVector3, new Float32Array([1, 1, 1]), 4],
        // GEOA
        KGAO: [readFloat32, 1, 5],
        KGAC: [readVector3, new Float32Array([0, 0, 0]), 6],
        // LITE
        KLAS: [readFloat32, 0, 7],
        KLAE: [readFloat32, 0, 8],
        KLAC: [readVector3, new Float32Array([0, 0, 0]), 9],
        KLAI: [readFloat32, 0, 10],
        KLBI: [readFloat32, 0, 11],
        KLBC: [readVector3, new Float32Array([0, 0, 0]), 12],
        KLAV: [readFloat32, 1, 13],
        // ATCH
        KATV: [readFloat32, 1, 14],
        // PREM
        KPEE: [readFloat32, 0, 15],
        KPEG: [readFloat32, 0, 16],
        KPLN: [readFloat32, 0, 17],
        KPLT: [readFloat32, 0, 18],
        KPEL: [readFloat32, 0, 19],
        KPES: [readFloat32, 0, 20],
        KPEV: [readFloat32, 1, 21],
        // PRE2
        KP2S: [readFloat32, 0, 22],
        KP2R: [readFloat32, 0, 23],
        KP2L: [readFloat32, 0, 24],
        KP2G: [readFloat32, 0, 25],
        KP2E: [readFloat32, 0, 26],
        KP2N: [readFloat32, 0, 27],
        KP2W: [readFloat32, 0, 28],
        KP2V: [readFloat32, 1, 29],
        // RIBB
        KRHA: [readFloat32, 0, 30],
        KRHB: [readFloat32, 0, 31],
        KRAL: [readFloat32, 1, 32],
        KRCO: [readVector3, new Float32Array([0, 0, 0]), 33],
        KRTX: [readUint32, 0, 34],
        KRVS: [readFloat32, 1, 35],
        // CAMS
        KCTR: [readVector3, new Float32Array([0, 0, 0]), 36],
        KTTR: [readVector3, new Float32Array([0, 0, 0]), 37],
        KCRL: [readUint32, 0, 38],
        // NODE
        KGTR: [readVector3, new Float32Array([0, 0, 0]), 39],
        KGRT: [readVector4, new Float32Array([0, 0, 0, 1]), 40],
        KGSC: [readVector3, new Float32Array([1, 1, 1]), 41]
    };

    // Read elements with unknown sizes
    function readUnknownElements(reader, size, Func, nodes) {
        var totalSize = 0,
            elements = [],
            element;
        
        while (totalSize !== size) {
            element = new Func(reader, nodes, elements.length);

            totalSize += element.size;

            elements.push(element);
        }

        return elements;
    }

    // Read elements with known sizes
    function readKnownElements(reader, count, Func) {
        var elements = [];

        for (var i = 0; i < count; i++) {
            elements[i] = new Func(reader, i);
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

    function SDTrack(reader, interpolationType, Func) {
        this.frame = readInt32(reader);
        this.value = Func(reader);

        if (interpolationType > 1) {
            this.inTan = Func(reader);
            this.outTan = Func(reader);
        }
    }

    function SD(reader) {
        this.tag = read(reader, 4);

        var tracks = readUint32(reader);

        this.interpolationType = readUint32(reader);
        this.globalSequenceId = readInt32(reader);
        this.tracks = [];

        var sdTrackInfo = tagToTrack[this.tag];

        for (var i = 0; i < tracks; i++) {
            this.tracks[i] = new SDTrack(reader, this.interpolationType, sdTrackInfo[0])
        }

        this.defval = sdTrackInfo[1];
        this.sdIndex = sdTrackInfo[2];

        var elementsPerTrack = 1 + (typeof this.defval === "number" ? 1 : this.defval.length) * (this.interpolationType > 1 ? 3 : 1);

        this.size = 16 + tracks * elementsPerTrack * 4;
    }

    function SDContainer(reader, size) {
        this.sd = {};

        var sd = readUnknownElements(reader, size, SD);

        for (var i = 0, l = sd.length; i < l; i++) {
            this.sd[sd[i].tag] = sd[i];
        }
    }

    function Node(reader, index, object) {
        this.object = object;
        this.index = index;
        this.size = readUint32(reader);
        this.name = read(reader, 80);
        this.objectId = readUint32(reader);
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
        this.matrixIndexes = readUint32Array(reader, readUint32(reader));

        this.materialId = readUint32(reader);
        this.selectionGroup = readUint32(reader);
        this.selectionFlags = readUint32(reader);
        this.extent =  new Extent(reader);
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
        this.geosetId = readUint32(reader);
        this.tracks = new SDContainer(reader, this.size - 28);
    }

    function Bone(reader, nodes, index) {
        this.node = readNode(reader, nodes, this);
        this.geosetId = readUint32(reader);
        this.geosetAnimationId = readUint32(reader);
        this.size = this.node.size + 8;
    }

    function Light(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.node = readNode(reader, nodes, this);
        this.type = readUint32(reader);
        this.attenuation = readFloat32Array(reader, 2);
        this.color = readVector3(reader);
        this.intensity = readFloat32(reader);
        this.ambientColor = readVector3(reader);
        this.ambientIntensity = readFloat32(reader);
        this.tracks = new SDContainer(reader, this.size - this.node.size - 48);
    }

    function Helper(reader, nodes, index) {
        this.index = index;
        this.node = readNode(reader, nodes, this);
        this.size = this.node.size;
    }

    function Attachment(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.node = readNode(reader, nodes, this);
        this.path = read(reader, 260);
        this.attachmentId = readUint32(reader);
        this.tracks = new SDContainer(reader, this.size - this.node.size - 268);
    }

    function PivotPoint(reader, index) {
        this.index = index;
        this.value = readFloat32Array(reader, 3);
    }

    function ParticleEmitter(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.node = readNode(reader, nodes, this);
        this.emissionRate = readFloat32(reader);
        this.gravity = readFloat32(reader);
        this.longitude = readFloat32(reader);
        this.latitude = readFloat32(reader);
        this.path = read(reader, 260);
        this.lifespan = readFloat32(reader);
        this.speed = readFloat32(reader);
        this.tracks = new SDContainer(reader, this.size - this.node.size - 288);
    }

    function ParticleEmitter2(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.node = readNode(reader, nodes, this);
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
        this.tracks = new SDContainer(reader, this.size - this.node.size - 175);
    }

    function RibbonEmitter(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.node = readNode(reader, nodes, this);
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
        this.tracks = new SDContainer(reader, this.size - this.node.size - 56);
    }

    function EventObject(reader, nodes, index) {
        this.index = index;
        this.node = readNode(reader, nodes, this);
        
        skip(reader, 4); // KEVT
        
        var count = readUint32(reader);

        this.globalSequenceId = readInt32(reader);
        this.tracks = readUint32Array(reader, count);
        this.size = this.node.size + 12 + count * 4;
    }

    function Camera(reader, nodes, index) {
        this.index = index;
        this.size = readUint32(reader);
        this.name = read(reader, 80);
        this.position = readVector3(reader);
        this.fieldOfView = readFloat32(reader);
        this.farClippingPlane = readFloat32(reader);
        this.nearClippingPlane = readFloat32(reader);
        this.targetPosition = readVector3(reader);
        this.tracks = new SDContainer(reader, this.size - 120);
    }
    
    function CollisionShape(reader, nodes, index) {
        this.index = index;
        this.node = readNode(reader, nodes, this);
        this.type = readUint32(reader);

        var type = this.type,
            size = this.node.size + 4;
        
        if (type === 0 || type === 1 || type === 3) {
            this.vertices = readFloat32Array(reader, 6);
            size += 24;
        } else if (type === 2) {
            this.vertices = readVector3(reader);
            size += 12;
        }

        if (type === 2 || type === 3) {
            this.radius = readFloat32(reader);
            size += 4;
        }

        this.size = size;
    }

    /*
    // Note: this chunk was reverse engineered from the game executable itself, but was never seen in any resource
    function SoundTrack(reader, index) {
        this.index = index;
        this.path = read(reader, 260);
        this.volume = readFloat32(reader);
        this.pitch = readFloat32(reader);
        this.flags = readUint32(reader);
    }
    */

    // Chunks that have elements with known sizes
    var tagToKnownChunk = {
        SEQS: [Sequence, 132],
        GLBS: [GlobalSequence, 4],
        TEXS: [Texture, 268],
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
        var tagInfo = tagToUnknownChunk[tag];

        this.elements = readUnknownElements(reader, size, tagInfo, nodes);
    }
    
    var tagToFunc = {
        VERS: VersionChunk,
        MODL: ModelChunk,
        SEQS: GenericKnownChunk,
        GLBS: GenericKnownChunk,
        TEXS: GenericKnownChunk,
        //SNDS: GenericKnownChunk,
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
        var tag,
            size,
            Func,
            chunks = {},
            nodes = [];

        while (remaining(reader) > 0) {
            tag = read(reader, 4);
            size = readUint32(reader);
            Func = tagToFunc[tag];

            if (Func) {
                chunks[tag] = new Func(reader, tag, size, nodes);
            } else {
                //console.log("Didn't parse chunk " + tag);
                skip(reader, size);
            }
        }

        this.chunks = chunks;
        this.nodes = nodes;
    }

    Parser.prototype = {
        // Checks the parser for any errors that will not affect the viewer, but affect the model when it is used in Warcraft 3.
        // For example, things that make the model completely invalid and unloadable in the game, but work just fine in the viewer.
        sanityCheck() {
            let errors = [],
                warnings = [],
                chunks = this.chunks;

            // Found in game.dll: "File contains no geosets, lights, sound emitters, attachments, cameras, particle emitters, or ribbon emitters."
            if (!chunks.GEOS && !chunks.LITE /* && !chunks.SNDS */ && !chunks.ATCH && !chunks.CAMS && !chunks.PREM && !chunks.PRE2 && !chunks.RIBB) {
                errors.push("The model has no geosets, lights, attachments, cameras, particle emitters, or ribbon emitters");
            }

            // Sequences
            if (chunks.SEQS) {
                let sequences = chunks.SEQS.elements,
                    foundStand = false,
                    foundDeath = false;

                if (sequences.length === 0) {
                    warnings.push("No animations");
                }

                for (let i = 0, l = sequences.length; i < l; i++) {
                    let sequence = sequences[i],
                        interval = sequence.interval,
                        length = interval[1] - interval[0];

                    if (sequence.name.toLowerCase().indexOf("stand") !== -1) {
                        foundStand = true;
                    }

                    if (sequence.name.toLowerCase().indexOf("death") !== -1) {
                        foundDeath = true;
                    }

                    if (length <= 0) {
                        errors.push("Sequence " + sequence.name + ": Invalid length " + length);
                    }
                }

                if (!foundStand) {
                    warnings.push("No stand animation");
                }

                if (!foundDeath) {
                    warnings.push("No death animation");
                }
            }
        
            // Textures
            if (chunks.TEXS) {
                let textures = chunks.TEXS.elements;

                for (let i = 0, l = textures.length; i < l; i++) {
                    let texture = textures[i],
                        replaceableId = texture.replaceableId,
                        path = texture.path;

                    if (path === "" && Mdx.replaceableIdToName[replaceableId] === undefined) {
                        errors.push("Texture " + i + ": Unknown replaceable ID " + replaceableId);
                    }

                    // Is this a warning or an error?
                    if (path !== "" && replaceableId !== 0) {
                        warnings.push("Texture " + i + ": Path " + path + " and replaceable ID " + replaceableId + " used together");
                    }
                }
            }

            // Geosets
            if (chunks.GEOS) {
                let geosets = chunks.GEOS.elements;

                for (let i = 0, l = geosets.length; i < l; i++) {
                    let matrixGroups = geosets[i].matrixGroups;

                    for (let j = 0, k = matrixGroups.length; j < k; j++) {
                        let matrixGroup = matrixGroups[j];

                        // There are built-in models with vertices attached to 8 bones, so I assume the game has no upper limit.
                        if (matrixGroup < 1 /*|| matrixGroup > 4*/) {
                            warnings.push("Geoset " + i + ": Vertex " + j + " is attached to " + matrixGroup + " bones");
                        }
                    }
                }
            }

            // Geoset animations
            if (chunks.GEOA && chunks.GEOS) {
                let biggest = chunks.GEOS.elements.length - 1,
                    usageMap = {},
                    geosetAnimations = chunks.GEOA.elements;

                for (let i = 0, l = geosetAnimations.length; i < l; i++) {
                    let geosetId = geosetAnimations[i].geosetId;

                    if (geosetId < 0 || geosetId > biggest) {
                        errors.push("Geoset animation " + i + ": Invalid geoset ID " + geosetId);
                    }

                    if (!usageMap[geosetId]) {
                        usageMap[geosetId] = [];
                    }

                    usageMap[geosetId].push(i);
                }

                let keys = Object.keys(usageMap);

                for (let i = 0, l = keys.length; i < l; i++) {
                    let geoset = keys[i],
                        users = usageMap[geoset];

                    if (users.length > 1) {
                        errors.push("Geoset " + geoset + " has " + users.length + " geoset animations referencing it (" + users.join(", ") + ")");
                    }
                }
            }

            // Lights
            if (chunks.LITE) {
                let lights = chunks.LITE.elements;

                for (let i = 0, l = lights.length; i < l; i++) {
                    let light = lights[i],
                        attenuation = light.attenuation;

                    if (attenuation[0] < 80 || attenuation[1] > 200) {
                        warnings.push("Light " + light.node.name + ": Attenuation min=" + attenuation[0] + " max=" + attenuation[1]);
                    }
                }
            }

            // Event objects
            if (chunks.EVTS) {
                let eventObjects = chunks.EVTS.elements;

                for (let i = 0, l = eventObjects.length; i < l; i++) {
                    let eventObject = eventObjects[i];

                    if (eventObject.tracks.length === 0) {
                        errors.push("Event object " + eventObject.node.name + ": No keys");
                    }
                }
            }

            return [errors, warnings];
        }
    };

    return (function (reader) {
        if (read(reader, 4) === "MDLX") {
            return new Parser(reader);
        }
    });
}());
