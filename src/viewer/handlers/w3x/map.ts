import { vec3 } from 'gl-matrix';
import unique from '../../../common/arrayunique';
import War3Map from '../../../parsers/w3x/map';
import War3MapW3i from '../../../parsers/w3x/w3i/file';
import War3MapW3e from '../../../parsers/w3x/w3e/file';
import Corner from '../../../parsers/w3x/w3e/corner';
import War3MapW3u from '../../../parsers/w3x/w3u/file';
import War3MapW3d from '../../../parsers/w3x/w3d/file';
import ModificationTable from '../../../parsers/w3x/w3u/modificationtable';
import { MappedData, MappedDataRow } from '../../../utils/mappeddata';
import Scene from '../../scene';
import Grid from '../../grid';
import { PathSolver } from '../../handlerresource';
import Texture from '../../texture';
import MdxModel from '../mdx/model';
import getCliffVariation from './variations';
import TerrainModel from './terrainmodel';
import Unit from './unit';
import Doodad from './doodad';
import TerrainDoodad from './terraindoodad';
import War3MapViewer from './viewer';
import War3MapDoo from '../../../parsers/w3x/doo/file';
import War3MapUnitsDoo from '../../../parsers/w3x/unitsdoo/file';
import { Resource } from '../../resource';

const normalHeap1 = vec3.create();
const normalHeap2 = vec3.create();

export default class War3MapViewerMap {
  viewer: War3MapViewer;
  map: War3Map;
  pathSolver: PathSolver;
  buildVersion = 0;
  solverParams: { tileset: string, reforged?: boolean, hd?: boolean } = { tileset: 'a' };
  worldScene: Scene;
  waterIndex = 0;
  waterIncreasePerFrame = 0;
  waterHeightOffset = 0;
  waterTextures: Texture[] = [];
  maxDeepColor = new Float32Array(4);
  minDeepColor = new Float32Array(4);
  maxShallowColor = new Float32Array(4);
  minShallowColor = new Float32Array(4);
  anyReady = false;
  terrainReady = false;
  cliffsReady = false;
  doodads: Doodad[] = [];
  terrainDoodads: TerrainDoodad[] = [];
  doodadsReady = false;
  units: Unit[] = [];
  unitsReady = false;
  tilesetTextures: Texture[] = [];
  cliffTextures: Texture[] = [];
  cliffModels: TerrainModel[] = [];
  corners: Corner[][] = [];
  centerOffset = new Float32Array(2);
  mapSize = new Int32Array(2);
  tilesets: MappedDataRow[] = [];
  blightTextureIndex = -1;
  cliffTilesets: MappedDataRow[] = [];
  columns = 0;
  rows = 0;
  vertexBuffer: WebGLBuffer | null = null;
  faceBuffer: WebGLBuffer | null = null;
  instanceBuffer: WebGLBuffer | null = null;
  textureBuffer: WebGLBuffer | null = null;
  variationBuffer: WebGLBuffer | null = null;
  waterBuffer: WebGLBuffer | null = null;
  heightMap: WebGLTexture | null = null;
  waterHeightMap: WebGLTexture | null = null;
  cliffHeightMap: WebGLTexture | null = null;

  constructor(viewer: War3MapViewer, buffer: ArrayBuffer | Uint8Array) {
    this.viewer = viewer;
    this.worldScene = viewer.addScene();

    this.map = new War3Map();

    // Readonly mode to optimize memory usage.
    this.map.load(buffer, true);

    this.loadMapInformation();

    this.pathSolver = (src, params): unknown => {
      // The type won't be a string for loads from memory, where the final source is the input source.
      // The primitive constructor is one example of this.
      if (typeof src === 'string') {
        // MPQ paths have backwards slashes...always? Don't know.
        const path = src.replace(/\//g, '\\');

        // If the file is in the map, return it.
        const file = this.map.get(path);

        if (file) {
          return file.arrayBuffer();
        }

        // Try to get the file from the server.
        return viewer.wc3PathSolver(src, params);
      }

      return src;
    };

    this.loadTerrainCliffsAndWater();

    // Global tables like WC3. It's bad.
    const modifications = this.map.readModifications();
    this.applyModificationFile(viewer.doodadsData, viewer.doodadMetaData, modifications.w3d);
    this.applyModificationFile(viewer.doodadsData, viewer.destructableMetaData, modifications.w3b);
    this.applyModificationFile(viewer.unitsData, viewer.unitMetaData, modifications.w3u);
    this.applyModificationFile(viewer.unitsData, viewer.unitMetaData, modifications.w3t);

    this.loadDoodadsAndDestructibles();
    this.loadUnitsAndItems();
  }

  die(): void {
    this.worldScene.detach();
  }

  load(src: unknown): Promise<Resource | undefined> {
    return this.viewer.load(src, this.pathSolver, this.solverParams);
  }

  loadMapInformation(): void {
    const mpqFile = this.map.get('war3map.w3i');

    if (!mpqFile) {
      console.warn('Attempted to load war3map.w3i but it is not there. Using default tileset A.');
      return;
    }

    const parser = new War3MapW3i();

    try {
      parser.load(mpqFile.bytes());
    } catch (e) {
      console.warn('Failed to correctly parse the map information file');
    }

    this.solverParams.tileset = parser.tileset.toLowerCase();

    this.buildVersion = parser.getBuildVersion();

    if (this.buildVersion > 131) {
      this.solverParams.reforged = true;
    }
  }

  async loadTerrainCliffsAndWater(): Promise<void> {
    const mpqFile = this.map.get('war3map.w3e');

    if (!mpqFile) {
      console.warn('Attempted to load war3map.w3e, but it is not there.');
      return;
    }

    const parser = new War3MapW3e();

    try {
      parser.load(mpqFile.bytes());
    } catch (e) {
      console.warn(`Failed to load war3map.w3e: ${e}`);
      return;
    }

    const viewer = this.viewer;
    const centerOffset = parser.centerOffset;
    const mapSize = parser.mapSize;

    this.corners = parser.corners;
    this.centerOffset.set(centerOffset);
    this.mapSize.set(mapSize);

    // Override the grid based on the map.
    this.worldScene.grid = new Grid(centerOffset[0], centerOffset[1], mapSize[0] * 128 - 128, mapSize[1] * 128 - 128, 16 * 128, 16 * 128);

    const texturesExt = this.solverParams.reforged ? '.dds' : '.blp';
    const tileset = parser.tileset;

    const tilesetTextures = [];
    const cliffTextures = [];
    const waterTextures = [];

    for (const groundTileset of parser.groundTilesets) {
      const row = <MappedDataRow>viewer.terrainData.getRow(groundTileset);

      this.tilesets.push(row);
      
      tilesetTextures.push(this.load(`${row.string('dir')}\\${row.string('file')}${texturesExt}`));
    }

    const blights = {
      A: 'Ashen',
      B: 'Barrens',
      C: 'Felwood',
      D: 'Cave',
      F: 'Lordf',
      G: 'Dungeon',
      I: 'Ice',
      J: 'DRuins',
      K: 'Citadel',
      L: 'Lords',
      N: 'North',
      O: 'Outland',
      Q: 'VillageFall',
      V: 'Village',
      W: 'Lordw',
      X: 'Village',
      Y: 'Village',
      Z: 'Ruins',
    };

    this.blightTextureIndex = this.tilesetTextures.length;
    tilesetTextures.push(this.load(`TerrainArt\\Blight\\${blights[tileset]}_Blight${texturesExt}`));

    for (const cliffTileset of parser.cliffTilesets) {
      const row = <MappedDataRow>viewer.cliffTypesData.getRow(cliffTileset);

      this.cliffTilesets.push(row);
      cliffTextures.push(this.load(`${row.string('texDir')}\\${row.string('texFile')}${texturesExt}`));
    }

    const waterRow = <MappedDataRow>viewer.waterData.getRow(`${tileset}Sha`);

    this.waterHeightOffset = waterRow.number('height');
    this.waterIncreasePerFrame = waterRow.number('texRate') / 60;
    this.waterTextures.length = 0;
    this.maxDeepColor.set([waterRow.number('Dmax_R'), waterRow.number('Dmax_G'), waterRow.number('Dmax_B'), waterRow.number('Dmax_A')]);
    this.minDeepColor.set([waterRow.number('Dmin_R'), waterRow.number('Dmin_G'), waterRow.number('Dmin_B'), waterRow.number('Dmin_A')]);
    this.maxShallowColor.set([waterRow.number('Smax_R'), waterRow.number('Smax_G'), waterRow.number('Smax_B'), waterRow.number('Smax_A')]);
    this.minShallowColor.set([waterRow.number('Smin_R'), waterRow.number('Smin_G'), waterRow.number('Smin_B'), waterRow.number('Smin_A')]);

    for (let i = 0, l = waterRow.number('numTex'); i < l; i++) {
      waterTextures.push(this.load(`${waterRow.string('texFile')}${i < 10 ? '0' : ''}${i}${texturesExt}`));
    }

    this.tilesetTextures = <Texture[]>await Promise.all(tilesetTextures);
    this.cliffTextures = <Texture[]>await Promise.all(cliffTextures);
    this.waterTextures = <Texture[]>await Promise.all(waterTextures);

    const corners = parser.corners;
    const [columns, rows] = this.mapSize;
    const instanceCount = (columns - 1) * (rows - 1);
    const cliffHeights = new Float32Array(columns * rows);
    const cornerHeights = new Float32Array(columns * rows);
    const waterHeights = new Float32Array(columns * rows);
    const cornerTextures = new Uint8Array(instanceCount * 4);
    const cornerVariations = new Uint8Array(instanceCount * 4);
    const waterFlags = new Uint8Array(instanceCount);
    let instance = 0;
    const cliffs: {[key: string]: { locations: number[], textures: number[] }} = {};

    this.columns = columns - 1;
    this.rows = rows - 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        const bottomLeft = corners[y][x];
        const index = y * columns + x;

        cliffHeights[index] = bottomLeft.groundHeight;
        cornerHeights[index] = bottomLeft.groundHeight + bottomLeft.layerHeight - 2;
        waterHeights[index] = bottomLeft.waterHeight;

        if (y < rows - 1 && x < columns - 1) {
          // Water can be used with cliffs and normal corners, so store water state regardless.
          waterFlags[instance] = this.isWater(x, y);

          // Is this a cliff, or a normal corner?
          if (this.isCliff(x, y)) {
            const bottomLeftLayer = bottomLeft.layerHeight;
            const bottomRightLayer = corners[y][x + 1].layerHeight;
            const topLeftLayer = corners[y + 1][x].layerHeight;
            const topRightLayer = corners[y + 1][x + 1].layerHeight;
            const base = Math.min(bottomLeftLayer, bottomRightLayer, topLeftLayer, topRightLayer);
            const fileName = this.cliffFileName(bottomLeftLayer, bottomRightLayer, topLeftLayer, topRightLayer, base);

            if (fileName !== 'AAAA') {
              let cliffTexture = bottomLeft.cliffTexture;

              /// ?
              if (cliffTexture === 15) {
                cliffTexture = 1;
              }

              const cliffRow = this.cliffTilesets[cliffTexture];
              const dir = <string>cliffRow.string('cliffModelDir');
              const path = `Doodads\\Terrain\\${dir}\\${dir}${fileName}${getCliffVariation(dir, fileName, bottomLeft.cliffVariation)}.mdx`;

              if (!cliffs[path]) {
                cliffs[path] = { locations: [], textures: []};
              }

              cliffs[path].locations.push((x + 1) * 128 + centerOffset[0], y * 128 + centerOffset[1], (base - 2) * 128);
              cliffs[path].textures.push(cliffTexture);
            }
          } else {
            const bottomLeftTexture = this.cornerTexture(x, y);
            const bottomRightTexture = this.cornerTexture(x + 1, y);
            const topLeftTexture = this.cornerTexture(x, y + 1);
            const topRightTexture = this.cornerTexture(x + 1, y + 1);
            const textures = unique([bottomLeftTexture, bottomRightTexture, topLeftTexture, topRightTexture]).sort();
            let texture = textures[0];

            cornerTextures[instance * 4] = texture + 1;
            cornerVariations[instance * 4] = this.getVariation(texture, bottomLeft.groundVariation);

            textures.shift();

            for (let i = 0, l = textures.length; i < l; i++) {

              let bitset = 0;

              texture = textures[i];

              if (bottomRightTexture === texture) {
                bitset |= 0b0001;
              }

              if (bottomLeftTexture === texture) {
                bitset |= 0b0010;
              }

              if (topRightTexture === texture) {
                bitset |= 0b0100;
              }

              if (topLeftTexture === texture) {
                bitset |= 0b1000;
              }

              cornerTextures[instance * 4 + 1 + i] = texture + 1;
              cornerVariations[instance * 4 + 1 + i] = bitset;
            }
          }

          instance += 1;
        }
      }
    }

    const gl = this.viewer.gl;
    const webgl = this.viewer.webgl;

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    this.faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 1, 3, 2]), gl.STATIC_DRAW);

    this.cliffHeightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.cliffHeightMap);
    webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, cliffHeights);

    this.heightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.heightMap);
    webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, cornerHeights);

    this.waterHeightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.waterHeightMap);
    webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, waterHeights);

    this.instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instanceCount).map((currentValue, index) => index), gl.STATIC_DRAW);

    this.textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cornerTextures, gl.STATIC_DRAW);

    this.variationBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.variationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cornerVariations, gl.STATIC_DRAW);

    this.waterBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.waterBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, waterFlags, gl.STATIC_DRAW);

    this.terrainReady = true;
    this.anyReady = true;

    const cliffShader = viewer.cliffShader;

    const cliffPromises = Object.entries(cliffs).map(async (cliff) => {
      const path = cliff[0];
      const { locations, textures } = cliff[1];
      const resource = await viewer.loadBaseFile(path, 'arrayBuffer');

      if (resource) {
        return new TerrainModel(this, <ArrayBuffer>resource.data, locations, textures, cliffShader);
      }

      return;
    }).filter(x => x);

    // Sometimes TS isn't the brightest.
    const cliffPromisesForReal = <Promise<TerrainModel>[]>cliffPromises;

    this.cliffModels = await Promise.all(cliffPromisesForReal);
    this.cliffsReady = true;
  }

  loadDoodadsAndDestructibles(): void {
    const mpqFile = this.map.get('war3map.doo');

    if (!mpqFile) {
      console.warn('Attempted to load war3map.doo but it is not there');
      return;
    }

    const parser = new War3MapDoo();

    try {
      parser.load(mpqFile.bytes(), this.buildVersion);
    } catch (e) {
      console.warn(`Failed to load war3map.doo: ${e}`);
      return;
    }

    // Doodads and destructibles.
    for (const doodad of parser.doodads) {
      try {
        const row = this.viewer.doodadsData.getRow(doodad.id);

        if (row) {
          let file = row.string('file');

          if (file) {
            const numVar = row.number('numVar');

            if (file.endsWith('.mdl')) {
              file = file.slice(0, -4);
            }

            let fileVar = file;

            file += '.mdx';

            if (numVar > 1) {
              fileVar += Math.min(doodad.variation, numVar - 1);
            }

            fileVar += '.mdx';

            // First see if the model is local.
            // Doodads refering to local models may have invalid variations, so if the variation doesn't exist, try without a variation.
            const mpqFile = this.map.get(fileVar) || this.map.get(file);
            let promise;

            if (mpqFile) {
              promise = this.load(mpqFile.name);
            } else {
              promise = this.load(fileVar);
            }

            promise.then((model) => {
              if (model) {
                this.doodads.push(new Doodad(this, <MdxModel>model, row, doodad));
              }
            });
          } else {
            console.log('Unknown doodad ID', doodad.id, doodad);
          }
        }
      } catch (e) {
        console.warn(`Failed to load doodad/destructible ID ${doodad.id}: ${e}`);
      }
    }

    // Cliff/Terrain doodads.
    for (const doodad of parser.terrainDoodads) {
      try {
        const row = <MappedDataRow>this.viewer.doodadsData.getRow(doodad.id);

        this.load(`${row.string('file')}.mdx`)
          .then((model) => {
            if (model) {
              this.terrainDoodads.push(new TerrainDoodad(this, <MdxModel>model, row, doodad));
            }
          });

        // let pathTexture = <Texture>this.load(row.pathTex);

        // pathTexture.whenLoaded(() => {
        //   let startx = doodad.location[0];
        //   let starty = doodad.location[1];
        //   let endx = startx + pathTexture.width / 4;
        //   let endy = starty + pathTexture.height / 4;

        //   for (let x = startx; x < endx; x++) {
        //     for (let y = starty; y < endy; y++) {

        //     }
        //   }
        // });
      } catch (e) {
        console.warn(`Failed to load cliff/terrain doodad ID ${doodad.id}: ${e}`);
      }
    }

    this.doodadsReady = true;
    this.anyReady = true;
  }

  loadUnitsAndItems(): void {
    const mpqFile = this.map.get('war3mapUnits.doo');

    if (!mpqFile) {
      console.warn('Attempted to load war3mapUnits.doo but it is not there');
      return;
    }

    const parser = new War3MapUnitsDoo();

    try {
      parser.load(mpqFile.bytes(), this.buildVersion);
    } catch (e) {
      console.warn(`Failed to load war3mapUnits.doo: ${e}`);
      return;
    }

    // Collect the units and items data.
    for (const unit of parser.units) {
      try {
        let row: MappedDataRow | undefined;
        let path;

        // Hardcoded?
        if (unit.id === 'sloc') {
          path = 'Objects\\StartLocation\\StartLocation.mdx';
        } else {
          row = this.viewer.unitsData.getRow(unit.id);

          if (row) {
            path = row.string('file');

            if (path) {
              if (path.endsWith('.mdl')) {
                path = path.slice(0, -4);
              }

              path += '.mdx';
            }
          }
        }

        if (path) {
          this.load(path)
            .then((model) => {
              if (model) {
                this.units.push(new Unit(this, <MdxModel>model, row, unit));
              }
            });
        } else {
          console.log('Unknown unit ID', unit.id, unit);
        }
      } catch (e) {
        console.warn(`Failed to load unit/item ID ${unit.id}: ${e}`);
      }
    }

    this.unitsReady = true;
    this.anyReady = true;
  }

  /**
   * Update the map.
   */
  update(): void {
    if (this.anyReady) {
      this.waterIndex += this.waterIncreasePerFrame;

      if (this.waterIndex >= this.waterTextures.length) {
        this.waterIndex = 0;
      }

      for (const doodad of this.doodads) {
        doodad.update();
      }

      for (const unit of this.units) {
        unit.update();
      }
    }
  }

  /**
   * Render the map.
   */
  render(): void {
    if (this.anyReady) {
      const worldScene = this.worldScene;

      worldScene.startFrame();
      this.renderGround();
      this.renderCliffs();
      worldScene.renderOpaque();
      this.renderWater();
      worldScene.renderTranslucent();
    }
  }

  renderGround(): void {
    if (this.terrainReady) {
      const gl = this.viewer.gl;
      const webgl = this.viewer.webgl;
      const instancedArrays = <ANGLE_instanced_arrays>webgl.extensions['ANGLE_instanced_arrays'];
      const shader = this.viewer.groundShader;
      const uniforms = shader.uniforms;
      const attribs = shader.attribs;
      const tilesetTextures = this.tilesetTextures;
      const instanceAttrib = attribs['a_InstanceID'];
      const positionAttrib = attribs['a_position'];
      const texturesAttrib = attribs['a_textures'];
      const variationsAttrib = attribs['a_variations'];
      const tilesetCount = tilesetTextures.length; // This includes the blight texture.

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      webgl.useShader(shader);

      gl.uniformMatrix4fv(uniforms['u_VP'], false, this.worldScene.camera.viewProjectionMatrix);
      gl.uniform2fv(uniforms['u_offset'], this.centerOffset);
      gl.uniform2f(uniforms['u_size'], this.columns, this.rows);
      gl.uniform1i(uniforms['u_heightMap'], 15);

      gl.activeTexture(gl.TEXTURE15);
      gl.bindTexture(gl.TEXTURE_2D, this.heightMap);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.vertexAttribPointer(instanceAttrib, 1, gl.FLOAT, false, 0, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureBuffer);
      gl.vertexAttribPointer(texturesAttrib, 4, gl.UNSIGNED_BYTE, false, 0, 0);
      instancedArrays.vertexAttribDivisorANGLE(texturesAttrib, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.variationBuffer);
      gl.vertexAttribPointer(variationsAttrib, 4, gl.UNSIGNED_BYTE, false, 0, 0);
      instancedArrays.vertexAttribDivisorANGLE(variationsAttrib, 1);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);

      gl.uniform1f(uniforms['u_baseTileset'], 0);

      for (let i = 0, l = Math.min(tilesetCount, 15); i < l; i++) {
        const isExtended = tilesetTextures[i].width > tilesetTextures[i].height ? 1 : 0;

        gl.uniform1f(uniforms[`u_extended[${i}]`], isExtended);
        gl.uniform1i(uniforms[`u_tilesets[${i}]`], i);

        webgl.bindTexture(tilesetTextures[i], i);
      }

      instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this.rows * this.columns);

      if (tilesetCount > 15) {
        gl.uniform1f(uniforms['u_baseTileset'], 15);

        for (let i = 0, l = tilesetCount - 15; i < l; i++) {
          const isExtended = tilesetTextures[i + 15].width > tilesetTextures[i + 15].height ? 1 : 0;

          gl.uniform1f(uniforms[`u_extended[${i}]`], isExtended);

          webgl.bindTexture(tilesetTextures[i + 15], i);
        }

        instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this.rows * this.columns);
      }

      instancedArrays.vertexAttribDivisorANGLE(texturesAttrib, 0);
      instancedArrays.vertexAttribDivisorANGLE(variationsAttrib, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 0);
    }
  }

  renderWater(): void {
    if (this.terrainReady) {
      const gl = this.viewer.gl;
      const webgl = this.viewer.webgl;
      const instancedArrays = <ANGLE_instanced_arrays>webgl.extensions['ANGLE_instanced_arrays'];
      const shader = this.viewer.waterShader;
      const uniforms = shader.uniforms;
      const attribs = shader.attribs;
      const instanceAttrib = attribs['a_InstanceID'];
      const positionAttrib = attribs['a_position'];
      const isWaterAttrib = attribs['a_isWater'];

      gl.depthMask(false);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      webgl.useShader(shader);

      gl.uniformMatrix4fv(uniforms['u_VP'], false, this.worldScene.camera.viewProjectionMatrix);
      gl.uniform2fv(uniforms['u_offset'], this.centerOffset);
      gl.uniform2f(uniforms['u_size'], this.columns, this.rows);
      gl.uniform1i(uniforms['u_heightMap'], 0);
      gl.uniform1i(uniforms['u_waterHeightMap'], 1);
      gl.uniform1i(uniforms['u_waterTexture'], 2);
      gl.uniform1f(uniforms['u_offsetHeight'], this.waterHeightOffset);
      gl.uniform4fv(uniforms['u_maxDeepColor'], this.maxDeepColor);
      gl.uniform4fv(uniforms['u_minDeepColor'], this.minDeepColor);
      gl.uniform4fv(uniforms['u_maxShallowColor'], this.maxShallowColor);
      gl.uniform4fv(uniforms['u_minShallowColor'], this.minShallowColor);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.heightMap);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.waterHeightMap);

      webgl.bindTexture(this.waterTextures[this.waterIndex | 0], 2);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 8, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.instanceBuffer);
      gl.vertexAttribPointer(instanceAttrib, 1, gl.FLOAT, false, 4, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, this.waterBuffer);
      gl.vertexAttribPointer(isWaterAttrib, 1, gl.UNSIGNED_BYTE, false, 1, 0);
      instancedArrays.vertexAttribDivisorANGLE(isWaterAttrib, 1);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
      instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this.rows * this.columns);

      instancedArrays.vertexAttribDivisorANGLE(isWaterAttrib, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 0);
    }
  }

  renderCliffs(): void {
    if (this.cliffsReady) {
      const gl = this.viewer.gl;
      const webgl = this.viewer.webgl;
      const instancedArrays = <ANGLE_instanced_arrays>webgl.extensions['ANGLE_instanced_arrays'];
      const vertexArrayObject = <OES_vertex_array_object>webgl.extensions['OES_vertex_array_object'];
      const shader = this.viewer.cliffShader;
      const attribs = shader.attribs;
      const uniforms = shader.uniforms;

      gl.disable(gl.BLEND);

      shader.use();

      gl.uniformMatrix4fv(uniforms['u_VP'], false, this.worldScene.camera.viewProjectionMatrix);
      gl.uniform1i(uniforms['u_heightMap'], 0);
      gl.uniform2f(uniforms['u_pixel'], 1 / (this.columns + 1), 1 / (this.rows + 1));
      gl.uniform2fv(uniforms['u_centerOffset'], this.centerOffset);
      gl.uniform1i(uniforms['u_texture1'], 1);
      gl.uniform1i(uniforms['u_texture2'], 2);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, this.cliffHeightMap);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.cliffTextures[0].webglResource);

      if (this.cliffTextures.length > 1) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.cliffTextures[1].webglResource);
      }

      // Set instanced attributes.
      if (!vertexArrayObject) {
        instancedArrays.vertexAttribDivisorANGLE(attribs['a_instancePosition'], 1);
        instancedArrays.vertexAttribDivisorANGLE(attribs['a_instanceTexture'], 1);
      }

      // Render the cliffs.
      for (const cliff of this.cliffModels) {
        cliff.render(shader);
      }

      // Clear instanced attributes.
      if (!vertexArrayObject) {
        instancedArrays.vertexAttribDivisorANGLE(attribs['a_instancePosition'], 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs['a_instanceTexture'], 0);
      }
    }
  }

  cliffFileName(bottomLeftLayer: number, bottomRightLayer: number, topLeftLayer: number, topRightLayer: number, base: number): string {
    return String.fromCharCode(65 + bottomLeftLayer - base) +
      String.fromCharCode(65 + topLeftLayer - base) +
      String.fromCharCode(65 + topRightLayer - base) +
      String.fromCharCode(65 + bottomRightLayer - base);
  }

  getVariation(groundTexture: number, variation: number): number {
    const texture = this.tilesetTextures[groundTexture];

    // Extended?
    if (texture.width > texture.height) {
      if (variation < 16) {
        return 16 + variation;
      } else if (variation === 16) {
        return 15;
      } else {
        return 0;
      }
    } else {
      if (variation === 0) {
        return 0;
      } else {
        return 15;
      }
    }
  }

  /**
   * Is the corner at the given column and row a cliff?
   */
  isCliff(column: number, row: number): boolean {
    if (column < 1 || column > this.columns - 1 || row < 1 || row > this.rows - 1) {
      return false;
    }

    const corners = this.corners;
    const bottomLeft = corners[row][column].layerHeight;
    const bottomRight = corners[row][column + 1].layerHeight;
    const topLeft = corners[row + 1][column].layerHeight;
    const topRight = corners[row + 1][column + 1].layerHeight;

    return bottomLeft !== bottomRight || bottomLeft !== topLeft || bottomLeft !== topRight;
  }

  /**
   * Is the tile at the given column and row water?
   */
  isWater(column: number, row: number): number {
    const corners = this.corners;

    return corners[row][column].water || corners[row][column + 1].water || corners[row + 1][column].water || corners[row + 1][column + 1].water;
  }

  /**
   * Given a cliff index, get its ground texture index.
   * This is an index into the tilset textures.
   */
  cliffGroundIndex(whichCliff: number): number {
    const whichTileset = this.cliffTilesets[whichCliff].string('groundTile');
    const tilesets = this.tilesets;

    for (let i = 0, l = tilesets.length; i < l; i++) {
      if (tilesets[i].string('tileID') === whichTileset) {
        return i;
      }
    }

    return 0;
  }

  /**
   * Get the ground texture of a corner, whether it's normal ground, a cliff, or a blighted corner.
   */
  cornerTexture(column: number, row: number): number {
    const corners = this.corners;
    const columns = this.columns;
    const rows = this.rows;

    for (let y = -1; y < 1; y++) {
      for (let x = -1; x < 1; x++) {
        if (column + x > 0 && column + x < columns - 1 && row + y > 0 && row + y < rows - 1) {
          if (this.isCliff(column + x, row + y)) {
            let texture = corners[row + y][column + x].cliffTexture;

            if (texture === 15) {
              texture = 1;
            }

            return this.cliffGroundIndex(texture);
          }
        }
      }
    }

    const corner = corners[row][column];

    // Is this corner blighted?
    if (corner.blight) {
      return this.blightTextureIndex;
    }

    return corner.groundTexture;
  }

  applyModificationFile(dataMap: MappedData, metadataMap: MappedData, modificationFile: War3MapW3u | War3MapW3d | undefined): void {
    if (modificationFile) {
      // Modifications to built-in objects
      this.applyModificationTable(dataMap, metadataMap, modificationFile.originalTable);

      // Declarations of user-defined objects
      this.applyModificationTable(dataMap, metadataMap, modificationFile.customTable);
    }
  }

  applyModificationTable(dataMap: MappedData, metadataMap: MappedData, modificationTable: ModificationTable): void {
    for (const modificationObject of modificationTable.objects) {
      let row;

      if (modificationObject.newId !== '') {
        row = dataMap.getRow(modificationObject.newId);

        if (!row) {
          row = new MappedDataRow();

          row.map = Object.assign({}, (<MappedDataRow>dataMap.getRow(modificationObject.oldId)).map);

          dataMap.setRow(modificationObject.newId, row);
        }
      } else {
        row = <MappedDataRow>dataMap.getRow(modificationObject.oldId);
      }

      for (const modification of modificationObject.modifications) {
        const metadata = metadataMap.getRow(modification.id);

        if (metadata) {
          row.set(<string>metadata.string('field'), modification.value);
        } else {
          console.warn('Unknown modification ID', modification);
        }
      }
    }
  }

  groundNormal(out: vec3, x: number, y: number): vec3 {
    const centerOffset = this.centerOffset;
    const mapSize = this.mapSize;

    x = (x - centerOffset[0]) / 128;
    y = (y - centerOffset[1]) / 128;

    const cellX = x | 0;
    const cellY = y | 0;

    // See if this coordinate is in the map
    if (cellX >= 0 && cellX < mapSize[0] - 1 && cellY >= 0 && cellY < mapSize[1] - 1) {
      // See http://gamedev.stackexchange.com/a/24574
      const corners = this.corners;
      const bottomLeft = corners[cellY][cellX].groundHeight;
      const bottomRight = corners[cellY][cellX + 1].groundHeight;
      const topLeft = corners[cellY + 1][cellX].groundHeight;
      const topRight = corners[cellY + 1][cellX + 1].groundHeight;
      const sqX = x - cellX;
      const sqY = y - cellY;

      if (sqX + sqY < 1) {
        vec3.set(normalHeap1, 1, 0, bottomRight - bottomLeft);
        vec3.set(normalHeap2, 0, 1, topLeft - bottomLeft);
      } else {
        vec3.set(normalHeap1, -1, 0, topRight - topLeft);
        vec3.set(normalHeap2, 0, 1, topRight - bottomRight);
      }

      vec3.normalize(out, vec3.cross(out, normalHeap1, normalHeap2));
    } else {
      vec3.set(out, 0, 0, 1);
    }

    return out;
  }
}

/*
  heightAt(location) {
    let heightMap = this.heightMap,
      offset = this.offset,
      x = (location[0] / 128) + offset[0],
      y = (location[1] / 128) + offset[1];

    let minY = Math.floor(y),
      maxY = Math.ceil(y),
      minX = Math.floor(x),
      maxX = Math.ceil(x);

    // See if this coordinate is in the map
    if (maxY > 0 && minY < heightMap.length - 1 && maxX > 0 && minX < heightMap[0].length - 1) {
      // See http://gamedev.stackexchange.com/a/24574
      let triZ0 = heightMap[minY][minX],
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
  */
