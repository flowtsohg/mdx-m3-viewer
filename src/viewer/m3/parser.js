var Parser = (function () {
  var MD34_HEADER = 0x4d443334;
  
  function readColor(reader) {
    return readUint8Array(reader, 4);
  }
  
  function readUint16Pair(reader) {
    return readUint16Array(reader, 2);
  }
  
  function readBoundingSphere(reader) {
    return {minBorder: readVector3(reader), maxBorder: readVector3(reader), radius: readFloat32(reader)};
  }
  
  function parseReferenceString(reader, indexEntries) {
    var reference = new Reference(reader);
    var indexEntry = indexEntries[reference.index];
    var offset = tell(reader);
    var data;
    
    seek(reader, indexEntry.offset);
    
    data = read(reader, reference.entries);
    
    seek(reader, offset);
    
    return data;
  }
  
  function parseVertices(reader, indexEntries, uvSetCount) {
    var reference = new Reference(reader);
    var offset = tell(reader);
    var indexEntry = indexEntries[reference.index];
    var entries;

    seek(reader, indexEntry.offset);
    
    entries = readUint32Array(reader, reference.entries / 4);
    
    seek(reader, offset);

    return entries;
  }
  
  function parseSingleReference(reader, indexEntries, Func) {
    var reference = new Reference(reader);
    var indexEntry = indexEntries[reference.index];
    var offset = tell(reader);
    var entry;
    
    seek(reader, indexEntry.offset);
    
    entry = new Func(reader, indexEntries, indexEntry.version);
    
    seek(reader, offset);
    
    return entry;
  }

  function parseReference(reader, indexEntries, Func) {
    var reference = new Reference(reader);
    var indexEntry = indexEntries[reference.index];
    var offset = tell(reader);
    var entries = [];
    var entriesCount = reference.entries;
    
    seek(reader, indexEntry.offset);
    
    for (var i = 0, l = entriesCount; i < entriesCount; i++) {
      entries[i] = new Func(reader, indexEntries, indexEntry.version);
    }
    
    seek(reader, offset);
    
    return entries;
  }
  
  function parseReferenceByVal(reader, indexEntries, Func) {
    var reference = new Reference(reader);
    var indexEntry = indexEntries[reference.index];
    var offset = tell(reader);
    var entries = [];
    var entriesCount = reference.entries;
    
    seek(reader, indexEntry.offset);
    
    for (var i = 0, l = entriesCount; i < entriesCount; i++) {
      entries[i] = Func(reader, indexEntries, indexEntry.version);
    }
    
    seek(reader, offset);
    
    return entries;
  }
  
  // Parse by value using a typed array
  function parseReferenceByValTyped(reader, indexEntries, Func) {
    var reference = new Reference(reader);
    var offset = tell(reader);
    var indexEntry = indexEntries[reference.index];
    var entries;
    
    seek(reader, indexEntry.offset);
    
    entries = Func(reader, reference.entries);
    
    seek(reader, offset);
    
    return entries;
  }
  
  function parseSeqeunceData(reader, indexEntries, Func) {
    var reference = new Reference(reader);
    var indexEntry = indexEntries[reference.index];
    var offset = tell(reader);
    var entries = [];
    
    seek(reader, indexEntry.offset);
    
    for (var i = 0, l = reference.entries; i < l; i++) {
      entries[i] = SD(reader, indexEntries, Func);
    }
    
    seek(reader, offset);
    
    return entries;
  }
  
  function readEvent(reader, indexEntries, version) {
    var e = {};
    
    e.version = version;
    e.name = parseReferenceString(reader, indexEntries);
    e.unknown0 = readInt32(reader);
    e.unknown1 = readInt16(reader);
    e.unknown2 = readUint16(reader);
    e.matrix = readMatrix(reader);
    e.unknown3 = readInt32(reader);
    e.unknown4 = readInt32(reader);
    e.unknown5 = readInt32(reader);
    
    if (version > 0) {
      e.unknown6 = readInt32(reader);
      e.unknown7 = readInt32(reader);
    }
    
    if (version > 1) {
      e.unknown8 = readInt32(reader);
    }
    
    return e;
  }
  
  function SD(reader, indexEntries, Func) {
    var keys = parseReferenceByValTyped(reader, indexEntries, readInt32Array);
    var flags = readUint32(reader);
    var biggestKey = readUint32(reader);
    var values = parseReferenceByVal(reader, indexEntries, Func);
  
    return {keys: keys, flags: flags, biggestKey: biggestKey, values: values};
  }

  function AnimationReference(reader, Func) {
    this.interpolationType = readUint16(reader);
    this.animFlags = readUint16(reader);
    this.animId = readUint32(reader);
    this.initValue = Func(reader);
    this.nullValue = Func(reader);
    this.unknown0 = readFloat32(reader);
  }
  
  function TMD(reader, indexEntries, version) {
    this.version = version;
  }
  
  function BBSC(reader, indexEntries, version) {
    this.version = version;
  }
  
  function AttachmentVolume(reader, indexEntries, version) {
    this.version = version;
    this.bone0 = readUint32(reader);
    this.bone1 = readUint32(reader);
    this.type = readUint32(reader);
    this.bone2 = readUint32(reader);
    this.matrix = readMatrix(reader);
    this.unknown0 = parseReferenceByVal(reader, indexEntries, readVector3);
    this.unknown1 = parseReferenceByValTyped(reader, indexEntries, readUint16Array);
    this.size = readVector3(reader);
  }
  
  function BoundingShape(reader) {
    this.shape = readUint32(reader); // 0: cube
                                                      // 1: sphere
                                                      // 2: cylinder
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
  
  function TRGD(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = parseReferenceByValTyped(reader, indexEntries, readUint32Array);
    this.name = parseReferenceString(reader, indexEntries);
  }
  
  function PATU(reader, indexEntries, version) {
    this.version = version;
  }
  
  function IKJT(reader, indexEntries, version) {
    this.version = version;
  }
  
  function PhysicsJoint(reader, indexEntries, version) {
    this.version = version;
  }
  
  function DMSE(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = readUint8(reader);
    this.i0 = readUint8(reader);
    this.i1 = readUint8(reader);
    this.i2 = readUint8(reader);
  }
    
  function PhysicsShape(reader, indexEntries, version) {
    this.version = version;
    this.matrix = readMatrix(reader);
    
    if (version < 2) {
      this.unknown0 = readUint32(reader);
    }
    
    this.shape = readUint8(reader); // 0 box
                                              // 1 sphere
                                              // 2 capsule
                                              // 3 cylinder
                                              // 4 convex hull
                                              // 5 mesh
    this.unknown1 = readUint8(reader);
    this.unknown2 = readUint16(reader);
    
    if (version < 2) {
      this.vertices = parseReferenceByVal(reader, indexEntries, readVector3);
      this.unknown3 = parseReferenceByValTyped(reader, indexEntries, readUint8Array);
      this.triangles = parseReferenceByValTyped(reader, indexEntries, readUint16Array);
      this.planeEquations = parseReferenceByVal(reader, indexEntries, readVector4);
    }
    
    if (version > 2) {
      this.unknown4 = read(reader, 24);
    }
    
    this.size0 = readFloat32(reader);
    this.size1 = readFloat32(reader);
    this.size2 = readFloat32(reader);
    
    if (version > 2) {
      this.unknown5 = parseReferenceByVal(reader, indexEntries, readVector3);
      this.unknown6 = parseReferenceByVal(reader, indexEntries, readVector4);
      this.unknown7 = parseReference(reader, indexEntries, DMSE);
      this.unknown8 = parseReferenceByValTyped(reader, indexEntries, readUint8Array);
      this.unknown9 = new Reference(reader);
      this.unknown10 = readUint32(reader);
      this.unknown11 = readUint32(reader);
      this.unknown12 = readUint32(reader);
      this.unknown13 = readUint32(reader);
      this.unknown14 = readUint32(reader);
      this.unknown15 = read(reader, 84);
      this.unknown16 = readUint32(reader);
      this.unknown17 = readUint32(reader);
      this.unknown18 = readUint32(reader);
      this.unknown19 = readUint32(reader);
      this.unknown20 = readUint32(reader);
      this.unknown21 = readUint32(reader);
      this.unknown22 = readUint32(reader);
      this.unknown23 = readUint32(reader);
    }
  }
  
  function  RigidBody(reader, indexEntries, version) {
    this.version = version;
    
    if (version < 3) {
      this.unknown0To14 = readFloat32Array(reader, 15);
      this.bone = readUint16(reader);
      this.boneUnused = readUint16(reader);
      this.unknown15 = read(reader, 15);
    }
    
    if (version > 3) {
      this.unknown16 = readUint16(reader);
      this.unknown17 = readUint16(reader);
      this.unknown18 = readUint32(reader);
      this.bone = readUint32(reader);
      this.unknown19 = readFloat32(reader);
      this.unknown20 = readFloat32(reader);
      this.unknown21 = readFloat32(reader);
      this.unknown22 = readFloat32(reader);
      this.unknown23 = readFloat32(reader);
      this.unknown24 = readFloat32(reader);
      this.unknown25 = new AnimationReference(reader, readUint32); // Unknown reference type
      this.unknown26 = readFloat32(reader);
    }
    
    this.physicsShapes = parseReference(reader, indexEntries, PhysicsShape);
    this.flags = readUint32(reader); // 0x1 collidable
                                              // 0x2 walkable
                                              // 0x4 stackable
                                              // 0x8 simulateOnCollision
                                              // 0x10 ignoreLocalBodies
                                              // 0x20 alwaysExists
                                              // 0x80 doNotSimulate
    this.localForces = readUint16(reader); // 0x1 1
                                                       // 0x2 2
                                                       // 0x4 3
                                                       // 0x8 4
                                                       // 0x10 5
                                                       // 0x20 6
                                                       // 0x40 7
                                                       // 0x80 8
                                                       // 0x100 9
                                                       // 0x200 10
                                                       // 0x400 11
                                                       // 0x800 12
                                                       // 0x1000 13
                                                       // 0x2000 14
                                                       // 0x4000 15
                                                       // 0x8000 16
    this.worldForces = readUint16(reader); // 0x1 wind
                                                        // 0x2 explosion
                                                        // 0x4 energy
                                                        // 0x8 blood
                                                        // 0x10 magnetic
                                                        // 0x20 grass
                                                        // 0x40 brush
                                                        // 0x80 trees
    this.priority = readUint32(reader);
  }
  
  function Warp(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = readUint32(reader);
    this.bone = readUint32(reader);
    this.unknown1 = readUint32(reader);
    this.radius = new AnimationReference(reader, readFloat32);
    this.unknown2 = new AnimationReference(reader, readFloat32);
    this.compressionStrength = new AnimationReference(reader, readFloat32);
    this.unknown3 = new AnimationReference(reader, readFloat32);
    this.unknown4 = new AnimationReference(reader, readFloat32);
    this.unknown5 = new AnimationReference(reader, readFloat32);
  }
  
  function Force(reader, indexEntries, version) {
    this.version = version;
    this.type = readUint32(reader);
    this.unknown0 = readUint32(reader);
    this.unknown1 = readUint32(reader);
    this.bone = readUint32(reader);
    this.unknown2 = readUint32(reader);
    this.forceChannels = readUint32(reader);
    this.forceStrength = new AnimationReference(reader, readFloat32); 
    this.forceRange = new AnimationReference(reader, readFloat32); 
    this.unknown3 = new AnimationReference(reader, readFloat32); 
    this.unknown4 = new AnimationReference(reader, readFloat32); 
  }
  
  function Projection(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = readUint32(reader);
    this.bone = readUint32(reader);
    this.materialReferenceIndex = readUint32(reader); // Maybe?
    this.unknown1 = new AnimationReference(reader, readVector3); // Unknown reference type
    this.unknown2 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown3 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown4 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown5 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown6 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown7 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown8 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown9 = new AnimationReference(reader, readFloat32); 
    this.unknown10 = new AnimationReference(reader, readFloat32); 
    this.unknown11 = new AnimationReference(reader, readFloat32); 
    this.unknown12 = new AnimationReference(reader, readFloat32); 
    this.unknown13 = new AnimationReference(reader, readFloat32); 
    this.unknown14 = new AnimationReference(reader, readFloat32); 
    this.unknown15 = readUint32(reader);
    this.unknown16 = readFloat32(reader);
    this.unknown17 = readFloat32(reader);
    this.unknown18 = readFloat32(reader);
    this.unknown19 = readFloat32(reader);
    this.unknown20 = readUint32(reader);
    this.unknown21 = readFloat32(reader);
    this.unknown22 = readUint32(reader);
    this.unknown23 = readFloat32(reader);
    this.unknown24 = readUint32(reader);
    this.unknown25 = readFloat32(reader);
    this.unknown26 = new AnimationReference(reader, readUint32); 
    this.unknown27 = readUint32(reader);
    this.unknown28 = readUint32(reader);
    this.unknown29 = readUint32(reader);
    this.unknown30 = readUint32(reader);
  }
  
  function SRIB(reader, indexEntries, version) {
    this.version = version;
  }
  
  function RibbonEmitter(reader, indexEntries, version) {
    this.version = version;
    this.bone = readUint8(reader);
    this.short1 = readUint8(reader);
    this.short2 = readUint8(reader);
    this.short3 = readUint8(reader);
    this.materialReferenceIndex = readUint32(reader);
    
    if (version > 7) {
      this.unknown0 = readUint32(reader);
    }
    
    this.waveLength = new AnimationReference(reader, readFloat32); 
    this.unknown1 = new AnimationReference(reader, readUint32); // Unknown reference type
    
    if (version < 7) {
      this.unknown2 = readInt32(reader);
    }
    
    this.unknown3 = new AnimationReference(reader, readFloat32); 
    this.unknown4 = new AnimationReference(reader, readFloat32); 
    this.unknown5 = new AnimationReference(reader, readFloat32); 
    this.unknown6 = new AnimationReference(reader, readFloat32); 
    this.unknown7 = new AnimationReference(reader, readFloat32); 
    this.unknown8 = new AnimationReference(reader, readFloat32); 
    this.unknown9 = readUint32(reader);
    this.unknown10 = readUint32(reader);
    this.unknown11 = readFloat32(reader);
    this.unknown12 = readFloat32(reader);
    this.tipOffsetZ = readFloat32(reader);
    this.centerBias = readFloat32(reader);
    this.unknown13 = readFloat32(reader);
    this.unknown14 = readFloat32(reader);
    this.unknown15 = readFloat32(reader);
    
    if (version > 7) {
      this.unknown16 = new Reference(reader); // Reference?
    }
    
    this.radiusScale = new AnimationReference(reader, readVector3); 
    this.twist = new AnimationReference(reader, readFloat32); 
    this.unknown17 = readUint32(reader);
    this.unknown18 = readUint32(reader);
    this.unknown19 = readUint32(reader);
    this.unknown20 = readUint32(reader);
    this.baseColoring = new AnimationReference(reader, readColor);  
    this.centerColoring = new AnimationReference(reader, readColor);  
    this.tipColoring = new AnimationReference(reader, readColor);  
    this.stretchAmount = readFloat32(reader);
    
    if (version < 7) {
      this.unknown21 = readFloat32(reader);
    }
    
    if (version > 7) {
      this.unknown22 = readFloat32(reader);
    }
    
    this.stretchLimit = readFloat32(reader);
    this.unknown23 = readFloat32(reader);
    this.unknown24 = readFloat32(reader);
    this.unknown25 = readUint32(reader);
    
    if (version < 7) {
      this.unknown26 = readUint32(reader);
      this.unknown27 = readUint32(reader);
    }
    
    this.surfaceNoiseAmplitude = readFloat32(reader);
    this.surfaceNoiseNumberOfWaves = readFloat32(reader);
    this.surfaceNoiseFrequency = readFloat32(reader);
    this.surfaceNoiseScale = readFloat32(reader);
    this.unknown28 = readUint32(reader);
    this.ribbonType = readUint32(reader);
    this.unknown29 = readUint32(reader);
    this.ribbonDivisions = readFloat32(reader);
    this.ribbonSides = readUint32(reader);
    this.unknown30 = readFloat32(reader);
    this.ribbonLength = new AnimationReference(reader, readFloat32); 
    
    if (version < 7) {
      this.filler1 = readInt32(reader);
    }
    
    this.srib = parseReference(reader, indexEntries, SRIB);
    this.unknown31 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.flags = readUint32(reader); // 0x2 collideWithTerrain
                                              // 0x4 collideWithObjects
                                              // 0x8 edgeFalloff
                                              // 0x10 inheritParentVelocity
                                              // 0x20 smoothSize
                                              // 0x40 bezierSmoothSize
                                              // 0x80 useVertexAlpha
                                              // 0x100 scaleTimeByParent
                                              // 0x200 forceLegacy
                                              // 0x400 useLocaleTime
                                              // 0x800 simulateOnInitialization
                                              // 0x1000 useLengthAndTime
    this.unknown32 = readUint32(reader);
    this.unknown33 = readFloat32(reader);
    this.unknown34 = readUint32(reader);
    this.unknown35 = readUint32(reader);
            
    if (version > 7) {
      this.unknown36 = read(reader, 8);
    }
    
    this.directionVariationBool = readUint32(reader);
    this.directionVariationAmount = new AnimationReference(reader, readFloat32); 
    this.directionVariationFrequency = new AnimationReference(reader, readFloat32); 
    this.amplitudeVariationBool = readUint32(reader);
    this.amplitudeVariationAmount = new AnimationReference(reader, readFloat32); 
    this.amplitudeVariationFrequency = new AnimationReference(reader, readFloat32); 
    this.lengthVariationBool = readUint32(reader);
    this.lengthVariationAmount = new AnimationReference(reader, readFloat32); 
    this.lengthVariationFrequency = new AnimationReference(reader, readFloat32); 
    this.radiusVariationBool = readUint32(reader);
    this.radiusVariationAmount = new AnimationReference(reader, readFloat32); 
    this.radiusVariationFrequency = new AnimationReference(reader, readFloat32); 
    this.unknown37 = readInt32(reader);
    this.unknown38 = new AnimationReference(reader, readFloat32); 
    this.unknown39 = new AnimationReference(reader, readFloat32); 
    this.unknown40 = new AnimationReference(reader, readFloat32); 
    this.unknown41 = new AnimationReference(reader, readFloat32); 
  }
  
  function ParticleEmitterCopy(reader, indexEntries, version) {
    this.version = version;
    this.emissionRate = new AnimationReference(reader, readFloat32);
    this.partEmit = new AnimationReference(reader, readInt16);
    this.bone = readUint32(reader);
  }
  
  function ParticleEmitter(reader, indexEntries, version) {
    this.version = version;
    this.bone = readUint32(reader);
    this.materialReferenceIndex = readUint32(reader);
    
    if (version > 16) {
      this.additionalFlags = readUint32(reader); // 0x1 randomizeWithEmissionSpeed2
                                                               // 0x1 randomizeWithLifespan2
                                                               // 0x1 randomizeWithMass2
                                                               // 0x1 trailingEnabled
    }

    this.emissionSpeed1 = new AnimationReference(reader, readFloat32);
    this.emissionSpeed2 = new AnimationReference(reader, readFloat32);
    
    if (version < 13) {
      this.randomizeWithEmissionSpeed2 = readUint32(reader);
    }
    
    this.emissionAngleX = new AnimationReference(reader, readFloat32);
    this.emissionAngleY = new AnimationReference(reader, readFloat32);
    this.emissionSpreadX = new AnimationReference(reader, readFloat32);
    this.emissionSpreadY = new AnimationReference(reader, readFloat32);
    this.lifespan1 = new AnimationReference(reader, readFloat32);
    this.lifespan2 = new AnimationReference(reader, readFloat32);
    
    if (version < 13) {
      this.randomizeWithLifespan2 = readUint32(reader);
    }
    
    this.unknown0 = new Reference(reader);
    this.zAcceleration = readFloat32(reader);
    this.sizeAnimationMiddle = readFloat32(reader);
    this.colorAnimationMiddle = readFloat32(reader);
    this.alphaAnimationMiddle = readFloat32(reader);
    this.rotationAnimationMiddle = readFloat32(reader);
    
    if (version > 16) {
      this.sizeHoldTime = readFloat32(reader);
      this.colorHoldTime = readFloat32(reader);
      this.alphaHoldTime = readFloat32(reader);
      this.rotationHoldTime = readFloat32(reader);
    }

    this.particleSizes1 = new AnimationReference(reader, readVector3);
    this.rotationValues1 = new AnimationReference(reader, readVector3);
    this.initialColor1 = new AnimationReference(reader, readColor);
    this.middleColor1 = new AnimationReference(reader, readColor);
    this.finalColor1 = new AnimationReference(reader, readColor);
    this.slowdown = readFloat32(reader);
    this.mass = readFloat32(reader);
    this.mass2 = readFloat32(reader);
    this.unknown1 = readFloat32(reader);
    
    if (version < 13) {
      this.unknown2 = readUint32(reader);
      this.trailingEnabled = readUint32(reader);
    }
    
    this.localForceChannels = readUint16(reader);
    this.worldForceChannels = readUint16(reader);
    this.forceChannelsFillerBytes = readUint16(reader);
    this.worldForceChannelsCopy = readUint16(reader);
    this.noiseAmplitude = readFloat32(reader);
    this.noiseFrequency = readFloat32(reader);
    this.noiseCohesion = readFloat32(reader);
    this.noiseEdge = readFloat32(reader);
    this.indexPlusHighestIndex = readUint32(reader);
    this.maxParticles = readUint32(reader);
    this.emissionRate = new AnimationReference(reader, readFloat32);
    this.emissionAreaType = readUint32(reader);
    this.emissionAreaSize = new AnimationReference(reader, readVector3);
    this.emissionAreaCutoutSize = new AnimationReference(reader, readVector3);
    this.emissionAreaRadius = new AnimationReference(reader, readFloat32);
    this.emissionAreaCutoutRadius = new AnimationReference(reader, readFloat32);
    
    if (version > 16) {
      this.unknown3 = parseReferenceByVal(reader, indexEntries, readUint32);
    }
    
    this.emissionType = readUint32(reader);
    this.randomizeWithParticleSizes2 = readUint32(reader);
    this.particleSizes2 = new AnimationReference(reader, readVector3);
    this.randomizeWithRotationValues2 = readUint32(reader);
    this.rotationValues2 = new AnimationReference(reader, readVector3);
    this.randomizeWithColor2 = readUint32(reader);
    this.initialColor2 = new AnimationReference(reader, readColor);
    this.middleColor2 = new AnimationReference(reader, readColor);
    this.finalColor2 = new AnimationReference(reader, readColor);
    this.unknown4 = readUint32(reader);
    this.partEmit = new AnimationReference(reader, readInt16);
    this.phase1StartImageIndex = readUint8(reader);
    this.phase1EndImageIndex = readUint8(reader);
    this.phase2EndImageIndex = readUint8(reader);
    this.phase2StartImageIndex = readUint8(reader);
    this.relativePhase1Length = readFloat32(reader);
    this.numberOfColumns = readUint16(reader);
    this.numberOfRows = readUint16(reader);
    this.columnWidth = readFloat32(reader);
    this.rowHeight = readFloat32(reader);
    this.unknown5 = readFloat32(reader);
    this.unknown6 = readFloat32(reader);
    this.unknown7 = readInt32(reader);
    this.unknown8 = read(reader, 20);
    this.particleType = readUint32(reader); // 0, 2, 3, 4, 5 square billboards
                                                        // 1 speed scaled and rotated billboards influenced by lengthWidhtRatio
                                                        // 6 rectangular billboards using lengthWidhtRatio
                                                        // 7 quads with normal speed
                                                        // 9 quads that stretch between the spawn point and current location
    this.lengthWidthRatio = readFloat32(reader);
    this.unknown9 = read(reader, 8);
    this.unknown10 = readFloat32(reader);
    
    if (version > 16) {
      this.unknown11 = readFloat32(reader);
    }
    
    this.unknown12 = readUint32(reader);
    this.unknown13 = new AnimationReference(reader, readFloat32);
    this.unknown14 = new AnimationReference(reader, readFloat32);
    this.unknown15 = readUint32(reader);
    this.unknown16 = new AnimationReference(reader, readFloat32);
    this.unknown17 = new AnimationReference(reader, readFloat32);
    this.unknown18 = readUint32(reader);
    this.unknown19 = new AnimationReference(reader, readFloat32);
    this.unknown20 = new AnimationReference(reader, readFloat32);
    this.unknown21 = readUint32(reader);
    this.unknown22 = new AnimationReference(reader, readFloat32);
    this.unknown23 = new AnimationReference(reader, readFloat32);
    this.unknown24 = readUint32(reader);
    this.unknown25 = new AnimationReference(reader, readFloat32);
    this.unknown26 = new AnimationReference(reader, readFloat32);
    this.unknown27 = readUint32(reader);
    this.unknown28 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown29 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown30 = read(reader, 4);
    this.unknown31 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown32 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown33 = read(reader, 4);
    this.unknown34 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown35 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown36 = read(reader, 4);
    this.unknown37 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown38 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown39 = new AnimationReference(reader, readFloat32);

    if (version > 21) {
      this.unknown40 = new AnimationReference(reader, readUint32); // Unknown reference type
    }
    
    this.flags = readUint32(reader); // 0x1 sort
                                              // 0x2 collideTerrain
                                              // 0x4 collideObjects
                                              // 0x8 spawnOnBounce
                                              // 0x10 cutoutEmissionArea
                                              // 0x20 inheritEmissionParams
                                              // 0x40 inheritParentVel
                                              // 0x80 sortByZHeight
                                              // 0x100 reverseIteration
                                              // 0x200 smoothRotation
                                              // 0x400 bezSmoothRotation
                                              // 0x800 smoothSize
                                              // 0x1000 bezSmoothSize
                                              // 0x2000 smoothColor
                                              // 0x4000 bezSmoothColor
                                              // 0x8000 litParts
                                              // 0x10000 randFlipBookStart
                                              // 0x20000 multiplyByGravity
                                              // 0x40000 clampTailParts
                                              // 0x80000 spawnTrailingParts
                                              // 0x100000 fixLengthTailParts
                                              // 0x200000 useVertexAlpha
                                              // 0x400000 modelParts
                                              // 0x800000 swapYZonModelParts
                                              // 0x1000000 scaleTimeByParent
                                              // 0x2000000 useLocalTime
                                              // 0x4000000 simulateOnInit
                                              // 0x8000000 copy
    
    if (version > 17) {
      this.rotationFlags = readUint32(reader); // 0x2 relativeRotation
                                                            // 0x4 alwaysSet
   }
   
   if (version > 16) {
      this.colorSmoothingType = readUint32(reader);      // 0 linear
      this.sizeSmoothingType = readUint32(reader);       // 1 smooth
      this.rotationSmoothingType = readUint32(reader); // 2 bezier
                                                                           // 3 linear hold
                                                                           // 4 bezier hold
      this.unknown41 = new AnimationReference(reader, readFloat32);
      this.unknown42 = new AnimationReference(reader, readVector2);
      this.unknown43 = new AnimationReference(reader, readVector3);
      this.unknown44 = new AnimationReference(reader, readVector2);
    }

    // NOTE: m3addon says this is an animation reference, but that causes parsing errors. Is this a reference?
    this.spawnPoints = parseReferenceByVal(reader, indexEntries, readVector3);//new AnimationReference(reader, readVector3);
    this.unknown45 = readFloat32(reader);
    this.unknown46 = readUint32(reader);
    this.unknown47 = readUint32(reader);
    this.unknown48 = new AnimationReference(reader, readUint32); // Unknown reference type
    this.unknown49 = new AnimationReference(reader, readFloat32);
    this.trailingParticlesIndex = readInt32(reader);
    this.trailingParticlesChance = readFloat32(reader);
    this.trailingParticlesRate = new AnimationReference(reader, readFloat32);
    this.unknown50 = read(reader, 8);
    this.usedModel = parseReferenceString(reader, indexEntries);
    this.copyIndices = parseReferenceByVal(reader, indexEntries, readUint32);
  }
  
  function Layer(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = readUint32(reader);
    this.imagePath = parseReferenceString(reader, indexEntries);
    this.color = new AnimationReference(reader, readColor);
    this.flags = readUint32(reader); // 0x4 textureWrapX
                                              // 0x8 textureWrapY
                                              // 0x10 invertColor
                                              // 0x20 clamp
                                              // 0x100 useParticleFlipbook
                                              // 0x400 colorEnabled
    this.uvSource = readUint32(reader); // 0 explicitUnwrap1
                                                     // 1 explicitUnwrap2
                                                     // 2 reflectiveCubeEnv
                                                     // 3 reflectiveSphereEnv
                                                     // 4 planarLocalZ
                                                     // 5 planarWorldZ
                                                     // 6 Particle Flipbook
                                                     // 7 cubicEnv
                                                     // 8 sphereEnv
                                                     // 9 explicitUnwrap3
                                                     // 10 explicitUnwrap4
                                                     // 11 planarLocalX
                                                     // 12 planarLocalY
                                                     // 13 planarWorldX
                                                     // 14 planarWorldY
                                                     // 15 screenSpace
                                                     // 16 triPlanarLocal
                                                     // 17 triPlanerWorld
                                                     // 18 triPlayedWorldLocalZ
    this.colorChannels = readUint32(reader); // 0 RGB
                                                           // 1 RGBA
                                                           // 2 A
                                                           // 3 R
                                                           // 4 G
                                                           // 5 B
    this.rgbMultiply = new AnimationReference(reader, readFloat32);
    this.rgbAdd = new AnimationReference(reader, readFloat32);
    this.unknown1 = readUint32(reader);
    this.unknown2 = readInt32(reader);
    this.unknown3 = readUint32(reader);
    this.replaceableChannel = readUint32(reader); // -1 noReplaceable
                                                                   // 0 channel 1
                                                                   // 1 channel 2
                                                                   // 2 channel 3
                                                                   // 3 channel 4
                                                                   // 4 channel 5
                                                                   // 5 channel 6
                                                                   // 6 channel 7
    this.unknown4 = readInt32(reader);
    this.unknown5 = readUint32(reader);
    this.unknown6 = readUint32(reader);
    this.unknown7 = new AnimationReference(reader, readUint32);
    this.unknown8 = new AnimationReference(reader, readVector2);
    this.flipBook = new AnimationReference(reader, readInt16);
    this.uvOffset = new AnimationReference(reader, readVector2);
    this.uvAngle = new AnimationReference(reader, readVector3);
    this.uvTiling = new AnimationReference(reader,  readVector2);
    this.unknown9 = new AnimationReference(reader, readUint32);
    this.unknown10 = new AnimationReference(reader, readFloat32);
    this.brightness = new AnimationReference(reader, readFloat32);
    this.unknown11 = readInt32(reader);
    this.fresnelFlags = readUint32(reader); // 0x1 ?
                                                         // 0x2 ?
                                                         // 0x4 colorEnabled
    this.fresnelStrength = readFloat32(reader);
    this.fresnelStart = readFloat32(reader);
    this.triPlannarOffset = readVector3(reader);
    this.triPlannarScale = readVector3(reader);
  }
  
  function CreepMaterial(reader, indexEntries) {
    this.name = parseReferenceString(reader, indexEntries);
    this.creepLayer = parseSingleReference(reader, indexEntries, Layer);
  }
  
  function VolumeNoiseMaterial(reader, indexEntries, version) {
    this.version = version;
  }
  
  function VolumeMaterial(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.unknown0 = readUint32(reader);
    this.unknown1 = readUint32(reader);
    this.volumeDensity = new AnimationReference(reader, readFloat32);
    this.colorDefiningLayer = parseSingleReference(reader, indexEntries, Layer);
    this.unknown2 = parseSingleReference(reader, indexEntries, Layer);
    this.unknown3 = parseSingleReference(reader, indexEntries, Layer);
    this.unknown4 = readUint32(reader);
    this.unknown5 = readUint32(reader);
  }
  
  function TerrainMaterial(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.terrainLayer = parseSingleReference(reader, indexEntries, Layer);
  }
  
  function CompositeMaterialSection(reader, indexEntries, version) {
    this.version = version;
    this.materialReferenceIndex = readUint32(reader);
    this.alphaFactor = new AnimationReference(reader, readFloat32);
  }
  
  function CompositeMaterial(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.unknown0 = readUint32(reader);
    this.sections = parseReference(reader, indexEntries, CompositeMaterialSection);
  }
  
  function DisplacementMaterial(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.unknown0 = readUint32(reader);
    this.strengthFactor = new AnimationReference(reader, readFloat32);
    this.normalLayer = parseSingleReference(reader, indexEntries, Layer);
    this.strengthLayer = parseSingleReference(reader, indexEntries, Layer);
    this.flags = readUint32(reader);
    this.priority = readInt32(reader);
  }
  
  function StandardMaterial(reader, indexEntries, version) {
    this.name = parseReferenceString(reader, indexEntries);
    this.specialFlags = readUint32(reader); // 0x1 useDepthBlend
                                                        // 0x4 useVertexColor
                                                        // 0x8 useVertexAlpha
                                                        // 0x200 useTransparentShadows
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
                                              // 0x800 splatUVfix
                                              // 0x1000 softBlending
                                              // 0x4000 transparentShadows
                                              // 0x8000 decalLighting
                                              // 0x10000 transparencyAffectsDepth
                                              // 0x20000 localLightsOnTransparencies
                                              // 0x40000 disableSoftDepthBlend
                                              // 0x80000 doubleLambert
                                              // 0x100000 hairLayerSorting
                                              // 0x200000 acceptsSplats
                                              // 0x400000 decalRequiredOnLowEnd
                                              // 0x800000 emissiveRequiredOnLowEnd
                                              // 0x1000000 specularRequiredOnLowEnd
                                              // 0x2000000 acceptSplatsOnly
                                              // 0x4000000 isBackgroundObject
                                              // 0x10000000 zfillRequiredOnLowEnd
                                              // 0x20000000 excludeFromHighlighting
                                              // 0x40000000 clampOutput
                                              // 0x80000000 visible
    this.blendMode = readUint32(reader); // 0 opaque
                                                       // 1 blend
                                                       // 2 additive
                                                       // 3 probably addAlpha
                                                       // 4 mod
                                                       // 5 mod2x
                                                       
    this.priority = readInt32(reader);
    this.unknown0 = readUint32(reader);
    this.specularity = readFloat32(reader);
    this.depthBlend = readFloat32(reader);
    this.alphaTestThreshold = readUint8(reader);
    this.unknown1 = readUint8(reader);
    this.unknown2 = readUint8(reader);
    this.unknown3 = readUint8(reader);
    this.specMult = readFloat32(reader);
    this.emisMult = readFloat32(reader);
    this.diffuseLayer = parseSingleReference(reader, indexEntries, Layer);
    this.decalLayer = parseSingleReference(reader, indexEntries, Layer);
    this.specularLayer = parseSingleReference(reader, indexEntries, Layer);
    
    if (version > 15) {
      this.glossLayer = parseSingleReference(reader, indexEntries, Layer);
    }
    
    this.emissiveLayer = parseSingleReference(reader, indexEntries, Layer);
    this.emissive2Layer = parseSingleReference(reader, indexEntries, Layer);
    this.evioLayer = parseSingleReference(reader, indexEntries, Layer);
    this.evioMaskLayer = parseSingleReference(reader, indexEntries, Layer);
    this.alphaMaskLayer = parseSingleReference(reader, indexEntries, Layer);
    this.alphaMask2Layer = parseSingleReference(reader, indexEntries, Layer);
    this.normalLayer = parseSingleReference(reader, indexEntries, Layer);
    this.heightLayer = parseSingleReference(reader, indexEntries, Layer);
    this.lightMapLayer = parseSingleReference(reader, indexEntries, Layer);
    this.ambientOcclusionLayer = parseSingleReference(reader, indexEntries, Layer);
    this.unknown4 = readUint32(reader);
    this.layerBlendType = readUint32(reader);
    this.emisBlendType = readUint32(reader);
    this.emisMode = readUint32(reader);
    this.specType = readUint32(reader);
    this.unknown5 = new AnimationReference(reader, readUint32);
    this.unknown6 = new AnimationReference(reader, readUint32);
  }
  
  function MaterialMap(reader) {
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
  
  function AttachmentPoint(reader, indexEntries, version) {
    this.version = version;
    this.unknown = readInt32(reader);
    this.name = parseReferenceString(reader, indexEntries);
    this.bone = readUint32(reader);
  }
  
  function MSEC(reader) {
    this.unknown0 = readUint32(reader);
    this.boundings = new AnimationReference(reader, readBoundingSphere);
  }

  function Batch(reader) {
    this.unknown0 = readUint32(reader);
    this.regionIndex = readUint16(reader);
    this.unknown1 = readUint32(reader);
    this.materialReferenceIndex = readUint16(reader);
    this.unknown2 = readUint16(reader);
  }
  
  function Region(reader) {
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
  }
  
  function Division(reader, indexEntries, version) {
    this.version = version;
    this.triangles = parseReferenceByValTyped(reader, indexEntries, readUint16Array);
    this.regions = parseReference(reader, indexEntries, Region);
    this.batches = parseReference(reader, indexEntries, Batch);
    this.MSEC = parseReference(reader, indexEntries, MSEC);
    this.unknown0 = readUint32(reader);
  }
  
  function Bone(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = readInt32(reader);
    this.name = parseReferenceString(reader, indexEntries);
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
  
  function STS(reader, indexEntries, version) {
    this.version = version;
    this.animIds = parseReferenceByValTyped(reader, indexEntries, readUint32Array);
    this.unknown0 = readInt32(reader);
    this.unknown1 = readInt32(reader);
    this.unknown2 = readInt32(reader);
    this.unknown3 = readInt16(reader);
    this.unknown4 = readUint16(reader);
  }
  
  function STG(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.stcIndices = parseReferenceByValTyped(reader, indexEntries, readUint32Array);
  }
  
  function STC(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.runsConcurrent = readUint16(reader);
    this.priority = readUint16(reader);
    this.stsIndex = readUint16(reader);
    this.stsIndexCopy = readUint16(reader);
    this.animIds = parseReferenceByValTyped(reader, indexEntries, readUint32Array);
    this.animRefs = parseReferenceByVal(reader, indexEntries, readUint16Pair);
    this.unknown0 = readUint32(reader);
    this.sd = [
      parseSeqeunceData(reader, indexEntries, readEvent),
      parseSeqeunceData(reader, indexEntries, readVector2),
      parseSeqeunceData(reader, indexEntries, readVector3),
      parseSeqeunceData(reader, indexEntries, readVector4),
      parseSeqeunceData(reader, indexEntries, readColor),
      parseSeqeunceData(reader, indexEntries, readFloat32),
      new Reference(reader),
      parseSeqeunceData(reader, indexEntries, readInt16),
      parseSeqeunceData(reader, indexEntries, readUint16),
      new Reference(reader),
      new Reference(reader),
      parseSeqeunceData(reader, indexEntries, readUint32),
      parseSeqeunceData(reader, indexEntries, readBoundingSphere)
    ];
  }
  
  function Sequence(reader, indexEntries, version) {
    this.version = version;
    this.unknown0 = readInt32(reader);
    this.unknown1 = readInt32(reader);
    this.name = parseReferenceString(reader, indexEntries);
    this.animationStart = readUint32(reader);
    this.animationEnd = readUint32(reader);
    this.movementSpeed = readFloat32(reader);
    this.flags = readUint32(reader); // 0x1 notLooping
                                              // 0x2 alwaysGlobal
                                              // 0x8 globalInPreviewer
    this.frequency = readUint32(reader);
    this.unknown2 = readUint32(reader);
    this.unknown3 = readUint32(reader);
    this.unknown4 = readUint32(reader);
    
    if (version < 2) {
      this.unknown5 = readUint32(reader);
    }
    
    this.boundingSphere = readBoundingSphere(reader);
    this.unknown6 = readUint32(reader);
    this.unknown7 = readUint32(reader);
    this.unknown8 = readUint32(reader);
  }
  
  function ModelHeader(reader, indexEntries, version) {
    this.version = version;
    this.name = parseReferenceString(reader, indexEntries);
    this.flags = readUint32(reader); // 0x100000 hasMesh
    this.sequences = parseReference(reader, indexEntries, Sequence);
    this.stc = parseReference(reader, indexEntries, STC);
    this.stg = parseReference(reader, indexEntries, STG);
    this.unknown0 = readFloat32(reader);
    this.unknown1 = readFloat32(reader);
    this.unknown2 = readFloat32(reader);
    this.unknown3 = readFloat32(reader);
    this.sts = parseReference(reader, indexEntries, STS);
    this.bones = parseReference(reader, indexEntries, Bone);
    this.skinBones = readUint32(reader);
    
    var vertexFlags = readUint32(reader);
    var uvSetCount = 1;
    
    if (vertexFlags & 0x40000) {
      uvSetCount = 2;
    } else if (vertexFlags & 0x80000) {
      uvSetCount = 3;
    } else if (vertexFlags & 0x100000) {
      uvSetCount = 4;
    }
    
    this.vertexFlags = vertexFlags;
    this.uvSetCount = uvSetCount;
    this.vertices = parseVertices(reader, indexEntries, uvSetCount);
    this.divisions = parseReference(reader, indexEntries, Division);
    this.boneLookup = parseReferenceByValTyped(reader, indexEntries, readUint16Array);
    this.boundings = readBoundingSphere(reader);
    this.unknown4To19 = readFloat32Array(reader, 16);
    this.attachmentPoints = parseReference(reader, indexEntries, AttachmentPoint);
    this.attachmentPointAddons = new Reference(reader);//parseReferenceByVal(reader, indexEntries, readUint16);
    this.ligts = parseReference(reader, indexEntries, Light);
    this.shbx = new Reference(reader);//parseReference(reader, indexEntries, SHBX);
    this.cameras = parseReference(reader, indexEntries, Camera);
    this.unknown20 = new Reference(reader);//parseReferenceByVal(reader, indexEntries, readUint16);
    this.materialMaps = parseReference(reader, indexEntries, MaterialMap);
    this.materials = [
      parseReference(reader, indexEntries, StandardMaterial),
      parseReference(reader, indexEntries, DisplacementMaterial),
      parseReference(reader, indexEntries, CompositeMaterial),
      parseReference(reader, indexEntries, TerrainMaterial),
      parseReference(reader, indexEntries, VolumeMaterial),
      parseReference(reader, indexEntries, VolumeNoiseMaterial),
      parseReference(reader, indexEntries, CreepMaterial)
    ];
    
    if (version > 24) {
      this.unknown21 = new Reference(reader);
    }
    
    if (version > 25) {
      this.unknown22 = new Reference(reader);
    }
    
    this.particleEmitters = new Reference(reader);//parseReference(reader, indexEntries, ParticleEmitter);
    this.particleEmitterCopies = new Reference(reader);//parseReference(reader, indexEntries, ParticleEmitterCopy);
    this.ribbonEmitters = new Reference(reader);//parseReference(reader, indexEntries, RibbonEmitter);
    this.projections = new Reference(reader);//parseReference(reader, indexEntries, Projection);
    this.forces = new Reference(reader);//parseReference(reader, indexEntries, Force);
    this.warps = new Reference(reader);//parseReference(reader, indexEntries, Warp);
    this.unknown23 = new Reference(reader);
    this.rigidBodies = new Reference(reader);//parseReference(reader, indexEntries, RigidBody);
    this.unknown24 = new Reference(reader);
    this.physicsJoints = new Reference(reader);//parseReference(reader, indexEntries, PhysicsJoint);
    this.unknown25 = new Reference(reader);
    this.ikjt = new Reference(reader);//parseReference(reader, indexEntries, IKJT);
    this.unknown26 = new Reference(reader);
    
    if (version > 24) {
      this.unknown27 = new Reference(reader);
    }
    
    this.patu = new Reference(reader);//parseReference(reader, indexEntries, PATU);
    this.trgd = new Reference(reader);//parseReference(reader, indexEntries, TRGD);
    this.initialReference = parseReferenceByVal(reader, indexEntries, readMatrix);
    this.tightHitTest = new BoundingShape(reader);
    this.fuzzyHitTestObjects = parseReference(reader, indexEntries, BoundingShape);
    this.attachmentVolumes = new Reference(reader);//parseReference(reader, indexEntries, AttachmentVolume);
    this.attachmentVolumesAddon0 = new Reference(reader);//parseReferenceByVal(reader, indexEntries, readUint16);
    this.attachmentVolumesAddon1 = new Reference(reader);//parseReferenceByVal(reader, indexEntries, readUint16);
    this.bbsc = new Reference(reader);//parseReference(reader, indexEntries, BBSC);
    this.tmd = new Reference(reader);//parseReference(reader, indexEntries, TMD);
    this.unknown28 = readUint32(reader);
    this.unknown29 = new Reference(reader);//parseReferenceByVal(reader, indexEntries, readUint32);
  }
  
  function Reference(reader) {
    this.entries = readUint32(reader);
    this.index = readUint32(reader);
    this.flags = readUint32(reader);
  }
  
  function IndexEntry(reader) {
    this.tag = readUint32(reader);
    this.offset = readUint32(reader);
    this.entries = readUint32(reader);
    this.version = readUint32(reader);
  }
  
  function MD34(reader) {
    this.indexOffset = readUint32(reader);
    this.entries = readUint32(reader);
    this.modelHeader = new Reference(reader);
  }

  return (function (reader, onprogress) {
    if (readUint32(reader) === MD34_HEADER) {
      var header = new MD34(reader)
      
      seek(reader, header.indexOffset);
      
      var indexEntries = [];
      
      for (var i = 0; i < header.entries; i++) {
        indexEntries[i] = new IndexEntry(reader);
      }
      
      var modelHeader = indexEntries[header.modelHeader.index];
      
      seek(reader, modelHeader.offset);
      
      return new ModelHeader(reader, indexEntries, modelHeader.version);
    }
  });
}());