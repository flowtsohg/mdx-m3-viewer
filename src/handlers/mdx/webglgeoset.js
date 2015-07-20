Mdx.WebGLGeoset = function (data, ctx) {
    var vertices = data[0],
        normals = data[1],
        uvSets = data[2],
        boneIndices = data[3],
        boneNumbers = data[4],
        faces = data[5],
        edges = data[6],
        uvSetSize = data[7];

    var normalsOffset = vertices.byteLength;
    var uvSetsOffset = normalsOffset + normals.byteLength;
    var boneIndicesOffset = uvSetsOffset + uvSets.byteLength;
    var boneNumbersOffset = boneIndicesOffset + boneIndices.byteLength;
    var bufferSize = boneNumbersOffset + boneNumbers.byteLength;

    var arrayBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ARRAY_BUFFER, arrayBuffer);
    ctx.bufferData(ctx.ARRAY_BUFFER, bufferSize, ctx.STATIC_DRAW);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, 0, vertices);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, normalsOffset, normals);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, uvSetsOffset, uvSets);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, boneIndicesOffset, boneIndices);
    ctx.bufferSubData(ctx.ARRAY_BUFFER, boneNumbersOffset, boneNumbers);

    var faceBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, faceBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, faces, ctx.STATIC_DRAW);

    var edgeBuffer = ctx.createBuffer();
    ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, edgeBuffer);
    ctx.bufferData(ctx.ELEMENT_ARRAY_BUFFER, edges, ctx.STATIC_DRAW);

    this.ctx = ctx;
    this.offsets = [0, normalsOffset, uvSetsOffset, boneIndicesOffset, boneNumbersOffset];
    this.arrayBuffer = arrayBuffer;
    this.faceBuffer = faceBuffer;
    this.edgeBuffer = edgeBuffer;
    this.uvSetSize = uvSetSize;
    this.elements = faces.length;
};

Mdx.WebGLGeoset.prototype = {
    bindCommon: function (shader) {
        var ctx = this.ctx;
        var offsets = this.offsets;

        ctx.bindBuffer(ctx.ARRAY_BUFFER, this.arrayBuffer);

        ctx.vertexAttribPointer(shader.variables.a_position, 3, ctx.FLOAT, false, 12, offsets[0]);
        ctx.vertexAttribPointer(shader.variables.a_bones, 4, ctx.UNSIGNED_BYTE, false, 4, offsets[3]);
        ctx.vertexAttribPointer(shader.variables.a_bone_number, 1, ctx.UNSIGNED_BYTE, false, 1, offsets[4]);
    },

    render: function (coordId, shader, polygonMode) {
        var ctx = this.ctx;
        var offsets = this.offsets;

        this.bindCommon(shader, ctx);

        //ctx.vertexAttribPointer(shader.variables.a_normal, 3, ctx.FLOAT, false, 12, offsets[1]);
        //ctx.vertexAttribPointer(shader.variables.a_uv, 2, ctx.FLOAT, false, 8, offsets[2] + coordId * this.uvSetSize);
        
        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
        ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, 0);
    },
    
    renderWireframe: function (shader) {
        var ctx = this.ctx;

        this.bindCommon(shader, ctx);

        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.edgeBuffer);
        ctx.drawElements(ctx.LINES, this.elements * 2, ctx.UNSIGNED_SHORT, 0);
    },

    renderColor: function (shader) {
        var ctx = this.ctx;

        this.bindCommon(shader, ctx);

        ctx.bindBuffer(ctx.ELEMENT_ARRAY_BUFFER, this.faceBuffer);
        ctx.drawElements(ctx.TRIANGLES, this.elements, ctx.UNSIGNED_SHORT, 0);
    }
};
