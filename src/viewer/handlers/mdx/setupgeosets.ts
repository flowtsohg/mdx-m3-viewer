import MdlxGeoset from '../../../parsers/mdlx/geoset';
import MdxModel from './model';
import Geoset from './geoset';
import Batch from './batch';

const NORMAL_BATCH = 0;
const EXTENDED_BATCH = 1;
const HD_BATCH = 2;

export default function setupGeosets(model: MdxModel, geosets: MdlxGeoset[]) {
  if (geosets.length > 0) {
    let gl = model.viewer.gl;
    let positionBytes = 0;
    let normalBytes = 0;
    let uvBytes = 0;
    let skinBytes = 0;
    let faceBytes = 0;
    let batchTypes = [];

    for (let i = 0, l = geosets.length; i < l; i++) {
      let geoset = geosets[i];

      if (geoset.lod === 0 || geoset.lod === -1) {
        let vertices = geoset.vertices.length / 3;

        positionBytes += vertices * 12;
        normalBytes += vertices * 12;
        uvBytes += geoset.uvSets.length * vertices * 8;

        if (geoset.skin.length) {
          skinBytes += vertices * 8;

          batchTypes[i] = HD_BATCH;
        } else {
          let biggestGroup = 0;

          for (let group of geoset.matrixGroups) {
            if (group > biggestGroup) {
              biggestGroup = group;
            }
          }

          if (biggestGroup > 4) {
            skinBytes += vertices * 9;

            batchTypes[i] = EXTENDED_BATCH;
          } else {
            skinBytes += vertices * 5;

            batchTypes[i] = NORMAL_BATCH;
          }
        }

        faceBytes += geoset.faces.byteLength;
      }
    }

    let positionOffset = 0;
    let normalOffset = positionOffset + positionBytes;
    let uvOffset = normalOffset + normalBytes;
    let skinOffset = uvOffset + uvBytes;
    let faceOffset = 0;
    let SkinTypedArray: typeof Uint8Array | typeof Uint16Array = Uint8Array;
    let skinGlType = gl.UNSIGNED_BYTE;

    if (model.bones.length > 255) {
      skinBytes *= 2;
      SkinTypedArray = Uint16Array;
      skinGlType = gl.UNSIGNED_SHORT;
    }

    model.skinDataType = skinGlType;
    model.bytesPerSkinElement = SkinTypedArray.BYTES_PER_ELEMENT;

    model.arrayBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, model.arrayBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, skinOffset + skinBytes, gl.STATIC_DRAW);

    model.elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, model.elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, faceBytes, gl.STATIC_DRAW);

    for (let i = 0, l = geosets.length; i < l; i++) {
      let geoset = geosets[i];

      if (geoset.lod === 0 || geoset.lod === -1) {
        let positions = geoset.vertices;
        let normals = geoset.normals;
        let uvSets = geoset.uvSets;
        let faces = geoset.faces;
        let skin;
        let vertices = geoset.vertices.length / 3;
        let batchType = batchTypes[i];

        if (batchType === HD_BATCH) {
          skin = geoset.skin;
        } else {
          let matrixIndices = geoset.matrixIndices;
          let vertexGroups = geoset.vertexGroups;
          let matrixGroups = [];
          let offset = 0;

          // Normally the shader supports up to 4 bones per vertex.
          // This is enough for almost every existing Warcraft 3 model.
          // That being said, there are a few models with geosets that need more, for example the Water Elemental.
          // These geosets use a different shader, which support up to 8 bones per vertex.
          let maxBones = 4;

          if (batchType === EXTENDED_BATCH) {
            maxBones = 8;
          }

          skin = new SkinTypedArray(vertices * (maxBones + 1));

          // Slice the matrix groups.
          for (let size of geoset.matrixGroups) {
            matrixGroups.push(matrixIndices.subarray(offset, offset + size));
            offset += size;
          }

          // Parse the skinning.
          for (let i = 0; i < vertices; i++) {
            let matrixGroup = matrixGroups[vertexGroups[i]];

            offset = i * (maxBones + 1);

            // Somehow in some bad models a vertex group index refers to an invalid matrix group.
            // Such models are still loaded by the game.
            if (matrixGroup) {
              let bones = Math.min(matrixGroup.length, maxBones);

              for (let j = 0; j < bones; j++) {
                skin[offset + j] = matrixGroup[j] + 1; // 1 is added to diffrentiate between matrix 0, and no matrix.
              }

              skin[offset + maxBones] = bones;
            }
          }
        }

        let vGeoset = new Geoset(model, model.geosets.length, positionOffset, normalOffset, uvOffset, skinOffset, faceOffset, vertices, faces.length);

        model.geosets.push(vGeoset);

        if (batchType === HD_BATCH) {
          model.batches.push(new Batch(model.batches.length, vGeoset, model.materials[geoset.materialId], false, true));
        } else {
          let isExtended = batchType === EXTENDED_BATCH;

          for (let layer of model.materials[geoset.materialId].layers) {
            model.batches.push(new Batch(model.batches.length, vGeoset, layer, isExtended, false));
          }
        }

        // Positions.
        gl.bufferSubData(gl.ARRAY_BUFFER, positionOffset, positions);
        positionOffset += positions.byteLength;

        // Normals.
        gl.bufferSubData(gl.ARRAY_BUFFER, normalOffset, normals);
        normalOffset += normals.byteLength;

        // Texture coordinates.
        for (let uvSet of uvSets) {
          gl.bufferSubData(gl.ARRAY_BUFFER, uvOffset, uvSet);
          uvOffset += uvSet.byteLength;
        }

        // Skin.
        gl.bufferSubData(gl.ARRAY_BUFFER, skinOffset, skin);
        skinOffset += skin.byteLength;

        // Faces.
        gl.bufferSubData(gl.ELEMENT_ARRAY_BUFFER, faceOffset, faces);
        faceOffset += faces.byteLength;
      }
    }
  }
}
