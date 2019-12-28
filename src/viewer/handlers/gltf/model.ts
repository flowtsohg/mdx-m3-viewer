import Model from '../../model';
import Texture from '../../texture';
import GltfBufferView from './bufferview';
import GltfAccessor from './accessor';
import GltfMesh from './mesh';
import GltfMaterial from './material';
import GltfInstance from './modelinstance';
import GltfBatch from './batch';
import { setupGroups } from './groups';
import GltfBatchGroup from './batchgroup';

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
  groups: GltfBatchGroup[] = [];

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
  }

  loadGltf(buffer: string) {
    throw new Error('No GLTF support for now!');
  }
}
