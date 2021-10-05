import { basename } from '../../common/path';
import { IniFile } from '../../parsers/ini/file';
import MdlxModel from '../../parsers/mdlx/model';
import War3MapImp from '../../parsers/w3x/imp/file';
import War3Map from '../../parsers/w3x/map';
import War3MapW3d from '../../parsers/w3x/w3d/file';
import War3MapW3i from '../../parsers/w3x/w3i/file';
import War3MapW3s from '../../parsers/w3x/w3s/file';
import War3MapW3u from '../../parsers/w3x/w3u/file';
import TokenStream from '../jass2/tokenstream';

function isModel(file: string): boolean {
  return file.endsWith('.mdx') || file.endsWith('.mdl');
}

function isTexture(file: string): boolean {
  return file.endsWith('.blp') || file.endsWith('.dds') || file.endsWith('.tga');
}

function isOther(file: string): boolean {
  return file.endsWith('.wav') || file.endsWith('.mp3') || file.endsWith('.slk') || file.endsWith('.txt');
}

function filterFile(files: string[], file: string): void {
  if (file.length > 6 && (isModel(file) || isTexture(file) || isOther(file))) {
    if (file.endsWith('.mdl')) {
      file = `${file.slice(0, -4)}.mdx`;
    }

    files.push(file.replace(/\\\\/g, '\\'));
  }
}

/**
 * Given a map, attempt to find all file names referenced in it.
 * 
 * Can be used with MpqArchive.applyListfile() to actually attempt to resolve the files in the archive.
 * 
 * Based on code generously shared by Ralle.
 */
export default function generateListfile(map: War3Map): Set<string> {
  const files = [
    '(listfile)',
    '(signature)',
    '(attributes)',
    'war3map.w3e',
    'war3map.w3i',
    'war3map.wtg',
    'war3map.wct',
    'war3map.wts',
    'war3map.j',
    'scripts\\war3map.j',
    'war3map.lua',
    'scripts\\war3map.lua',
    'war3map.shd',
    'war3mapMap.blp',
    'war3mapMap.b00',
    'war3mapMap.tga',
    'war3mapPreview.tga',
    'war3map.mmp',
    'war3mapPath.tga',
    'war3map.wpm',
    'war3map.doo',
    'war3mapUnits.doo',
    'war3map.w3r',
    'war3map.w3c',
    'war3map.w3s',
    'war3map.w3u',
    'war3map.w3t',
    'war3map.w3a',
    'war3map.w3b',
    'war3map.w3d',
    'war3map.w3q',
    'war3mapMisc.txt',
    'war3mapSkin.txt',
    'war3mapExtra.txt',
    'war3map.imp',
  ];

  // Listfile.
  let file = map.get('(listfile)');

  if (file) {
    try {
      const text = file.text();
      const lines = text.split(/\r\n/g);

      for (const line of lines) {
        files.push(line.trim());
      }
    } catch (e) {
      console.warn('(listfile)', e);
    }
  }

  // Object files.
  for (const objectFile of ['.w3u', '.w3t', '.w3b', '.w3d', '.w3a', '.w3h', '.w3q']) {
    file = map.get('war3map' + objectFile);

    if (file) {
      try {
        const bytes = file.bytes();
        let parser;

        if (objectFile === '.w3d' || objectFile === '.w3q' || objectFile === '.w3a') {
          parser = new War3MapW3d();
        } else {
          parser = new War3MapW3u();
        }

        parser.load(bytes);

        const tables = [
          parser.originalTable,
          parser.customTable,
        ];

        for (const table of tables) {
          for (const object of table.objects) {
            for (const modification of object.modifications) {
              // String
              if (modification.variableType === 3) {
                filterFile(files, <string>modification.value);
              }
            }
          }
        }
      } catch (e) {
        console.warn(file.name, e);
      }
    }
  }

  // Sounds.
  file = map.get('war3map.w3s');

  if (file) {
    try {
      const bytes = file.bytes();
      const parser = new War3MapW3s();

      parser.load(bytes);

      for (const sound of parser.sounds) {
        files.push(sound.file);
      }
    } catch (e) {
      console.warn('war3map.w3s', e);
    }
  }


  // Scripts.
  file = map.get('war3map.j') || map.get('Scripts\\war3map.j') || map.get('war3map.lua') || map.get('Scripts\\war3map.lua');

  if (file) {
    try {
      const text = file.text();
      const stream = new TokenStream(text);
      let token;

      while ((token = stream.read()) !== undefined) {
        if (token[0] === '"') {
          filterFile(files, token.slice(1, -1));
        }
      }
    } catch (e) {
      console.warn(file.name, e);
    }
  }

  // User interface replacements.
  file = map.get('war3mapSkin.txt');

  if (file) {
    try {
      const text = file.text();
      const config = new IniFile();

      config.load(text);

      for (const section of config.sections.values()) {
        for (const value of section.values()) {
          // We know the values are going to be strings.
          for (const token of value.split(',')) {
            filterFile(files, token);
          }
        }
      }
    } catch (e) {
      console.warn('war3mapSkin.txt', e);
    }
  }

  // Imports
  file = map.get('war3map.imp');

  if (file) {
    try {
      const bytes = file.bytes();
      const parser = new War3MapImp();

      parser.load(bytes);

      for (const file of parser.entries.keys()) {
        files.push(file);
      }
    } catch (e) {
      console.warn('war3map.imp', e);
    }
  }

  // Map information.
  file = map.get('war3map.w3i');

  if (file) {
    try {
      const bytes = file.bytes();
      const parser = new War3MapW3i();

      parser.load(bytes);

      filterFile(files, parser.loadingScreenModel);
      filterFile(files, parser.prologueScreenModel);
    } catch (e) {
      console.warn('war3map.w3i', e);
    }
  }

  // Model portraits
  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];

    if (isModel(file)) {
      files.push(`${file.slice(0, -4)}_portrait.mdx`); // MDL portraits?
    }
  }

  // Model textures.
  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];

    if (isModel(file)) {
      const actualFile = map.get(file);

      if (actualFile) {
        try {
          const bytes = actualFile.bytes();
          const parser = new MdlxModel();

          parser.load(bytes);

          for (const texture of parser.textures) {
            if (texture.path.length) {
              files.push(texture.path);
            }
          }

          for (const attachment of parser.attachments) {
            filterFile(files, attachment.path);
          }

          for (const emitter of parser.particleEmitters) {
            filterFile(files, emitter.path);
          }
        } catch (e) {
          console.warn(file, e);
        }
      }
    }
  }

  // Disabled icon versions.
  for (let i = 0, l = files.length; i < l; i++) {
    const file = files[i];

    if (isTexture(file)) {
      files.push(`ReplaceableTextures\\CommandButtonsDisabled\\DIS${basename(file)}`);
    }
  }


  return new Set(files);
}
