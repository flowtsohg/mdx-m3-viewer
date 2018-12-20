
let sourceMapElement = document.getElementById('sourcemap');
let sourceViewElement = document.getElementById('sourceview');
let viewedElement = null;

function viewSource(element, src) {
    if (viewedElement !== element) {
        sourceViewElement.textContent = src;
        sourceViewElement.scrollTop = 0;

        if (viewedElement) {
            viewedElement.className = 'sourceMapName';
        }

        viewedElement = element;
        viewedElement.className = 'selectedSourceMapName'
    }
}

// Given a node, figure what name to give it based on the information in the model.
// I could parse the names in the source mapper itself, but it will be hacky and require more generic MDL parsing.
function getSourceMapNodeName(node) {
    let nodeName = node.name;
    let name = nodeName;

    if (node.index != undefined) {
        name += ` ${node.index}`;
    }

    if (node.objectName) {
        if (node.objectName.startsWith('ReplaceableId')) {
            name += ` - ${node.objectName}`;
        } else {
            name += ` - "${node.objectName}"`
        }
    }

    return name;

}

function handleSourceMapNode(stream, node) {
    let element = stream.add('sourceMapName', getSourceMapNodeName(node));
    element.addEventListener('click', (e) => viewSource(element, node.data));

    stream.br();

    for (let child of node.children) {
        stream.indent();

        handleSourceMapNode(stream, child);

        stream.unindent();
    }
}

function handleSourceMap(src) {
    let stream = new LogStream(document.createElement('div'));
    let nodes = ModelViewer.utils.mdlSourceMap(src);

    for (let node of nodes) {
        handleSourceMapNode(stream, node);
    }

    return stream.container;
}
