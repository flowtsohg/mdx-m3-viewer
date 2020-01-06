import Model from '../../model';
import Texture from '../../texture';
import GltfBufferView from './bufferview';
import GltfAccessor from './accessor';
import GltfMesh from './mesh';
import { GltfMaterial } from './material';
import GltfInstance from './modelinstance';
import GltfBatch from './batch';
import { setupGroups } from './groups';
import GltfBatchGroup from './batchgroup';
import { getMaterialFlags, getMaterialDefines } from './flags';

const utf8decoder = new TextDecoder();

const MAGIC = 0x46546c67;

const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;

/**
 * A glTF model.
 */
export default class GltfModel extends Model {
  bufferViews: GltfBufferView[] = [];
  accessors: GltfAccessor[] = [];
  meshes: GltfMesh[] = [];
  textures: Texture[] = [];
  materials: GltfMaterial[] = [];
  nodes: object[] = [];
  scenes: object[] = [];
  batches: GltfBatch[] = [];
  opaqueGroups: GltfBatchGroup[] = [];
  translucentGroups: GltfBatchGroup[] = [];

  createInstance(type: number) {
    return new GltfInstance(this);
  }

  load(buffer: ArrayBuffer | string) {
    if (buffer instanceof ArrayBuffer) {
      this.loadGlb(buffer);
    } else {
      this.loadGltf(buffer);
    }
  }

  loadGlb(buffer: ArrayBuffer) {
    let uint32array = new Uint32Array(buffer);
    let magic = uint32array[0];
    let version = uint32array[1];
    let byteLength = uint32array[2];

    if (magic !== MAGIC) {
      throw new Error('WrongMagicNumber');
    }

    let uint8array = new Uint8Array(buffer);
    let offset = 12;

    let json = undefined;
    let buffers = [];

    while (offset < byteLength) {
      let intOffset = offset / 4;
      let chunkLength = uint32array[intOffset];
      let chunkType = uint32array[intOffset + 1];
      let begin = offset + 8;
      let end = begin + chunkLength;
      let buffer = uint8array.subarray(begin, end);

      if (chunkType === JSON_CHUNK && !json) {
        json = JSON.parse(utf8decoder.decode(buffer));
      } else if (chunkType === BIN_CHUNK) {
        buffers.push(buffer);
      }

      offset += 8 + chunkLength;
    }

    let viewer = this.viewer;
    let gl = viewer.gl;

    for (let bufferView of json.bufferViews) {
      this.bufferViews.push(new GltfBufferView(gl, bufferView, buffers[bufferView.buffer]))
    }

    for (let accessor of json.accessors) {
      this.accessors.push(new GltfAccessor(this, accessor));
    }

    for (let mesh of json.meshes) {
      this.meshes.push(new GltfMesh(this, mesh));
    }

    if (json.textures !== undefined) {
      for (let texture of json.textures) {
        let image = json.images[texture.source];
        let sampler = json.samplers[texture.sampler];
        let bufferView = this.bufferViews[image.bufferView];
        let blob = new Blob([<Uint8Array>bufferView.buffer], { type: image.mimeType });
        let url = URL.createObjectURL(blob);
        let viewerTexture = <Texture>viewer.load(url, () => [url, '.png', true]);

        viewerTexture.wrapS = sampler.wrapS || gl.CLAMP_TO_EDGE;
        viewerTexture.wrapT = sampler.wrapT || gl.CLAMP_TO_EDGE;
        viewerTexture.magFilter = sampler.magFilter || gl.LINEAR;
        viewerTexture.minFilter = sampler.minFilter || gl.LINEAR;

        this.textures.push(viewerTexture);
      }
    }

    for (let material of json.materials) {
      this.materials.push(new GltfMaterial(this, material));
    }



    this.textures[0] = <Texture>viewer.load(new ImageData(new Uint8ClampedArray([0, 0, 0, 0]), 1, 1));

    this.meshes[0].primitives[0].material = 1;
    this.meshes[1].primitives[0].material = 0;
    this.meshes[2].primitives[0].material = 0;

    this.materials[0].baseColorFactor.set([1, 0.766, 0.336, 1]);
    this.materials[0].metallicFactor = 0.8;
    this.materials[0].roughnessFactor = 0.2;

    this.materials[1].alphaMode = 1;
    //this.materials[1].alphaCutoff = 0.9;
    this.materials[1].baseColorFactor.set([1, 1, 1, 1]);
    this.materials[1].baseColorTexture = 0;
    this.materials[1].metallicFactor = 0;
    this.materials[1].roughnessFactor = 0.2;
    this.materials[1].flags = getMaterialFlags(this.materials[1]);



    this.nodes.push(...json.nodes);
    this.scenes.push(...json.scenes);

    for (let i = 0, l = json.nodes.length; i < l; i++) {
      let node = json.nodes[i];

      if (node.mesh !== undefined) {
        let mesh = this.meshes[node.mesh];

        for (let primitive of mesh.primitives) {
          this.batches.push(new GltfBatch(i, primitive, this.materials[primitive.material]));
        }
      }
    }

    setupGroups(this);

    console.log(json)
    console.log(this)
  }

  loadGltf(buffer: string) {
    throw new Error('No GLTF support for now!');
  }
}
