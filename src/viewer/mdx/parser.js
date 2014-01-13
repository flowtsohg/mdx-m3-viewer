// Copyright (c) 2013 Chananya Freiman (aka GhostWolf)

var Parser = (function () {
  function readExtent(reader) {
    return {boundsRadius: readFloat32(reader), minimum: readVector3(reader), maximum: readVector3(reader)};
  }
  
  var tagToTrack = {
    LAYS: {
      KMTF: [readUint32, "textureId"],
      KMTA: [readFloat32, "alpha"]
    },
    
    TXAN: {
      KTAT: [readVector3, "translation"],
      KTAR: [readVector4, "rotation"],
      KTAS: [readVector3, "scaling"]
    },
    
    GEOA: {
      KGAO: [readFloat32, "alpha"],
      KGAC: [readVector3, "color"]
    },
    
    LITE: {
      KLAS: [readFloat32, "attenuationStart"],
      KLAE: [readFloat32, "attenuationEnd"],
      KLAC: [readVector3, "color"],
      KLAI: [readFloat32, "intensity"],
      KLBI: [readFloat32, "ambientIntensity"],
      KLBC: [readVector3, "ambientColor"],
      KLAV: [readFloat32, "visibility"]
    },
    
    ATCH: {
      KATV: [readFloat32, "visibility"]
    },
    
    PREM: {
      KPEE: [readFloat32, "emissionRate"],
      KPEG: [readFloat32, "gravity"],
      KPLN: [readFloat32, "longitude"],
      KPLT: [readFloat32, "latitude"],
      KPEL: [readFloat32, "lifespan"],
      KPES: [readFloat32, "speed"],
      KPEV: [readFloat32, "visibility"]
    },
    
    PRE2: {
      KP2S: [readFloat32, "speed"],
      KP2R: [readFloat32, "variation"],
      KP2L: [readFloat32, "latitude"],
      KP2G: [readFloat32, "gravity"],
      KP2E: [readFloat32, "emissionRate"],
      KP2N: [readFloat32, "length"],
      KP2W: [readFloat32, "width"],
      KP2V: [readFloat32, "visibility"]
    },
    
    RIBB: {
      KRHA: [readFloat32, "heightAbove"],
      KRHB: [readFloat32, "heightBelow"],
      KRAL: [readFloat32, "alpha"],
      KRCO: [readVector3, "color"],
      KRTX: [readUint32, "textureSlot"],
      KRVS: [readFloat32, "visibility"]
    },
    
    CAMS: {
      KCTR: [readVector3, "positionTranslation"],
      KTTR: [readVector3, "targetTranslation"],
      KCRL: [readUint32, "rotation"]
    },
    
    NODE: {
      KGTR: [readVector3, "translation"],
      KGRT: [readVector4, "rotation"],
      KGSC: [readVector3, "scaling"]
    }
  };
  
  function parseChunk(reader, size, Func, nodes) {
    var totalInclusiveSize = 0;
    var elements = [];
    
    while (totalInclusiveSize !== size) {
      var element = new Func(reader, nodes);
      
      totalInclusiveSize += element.inclusiveSize;
      
      elements.push(element);
    }
    
    return elements;
  }
  
  function parseChunkByVal(reader, size, Func, nodes) {
    var totalInclusiveSize = 0;
    var elements = [];
    
    while (totalInclusiveSize !== size) {
      var element = Func(reader, nodes);
      
      totalInclusiveSize += element.inclusiveSize;
      
      elements.push(element);
    }
    
    return elements;
  }
  
  function parseCountChunk(reader, count, Func) {
    var elements = [];
    
    for (; count--;) {
      elements.push(new Func(reader));
    }
    
    return elements;
  }
  
  function parseCountChunkByVal(reader, count, Func) {
    var elements = [];
    
    for (; count--;) {
      elements.push(Func(reader));
    }
    
    return elements;
  }
  
  function parseTracks(reader, type) {
    var tracks = {};
    var tagTrack = tagToTrack[type];
      
    while (tagTrack[peek(reader, 4)]) {
      var trackType = tagTrack[read(reader, 4)];
      
      tracks[trackType[1]] = new TrackChunk(reader, trackType[0]);
    }

    return tracks;
  }
  
  function readNode(reader, nodes) {
    var node = new Node(reader);
    
    nodes.push(node);
    
    return node;
  }

  function Track(reader, interpolationType, type) {
    this.time = readInt32(reader);
    this.vector = type(reader);

    if (interpolationType > 1) {
      this.inTan = type(reader);
      this.outTan = type(reader);
    }
  }

  function TrackChunk(reader, type) {
    var count = readUint32(reader);
    
    this.interpolationType = readUint32(reader);
    this.globalSequenceId = readUint32(reader);
    this.tracks = [];

    for (; count--;) {
      this.tracks.push(new Track(reader, this.interpolationType, type));
    }
  }

  function Node(reader) {
    this.inclusiveSize = readUint32(reader);
    this.name = read(reader, 80);
    this.objectId = readUint32(reader);
    this.parentId = readUint32(reader);
    
    var flags = readUint32(reader);
    
    if (flags === 0x0) {
      this.helper = true;
    } else {
      if (flags & 0x1) { this.dontInheritTranslation = true; }
      if (flags & 0x2) { this.dontInheritRotation = true; }
      if (flags & 0x4) { this.dontInheritScaling = true; }
      if (flags & 0x8) { this.billboarded = true; }
      if (flags & 0x10) { this.billboardedLockX = true; }
      if (flags & 0x20) { this.billboardedLockY = true; }
      if (flags & 0x40) { this.billboardedLockZ = true; }
      if (flags & 0x80) { this.cameraAnchored = true; }
      if (flags & 0x100) { this.bone = true; }
      if (flags & 0x200) { this.light = true; }
      if (flags & 0x400) { this.eventObject = true; }
      if (flags & 0x800) { this.attachment = true; }
      if (flags & 0x1000) { this.particleEmitter = true; }
      if (flags & 0x2000) { this.collisionShape = true; }
      if (flags & 0x4000) { this.ribbonEmitter = true; }
      if (flags & 0x8000) { this.emitterUsesMdlOrUnshaded = true; }
      if (flags & 0x10000) { this.emitterUsesTgaOrSortPrimitivesFarZ = true; }
      if (flags & 0x20000) { this.lineEmitter = true; }
      if (flags & 0x40000) { this.unfogged = true; }
      if (flags & 0x80000) { this.modelSpace = true; }
      if (flags & 0x100000) { this.xYQuad = true; }
    }
    
    this.flags = flags;
    this.tracks = parseTracks(reader, "NODE");
  }
  
  /*
  function VersionChunk(reader) {
    this.version = readUint32(reader);
  }
  */
  function ModelChunk(reader) {
    this.name = read(reader, 80);
    this.animationFileName = read(reader, 260);
    this.extent = readExtent(reader);
    this.blendTime = readUint32(reader);
  }

  function Sequence(reader) {
    this.name = read(reader, 80);
    this.interval = readUint32Array(reader, 2);
    this.moveSpeed = readFloat32(reader);
    this.flags = readUint32(reader);
    this.rarity = readFloat32(reader);
    this.syncPoint = readUint32(reader);
    this.extent = readExtent(reader);
  }

  function SequenceChunk(reader, size) {
    this.sequences = parseCountChunk(reader, size / 132, Sequence);
  }

  function GlobalSequenceChunk(reader, size) {
    this.sequences = parseCountChunkByVal(reader, size / 4, readUint32);
  }

  function Texture(reader) {
    this.replaceableId = readUint32(reader);
    this.fileName = read(reader, 260);
    this.flags = readUint32(reader);
  }

  function TextureChunk(reader, size) {
    this.textures = parseCountChunk(reader, size / 268, Texture);
  }
  /*
  function SoundTrack(reader) {
    this.fileName = read(reader, 260);
    this.volume = readFloat32(reader);
    this.pitch = readFloat32(reader);
    this.flags = readUint32(reader);
  }
  
  function SoundTrackChunk(reader, size) {
    this.soundTracks = parseCountChunk(reader, size / 272, SoundTrack);
  }
  */
  function Layer(reader) {
    this.inclusiveSize = readUint32(reader);
    this.filterMode = readUint32(reader);
    
    var flags = readUint32(reader);
    
    if (flags & 0x1) { this.unshaded = true; }
    if (flags & 0x2) { this.sphereEnvironmentMap = true; }
    //if (flags & 0x4) { this.unknown0 = true; }
    //if (flags & 0x8) { this.unknown1 = true; }
    if (flags & 0x10) { this.twoSided = true; }
    if (flags & 0x20) { this.unfogged = true; }
    if (flags & 0x30) { this.noDepthTest = true; }
    if (flags & 0x40) { this.noDepthSet = true; }
    
    this.shadingFlags = flags;
    this.textureId = readUint32(reader);
    this.textureAnimationId = readUint32(reader);
    this.coordId = readUint32(reader);
    this.alpha = readFloat32(reader);
    this.tracks = parseTracks(reader, "LAYS");
  }
  
  function Material(reader) {
    this.inclusiveSize = readUint32(reader);
    this.priorityPlane = readUint32(reader);
    this.flags = readUint32(reader);

    if (this.inclusiveSize > 12) {
      read(reader, 4) // LAYS
      this.layers = parseCountChunk(reader, readUint32(reader), Layer);
    }
  }

  function MaterialChunk(reader, size) {
    this.materials = parseChunk(reader, size, Material);
  }

  function TextureAnimation(reader) {
    this.inclusiveSize = readUint32(reader);
    this.tracks = parseTracks(reader, "TXAN");
  }

  function TextureAnimationChunk(reader, size) {
    this.animations = parseChunk(reader, size, TextureAnimation);
  }

  function Geoset(reader) {
    this.inclusiveSize = readUint32(reader);
    
    read(reader, 4); // VRTX
    this.vertexPositions = readFloat32Array(reader, readUint32(reader) * 3);

    read(reader, 4); // NRMS
    this.vertexNormals = readFloat32Array(reader, readUint32(reader) * 3);

    read(reader, 4); // PTYP
    this.faceTypeGroups = readUint32Array(reader, readUint32(reader));

    read(reader, 4); // PCNT
    this.faceGroups = readUint32Array(reader, readUint32(reader));

    read(reader, 4); // PVTX
    this.faces = readUint16Array(reader, readUint32(reader));

    read(reader, 4); // GNDX
    this.vertexGroups = readUint8Array(reader, readUint32(reader));

    read(reader, 4); // MTGC
    this.matrixGroups = readUint32Array(reader, readUint32(reader));

    read(reader, 4); // MATS
    this.matrixIndexes = readUint32Array(reader, readUint32(reader));

    this.materialId = readUint32(reader);
    this.selectionGroup = readUint32(reader);
    this.selectionFlags = readUint32(reader);
    this.extent =  readExtent(reader);
    this.extents = parseCountChunkByVal(reader, readUint32(reader), readExtent);

    read(reader, 4); // UVAS

    this.textureCoordinateSets = [];
    
    for (var i = 0, l = readUint32(reader); i < l; i++) {
      read(reader, 4); // UVBS
      this.textureCoordinateSets[i] = readFloat32Array(reader, readUint32(reader) * 2);
    }
  }

  function GeosetChunk(reader, size) {
    this.geosets = parseChunk(reader, size, Geoset);
  }

  function GeosetAnimation(reader) {
    this.inclusiveSize = readUint32(reader);
    this.alpha = readFloat32(reader);
    this.flags = readUint32(reader);
    this.color = readVector3(reader);
    this.geosetId = readUint32(reader);
    this.tracks = parseTracks(reader, "GEOA");
  }

  function GeosetAnimationChunk(reader, size) {
    this.animations = parseChunk(reader, size, GeosetAnimation);
  }

  function Bone(reader, nodes) {
    this.node = readNode(reader, nodes);
    this.geosetId = readUint32(reader);
    this.geosetAnimationId = readUint32(reader);
    this.inclusiveSize = this.node.inclusiveSize + 8;
  }

  function BoneChunk(reader, size, nodes) {
    this.bones = parseChunk(reader, size, Bone, nodes);
  }

  function Light(reader, nodes) {
    this.inclusiveSize = readUint32(reader);
   this.node = readNode(reader, nodes);
    this.type = readUint32(reader);
    this.attenuationStart = readUint32(reader);
    this.attenuationEnd = readUint32(reader);
    this.color = readVector3(reader);
    this.intensity = readFloat32(reader);
    this.ambientColor = readVector3(reader);
    this.ambientIntensity = readFloat32(reader);
    this.tracks = parseTracks(reader, "LITE");
  }

  function LightChunk(reader, size, nodes) {
    this.lights = parseChunk(reader, size, Light, nodes);
  }

  function HelperChunk(reader, size, nodes) {
    this.helpers = parseChunkByVal(reader, size, readNode, nodes);
  }
  /*
  function Attachment(reader, nodes) {
    this.inclusiveSize = readUint32(reader);
    this.node = readNode(reader, nodes);
    this.path = read(reader, 260);
    this.attachmentId = readUint32(reader);
    this.tracks = parseTracks(reader, "ATCH");
  }

  function AttachmentChunk(reader, size, nodes) {
    this.attachments = parseChunk(reader, size, Attachment, nodes);
  }
  */
  function PivotPointChunk(reader, size) {
    this.points = readFloat32Matrix(reader, size / 12, 3);
  }
  
  function ParticleEmitter(reader, nodes) {
    this.inclusiveSize = readUint32(reader);
    this.node = readNode(reader, nodes);
    this.emissionRate = readFloat32(reader);
    this.gravity = readFloat32(reader);
    this.longitude = readFloat32(reader);
    this.latitude = readFloat32(reader);
    this.spawnModelFileName = read(reader, 260);
    this.lifespan = readFloat32(reader);
    this.initialVelocity = readFloat32(reader);
    this.tracks = parseTracks(reader, "PREM");
  }

  function ParticleEmitterChunk(reader, size, nodes) {
    this.emitters = parseChunk(reader, size, ParticleEmitter, nodes);
  }
  
  function ParticleEmitter2(reader, nodes) {
    this.inclusiveSize = readUint32(reader);
    this.node = readNode(reader, nodes);
    this.speed = readFloat32(reader);
    this.variation = readFloat32(reader);
    this.latitude = readFloat32(reader);
    this.gravity = readFloat32(reader);
    this.lifespan = readFloat32(reader);
    this.emissionRate = readFloat32(reader);
    this.length = readFloat32(reader);
    this.width = readFloat32(reader);
    this.filterMode = readUint32(reader);
    this.rows = readUint32(reader);
    this.columns = readUint32(reader);
    this.headOrTail = readUint32(reader);
    this.tailLength = readFloat32(reader);
    this.time = readFloat32(reader);
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
    this.tracks = parseTracks(reader, "PRE2");
  }

  function ParticleEmitter2Chunk(reader, size, nodes) {
    this.emitters = parseChunk(reader, size, ParticleEmitter2, nodes);
  }
  
  function RibbonEmitter(reader, nodes) {
    this.inclusiveSize = readUint32(reader);
    this.node = readNode(reader, nodes);
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
    this.tracks = parseTracks(reader, "RIBB");
  }

  function RibbonEmitterChunk(reader, size, nodes) {
    this.emitters = parseChunk(reader, size, RibbonEmitter, nodes);
  }
  /*
  function EventObjectTracks(reader) {
    read(reader, 4); // KEVT
    
    var count = readUint32(reader);

    this.globalSequenceId = readUint32(reader);
    this.tracks = readUint32Array(reader, count);
  }
  
  function EventObject(reader, nodes) {
    this.node = readNode(reader, nodes);
    this.inclusiveSize = this.node.inclusiveSize;
    
    if (peek(reader, 4) === "KEVT") {
      this.tracks = new EventObjectTracks(reader);
      this.inclusiveSize += 12 + this.tracks.tracks.length * 4;
    }
  }

  function EventObjectChunk(reader, size, nodes) {
    this.objects = parseChunk(reader, size, EventObject, nodes);
  }
  */
  function Camera(reader) {
    this.inclusiveSize = readUint32(reader);
    this.name = read(reader, 80);
    this.position = readVector3(reader);
    this.fieldOfView = readFloat32(reader);
    this.farClippingPlane = readFloat32(reader);
    this.nearClippingPlane = readFloat32(reader);
    this.targetPosition = readVector3(reader);
    this.tracks = parseTracks(reader, "CAMS");
  }

  function CameraChunk(reader, size) {
    this.cameras = parseChunk(reader, size, Camera);
  }
  
  function CollisionShape(reader, nodes) {
    this.node = readNode(reader, nodes);
    
    var type = readUint32(reader);
    
    this.type = type;
    this.inclusiveSize = this.node.inclusiveSize + 4;

    if (type === 0 || type === 1 || type === 3) {
      this.vertices = readFloat32Matrix(reader, 2, 3);
      this.inclusiveSize += 24;
    } else if (type === 2) {
      this.vertices = [readVector3(reader)];
      this.inclusiveSize += 12;
    }
  
    if (type === 2 || type === 3) {
      this.boundsRadius = readFloat32(reader);
      this.inclusiveSize += 4;
    }
  }

  function CollisionShapeChunk(reader, size, nodes) {
    this.shapes = parseChunk(reader, size, CollisionShape, nodes);
  }
  
  var tagToChunk = {
    //"VERS": [VersionChunk, "versionChunk"],
    "MODL": [ModelChunk, "modelChunk"],
    "SEQS": [SequenceChunk, "sequenceChunk"],
    "GLBS": [GlobalSequenceChunk, "globalSequenceChunk"],
    "TEXS": [TextureChunk, "textureChunk"],
    //"SNDS": [SoundTrackChunk, "soundTrackChunk"],
    "MTLS": [MaterialChunk, "materialChunk"],
    "TXAN": [TextureAnimationChunk, "textureAnimationChunk"],
    "GEOS": [GeosetChunk, "geosetChunk"],
    "GEOA": [GeosetAnimationChunk, "geosetAnimationChunk"],
    "BONE": [BoneChunk, "boneChunk"],
    "LITE": [LightChunk, "lightChunk"],
    "HELP": [HelperChunk, "helperChunk"],
    //"ATCH": [AttachmentChunk, "attachmentChunk"],
    "PIVT": [PivotPointChunk, "pivotPointChunk"],
    "PREM": [ParticleEmitterChunk, "particleEmitterChunk"],
    "PRE2": [ParticleEmitter2Chunk, "particleEmitter2Chunk"],
    "RIBB": [RibbonEmitterChunk, "ribbonEmitterChunk"],
    //"EVTS": [EventObjectChunk, "eventObjectChunk"],
    "CAMS": [CameraChunk, "cameraChunk"],
    "CLID": [CollisionShapeChunk, "collisionShapeChunk"]
  };

  return (function (reader, onprogress) {
    if (read(reader, 4) === "MDLX") {
      this.nodes = [];
      
      while (remaining(reader) > 0) {
        var tag = read(reader, 4);
        var size = readUint32(reader);
        var chunk = tagToChunk[tag];

        if (chunk) {
          this[chunk[1]] = new chunk[0](reader, size, this.nodes);
        } else {
          console.log("Didn't parse chunk " + tag);
          skip(reader, size);
        }

        if (typeof onprogress === "function") {
          onprogress({lengthComputable: true, total: reader.size, loaded: tell(reader)});
        }
      }

      this.ready = true;
    }
  });
}());