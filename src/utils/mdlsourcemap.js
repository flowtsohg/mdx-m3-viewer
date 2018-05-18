import TokenStream from '../common/tokenstream';

// Read until a token with the given name is read.
// Return the index of the stream at the start of this token.
function readUpTo(stream, name) {
    let index = stream.index,
        token = stream.read();

    while (token !== name && token !== undefined) {
        index = stream.index;
        token = stream.read();
    }

    return index;
}

// Step over a block.
// This skips over all internal blocks as well.
function stepOver(stream) {
    let indent = 0,
        token;

    while ((token = stream.read()) !== undefined) {
        if (token === '{') {
            indent += 1;
        } else if (token === '}') {
            indent -= 1;

            if (indent === 0) {
                return stream.index;
            }
        }
    }
}

// Get to the end of the current line.
function endOfLine(stream) {
    let index = stream.buffer.indexOf('\n', stream.index + 1);

    stream.index = index;

    return index;
}

// Add an entry to the source map.
// Every entry consistes of a start index, an end index, and the slice from the MDL source between these indices.
function addSourceMapEntry(sourceMap, name, stream, start, end) {
    sourceMap[name] = { start, end, data: stream.buffer.slice(start, end) };
}

// Reads a whole object block.
// Used for sequences, textures, and texture animations.
// blockName and objectName are used to recognize the objects in the MDL source.
// objectSourceMapName is the name given in the source map.
function mapObjectsBlock(sourceMap, stream, objects, blockName, objectName, objectSourceMapName) {
    if (objects.length) {
        let blockStart = readUpTo(stream, blockName);

        for (let i = 0, l = objects.length; i < l; i++) {
            addSourceMapEntry(sourceMap, `${objectSourceMapName}${i}`, stream, readUpTo(stream, objectName), stepOver(stream));
        }

        stream.read();
        addSourceMapEntry(sourceMap, `${objectSourceMapName}s`, stream, blockStart, stream.index);
    }
}

// Map a collection of generic objects, e.g. all bones.
function mapGenerics(sourceMap, stream, objects, name, sourceMapName) {
    for (let i = 0, l = objects.length; i < l; i++) {
        addSourceMapEntry(sourceMap, `${sourceMapName || name}${i}`, stream, readUpTo(stream, name), stepOver(stream));
    }
}

/**
 * Creates a simple source map for the MDL source resulting from saving the given model as MDL.
 * 
 * @param {ModelViewer.parsers.mdlx.Model} model 
 * @returns {Object}
 */
export default function mdlSourceMap(model) {
    let src = model.saveMdl(),
        stream = new TokenStream(src),
        sourceMap = {};

    // Version chunk.
    addSourceMapEntry(sourceMap, 'Version', stream, readUpTo(stream, 'Version'), stepOver(stream));

    // Model chunk.
    addSourceMapEntry(sourceMap, 'Model', stream, readUpTo(stream, 'Model'), stepOver(stream));

    // Sequence chunk.
    mapObjectsBlock(sourceMap, stream, model.sequences, 'Sequences', 'Anim', 'Sequence');

    // Global sequences.
    // Their handling is different like the rest of MDLX code, because they are numbers and not objects.
    if (model.globalSequences.length) {
        let globalSequencesStart = readUpTo(stream, 'GlobalSequences');

        for (let i = 0, l = model.globalSequences.length; i < l; i++) {
            addSourceMapEntry(sourceMap, `GlobalSequence${i}`, stream, readUpTo(stream, 'Duration'), endOfLine(stream));
        }

        stream.read();

        addSourceMapEntry(sourceMap, 'GlobalSequences', stream, globalSequencesStart, stream.index);
    }

    // Texture chunk.
    mapObjectsBlock(sourceMap, stream, model.textures, 'Textures', 'Bitmap', 'Texture');

    // Material chunk.
    if (model.materials.length) {
        let materialsStart = readUpTo(stream, 'Materials');

        // Material.
        for (let i = 0, l = model.materials.length; i < l; i++) {
            let materialStart = readUpTo(stream, 'Material');

            // Layers.
            for (let j = 0, k = model.materials[i].layers.length; j < k; j++) {
                addSourceMapEntry(sourceMap, `Material${i}Layer${j}`, stream, readUpTo(stream, 'Layer'), stepOver(stream));
            }

            stream.read();
            addSourceMapEntry(sourceMap, `Material${i}`, stream, materialStart, stream.index);
        }

        stream.read();
        addSourceMapEntry(sourceMap, 'Materials', stream, materialsStart, stream.index);
    }

    // Texture animations.
    mapObjectsBlock(sourceMap, stream, model.textureAnimations, 'TextureAnims', 'TVertexAnim', 'TextureAnimation');

    // And the rest is easy to see...
    mapGenerics(sourceMap, stream, model.geosets, 'Geoset');
    mapGenerics(sourceMap, stream, model.geosetAnimations, 'GeosetAnim', 'GeosetAnimation');
    mapGenerics(sourceMap, stream, model.bones, 'Bone');
    mapGenerics(sourceMap, stream, model.lights, 'Light');
    mapGenerics(sourceMap, stream, model.helpers, 'Helper');
    mapGenerics(sourceMap, stream, model.attachments, 'Attachment');

    if (model.pivotPoints.length) {
        addSourceMapEntry(sourceMap, 'PivotPoints', stream, readUpTo(stream, 'PivotPoints'), stepOver(stream));
    }

    mapGenerics(sourceMap, stream, model.particleEmitters, 'ParticleEmitter');
    mapGenerics(sourceMap, stream, model.particleEmitters2, 'ParticleEmitter2');
    mapGenerics(sourceMap, stream, model.ribbonEmitters, 'RibbonEmitter');
    mapGenerics(sourceMap, stream, model.cameras, 'Camera');
    mapGenerics(sourceMap, stream, model.eventObjects, 'EventObject');
    mapGenerics(sourceMap, stream, model.collisionShapes, 'CollisionShape');

    return sourceMap;
};
