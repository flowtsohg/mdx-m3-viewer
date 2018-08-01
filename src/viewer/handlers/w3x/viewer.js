import {vec3} from 'gl-matrix';
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
import geoHandler from '../geo/handler';
import mdxHandler from '../mdx/handler';
import shaders from './shaders';
import getCliffVariation from './variations';
import TerrainModel from './terrainmodel';
import SimpleModel from './simplemodel';

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

    this.batchSize = 256;

    this.on('error', (target, error, reason) => console.error(target, error, reason));

    this.addHandler(geoHandler);
    this.addHandler(mdxHandler);

    /** @member {function} */
    this.wc3PathSolver = wc3PathSolver;

    this.groundShader = this.loadShader('Ground', shaders.vsGround, shaders.fsGround);
    this.waterShader = this.loadShader('Water', shaders.vsWater, shaders.fsWater);
    this.cliffShader = this.loadShader('Cliffs', shaders.vsCliffs, shaders.fsCliffs);
    this.simpleModelShader = this.loadShader('SimpleModel', shaders.vsSimpleModel, shaders.fsSimpleModel);

    this.scene = this.addScene();
    this.camera = this.scene.camera;
    this.camera2 = this.scene.camera2;

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

      gl.disable(gl.BLEND);

      webgl.useShaderProgram(shader);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera2.worldProjectionMatrix);
      gl.uniform2fv(uniforms.u_offset, centerOffset);
      gl.uniform2f(uniforms.u_size, columns - 1, rows - 1);
      gl.uniform1i(uniforms.u_heightMap, 0);
      gl.uniform1i(uniforms.u_tilesets, 1);
      gl.uniform1f(uniforms.u_tilesetHeight, 1 / (tilesetTextures.length + 1));
      gl.uniform1f(uniforms.u_tilesetCount, tilesetTextures.length + 1);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, heightMap);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, this.tilesetsTexture);

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

      instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, instanceCount);

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

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera2.worldProjectionMatrix);
      gl.uniform2fv(uniforms.u_offset, centerOffset);
      gl.uniform2f(uniforms.u_size, columns - 1, rows - 1);
      gl.uniform1i(uniforms.u_heightMap, 0);
      gl.uniform1i(uniforms.u_waterHeightMap, 1);
      gl.uniform1i(uniforms.u_waterMap, 2);
      gl.uniform1f(uniforms.u_offsetHeight, this.waterHeightOffset);
      gl.uniform1f(uniforms.u_tileIndex, this.waterIndex | 0);
      gl.uniform4fv(uniforms.u_maxDeepColor, this.maxDeepColor);
      gl.uniform4fv(uniforms.u_minDeepColor, this.minDeepColor);
      gl.uniform4fv(uniforms.u_maxShallowColor, this.maxShallowColor);
      gl.uniform4fv(uniforms.u_minShallowColor, this.minShallowColor);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, heightMap);

      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, waterHeightMap);

      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, this.waterTexture);

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

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera2.worldProjectionMatrix);
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
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 1);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceTexture, 1);

      // Render the cliffs.
      for (let cliff of this.cliffModels) {
        cliff.render(gl, instancedArrays, attribs);
      }

      // Clear instanced attributes.
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 0);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceTexture, 0);
    }
  }

  /**
   * 
   */
  renderDoodads(opaque) {
    if (this.doodadsReady) {
      let gl = this.gl;
      let instancedArrays = gl.extensions.instancedArrays;
      let webgl = this.webgl;
      let shader = this.simpleModelShader;
      let attribs = shader.attribs;
      let uniforms = shader.uniforms;

      webgl.useShaderProgram(shader);

      gl.uniformMatrix4fv(uniforms.u_mvp, false, this.camera2.worldProjectionMatrix);
      gl.uniform1i(uniforms.u_texture, 0);

      gl.activeTexture(gl.TEXTURE0);

      // Enable instancing.
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 1);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceRotation, 1);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceScale, 1);

      // Render the dooadads.
      for (let doodad of this.doodads) {
        if (opaque) {
          doodad.renderOpaque(gl, instancedArrays, uniforms, attribs);
        } else {
          doodad.renderTranslucent(gl, instancedArrays, uniforms, attribs);
        }
      }

      // Render the terrain doodads.
      for (let doodad of this.terrainDoodads) {
        if (opaque) {
          doodad.renderOpaque(gl, instancedArrays, uniforms, attribs);
        } else {
          doodad.renderTranslucent(gl, instancedArrays, uniforms, attribs);
        }
      }

      // Disable instancing.
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instancePosition, 0);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceRotation, 0);
      instancedArrays.vertexAttribDivisorANGLE(attribs.a_instanceScale, 0);
    }
  }

  /**
   * Render the map.
   */
  render() {
    if (this.anyReady) {
      this.gl.viewport(...this.camera2.viewport);

      this.renderGround();
      this.renderCliffs();
      this.renderDoodads(true);
      super.renderOpaque();
      this.renderDoodads(false);
      super.renderTranslucent();
      this.renderWater();
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
   * @param {*} buffer 
   */
  async loadMap(buffer) {
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
      this.once('doodadsloaded', () => this.loadDoodadsAndDestructibles());
    }

    if (this.unitsAndItemsLoaded) {
      this.loadUnitsAndItems(modifications);
    } else {
      this.once('unitsloaded', () => this.loadUnitsAndItems());
    }
  }

  /**
   * 
   * @param {*} modifications 
   */
  loadDoodadsAndDestructibles(modifications) {
    this.applyModificationFile(this.doodadsData, this.doodadMetaData, modifications.w3d);
    this.applyModificationFile(this.doodadsData, this.destructableMetaData, modifications.w3b);

    let doo = new War3MapDoo(this.mapMpq.get('war3map.doo').arrayBuffer());
    let doodads = {};

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
        fileVar += Math.max(doodad.variation, numVar - 1);
      }

      fileVar += '.mdx';

      if (!doodads[file]) {
        doodads[file] = {file, fileVar, instances: 0, instanceData: []};
      }

      let location = doodad.location;
      let angle = doodad.angle / 2;
      let scale = doodad.scale;

      doodads[file].instances += 1;
      doodads[file].instanceData.push(...location, Math.sin(angle), Math.cos(angle), scale[0]);
    }

    // Load the models.
    for (let object of Object.values(doodads)) {
      // First see if the model is local.
      // Doodads refering to local models may have invalid variations, so if the variation doesn't exist, try without a variation.
      let mpqFile = this.mapMpq.get(object.fileVar) || this.mapMpq.get(object.file);

      // If it's a local file, load it.
      // Otherwise, fetch and then load it.
      if (mpqFile) {
        this.doodads.push(new SimpleModel(this, mpqFile.arrayBuffer(), object.instances, object.instanceData));
      } else {
        this.loadGeneric(this.mapPathSolver(object.fileVar)[0], 'arrayBuffer').whenLoaded()
          .then((resource) => {
            this.doodads.push(new SimpleModel(this, resource.data, object.instances, object.instanceData));
          });
      }
    }

    this.doodadsReady = true;
    this.anyReady = true;

    // let centerOffset = this.centerOffset;
    // let terrainDoodads = {};

    // // Collect the doodad and destructible data.
    // for (let doodad of doo.terrainDoodads) {
    //   let row = this.doodadsData.getRow(doodad.id);
    //   let file = row.file;

    //   if (file.endsWith('.mdl')) {
    //     file = file.slice(0, -4);
    //   }

    //   file += '.mdx';

    //   if (!terrainDoodads[file]) {
    //     terrainDoodads[file] = {file, matrices: []};
    //   }

    //   //Height?
    //   let location = doodad.location;

    //   terrainDoodads[file].matrices.push(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, location[0] * 128 + centerOffset[0], location[1] * 128 + centerOffset[1], 0, 1);
    // }

    // // Load the models.
    // for (let object of Object.values(terrainDoodads)) {
    //   // First see if the model is local.
    //   // Doodads refering to local models may have invalid variations, so if the variation doesn't exist, try without a variation.
    //   let mpqFile = this.mapMpq.get(object.file);

    //   // If it's a local file, load it.
    //   // Otherwise, fetch and then load it.
    //   if (mpqFile) {
    //     this.terrainDoodads.push(new SimpleModel(this, mpqFile.arrayBuffer(), object.matrices));
    //   } else {
    //     this.loadGeneric(this.mapPathSolver(object.file)[0], 'arrayBuffer').whenLoaded()
    //       .then((resource) => {
    //         this.terrainDoodads.push(new SimpleModel(this, resource.data, object.matrices));
    //       });
    //   }
    // }
  }

  /**
   * 
   * @param {*} modifications 
   */
  loadUnitsAndItems(modifications) {
    this.applyModificationFile(this.unitsData, this.unitMetaData, modifications.w3u);
    this.applyModificationFile(this.unitsData, this.unitMetaData, modifications.w3t);

    let unitsDoo = new War3MapUnitsDoo(this.mapMpq.get('war3mapUnits.doo').arrayBuffer());
    let scene = this.scene;

    // Collect the units and items data.
    for (let unit of unitsDoo.units) {
      let path;

      // Hardcoded?
      if (unit.id === 'sloc') {
        path = 'Objects\\StartLocation\\StartLocation.mdx';
      } else {
        let row = this.unitsData.getRow(unit.id);

        path = row.file;

        if (path.endsWith('.mdl')) {
          path = path.slice(0, -4);
        }

        path += '.mdx';
      }

      if (path) {
        let model = this.load(path);
        let instance = model.addInstance();

        //let normal = this.groundNormal([], unit.location[0], unit.location[1]);

        instance.move(unit.location);
        instance.rotateLocal(quat.setAxisAngle(quat.create(), VEC3_UNIT_Z, unit.angle));
        instance.scale(unit.scale);
        instance.setTeamColor(unit.player);
        instance.setSequence(0);
        instance.setScene(scene);
      } else {
        console.log('Unknown unit ID', unit.id, unit)
      }
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

    await this.whenLoaded([...this.tilesetTextures, ...this.waterTextures]);

    let gl = this.gl;

    this.createTilesetsAndWaterTextures();

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

              // ?
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

            cornerTextures[instance * 4] = textures[0] + 1;
            cornerVariations[instance * 4] = this.getVariation(textures[0], bottomLeft.groundVariation);

            textures.shift();

            for (let i = 0, l = textures.length; i < l; i++) {
              let texture = textures[i];
              let bitset = 0;

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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, cliffHeights);

    let heightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, heightMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.ALPHA, columns, rows, 0, gl.ALPHA, gl.FLOAT, cornerHeights);

    let waterHeightMap = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, waterHeightMap);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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
          return new TerrainModel(gl, resource.data, locations, textures);
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
   * Creates a shared texture that holds all of the tileset textures.
   * Each tileset is flattend to a single row of tiles, such that indices 0-15 are the normal part, and indices 16-31 are the extended part.
   */
  createTilesetsAndWaterTextures() {
    let tilesets = this.tilesetTextures;
    let tilesetsCount = tilesets.length;
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');

    canvas.width = 2048;
    canvas.height = 64 * (tilesetsCount + 1); // 1 is added for a black tileset, to remove branches from the fragment shader, at the cost of 512Kb.

    for (let tileset = 0; tileset < tilesetsCount; tileset++) {
      let imageData = tilesets[tileset].imageData;

      for (let variation = 0; variation < 16; variation++) {
        let x = (variation % 4) * 64;
        let y = ((variation / 4) | 0) * 64;

        ctx.putImageData(imageData, variation * 64 - x, (tileset + 1) * 64 - y, x, y, 64, 64);
      }

      if (imageData.width === 512) {
        for (let variation = 0; variation < 16; variation++) {
          let x = 256 + (variation % 4) * 64;
          let y = ((variation / 4) | 0) * 64;

          ctx.putImageData(imageData, 1024 + variation * 64 - x, (tileset + 1) * 64 - y, x, y, 64, 64);
        }
      }
    }

    let gl = this.gl;
    let texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

    this.tilesetsTexture = texture;

    canvas.height = 128 * 3; // up to 48 frames.

    let waterTextures = this.waterTextures;

    for (let i = 0, l = waterTextures.length; i < l; i++) {
      let x = i % 16;
      let y = (i / 16) | 0;

      ctx.putImageData(waterTextures[i].imageData, x * 128, y * 128);
    }

    let waterTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, waterTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);

    this.waterTexture = waterTexture;
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

  load(src) {
    return super.load(src, this.mapPathSolver);
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
      let row = dataMap.getRow(modificationObject.oldId);
      let newId = modificationObject.newId;

      // If this is a custom object, and it's not in the mapped data, copy the standard object.
      if (modificationObject.newId !== '' && !dataMap.getRow(newId)) {
        dataMap.setRow(modificationObject.newId, {...row});
      }

      for (let modification of modificationObject.modifications) {
        let metadata = metadataMap.getRow(modification.id);

        if (metadata) {
          row[metadata.field] = modification.value;
        } else {
          console.warn('Unknown modification ID', modification.id);
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
