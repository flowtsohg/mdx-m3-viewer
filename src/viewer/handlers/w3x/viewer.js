import ModelViewer from '../../viewer';
import geoHandler from '../geo/handler';
import mdxHandler from '../mdx/handler';
import mpqHandler from '../mpq/handler';
import War3Map from '../../../parsers/w3x/map';
import War3MapW3e from '../../../parsers/w3x/war3map.w3e/file';
import IniFile from '../../../parsers/ini/file';
import SlkFile from '../../../parsers/slk/file';

export default class War3MapViewer extends ModelViewer {
  constructor(canvas) {
    super(canvas);

    this.addHandler(geoHandler);
    this.addHandler(mdxHandler);
    this.addHandler(mpqHandler);

    /** @member {?ModelViewer.parsers.w3x.War3Map} */
    this.mapFile = null;
    /** @member {function} */
    this.wc3PathSolver = wc3PathSolver;
    /** @member {?ModelViewer.parsers.mpq.Archive} */
    this.tilesetFile = null;

    this.iniData = null;
    this.slkData = null;

    this.tilesetTextures = null;

    console.log(this);
  }

  async loadMap(buffer, wc3PathSolver) {
    // Readonly mode to optimize memory usage.
    this.mapFile = new War3Map(buffer, true);

    this.wc3PathSolver = wc3PathSolver;


    let file = this.mapFile.get('war3map.w3e');

    if (!file) {
      throw new Error('Missing war3map.w3e');
    }

    let w3e = new War3MapW3e(file.arrayBuffer()),
      tileset = w3e.tileset,
      tilesetFile = this.load(tileset + '.mpq', wc3PathSolver);

    this.tilesetFile = tilesetFile;

    /*
units_slk = slk::SLK("Units/UnitData.slk");
units_slk.merge(slk::SLK("Units/UnitBalance.slk"));
units_slk.merge(slk::SLK("Units/unitUI.slk"));
units_slk.merge(slk::SLK("Units/UnitWeapons.slk"));
units_slk.merge(slk::SLK("Units/UnitAbilities.slk"));

units_slk.merge(ini::INI("Units/HumanUnitFunc.txt"));
units_slk.merge(ini::INI("Units/OrcUnitFunc.txt"));
units_slk.merge(ini::INI("Units/UndeadUnitFunc.txt"));
units_slk.merge(ini::INI("Units/NightElfUnitFunc.txt"));
units_slk.merge(ini::INI("Units/NeutralUnitFunc.txt"));

units_slk.merge(ini::INI("Units/HumanUnitStrings.txt"));
units_slk.merge(ini::INI("Units/OrcUnitStrings.txt"));
units_slk.merge(ini::INI("Units/UndeadUnitStrings.txt"));
units_slk.merge(ini::INI("Units/NightElfUnitStrings.txt"));
units_slk.merge(ini::INI("Units/NeutralUnitStrings.txt"));

units_meta_slk = slk::SLK("Units/UnitMetaData.slk");

items_slk = slk::SLK("Units/ItemData.slk");
items_slk.merge(ini::INI("Units/ItemFunc.txt"));
items_slk.merge(ini::INI("Units/ItemStrings.txt"));
doodads_slk = slk::SLK("Doodads/Doodads.slk");
doodads_meta_slk = slk::SLK("Doodads/DoodadMetaData.slk");
destructibles_slk = slk::SLK("Units/DestructableData.slk");
destructibles_meta_slk = slk::SLK("Units/DestructableMetaData.slk");
    */

    let iniFiles = {

    };

    let slkFiles = {
      terrain: this.load('TerrainArt\\Terrain.slk', wc3PathSolver),
      cliffTypes: this.load('TerrainArt\\CliffTypes.slk', wc3PathSolver),
    };

    // Wait for the tileset MPQ and all of the INI and SLK files to load.
    await this.whenLoaded([tilesetFile, ...Object.values(iniFiles), ...Object.values(slkFiles)]);

    let mapPathSolver = (src) => {
      // MPQ paths have backwards slashes...always? Don't know.
      let mpqPath = src.replace(/\//g, '\\');

      // If the file is in the map, return it.
      // Otherwise, if it's in the tileset MPQ, return it from there.
      let file = this.mapFile.get(mpqPath) || this.tilesetFile.get(mpqPath);
      if (file) {
        return [file.arrayBuffer(), src.substr(src.lastIndexOf('.')), false];
      }

      // Try to get the file from the game MPQs.
      return wc3PathSolver(src);
    };

    // Load the tileset textures
    this.tilesetTextures = [];

    for (let groundTileset of w3e.groundTilesets) {
      let row = slkFiles.terrain.getRow(groundTileset);

      this.tilesetTextures.push(this.load(`${row.dir}\\${row.file}.blp`, mapPathSolver));
    }

    console.log(this);
  }
};
