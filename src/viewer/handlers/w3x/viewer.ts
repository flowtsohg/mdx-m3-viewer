import { FetchDataTypeName } from '../../../common/fetchdatatype';
import { MappedData } from '../../../utils/mappeddata';
import ModelViewer from '../../viewer';
import Shader from '../../gl/shader';
import { PathSolver } from '../../handlerresource';
import mdxHandler from '../mdx/handler';
import blpHandler from '../blp/handler';
import tgaHandler from '../tga/handler';
import ddsHandler from '../dds/handler';
import groundVert from './shaders/ground.vert';
import groundFrag from './shaders/ground.frag';
import waterVert from './shaders/water.vert';
import waterFrag from './shaders/water.frag';
import cliffsVert from './shaders/cliffs.vert';
import cliffsFrag from './shaders/cliffs.frag';
import War3MapViewerMap from './map';
import GenericResource from '../../genericresource';

export default class War3MapViewer extends ModelViewer {
  wc3PathSolver: PathSolver;
  isReforged: boolean;
  groundShader: Shader;
  waterShader: Shader;
  cliffShader: Shader;
  terrainData = new MappedData();
  cliffTypesData = new MappedData();
  waterData = new MappedData();
  doodadsData = new MappedData();
  doodadMetaData = new MappedData();
  destructableMetaData = new MappedData();
  unitsData = new MappedData();
  unitMetaData = new MappedData();
  loadedBaseFiles = false;
  map: War3MapViewerMap | null = null;

  constructor(canvas: HTMLCanvasElement, wc3PathSolver: PathSolver, isReforged: boolean) {
    super(canvas);

    const webgl = this.webgl;

    // Data textures.
    if (!webgl.ensureExtension('OES_texture_float')) {
      throw new Error('War3MapViewer: No float texture support!');
    }

    // Optionally used for cliff renering.
    if (!webgl.ensureExtension('OES_vertex_array_object')) {
      console.warn('War3MapViewer: No vertex array object support! This might reduce performance.');
    }

    this.on('error', (e) => console.log(e));

    this.addHandler(mdxHandler, wc3PathSolver, isReforged);
    this.addHandler(blpHandler);
    this.addHandler(tgaHandler);
    this.addHandler(ddsHandler);

    this.wc3PathSolver = wc3PathSolver;
    this.isReforged = isReforged;

    this.groundShader = this.webgl.createShader(groundVert, groundFrag);
    this.waterShader = this.webgl.createShader(waterVert, waterFrag);
    this.cliffShader = this.webgl.createShader(cliffsVert, cliffsFrag);

    this.loadBaseFiles();
  }

  async loadBaseFiles(): Promise<void> {
    const promises = [
      this.loadBaseFile('TerrainArt\\Terrain.slk', 'text'),
      this.loadBaseFile('TerrainArt\\CliffTypes.slk', 'text'),
      this.loadBaseFile('TerrainArt\\Water.slk', 'text'),
      this.loadBaseFile('Doodads\\Doodads.slk', 'text'),
      this.loadBaseFile('Doodads\\DoodadMetaData.slk', 'text'),
      this.loadBaseFile('Units\\DestructableData.slk', 'text'),
      this.loadBaseFile('Units\\DestructableMetaData.slk', 'text'),
      this.loadBaseFile('Units\\UnitData.slk', 'text'),
      this.loadBaseFile('Units\\unitUI.slk', 'text'),
      this.loadBaseFile('Units\\ItemData.slk', 'text'),
      this.loadBaseFile('Units\\UnitMetaData.slk', 'text'),
    ];

    let reforgedPromises;

    if (this.isReforged) {
      reforgedPromises = [
        this.loadBaseFile('Doodads\\doodadSkins.txt', 'text'),
        this.loadBaseFile('Units\\destructableSkin.txt', 'text'),
        this.loadBaseFile('Units\\unitSkin.txt', 'text'),
        this.loadBaseFile('Units\\itemSkin.txt', 'text'),
      ];
    }

    const [terrain, cliffTypes, water, doodads, doodadMetaData, destructableData, destructableMetaData, unitData, unitUi, itemData, unitMetaData] = await Promise.all(promises);

    if (!terrain || !cliffTypes || !water || !doodads || !doodadMetaData || !destructableData || !destructableMetaData || !unitData || !unitUi || !itemData || !unitMetaData) {
      throw new Error('Failed to load the base files');
    }

    this.terrainData.load(<string>terrain.data);
    this.cliffTypesData.load(<string>cliffTypes.data);
    this.waterData.load(<string>water.data);
    this.doodadsData.load(<string>doodads.data);
    this.doodadMetaData.load(<string>doodadMetaData.data);
    this.doodadsData.load(<string>destructableData.data);
    this.destructableMetaData.load(<string>destructableMetaData.data);
    this.unitsData.load(<string>unitData.data);
    this.unitsData.load(<string>unitUi.data);
    this.unitsData.load(<string>itemData.data);
    this.unitMetaData.load(<string>unitMetaData.data);

    if (reforgedPromises) {
      const [doodadSkins, destructableSkin, unitSkin, itemSkin] = await Promise.all(reforgedPromises);

      if (!doodadSkins || !destructableSkin || !unitSkin || !itemSkin) {
        throw new Error('Failed to load the base Reforged files');
      }

      this.doodadsData.load(<string>doodadSkins.data);
      this.doodadsData.load(<string>destructableSkin.data);
      this.unitsData.load(<string>unitSkin.data);
      this.unitsData.load(<string>itemSkin.data);
    }

    this.loadedBaseFiles = true;
    this.emit('loadedbasefiles');
  }

  loadBaseFile(path: string, dataType: FetchDataTypeName): Promise<GenericResource | undefined> {
    return super.loadGeneric(<string>this.wc3PathSolver(path), dataType);
  }

  /**
   * Load a map from a buffer.
   */
  loadMap(buffer: ArrayBuffer | Uint8Array): void {
    if (this.loadedBaseFiles) {
      if (this.map) {
        this.map.die();
      }

      this.map = new War3MapViewerMap(this, buffer);
    }
  }

  /**
   * Update the map.
   */
  override update(): void {
    if (this.map) {
      super.update();

      this.map.update();
    }
  }

  /**
   * Render the map.
   */
  override render(): void {
    if (this.map) {
      this.map.render();
    }
  }
}
