Mdx.Model = function (arrayBuffer, id) {
    var i, l, elements, j, k;

    var parser = Mdx.Parser(new BinaryReader(arrayBuffer));
    var chunks = parser.chunks;
    var nodes = parser.nodes;

    // Sequences
    this.sequences = chunks.SEQS.elements;

    // Nodes
    this.nodes = this.transformType(nodes, Mdx.Node);
    this.bones = chunks.BONE.elements;
    this.pivots = chunks.PIVT.elements;

    // Hierarchy
    this.hierarchy = [];
    this.initHierarchy(-1);

    // Materials
    var materials = [];
    var layers = [];
    var lays, layer;
    if (chunks.MTLS) {
        elements = chunks.MTLS.elements;

        for (i = 0, l = elements.length; i < l; i++) {
            lays = elements[i].layers;

            materials[i] = [];

            for (j = 0, k = lays.length; j < k; j++) {
                layer = new Mdx.Layer(lays[j], layers.length, this);

                materials[i][j] = layer;
                layers.push(layer);
            }
        }

        
    }
    this.materials = materials;
    this.layers = layers;

    // Geosets and batches
    var geosets = [];
    var batches;
    var geos, geoset;
    if (chunks.GEOS) {
        elements = chunks.GEOS.elements;
        groups = [[], [], [], []];

        for (i = 0, l = elements.length; i < l; i++) {
            geos = elements[i];
            lays = materials[geos.materialId];

            geoset = new Mdx.Geoset(geos);

            geosets.push(geoset);

            for (j = 0, k = lays.length; j < k; j++) {
                layer = lays[j];

                groups[layer.renderOrder].push([layer.index, i]);
            }
        }

        // Every batch contains the linkage between a geoset and its corresponding layer
        batches = groups[0].concat(groups[1]).concat(groups[2]).concat(groups[3]);
    }
    this.geosets = geosets;
    this.batches = batches;

    // Textures
    this.textures = this.transformTextures(chunks.TEXS.elements);

    //postMessage({ id: id, type: "debug", data: this.textures });

    this.id = id;
};

Mdx.Model.prototype = {
    initHierarchy: function (parent) {
        var nodes = this.nodes,
            hierarchy = this.hierarchy,
            node;

        for (var i = 0, l = nodes.length; i < l; i++) {
            node = nodes[i];

            if (node.parentId === parent) {
                hierarchy.push(i);

                this.initHierarchy(node.objectId);
            }
        }
    },

    transformType: function (elements, Func) {
        var output = [];

        for (var i = 0, l = elements.length; i < l; i++) {
            output[i] = new Func(elements[i], this);
        }

        return output;
    },

    replaceableTexture: function (id) {
        switch (id) {
            case 1: return "TeamColor/TeamColor00";
            case 2: return "TeamGlow/TeamGlow00";
            case 11: return "Cliff/Cliff0";
            //case 21: return ""; // UndeadCursor uses this, what is it?
            case 31: return "LordaeronTree/LordaeronSummerTree";
            case 32: return "AshenvaleTree/AshenTree";
            case 33: return "BarrensTree/BarrensTree";
            case 34: return "NorthrendTree/NorthTree";
            case 35: return "Mushroom/MushroomTree";
            case 36: return "RuinsTree/RuinsTree";
            case 37: return "OutlandMushroomTree/MushroomTree";
        };
    },

    transformTextures: function (elements) {
        var output = [],
            element,
            replaceableId,
            path;

        for (var i = 0, l = elements.length; i < l; i++) {
            element = elements[i];
            replaceableId = element.replaceableId;

            if (replaceableId > 0) {
                path = "ReplaceableTextures/" + this.replaceableTexture(replaceableId) + ".blp";
            } else {
                path = element.path;
            }

            output.push(path);
        }

        return output;
    },

    post: function () {
        var i, l, elements, element;

        globalMessage.id = this.id;

        globalMessage.type = WORKER_NEW_GEOSET;
        elements = this.geosets;
        for (i = 0, l = elements.length; i < l; i++) {
            element = elements[i];

            globalMessage.data = [element.locationArray, element.normalArray, element.uvsArray, element.boneIndexArray, element.boneNumberArray, element.faceArray, element.edgeArray, element.uvSetSize];
            postMessage(globalMessage, [globalMessage.data[0].buffer, globalMessage.data[1].buffer, globalMessage.data[2].buffer, globalMessage.data[3].buffer, globalMessage.data[4].buffer, globalMessage.data[5].buffer, globalMessage.data[6].buffer]);
        }

        globalMessage.type = WORKER_NEW_LAYER;
        elements = this.layers;
        for (i = 0, l = elements.length; i < l; i++) {
            element = elements[i];

            globalMessage.data = [element.filterMode, element.twoSided, element.noDepthTest, element.noDepthSet, element.textureId, element.coordId];
            postMessage(globalMessage);
        }

        globalMessage.type = WORKER_NEW_BATCHES;
        globalMessage.data = this.batches;
        postMessage(globalMessage);

        globalMessage.type = WORKER_NEW_TEXTURES;
        globalMessage.data = this.textures;
        postMessage(globalMessage);
    }
};
