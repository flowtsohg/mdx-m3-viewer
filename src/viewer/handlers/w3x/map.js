import { createTextureAtlas } from '../../../common/canvas';
import unique from '../../../common/arrayunique';
import * as geometry from '../../../common/geometry';
import MpqArchive from '../../../parsers/mpq/archive';
import W3xParser from '../../../parsers/w3x/map';
import ViewerFile from '../../file';
import Scene from '../../scene';
import W3xUnit from './unit';
import W3xDoodad from './doodad';
import W3xTilePoint from './tilepoint';

export default class W3xMap extends ViewerFile {
    /**
     * @param {ModelViewer} env
     * @param {function(?)} pathSolver
     * @param {Handler} handler
     * @param {string} extension
     */
    constructor(env, pathSolver, handler, extension) {
        super(env, pathSolver, handler, extension);

        this.scene = new Scene();
    }

    initialize(src) {
        let parser = new W3xParser(null, true); // Use readonly mode to reduce memory usage.

        if (!parser.load(src)) {
            this.onerror('InvalidSource');
            return false;
        }

        let environment = parser.readEnvironment(),
            doodads = parser.readDoodads(),
            units = parser.readUnits(),
            modifications = parser.readModifications();

        this.parser = parser;
        this.name = parser.name;
        this.mpq = parser.archive;

        this.doodads = [];
        this.units = [];

        let env = this.env;
        let internalPathSolver = this.internalPathSolver;
        let fileCache = new Map();

        this.fileCache = fileCache;

        // Loads files either from the map archive, or the game archives.
        // This is used for the tileset MPQ and all of the SLKs, since they can be overriden in the map.
        let mpqPathSolver = (path) => {
            // MPQ paths have backwards slashes...always? Don't know.
            let mpqPath = path.replace(/\//g, '\\');

            // If the file is in the map archive, return it.
            let file = this.mpq.get(mpqPath);
            if (file) {
                let extension = path.substr(path.lastIndexOf('.')),
                    data;

                if (extension === '.slk') {
                    data = file.text();
                } else {
                    data = file.arrayBuffer();
                }

                return [data, extension, false];
            }

            // Finally, try to get the file from the game archives.
            return this.pathSolver(path);
        };

        this.tileset = environment.tileset;
        this.tilesetMpq = env.load(environment.tileset + '.mpq', mpqPathSolver)

        fileCache.set('tileset', this.tilesetMpq);

        let paths = [
            'Doodads/Doodads.slk',
            'Doodads/DoodadMetaData.slk',
            'Units/DestructableData.slk',
            'Units/DestructableMetaData.slk',
            'Units/UnitData.slk',
            'Units/ItemData.slk',
            'Units/UnitMetaData.slk',
            'Units/unitUI.slk',
            'TerrainArt/Terrain.slk',
            'TerrainArt/CliffTypes.slk'];

        for (let path of paths) {
            let index1 = path.lastIndexOf('/') + 1,
                index2 = path.indexOf('.', index1),
                name = path.substring(index1, index2).toLowerCase();

            fileCache.set(name, env.load(path, mpqPathSolver));
        }

        // Loads files either from the map archive, the tilset archive, or the game archives.
        // This is used for of the map interal resources, such as models and textures.
        this.internalPathSolver = (path) => {
            // MPQ paths have backwards slashes...always? Don't know.
            let mpqPath = path.replace(/\//g, '\\');

            // If the file is in the map archive, return it.
            let file = this.mpq.get(mpqPath);
            if (file) {
                return [file.arrayBuffer(), path.substr(path.lastIndexOf('.')), false];
            }

            // If the file is in the tileset-specific archive, return it.
            file = this.tilesetMpq.get(mpqPath);
            if (file) {
                return [file.arrayBuffer(), path.substr(path.lastIndexOf('.')), false];
            }

            // Finally, try to get the file from the game archives.
            return this.pathSolver(path);
        };

        // Promise that there is a future load that the code cannot know about yet, so Viewer.whenAllLoaded() isn't called prematurely.
        let promise = this.env.makePromise();


        this.env.whenLoaded(fileCache.values(), () => {
            this.loadModifications(modifications);
            this.loadTerrain(environment);
            this.loadDoodads(doodads);
            this.loadUnits(units);

            // Resolve the promise
            promise.resolve();
        });

        return true;
    }

    loadFile(src) {
        return this.env.load(src, this.internalPathSolver);
    }

    // Doodads and destructables
    loadDoodads(doodadChunk) {
        for (let doodad of doodadChunk.doodads) {
            this.doodads.push(new W3xDoodad(this, doodad));
        }
    }

    // Units and items
    loadUnits(unitsChunk) {
        for (let unit of unitsChunk.units) {
            this.units.push(new W3xUnit(this, unit));
        }
    }

    heightAt(location) {
        var heightMap = this.heightMap,
            offset = this.offset,
            x = (location[0] / 128) + offset[0],
            y = (location[1] / 128) + offset[1];

        var minY = Math.floor(y),
            maxY = Math.ceil(y),
            minX = Math.floor(x),
            maxX = Math.ceil(x);

        // See if this coordinate is in the map
        if (maxY > 0 && minY < heightMap.length - 1 && maxX > 0 && minX < heightMap[0].length - 1) {
            // See http://gamedev.stackexchange.com/a/24574
            var triZ0 = heightMap[minY][minX],
                triZ1 = heightMap[minY][maxX],
                triZ2 = heightMap[maxY][minX],
                triZ3 = heightMap[maxY][maxX],
                sqX = x - minX,
                sqZ = y - minY,
                height;

            if ((sqX + sqZ) < 1) {
                height = triZ0 + (triZ1 - triZ0) * sqX + (triZ2 - triZ0) * sqZ;
            } else {
                height = triZ3 + (triZ1 - triZ3) * (1 - sqZ) + (triZ2 - triZ3) * (1 - sqX);
            }

            return height * 128;
        }

        return 0;
    }

    loadTerrain(environment) {
        let mapSize = environment.mapSize;
        let centerOffset = environment.centerOffset;
        let tilepoints = environment.tilepoints;
        let tileset = environment.tileset;

        this.mapSize = mapSize;
        this.offset = [-centerOffset[0] / 128, -centerOffset[1] / 128];
        this.tilepoints = [];

        for (let y = 0; y < mapSize[1]; y++) {
            this.tilepoints[y] = [];

            for (let x = 0; x < mapSize[0]; x++) {
                this.tilepoints[y][x] = new W3xTilePoint(tilepoints[y][x]);
            }
        }

        var slk = this.fileCache.get('terrain');

        this.tilesetTextures = [];

        var gl = this.env.gl;

        for (let groundTileset of environment.groundTilesets) {
            var row = slk.getRow(groundTileset);

            if (row) {
                this.tilesetTextures.push(this.loadFile(row.dir + '\\' + row.file + '.blp'));
            } else {
                this.tilesetTextures.push(null);
                console.warn('W3X: Failed to load a ground tileset texture, tileset: \'' + groundTileset + '\'');
            }
        }

        var tilesetToBlight = {
            A: 'Ashen',
            B: 'Barrens',
            C: 'Felwood',
            D: 'Dungeon',
            F: 'Lordf',
            G: 'G',
            I: 'Ice',
            J: 'DRuins',
            K: 'Citadel',
            L: 'Lords',
            N: 'North',
            O: 'Outland',
            Q: 'VillageFall',
            V: 'Village',
            W: 'Lordw',
            X: 'Lords', // Dalaran is what?
            Y: 'Lords', // Cityscape is what?
            Z: 'Ruins'
        };

        this.tilesetTextures.push(this.loadFile('TerrainArt\\Blight\\' + tilesetToBlight[tileset] + '_Blight.blp'));

        this.blightTextureIndex = environment.groundTilesets.length;

        let cliffSlk = this.fileCache.get('clifftypes');

        this.cliffs = [];
        this.cliffTextures = [];

        for (let cliffTileset of environment.cliffTilesets) {
            var row = cliffSlk.getRow(cliffTileset);

            if (row) {
                this.cliffs.push(row);
                this.cliffTextures.push(this.loadFile('ReplaceableTextures/Cliff/' + row.texFile + '.blp'));
            } else {
                this.cliffTextures.push(null);
                console.warn('W3X: Failed to load a cliff tileset texture, tileset: \'' + cliffTileset + '\'');
            }

        }

        this.cliffTexturesOffset = this.blightTextureIndex + 1;

        this.env.whenLoaded(this.tilesetTextures, () => {
            for (let texture of this.tilesetTextures) {
                // To avoid WebGL errors if a texture failed to load
                if (texture.loaded) {
                    gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
                    texture.setParameters(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);
                }
            }

            //this.loadSky();
            //this.loadWater();
            this.loadTerrainCliffs();
            this.loadTerrainGeometry();
        });
    }

    heightsToCliffTag(a, b, c, d) {
        const map = {
            0: 'A',
            1: 'B',
            2: 'C'
        };

        return map[a] + map[b] + map[c] + map[d];
    }

    prepareTilePoints() {
        var mapSize = this.mapSize;
        var tilepoints = this.tilepoints;
        var centerOffset = this.offset;

        for (var y = 0; y < mapSize[1]; y++) {
            for (var x = 0; x < mapSize[0]; x++) {
                var tile = tilepoints[y][x];
                var ltMask = 0, rtMask = 0, lbMask = 0, rbMask = 0;

                if (x > 0) {
                    tile.l = tilepoints[y][x - 1];
                    tile.dl = tile.layerHeight - tile.l.layerHeight;

                    if (tile.dl === 1) {
                        ltMask |= 1;
                        lbMask |= 4;
                    } else if (tile.dl === 2) {
                        ltMask |= 8;
                        lbMask |= 32;
                    }
                }

                if (x < mapSize[0] - 1) {
                    tile.r = tilepoints[y][x + 1];
                    tile.dr = tile.layerHeight - tile.r.layerHeight;

                    if (tile.dr === 1) {
                        rtMask |= 4;
                        rbMask |= 1;
                    } else if (tile.dr === 2) {
                        rtMask |= 32;
                        rbMask |= 8;
                    }
                }

                if (y > 0) {
                    tile.b = tilepoints[y - 1][x];
                    tile.db = tile.layerHeight - tile.b.layerHeight;

                    if (tile.db === 1) {
                        lbMask |= 1;
                        rbMask |= 4;
                    } else if (tile.db === 2) {
                        lbMask |= 8;
                        rbMask |= 32;
                    }
                }

                if (y < mapSize[1] - 1) {
                    tile.t = tilepoints[y + 1][x];
                    tile.dt = tile.layerHeight - tile.t.layerHeight;

                    if (tile.dt === 1) {
                        ltMask |= 4;
                        rtMask |= 1;
                    } else if (tile.dt === 2) {
                        ltMask |= 32;
                        rtMask |= 8;
                    }
                }

                if (x > 0 && y > 0) {
                    tile.lb = tilepoints[y - 1][x - 1];
                    tile.dlb = tile.layerHeight - tile.lb.layerHeight;

                    if (tile.dlb === 1) {
                        lbMask |= 2;
                    } else if (tile.dlb === 2) {
                        lbMask |= 16;
                    }
                }

                if (x < mapSize[0] - 1 && y > 0) {
                    tile.rb = tilepoints[y - 1][x + 1];
                    tile.drb = tile.layerHeight - tile.rb.layerHeight;

                    if (tile.drb === 1) {
                        rbMask |= 2;
                    } else if (tile.drb === 2) {
                        rbMask |= 16;
                    }
                }

                if (x > 0 && y < mapSize[1] - 1) {
                    tile.lt = tilepoints[y + 1][x - 1];
                    tile.dlt = tile.layerHeight - tile.lt.layerHeight;

                    if (tile.dlt === 1) {
                        ltMask |= 2;
                    } else if (tile.dlt === 2) {
                        ltMask |= 16;
                    }
                }

                if (x < mapSize[0] - 1 && y < mapSize[1] - 1) {
                    tile.rt = tilepoints[y + 1][x + 1];
                    tile.drt = tile.layerHeight - tile.rt.layerHeight;

                    if (tile.drt === 1) {
                        rtMask |= 2;
                    } else if (tile.drt === 2) {
                        rtMask |= 16;
                    }
                }

                // TODO: Do I need to check all 8 surrounding tiles, or are the straight ones enough?
                let locX = (x - centerOffset[0]) * 128,
                    locY = (y - centerOffset[1]) * 128,
                    locZ = tile.getCliffHeight(Math.max(tile.dl || 0, tile.dr || 0, tile.dt || 0, tile.db || 0)) * 128;

                tile.x = locX;
                tile.y = locY;
                tile.z = locZ;

                if ((lbMask | ltMask | rtMask | rbMask) > 0) {
                    tile.cliff = true;
                    tile.lbMask = lbMask;
                    tile.ltMask = ltMask;
                    tile.rtMask = rtMask;
                    tile.rbMask = rbMask;
                }
            }
        }
    }

    update() {
        /*
        if (this.waterInstance) {
            this.BLAAA += 1;

            if (this.BLAAA === 10) {
                this.BLAAA = 0;
                this.waterCounter += 1;

            }
            

            if (this.waterCounter === 44) {
                this.waterCounter = 0;
            }

            let x = this.waterCounter % 8,
                y = Math.floor(this.waterCounter / 8),
                uvOffset = this.waterInstance.model.uvOffset;

            uvOffset[0] = x / 8;
            uvOffset[1] = y / 8;
        }
        */
    }

    loadWater() {
        this.BLAAA = 0;

        var mapSize = this.mapSize;
        var tilepoints = this.tilepoints;
        var centerOffset = this.offset;

        let vertices = [],
            uvs = [],
            edges = [],
            faces = [],
            base = 0;

        for (var y = 0; y < mapSize[1] - 1; y++) {
            for (var x = 0; x < mapSize[0] - 1; x++) {
                var tile1 = tilepoints[y][x],
                    tile2 = tilepoints[y + 1][x],
                    tile3 = tilepoints[y + 1][x + 1],
                    tile4 = tilepoints[y][x + 1];


                if ((tile1.water || tile2.water || tile3.water || tile4.water)) {
                    //let z = Math.min(tile1.getWaterHeight(), tile2.getWaterHeight(), tile3.getWaterHeight(), tile4.getWaterHeight()) + 0.25;
                    let z = ((tile1.waterLevel - 0x2000) / 4 - 89.6) / 128;

                    faces.push(base, base + 1, base + 2, base, base + 2, base + 3);
                    edges.push(base, base + 1, base + 1, base + 2, base + 2, base + 3, base + 3, base);
                    vertices.push(x, y, z, x, y + 1, z, x + 1, y + 1, z, x + 1, y, z);
                    uvs.push(0, 0, 0, 1, 1, 1, 1, 0);

                    base += 4;
                }
            }
        }

        let textures = [],
            n;

        for (let i = 0; i < 45; i++) {
            n = (i < 10) ? '0' + i : '' + i;

            textures[i] = this.loadFile('Textures/Water' + n + '-0.blp');
            //textures[i] = this.loadFile('Textures/Water' + n + '.blp');
            //textures[i] = this.loadFile('ReplaceableTextures/Water/N_Water' + n + '.blp');
        }

        this.env.whenLoaded(textures, () => {
            var images = [];

            for (var i = 0, l = textures.length; i < l; i++) {
                images[i] = textures[i].imageData;
            }

            var atlasData = createTextureAtlas(images);

            var texture = this.env.load(atlasData.texture);

            var gl = this.env.gl;
            gl.bindTexture(gl.TEXTURE_2D, texture.webglResource);
            texture.setParameters(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.LINEAR, gl.LINEAR);

            var model = this.env.load({
                geometry: { vertices: new Float32Array(vertices), uvs: new Float32Array(uvs), faces: new Uint16Array(faces), edges: new Float32Array(edges) },
                material: { renderMode: 0, twoSided: true, alpha: 0.5, texture: texture, isBGR: true, isBlended: true }
            }, src => [src, '.geo', false]);
            var instance = model.addInstance();
            instance.setUniformScale(128).setLocation([-centerOffset[0] * 128, -centerOffset[1] * 128, 0]);
            instance.noCulling = true;

            this.waterInstance = instance;

            this.scene.addInstance(instance);

            model.uvScale[0] = model.uvScale[1] = 1 / 8;

            this.waterCounter = 0;
            this.BLAAA = 0;
        });
    }

    loadSky() {
        let model = this.loadFile('Environment/Sky/LordaeronSummerSky/LordaeronSummerSky.mdx'),
            instance = model.addInstance().uniformScale(3);

        instance.noCulling = true;

        this.scene.addInstance(instance);

        instance.whenLoaded(() => {
            instance.bucket.priority = 200;
            this.scene.sortBuckets();
        });
    }

    loadTerrainCliffs() {
        this.prepareTilePoints();

        var cliffs = this.cliffs;
        var mapSize = this.mapSize;
        var tilepoints = this.tilepoints;

        /*
        var unitCube = this.env.load({
            geometry: geometry.createUnitCube(),
            material: { renderMode: 0, color: [1, 1, 1], twoSided: true }
        }, src =>[src, '.geo', false]);
        //*/

        let cliffVariationMap = {
            AAAB: 1,
            AAAC: 1,
            AABA: 1,
            AABB: 2,
            AABC: 0,
            AACA: 1,
            AACB: 0,
            AACC: 1,
            ABAA: 1,
            ABAB: 1,
            ABAC: 0,
            ABBA: 2,
            ABBB: 1,
            ABBC: 0,
            ABCA: 0,
            ABCB: 0,
            ABCC: 0,
            ACAA: 1,
            ACAB: 0,
            ACAC: 1,
            ACBA: 0,
            ACBB: 0,
            ACBC: 0,
            ACCA: 1,
            ACCB: 0,
            ACCC: 1,
            BAAA: 1,
            BAAB: 1,
            BAAC: 0,
            BABA: 1,
            BABB: 1,
            BABC: 0,
            BACA: 0,
            BACB: 0,
            BACC: 0,
            BBAA: 1,
            BBAB: 1,
            BBAC: 0,
            BBBA: 1,
            BBCA: 0,
            BCAA: 0,
            BCAB: 0,
            BCAC: 0,
            BCBA: 0,
            BCCA: 0,
            CAAA: 1,
            CAAB: 0,
            CAAC: 1,
            CABA: 0,
            CABB: 0,
            CABC: 0,
            CACA: 1,
            CACB: 0,
            CACC: 1,
            CBAA: 0,
            CBAB: 0,
            CBAC: 0,
            CBBA: 0,
            CBCA: 0,
            CCAA: 1,
            CCAB: 0,
            CCAC: 1,
            CCBA: 0,
            CCCA: 1
        };

        let cityCliffVariationMap = {
            AAAB: 2,
            AAAC: 1,
            AABA: 1,
            AABB: 3,
            AABC: 0,
            AACA: 1,
            AACB: 0,
            AACC: 3,
            ABAA: 1,
            ABAB: 2,
            ABAC: 0,
            ABBA: 3,
            ABBB: 0,
            ABBC: 0,
            ABCA: 0,
            ABCB: 0,
            ABCC: 0,
            ACAA: 1,
            ACAB: 0,
            ACAC: 2,
            ACBA: 0,
            ACBB: 0,
            ACBC: 0,
            ACCA: 3,
            ACCB: 0,
            ACCC: 1,
            BAAA: 1,
            BAAB: 3,
            BAAC: 0,
            BABA: 2,
            BABB: 0,
            BABC: 0,
            BACA: 0,
            BACB: 0,
            BACC: 0,
            BBAA: 3,
            BBAB: 1,
            BBAC: 0,
            BBBA: 1,
            BBCA: 0,
            BCAA: 0,
            BCAB: 0,
            BCAC: 0,
            BCBA: 0,
            BCCA: 0,
            CAAA: 1,
            CAAB: 0,
            CAAC: 3,
            CABA: 0,
            CABB: 0,
            CABC: 0,
            CACA: 2,
            CACB: 0,
            CACC: 1,
            CBAA: 0,
            CBAB: 0,
            CBAC: 0,
            CBBA: 0,
            CBCA: 0,
            CCAA: 3,
            CCAB: 0,
            CCAC: 1,
            CCBA: 0,
            CCCA: 1
        };

        function tryVariation(dir, tag, variation) {
            let maxVariation = -1;

            if (dir === 'Cliffs') {
                maxVariation = cliffVariationMap[tag];
            } else {
                maxVariation = cityCliffVariationMap[tag];
            }

            if (variation > maxVariation) {
                return 0;
            }

            return variation;
        }

        for (var y = 0; y < mapSize[1]; y++) {
            for (var x = 0; x < mapSize[0]; x++) {
                var tile = tilepoints[y][x];

                /*
                if (tile.cliffTextureType === 0) {
                    let bla = unitCube.addInstance().setColor([255, 0, 0]).setLocation([tile.x, tile.y, tile.z + 128]).uniformScale(32);
                    this.scene.addInstance(bla);
                }

                if (tile.cliffTextureType === 1) {
                    let bla = unitCube.addInstance().setColor([0, 255, 0]).setLocation([tile.x, tile.y, tile.z + 128]).uniformScale(32);
                    this.scene.addInstance(bla);
                }

                if (tile.cliffTextureType === 15) {
                    let bla = unitCube.addInstance().setColor([0, 0, 255]).setLocation([tile.x, tile.y, tile.z + 128]).uniformScale(32);
                    this.scene.addInstance(bla);
                }
                */
                //if (!tile.cliff) {
                //unitCube.addInstance().setColor([1, 0, 0]).setLocation([tile.x, tile.y, tile.z + 128]).uniformScale(16);
                //} else {
                //unitCube.addInstance().setColor([0, 1, 0]).setLocation([tile.x, tile.y, tile.z + 128]).uniformScale(16);
                //}

                //if (x === 13 && y === 12) {
                //unitCube.addInstance().setColor([0, 0, 1]).setLocation([tile.x, tile.y, tile.z]).uniformScale(32);
                //console.log(tile)
                //}

                if (tile.cliff) {
                    let variation = tile.variation;
                    let cliffVariation = tile.cliffVariation;

                    let ltMask = tile.ltMask;
                    let rtMask = tile.rtMask;
                    let rbMask = tile.rbMask;
                    let lbMask = tile.lbMask;
                    let tag, supportedMask;

                    let cliffTextureType = tile.cliffTextureType;
                    let texture = this.cliffTextures[cliffTextureType];

                    if (cliffTextureType > cliffs.length - 1) {
                        console.warn('W3x: Unknown cliff texture type: Number of cliff types is', cliffs.length, 'given', cliffTextureType);
                        cliffTextureType = 0;
                    }

                    let cliff = cliffs[cliffTextureType];
                    let dir = cliff.cliffModelDir;

                    if (ltMask) {
                        supportedMask = true;

                        switch (ltMask) {
                            // Left wall
                            // 0 T
                            // 0 C
                            case 3:
                            case 24:
                                tag = this.heightsToCliffTag(0, 0, tile.dlt, tile.dlt);
                                break;

                            // ???
                            // T 0
                            // T C
                            case 4:
                                tag = this.heightsToCliffTag(1, 1, 0, 1);
                                break;

                            // Diagonal connection
                            // T 0
                            // 0 C
                            case 5:
                                tag = this.heightsToCliffTag(0, 1, 0, 1);
                                break;

                            // T T
                            // 0 C
                            case 8:
                                tag = this.heightsToCliffTag(0, 2, 2, 2);
                                break;

                            // Left-top corner
                            // 0 0
                            // 0 C
                            case 7: // Low
                            case 56: // High
                                tag = this.heightsToCliffTag(0, 0, 0, tile.dlt);
                                break;

                            // 1 0
                            // 1 C
                            case 32:
                                tag = this.heightsToCliffTag(2, 2, 0, 2);
                                break;

                            case 40:
                                tag = this.heightsToCliffTag(0, 2, 0, 2);
                                break;

                            default:
                                supportedMask = false;
                        }

                        if (supportedMask) {
                            let model = this.loadFile('Doodads/Terrain/' + dir + '/' + dir + tag + tryVariation(dir, tag, cliffVariation) + '.mdx'),
                                instance = model.addInstance().setLocation([tile.x, tile.y, tile.z]);

                            model.whenLoaded(() => model.textures[0] = texture);

                            this.scene.addInstance(instance);
                        } else {
                            //let instance = unitCube.addInstance().setVertexColor([255, 0, 0, 255]).setLocation([tile.x, tile.y, tile.z]).setScale([10, 10, 300]);
                            //this.scene.addInstance(instance);

                            //console.warn('W3x: Unsupported LT cliff mask', ltMask);
                        }
                    }

                    if (rtMask) {
                        supportedMask = true;

                        switch (rtMask) {
                            // ???
                            // 0 T
                            // C T
                            case 1:
                                tag = this.heightsToCliffTag(1, 0, 1, 1);
                                break;

                            // Top wall
                            // 0 0
                            // C T
                            case 3:
                            case 24:
                                tag = this.heightsToCliffTag(tile.drt, 0, 0, tile.drt);
                                break;

                            // 0 T
                            // C T
                            case 8:
                                tag = this.heightsToCliffTag(2, 0, 2, 2);
                                break;

                            // Diagonal connection
                            // 0 T
                            // C 0
                            case 5:
                                tag = this.heightsToCliffTag(1, 0, 1, 0);
                                break;

                            case 40:
                                tag = this.heightsToCliffTag(2, 0, 2, 0);
                                break;

                            // Diagonal 2 to 1
                            case 42:
                                tag = this.heightsToCliffTag(2, 0, 1, 0);
                                break;

                            // Right-top corner
                            // 0 0
                            // 0 C
                            case 7:
                            case 56:
                                tag = this.heightsToCliffTag(tile.drt, 0, 0, 0);
                                break;

                            // Right wall
                            // T 0
                            // C 0
                            case 6:
                                tag = this.heightsToCliffTag(1, 1, 0, 0);
                                break;

                            // Right wall high
                            // T 0
                            // C 0
                            case 48:
                                tag = this.heightsToCliffTag(2, 2, 0, 0);
                                break;

                            default:
                                supportedMask = false;
                        }

                        if (supportedMask) {
                            let model = this.loadFile('Doodads/Terrain/' + dir + '/' + dir + tag + tryVariation(dir, tag, cliffVariation) + '.mdx'),
                                instance = model.addInstance().setLocation([tile.x + 128, tile.y, tile.z]);

                            model.whenLoaded(() => model.textures[0] = texture);

                            this.scene.addInstance(instance);
                        } else {
                            //console.warn('W3x: Unsupported RT cliff mask', rtMask);
                        }
                    }

                    if (rbMask) {
                        supportedMask = true;

                        switch (rbMask) {
                            // ???
                            // C T
                            // 0 T
                            case 4:
                                tag = this.heightsToCliffTag(0, 1, 1, 1);
                                break;

                            // Right-bottom corner
                            // C 0
                            // 0 0
                            case 7:
                            case 56:
                                tag = this.heightsToCliffTag(0, tile.drb, 0, 0);
                                break;

                            // High - Low ???
                            case 28:
                                tag = this.heightsToCliffTag(0, 2, 0, 1);
                                break;

                            default:
                                supportedMask = false;
                        }

                        if (supportedMask) {
                            let model = this.loadFile('Doodads/Terrain/' + dir + '/' + dir + tag + tryVariation(dir, tag, cliffVariation) + '.mdx'),
                                instance = model.addInstance().setLocation([tile.x + 128, tile.y - 128, tile.z]);

                            model.whenLoaded(() => model.textures[0] = texture);

                            this.scene.addInstance(instance);
                        } else {
                            //console.warn('W3x: Unsupported RB cliff mask', rbMask);
                        }
                    }

                    if (lbMask) {
                        supportedMask = true;

                        switch (lbMask) {
                            // ???
                            // T C
                            // T 0
                            case 1:
                                tag = this.heightsToCliffTag(1, 1, 1, 0);
                                break;

                            // ??? high
                            // T C
                            // T 0
                            case 8:
                                tag = this.heightsToCliffTag(2, 2, 2, 0);
                                break;

                            // Bottom-wall
                            // T C
                            // 0 0
                            case 3:
                                tag = this.heightsToCliffTag(0, 1, 1, 0);
                                break;

                            // Bottom-wall high
                            case 24:
                                tag = this.heightsToCliffTag(0, 2, 2, 0);
                                break;


                            // Left-bottom corner
                            // 0 C
                            // 0 0
                            case 7:
                            case 56:
                                tag = this.heightsToCliffTag(0, 0, tile.dlb, 0);
                                break;

                            // Some diagonal...
                            case 40:
                                tag = this.heightsToCliffTag(2, 0, 2, 0);
                                break;

                            // High - Low ???
                            case 49:
                                tag = this.heightsToCliffTag(0, 0, 2, 1);
                                break;

                            default:
                                supportedMask = false;
                        }

                        if (supportedMask) {
                            let model = this.loadFile('Doodads/Terrain/' + dir + '/' + dir + tag + tryVariation(dir, tag, cliffVariation) + '.mdx'),
                                instance = model.addInstance().setLocation([tile.x, tile.y - 128, tile.z]);

                            model.whenLoaded(() => model.textures[0] = texture);

                            this.scene.addInstance(instance);
                        } else {
                            //console.warn('W3x: Unsupported LB cliff mask', lbMask);
                        }
                    }
                }
            }
        }
    }

    getTileVariation(variation, isExtended) {
        if (isExtended) {
            switch (variation) {
                case 0: return [4, 0]
                case 1: return [5, 0]
                case 2: return [6, 0]
                case 3: return [7, 0]
                case 4: return [4, 1]
                case 5: return [5, 1]
                case 6: return [6, 1]
                case 7: return [7, 1]
                case 8: return [4, 2]
                case 9: return [5, 2]
                case 10: return [6, 2]
                case 11: return [7, 2]
                case 12: return [4, 3]
                case 13: return [5, 3]
                case 14: return [6, 3]
                case 15: return [7, 3]
                case 16: return [3, 3]
                case 17: return [0, 0]
                default: /*console.log('Unknown tile variation ' + variation);*/ return [0, 0]
            }
        } else {
            if (variation === 1) {
                return [3, 3];
            } else {
                return [0, 0];
            }
        }
    }

    loadTerrainGeometry() {
        var tilesetTextures = this.tilesetTextures;
        var mapSize = this.mapSize;
        var tilepoints = this.tilepoints;
        var centerOffset = this.offset;

        var vertices = {};
        var uvs = {};
        var faces = {};
        var edges = {};

        var blightTextureIndex = this.blightTextureIndex;

        for (var y = 0; y < mapSize[1] - 1; y++) {
            for (var x = 0; x < mapSize[0] - 1; x++) {
                var tile1 = tilepoints[y][x],
                    tile2 = tilepoints[y + 1][x],
                    tile3 = tilepoints[y + 1][x + 1],
                    tile4 = tilepoints[y][x + 1],
                    texture1 = tile1.blight ? blightTextureIndex : tile1.groundTextureType,
                    texture2 = tile2.blight ? blightTextureIndex : tile2.groundTextureType,
                    texture3 = tile3.blight ? blightTextureIndex : tile3.groundTextureType,
                    texture4 = tile4.blight ? blightTextureIndex : tile4.groundTextureType;

                //if (tile1.cliff || tile2.cliff || tile3.cliff || tile4.cliff) continue;

                var textures = unique([texture1, texture2, texture3, texture4]);

                for (var texture = 0; texture < textures.length; texture++) {
                    var t = textures[texture];

                    if (!vertices[t]) {
                        vertices[t] = [];
                        uvs[t] = [];
                        faces[t] = [];
                        edges[t] = [];
                    }

                    var base = vertices[t].length / 3;

                    faces[t].push(base, base + 1, base + 2, base, base + 2, base + 3);
                    edges[t].push(base, base + 1, base + 1, base + 2, base + 2, base + 3, base + 3, base);
                    vertices[t].push(x, y, tile1.getHeight(), x, y + 1, tile2.getHeight(), x + 1, y + 1, tile3.getHeight(), x + 1, y, tile4.getHeight());

                    var extended = (tilesetTextures[t].width === 512);
                    var width = extended ? 1 / 8 : 1 / 4;
                    var height = 1 / 4;
                    var offsetX = 0;
                    var offsetY = 0;

                    //let bits = (((t === texture1) << 0) + ((t === texture2) << 1) + ((t === texture3) << 2) + ((t === texture4) << 3));

                    // The following set of conditions picks which tile this is, by checking the textures used by the four tilepoints

                    // 1 1
                    // 1 1
                    if (t === texture1 && t === texture2 && t === texture3 && t === texture4) {
                        let variation = this.getTileVariation(tile1.variation, extended)

                        offsetX = variation[0];
                        offsetY = variation[1];
                        // 1 1
                        // 1 0
                    } else if (t === texture1 && t === texture2 && t === texture3) {
                        if (t > texture4) {
                            offsetX = 2;
                            offsetY = 3;
                        }
                        // 1 1
                        // 0 1
                    } else if (t === texture2 && t === texture3 && t === texture4) {
                        if (t > texture1) {
                            offsetX = 1;
                            offsetY = 3;
                        }
                        // 0 1
                        // 1 1
                    } else if (t === texture3 && t === texture4 && t === texture1) {
                        if (t > texture2) {
                            offsetX = 3;
                            offsetY = 1;
                        }
                        // 1 0
                        // 1 1
                    } else if (t === texture4 && t === texture1 && t === texture2) {
                        if (t > texture3) {
                            offsetX = 3;
                            offsetY = 2;
                        }
                        // 1 0
                        // 1 0
                    } else if (t === texture1 && t === texture2) {
                        if (t > texture3 || t > texture4) {
                            offsetX = 2;
                            offsetY = 2;
                        }
                        // 1 1
                        // 0 0
                    } else if (t === texture2 && t === texture3) {
                        if (t > texture1 || t > texture4) {
                            offsetX = 0;
                            offsetY = 3;
                        }
                        // 0 1
                        // 0 1
                    } else if (t === texture3 && t === texture4) {
                        if (t > texture1 || t > texture2) {
                            offsetX = 1;
                            offsetY = 1;
                        }
                        // 0 0
                        // 1 1
                    } else if (t === texture4 && t === texture1) {
                        if (t > texture2 || t > texture3) {
                            offsetX = 3;
                            offsetY = 0;
                        }
                        // 0 1
                        // 1 0
                    } else if (t === texture1 && t === texture3) {
                        if (t > texture2 || t > texture4) {
                            offsetX = 2;
                            offsetY = 1;
                        }
                        // 1 0
                        // 0 1
                    } else if (t === texture2 && t === texture4) {
                        if (t > texture1 || t > texture3) {
                            offsetX = 1;
                            offsetY = 2;
                        }
                        // 0 0
                        // 1 0
                    } else if (t === texture1) {
                        if (t > texture2 || t > texture3 || t > texture4) {
                            offsetX = 2;
                            offsetY = 0;
                        }
                        // 1 0
                        // 0 0
                    } else if (t === texture2) {
                        if (t > texture1 || t > texture3 || t > texture4) {
                            offsetX = 0;
                            offsetY = 2;
                        }
                        // 0 1
                        // 0 0
                    } else if (t === texture3) {
                        if (t > texture1 || t > texture2 || t > texture4) {
                            offsetX = 0;
                            offsetY = 1;
                        }
                        // 0 0
                        // 0 1
                    } else if (t === texture4) {
                        if (t > texture1 || t > texture2 || t > texture3) {
                            offsetX = 1;
                            offsetY = 0;
                        }
                    }

                    offsetX *= width;
                    offsetY *= height;

                    // pixel correction, to avoid bleeding
                    var pixelSizeX = 1 / tilesetTextures[t].width;
                    var pixelSizeY = 1 / tilesetTextures[t].height;
                    offsetX += pixelSizeX;
                    offsetY += pixelSizeY;
                    width -= 2 * pixelSizeX;
                    height -= 2 * pixelSizeY;

                    uvs[t].push(offsetX, offsetY + height, offsetX, offsetY, offsetX + width, offsetY, offsetX + width, offsetY + height);
                }
            }
        }

        for (var i = 0, l = tilesetTextures.length; i < l; i++) {
            if (vertices[i]) {
                var v = new Float32Array(vertices[i]),
                    u = new Float32Array(uvs[i]),
                    f = new Uint32Array(faces[i]),
                    e = new Uint32Array(edges[i]),
                    t = tilesetTextures[i];

                var terrainModel = this.env.load({
                    geometry: { vertices: v, uvs: u, faces: f, edges: e },
                    material: { renderMode: 0, twoSided: true, texture: t, isBGR: true, isBlended: true }
                }, src => [src, '.geo', false]);
                var instance = terrainModel.addInstance();
                instance.setUniformScale(128).setLocation([-centerOffset[0] * 128, -centerOffset[1] * 128, 0]);
                instance.noCulling = true;

                this.scene.addInstance(instance);

                instance.whenLoaded(() => {
                    instance.bucket.priority = 100 - i;
                    this.scene.sortBuckets();
                });
            }
        }
    }

    loadModifications(modifications) {
        let fileCache = this.fileCache,
            modification;

        if (modifications.has('doodads')) {
            this.loadModification(modifications.get('doodads'), fileCache.get('doodads'), fileCache.get('doodadmetadata'));
        }

        if (modifications.has('destructables')) {
            this.loadModification(modifications.get('destructables'), fileCache.get('destructabledata'), fileCache.get('destructablemetadata'));
        }

        if (modifications.has('units')) {
            this.loadModification(modifications.get('units'), fileCache.get('unitdata'), fileCache.get('unitmetadata'));
        }
    }

    loadModification(modification, dataTable, metadataTable) {
        // Modifications to built-in objects
        this.applyModificationTable(modification.originalTable, dataTable, metadataTable);

        // Declarations of user-defined objects
        this.applyModificationTable(modification.customTable, dataTable, metadataTable);
    }

    applyModificationTable(modificationTable, dataTable, metadataTable) {
        var modifications = modificationTable.objects;

        for (var i = 0, l = modifications.length; i < l; i++) {
            this.applyModificationObject(modifications[i], dataTable, metadataTable);
        }
    }

    applyModificationObject(modification, dataTable, metadataTable) {
        var row = dataTable.getRow(modification.oldID);

        if (row) {
            if (modification.newID !== '') {
                if (dataTable.map[modification.oldID]) {
                    let newRow = Object.assign({}, row);

                    newRow.customRow = true;
                    newRow.customID = modification.newID;

                    row = dataTable.map[modification.newID.toLowerCase()] = newRow;
                }
            }

            var modifications = modification.modifications

            for (var i = 0, l = modifications.length; i < l; i++) {
                this.applyModification(modifications[i], row, metadataTable);
            }
        } else {
            console.warn('W3xMap: Undefined row for modification', modification);
        }
    }

    applyModification(modification, row, metadataTable) {
        var metadata = metadataTable.map[modification.id];

        if (metadata) {
            row[metadata.field] = modification.value;
        } else {
            console.warn('Unknown modification ID', modification.id);
        }
    }
};
