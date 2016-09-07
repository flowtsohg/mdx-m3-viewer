function MdxShallowGeoset(offsets, uvSetSize, elements, model) {
    this.model = model;
    this.offsets = offsets;
    this.uvSetSize = uvSetSize;
    this.elements = elements;
}

MdxShallowGeoset.prototype = {
    bind(shader, coordId) {
        var gl = this.model.env.gl;
        var offsets = this.offsets;

        gl.vertexAttribPointer(shader.attribs.get("a_position"), 3, gl.FLOAT, false, 12, offsets[0]);
        gl.vertexAttribPointer(shader.attribs.get("a_bones"), 4, gl.UNSIGNED_BYTE, false, 4, offsets[3]);
        gl.vertexAttribPointer(shader.attribs.get("a_bone_number"), 4, gl.UNSIGNED_BYTE, false, 4, offsets[4]);

        if (shader.attribs.has("a_normal")) {
            gl.vertexAttribPointer(shader.attribs.get("a_normal"), 3, gl.FLOAT, false, 12, offsets[1]);
            gl.vertexAttribPointer(shader.attribs.get("a_uv"), 2, gl.FLOAT, false, 8, offsets[2] + coordId * this.uvSetSize);
        }
    },

    render(instances) {
        var webgl = this.model.env.webgl;
        var gl = this.model.env.gl;

        webgl.extensions.instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offsets[5], instances);
    },

    renderWireframe(shader) {
        var ctx = this.ctx;

        this.bindCommon(shader, ctx);

        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
        ctx.drawElements(ctx.LINES, this.elements * 2, ctx.UNSIGNED_SHORT, 0);
    }
};

MdxGeoset = function (geoset, geosetAnimations) {
    var i, l, j, k;
    var positions = geoset.vertices;
    var normals = geoset.normals;
    var textureCoordinateSets = geoset.textureCoordinateSets;
    var uvsetSize = textureCoordinateSets[0].length;
    var vertices = positions.length / 3;
    var uvs = new Float32Array(textureCoordinateSets.length * uvsetSize);
    var boneIndices = new Uint8Array(vertices * 4);
    var boneNumbers = new Uint32Array(vertices);
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

        // 1 is added to every index for shader optimization (index 0 is a zero matrix)
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

    for (i = 0, l = geosetAnimations.length; i < l; i++) {
        if (geosetAnimations[i].geosetId === geoset.index) {
            this.geosetAnimation = geosetAnimations[i];
            break;
        }
    }
};

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
            const x = positions[i];
                y = positions[i + 1];
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

        const dX = maxX - minX,
            dY = maxY - minY,
            dZ = maxZ - minZ;

        this.extent = { radius: Math.sqrt(dX * dX + dY * dY + dZ * dZ) / 2, min: [minX, minY, minZ], max: [maxX, maxY, maxZ] };
    }
};
