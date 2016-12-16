function MdxShallowGeoset(offsets, uvSetSize, elements, model) {
    this.model = model;
    this.offsets = offsets;
    this.uvSetSize = uvSetSize;
    this.elements = elements;
}

MdxShallowGeoset.prototype = {
    bind(shader, coordId) {
        let gl = this.model.env.gl,
            offsets = this.offsets,
            attribs = shader.attribs;

        gl.vertexAttribPointer(attribs.get("a_position"), 3, gl.FLOAT, false, 12, offsets[0]);
        gl.vertexAttribPointer(attribs.get("a_bones"), 4, gl.UNSIGNED_BYTE, false, 4, offsets[3]);
        gl.vertexAttribPointer(attribs.get("a_boneNumber"), 4, gl.UNSIGNED_BYTE, false, 4, offsets[4]);
        gl.vertexAttribPointer(attribs.get("a_normal"), 3, gl.FLOAT, false, 12, offsets[1]);
        gl.vertexAttribPointer(attribs.get("a_uv"), 2, gl.FLOAT, false, 8, offsets[2] + coordId * this.uvSetSize);
    },

    render(instances) {
        let gl = this.model.gl;

        gl.extensions.instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offsets[5], instances);
    }
};

function MdxGeoset(geoset, geosetAnimations) {
    let positions = geoset.vertices,
        normals = geoset.normals,
        textureCoordinateSets = geoset.textureCoordinateSets,
        uvsetSize = textureCoordinateSets[0].length,
        vertices = positions.length / 3,
        uvs,
        boneIndices = new Uint8Array(vertices * 4),
        boneNumbers = new Uint32Array(vertices),
        matrixGroups = geoset.matrixGroups,
        matrixIndexes = geoset.matrixIndexes,
        slices = [],
        i, l, j, k;

    // Make one typed array for the texture coordinates, in case there are multiple ones
    if (textureCoordinateSets.length > 1) {
        uvs = new Float32Array(textureCoordinateSets.length * uvsetSize);

        for (i = 0, l = textureCoordinateSets.length; i < l; i++) {
            uvs.set(textureCoordinateSets[i], i * uvsetSize);
        }
    } else {
        uvs = textureCoordinateSets[0];
    }

    // Parse the bone indices by slicing the matrix groups
    for (i = 0, l = matrixGroups.length, k = 0; i < l; i++) {
        slices.push(matrixIndexes.subarray(k, k + matrixGroups[i]));
        k += matrixGroups[i];
    }

    // Construct the final bone arrays
    for (i = 0, l = vertices, k = 0; i < l; i++) {
        let slice = slices[geoset.vertexGroups[i]],
            bones = 0;

        // 1 is added to every index for shader optimization (index 0 is a zero matrix)
        for (j = 0; j < 4; j++, k++) {
            if (slice && j < slice.length) {
                boneIndices[k] = slice[j] + 1;
                bones += 1;
            } else {
                boneIndices[k] = 0;
            }
        }

        boneNumbers[i] = bones;
    }

    this.index = geoset.index;
    this.materialId = geoset.materialId;
    this.locationArray = positions;
    this.normalArray = normals;
    this.uvsArray = uvs;
    this.boneIndexArray = boneIndices;
    this.boneNumberArray = boneNumbers;
    this.faceArray = geoset.faces;
    this.uvSetSize = uvsetSize * 4;

    for (i = 0, l = geosetAnimations.length; i < l; i++) {
        if (geosetAnimations[i].geosetId === geoset.index) {
            this.geosetAnimation = geosetAnimations[i];
        }
    }
}

MdxGeoset.prototype = {
    getAlpha(instance) {
        if (this.geosetAnimation) {
            return this.geosetAnimation.getAlpha(instance);
        }

        return 1;
    },

    isAlphaVariant(sequence) {
        if (this.geosetAnimation) {
            return this.geosetAnimation.isAlphaVariant(sequence);
        }

        return false;
    },

    calculateExtent() {
        const positions = this.locationArray;
        let minX = 1E9, minY = 1E9, minZ = 1E9, maxX = -1E9, maxY = -1E9, maxZ = -1E9;

        for (let i = 0, l = positions.length; i < l; i += 3) {
            let x = positions[i],
                y = positions[i + 1],
                z = positions[i + 2];

            if (x > maxX) {
                maxX = x;
            } else if (x < minX) {
                minX = x;
            }

            if (y > maxY) {
                maxY = y;
            } else if (y < minY) {
                minY = y;
            }

            if (z > maxZ) {
                maxZ = z;
            } else if (z < minZ) {
                minZ = z;
            }
        }

        let dX = maxX - minX,
            dY = maxY - minY,
            dZ = maxZ - minZ;

        this.extent = { radius: Math.sqrt(dX * dX + dY * dY + dZ * dZ) / 2, min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
    }
};
