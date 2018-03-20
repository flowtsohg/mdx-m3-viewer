export class MdxShallowGeoset {
    /**
     * @param {MdxModel} model
     * @param {Array<number>} offsets
     * @param {number} uvSetSize
     * @param {Uint16Array} elements
     */
    constructor(model, offsets, uvSetSize, elements) {
        this.model = model;
        this.offsets = offsets;
        this.uvSetSize = uvSetSize;
        this.elements = elements;
    }

    bind(shader, coordId) {
        let gl = this.model.env.gl,
            offsets = this.offsets,
            attribs = shader.attribs;

        gl.vertexAttribPointer(attribs.get('a_position'), 3, gl.FLOAT, false, 12, offsets[0]);
        gl.vertexAttribPointer(attribs.get('a_normal'), 3, gl.FLOAT, false, 12, offsets[1]);
        gl.vertexAttribPointer(attribs.get('a_uv'), 2, gl.FLOAT, false, 8, offsets[2] + coordId * this.uvSetSize);
        gl.vertexAttribPointer(attribs.get('a_bones'), 4, gl.UNSIGNED_BYTE, false, 4, offsets[3]);
        gl.vertexAttribPointer(attribs.get('a_boneNumber'), 4, gl.UNSIGNED_BYTE, false, 4, offsets[4]);
    }

    render(instances) {
        let gl = this.model.env.gl;

        gl.extensions.instancedArrays.drawElementsInstancedANGLE(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, this.offsets[5], instances);
    }
};

export class MdxGeoset {
    /**
     * @param {MdxModel} model
     * @param {MdxParserGeoset} geoset
     */
    constructor(model, geoset, index) {
        let positions = geoset.vertices,
            normals = geoset.normals,
            textureCoordinateSets = geoset.textureCoordinateSets,
            uvsetSize = textureCoordinateSets[0].length,
            vertices = positions.length / 3,
            uvs,
            boneIndices = new Uint8Array(vertices * 4),
            boneNumbers = new Uint32Array(vertices),
            vertexGroups = geoset.vertexGroups,
            matrixGroups = geoset.matrixGroups,
            matrixIndices = geoset.matrixIndices,
            slices = [];

        // Make one typed array for the texture coordinates, in case there are multiple ones
        if (textureCoordinateSets.length > 1) {
            uvs = new Float32Array(textureCoordinateSets.length * uvsetSize);

            for (let i = 0, l = textureCoordinateSets.length; i < l; i++) {
                uvs.set(textureCoordinateSets[i], i * uvsetSize);
            }
        } else {
            uvs = textureCoordinateSets[0];
        }

        // Parse the bone indices by slicing the matrix groups
        for (let i = 0, l = matrixGroups.length, k = 0; i < l; i++) {
            slices.push(matrixIndices.subarray(k, k + matrixGroups[i]));
            k += matrixGroups[i];
        }

        // Construct the final bone arrays
        for (let i = 0; i < vertices; i++) {
            let slice = slices[vertexGroups[i]];

            // Somehow in some bad models a vertex group index refers to an invalid matrix group.
            // Such models are still loaded by the game.
            if (slice) {
                let bones = slices[vertexGroups[i]],
                    boneCount = Math.min(bones.length, 4); // The viewer supports up to 4 bones per vertex, the game handles any(?) amount.
                
                for (let j = 0; j < boneCount; j++) {
                    // 1 is added to every index for shader optimization (index 0 is a zero matrix)
                    boneIndices[i * 4 + j] = bones[j] + 1;
                }

                boneNumbers[i] = boneCount;
            }
        }

        this.index = index;
        this.materialId = geoset.materialId;
        this.locationArray = positions;
        this.normalArray = normals;
        this.uvsArray = uvs;
        this.boneIndexArray = boneIndices;
        this.boneNumberArray = boneNumbers;
        this.faceArray = geoset.faces;
        this.uvSetSize = uvsetSize * 4;

        let geosetAnimations = model.geosetAnimations;

        for (let i = 0, l = geosetAnimations.length; i < l; i++) {
            if (geosetAnimations[i].geosetId === index) {
                this.geosetAnimation = geosetAnimations[i];
            }
        }

        let variants = {
            alpha: [],
            color: []
        };

        let hasAnim = false;

        for (let i = 0, l = model.sequences.length; i < l; i++) {
            let alpha = this.isAlphaVariant(i),
                color = this.isColorVariant(i);

            if (alpha || color) {
                hasAnim = true;
            }

            variants.alpha[i] = alpha;
            variants.color[i] = color;
        }

        this.variants = variants;
        this.hasAnim = hasAnim;
    }

    getAlpha(instance) {
        let geosetAnimation = this.geosetAnimation;

        if (geosetAnimation) {
            return geosetAnimation.getAlpha(instance);
        }

        return 1;
    }

    isAlphaVariant(sequence) {
        let geosetAnimation = this.geosetAnimation;

        if (geosetAnimation) {
            return geosetAnimation.isAlphaVariant(sequence);
        }

        return false;
    }

    isColorVariant(sequence) {
        let geosetAnimation = this.geosetAnimation;

        if (geosetAnimation) {
            return geosetAnimation.isColorVariant(sequence);
        }

        return false;
    }

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
