import {vec3, quat} from 'gl-matrix';
import {VEC3_UNIT_Z} from '../../../common/gl-matrix-addon';
import unique from '../../../common/arrayunique';
import War3Map from '../../../parsers/w3x/map';
import War3MapW3i from '../../../parsers/w3x/w3i/file';
import War3MapW3e from '../../../parsers/w3x/w3e/file';
import War3MapDoo from '../../../parsers/w3x/doo/file';
import War3MapUnitsDoo from '../../../parsers/w3x/unitsdoo/file';
import MpqArchive from '../../../parsers/mpq/archive';
import MappedData from '../../../utils/mappeddata';
import ModelViewer from '../../viewer';
import Grid from '../../grid';
import geoHandler from '../geo/handler';
import mdxHandler from '../mdx/handler';
import ddsHandler from '../dds/handler';
import shaders from './shaders';
import getCliffVariation from './variations';
import TerrainModel from './terrainmodel';
// import SimpleModel from './simplemodel';
import standOnRepeat from './standsequence';
import Unit from './unit';

let normalHeap1 = vec3.create();
let normalHeap2 = vec3.create();

/**
 *
 */
export default class War3MapViewer extends ModelViewer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {function} wc3PathSolver
   */
  constructor(canvas, wc3PathSolver) {
    super(canvas);

    this.batchSize = 64;

    this.on('error', (target, error, reason) => console.error(target, error, reason));

    this.addHandler(geoHandler);
    this.addHandler(mdxHandler);
    this.addHandler(ddsHandler);

    /** @member {function} */
    this.wc3PathSolver = wc3PathSolver;

    this.groundShader = this.webgl.createShaderProgram(shaders.vsGround, shaders.fsGround);
    this.waterShader = this.webgl.createShaderProgram(shaders.vsWater, shaders.fsWater);
    this.cliffShader = this.webgl.createShaderProgram(shaders.vsCliffs, shaders.fsCliffs);
    this.simpleModelShader = this.webgl.createShaderProgram(shaders.vsSimpleModel, shaders.fsSimpleModel);
    this.textureAtlasShader = this.webgl.createShaderProgram(shaders.vsTextureAtlas, shaders.fsTextureAtlas);

    this.scene = this.addScene();
    this.camera = this.scene.camera;

    this.waterIndex = 0;
    this.waterIncreasePerFrame = 0;

    this.anyReady = false;

    this.terrainCliffsAndWaterLoaded = false;
    this.terrainData = new MappedData();
    this.cliffTypesData = new MappedData();
    this.waterData = new MappedData();
    this.terrainReady = false;
    this.cliffsReady = false;

    this.whenLoaded(['TerrainArt\\Terrain.slk', 'TerrainArt\\CliffTypes.slk', 'TerrainArt\\Water.slk'].map((path) => this.loadGeneric(wc3PathSolver(path)[0], 'text')))
      .then(([terrain, cliffTypes, water]) => {
        this.terrainCliffsAndWaterLoaded = true;
        this.terrainData.load(terrain.data);
        this.cliffTypesData.load(cliffTypes.data);
        this.waterData.load(water.data);
        this.emit('terrainloaded');
      });

    this.doodadsAndDestructiblesLoaded = false;
    this.doodadsData = new MappedData();
    this.doodadMetaData = new MappedData();
    this.destructableMetaData = new MappedData();
    this.doodads = [];
    this.terrainDoodads = [];
    this.doodadsReady = false;

    this.whenLoaded(['Doodads\\Doodads.slk', 'Doodads\\DoodadMetaData.slk', 'Units\\DestructableData.slk', 'Units\\DestructableMetaData.slk'].map((path) => this.loadGeneric(wc3PathSolver(path)[0], 'text')))
      .then(([doodads, doodadMetaData, destructableData, destructableMetaData]) => {
        this.doodadsAndDestructiblesLoaded = true;
        this.doodadsData.load(doodads.data);
        this.doodadMetaData.load(doodadMetaData.data);
        this.doodadsData.load(destructableData.data);
        this.destructableMetaData.load(destructableMetaData.data);
        this.emit('doodadsloaded');
      });

    this.unitsAndItemsLoaded = false;
    this.unitsData = new MappedData();
    this.unitMetaData = new MappedData();
    this.units = [];
    this.unitsReady = false;

    this.whenLoaded(['Units\\UnitData.slk', 'Units\\unitUI.slk', 'Units\\ItemData.slk', 'Units\\UnitMetaData.slk'].map((path) => this.loadGeneric(wc3PathSolver(path)[0], 'text')))
      .then(([unitData, unitUi, itemData, unitMetaData]) => {
        this.unitsAndItemsLoaded = true;
        this.unitsData.load(unitData.data);
        this.unitsData.load(unitUi.data);
        this.unitsData.load(itemData.data);
        this.unitMetaData.load(unitMetaData.data);
        this.emit('unitsloaded');
      });
  }

  /**
   *
   */
  renderGround() {
    if (this.terrainReady) {
      let gl = this.gl;
      let webgl = this.webgl;
      let instancedArrays = webgl.extensions.instancedArrays;
      let shader = this.groundShader;
      let uniforms = shader.uniforms;
      let attribs = shader.attribs;
      let {columns, rows, centerOffset, vertexBuffer, faceBuffer, heightMap, instanceBuffer, instanceCount, textureBuffer, variationBuffer} = this.terrainRenderData;
      let tilesetTextures = this.tilesetTextures;
      let instanceAttrib = attribs.a_InstanceID;
      let positionAttrib = attribs.a_position;
      let texturesAttrib = attribs.a_textures;
      let variationsAttrib = attribs.a_variations;
      let tilesetCount = tilesetTextures.length; // This includes the blight texture.

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      webgl.useShaderProgram(shader);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera.worldProjectionMatrix);
      gl.uniform2fv(uniforms.u_offset, centerOffset);
      gl.uniform2f(uniforms.u_size, columns - 1, rows - 1);
      gl.uniform1i(uniforms.u_heightMap, 15);

      gl.activeTexture(gl.TEXTURE15);
      gl.bindTexture(gl.TEXTURE_2D, heightMap);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 8, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.vertexAttribPointer(instanceAttrib, 1, gl.FLOAT, false, 4, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
      gl.vertexAttribPointer(texturesAttrib, 4, gl.UNSIGNED_BYTE, false, 4, 0);
      instancedArrays.vertexAttribDivisorANGLE(texturesAttrib, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, variationBuffer);
      gl.vertexAttribPointer(variationsAttrib, 4, gl.UNSIGNED_BYTE, false, 4, 0);
      instancedArrays.vertexAttribDivisorANGLE(variationsAttrib, 1);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);

      gl.uniform1f(uniforms.u_baseTileset, 0);

      for (let i = 0, l = Math.min(tilesetCount, 15); i < l; i++) {
        gl.uniform1f(uniforms[`u_extended[${i}]`], tilesetTextures[i].width > tilesetTextures[i].height);
        gl.uniform1i(uniforms[`u_tilesets[${i}]`], i);

        tilesetTextures[i].bind(i);
      }

      instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, instanceCount);

      if (tilesetCount > 15) {
        gl.uniform1f(uniforms.u_baseTileset, 15);

        for (let i = 0, l = tilesetCount - 15; i < l; i++) {
          gl.uniform1f(uniforms[`u_extended[${i}]`], tilesetTextures[i + 15].width > tilesetTextures[i + 15].height);
          gl.uniform1i(uniforms[`u_tilesets[${i}]`], i);

          tilesetTextures[i + 15].bind(i);
        }

        instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, instanceCount);
      }

      instancedArrays.vertexAttribDivisorANGLE(texturesAttrib, 0);
      instancedArrays.vertexAttribDivisorANGLE(variationsAttrib, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 0);
    }
  }

  /**
   *
   */
  renderWater() {
    if (this.terrainReady) {
      let gl = this.gl;
      let webgl = this.webgl;
      let instancedArrays = webgl.extensions.instancedArrays;
      let shader = this.waterShader;
      let uniforms = shader.uniforms;
      let attribs = shader.attribs;
      let {columns, rows, centerOffset, vertexBuffer, faceBuffer, heightMap, instanceBuffer, instanceCount, waterHeightMap, waterBuffer} = this.terrainRenderData;
      let instanceAttrib = attribs.a_InstanceID;
      let positionAttrib = attribs.a_position;
      let isWaterAttrib = attribs.a_isWater;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      webgl.useShaderProgram(shader);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera.worldProjectionMatrix);
      gl.uniform2fv(uniforms.u_offset, centerOffset);
      gl.uniform2f(uniforms.u_size, columns - 1, rows - 1);
      gl.uniform1i(uniforms.u_heightMap, 0);
      gl.uniform1i(uniforms.u_waterHeightMap, 1);
      gl.uniform1i(uniforms.u_waterTexture, 2);
      gl.uniform1f(uniforms.u_offsetHeight, this.waterHeightOffset);
      gl.uniform4fv(uniforms.u_maxDeepColor, this.maxDeepColor);
      gl.uniform4fv(uniforms.u_minDeepColor, this.minDeepColor);
      gl.uniform4fv(uniforms.u_maxShallowColor, this.maxShallowColor);
      gl.uniform4fv(uniforms.u_minShallowColor, this.minShallowColor);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, heightMap);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, waterHeightMap);

      this.waterTextures[this.waterIndex | 0].bind(2);

      gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
      gl.vertexAttribPointer(positionAttrib, 2, gl.FLOAT, false, 8, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
      gl.vertexAttribPointer(instanceAttrib, 1, gl.FLOAT, false, 4, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 1);

      gl.bindBuffer(gl.ARRAY_BUFFER, waterBuffer);
      gl.vertexAttribPointer(isWaterAttrib, 1, gl.UNSIGNED_BYTE, false, 1, 0);
      instancedArrays.vertexAttribDivisorANGLE(isWaterAttrib, 1);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
      instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, instanceCount);

      instancedArrays.vertexAttribDivisorANGLE(isWaterAttrib, 0);
      instancedArrays.vertexAttribDivisorANGLE(instanceAttrib, 0);
    }
  }

  /**
   *
   */
  renderCliffs() {
    if (this.cliffsReady) {
      let gl = this.gl;
      let instancedArrays = gl.extensions.instancedArrays;
      let webgl = this.webgl;
      let shader = this.cliffShader;
      let attribs = shader.attribs;
      let uniforms = shader.uniforms;
      let {centerOffset, cliffHeightMap, heightMapSize} = this.terrainRenderData;

      gl.disable(gl.BLEND);

      webgl.useShaderProgram(shader);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera.worldProjectionMatrix);
      gl.uniform1i(uniforms.u_heightMap, 0);
      gl.uniform2fv(uniforms.u_pixel, heightMapSize);
      gl.uniform2fv(uniforms.u_centerOffset, centerOffset);
      gl.uniform1i(uniforms.u_texture1, 1);
      gl.uniform1i(uniforms.u_texture2, 2);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, cliffHeightMap);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.cliffTextures[0].webglResource);

      if (this.cliffTextures.length > 1) {
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_2D, this.cliffTextures[1].webglResource);
      }

      // Set instanced attributes.
      if (!gl.extensions.vertexArrayObject) {
        instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 1);
        instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceTexture, 1);
      }

      // Render the cliffs.
      for (let cliff of this.cliffModels) {
        cliff.render(gl, instancedArrays, attribs);
      }

      // Clear instanced attributes.
      if (!gl.extensions.vertexArrayObject) {
        instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 0);
        instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceTexture, 0);
      }
    }
  }

  /**
   * Render the map.
   */
  render() {
    if (this.anyReady) {
      this.gl.viewport(...this.camera.rect);

      this.renderGround();
      this.renderCliffs();
      super.renderOpaque();
      this.renderWater();
      super.renderTranslucent();

    }
  }

  /**
   * Update the map.
   */
  update() {
    if (this.anyReady) {
      this.waterIndex += this.waterIncreasePerFrame;

      if (this.waterIndex >= this.waterTextures.length) {
        this.waterIndex = 0;
      }

      super.update();
    }
  }

  /**
   * @param {ArrayBuffer} buffer
   */
  async loadMap(buffer) {
    let promise = this.promise();

    // Readonly mode to optimize memory usage.
    this.mapMpq = new War3Map(buffer, true);

    let wc3PathSolver = this.wc3PathSolver;

    let w3i = new War3MapW3i(this.mapMpq.get('war3map.w3i').arrayBuffer());
    let tileset = w3i.tileset;

    this.emit('maploaded');

    this.tilesetMpq = new MpqArchive((await this.loadGeneric(wc3PathSolver(`${tileset}.mpq`)[0], 'arrayBuffer').whenLoaded()).data, true);

    this.mapPathSolver = (path) => {
      // MPQ paths have backwards slashes...always? Don't know.
      let mpqPath = path.replace(/\//g, '\\');

      // If the file is in the map, return it.
      // Otherwise, if it's in the tileset MPQ, return it from there.
      let file = this.mapMpq.get(mpqPath) || this.tilesetMpq.get(mpqPath);
      if (file) {
        return [file.arrayBuffer(), path.substr(path.lastIndexOf('.')), false];
      }

      // Try to get the file from the game MPQs.
      return wc3PathSolver(path);
    };

    let w3e = new War3MapW3e(this.mapMpq.get('war3map.w3e').arrayBuffer());

    this.corners = w3e.corners;
    this.centerOffset = w3e.centerOffset;
    this.mapSize = w3e.mapSize;

    // Override the grid based on the map.
    this.scene.grid = new Grid(this.centerOffset[0], this.centerOffset[1], this.mapSize[0] * 128 - 128, this.mapSize[1] * 128 - 128, 16 * 128, 16 * 128);

    this.emit('tilesetloaded');

    if (this.terrainCliffsAndWaterLoaded) {
      this.loadTerrainCliffsAndWater(w3e);
    } else {
      this.once('terrainloaded', () => this.loadTerrainCliffsAndWater(w3e));
    }

    let modifications = this.mapMpq.readModifications();

    if (this.doodadsAndDestructiblesLoaded) {
      this.loadDoodadsAndDestructibles(modifications);
    } else {
      this.once('doodadsloaded', () => this.loadDoodadsAndDestructibles(modifications));
    }

    if (this.unitsAndItemsLoaded) {
      this.loadUnitsAndItems(modifications);
    } else {
      this.once('unitsloaded', () => this.loadUnitsAndItems(modifications));
    }

    promise.resolve();
  }

  /**
   * @param {*} modifications
   */
  loadDoodadsAndDestructibles(modifications) {
    this.applyModificationFile(this.doodadsData, this.doodadMetaData, modifications.w3d);
    this.applyModificationFile(this.doodadsData, this.destructableMetaData, modifications.w3b);

    let doo = new War3MapDoo(this.mapMpq.get('war3map.doo').arrayBuffer());
    let scene = this.scene;

    // Collect the doodad and destructible data.
    for (let doodad of doo.doodads) {
      let row = this.doodadsData.getRow(doodad.id);
      let file = row.file;
      let numVar = row.numVar;

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
      let mpqFile = this.mapMpq.get(fileVar) || this.mapMpq.get(file);
      let model;

      if (mpqFile) {
        model = this.load(mpqFile.name);
      } else {
        model = this.load(fileVar);
      }

      let isSimple = row.lightweight === 1;
      let instance;

      if (isSimple) {
        instance = model.addInstance(1);
      } else {
        instance = model.addInstance();
      }

      instance.move(doodad.location);
      instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, doodad.angle));
      instance.scale(doodad.scale);
      instance.setScene(scene);

      if (!isSimple) {
        standOnRepeat(instance);
      }
    }

    this.doodadsReady = true;
    this.anyReady = true;
  }

  /**
   * @param {*} modifications
   */
  loadUnitsAndItems(modifications) {
    this.applyModificationFile(this.unitsData, this.unitMetaData, modifications.w3u);
    this.applyModificationFile(this.unitsData, this.unitMetaData, modifications.w3t);

    let unitsDoo = new War3MapUnitsDoo(this.mapMpq.get('war3mapUnits.doo').arrayBuffer());

    // Collect the units and items data.
    for (let unit of unitsDoo.units) {
      this.units.push(new Unit(this, unit));
    }

    this.unitsReady = true;
    this.anyReady = true;
  }

  /**
   *
   */
  async loadTerrainCliffsAndWater(w3e) {
    let tileset = w3e.tileset;

    this.tilesets = [];
    this.tilesetTextures = [];

    for (let groundTileset of w3e.groundTilesets) {
      let row = this.terrainData.getRow(groundTileset);

      this.tilesets.push(row);
      this.tilesetTextures.push(this.load(`${row.dir}\\${row.file}.blp`));
    }

    let blights = {
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
    this.tilesetTextures.push(this.load(`TerrainArt\\Blight\\${blights[tileset]}_Blight.blp`));

    this.cliffTilesets = [];
    this.cliffTextures = [];

    for (let cliffTileset of w3e.cliffTilesets) {
      let row = this.cliffTypesData.getRow(cliffTileset);

      this.cliffTilesets.push(row);
      this.cliffTextures.push(this.load(`${row.texDir}\\${row.texFile}.blp`));
    }

    let waterRow = this.waterData.getRow(`${tileset}Sha`);

    this.waterHeightOffset = waterRow.height;
    this.waterIncreasePerFrame = waterRow.texRate / 60;
    this.waterTextures = [];
    this.maxDeepColor = new Float32Array([waterRow.Dmax_R, waterRow.Dmax_G, waterRow.Dmax_B, waterRow.Dmax_A]);
    this.minDeepColor = new Float32Array([waterRow.Dmin_R, waterRow.Dmin_G, waterRow.Dmin_B, waterRow.Dmin_A]);
    this.maxShallowColor = new Float32Array([waterRow.Smax_R, waterRow.Smax_G, waterRow.Smax_B, waterRow.Smax_A]);
    this.minShallowColor = new Float32Array([waterRow.Smin_R, waterRow.Smin_G, waterRow.Smin_B, waterRow.Smin_A]);

    for (let i = 0, l = waterRow.numTex; i < l; i++) {
      this.waterTextures.push(this.load(`${waterRow.texFile}${i < 10 ? '0' : ''}${i}.blp`));
    }

    await this.whenLoaded(this.tilesetTextures);

    let gl = this.gl;

    let corners = w3e.corners;
    let [columns, rows] = this.mapSize;
    let centerOffset = this.centerOffset;
    let instanceCount = (columns - 1) * (rows - 1);
    let cliffHeights = new Float32Array(columns * rows);
    let cornerHeights = new Float32Array(columns * rows);
    let waterHeights = new Float32Array(columns * rows);
    let cornerTextures = new Uint8Array(instanceCount * 4);
    let cornerVariations = new Uint8Array(instanceCount * 4);
    let waterFlags = new Uint8Array(instanceCount);
    let instance = 0;
    let cliffs = {};

    this.columns = columns - 1;
    this.rows = rows - 1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < columns; x++) {
        let bottomLeft = corners[y][x];
        let index = y * columns + x;

        cliffHeights[index] = bottomLeft.groundHeight;
        cornerHeights[index] = bottomLeft.groundHeight + bottomLeft.layerHeight - 2;
        waterHeights[index] = bottomLeft.waterHeight;

        if (y < rows - 1 && x < columns - 1) {
          // Water can be used with cliffs and normal corners, so store water state regardless.
          waterFlags[instance] = this.isWater(x, y);

          // Is this a cliff, or a normal corner?
          if (this.isCliff(x, y)) {
            let bottomLeftLayer = bottomLeft.layerHeight;
            let bottomRightLayer = corners[y][x + 1].layerHeight;
            let topLeftLayer = corners[y + 1][x].layerHeight;
            let topRightLayer = corners[y + 1][x + 1].layerHeight;
            let base = Math.min(bottomLeftLayer, bottomRightLayer, topLeftLayer, topRightLayer);
            let fileName = this.cliffFileName(bottomLeftLayer, bottomRightLayer, topLeftLayer, topRightLayer, base);

            if (fileName !== 'AAAA') {
              let cliffTexture = bottomLeft.cliffTexture;

              /// ?
              if (cliffTexture === 15) {
                cliffTexture = 1;
              }

              let cliffRow = this.cliffTilesets[cliffTexture];
              let dir = cliffRow.cliffModelDir;
              let path = `Doodads\\Terrain\\${dir}\\${dir}${fileName}${getCliffVariation(dir, fileName, bottomLeft.cliffVariation)}.mdx`;

              if (!cliffs[path]) {
                cliffs[path] = {locations: [], textures: []};
              }

              cliffs[path].locations.push((x + 1) * 128 + centerOffset[0], y * 128 + centerOffset[1], (base - 2) * 128);
              cliffs[path].textures.push(cliffTexture);
            }
          } else {
            let bottomLeftTexture = this.cornerTexture(x, y);
            let bottomRightTexture = this.cornerTexture(x + 1, y);
            let topLeftTexture = this.cornerTexture(x, y + 1);
            let topRightTexture = this.cornerTexture(x + 1, y + 1);
            let textures = unique([bottomLeftTexture, bottomRightTexture, topLeftTexture, topRightTexture]).sort();
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

    let vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]), gl.STATIC_DRAW);

    let faceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, faceBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array([0, 1, 2, 1, 3, 2]), gl.STATIC_DRAW);

    let cliffHeightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, cliffHeightMap);
    this.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, cliffHeights);

    let heightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, heightMap);
    this.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, cornerHeights);

    let waterHeightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, waterHeightMap);
    this.webgl.setTextureMode(gl.CLAMP_TO_EDGE, gl.CLAMP_TO_EDGE, gl.NEAREST, gl.NEAREST);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, waterHeights);

    let instanceBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, instanceBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(instanceCount).map((currentValue, index, array) => index), gl.STATIC_DRAW);

    let textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cornerTextures, gl.STATIC_DRAW);

    let variationBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, variationBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, cornerVariations, gl.STATIC_DRAW);

    let waterBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, waterBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, waterFlags, gl.STATIC_DRAW);

    let heightMapSize = new Float32Array([1 / columns, 1 / rows]);

    this.terrainRenderData = {
      rows,
      columns,
      centerOffset,
      vertexBuffer,
      faceBuffer,
      heightMap,
      instanceBuffer,
      instanceCount,
      cornerTextures,
      textureBuffer,
      variationBuffer,
      heightMapSize,
      cliffHeightMap,
      waterHeightMap,
      waterBuffer,
    };

    this.terrainReady = true;
    this.anyReady = true;

    let cliffPromises = Object.entries(cliffs).map((cliff) => {
      let path = cliff[0];
      let {locations, textures} = cliff[1];

      return this.loadGeneric(this.mapPathSolver(path)[0], 'arrayBuffer')
        .whenLoaded()
        .then((resource) => {
          return new TerrainModel(gl, resource.data, locations, textures, this.cliffShader.attribs);
        });
    });

    this.cliffModels = await Promise.all(cliffPromises);
    this.cliffsReady = true;
  }

  /**
   * @param {number} bottomLeftLayer
   * @param {number} bottomRightLayer
   * @param {number} topLeftLayer
   * @param {number} topRightLayer
   * @param {number} base
   * @return {string}
   */
  cliffFileName(bottomLeftLayer, bottomRightLayer, topLeftLayer, topRightLayer, base) {
    return String.fromCharCode(65 + bottomLeftLayer - base) +
      String.fromCharCode(65 + topLeftLayer - base) +
      String.fromCharCode(65 + topRightLayer - base) +
      String.fromCharCode(65 + bottomRightLayer - base);
  }

  /**
   * @param {number} groundTexture
   * @param {number} variation
   * @return {number}
   */
  getVariation(groundTexture, variation) {
    let texture = this.tilesetTextures[groundTexture];

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
   *
   * @param {number} column
   * @param {number} row
   * @return {boolean}
   */
  isCliff(column, row) {
    if (column < 1 || column > this.columns - 1 || row < 1 || row > this.rows - 1) {
      return false;
    }

    let corners = this.corners;
    let bottomLeft = corners[row][column].layerHeight;
    let bottomRight = corners[row][column + 1].layerHeight;
    let topLeft = corners[row + 1][column].layerHeight;
    let topRight = corners[row + 1][column + 1].layerHeight;

    return bottomLeft !== bottomRight || bottomLeft !== topLeft || bottomLeft !== topRight;
  }

  /**
   * Is the tile at the given column and row water?
   *
   * @param {number} column
   * @param {number} row
   * @return {boolean}
   */
  isWater(column, row) {
    let corners = this.corners;

    return corners[row][column].water || corners[row][column + 1].water || corners[row + 1][column].water || corners[row + 1][column + 1].water;
  }

  /**
   * Given a cliff index, get its ground texture index.
   * This is an index into the tilset textures.
   *
   * @param {number} whichCliff
   * @return {number}
   */
  cliffGroundIndex(whichCliff) {
    let whichTileset = this.cliffTilesets[whichCliff].groundTile;
    let tilesets = this.tilesets;

    for (let i = 0, l = tilesets.length; i < l; i++) {
      if (tilesets[i].tileID === whichTileset) {
        return i;
      }
    }
  }

  /**
   * Get the ground texture of a corner, whether it's normal ground, a cliff, or a blighted corner.
   *
   * @param {number} column
   * @param {number} row
   * @return {number}
   */
  cornerTexture(column, row) {
    let corners = this.corners;
    let columns = this.columns;
    let rows = this.rows;

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

    let corner = corners[row][column];

    // Is this corner blighted?
    if (corner.blight) {
      return this.blightTextureIndex;
    }

    return corner.groundTexture;
  }

  /**
   * @param {*} src
   * @param {?function} pathSolver
   * @param {?Object} options
   * @return {Resource}
   */
  load(src, pathSolver, options) {
    return super.load(src, pathSolver || this.mapPathSolver, options);
  }

  /**
   * 
   * @param {*} dataMap 
   * @param {*} metadataMap 
   * @param {*} modificationFile 
   */
  applyModificationFile(dataMap, metadataMap, modificationFile) {
    if (modificationFile) {
      // Modifications to built-in objects
      this.applyModificationTable(dataMap, metadataMap, modificationFile.originalTable);

      // Declarations of user-defined objects
      this.applyModificationTable(dataMap, metadataMap, modificationFile.customTable);
    }
  }

  /**
   * 
   * @param {*} dataMap 
   * @param {*} metadataMap 
   * @param {*} modificationTable 
   */
  applyModificationTable(dataMap, metadataMap, modificationTable) {
    for (let modificationObject of modificationTable.objects) {
      let row;

      if (modificationObject.newId !== '') {
        row = dataMap.getRow(modificationObject.newId);

        if (!row) {
          row = {...dataMap.getRow(modificationObject.oldId)};

          dataMap.setRow(modificationObject.newId, row);
        }
      } else {
        row = dataMap.getRow(modificationObject.oldId);
      }

      for (let modification of modificationObject.modifications) {
        let metadata = metadataMap.getRow(modification.id);

        if (metadata) {
          row[metadata.field] = modification.value;
        } else {
          console.warn('Unknown modification ID', modification);
        }
      }
    }
  }

  /**
   * 
   * @param {Float32Array} out
   * @param {number} x
   * @param {number} y
   * @return {out}
   */
  groundNormal(out, x, y) {
    let centerOffset = this.centerOffset;
    let mapSize = this.mapSize;

    x = (x - centerOffset[0]) / 128;
    y = (y - centerOffset[1]) / 128;

    let cellX = x | 0;
    let cellY = y | 0;

    // See if this coordinate is in the map
    if (cellX >= 0 && cellX < mapSize[0] - 1 && cellY >= 0 && cellY < mapSize[1] - 1) {
      // See http://gamedev.stackexchange.com/a/24574
      let corners = this.corners;
      let bottomLeft = corners[cellY][cellX].groundHeight;
      let bottomRight = corners[cellY][cellX + 1].groundHeight;
      let topLeft = corners[cellY + 1][cellX].groundHeight;
      let topRight = corners[cellY + 1][cellX + 1].groundHeight;
      let sqX = x - cellX;
      let sqY = y - cellY;

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
