Mdx.Geoset = function (geoset) {
    var i, l, j, k;
    var positions = geoset.vertices;
    var normals = geoset.normals;
    var textureCoordinateSets = geoset.textureCoordinateSets;
    var uvsetSize = textureCoordinateSets[0].length * 2;
    var vertices = positions.length / 3;
    var uvs = new Float32Array(textureCoordinateSets.length * uvsetSize);
    var boneIndices = new Uint8Array(vertices * 4);
    var boneNumbers = new Uint8Array(vertices);
    var faces = geoset.faces;
    var edges = new Uint16Array(faces.length * 2);
    var matrixGroups = [];
    
    this.index = geoset.index;
    this.materialId = geoset.materialId;
    
    for (i = 0, l = faces.length, k = 0; i < l; i += 3, k += 6) {
        edges[k + 0] = faces[i + 0];
        edges[k + 1] = faces[i + 1];
        edges[k + 2] = faces[i + 1];
        edges[k + 3] = faces[i + 2];
        edges[k + 4] = faces[i + 2];
        edges[k + 5] = faces[i + 0];
    }
  
    // Make one typed array for the texture coordinates, in case there are multiple ones
    for (i = 0, l = textureCoordinateSets.length; i < l; i++) {
        uvs.set(textureCoordinateSets[i], i * uvsetSize);
    }
  
    // Parse the bone indices
    for (i = 0, l = geoset.matrixGroups.length, k = 0; i < l; i++) {
        matrixGroups.push(geoset.matrixIndexes.subarray(k, k + geoset.matrixGroups[i]));
        k += geoset.matrixGroups[i];
    }
  
    for (i = 0, l = vertices, k = 0; i < l; i++) {
        var matrixGroup = matrixGroups[geoset.vertexGroups[i]];
        var count = 0;

        // 1 is added to every index for shader optimization.
        for (j = 0; j < 4; j++) {
            if (matrixGroup && j < matrixGroup.length) {
                boneIndices[k] = matrixGroup[j] + 1;
                count += 1;
            } else {
                boneIndices[k] = 0;
            }

            k += 1;
        }

        boneNumbers[i] = count;
    }

    this.locationArray = positions;
    this.normalArray = normals;
    this.uvsArray = uvs;
    this.boneIndexArray = boneIndices;
    this.boneNumberArray = boneNumbers;
    this.faceArray = faces;
    this.edgeArray = edges;
    this.uvSetSize = uvsetSize * 4;
};
