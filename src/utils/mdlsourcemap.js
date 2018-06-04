import TokenStream from '../common/tokenstream';

// Names of chunk blocks.
let chunkNames = [
    'Version',
    'Model',
    'Sequences',
    'GlobalSequences',
    'Textures',
    'Materials',
    'TextureAnims',
    'PivotPoints',
];

// Names of object blocks.
let objectNames = [
    'Anim',
    'Bitmap',
    'Material',
    'Layer',
    'TVertexAnim',
    'Geoset',
    'GeosetAnim',
];

// Names of generic object blocks.
let genericObjectNames = [
    'Bone',
    'Light',
    'Helper',
    'Attachment',
    'ParticleEmitter',
    'ParticleEmitter2',
    'RibbonEmitter',
    'Camera',
    'EventObject',
    'CollisionShape',
];

/**
 * A MDL source mapper.
 */
class MdlSourceMapper {
    /**
     * @param {string} buffer
     */
    constructor(buffer) {
        let token;
        let stream = new TokenStream(buffer);

        this.stream = stream;
        this.rootNode = {children: []};
        this.stack = [this.rootNode];
        this.counts = {};
        this.ident = 0;
        this.searchBitmapName = false;

        // There are empty strings, e.g. in replaceable textures.
        // Empty strings evaluate to false in JS.
        // Therefore compare against undefined directly.
        while ((token = stream.read()) !== undefined) {
            if (token === '{') {
                this.ident += 1;
            } else if (token === '}') {
                this.ident -= 1;

                if (this.ident === this.stack[0].ident) {
                    this.endBlock();
                }
            } else if (this.searchBitmapName && (token === 'ReplaceableId' || token === 'Image')) {
                if (token === 'ReplaceableId') {
                    let replacebleId = stream.read();

                    if (replacebleId !== '0') {
                        this.lookingForAnimName = false;
                        this.stack[0].objectName = `ReplaceableId ${replacebleId}`;
                    }
                } else if (token === 'Image') {
                    let image = stream.read();

                    if (image !== '') {
                        this.lookingForAnimName = false;
                        this.stack[0].objectName = image.split('\\').slice(-1)[0]; // Discard the path leading to the file name itself.
                    }
                }
            } else if (this.isTokenBlock(token)) {
                this.startBlock(token);
            }
        }
    }

    /**
     * Test if a token starts a block.
     *
     * @param {string} name
     * @return {boolean}
     */
    isTokenBlock(name) {
        if (name === 'Anim') {
            // Geosets call their animated extents Anim too, so have to check if the parent is the sequences chunk.
            return this.stack[0].name === 'Sequences';
        }

        return chunkNames.includes(name) || objectNames.includes(name) || genericObjectNames.includes(name);
    }

    /**
     * Start a new block and add it to the stack.
     *
     * @param {string} name
     */
    startBlock(name) {
        let counts = this.counts;
        let countName = name;
        let stream = this.stream;
        let ident = this.ident;
        let start = stream.index - name.length - 1;
        let end = 0;
        let data = '';
        let node = {name, ident, start, end, data, children: []};

        // Don't index blocks, just objects.
        if (!chunkNames.includes(name)) {
            // Need to separate layer indices per material.
            if (name === 'Layer') {
                let material = this.stack[0];

                countName = `Material${material.index}${name}`; 
            }

            if (counts[countName] === undefined) {
                counts[countName] = 0;
            }

            let index = counts[countName]++;

            node.index = index;
        }

        // Texture names depend on the path or replaceable ID, both of which are not known.
        // Therefore, start looking for them.
        if (name === 'Bitmap') {
            this.searchBitmapName = true;
        }

        // Animations and generic objects store the name in the next token.
        if (name === 'Anim' || genericObjectNames.includes(name)) {
            node.objectName = stream.read();
        }

        this.stack[0].children.push(node);
        this.stack.unshift(node);
    }

    /**
     * And the current block on the stack.
     */
    endBlock() {
        let stream = this.stream;
        let node = this.stack[0];

        node.end = stream.index;
        node.data = stream.buffer.slice(node.start, node.end);

        this.stack.shift();
    }
}

/**
 * Generate a source map from MDL source.
 *
 * @param {string} buffer
 * @return {Object}
 */
export default function mdlSourceMap(buffer) {
    return new MdlSourceMapper(buffer).rootNode;
};
