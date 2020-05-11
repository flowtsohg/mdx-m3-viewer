import TokenStream from '../parsers/mdlx/tokenstream';

/**
 * The structure of a source map node.
 */
interface SourceNode {
  name: string;
  ident: number;
  start: number;
  end: number;
  data: string;
  children: SourceNode[];
  index?: number;
  objectName?: string;
}

/**
 * The need data for a single source map creation.
 */
class SourceMapData {
  stream: TokenStream;
  rootNode: SourceNode;
  stack: SourceNode[];
  counts: NumberObject = {};
  ident: number = 0;
  searchBitmapName: boolean = false;
  lookingForAnimName: boolean = false;

  constructor(stream: TokenStream) {
    this.stream = stream;
    this.rootNode = { name: 'root', ident: 0, start: 0, end: stream.buffer.length, data: '', children: [] };
    this.stack = [this.rootNode];
  }
}

// Names of chunk blocks.
let chunkNames = [
  'Version',
  'Model',
  'Sequences',
  'GlobalSequences',
  'Textures',
  'Materials',
  'TextureAnims',
  'PivotPoints',
  'FaceFX',
  'BindPose',
];

// Names of object blocks.
let objectNames = [
  'Anim',
  'Bitmap',
  'Material',
  'Layer',
  'TVertexAnim',
  'Geoset',
  'GeosetAnim',
];

// Names of generic object blocks.
let genericObjectNames = [
  'Bone',
  'Light',
  'Helper',
  'Attachment',
  'ParticleEmitter',
  'ParticleEmitter2',
  'ParticleEmitterPopcorn',
  'RibbonEmitter',
  'Camera',
  'EventObject',
  'CollisionShape',
];

/**
 * Test if a token starts a block.
 */
function isTokenBlock(data: SourceMapData, name: string) {
  if (name === 'Anim') {
    // Geosets call their animated extents Anim too, so have to check if the parent is the sequences chunk.
    return data.stack[0].name === 'Sequences';
  }

  return chunkNames.includes(name) || objectNames.includes(name) || genericObjectNames.includes(name);
}

/**
 * Start a new block and add it to the stack.
 */
function startBlock(data: SourceMapData, name: string) {
  let counts = data.counts;
  let countName = name;
  let stream = data.stream;
  let node = <SourceNode>{ name, ident: data.ident, start: stream.index - name.length - 1, end: 0, data: '', children: [] };

  // Don't index blocks, just objects.
  if (!chunkNames.includes(name)) {
    // Need to separate layer indices per material.
    if (name === 'Layer') {
      let material = data.stack[0];

      countName = `Material${material.index}${name}`;
    }

    if (counts[countName] === undefined) {
      counts[countName] = 0;
    }

    let index = counts[countName]++;

    node.index = index;
  }

  // Texture names depend on the path or replaceable ID, both of which are not known.
  // Therefore, start looking for them.
  if (name === 'Bitmap') {
    data.searchBitmapName = true;
  }

  // Animations and generic objects store the name in the next token.
  if (name === 'Anim' || genericObjectNames.includes(name)) {
    node.objectName = stream.read();
  }

  data.stack[0].children.push(node);
  data.stack.unshift(node);
}

/**
 * End the current block on the stack.
 */
function endBlock(data: SourceMapData) {
  let stream = data.stream;
  let node = data.stack[0];

  node.end = stream.index;
  node.data = stream.buffer.slice(node.start, node.end);

  data.stack.shift();
}

/**
 * Generate a source map from MDL source.
 */
export default function mdlSourceMap(buffer: string) {
  let stream = new TokenStream(buffer);
  let data = new SourceMapData(stream);
  let token;

  // There are empty strings, e.g. in replaceable textures.
  // Empty strings evaluate to false in JS.
  // Therefore compare against undefined directly.
  while ((token = stream.readToken()) !== undefined) {
    if (token === '{') {
      data.ident += 1;
    } else if (token === '}') {
      data.ident -= 1;

      if (data.ident === data.stack[0].ident) {
        endBlock(data);
      }
    } else if (data.searchBitmapName && (token === 'ReplaceableId' || token === 'Image')) {
      if (token === 'ReplaceableId') {
        let replacebleId = stream.read();

        if (replacebleId !== '0') {
          data.lookingForAnimName = false;
          data.stack[0].objectName = `ReplaceableId ${replacebleId}`;
        }
      } else if (token === 'Image') {
        let image = <string>stream.read();

        if (image !== '') {
          data.lookingForAnimName = false;
          data.stack[0].objectName = image.split('\\').slice(-1)[0]; // Discard the path leading to the file name itself.
        }
      }
    } else if (isTokenBlock(data, token)) {
      startBlock(data, token);
    }
  }

  return data.rootNode;
}
