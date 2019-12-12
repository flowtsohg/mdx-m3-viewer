import BinaryStream from '../../common/binarystream';
import TokenStream from './tokenstream';
import Extent from './extent';

/**
 * A geoset.
 */
export default class Geoset {
  vertices: Float32Array = new Float32Array(0);
  normals: Float32Array = new Float32Array(0);
  faceTypeGroups: Uint32Array = new Uint32Array(0);
  faceGroups: Uint32Array = new Uint32Array(0);
  faces: Uint16Array = new Uint16Array(0);
  vertexGroups: Uint8Array = new Uint8Array(0);
  matrixGroups: Uint32Array = new Uint32Array(0);
  matrixIndices: Uint32Array = new Uint32Array(0);
  materialId: number = 0;
  selectionGroup: number = 0;
  selectionFlags: number = 0;
  /** 
   * @since 900
   */
  lod: number = 0;
  /** 
   * @since 900
   */
  lodName: string = '';
  extent: Extent = new Extent();
  sequenceExtents: Extent[] = [];
  /** 
   * @since 900
   */
  tangents: Float32Array = new Float32Array(0);
  /**
   * An array of bone indices and weights.
   * Every 8 consecutive elements describe the following:
   *    [B0, B1, B2, B3, W0, W1, W2, W3]
   * Where:
   *     Bn is a bone index.
   *     Wn is a weight, which can be normalized with Wn/255.
   *
   * @since 900
   */
  skin: Uint8Array = new Uint8Array(0);
  uvSets: Float32Array[] = [];

  readMdx(stream: BinaryStream, version: number) {
    stream.readUint32(); // Don't care about the size.

    stream.skip(4); // VRTX
    this.vertices = stream.readFloat32Array(stream.readUint32() * 3);
    stream.skip(4); // NRMS
    this.normals = stream.readFloat32Array(stream.readUint32() * 3);
    stream.skip(4); // PTYP
    this.faceTypeGroups = stream.readUint32Array(stream.readUint32());
    stream.skip(4); // PCNT
    this.faceGroups = stream.readUint32Array(stream.readUint32());
    stream.skip(4); // PVTX
    this.faces = stream.readUint16Array(stream.readUint32());
    stream.skip(4); // GNDX
    this.vertexGroups = stream.readUint8Array(stream.readUint32());
    stream.skip(4); // MTGC
    this.matrixGroups = stream.readUint32Array(stream.readUint32());
    stream.skip(4); // MATS
    this.matrixIndices = stream.readUint32Array(stream.readUint32());
    this.materialId = stream.readUint32();
    this.selectionGroup = stream.readUint32();
    this.selectionFlags = stream.readUint32();

    if (version > 800) {
      this.lod = stream.readUint32();
      this.lodName = stream.read(80);
    }

    this.extent.readMdx(stream);

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      let extent = new Extent();

      extent.readMdx(stream);

      this.sequenceExtents.push(extent);
    }

    // Non-reforged models that come with reforged are saved with version >800, however they don't have TANG and SKIN.
    if (version > 800 && stream.peek(4) === 'TANG') {
      stream.skip(4); // TANG
      this.tangents = stream.readFloat32Array(stream.readUint32() * 4);
    }

    if (version > 800 && stream.peek(4) === 'SKIN') {
      stream.skip(4); // SKIN
      this.skin = stream.readUint8Array(stream.readUint32());
    }

    stream.skip(4); // UVAS

    for (let i = 0, l = stream.readUint32(); i < l; i++) {
      stream.skip(4); // UVBS
      this.uvSets.push(stream.readFloat32Array(stream.readUint32() * 2));
    }
  }

  writeMdx(stream: BinaryStream, version: number) {
    stream.writeUint32(this.getByteLength(version));
    stream.write('VRTX');
    stream.writeUint32(this.vertices.length / 3);
    stream.writeFloat32Array(this.vertices);
    stream.write('NRMS');
    stream.writeUint32(this.normals.length / 3);
    stream.writeFloat32Array(this.normals);
    stream.write('PTYP');
    stream.writeUint32(this.faceTypeGroups.length);
    stream.writeUint32Array(this.faceTypeGroups);
    stream.write('PCNT');
    stream.writeUint32(this.faceGroups.length);
    stream.writeUint32Array(this.faceGroups);
    stream.write('PVTX');
    stream.writeUint32(this.faces.length);
    stream.writeUint16Array(this.faces);
    stream.write('GNDX');
    stream.writeUint32(this.vertexGroups.length);
    stream.writeUint8Array(this.vertexGroups);
    stream.write('MTGC');
    stream.writeUint32(this.matrixGroups.length);
    stream.writeUint32Array(this.matrixGroups);
    stream.write('MATS');
    stream.writeUint32(this.matrixIndices.length);
    stream.writeUint32Array(this.matrixIndices);
    stream.writeUint32(this.materialId);
    stream.writeUint32(this.selectionGroup);
    stream.writeUint32(this.selectionFlags);

    if (version > 800) {
      stream.writeUint32(this.lod);
      stream.write(this.lodName);
      stream.skip(80 - this.lodName.length);
    }

    this.extent.writeMdx(stream);

    stream.writeUint32(this.sequenceExtents.length);

    for (let sequenceExtent of this.sequenceExtents) {
      sequenceExtent.writeMdx(stream);
    }

    if (version > 800 && this.tangents.length) {
      stream.write('TANG');
      stream.writeFloat32Array(this.tangents);
      stream.write('SKIN');
      stream.writeUint8Array(this.skin);
    }

    stream.write('UVAS');
    stream.writeUint32(this.uvSets.length);

    for (let uvSet of this.uvSets) {
      stream.write('UVBS');
      stream.writeUint32(uvSet.length / 2);
      stream.writeFloat32Array(uvSet);
    }
  }

  readMdl(stream: TokenStream) {
    for (let token of stream.readBlock()) {
      if (token === 'Vertices') {
        this.vertices = stream.readVectorArray(new Float32Array(stream.readInt() * 3), 3);
      } else if (token === 'Normals') {
        this.normals = stream.readVectorArray(new Float32Array(stream.readInt() * 3), 3);
      } else if (token === 'TVertices') {
        this.uvSets.push(stream.readVectorArray(new Float32Array(stream.readInt() * 2), 2));
      } else if (token === 'VertexGroup') {
        // Vertex groups are stored in a block with no count, can't allocate the buffer yet.
        let vertexGroups = [];

        for (let vertexGroup of stream.readBlock()) {
          vertexGroups.push(parseInt(vertexGroup));
        }

        this.vertexGroups = new Uint8Array(vertexGroups);
      } else if (token === 'Faces') {
        // For now hardcoded for triangles, until I see a model with something different.
        this.faceTypeGroups = new Uint32Array([4]);

        stream.readInt(); // number of groups, irrelevant for now

        let count = stream.readInt();

        stream.read(); // {
        stream.read(); // Triangles
        stream.read(); // {

        this.faces = new Uint16Array(count);

        stream.readIntArray(this.faces);

        stream.read(); // }
        stream.read(); // }
      } else if (token === 'Groups') {
        let indices = [];
        let groups = [];

        stream.readInt(); // matrices count
        stream.readInt(); // total indices

        // eslint-disable-next-line no-unused-vars
        for (let matrix of stream.readBlock()) {
          let size = 0;

          for (let index of stream.readBlock()) {
            indices.push(parseInt(index));
            size += 1;
          }

          groups.push(size);
        }

        this.matrixIndices = new Uint32Array(indices);
        this.matrixGroups = new Uint32Array(groups);
      } else if (token === 'MinimumExtent') {
        stream.readFloatArray(this.extent.min);
      } else if (token === 'MaximumExtent') {
        stream.readFloatArray(this.extent.max);
      } else if (token === 'BoundsRadius') {
        this.extent.boundsRadius = stream.readFloat();
      } else if (token === 'Anim') {
        let extent = new Extent();

        for (token of stream.readBlock()) {
          if (token === 'MinimumExtent') {
            stream.readFloatArray(extent.min);
          } else if (token === 'MaximumExtent') {
            stream.readFloatArray(extent.max);
          } else if (token === 'BoundsRadius') {
            extent.boundsRadius = stream.readFloat();
          }
        }

        this.sequenceExtents.push(extent);
      } else if (token === 'MaterialID') {
        this.materialId = stream.readInt();
      } else if (token === 'SelectionGroup') {
        this.selectionGroup = stream.readInt();
      } else if (token === 'Unselectable') {
        this.selectionFlags = 4;
      } else {
        throw new Error(`Unknown token in Geoset: "${token}"`);
      }
    }
  }

  writeMdl(stream: TokenStream) {
    stream.startBlock('Geoset');

    stream.writeVectorArray('Vertices', this.vertices, 3);
    stream.writeVectorArray('Normals', this.normals, 3);

    for (let uvSet of this.uvSets) {
      stream.writeVectorArray('TVertices', uvSet, 2);
    }

    stream.startBlock('VertexGroup');
    for (let i = 0, l = this.vertexGroups.length; i < l; i++) {
      stream.writeLine(`${this.vertexGroups[i]},`);
    }
    stream.endBlock();

    // For now hardcoded for triangles, until I see a model with something different.
    stream.startBlock('Faces', 1, this.faces.length);
    stream.startBlock('Triangles');
    stream.writeLine(`{ ${this.faces.join(', ')} },`);
    stream.endBlock();
    stream.endBlock();

    stream.startBlock('Groups', this.matrixGroups.length, this.matrixIndices.length);
    let index = 0;
    for (let groupSize of this.matrixGroups) {
      stream.writeArrayAttrib('Matrices', this.matrixIndices.subarray(index, index + groupSize));
      index += groupSize;
    }
    stream.endBlock();

    this.extent.writeMdl(stream);

    for (let sequenceExtent of this.sequenceExtents) {
      stream.startBlock('Anim');
      sequenceExtent.writeMdl(stream);
      stream.endBlock();
    }

    stream.writeAttrib('MaterialID', this.materialId);
    stream.writeAttrib('SelectionGroup', this.selectionGroup);

    if (this.selectionFlags === 4) {
      stream.writeFlag('Unselectable');
    }

    stream.endBlock();
  }

  getByteLength(version: number) {
    let size = 120 + this.vertices.byteLength + this.normals.byteLength + this.faceTypeGroups.byteLength + this.faceGroups.byteLength + this.faces.byteLength + this.vertexGroups.byteLength + this.matrixGroups.byteLength + this.matrixIndices.byteLength + this.sequenceExtents.length * 28;

    if (version > 800) {
      size += 84;

      if (this.tangents.length) {
        size += 8 + this.tangents.byteLength + this.skin.byteLength;
      }
    }

    for (let uvSet of this.uvSets) {
      size += 8 + uvSet.byteLength;
    }

    return size;
  }
}
