Mdx.Model = function (arrayBuffer, id) {
    var i, l, elements;

    var parser = Mdx.Parser(new BinaryReader(arrayBuffer));
    var chunks = parser.chunks;
    var nodes = parser.nodes;

    // Geosets
    var geosets = [];
    elements = chunks.GEOS.elements;
    for (i = 0, l = elements.length; i < l; i++) {
        geosets[i] = new Mdx.Geoset(elements[i]);
    }
    this.geosets = geosets;

    // Nodes
    this.nodes = nodes;
    this.bones = chunks.BONE.elements;
    this.pivots = chunks.PIVT.elements;

    // Hierarchy
    this.hierarchy = [];
    this.initHierarchy(-1);

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

    post: function () {
        var i, l, elements;

        elements = this.geosets;
        for (i = 0, l = elements.length; i < l; i++) {
            elements[i].post(this.id);
        }
    }
};
